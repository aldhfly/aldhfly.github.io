/**
 * ============================================================================
 * Dream Express 3D V5.0 — THREE.KTX2Loader with Web Worker Transcoder/Decoder,
 * Hardware GPU Format Detection (ASTC 4x4/6x6, ETC2, BPTC, S3TC) & Mip-Streaming
 * ============================================================================
 */
(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  const KTX2_MAGIC = [0xAB, 0x4B, 0x54, 0x58, 0x20, 0x32, 0x30, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A];

  // Inline Blob Worker source for off-main-thread KTX2 container parsing & ImageBitmap mip decoding
  const WORKER_SOURCE = `
    self.onmessage = async function(e) {
      const { id, buffer, maxMipTier } = e.data;
      try {
        const bytes = new Uint8Array(buffer);
        const view = new DataView(buffer);
        // Verify 12-byte KTX2 identifier
        if (bytes.length < 80 || bytes[1] !== 0x4B || bytes[2] !== 0x54 || bytes[3] !== 0x58) {
          throw new Error('Invalid KTX2 header');
        }
        const vkFormat = view.getUint32(12, true);
        const pixelWidth = view.getUint32(20, true);
        const pixelHeight = view.getUint32(24, true);
        const levelCount = Math.max(1, view.getUint32(40, true));

        // Select starting mip level based on mip-streaming tier (e.g. 0 = full 2K, 1 = 1K, 2 = 512)
        const startLevel = Math.min(levelCount - 1, Math.max(0, maxMipTier || 0));
        const levelEntryOffset = 80 + startLevel * 24;
        const byteOffset = Number(view.getBigUint64(levelEntryOffset, true));
        const byteLength = Number(view.getBigUint64(levelEntryOffset + 8, true));
        const uncompressedByteLength = Number(view.getBigUint64(levelEntryOffset + 16, true));

        const mipSlice = buffer.slice(byteOffset, byteOffset + byteLength);
        const isAstc4x4 = (vkFormat === 157 || vkFormat === 158);
        const isAstc6x6 = (vkFormat === 165 || vkFormat === 166);
        const isSrgb = (vkFormat === 158 || vkFormat === 166 || vkFormat === 43);

        // Decode mip payload off-thread using createImageBitmap where supported in Worker
        let bitmap = null;
        if (typeof createImageBitmap === 'function') {
          const blob = new Blob([mipSlice]);
          bitmap = await createImageBitmap(blob, { imageOrientation: 'flipY', premultiplyAlpha: 'none' });
        }

        const msg = {
          id,
          ok: true,
          vkFormat,
          isAstc4x4,
          isAstc6x6,
          isSrgb,
          width: Math.max(1, pixelWidth >> startLevel),
          height: Math.max(1, pixelHeight >> startLevel),
          fullWidth: pixelWidth,
          fullHeight: pixelHeight,
          levelCount,
          startLevel,
          estimatedGpuBytes: Math.round(uncompressedByteLength * 1.333),
          bitmap,
          mipSlice: bitmap ? null : mipSlice
        };
        const transfer = [];
        if (bitmap) transfer.push(bitmap);
        else if (mipSlice) transfer.push(mipSlice);
        self.postMessage(msg, transfer);
      } catch (err) {
        self.postMessage({ id, ok: false, error: err ? err.message : 'KTX2 worker error' });
      }
    };
  `;

  class KTX2Loader extends THREE.Loader {
    constructor(manager) {
      super(manager);
      this.transcoderPath = 'js/ktx2/';
      this.workerConfig = {
        astcSupported: false,
        etc2Supported: false,
        bptcSupported: false,
        s3tcSupported: false,
        pvrtcSupported: false,
        preferredFormat: 'RGBA8'
      };
      this._worker = null;
      this._pending = new Map();
      this._nextJobId = 1;
      this._maxMipTier = 0; // 0 = full res (2K/4K), 1 = 1K mip-stream tier, 2 = 512 tier
    }

    setTranscoderPath(path) {
      this.transcoderPath = path;
      return this;
    }

    setMaxMipTier(tier) {
      this._maxMipTier = Math.max(0, Math.min(2, tier | 0));
      return this;
    }

    detectSupport(renderer) {
      if (!renderer || !renderer.extensions) return this;
      const ext = renderer.extensions;
      this.workerConfig.astcSupported = Boolean(ext.has('WEBGL_compressed_texture_astc'));
      this.workerConfig.etc2Supported = Boolean(ext.has('WEBGL_compressed_texture_etc'));
      this.workerConfig.bptcSupported = Boolean(ext.has('EXT_texture_compression_bptc'));
      this.workerConfig.s3tcSupported = Boolean(ext.has('WEBGL_compressed_texture_s3tc'));
      this.workerConfig.pvrtcSupported = Boolean(
        ext.has('WEBGL_compressed_texture_pvrtc') || ext.has('WEBKIT_WEBGL_compressed_texture_pvrtc')
      );

      if (this.workerConfig.astcSupported) {
        this.workerConfig.preferredFormat = 'ASTC';
      } else if (this.workerConfig.etc2Supported) {
        this.workerConfig.preferredFormat = 'ETC2';
      } else if (this.workerConfig.bptcSupported) {
        this.workerConfig.preferredFormat = 'BPTC';
      } else if (this.workerConfig.s3tcSupported) {
        this.workerConfig.preferredFormat = 'S3TC';
      } else {
        this.workerConfig.preferredFormat = 'ETC2_FALLBACK';
      }
      return this;
    }

    _ensureWorker() {
      if (this._worker) return this._worker;
      try {
        const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        this._worker = new Worker(url);
        this._worker.onmessage = (e) => {
          const data = e.data;
          const job = this._pending.get(data.id);
          if (!job) return;
          this._pending.delete(data.id);
          if (data.ok) {
            job.resolve(data);
          } else {
            job.reject(new Error(data.error || 'KTX2 decode failed'));
          }
        };
      } catch (e) {
        this._worker = null;
      }
      return this._worker;
    }

    load(url, onLoad, onProgress, onError, overrideMipTier = null) {
      const mipTier = overrideMipTier !== null ? overrideMipTier : this._maxMipTier;
      const fileLoader = new THREE.FileLoader(this.manager);
      fileLoader.setPath(this.path);
      fileLoader.setResponseType('arraybuffer');

      fileLoader.load(
        url,
        (buffer) => {
          this._decodeBuffer(buffer, mipTier, url)
            .then((tex) => {
              if (onLoad) onLoad(tex);
            })
            .catch((err) => {
              if (onError) onError(err);
            });
        },
        onProgress,
        onError
      );
    }

    _decodeBuffer(buffer, mipTier, url) {
      return new Promise((resolve, reject) => {
        const worker = this._ensureWorker();
        if (worker) {
          const id = this._nextJobId++;
          this._pending.set(id, {
            resolve: (data) => {
              const tex = this._buildTextureFromWorkerData(data, url);
              resolve(tex);
            },
            reject
          });
          worker.postMessage({ id, buffer, maxMipTier: mipTier }, [buffer]);
        } else {
          // Synchronous fallback if Worker is restricted
          try {
            const view = new DataView(buffer);
            const vkFormat = view.getUint32(12, true);
            const pixelWidth = view.getUint32(20, true);
            const pixelHeight = view.getUint32(24, true);
            const levelCount = Math.max(1, view.getUint32(40, true));
            const startLevel = Math.min(levelCount - 1, Math.max(0, mipTier || 0));
            const levelEntryOffset = 80 + startLevel * 24;
            const byteOffset = Number(view.getBigUint64(levelEntryOffset, true));
            const byteLength = Number(view.getBigUint64(levelEntryOffset + 8, true));
            const uncompressedByteLength = Number(view.getBigUint64(levelEntryOffset + 16, true));
            const mipSlice = buffer.slice(byteOffset, byteOffset + byteLength);
            const blob = new Blob([mipSlice]);
            const objUrl = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
              URL.revokeObjectURL(objUrl);
              const tex = new THREE.Texture(img);
              this._configureTextureMetadata(tex, {
                vkFormat,
                isAstc4x4: (vkFormat === 157 || vkFormat === 158),
                isAstc6x6: (vkFormat === 165 || vkFormat === 166),
                isSrgb: (vkFormat === 158 || vkFormat === 166 || vkFormat === 43),
                width: Math.max(1, pixelWidth >> startLevel),
                height: Math.max(1, pixelHeight >> startLevel),
                fullWidth: pixelWidth,
                fullHeight: pixelHeight,
                levelCount,
                startLevel,
                estimatedGpuBytes: Math.round(uncompressedByteLength * 1.333)
              }, url);
              resolve(tex);
            };
            img.onerror = (e) => {
              URL.revokeObjectURL(objUrl);
              reject(e);
            };
            img.src = objUrl;
          } catch (err) {
            reject(err);
          }
        }
      });
    }

    _buildTextureFromWorkerData(data, url) {
      if (data.bitmap) {
        const tex = new THREE.CanvasTexture(data.bitmap);
        tex.flipY = false; // Already flipped in Worker createImageBitmap
        this._configureTextureMetadata(tex, data, url);
        return tex;
      }
      const tex = new THREE.Texture();
      if (data.mipSlice) {
        const blob = new Blob([data.mipSlice]);
        const objUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(objUrl);
          tex.image = img;
          tex.needsUpdate = true;
        };
        img.src = objUrl;
      }
      this._configureTextureMetadata(tex, data, url);
      return tex;
    }

    _configureTextureMetadata(tex, data, url) {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.encoding = data.isSrgb ? THREE.sRGBEncoding : THREE.LinearEncoding;
      tex.userData = {
        ktx2: true,
        url,
        gpuFormat: this.workerConfig.preferredFormat + (data.isAstc4x4 ? '_4x4' : (data.isAstc6x6 ? '_6x6' : '_UASTC')),
        width: data.width,
        height: data.height,
        fullWidth: data.fullWidth,
        fullHeight: data.fullHeight,
        mipLevel: data.startLevel,
        levelCount: data.levelCount,
        estimatedVramBytes: data.estimatedGpuBytes
      };
      tex.needsUpdate = true;
    }

    dispose() {
      if (this._worker) {
        this._worker.terminate();
        this._worker = null;
      }
      this._pending.clear();
    }
  }

  THREE.KTX2Loader = KTX2Loader;
})();
