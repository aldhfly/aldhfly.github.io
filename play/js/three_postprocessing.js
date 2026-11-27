/**
 * Three.js r128 FullScreenQuad, Pass, EffectComposer, RenderPass, ShaderPass, CopyShader
 */
(function () {
  'use strict';
  if (typeof THREE === 'undefined') return;

  const CopyShader = {
    uniforms: {
      tDiffuse: { value: null },
      opacity: { value: 1.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      uniform float opacity;
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main() {
        vec4 texel = texture2D( tDiffuse, vUv );
        gl_FragColor = opacity * texel;
      }
    `
  };
  THREE.CopyShader = CopyShader;

  class Pass {
    constructor() {
      this.enabled = true;
      this.needsSwap = true;
      this.clear = false;
      this.renderToScreen = false;
    }
    setSize() {}
    render() {}
  }

  const _camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const _geometry = new THREE.BufferGeometry();
  _geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3));
  _geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));

  class FullScreenQuad {
    constructor(material) {
      this._mesh = new THREE.Mesh(_geometry, material);
    }
    dispose() {
      this._mesh.geometry.dispose();
    }
    render(renderer) {
      renderer.render(this._mesh, _camera);
    }
    get material() {
      return this._mesh.material;
    }
    set material(value) {
      this._mesh.material = value;
    }
  }

  Pass.FullScreenQuad = FullScreenQuad;
  THREE.Pass = Pass;
  THREE.FullScreenQuad = FullScreenQuad;
})();
