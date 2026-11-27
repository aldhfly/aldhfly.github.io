/**
 * ============================================================================
 * قطار الأحلام 3D — الإصدار V12.3 Master Studio (Dream Express 3D — V12.3)
 * js/audio.js — 9-Tier Real-Recorded Locomotive Acoustics (Flow + CC0/PD Mastered WAVs),
 * Drift-Free WebAudio Lookahead Scheduler, Dual-Train Spatial Audio & 10-Sector BGM
 * 100% Offline-Ready • 9 Unmistakably Distinct Train Profiles • Zero Voiceovers • Open Clarity
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_MUTE_KEY = 'dream_express_audio_muted_v1';
  const STORAGE_SFX_VOL_KEY = 'dream_express_sfx_vol_v12';
  const STORAGE_BGM_VOL_KEY = 'dream_express_bgm_vol_v12';
  const BGM_MAKEUP_GAIN = 1.75; // ~+4.86 dB makeup gain to balance against AdMob 0.38 ceiling

  const SAMPLE_MANIFEST = {
    // 1. classic_steam (1880 Coal & Heavy Steam)
    horn_1_classic_steam:      'assets/audio/horn_1_classic_steam.wav?v=12.3',
    loop_1_classic_steam:      'assets/audio/loop_1_classic_steam.wav?v=12.3',
    chuff_1_heavy_1:           'assets/audio/chuff_1_heavy_1.wav?v=12.3',
    chuff_1_heavy_2:           'assets/audio/chuff_1_heavy_2.wav?v=12.3',
    chuff_1_heavy_3:           'assets/audio/chuff_1_heavy_3.wav?v=12.3',
    chuff_1_heavy_4:           'assets/audio/chuff_1_heavy_4.wav?v=12.3',
    // 2. orient_express (Royal Palace Vintage Luxury Steam)
    horn_2_orient_royal:       'assets/audio/horn_2_orient_royal.wav?v=12.3',
    bell_royal_brass:          'assets/audio/bell_royal_brass.wav?v=12.3',
    loop_2_orient_steam:       'assets/audio/loop_2_orient_steam.wav?v=12.3',
    chuff_2_royal_1:           'assets/audio/chuff_2_royal_1.wav?v=12.3',
    chuff_2_royal_2:           'assets/audio/chuff_2_royal_2.wav?v=12.3',
    chuff_2_royal_3:           'assets/audio/chuff_2_royal_3.wav?v=12.3',
    chuff_2_royal_4:           'assets/audio/chuff_2_royal_4.wav?v=12.3',
    // 3. crimson (Crimson Vanguard Heavy V16 Freight Diesel)
    horn_3_crimson_freight:    'assets/audio/horn_3_crimson_freight.wav?v=12.3',
    loop_3_crimson_v16:        'assets/audio/loop_3_crimson_v16.wav?v=12.3',
    // 4. spring (Emerald Storm Medium Turbo-Diesel Interceptor — Hi-Lo Two-Tone Horn + Turbo Spool)
    horn_4_spring_hilo:        'assets/audio/horn_4_spring_hilo.wav?v=12.3',
    spool_4_spring_turbo:      'assets/audio/spool_4_spring_turbo.wav?v=12.3',
    loop_4_spring_turbodiesel: 'assets/audio/loop_4_spring_turbodiesel.wav?v=12.3',
    // 5. tgv_france (Azure Arrow High-Speed Electric Duplex)
    horn_5_tgv_duplex:         'assets/audio/horn_5_tgv_duplex.wav?v=12.3',
    sweep_5_tgv_accel:         'assets/audio/sweep_5_tgv_accel.wav?v=12.3',
    loop_5_tgv_traction:       'assets/audio/loop_5_tgv_traction.wav?v=12.3',
    // 6. bullet_shinkansen (Silver Falcon Aerodynamic Bullet Train + Station Melody Chime)
    horn_6_shinkansen_bullet:  'assets/audio/horn_6_shinkansen_bullet.wav?v=12.3',
    chime_6_shinkansen_melody: 'assets/audio/chime_6_shinkansen_melody.wav?v=12.3',
    loop_6_shinkansen_vvvf:    'assets/audio/loop_6_shinkansen_vvvf.wav?v=12.3',
    whoosh_sleeper_pass:       'assets/audio/whoosh_sleeper_pass.wav?v=12.3',
    // 7. haramain_express (Emerald Oasis Desert High-Speed Express + Departure Chime)
    horn_7_haramain_oasis:     'assets/audio/horn_7_haramain_oasis.wav?v=12.3',
    chime_7_haramain_depart:   'assets/audio/chime_7_haramain_depart.wav?v=12.3',
    loop_7_haramain_cwr:       'assets/audio/loop_7_haramain_cwr.wav?v=12.3',
    // 8. maglev_600 (600 km/h Magnetic Levitation)
    horn_8_maglev_harmonic:    'assets/audio/horn_8_maglev_harmonic.wav?v=12.3',
    loop_8_maglev_coil:        'assets/audio/loop_8_maglev_coil.wav?v=12.3',
    // 9. gold_vip (Imperial Plasma Reactor Flagship)
    horn_9_gold_imperial:      'assets/audio/horn_9_gold_imperial.wav?v=12.3',
    loop_9_gold_plasma:        'assets/audio/loop_9_gold_plasma.wav?v=12.3',
    // Shared Clean Physical Track & Braking Foley (Zero Broadband Static)
    clack_heavy_joint:         'assets/audio/clack_heavy_joint.wav?v=12.3',
    clack_pullman_bogie:       'assets/audio/clack_pullman_bogie.wav?v=12.3',
    whoosh_welded_rail:        'assets/audio/whoosh_welded_rail.wav?v=12.3',
    brake_steam_valve:         'assets/audio/brake_steam_valve.wav?v=12.3',
    brake_westinghouse_air:    'assets/audio/brake_westinghouse_air.wav?v=12.3',
    brake_maglev_downsweep:    'assets/audio/brake_maglev_downsweep.wav?v=12.3'
  };

  /**
   * 9 Dedicated Open-Clarity Acoustic Profiles (Natural 40Hz–5.5kHz Spectrum, 1.15–1.45 stepSpan)
   */
  const LOCO_ACOUSTIC_PROFILES = {
    classic_steam: {
      id: 'classic_steam',
      era: 'steam',
      hornKey: 'horn_1_classic_steam',
      departureExtraKey: null,
      departureExtraDelay: 0,
      departureExtraGain: 0,
      loopKey: 'loop_1_classic_steam',
      chuffPrefix: 'chuff_1_heavy',
      clackKey: 'clack_heavy_joint',
      brakeKey: 'brake_steam_valve',
      hornGain: 0.44,
      loopBaseGain: 0.24,
      loopMaxGain: 0.38,
      rateBase: 0.90,
      rateSlope: 0.22,
      stepSpan: 1.18,
      stepGain: 0.34,
      flangeScale: 0.0
    },
    orient_express: {
      id: 'orient_express',
      era: 'steam',
      hornKey: 'horn_2_orient_royal',
      departureExtraKey: 'bell_royal_brass',
      departureExtraDelay: 0.16,
      departureExtraGain: 0.34,
      loopKey: 'loop_2_orient_steam',
      chuffPrefix: 'chuff_2_royal',
      clackKey: 'clack_pullman_bogie',
      brakeKey: 'brake_steam_valve',
      hornGain: 0.44,
      loopBaseGain: 0.24,
      loopMaxGain: 0.38,
      rateBase: 0.94,
      rateSlope: 0.24,
      stepSpan: 1.15,
      stepGain: 0.32,
      flangeScale: 0.0
    },
    crimson: {
      id: 'crimson',
      era: 'diesel',
      hornKey: 'horn_3_crimson_freight',
      departureExtraKey: null,
      departureExtraDelay: 0,
      departureExtraGain: 0,
      loopKey: 'loop_3_crimson_v16',
      chuffPrefix: null,
      clackKey: 'clack_heavy_joint',
      brakeKey: 'brake_westinghouse_air',
      hornGain: 0.45,
      loopBaseGain: 0.26,
      loopMaxGain: 0.40,
      rateBase: 0.90,
      rateSlope: 0.24,
      stepSpan: 1.28,
      stepGain: 0.33,
      flangeScale: 0.0
    },
    spring: {
      id: 'spring',
      era: 'diesel',
      hornKey: 'horn_4_spring_hilo',
      departureExtraKey: 'spool_4_spring_turbo',
      departureExtraDelay: 0.14,
      departureExtraGain: 0.30,
      loopKey: 'loop_4_spring_turbodiesel',
      chuffPrefix: null,
      clackKey: 'clack_pullman_bogie',
      brakeKey: 'brake_westinghouse_air',
      hornGain: 0.43,
      loopBaseGain: 0.25,
      loopMaxGain: 0.38,
      rateBase: 0.92,
      rateSlope: 0.26,
      stepSpan: 1.22,
      stepGain: 0.31,
      flangeScale: 0.0
    },
    tgv_france: {
      id: 'tgv_france',
      era: 'modern',
      hornKey: 'horn_5_tgv_duplex',
      departureExtraKey: 'sweep_5_tgv_accel',
      departureExtraDelay: 0.12,
      departureExtraGain: 0.34,
      loopKey: 'loop_5_tgv_traction',
      chuffPrefix: null,
      clackKey: 'whoosh_welded_rail',
      brakeKey: 'brake_westinghouse_air',
      hornGain: 0.43,
      loopBaseGain: 0.24,
      loopMaxGain: 0.38,
      rateBase: 0.90,
      rateSlope: 0.28,
      stepSpan: 1.38,
      stepGain: 0.30,
      flangeScale: 0.0
    },
    bullet_shinkansen: {
      id: 'bullet_shinkansen',
      era: 'modern',
      hornKey: 'horn_6_shinkansen_bullet',
      departureExtraKey: 'chime_6_shinkansen_melody',
      departureExtraDelay: 0.16,
      departureExtraGain: 0.34,
      loopKey: 'loop_6_shinkansen_vvvf',
      chuffPrefix: null,
      clackKey: 'whoosh_sleeper_pass',
      brakeKey: 'brake_westinghouse_air',
      hornGain: 0.43,
      loopBaseGain: 0.24,
      loopMaxGain: 0.38,
      rateBase: 0.92,
      rateSlope: 0.28,
      stepSpan: 1.32,
      stepGain: 0.30,
      flangeScale: 0.0
    },
    haramain_express: {
      id: 'haramain_express',
      era: 'modern',
      hornKey: 'horn_7_haramain_oasis',
      departureExtraKey: 'chime_7_haramain_depart',
      departureExtraDelay: 0.16,
      departureExtraGain: 0.34,
      loopKey: 'loop_7_haramain_cwr',
      chuffPrefix: null,
      clackKey: 'whoosh_welded_rail',
      brakeKey: 'brake_westinghouse_air',
      hornGain: 0.43,
      loopBaseGain: 0.25,
      loopMaxGain: 0.39,
      rateBase: 0.90,
      rateSlope: 0.26,
      stepSpan: 1.42,
      stepGain: 0.29,
      flangeScale: 0.0
    },
    maglev_600: {
      id: 'maglev_600',
      era: 'maglev',
      hornKey: 'horn_8_maglev_harmonic',
      departureExtraKey: null,
      departureExtraDelay: 0,
      departureExtraGain: 0,
      loopKey: 'loop_8_maglev_coil',
      chuffPrefix: null,
      clackKey: null,
      brakeKey: 'brake_maglev_downsweep',
      hornGain: 0.44,
      loopBaseGain: 0.25,
      loopMaxGain: 0.40,
      rateBase: 0.92,
      rateSlope: 0.28,
      stepSpan: 999,
      stepGain: 0.0,
      flangeScale: 0.0
    },
    gold_vip: {
      id: 'gold_vip',
      era: 'maglev',
      hornKey: 'horn_9_gold_imperial',
      departureExtraKey: null,
      departureExtraDelay: 0,
      departureExtraGain: 0,
      loopKey: 'loop_9_gold_plasma',
      chuffPrefix: null,
      clackKey: null,
      brakeKey: 'brake_maglev_downsweep',
      hornGain: 0.46,
      loopBaseGain: 0.26,
      loopMaxGain: 0.42,
      rateBase: 0.90,
      rateSlope: 0.28,
      stepSpan: 999,
      stepGain: 0.0,
      flangeScale: 0.0
    }
  };

  class DreamAudioEngineV11 {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.masterVolume = 1.00;
      this.sfxVolume = 1.00;
      this.bgmVolume = 0.42;
      this.masterGain = null;
      this.sfxBus = null;
      this.masterHighPass = null;
      this.compressor = null;
      this.safetyLimiter = null;
      this.masterAnalyser = null;
      this.reverbNode = null;
      this.reverbSend = null;
      this.pinkBuffer = null;
      this.brownBuffer = null;

      // Drift-Free WebAudio Lookahead Scheduler State
      this.scheduleAheadTime = 0.18; // seconds
      this.lookaheadMs = 40;         // milliseconds
      this.bgmTimer = null;
      this.birdTimer = null;
      this.bgmStep = 0;
      this.nextNoteTime = 0;
      this.bgmBus = null;
      this.bgmWarmthShelf = null;
      this.bgmMidDuckFilter = null;
      this.bgmReverbSend = null;
      this.bgmSessionId = 0;
      this.adPaused = false;

      // Musical Progression & Gameplay Context
      this.currentSector = 'menu';
      this.currentLevelId = 1;
      this.sectorIndexIn10 = 0;      // 0..9 within current sector
      this.progressionTier = 0;      // 0: Early (#1-3), 1: Mid (#4-9), 2: Boss (#10)
      this.isTrainDispatched = false;
      this.isPreviewPlaying = false;
      this.previewNodes = null;
      this.previewTimers = [];
      this.previewActiveSources = new Set();
      this.activeSkinId = 'crimson';

      // Continuous Biome Ambience & 3D Spatial Dual-Train Loop Nodes (Zero Continuous Noise Floor!)
      this.ambienceNodes = null;
      this.trainLoops = { 1: null, 2: null };
      this.trainLoop = null;
      this.lastFlangeTime = 0;
      this.lastRailJointDist = 0;
      this.lastRailJointDistByTrain = { 1: 0, 2: 0 };
      this.lastClackTimestamp = 0;
      this.lastClackTimestampByTrain = { 1: 0, 2: 0 };
      this._lastSpatialParamTimeByTrain = { 1: 0, 2: 0 };
      this._brakeSoundPlayedByTrain = { 1: false, 2: false };
      this.clacksEmittedCount = 0;
      this.chuffCount = 0;
      this.chuffCountByTrain = { 1: 0, 2: 0 };
      this.sampleBank = {};
      this.samplesRequested = false;
      this.samplesLoadedCount = 0;
      this.samplesTotalCount = Object.keys(SAMPLE_MANIFEST).length;
      this._samplesReadyPromise = null;
      this._audioUnlocked = false;

      try {
        const saved = localStorage.getItem(STORAGE_MUTE_KEY);
        if (saved === 'true') this.muted = true;
        const savedSfx = parseFloat(localStorage.getItem(STORAGE_SFX_VOL_KEY));
        if (!Number.isNaN(savedSfx)) this.sfxVolume = Math.max(0, Math.min(1, savedSfx));
        const savedBgm = parseFloat(localStorage.getItem(STORAGE_BGM_VOL_KEY));
        if (!Number.isNaN(savedBgm)) this.bgmVolume = Math.max(0, Math.min(1, savedBgm));
      } catch (_) {}

      this.bindLifecycleEvents();
      this.bindGlobalCaptureUnlock();
      this.syncNativeAdAudio();
      // Eagerly pre-fetch & pre-decode 100% of WAV samples during boot loader BEFORE Level 1 starts!
      if (typeof window !== 'undefined' && window.__HEADLESS_CI_TEST !== true) {
        setTimeout(() => {
          try { this.preloadSampleBank(); } catch (_) {}
        }, 10);
      }
    }

    get isMuted() {
      return Boolean(this.muted);
    }

    set isMuted(val) {
      this.muted = Boolean(val);
    }

    init() {
      this.syncNativeAdAudio();
      return this;
    }

    createAudioContext(AudioCtx) {
      if (!AudioCtx) return null;
      try {
        return new AudioCtx({ latencyHint: 'playback' });
      } catch (_) {
        return new AudioCtx();
      }
    }

    safeDisconnect(node) {
      if (!node) return;
      try {
        if (typeof node.disconnect === 'function') {
          node.disconnect();
        }
      } catch (_) {}
    }

    safeStopNode(node, when = undefined) {
      if (!node || typeof node.stop !== 'function') return;
      try {
        if (typeof when === 'number') node.stop(when);
        else node.stop();
      } catch (_) {
        try { node.stop(); } catch (__) {}
      }
    }

    syncNativeAdAudio() {
      const effectiveVolume = this.muted
        ? 0
        : Math.max(0, Math.min(1, Math.max(this.sfxVolume, this.bgmVolume) * (this.masterVolume ?? 1.0)));
      try {
        if (typeof window !== 'undefined' && window.AndroidAdMob && typeof window.AndroidAdMob.syncAdAudio === 'function') {
          window.AndroidAdMob.syncAdAudio(Boolean(this.muted), effectiveVolume);
          return true;
        }
      } catch (_) {}
      return false;
    }

    getLocomotiveProfile(skinId) {
      const id = String(skinId || this.activeSkinId || 'crimson');
      return LOCO_ACOUSTIC_PROFILES[id] || LOCO_ACOUSTIC_PROFILES.crimson;
    }

    getAllLocomotiveProfiles() {
      return LOCO_ACOUSTIC_PROFILES;
    }

    classifyLocomotiveEra(skinId) {
      return this.getLocomotiveProfile(skinId).era;
    }

    bindLifecycleEvents() {
      try {
        if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
          document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.pauseForBackground();
            else this.resumeFromBackground();
          });
        }
        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
          window.addEventListener('pagehide', () => this.pauseForBackground());
          window.addEventListener('blur', () => this.pauseForBackground());
          window.addEventListener('pageshow', () => {
            if (typeof document === 'undefined' || !document.hidden) this.resumeFromBackground();
          });
          window.addEventListener('focus', () => {
            if (typeof document === 'undefined' || !document.hidden) this.resumeFromBackground();
          });
        }
      } catch (_) {}
    }

    resolveActiveSectorOrMenu() {
      try {
        if (typeof document !== 'undefined') {
          const shell = document.getElementById('app-shell');
          const scr = shell ? shell.getAttribute('data-active-screen') : null;
          if (scr && scr !== 'screen-game') return 'menu';
          if (scr === 'screen-game') {
            return (typeof this.currentSector === 'number' && this.currentSector >= 1 && this.currentSector <= 10)
              ? this.currentSector
              : 1;
          }
        }
      } catch (_) {}
      return this.currentSector || 'menu';
    }

    pauseForBackground() {
      this.stopBGM();
      this.stopTrainEngineLoop();
      this.stopLocomotivePreview();
      if (this.ctx && this.ctx.state === 'running' && typeof this.ctx.suspend === 'function') {
        this.ctx.suspend().catch(() => {});
      }
    }

    resumeFromBackground() {
      if (this.muted || this.adPaused) return;
      if (this.ctx && this.ctx.state !== 'running' && this.ctx.state !== 'closed' && typeof this.ctx.resume === 'function') {
        this.ctx.resume().catch(() => {});
      }
      this.startBGM(this.resolveActiveSectorOrMenu(), this.currentLevelId);
    }

    pauseForAd() {
      this.adPaused = true;
      this.stopBGM();
      this.stopTrainEngineLoop();
      this.stopLocomotivePreview();
      if (this.ctx && this.ctx.state === 'running' && typeof this.ctx.suspend === 'function') {
        this.ctx.suspend().catch(() => {});
      }
    }

    resumeAfterAd() {
      this.adPaused = false;
      if (this.muted) return;
      if (this.ctx && this.ctx.state !== 'running' && this.ctx.state !== 'closed' && typeof this.ctx.resume === 'function') {
        this.ctx.resume().catch(() => {});
      }
      this.startBGM(this.resolveActiveSectorOrMenu(), this.currentLevelId);
    }

    setLocomotiveSkin(skinId) {
      this.activeSkinId = skinId || 'crimson';
    }

    setLevelProgression(levelId) {
      const n = Math.max(1, Math.min(100, Number(levelId) || 1));
      this.currentLevelId = n;
      this.sectorIndexIn10 = (n - 1) % 10;
      if (this.sectorIndexIn10 === 9) {
        this.progressionTier = 2; // Boss mission (#10, #20, ..., #100)
      } else if (this.sectorIndexIn10 >= 3) {
        this.progressionTier = 1; // Mid-sector missions (#4..#9)
      } else {
        this.progressionTier = 0; // Early-sector missions (#1..#3)
      }
    }

    bindGlobalCaptureUnlock() {
      if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
      if (window.__HEADLESS_CI_TEST === true) return;

      const unlockNow = () => {
        if (this.muted || this.adPaused) return;
        const ctx = this.ensureContext();
        if (!ctx) return;
        if (ctx.state !== 'running' && ctx.state !== 'closed' && typeof ctx.resume === 'function') {
          ctx.resume().catch(() => {});
        }
        if (!this._audioUnlocked) {
          this._audioUnlocked = true;
          try {
            const silent = ctx.createBuffer(1, 1, ctx.sampleRate || 24000);
            const src = ctx.createBufferSource();
            src.buffer = silent;
            src.connect(ctx.destination);
            src.onended = () => this.safeDisconnect(src);
            src.start(0);
          } catch (_) {}
        }
      };

      const opts = { capture: true, passive: true };
      window.addEventListener('pointerdown', unlockNow, opts);
      window.addEventListener('touchstart', unlockNow, opts);
      window.addEventListener('mousedown', unlockNow, opts);
      window.addEventListener('click', unlockNow, opts);
      window.addEventListener('keydown', unlockNow, opts);
    }

    onNativeAppPause() {
      this.pauseForBackground();
    }

    onNativeAppResume() {
      this.resumeFromBackground();
    }

    setMasterVolume(val) {
      const clamped = Math.max(0, Math.min(1, Number(val)));
      if (Number.isNaN(clamped)) return this.masterVolume;
      this.masterVolume = clamped;
      if (this.ctx && this.masterGain) {
        try { this.masterGain.gain.setTargetAtTime(0.96 * this.masterVolume, this.ctx.currentTime, 0.04); } catch (_) {}
      }
      this.syncNativeAdAudio();
      return this.masterVolume;
    }

    setSfxVolume(val) {
      const clamped = Math.max(0, Math.min(1, Number(val)));
      if (Number.isNaN(clamped)) return this.sfxVolume;
      this.sfxVolume = clamped;
      try { localStorage.setItem(STORAGE_SFX_VOL_KEY, this.sfxVolume.toFixed(2)); } catch (_) {}
      if (this.ctx && this.sfxBus) {
        try { this.sfxBus.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.04); } catch (_) {}
      }
      this.syncNativeAdAudio();
      return this.sfxVolume;
    }

    setBgmVolume(val) {
      const clamped = Math.max(0, Math.min(1, Number(val)));
      if (Number.isNaN(clamped)) return this.bgmVolume;
      this.bgmVolume = clamped;
      try { localStorage.setItem(STORAGE_BGM_VOL_KEY, this.bgmVolume.toFixed(2)); } catch (_) {}
      this.applyBgmDuckingAndVolume();
      this.syncNativeAdAudio();
      return this.bgmVolume;
    }

    applyBgmDuckingAndVolume() {
      if (!this.ctx || !this.bgmBus) return;
      try {
        const now = this.ctx.currentTime;
        const duckActive = Boolean(this.isTrainDispatched || this.isPreviewPlaying);
        if (this.bgmWarmthShelf) {
          this.bgmWarmthShelf.gain.setTargetAtTime(duckActive ? 0.8 : 0.0, now, 0.16);
        }
        if (this.bgmMidDuckFilter) {
          this.bgmMidDuckFilter.gain.setTargetAtTime(duckActive ? -7.5 : 0.0, now, 0.12);
        }
        const targetBgm = Math.max(0, this.bgmVolume * BGM_MAKEUP_GAIN * (duckActive ? 0.501 : 1.00));
        this.bgmBus.gain.setTargetAtTime(targetBgm, now, 0.14);
      } catch (_) {}
    }

    /**
     * Smoothly ducks BGM by -6 dB (50.1% of bgmVolume) and scoops -7.5dB @ 1050Hz during Train Dispatch
     * so all 9 real locomotive engines, whistles, and rail foley are front-and-center!
     */
    setTrainDispatchState(isDispatched) {
      this.isTrainDispatched = Boolean(isDispatched);
      this.applyBgmDuckingAndVolume();
    }

    triggerHaptic(pattern = 12) {
      if (this.muted) return;
      try {
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          navigator.vibrate(pattern);
        }
      } catch (_) {}
    }

    ensureContext() {
      if (this.muted || this.adPaused) return null;
      const AudioCtx = (typeof window !== 'undefined') && (window.AudioContext || window.webkitAudioContext);
      if (!AudioCtx) return null;

      if (!this.ctx) {
        this.ctx = this.createAudioContext(AudioCtx);
        if (!this.ctx) return null;
        this.initMasteringAndBuffers(this.ctx);
        this.preloadSampleBank(this.ctx);
      }
      if (this.ctx.state !== 'running' && this.ctx.state !== 'closed' && typeof this.ctx.resume === 'function') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    fetchBinaryResilient(url) {
      return new Promise((resolve, reject) => {
        const tryXhr = () => {
          try {
            if (typeof XMLHttpRequest === 'undefined') {
              reject(new Error('No XHR'));
              return;
            }
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = () => {
              if ((xhr.status === 200 || xhr.status === 0) && xhr.response && xhr.response.byteLength > 44) {
                resolve(xhr.response);
              } else {
                reject(new Error('XHR status ' + xhr.status));
              }
            };
            xhr.onerror = () => reject(new Error('XHR network error'));
            xhr.send();
          } catch (err) {
            reject(err);
          }
        };

        const isFileProtocol = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');
        if (isFileProtocol || typeof fetch !== 'function') {
          tryXhr();
          return;
        }

        fetch(url)
          .then((r) => {
            if (r.ok || r.status === 0) return r.arrayBuffer();
            throw new Error('Fetch status ' + r.status);
          })
          .then((ab) => {
            if (ab && ab.byteLength > 44) resolve(ab);
            else tryXhr();
          })
          .catch(() => tryXhr());
      });
    }

    preloadSampleBank(ctxOverride = null) {
      if (typeof window !== 'undefined' && window.__HEADLESS_CI_TEST === true) {
        return Promise.resolve(this.sampleBank);
      }
      if (this._samplesReadyPromise) return this._samplesReadyPromise;

      let ctx = ctxOverride || this.ctx;
      if (!ctx) {
        const AudioCtx = (typeof window !== 'undefined') && (window.AudioContext || window.webkitAudioContext);
        if (!AudioCtx) return Promise.resolve(this.sampleBank);
        this.ctx = this.createAudioContext(AudioCtx);
        if (!this.ctx) return Promise.resolve(this.sampleBank);
        this.initMasteringAndBuffers(this.ctx);
        ctx = this.ctx;
      }

      this.samplesRequested = true;
      const keys = Object.keys(SAMPLE_MANIFEST);
      this.samplesTotalCount = keys.length;

      const tasks = keys.map((key) =>
        this.fetchBinaryResilient(SAMPLE_MANIFEST[key])
          .then((ab) => new Promise((res, rej) => {
            try {
              const p = ctx.decodeAudioData(ab.slice(0), res, rej);
              if (p && typeof p.then === 'function') p.catch(rej);
            } catch (e) {
              rej(e);
            }
          }))
          .then((audioBuf) => {
            if (audioBuf) {
              this.sampleBank[key] = audioBuf;
              this.samplesLoadedCount += 1;
              // Hot-upgrade active continuous train engine loop if its dedicated real sample buffer just arrived
              [1, 2].forEach((idx) => {
                const tl = this.trainLoops && this.trainLoops[idx];
                if (tl && !tl.usingSample && this.ctx && this.ctx.state === 'running') {
                  const prof = this.getLocomotiveProfile(tl.skinId);
                  if (prof && key === prof.loopKey) {
                    this.stopTrainEngineLoop(idx);
                  }
                }
              });
            }
          })
          .catch(() => {})
      );

      this._samplesReadyPromise = Promise.all(tasks).then(() => this.sampleBank);
      return this._samplesReadyPromise;
    }

    whenSamplesReady() {
      return this.preloadSampleBank(this.ctx);
    }

    playSample(key, { x = 0, gain = 0.24, rate = 1.0, reverb = false, delay = 0, filterHz = 0, maxDuration = 0, trackPreview = false } = {}) {
      const ctx = this.ensureContext();
      if (!ctx || !this.sampleBank || !this.sampleBank[key]) return false;
      try {
        const now = ctx.currentTime + delay;
        const src = ctx.createBufferSource();
        src.buffer = this.sampleBank[key];
        src.playbackRate.setValueAtTime(Math.max(0.55, Math.min(2.0, rate)), now);
        const g = ctx.createGain();
        g.gain.setValueAtTime(gain, now);
        if (maxDuration > 0.06) {
          const fadeStart = now + Math.max(0.04, maxDuration - 0.06);
          g.gain.setValueAtTime(gain, fadeStart);
          g.gain.exponentialRampToValueAtTime(0.0001, now + maxDuration);
        }
        const out = this.createSpatialNode(ctx, x, 0.15, 0, null, reverb ? this.reverbSend : null);
        const transientNodes = [src, g];
        if (out && out !== this.sfxBus && out !== this.masterGain && out !== ctx.destination) {
          transientNodes.push(out);
        }
        if (filterHz > 0) {
          const lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.setValueAtTime(filterHz, now);
          src.connect(lp);
          lp.connect(g);
          transientNodes.push(lp);
        } else {
          src.connect(g);
        }
        g.connect(out);
        let voiceEntry = null;
        if (trackPreview) {
          if (!this.previewActiveSources) this.previewActiveSources = new Set();
          voiceEntry = { src, gain: g, nodes: transientNodes, startTime: now };
          this.previewActiveSources.add(voiceEntry);
        }
        src.onended = () => {
          transientNodes.forEach((n) => this.safeDisconnect(n));
          if (voiceEntry && this.previewActiveSources) {
            this.previewActiveSources.delete(voiceEntry);
          }
        };
        src.start(now);
        if (maxDuration > 0.06) {
          src.stop(now + maxDuration + 0.02);
        }
        return true;
      } catch (_) {
        return false;
      }
    }

    initMasteringAndBuffers(ctx) {
      try {
        // 1. V12.2 Crystal-Clear Open Master Chain: 38Hz HPF -> Transparent Glue Compressor (-6dB, 2.2:1) -> -1.5dB Safety Limiter
        this.masterHighPass = ctx.createBiquadFilter();
        this.masterHighPass.type = 'highpass';
        this.masterHighPass.frequency.setValueAtTime(38, ctx.currentTime);
        this.masterHighPass.Q.setValueAtTime(0.707, ctx.currentTime);

        this.compressor = ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-6.0, ctx.currentTime);
        this.compressor.knee.setValueAtTime(10.0, ctx.currentTime);
        this.compressor.ratio.setValueAtTime(2.2, ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.008, ctx.currentTime);
        this.compressor.release.setValueAtTime(0.160, ctx.currentTime);

        this.safetyLimiter = ctx.createDynamicsCompressor();
        this.safetyLimiter.threshold.setValueAtTime(-1.5, ctx.currentTime);
        this.safetyLimiter.knee.setValueAtTime(0.0, ctx.currentTime);
        this.safetyLimiter.ratio.setValueAtTime(20.0, ctx.currentTime);
        this.safetyLimiter.attack.setValueAtTime(0.001, ctx.currentTime);
        this.safetyLimiter.release.setValueAtTime(0.060, ctx.currentTime);

        this.masterGain = ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.96 * (this.masterVolume ?? 1.0), ctx.currentTime);

        // Dedicated Independent Train & SFX Bus (0% - 100%, default 100%)
        this.sfxBus = ctx.createGain();
        this.sfxBus.gain.setValueAtTime(this.sfxVolume, ctx.currentTime);
        this.sfxBus.connect(this.masterGain);

        this.masterGain.connect(this.masterHighPass);
        this.masterHighPass.connect(this.compressor);
        this.compressor.connect(this.safetyLimiter);

        if (typeof ctx.createAnalyser === 'function') {
          this.masterAnalyser = ctx.createAnalyser();
          this.masterAnalyser.fftSize = 1024;
          this.safetyLimiter.connect(this.masterAnalyser);
          this.masterAnalyser.connect(ctx.destination);
        } else {
          this.safetyLimiter.connect(ctx.destination);
        }

        // 2. Warm Concert Canopy / Valley Stereo Reverb (0.52s smooth damped tail — Zero mobile lag)
        const irLen = Math.floor(ctx.sampleRate * 0.52);
        const irBuf = ctx.createBuffer(2, irLen, ctx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
          const d = irBuf.getChannelData(ch);
          let lp = 0;
          for (let i = 0; i < irLen; i++) {
            const t = i / irLen;
            const env = Math.pow(1.0 - t, 2.5) * (i < 280 ? (i / 280) : 1.0);
            const early = (i === 680 || i === 1620) ? 0.26 : 0.0;
            const white = (Math.random() * 2 - 1) + early;
            lp = lp * 0.78 + white * 0.22;
            d[i] = lp * env * 0.44;
          }
        }
        this.reverbNode = ctx.createConvolver();
        this.reverbNode.buffer = irBuf;
        this.reverbSend = ctx.createGain();
        this.reverbSend.gain.setValueAtTime(0.24, ctx.currentTime);
        this.reverbSend.connect(this.reverbNode);
        this.reverbNode.connect(this.sfxBus);

        // 3. Zero-DC Seamless Pink & Brownian Noise Buffers
        const nLen = ctx.sampleRate * 2;
        this.pinkBuffer = ctx.createBuffer(1, nLen, ctx.sampleRate);
        this.brownBuffer = ctx.createBuffer(1, nLen, ctx.sampleRate);
        const pData = this.pinkBuffer.getChannelData(0);
        const bData = this.brownBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, lastBrown = 0;
        let sumP = 0, sumB = 0;
        for (let i = 0; i < nLen; i++) {
          const w = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + w * 0.0555179;
          b1 = 0.99332 * b1 + w * 0.0750759;
          b2 = 0.96900 * b2 + w * 0.1538520;
          b3 = 0.86650 * b3 + w * 0.3104856;
          b4 = 0.55000 * b4 + w * 0.5329522;
          b5 = -0.7616 * b5 - w * 0.0168980;
          const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
          b6 = w * 0.115926;
          const fade = i < 2000 ? (i / 2000) : (i > nLen - 2000 ? ((nLen - i) / 2000) : 1.0);
          pData[i] = pink * fade;
          lastBrown = (lastBrown + 0.02 * w) / 1.02;
          bData[i] = lastBrown * 3.0 * fade;
          sumP += pData[i];
          sumB += bData[i];
        }
        const meanP = sumP / nLen;
        const meanB = sumB / nLen;
        for (let i = 0; i < nLen; i++) {
          pData[i] -= meanP;
          bData[i] -= meanB;
        }
      } catch (_) {}
    }

    createSpatialNode(ctx, x = 0, y = 0, z = 0, outBus = null, outRev = undefined) {
      const dest = outBus || this.sfxBus || this.masterGain || ctx.destination;
      const rev = (outRev === undefined) ? this.reverbSend : outRev;
      if (typeof ctx.createStereoPanner === 'function') {
        try {
          const sp = ctx.createStereoPanner();
          sp.pan.setValueAtTime(Math.max(-0.88, Math.min(0.88, x * 0.24)), ctx.currentTime);
          sp.connect(dest);
          if (rev) sp.connect(rev);
          return sp;
        } catch (_) {}
      }
      return dest;
    }

    setMuted(muted) {
      this.muted = Boolean(muted);
      try {
        localStorage.setItem(STORAGE_MUTE_KEY, String(this.muted));
      } catch (_) {}

      if (this.muted) {
        this.stopBGM();
        this.stopTrainEngineLoop();
        this.stopLocomotivePreview();
        if (this.ctx && this.ctx.state === 'running' && typeof this.ctx.suspend === 'function') {
          this.ctx.suspend().catch(() => {});
        }
      } else {
        this.ensureContext();
        this.startBGM(this.resolveActiveSectorOrMenu(), this.currentLevelId);
      }
      this.syncNativeAdAudio();
      return this.muted;
    }

    toggleMute() {
      const next = this.setMuted(!this.muted);
      if (!next) {
        this.playButtonTap();
      }
      return next;
    }

    // =========================================================================
    // 1. DRIFT-FREE WEBAUDIO LOOKAHEAD SCHEDULER + BGM BUS WITH DISPATCH EQ SWELL
    // =========================================================================
    killBgmBus() {
      this.bgmSessionId += 1;
      const oldBus = this.bgmBus;
      const oldRev = this.bgmReverbSend;
      this.bgmBus = null;
      this.bgmWarmthShelf = null;
      this.bgmMidDuckFilter = null;
      this.bgmReverbSend = null;
      if (!oldBus && !oldRev) return;

      try {
        const t = this.ctx ? this.ctx.currentTime : 0;
        if (oldBus && this.ctx) {
          oldBus.gain.cancelScheduledValues(t);
          oldBus.gain.setValueAtTime(Math.max(0.0001, oldBus.gain.value || 0.0001), t);
          oldBus.gain.linearRampToValueAtTime(0.0001, t + 0.025);
        }
        if (oldRev && this.ctx) {
          oldRev.gain.cancelScheduledValues(t);
          oldRev.gain.setValueAtTime(Math.max(0.0001, oldRev.gain.value || 0.0001), t);
          oldRev.gain.linearRampToValueAtTime(0.0001, t + 0.025);
        }
      } catch (_) {}

      setTimeout(() => {
        try { if (oldBus) oldBus.disconnect(); } catch (_) {}
        try { if (oldRev) oldRev.disconnect(); } catch (_) {}
      }, 40);
    }

    createFreshBgmBus(ctx) {
      this.killBgmBus();

      const duckActive = Boolean(this.isTrainDispatched || this.isPreviewPlaying);

      // Warmth Low-Shelf
      const warmthShelf = ctx.createBiquadFilter();
      warmthShelf.type = 'lowshelf';
      warmthShelf.frequency.setValueAtTime(240, ctx.currentTime);
      warmthShelf.gain.setValueAtTime(duckActive ? 0.8 : 0.0, ctx.currentTime);

      // Midrange Sidechain Ducking Filter (ducks 1050Hz by -7.5dB & lowers BGM by -6 dB [50.1%] during Train Dispatch!)
      const midDuck = ctx.createBiquadFilter();
      midDuck.type = 'peaking';
      midDuck.frequency.setValueAtTime(1050, ctx.currentTime);
      midDuck.Q.setValueAtTime(0.85, ctx.currentTime);
      midDuck.gain.setValueAtTime(duckActive ? -7.5 : 0.0, ctx.currentTime);

      const outGain = ctx.createGain();
      outGain.gain.setValueAtTime(Math.max(0, this.bgmVolume * BGM_MAKEUP_GAIN * (duckActive ? 0.501 : 1.00)), ctx.currentTime);

      warmthShelf.connect(midDuck);
      midDuck.connect(outGain);
      outGain.connect(this.masterGain || ctx.destination);

      if (this.reverbNode) {
        const bgmWet = ctx.createGain();
        bgmWet.gain.setValueAtTime(0.22, ctx.currentTime);
        outGain.connect(bgmWet);
        bgmWet.connect(this.reverbNode);
        this.bgmReverbSend = bgmWet;
      }

      this.bgmBus = outGain;
      this.bgmWarmthShelf = warmthShelf;
      this.bgmMidDuckFilter = midDuck;
      return { bus: warmthShelf, revSend: null, sessionId: this.bgmSessionId };
    }

    // -------------------------------------------------------------------------
    // PURE NATURAL INSTRUMENT SYNTHESIZERS (ZERO RAW SQUARE OR SAWTOOTH WAVES!)
    // -------------------------------------------------------------------------
    playWarmPianoNote(ctx, freq, when, dur, gainVal, bus, revSend) {
      if (!freq || freq <= 0 || !bus) return;
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const o3 = ctx.createOscillator();
      const flt = ctx.createBiquadFilter();
      const g = ctx.createGain();
      const g2 = ctx.createGain();
      const g3 = ctx.createGain();

      // Warm Felt Grand Piano: fundamental sine + detuned triangle + soft 2nd harmonic
      o1.type = 'sine';
      o2.type = 'triangle';
      o3.type = 'sine';
      o1.frequency.setValueAtTime(freq, when);
      o2.frequency.setValueAtTime(freq * 1.0018, when);
      o3.frequency.setValueAtTime(freq * 2.0, when);
      g2.gain.setValueAtTime(0.42, when);
      g3.gain.setValueAtTime(0.16, when);
      g3.gain.exponentialRampToValueAtTime(0.01, when + Math.min(0.45, dur * 0.5));

      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(1650, when);
      flt.frequency.exponentialRampToValueAtTime(480, when + dur);

      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(gainVal, when + 0.014);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);

      o1.connect(flt);
      o2.connect(g2); g2.connect(flt);
      o3.connect(g3); g3.connect(flt);
      flt.connect(g);
      g.connect(bus);
      if (revSend) g.connect(revSend);

      const stopAt = when + dur + 0.04;
      o1.onended = () => {
        [o1, o2, o3, g2, g3, flt, g].forEach((n) => this.safeDisconnect(n));
      };
      o1.start(when); o2.start(when); o3.start(when);
      o1.stop(stopAt); o2.stop(stopAt); o3.stop(stopAt);
    }

    playConcertHarpNote(ctx, freq, when, dur, gainVal, bus, revSend) {
      if (!freq || freq <= 0 || !bus) return;
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const flt = ctx.createBiquadFilter();
      const g = ctx.createGain();
      const g2 = ctx.createGain();

      o1.type = 'triangle';
      o2.type = 'sine';
      o1.frequency.setValueAtTime(freq, when);
      o2.frequency.setValueAtTime(freq * 2.0, when);
      g2.gain.setValueAtTime(0.24, when);

      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(1550, when);
      flt.frequency.exponentialRampToValueAtTime(380, when + dur);

      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(gainVal, when + 0.010);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);

      o1.connect(flt);
      o2.connect(g2); g2.connect(flt);
      flt.connect(g);
      g.connect(bus);
      if (revSend) g.connect(revSend);

      const stopAt = when + dur + 0.04;
      o1.onended = () => {
        [o1, o2, g2, flt, g].forEach((n) => this.safeDisconnect(n));
      };
      o1.start(when); o2.start(when);
      o1.stop(stopAt); o2.stop(stopAt);
    }

    playLegatoStringsPad(ctx, chordFreqs, when, dur, gainVal, bus, revSend) {
      if (!Array.isArray(chordFreqs) || !bus) return;
      chordFreqs.forEach((f, idx) => {
        if (!f || f <= 0) return;
        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const flt = ctx.createBiquadFilter();
        const g = ctx.createGain();

        // Warm chamber string ensemble: dual detuned triangles + lowpass silk filter
        o1.type = 'triangle';
        o2.type = 'sine';
        o1.frequency.setValueAtTime(f * 0.9975, when);
        o2.frequency.setValueAtTime(f * 1.0025, when);

        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(920 + idx * 110, when);

        const vGain = gainVal / Math.max(2, chordFreqs.length * 0.72);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(vGain, when + Math.min(0.65, dur * 0.34));
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur);

        o1.connect(flt);
        o2.connect(flt);
        flt.connect(g);
        g.connect(bus);
        if (revSend) g.connect(revSend);

        const stopAt = when + dur + 0.06;
        o1.onended = () => {
          [o1, o2, flt, g].forEach((n) => this.safeDisconnect(n));
        };
        o1.start(when); o2.start(when);
        o1.stop(stopAt); o2.stop(stopAt);
      });
    }

    playSectorBass(ctx, sectorId, freq, when, dur, gainVal, bus, revSend) {
      if (!freq || freq <= 0 || !bus) return;
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const flt = ctx.createBiquadFilter();
      const g = ctx.createGain();
      const g2 = ctx.createGain();

      o1.type = 'sine';
      o2.type = 'triangle';
      o1.frequency.setValueAtTime(freq * 0.5, when);
      o2.frequency.setValueAtTime(freq, when);
      g2.gain.setValueAtTime(sectorId === 5 || sectorId === 9 ? 0.38 : 0.24, when);

      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(sectorId === 5 ? 340 : 270, when);

      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(gainVal, when + 0.020);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);

      o1.connect(flt);
      o2.connect(g2); g2.connect(flt);
      flt.connect(g);
      g.connect(bus);
      if (revSend && (sectorId === 8 || sectorId === 10)) g.connect(revSend);

      const stopAt = when + dur + 0.05;
      o1.onended = () => {
        [o1, o2, g2, flt, g].forEach((n) => this.safeDisconnect(n));
      };
      o1.start(when); o2.start(when);
      o1.stop(stopAt); o2.stop(stopAt);
    }

    playLeadInstrument(ctx, style, freq, when, dur, gainVal, bus, revSend) {
      if (!ctx || !freq || freq <= 0) return;
      const out = bus || this.bgmWarmthShelf || this.masterGain || ctx.destination;
      const rev = (revSend !== undefined) ? revSend : this.bgmReverbSend;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const flt = ctx.createBiquadFilter();
      const g = ctx.createGain();
      const g2 = ctx.createGain();
      const g3 = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc3.type = 'sine';
      osc1.frequency.setValueAtTime(freq, when);
      osc2.frequency.setValueAtTime(freq * 1.002, when);
      osc3.frequency.setValueAtTime(freq * 2.0, when);
      g2.gain.setValueAtTime(0.38, when);
      g3.gain.setValueAtTime(0.14, when);

      let vib = null;
      let vg = null;
      const attachVibrato = (rateHz, depthRatio) => {
        vib = ctx.createOscillator();
        vg = ctx.createGain();
        vib.type = 'sine';
        vib.frequency.setValueAtTime(rateHz, when);
        vg.gain.setValueAtTime(freq * depthRatio, when);
        vib.connect(vg);
        vg.connect(osc1.frequency);
        vg.connect(osc2.frequency);
        vib.start(when);
      };

      if (style === 'forest_flute') {
        // Breathy Wooden Flute + Soft Air Chiff
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(1680, when);
        g2.gain.setValueAtTime(0.32, when);
        g3.gain.setValueAtTime(0.18, when);
        attachVibrato(4.8, 0.0042);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gainVal, when + 0.048);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      } else if (style === 'desert_oud') {
        // Expressive Warm Oud (Plucked Triangle + Octave/Fifth Harmonics + 320Hz Wood Body Resonance)
        osc1.type = 'triangle';
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 1.998, when);
        osc3.frequency.setValueAtTime(freq * 3.0, when);
        g2.gain.setValueAtTime(0.44, when);
        g3.gain.setValueAtTime(0.22, when);
        // Subtle ornamental pitch grace slide on attack
        osc1.frequency.setValueAtTime(freq * 0.986, when);
        osc1.frequency.exponentialRampToValueAtTime(freq, when + 0.028);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(1950, when);
        flt.frequency.exponentialRampToValueAtTime(420, when + dur * 0.9);
        flt.Q.setValueAtTime(1.8, when);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gainVal * 1.22, when + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur * 0.95);
      } else if (style === 'harbor_horn') {
        // Noble Maritime French Horn (Warm Brass Formant: Triangle + 2nd + 3rd Sine Partials)
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2.0, when);
        osc3.frequency.setValueAtTime(freq * 3.0, when);
        g2.gain.setValueAtTime(0.46, when);
        g3.gain.setValueAtTime(0.22, when);
        attachVibrato(4.4, 0.0036);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(1080, when);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gainVal * 1.08, when + 0.075);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      } else if (style === 'ice_celesta') {
        // Sparkling Winter Celesta & Felt Piano (Euler-Bernoulli 2.756x Bell Overtone)
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2.0, when);
        osc3.frequency.setValueAtTime(freq * 2.756, when);
        g2.gain.setValueAtTime(0.26, when);
        g3.gain.setValueAtTime(0.16, when);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(3200, when);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gainVal, when + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur * 1.22);
      } else if (style === 'neon_synth') {
        // Melodic Modern Chill-Synthwave Crystal Pluck (Warm Detuned Triangles — Zero Harsh Square!)
        osc1.type = 'triangle';
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 1.005, when);
        osc3.frequency.setValueAtTime(freq * 0.5, when);
        g2.gain.setValueAtTime(0.55, when);
        g3.gain.setValueAtTime(0.28, when);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(1850, when);
        flt.frequency.exponentialRampToValueAtTime(460, when + dur * 0.9);
        flt.Q.setValueAtTime(2.1, when);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gainVal * 1.02, when + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur * 0.92);
      } else if (style === 'autumn_waltz') {
        // Enchanting 3/4 Music-Box Celesta & Warm Chamber Harp
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2.0, when);
        osc3.frequency.setValueAtTime(freq * 3.0, when);
        g2.gain.setValueAtTime(0.32, when);
        g3.gain.setValueAtTime(0.12, when);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(2200, when);
        flt.frequency.exponentialRampToValueAtTime(640, when + dur);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gainVal * 1.04, when + 0.010);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur * 1.1);
      } else if (style === 'storm_strings') {
        // Cinematic Ocean Cello & Warm Brass Swell (Filtered Triangle + Octave/Fifth Harmonics)
        osc1.type = 'triangle';
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 0.996, when);
        osc3.frequency.setValueAtTime(freq * 2.0, when);
        g2.gain.setValueAtTime(0.65, when);
        g3.gain.setValueAtTime(0.30, when);
        attachVibrato(4.6, 0.0045);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(980, when);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gainVal * 1.12, when + 0.085);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur * 1.08);
      } else if (style === 'crystal_handpan') {
        // Ethereal Subterranean Handpan (1 : 2 : 2.998 Tuned Steel Dome Harmonics!)
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc3.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2.0, when);
        osc3.frequency.setValueAtTime(freq * 2.998, when);
        g2.gain.setValueAtTime(0.36, when);
        g3.gain.setValueAtTime(0.18, when);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(2600, when);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gainVal * 1.06, when + 0.009);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur * 1.30);
      } else if (style === 'volcano_brass') {
        // Heroic Low Chamber Strings & Warm Epic Brass Fifths
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 1.498, when); // Heroic fifth
        osc3.frequency.setValueAtTime(freq * 2.0, when);
        g2.gain.setValueAtTime(0.40, when);
        g3.gain.setValueAtTime(0.28, when);
        attachVibrato(4.2, 0.0035);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(940, when);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gainVal * 1.15, when + 0.065);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur * 1.05);
      } else {
        // Sector 10 (Apex Orbital Terminus): Weightless Starlight Bell & Orchestral Finale
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2.002, when);
        osc3.frequency.setValueAtTime(freq * 1.498, when);
        g2.gain.setValueAtTime(0.34, when);
        g3.gain.setValueAtTime(0.18, when);
        attachVibrato(3.8, 0.003);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(2400, when);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gainVal * 1.05, when + 0.060);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur * 1.38);
      }

      osc1.connect(flt);
      osc2.connect(g2); g2.connect(flt);
      osc3.connect(g3); g3.connect(flt);
      flt.connect(g);
      g.connect(out);
      if (rev) g.connect(rev);

      const stopAt = when + dur * 1.42 + 0.06;
      osc1.onended = () => {
        [osc1, osc2, osc3, g2, g3, flt, g, vib, vg].forEach((n) => this.safeDisconnect(n));
      };
      osc1.start(when); osc2.start(when); osc3.start(when);
      osc1.stop(stopAt); osc2.stop(stopAt); osc3.stop(stopAt);
      if (vib) vib.stop(stopAt);
    }

    playSoftPercussion(ctx, kind, when, bus, revSend) {
      if (!bus) return;
      const playDrumTone = (freq, endFreq, duration, gain, filterHz, useRev) => {
        const osc = ctx.createOscillator();
        const flt = ctx.createBiquadFilter();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, when);
        osc.frequency.exponentialRampToValueAtTime(Math.max(24, endFreq), when + duration);
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(filterHz, when);
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gain, when + 0.010);
        g.gain.exponentialRampToValueAtTime(0.0001, when + duration);
        osc.connect(flt); flt.connect(g); g.connect(bus);
        if (useRev && revSend) g.connect(revSend);
        osc.onended = () => {
          [osc, flt, g].forEach((n) => this.safeDisconnect(n));
        };
        osc.start(when);
        osc.stop(when + duration + 0.02);
      };
      const playBrushNoise = (duration, filterFreq, q, gain, useRev) => {
        if (!this.pinkBuffer) return;
        const src = ctx.createBufferSource();
        src.buffer = this.pinkBuffer;
        const flt = ctx.createBiquadFilter();
        flt.type = 'bandpass';
        flt.frequency.setValueAtTime(filterFreq, when);
        flt.Q.setValueAtTime(q, when);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(gain, when + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, when + duration);
        src.connect(flt); flt.connect(g); g.connect(bus);
        if (useRev && revSend) g.connect(revSend);
        src.onended = () => {
          [src, flt, g].forEach((n) => this.safeDisconnect(n));
        };
        src.start(when, Math.random() * 1.0, duration + 0.02);
      };

      if (kind === 'desert_drum') {
        playDrumTone(116, 54, 0.16, 0.052, 290, false);
      } else if (kind === 'desert_tek') {
        playDrumTone(420, 210, 0.048, 0.022, 620, true);
      } else if (kind === 'forest_shaker') {
        playDrumTone(520, 310, 0.038, 0.015, 680, false);
      } else if (kind === 'harbor_bell') {
        playDrumTone(783.99, 783.99, 0.55, 0.018, 1900, true);
      } else if (kind === 'clock_tick') {
        playDrumTone(980, 740, 0.026, 0.018, 1750, false);
      } else if (kind === 'cyber_kick') {
        playDrumTone(104, 42, 0.14, 0.048, 220, false);
      } else if (kind === 'volcano_taiko') {
        playDrumTone(88, 36, 0.24, 0.064, 240, true);
      }
    }

    // -------------------------------------------------------------------------
    // EXCLUSIVE 64-STEP (48-SECOND) GRAND RAILWAY OVERTURE (MAIN MENU & MAP ONLY)
    // -------------------------------------------------------------------------
    scheduleMenuOvertureStep(ctx, step, when, bus, revSend) {
      const idx = step % 64;
      const bar = Math.floor(idx / 8); // 8 majestic bars (0..7)
      const beatInBar = idx % 8;

      // 8-Bar Grand Cinema Progression:
      // A-Section (Bars 0-3): Dmaj9 -> Gmaj9 -> Bm9 -> Asus4 / A
      // B-Section (Bars 4-7): Gmaj7#11 -> F#m7 / Bm7 -> Em9 -> A13sus4 -> Uplifting Cadence
      const MENU_CHORDS = [
        [146.83, 220.00, 293.66, 369.99, 440.00], // Bar 0: Dmaj9
        [196.00, 246.94, 293.66, 369.99, 440.00], // Bar 1: Gmaj9
        [123.47, 185.00, 246.94, 329.63, 369.99], // Bar 2: Bm9
        [110.00, 164.81, 220.00, 293.66, 329.63], // Bar 3: Asus4 -> Aadd9
        [196.00, 246.94, 329.63, 369.99, 493.88], // Bar 4: Gmaj13
        [185.00, 220.00, 277.18, 329.63, 440.00], // Bar 5: F#m7 / Bm7
        [164.81, 246.94, 293.66, 369.99, 440.00], // Bar 6: Em9
        [110.00, 196.00, 246.94, 329.63, 369.99]  // Bar 7: A13sus4 grand turnaround
      ];
      const chord = MENU_CHORDS[bar];

      // 1. Soft Legato Orchestral Strings Pad + Warm Acoustic Piano Voicing on Beat 1 of Each Bar
      if (beatInBar === 0) {
        this.playLegatoStringsPad(ctx, [chord[1], chord[2], chord[3]], when, 5.8, 0.042, bus, revSend);
        this.playWarmPianoNote(ctx, chord[0], when, 3.2, 0.042, bus, revSend);
        this.playWarmPianoNote(ctx, chord[2], when + 0.025, 2.8, 0.026, bus, revSend);
        this.playWarmPianoNote(ctx, chord[3], when + 0.050, 2.8, 0.024, bus, revSend);
      } else if (beatInBar === 4) {
        this.playWarmPianoNote(ctx, chord[0] * 1.5, when, 2.4, 0.028, bus, revSend);
        this.playWarmPianoNote(ctx, chord[4], when + 0.02, 2.2, 0.020, bus, revSend);
      }

      // 2. Cascading Concert Harp Arpeggio Across All 64 Steps
      const arpOrder = [0, 1, 2, 3, 4, 3, 2, 1];
      const hFreq = chord[arpOrder[beatInBar]];
      if (hFreq > 0 && beatInBar !== 7) {
        this.playConcertHarpNote(ctx, hFreq, when + 0.004, 1.45, 0.022, bus, revSend);
      }

      // 3. Lyrical 64-Step Solo Melody:
      //    Section A (0..31): Noble Warm French Horn
      //    Section B (32..63): Soaring Concert Wooden Flute + Celesta Shimmer
      const MENU_SOLO_64 = {
        // Section A — French Horn (Majestic Welcome)
        2:  { f: 293.66, d: 1.35, style: 'harbor_horn' }, // D4
        4:  { f: 369.99, d: 1.55, style: 'harbor_horn' }, // F#4
        6:  { f: 440.00, d: 1.40, style: 'harbor_horn' }, // A4
        8:  { f: 392.00, d: 1.85, style: 'harbor_horn' }, // G4
        11: { f: 369.99, d: 0.72, style: 'harbor_horn' }, // F#4
        12: { f: 329.63, d: 1.35, style: 'harbor_horn' }, // E4
        14: { f: 293.66, d: 1.50, style: 'harbor_horn' }, // D4
        18: { f: 246.94, d: 1.35, style: 'harbor_horn' }, // B3
        20: { f: 293.66, d: 1.35, style: 'harbor_horn' }, // D4
        22: { f: 369.99, d: 1.65, style: 'harbor_horn' }, // F#4
        24: { f: 329.63, d: 1.50, style: 'harbor_horn' }, // E4
        27: { f: 293.66, d: 0.75, style: 'harbor_horn' }, // D4
        28: { f: 329.63, d: 2.20, style: 'harbor_horn' }, // E4 half-cadence
        // Section B — Soaring Concert Flute & Shimmering Horizon
        34: { f: 440.00, d: 1.35, style: 'forest_flute' }, // A4
        36: { f: 493.88, d: 1.45, style: 'forest_flute' }, // B4
        38: { f: 587.33, d: 1.65, style: 'forest_flute' }, // D5 soaring peak!
        40: { f: 554.37, d: 1.45, style: 'forest_flute' }, // C#5
        42: { f: 493.88, d: 1.35, style: 'forest_flute' }, // B4
        44: { f: 440.00, d: 1.65, style: 'forest_flute' }, // A4
        48: { f: 392.00, d: 1.35, style: 'forest_flute' }, // G4
        50: { f: 440.00, d: 1.35, style: 'forest_flute' }, // A4
        52: { f: 493.88, d: 1.45, style: 'forest_flute' }, // B4
        54: { f: 369.99, d: 1.40, style: 'forest_flute' }, // F#4
        56: { f: 440.00, d: 1.50, style: 'harbor_horn'  }, // A4 noble horn return
        58: { f: 392.00, d: 1.35, style: 'harbor_horn'  }, // G4
        60: { f: 369.99, d: 2.35, style: 'harbor_horn'  }  // F#4 warm home resolution
      };

      const solo = MENU_SOLO_64[idx];
      if (solo) {
        this.playLeadInstrument(ctx, solo.style, solo.f, when + 0.008, solo.d, 0.036, bus, revSend);
        if (idx >= 34 && idx % 4 === 0) {
          this.playLeadInstrument(ctx, 'ice_celesta', solo.f * 2.0, when + 0.015, 1.2, 0.014, bus, revSend);
        }
      }
    }

    // -------------------------------------------------------------------------
    // 10 EVOLVING MULTI-PHRASE SECTOR COMPOSITIONS (32–64 STEPS + 3 PROGRESSION TIERS)
    // -------------------------------------------------------------------------
    getSectorComposition(sectorId) {
      const THEMES = {
        1: { // Sector 1: Pine Valley (Warm Acoustic Guitar/Harp + Breathy Wooden Flute — 32 steps)
          stepSec: 0.45,
          meter: 8,
          style: 'forest_flute',
          counterStyle: 'ice_celesta',
          bassGain: 0.034,
          leadGain: 0.038,
          perc: 'forest_shaker',
          chords: [
            [146.83, 220.00, 293.66, 369.99], // D
            [196.00, 246.94, 293.66, 392.00], // G
            [185.00, 246.94, 293.66, 369.99], // Bm/F#
            [164.81, 220.00, 293.66, 329.63]  // Asus4/E
          ],
          melody: [
            // Section A (Steps 0..15)
            587.33, 0, 659.25, 739.99, 880.00, 0, 739.99, 659.25,
            587.33, 659.25, 739.99, 0, 659.25, 587.33, 493.88, 0,
            // Section B Development (Steps 16..31)
            739.99, 0, 880.00, 987.77, 880.00, 739.99, 659.25, 0,
            587.33, 739.99, 659.25, 587.33, 659.25, 0, 587.33, 0
          ]
        },
        2: { // Sector 2: Red Canyon Desert (Warm Hijaz/Bayati Oud + Frame Drum — 32 steps)
          stepSec: 0.43,
          meter: 8,
          style: 'desert_oud',
          counterStyle: 'forest_flute',
          bassGain: 0.036,
          leadGain: 0.040,
          perc: 'desert_drum',
          chords: [
            [146.83, 220.00, 293.66, 369.99], // D Hijaz
            [155.56, 233.08, 311.13, 392.00], // Eb
            [196.00, 293.66, 392.00, 466.16], // Gm
            [146.83, 220.00, 293.66, 369.99]  // D Hijaz cadence
          ],
          melody: [
            293.66, 311.13, 369.99, 392.00, 440.00, 0, 392.00, 369.99,
            311.13, 369.99, 392.00, 369.99, 311.13, 293.66, 261.63, 0,
            440.00, 466.16, 523.25, 466.16, 440.00, 392.00, 369.99, 0,
            392.00, 440.00, 392.00, 369.99, 311.13, 369.99, 293.66, 0
          ]
        },
        3: { // Sector 3: Industrial Harbor (Warm Rhodes Piano + Maritime French Horn — 32 steps)
          stepSec: 0.47,
          meter: 8,
          style: 'harbor_horn',
          counterStyle: 'ice_celesta',
          bassGain: 0.036,
          leadGain: 0.036,
          perc: 'harbor_bell',
          chords: [
            [196.00, 246.94, 293.66, 392.00], // G
            [164.81, 246.94, 293.66, 392.00], // Em7
            [130.81, 196.00, 246.94, 329.63], // Cmaj7
            [146.83, 220.00, 293.66, 369.99]  // D9sus4
          ],
          melody: [
            392.00, 0, 493.88, 587.33, 659.25, 0, 587.33, 493.88,
            392.00, 440.00, 493.88, 0, 440.00, 392.00, 329.63, 0,
            523.25, 0, 587.33, 659.25, 783.99, 659.25, 587.33, 0,
            493.88, 587.33, 523.25, 440.00, 392.00, 0, 392.00, 0
          ]
        },
        4: { // Sector 4: Alpine Glacier (Sparkling Felt-Piano & Winter Celesta + Aurora Strings — 32 steps)
          stepSec: 0.46,
          meter: 8,
          style: 'ice_celesta',
          counterStyle: 'forest_flute',
          bassGain: 0.032,
          leadGain: 0.038,
          perc: null,
          chords: [
            [164.81, 246.94, 329.63, 369.99], // Eadd9
            [138.59, 207.65, 277.18, 329.63], // C#m7
            [110.00, 164.81, 246.94, 329.63], // Amaj9
            [123.47, 185.00, 246.94, 329.63]  // Bsus4
          ],
          melody: [
            659.25, 0, 739.99, 830.61, 987.77, 0, 830.61, 739.99,
            659.25, 739.99, 659.25, 493.88, 554.37, 0, 493.88, 0,
            830.61, 0, 987.77, 1108.73, 987.77, 830.61, 739.99, 0,
            659.25, 830.61, 739.99, 659.25, 739.99, 0, 659.25, 0
          ]
        },
        5: { // Sector 5: Cyber Neon Metropolis (Smooth Melodic Chill-Synthwave — 32 steps)
          stepSec: 0.30,
          meter: 8,
          style: 'neon_synth',
          counterStyle: 'space_cosmic',
          bassGain: 0.042,
          leadGain: 0.034,
          perc: 'cyber_kick',
          chords: [
            [110.00, 220.00, 261.63, 329.63], // Am7
            [87.31,  174.61, 261.63, 329.63], // Fmaj7
            [130.81, 196.00, 246.94, 329.63], // Cmaj7
            [98.00,  196.00, 246.94, 293.66]  // G6
          ],
          melody: [
            220.00, 329.63, 440.00, 523.25, 493.88, 440.00, 329.63, 261.63,
            174.61, 261.63, 349.23, 440.00, 392.00, 349.23, 329.63, 261.63,
            261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63,
            196.00, 293.66, 392.00, 493.88, 440.00, 392.00, 329.63, 293.66
          ]
        },
        6: { // Sector 6: Autumn Clockwork (Enchanting 3/4 Acoustic Waltz — 48 steps = 8 bars of 6!)
          stepSec: 0.38,
          meter: 6,
          style: 'autumn_waltz',
          counterStyle: 'forest_flute',
          bassGain: 0.036,
          leadGain: 0.038,
          perc: 'clock_tick',
          chords: [
            [146.83, 220.00, 293.66, 349.23], // Dm
            [116.54, 174.61, 233.08, 349.23], // Bbmaj7
            [196.00, 233.08, 293.66, 392.00], // Gm
            [110.00, 220.00, 277.18, 329.63], // A7
            [146.83, 220.00, 293.66, 440.00], // Dm9
            [174.61, 261.63, 349.23, 440.00], // Fmaj7
            [196.00, 293.66, 349.23, 440.00], // Gm9
            [110.00, 220.00, 277.18, 349.23]  // A7b13
          ],
          melody: [
            // Bars 0..3 (24 waltz steps)
            587.33, 0, 440.00, 523.25, 587.33, 0,
            698.46, 0, 587.33, 523.25, 466.16, 0,
            440.00, 0, 392.00, 440.00, 523.25, 0,
            440.00, 0, 369.99, 440.00, 0,      0,
            // Bars 4..7 (24 waltz steps — soaring B-section)
            587.33, 0, 698.46, 880.00, 783.99, 0,
            698.46, 0, 659.25, 587.33, 523.25, 0,
            466.16, 0, 523.25, 587.33, 698.46, 0,
            659.25, 0, 554.37, 587.33, 0,      0
          ]
        },
        7: { // Sector 7: Tempest Lighthouse Isles (Cinematic Ocean Cello & Warm Brass — 32 steps)
          stepSec: 0.42,
          meter: 8,
          style: 'storm_strings',
          counterStyle: 'harbor_horn',
          bassGain: 0.040,
          leadGain: 0.038,
          perc: null,
          chords: [
            [130.81, 196.00, 261.63, 311.13], // Cm
            [103.83, 155.56, 233.08, 311.13], // Abmaj7
            [155.56, 233.08, 311.13, 392.00], // Eb
            [116.54, 174.61, 233.08, 293.66]  // Bb
          ],
          melody: [
            261.63, 0, 311.13, 392.00, 523.25, 0, 466.16, 392.00,
            311.13, 0, 349.23, 392.00, 311.13, 293.66, 261.63, 0,
            392.00, 0, 466.16, 523.25, 622.25, 587.33, 523.25, 0,
            466.16, 392.00, 349.23, 311.13, 293.66, 0, 261.63, 0
          ]
        },
        8: { // Sector 8: Crystal Caverns (Subterranean Handpan, Glass Marimba & Choir Pad — 32 steps)
          stepSec: 0.48,
          meter: 8,
          style: 'crystal_handpan',
          counterStyle: 'ice_celesta',
          bassGain: 0.032,
          leadGain: 0.038,
          perc: null,
          chords: [
            [138.59, 207.65, 277.18, 329.63], // C#m7
            [110.00, 164.81, 246.94, 329.63], // Amaj9
            [164.81, 246.94, 329.63, 369.99], // Eadd9
            [123.47, 185.00, 246.94, 369.99]  // B6
          ],
          melody: [
            554.37, 0, 659.25, 739.99, 830.61, 0, 739.99, 659.25,
            554.37, 659.25, 493.88, 0, 554.37, 493.88, 415.30, 0,
            659.25, 0, 830.61, 987.77, 1108.73, 987.77, 830.61, 0,
            739.99, 659.25, 554.37, 493.88, 554.37, 0, 554.37, 0
          ]
        },
        9: { // Sector 9: Volcanic Magma Core (Heroic Low Strings, Epic Brass & Taiko — 32 steps)
          stepSec: 0.40,
          meter: 8,
          style: 'volcano_brass',
          counterStyle: 'storm_strings',
          bassGain: 0.044,
          leadGain: 0.040,
          perc: 'volcano_taiko',
          chords: [
            [164.81, 246.94, 329.63, 392.00], // Em
            [174.61, 261.63, 349.23, 440.00], // Fmaj7 (Phrygian II)
            [196.00, 293.66, 392.00, 493.88], // G
            [174.61, 261.63, 329.63, 440.00]  // Fmaj7#11
          ],
          melody: [
            164.81, 0, 174.61, 196.00, 246.94, 0, 220.00, 196.00,
            174.61, 196.00, 220.00, 0, 196.00, 174.61, 164.81, 0,
            246.94, 0, 261.63, 293.66, 329.63, 293.66, 261.63, 0,
            246.94, 220.00, 196.00, 174.61, 164.81, 0, 164.81, 0
          ]
        },
        10: { // Sector 10: Apex Orbital Terminus (64-Step Grand Cosmic Orchestral Finale!)
          stepSec: 0.52,
          meter: 8,
          style: 'space_cosmic',
          counterStyle: 'harbor_horn',
          bassGain: 0.036,
          leadGain: 0.038,
          perc: null,
          chords: [
            [174.61, 261.63, 329.63, 392.00], // Fmaj9
            [196.00, 293.66, 369.99, 440.00], // G6/9 (Lydian lift!)
            [164.81, 246.94, 329.63, 392.00], // Em7
            [130.81, 196.00, 261.63, 329.63], // Cmaj7
            [146.83, 220.00, 293.66, 349.23], // Dm9
            [196.00, 293.66, 392.00, 493.88], // G
            [174.61, 261.63, 349.23, 440.00], // Fmaj7
            [196.00, 261.63, 329.63, 392.00]  // C/G -> Cosmic Resolution
          ],
          melody: [
            // Section A (0..31)
            523.25, 0, 659.25, 783.99, 987.77, 0, 880.00, 783.99,
            659.25, 0, 783.99, 880.00, 783.99, 659.25, 523.25, 0,
            587.33, 0, 698.46, 880.00, 783.99, 0, 659.25, 587.33,
            523.25, 659.25, 783.99, 0, 659.25, 587.33, 523.25, 0,
            // Section B Grand Finale Soar (32..63)
            698.46, 0, 880.00, 1046.50, 1174.66, 0, 1046.50, 880.00,
            783.99, 0, 880.00, 987.77, 1046.50, 987.77, 783.99, 0,
            698.46, 880.00, 1046.50, 0, 987.77, 880.00, 783.99, 659.25,
            783.99, 0, 659.25, 587.33, 523.25, 0, 523.25, 0
          ]
        }
      };
      return THEMES[sectorId] || THEMES[1];
    }

    scheduleSectorStep(ctx, sectorId, step, when, bus, revSend) {
      const theme = this.getSectorComposition(sectorId);
      const meter = theme.meter || 8;
      const totalSteps = theme.melody.length;
      const idx = step % totalSteps;
      const barIdx = Math.floor(idx / meter) % theme.chords.length;
      const beatInBar = idx % meter;
      const chord = theme.chords[barIdx];
      const tier = this.progressionTier; // 0: Early (#1-3), 1: Mid (#4-9), 2: Boss (#10)

      // 1. Warm Accompaniment & Bass Foundation
      if (meter === 6) {
        // 3/4 Waltz ("oom - pah - pah") for Sector 6!
        if (beatInBar === 0) {
          this.playSectorBass(ctx, sectorId, chord[0], when, theme.stepSec * 2.6, theme.bassGain, bus, revSend);
          if (tier >= 1) {
            this.playLegatoStringsPad(ctx, [chord[1], chord[2], chord[3]], when, theme.stepSec * 5.6, 0.028, bus, revSend);
          }
        } else if (beatInBar === 2 || beatInBar === 4) {
          this.playConcertHarpNote(ctx, chord[beatInBar === 2 ? 2 : 3], when, theme.stepSec * 1.6, 0.020, bus, revSend);
        }
      } else {
        // 4/4 Expressive Accompaniment
        if (beatInBar === 0) {
          const bScale = tier === 2 ? 1.18 : 1.0;
          this.playSectorBass(ctx, sectorId, chord[0], when, theme.stepSec * 3.4, theme.bassGain * bScale, bus, revSend);
          this.playWarmPianoNote(ctx, chord[1], when + 0.012, theme.stepSec * 3.0, 0.020, bus, revSend);
          this.playWarmPianoNote(ctx, chord[2], when + 0.028, theme.stepSec * 3.0, 0.018, bus, revSend);
          if (tier >= 1) {
            // Mid & Boss Missions unlock lush warm legato string harmonic pad!
            this.playLegatoStringsPad(
              ctx,
              tier === 2 ? [chord[1], chord[2], chord[3], chord[1] * 2] : [chord[1], chord[2], chord[3]],
              when,
              theme.stepSec * 7.4,
              tier === 2 ? 0.036 : 0.024,
              bus,
              revSend
            );
          }
        } else if (beatInBar === 4 && tier >= 1) {
          this.playSectorBass(ctx, sectorId, chord[0] * 1.498, when, theme.stepSec * 2.6, theme.bassGain * 0.85, bus, revSend);
        }
        // Gentle harp/arpeggio inner movement
        if (beatInBar % 2 === 1 && sectorId !== 9) {
          const arpNote = chord[(beatInBar >> 1) % chord.length];
          this.playConcertHarpNote(ctx, arpNote, when + 0.005, theme.stepSec * 1.7, 0.015, bus, revSend);
        }
      }

      // 2. Primary Biome Melody (Humanized Micro-Rubato)
      const noteFreq = theme.melody[idx];
      if (noteFreq > 0) {
        const rubato = 0.002 + Math.random() * 0.007;
        const noteDur = theme.stepSec * 1.48;
        this.playLeadInstrument(ctx, theme.style, noteFreq, when + rubato, noteDur, theme.leadGain, bus, revSend);

        // Tier 1 (Mid Missions #4-9): Subtle Counter-Melody Echo on Phrase Peaks
        if (tier >= 1 && beatInBar === 4 && theme.counterStyle) {
          this.playLeadInstrument(ctx, theme.counterStyle, noteFreq * 0.5, when + rubato + 0.015, noteDur * 1.15, theme.leadGain * 0.42, bus, revSend);
        }
        // Tier 2 (Sector Boss #10, #20, ..., #100): Full Heroic Ensemble Octave/Fifth Layer!
        if (tier === 2 && (beatInBar === 0 || beatInBar === 2 || beatInBar === 4)) {
          const ensStyle = theme.counterStyle || 'harbor_horn';
          const ensMult = noteFreq > 620 ? 0.5 : 2.0;
          this.playLeadInstrument(ctx, ensStyle, noteFreq * ensMult, when + rubato + 0.010, noteDur * 1.2, theme.leadGain * 0.48, bus, revSend);
        }
      }

      // 3. Progressive Thematic Percussion (Unlocked in Mid #4-9 & Boss #10 Missions, or soft clockwork waltz)
      const allowPerc = (tier >= 1) || (theme.perc === 'clock_tick');
      if (theme.perc && allowPerc) {
        if (theme.perc === 'desert_drum') {
          if (beatInBar === 0) this.playSoftPercussion(ctx, 'desert_drum', when, bus, revSend);
          else if (beatInBar === 3 || (tier === 2 && beatInBar === 6)) this.playSoftPercussion(ctx, 'desert_tek', when, bus, revSend);
        } else if (theme.perc === 'forest_shaker' && beatInBar % 2 === 1) {
          this.playSoftPercussion(ctx, 'forest_shaker', when, bus, revSend);
        } else if (theme.perc === 'harbor_bell' && idx % 16 === 0) {
          this.playSoftPercussion(ctx, 'harbor_bell', when, bus, revSend);
        } else if (theme.perc === 'clock_tick' && beatInBar % 2 === 0) {
          this.playSoftPercussion(ctx, 'clock_tick', when, bus, revSend);
        } else if (theme.perc === 'cyber_kick' && beatInBar % 2 === 0) {
          this.playSoftPercussion(ctx, 'cyber_kick', when, bus, revSend);
        } else if (theme.perc === 'volcano_taiko' && (beatInBar === 0 || (tier === 2 && beatInBar === 6))) {
          this.playSoftPercussion(ctx, 'volcano_taiko', when, bus, revSend);
        }
      } else if (tier === 2 && beatInBar === 0 && !theme.perc) {
        // Uplifting gentle timpani/heart pulse on Boss Stages of ambient sectors
        this.playSoftPercussion(ctx, 'desert_drum', when, bus, revSend);
      }
    }

    startBGM(sectorOrMode = 'menu', levelId = null) {
      const normalized = (sectorOrMode === 'menu' || sectorOrMode === 0 || sectorOrMode === null)
        ? 'menu'
        : Math.max(1, Math.min(10, Number(sectorOrMode) || 1));

      if (levelId !== null && levelId !== undefined) {
        this.setLevelProgression(levelId);
      }

      // Guard: NEVER allow 'menu' music to start if the active UI screen is 'screen-game'!
      if (normalized === 'menu' && typeof document !== 'undefined') {
        const shell = document.getElementById('app-shell');
        if (shell && shell.getAttribute('data-active-screen') === 'screen-game') {
          return;
        }
      }

      if (normalized === 'menu') {
        this.isTrainDispatched = false;
      }

      const changed = (this.currentSector !== normalized);
      this.currentSector = normalized;
      if (this.muted || this.adPaused) return;

      const ctx = this.ensureContext();
      if (!ctx) return;

      // Keep playing seamlessly if same BGM session is already running (even when progressionTier updates dynamically!)
      if (!changed && this.bgmTimer && this.bgmBus) {
        this.setTrainDispatchState(this.isTrainDispatched);
        return;
      }

      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
      this.stopBiomeAmbience();
      this.bgmStep = 0;

      const { bus, revSend, sessionId } = this.createFreshBgmBus(ctx);

      if (normalized !== 'menu') {
        this.startBiomeAmbience(ctx, normalized, bus, revSend, sessionId);
      }

      const getStepDurationSec = () => {
        if (normalized === 'menu') return 0.75; // 64 steps * 0.75s = 48.0s Grand Railway Overture!
        return this.getSectorComposition(normalized).stepSec;
      };

      this.nextNoteTime = ctx.currentTime + 0.04;

      const runLookaheadScheduler = () => {
        if (this.bgmSessionId !== sessionId || !this.bgmBus) return;
        if (this.muted || this.adPaused || !this.ctx || this.ctx.state !== 'running') return;

        const now = this.ctx.currentTime;
        // Resync smoothly if tab woke up or lagged without bursting queued notes
        if (this.nextNoteTime < now - 0.12) {
          this.nextNoteTime = now + 0.025;
        }

        while (this.nextNoteTime < now + this.scheduleAheadTime) {
          const stepToPlay = this.bgmStep++;
          const schedTime = this.nextNoteTime;
          if (normalized === 'menu') {
            this.scheduleMenuOvertureStep(this.ctx, stepToPlay, schedTime, bus, revSend);
          } else {
            this.scheduleSectorStep(this.ctx, normalized, stepToPlay, schedTime, bus, revSend);
          }
          this.nextNoteTime += getStepDurationSec();
        }
      };

      runLookaheadScheduler();
      this.bgmTimer = setInterval(runLookaheadScheduler, this.lookaheadMs);
    }

    startBiomeAmbience(ctx, sectorId, bus, revSend, sessionId) {
      // V12.2 ZERO-STATIC FLOOR: Continuous broadband pinkBuffer/brownBuffer ambience is 100% disabled!
      // Subtle one-shot natural ambient accents every 6–9s (6000 + Math.random() * 3000 ms) keep BGM & SFX crystal-clear.
      this.ambienceNodes = null;
      if (this.birdTimer) {
        clearTimeout(this.birdTimer);
        this.birdTimer = null;
      }
      if (sectorId === 'menu' || !bus) return;
      try {
        const isOcean = (sectorId === 3 || sectorId === 7);
        const isForest = (sectorId === 1 || sectorId === 6);
        const scheduleNextAmbient = () => {
          const delayMs = Math.round(6000 + Math.random() * 3000);
          this.birdTimer = setTimeout(() => {
            if (this.bgmSessionId !== sessionId) return;
            if (!this.muted && !this.adPaused && this.ctx && this.ctx.state === 'running') {
              if (isForest && Math.random() < 0.65) {
                this.playSpatialSongbird(bus, revSend);
              } else if (isOcean && Math.random() < 0.45) {
                this.playDistantHarborHorn(bus, revSend);
              } else if (sectorId === 8 && Math.random() < 0.55) {
                this.playCavernDroplet(bus, revSend);
              } else if (Math.random() < 0.38) {
                this.playSpatialSongbird(bus, revSend);
              }
            }
            scheduleNextAmbient();
          }, delayMs);
        };
        scheduleNextAmbient();
      } catch (_) {}
    }

    stopBiomeAmbience() {
      if (this.birdTimer) {
        clearTimeout(this.birdTimer);
        clearInterval(this.birdTimer);
        this.birdTimer = null;
      }
      if (this.ambienceNodes) {
        try {
          this.ambienceNodes.src.stop();
          this.ambienceNodes.lfo.stop();
          this.ambienceNodes.ambGain.disconnect();
        } catch (_) {}
        this.ambienceNodes = null;
      }
    }

    playSpatialSongbird(bus = null, revSend = undefined) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const panX = (Math.random() * 2 - 1) * 3.4;
      const out = this.createSpatialNode(ctx, panX, 1.4, -2.0, bus, revSend);
      const isTransientOut = Boolean(out && out !== bus && out !== this.sfxBus && out !== this.masterGain && out !== ctx.destination);
      const baseF = 1850 + Math.random() * 680;
      const notes = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < notes; i++) {
        const now = ctx.currentTime + i * 0.14;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseF, now);
        osc.frequency.exponentialRampToValueAtTime(baseF * (i % 2 === 0 ? 1.22 : 0.86), now + 0.09);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.018, now + 0.018);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
        osc.connect(g);
        g.connect(out);
        const isLast = (i === notes - 1);
        osc.onended = () => {
          this.safeDisconnect(osc);
          this.safeDisconnect(g);
          if (isLast && isTransientOut) this.safeDisconnect(out);
        };
        osc.start(now);
        osc.stop(now + 0.13);
      }
    }

    playDistantHarborHorn(bus = null, revSend = undefined) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const out = this.createSpatialNode(ctx, -3.2, 0.5, -4.0, bus, revSend);
      const isTransientOut = Boolean(out && out !== bus && out !== this.sfxBus && out !== this.masterGain && out !== ctx.destination);
      const now = ctx.currentTime;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(310, now);
      lp.connect(out);
      const freqs = [98.0, 146.83];
      let remaining = freqs.length;
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.022, now + 0.28);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);
        osc.connect(g);
        g.connect(lp);
        osc.onended = () => {
          this.safeDisconnect(osc);
          this.safeDisconnect(g);
          remaining -= 1;
          if (remaining <= 0) {
            this.safeDisconnect(lp);
            if (isTransientOut) this.safeDisconnect(out);
          }
        };
        osc.start(now);
        osc.stop(now + 1.3);
      });
    }

    playCavernDroplet(bus = null, revSend = undefined) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const out = this.createSpatialNode(ctx, (Math.random() * 2 - 1) * 3.0, 0.4, -2.0, bus, revSend);
      const isTransientOut = Boolean(out && out !== bus && out !== this.sfxBus && out !== this.masterGain && out !== ctx.destination);
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const f0 = 780 + Math.random() * 380;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f0, now);
      osc.frequency.exponentialRampToValueAtTime(f0 * 1.9, now + 0.068);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.024, now + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);
      osc.connect(g);
      g.connect(out);
      osc.onended = () => {
        this.safeDisconnect(osc);
        this.safeDisconnect(g);
        if (isTransientOut) this.safeDisconnect(out);
      };
      osc.start(now);
      osc.stop(now + 0.11);
    }

    stopBGM() {
      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
      this.stopBiomeAmbience();
      this.killBgmBus();
    }

    // =========================================================================
    // 2. 9-TIER REAL-RECORDED 3D SPATIAL TRAIN ENGINE, CHUFFS, GLIDES & BRAKES
    //    (Zero Synthetic Sine Chords • 9 Distinct Profiles • Zero Double-Chug)
    // =========================================================================
    ensureTrainEngineLoop(ctx, skinId, trainIndex = 1) {
      const tIdx = (trainIndex === 2) ? 2 : 1;
      if (!this.trainLoops) this.trainLoops = { 1: null, 2: null };
      const existing = this.trainLoops[tIdx];
      if (existing && existing.skinId === skinId) {
        if (tIdx === 1) this.trainLoop = existing;
        return existing;
      }
      this.stopTrainEngineLoop(tIdx);

      const prof = this.getLocomotiveProfile(skinId);
      const sampleKey = prof.loopKey;
      const sampleBuf = (sampleKey && this.sampleBank && this.sampleBank[sampleKey]) ? this.sampleBank[sampleKey] : null;
      // V12.2 ZERO-STATIC GUARANTEE: Never fall back to pinkBuffer/brownBuffer as a continuous loop!
      if (!sampleBuf) return null;

      const era = prof.era;
      const panner = this.createSpatialNode(ctx, 0, 0.25, 0);
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      mainGain.connect(panner);

      const loopSrc = ctx.createBufferSource();
      loopSrc.buffer = sampleBuf;
      loopSrc.loop = true;

      const loopFilter = ctx.createBiquadFilter();
      loopFilter.type = 'lowpass';
      loopFilter.frequency.setValueAtTime(4200, ctx.currentTime);
      loopFilter.Q.setValueAtTime(0.707, ctx.currentTime);

      loopSrc.connect(loopFilter);
      loopFilter.connect(mainGain);
      loopSrc.start();

      const loopObj = {
        trainIndex: tIdx,
        skinId: prof.id,
        prof,
        era,
        usingSample: true,
        panner,
        mainGain,
        loopSrc,
        loopFilter,
        harmonicOsc: null,
        harmonicGain: null,
        _lastUpdateSec: ctx.currentTime || 0
      };
      this.trainLoops[tIdx] = loopObj;
      if (tIdx === 1) {
        this.trainLoop = loopObj;
      }
      return loopObj;
    }

    updateTrainSpatialAudio({
      x = 0,
      y = 0.2,
      z = 0,
      speed = 0,
      arcDist = 0,
      distanceTraveled = 0,
      bankAngle = 0,
      isBraking = false,
      skinId = null,
      trainIndex = 1,
      driveEngineLoop = true
    }) {
      const tIdx = (trainIndex === 2) ? 2 : 1;
      const sId = skinId || this.activeSkinId || 'crimson';
      const prof = this.getLocomotiveProfile(sId);
      const effectiveArcDist = arcDist || distanceTraveled || 0;

      // Track independent per-train rail distance + strict 0.20s per-train clack cooldown
      const perfNowSec = (this.ctx && this.ctx.state === 'running')
        ? this.ctx.currentTime
        : ((typeof performance !== 'undefined' ? performance.now() : Date.now()) * 0.001);

      if (!this.lastRailJointDistByTrain) this.lastRailJointDistByTrain = { 1: 0, 2: 0 };
      if (!this.lastClackTimestampByTrain) this.lastClackTimestampByTrain = { 1: 0, 2: 0 };
      if (!this._lastSpatialParamTimeByTrain) this._lastSpatialParamTimeByTrain = { 1: 0, 2: 0 };
      if (!this._brakeSoundPlayedByTrain) this._brakeSoundPlayedByTrain = { 1: false, 2: false };
      if (!this.chuffCountByTrain) this.chuffCountByTrain = { 1: 0, 2: 0 };

      const normSpeed = Math.max(0.0, Math.min(2.6, speed / 2.6));
      let shouldEmitStepFoley = false;
      if (speed > 0.22 && effectiveArcDist > 0 && prof.stepSpan < 100) {
        const prevDist = this.lastRailJointDistByTrain[tIdx] || 0;
        if (Math.abs(effectiveArcDist - prevDist) >= prof.stepSpan) {
          this.lastRailJointDistByTrain[tIdx] = effectiveArcDist;
          this.lastRailJointDist = effectiveArcDist;
          if ((perfNowSec - (this.lastClackTimestampByTrain[tIdx] || 0)) >= 0.20) {
            this.lastClackTimestampByTrain[tIdx] = perfNowSec;
            this.lastClackTimestamp = perfNowSec;
            this.clacksEmittedCount = (this.clacksEmittedCount || 0) + 1;
            shouldEmitStepFoley = true;
          }
        }
      }

      if (this.muted || this.adPaused) return;
      const ctx = this.ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      if (driveEngineLoop !== false) {
        const loop = this.ensureTrainEngineLoop(ctx, sId, tIdx);
        if (loop) {
          loop._lastUpdateSec = now;
        }
        // Auto-fade the other train's loop if it stopped updating (e.g. primary arrived early or secondary yielding at signal)
        const otherIdx = tIdx === 1 ? 2 : 1;
        const otherLoop = this.trainLoops && this.trainLoops[otherIdx];
        if (otherLoop && otherLoop.mainGain && typeof otherLoop._lastUpdateSec === 'number' && (now - otherLoop._lastUpdateSec) > 0.18) {
          try {
            otherLoop.mainGain.gain.setTargetAtTime(0.0001, now, 0.045);
          } catch (_) {}
        }

        const lastParamT = this._lastSpatialParamTimeByTrain[tIdx] || 0;
        if (loop && (!lastParamT || (now - lastParamT) >= 0.048)) {
          this._lastSpatialParamTimeByTrain[tIdx] = now;
          if (loop.panner && loop.panner.pan) {
            loop.panner.pan.setTargetAtTime(Math.max(-0.88, Math.min(0.88, x * 0.24)), now, 0.05);
          }

          const rawGain = speed > 0.05
            ? Math.min(prof.loopMaxGain, prof.loopBaseGain + normSpeed * ((prof.loopMaxGain - prof.loopBaseGain) * 0.65))
            : 0.0001;
          const targetGain = speed > 0.05 ? rawGain : 0.0001;
          loop.mainGain.gain.setTargetAtTime(targetGain, now, 0.055);

          const rateTarget = prof.rateBase + normSpeed * prof.rateSlope;
          loop.loopSrc.playbackRate.setTargetAtTime(rateTarget, now, 0.065);

          const cutoffTarget = Math.min(5000, 3800 + normSpeed * 460);
          loop.loopFilter.frequency.setTargetAtTime(cutoffTarget, now, 0.070);
        }
      }

      if (shouldEmitStepFoley) {
        if (prof.chuffPrefix) {
          const beat = (this.chuffCountByTrain[tIdx]++) % 4;
          this.chuffCount = (this.chuffCount || 0) + 1;
          const chuffKey = `${prof.chuffPrefix}_${beat + 1}`;
          const chuffGain = prof.stepGain * (beat === 0 ? 1.00 : (beat === 2 ? 0.88 : 0.76)) * Math.min(1.15, 0.84 + normSpeed * 0.20);
          const chuffRate = (prof.rateBase + normSpeed * 0.16) * (0.985 + Math.random() * 0.03);
          this.playSample(chuffKey, { x, gain: chuffGain, rate: chuffRate, reverb: false });
          if (beat % 2 === 0 && prof.clackKey) {
            this.playRailJointClack(x, y, z, normSpeed * 0.94, prof.clackKey, prof.stepGain * 0.72);
          }
        } else if (prof.clackKey) {
          const wRate = (0.92 + normSpeed * 0.18) * (0.985 + Math.random() * 0.03);
          this.playRailJointClack(x, y, z, normSpeed, prof.clackKey, prof.stepGain, wRate);
        }
      }

      // Per-Train Authentic Arrival Braking Release (both Train 1 & Train 2)
      if ((tIdx === 1 || tIdx === 2) && isBraking && !this._brakeSoundPlayedByTrain[tIdx]) {
        this._brakeSoundPlayedByTrain[tIdx] = true;
        if (prof.brakeKey) {
          this.playAirBrakeRelease(x, y, z, prof.id);
        }
      } else if ((tIdx === 1 || tIdx === 2) && !isBraking) {
        this._brakeSoundPlayedByTrain[tIdx] = false;
      }
    }

    stopTrainEngineLoop(trainIndex = null) {
      if (!this.trainLoops) this.trainLoops = { 1: null, 2: null };
      if (!this.lastRailJointDistByTrain) this.lastRailJointDistByTrain = { 1: 0, 2: 0 };
      if (!this._brakeSoundPlayedByTrain) this._brakeSoundPlayedByTrain = { 1: false, 2: false };
      if (!this._lastSpatialParamTimeByTrain) this._lastSpatialParamTimeByTrain = { 1: 0, 2: 0 };

      const indices = (trainIndex === 1 || trainIndex === 2) ? [trainIndex] : [1, 2];
      indices.forEach((idx) => {
        this._brakeSoundPlayedByTrain[idx] = false;
        this.lastRailJointDistByTrain[idx] = 0;
        this._lastSpatialParamTimeByTrain[idx] = 0;
        const ref = this.trainLoops[idx] || (idx === 1 ? this.trainLoop : null);
        this.trainLoops[idx] = null;
        if (idx === 1) this.trainLoop = null;
        if (ref) {
          try {
            const now = this.ctx ? this.ctx.currentTime : 0;
            if (this.ctx && ref.mainGain && ref.mainGain.gain) {
              ref.mainGain.gain.setTargetAtTime(0.0001, now, 0.055);
            }
            setTimeout(() => {
              this.safeStopNode(ref.loopSrc);
              this.safeStopNode(ref.harmonicOsc);
              this.safeDisconnect(ref.loopSrc);
              this.safeDisconnect(ref.loopFilter);
              this.safeDisconnect(ref.mainGain);
              if (ref.panner && ref.panner !== this.sfxBus && ref.panner !== this.masterGain && (!this.ctx || ref.panner !== this.ctx.destination)) {
                this.safeDisconnect(ref.panner);
              }
            }, 180);
          } catch (_) {}
        }
      });

      if (trainIndex == null) {
        this.lastRailJointDist = 0;
        if (this.trainLoop) {
          const stray = this.trainLoop;
          this.trainLoop = null;
          try {
            if (this.ctx && stray.mainGain && stray.mainGain.gain) {
              stray.mainGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.055);
            }
            setTimeout(() => {
              this.safeStopNode(stray.loopSrc);
              this.safeStopNode(stray.harmonicOsc);
              this.safeDisconnect(stray.loopSrc);
              this.safeDisconnect(stray.loopFilter);
              this.safeDisconnect(stray.mainGain);
              if (stray.panner && stray.panner !== this.sfxBus && stray.panner !== this.masterGain && (!this.ctx || stray.panner !== this.ctx.destination)) {
                this.safeDisconnect(stray.panner);
              }
            }, 180);
          } catch (_) {}
        }
      }
    }

    playRailJointClack(x = 0, y = 0.1, z = 0, speedNorm = 1.0, sampleKey = 'clack_heavy_joint', baseGain = 0.28, customRate = null) {
      const rate = customRate || Math.max(0.84, Math.min(1.26, (0.90 + speedNorm * 0.16) * (0.985 + Math.random() * 0.03)));
      const gain = Math.min(0.34, baseGain * Math.min(1.18, 0.80 + speedNorm * 0.22));
      if (sampleKey && this.playSample(sampleKey, { x, gain, rate, reverb: false })) {
        return;
      }
      const ctx = this.ensureContext();
      if (!ctx) return;
      const out = this.createSpatialNode(ctx, x, y, z);
      const isTransientOut = Boolean(out && out !== this.sfxBus && out !== this.masterGain && out !== ctx.destination);
      const bogieGap = Math.max(0.050, 0.078 / Math.max(0.55, speedNorm));
      [0.0, bogieGap].forEach((offset, idx) => {
        const now = ctx.currentTime + offset;
        const amp = (idx === 0 ? 0.11 : 0.08) * Math.min(1.15, 0.65 + speedNorm * 0.35);
        const thud = ctx.createOscillator();
        const tg = ctx.createGain();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(72, now);
        thud.frequency.exponentialRampToValueAtTime(42, now + 0.046);
        tg.gain.setValueAtTime(amp, now);
        tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.050);
        thud.connect(tg);
        tg.connect(out);
        thud.onended = () => {
          this.safeDisconnect(thud);
          this.safeDisconnect(tg);
          if (idx === 1 && isTransientOut) this.safeDisconnect(out);
        };
        thud.start(now);
        thud.stop(now + 0.058);
      });
    }

    playCurveFlangeSqueal() {
      // Disabled broadband noise flange squeal permanently to guarantee 0% high-frequency static on mobile speakers
    }

    playAirBrakeRelease(x = 0, y = 0.1, z = 0, skinOrEraOverride = null) {
      const prof = (skinOrEraOverride && LOCO_ACOUSTIC_PROFILES[skinOrEraOverride])
        ? LOCO_ACOUSTIC_PROFILES[skinOrEraOverride]
        : this.getLocomotiveProfile(this.activeSkinId);
      if (!prof || !prof.brakeKey) return;
      if (this.playSample(prof.brakeKey, { x, gain: 0.24, rate: 0.98 + Math.random() * 0.04, reverb: false })) {
        return;
      }
      this.playTone({ freq: 185, endFreq: 88, type: 'sine', duration: 0.28, gain: 0.10, filterHz: 480 });
    }

    // =========================================================================
    // 3. ERA-ACCURATE WHISTLES, HORNS, GARAGE PREVIEW & TACTILE UI ACOUSTICS
    // =========================================================================
    playTone({ freq = 440, endFreq = null, type = 'sine', duration = 0.15, delay = 0, gain = 0.15, reverb = false, filterHz = 2400, trackPreview = false } = {}) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const flt = ctx.createBiquadFilter();
      const g = ctx.createGain();

      osc.type = (type === 'sawtooth' || type === 'square') ? 'triangle' : type;
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq !== null) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
      }
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(filterHz, now);

      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(gain, now + Math.min(0.022, duration * 0.25));
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(flt);
      flt.connect(g);
      g.connect(this.sfxBus || this.masterGain || ctx.destination);
      if (reverb && this.reverbSend) g.connect(this.reverbSend);

      const transientNodes = [osc, flt, g];
      let voiceEntry = null;
      if (trackPreview) {
        if (!this.previewActiveSources) this.previewActiveSources = new Set();
        voiceEntry = { src: osc, gain: g, nodes: transientNodes, startTime: now };
        this.previewActiveSources.add(voiceEntry);
      }
      osc.onended = () => {
        transientNodes.forEach((n) => this.safeDisconnect(n));
        if (voiceEntry && this.previewActiveSources) {
          this.previewActiveSources.delete(voiceEntry);
        }
      };

      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    playNoiseBurst({ duration = 0.14, delay = 0, filterFreq = 900, q = 1.5, gain = 0.14, reverb = false, trackPreview = false } = {}) {
      const ctx = this.ensureContext();
      if (!ctx || !this.pinkBuffer) return;
      const now = ctx.currentTime + delay;
      const src = ctx.createBufferSource();
      src.buffer = this.pinkBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(filterFreq, now);
      filter.Q.setValueAtTime(q, now);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(gain, now + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      src.connect(filter);
      filter.connect(g);
      g.connect(this.sfxBus || this.masterGain || ctx.destination);
      if (reverb && this.reverbSend) g.connect(this.reverbSend);

      const transientNodes = [src, filter, g];
      let voiceEntry = null;
      if (trackPreview) {
        if (!this.previewActiveSources) this.previewActiveSources = new Set();
        voiceEntry = { src, gain: g, nodes: transientNodes, startTime: now };
        this.previewActiveSources.add(voiceEntry);
      }
      src.onended = () => {
        transientNodes.forEach((n) => this.safeDisconnect(n));
        if (voiceEntry && this.previewActiveSources) {
          this.previewActiveSources.delete(voiceEntry);
        }
      };

      src.start(now, Math.random() * 1.0, duration + 0.03);
    }

    playButtonTap() {
      this.playTone({ freq: 520, endFreq: 680, type: 'triangle', duration: 0.046, gain: 0.10, filterHz: 1750 });
    }

    playRotate() {
      this.playTone({ freq: 132, endFreq: 68, type: 'triangle', duration: 0.082, gain: 0.17, filterHz: 420 });
      this.playNoiseBurst({ duration: 0.042, delay: 0.014, filterFreq: 1650, q: 2.6, gain: 0.10 });
      this.playTone({ freq: 880, endFreq: 1180, type: 'sine', duration: 0.040, delay: 0.030, gain: 0.08, filterHz: 2300 });
    }

    playFixedBump() {
      this.playTone({ freq: 145, endFreq: 90, type: 'triangle', duration: 0.10, gain: 0.15, filterHz: 480 });
      this.playNoiseBurst({ duration: 0.05, filterFreq: 580, q: 2.2, gain: 0.09 });
    }

    playCombo(multiplier = 2) {
      const base = 440 * Math.pow(1.12, Math.min(4, multiplier) - 1);
      this.playTone({ freq: base, type: 'triangle', duration: 0.18, gain: 0.13, reverb: true, filterHz: 2100 });
      this.playTone({ freq: base * 1.5, type: 'sine', duration: 0.24, delay: 0.055, gain: 0.13, reverb: true, filterHz: 2400 });
    }

    playFreezeShield() {
      [587.33, 880.0, 1174.66, 1760.0].forEach((f, idx) => {
        this.playTone({ freq: f, type: 'sine', duration: 0.30, delay: idx * 0.05, gain: 0.11, reverb: true });
      });
    }

    playTurboBoost() {
      this.playNoiseBurst({ duration: 0.40, filterFreq: 950, q: 0.9, gain: 0.15, reverb: true });
      this.playTone({ freq: 165, endFreq: 440, type: 'triangle', duration: 0.36, gain: 0.12, reverb: true, filterHz: 1300 });
    }

    playThunder() {
      this.playNoiseBurst({ duration: 0.95, filterFreq: 135, q: 0.65, gain: 0.20, reverb: true });
      this.playNoiseBurst({ duration: 1.35, delay: 0.18, filterFreq: 82, q: 0.55, gain: 0.17, reverb: true });
    }

    playPathComplete() {
      [523.25, 659.25, 783.99, 1046.5].forEach((n, idx) => {
        this.playTone({ freq: n, type: 'triangle', duration: 0.34, delay: idx * 0.06, gain: 0.13, reverb: true, filterHz: 2300 });
      });
    }

    playGuardWhistle() {
      [0.0, 0.048, 0.096].forEach((d, idx) => {
        this.playTone({
          freq: idx % 2 === 0 ? 1980 : 2120,
          endFreq: 2040,
          type: 'sine',
          duration: 0.052,
          delay: d,
          gain: 0.052,
          reverb: true,
          filterHz: 2600
        });
      });
    }

    /**
     * Plays each of the 9 locomotives' dedicated real-recorded Whistle/Horn
     * (+ royal brass bell on orient_express or rising synchronous traction motor sweep on tgv_france!).
     * Used by BOTH live train dispatch AND Garage Horn preview button (`🔊 الصافرة`) in `#modal-shop`!
     */
    playWhistle(skinId, { isDeparture = false, fullShowcase = false, useReverb = undefined, trackPreview = false } = {}) {
      const sId = skinId || this.activeSkinId || 'crimson';
      const prof = this.getLocomotiveProfile(sId);
      const hornReverb = (typeof useReverb === 'boolean') ? useReverb : !isDeparture;
      const extraReverb = (typeof useReverb === 'boolean') ? useReverb : true;
      const fallbackReverb = (typeof useReverb === 'boolean') ? useReverb : false;

      // Full natural locomotive horn duration + departure signature chime/bell/spool/sweep on every departure!
      const playedHorn = this.playSample(prof.hornKey, {
        gain: isDeparture ? Math.min(0.36, (prof.hornGain || 0.38) * 0.92) : (prof.hornGain || 0.40),
        rate: 1.0,
        reverb: hornReverb,
        maxDuration: 0,
        trackPreview
      });

      if ((isDeparture || fullShowcase) && prof.departureExtraKey) {
        this.playSample(prof.departureExtraKey, {
          gain: prof.departureExtraGain || 0.28,
          rate: 1.0,
          reverb: extraReverb,
          delay: prof.departureExtraDelay || 0.18,
          trackPreview
        });
      }

      if (playedHorn) return;

      // Pure warm tonal chord fallback ONLY if AudioBuffer is still decoding in first 80ms of page boot (zero noise!)
      const baseHz = prof.era === 'steam' ? 330 : (prof.era === 'diesel' ? 220 : 440);
      this.playTone({ freq: baseHz, endFreq: baseHz * 1.01, type: 'triangle', duration: 0.34, gain: 0.12, reverb: fallbackReverb, filterHz: 920, trackPreview });
      this.playTone({ freq: baseHz * 1.25, endFreq: baseHz * 1.25, type: 'sine', duration: 0.34, gain: 0.09, reverb: fallbackReverb, filterHz: 920, trackPreview });
    }

    stopLocomotivePreview() {
      if (this.previewTimers && this.previewTimers.length > 0) {
        this.previewTimers.forEach((id) => clearTimeout(id));
        this.previewTimers = [];
      }
      const now = this.ctx ? this.ctx.currentTime : 0;
      if (this.previewNodes) {
        const ref = this.previewNodes;
        this.previewNodes = null;
        try {
          if (this.ctx && ref.gain && ref.gain.gain) {
            if (typeof ref.gain.gain.cancelScheduledValues === 'function') {
              ref.gain.gain.cancelScheduledValues(now);
            }
            ref.gain.gain.setTargetAtTime(0.0001, now, 0.02);
          }
          if (this.ctx) {
            this.safeStopNode(ref.src, now + 0.06);
          } else {
            this.safeStopNode(ref.src);
          }
          setTimeout(() => {
            this.safeStopNode(ref.src);
            this.safeDisconnect(ref.src);
            this.safeDisconnect(ref.lp);
            this.safeDisconnect(ref.gain);
          }, 90);
        } catch (_) {
          this.safeStopNode(ref.src);
          this.safeDisconnect(ref.src);
          this.safeDisconnect(ref.lp);
          this.safeDisconnect(ref.gain);
        }
      }
      if (this.previewActiveSources && this.previewActiveSources.size > 0) {
        const activeVoices = Array.from(this.previewActiveSources);
        this.previewActiveSources.clear();
        activeVoices.forEach((entry) => {
          if (!entry) return;
          try {
            if (this.ctx && entry.gain && entry.gain.gain) {
              if (typeof entry.gain.gain.cancelScheduledValues === 'function') {
                entry.gain.gain.cancelScheduledValues(now);
              }
              entry.gain.gain.setTargetAtTime(0.0001, now, 0.02);
            }
            if (this.ctx) {
              this.safeStopNode(entry.src, now + 0.06);
            } else {
              this.safeStopNode(entry.src);
            }
            setTimeout(() => {
              this.safeStopNode(entry.src);
              (entry.nodes || []).forEach((n) => this.safeDisconnect(n));
            }, 90);
          } catch (_) {
            this.safeStopNode(entry.src);
            (entry.nodes || []).forEach((n) => this.safeDisconnect(n));
          }
        });
      }
      this.isPreviewPlaying = false;
      this.applyBgmDuckingAndVolume();
    }

    /**
     * V12.3 Garage Live 3.0-Second Horn + Engine + Track Cadence Showcase (`🔊 سماع المحرك والصافرة`)
     */
    playLocomotivePreview(skinId) {
      if (this.muted || this.adPaused) return false;
      const ctx = this.ensureContext();
      if (!ctx) return false;
      const sId = skinId || this.activeSkinId || 'crimson';
      const prof = this.getLocomotiveProfile(sId);

      this.stopLocomotivePreview();
      this.isPreviewPlaying = true;
      this.applyBgmDuckingAndVolume();

      // 1. Authentic Horn + Signature Departure Chime / Bell / Spool / Traction Sweep (Zero ConvolverNode bursts!)
      this.playWhistle(sId, { isDeparture: false, fullShowcase: true, useReverb: false, trackPreview: true });

      // 2. 2.85s Accelerating Engine Loop Showcase (Open 4200Hz–4800Hz LPF)
      const buf = (prof.loopKey && this.sampleBank && this.sampleBank[prof.loopKey])
        ? this.sampleBank[prof.loopKey]
        : null;
      if (buf) {
        try {
          const now = ctx.currentTime;
          const src = ctx.createBufferSource();
          src.buffer = buf;
          src.loop = true;
          src.playbackRate.setValueAtTime(prof.rateBase, now);
          src.playbackRate.linearRampToValueAtTime(prof.rateBase + prof.rateSlope * 1.15, now + 2.4);

          const lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.setValueAtTime(4200, now);
          lp.frequency.linearRampToValueAtTime(4800, now + 2.4);

          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, now);
          g.gain.linearRampToValueAtTime(prof.loopMaxGain * 0.92, now + 0.25);
          g.gain.setValueAtTime(prof.loopMaxGain * 0.92, now + 2.35);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 2.95);

          src.connect(lp);
          lp.connect(g);
          g.connect(this.sfxBus || this.masterGain || ctx.destination);
          src.onended = () => {
            this.safeDisconnect(src);
            this.safeDisconnect(lp);
            this.safeDisconnect(g);
            if (this.previewNodes && this.previewNodes.src === src) {
              this.previewNodes = null;
            }
          };
          src.start(now + 0.08);
          src.stop(now + 3.02);
          this.previewNodes = { src, gain: g, lp };
        } catch (_) {}
      }

      // 3. Rhythmic Steam Chuffs / Bogie Rail-Clacks / High-Speed Sleeper Whooshes
      const stepTimesMs = [320, 680, 1010, 1320, 1610, 1890, 2160, 2420];
      stepTimesMs.forEach((ms, idx) => {
        const tid = setTimeout(() => {
          if (!this.isPreviewPlaying || this.muted || this.adPaused) return;
          const pan = -0.35 + (idx / Math.max(1, stepTimesMs.length - 1)) * 0.70;
          if (prof.chuffPrefix) {
            const beat = (idx % 4) + 1;
            this.playSample(`${prof.chuffPrefix}_${beat}`, {
              x: pan,
              gain: prof.stepGain * (idx % 2 === 0 ? 0.95 : 0.78),
              rate: 0.92 + idx * 0.035,
              reverb: false,
              trackPreview: true
            });
            if (idx % 2 === 0 && prof.clackKey) {
              this.playSample(prof.clackKey, { x: pan, gain: prof.stepGain * 0.72, rate: 0.95 + idx * 0.03, reverb: false, trackPreview: true });
            }
          } else if (prof.clackKey && idx % 2 === 0) {
            this.playSample(prof.clackKey, {
              x: pan,
              gain: prof.stepGain * 0.88,
              rate: 0.94 + idx * 0.04,
              reverb: false,
              trackPreview: true
            });
          }
        }, ms);
        this.previewTimers.push(tid);
      });

      // 4. Authentic Brake / Deceleration Tail at 2.65s + Restore BGM at 3.05s
      if (prof.brakeKey) {
        this.previewTimers.push(setTimeout(() => {
          if (this.isPreviewPlaying && !this.muted && !this.adPaused) {
            this.playSample(prof.brakeKey, { x: 0.25, gain: 0.34, rate: 1.0, reverb: false, trackPreview: true });
          }
        }, 2580));
      }

      this.previewTimers.push(setTimeout(() => {
        this.stopLocomotivePreview();
      }, 3050));

      return true;
    }

    getAudioDiagnostics() {
      let rms = 0;
      let peak = 0;
      if (this.masterAnalyser && this.ctx && this.ctx.state === 'running') {
        try {
          const arr = new Float32Array(this.masterAnalyser.fftSize);
          if (typeof this.masterAnalyser.getFloatTimeDomainData === 'function') {
            this.masterAnalyser.getFloatTimeDomainData(arr);
            let sumSq = 0;
            for (let i = 0; i < arr.length; i++) {
              const v = arr[i];
              sumSq += v * v;
              const av = Math.abs(v);
              if (av > peak) peak = av;
            }
            rms = Math.sqrt(sumSq / arr.length);
          } else {
            const byteArr = new Uint8Array(this.masterAnalyser.fftSize);
            this.masterAnalyser.getByteTimeDomainData(byteArr);
            let sumSq = 0;
            for (let i = 0; i < byteArr.length; i++) {
              const v = (byteArr[i] - 128) / 128;
              sumSq += v * v;
              const av = Math.abs(v);
              if (av > peak) peak = av;
            }
            rms = Math.sqrt(sumSq / byteArr.length);
          }
        } catch (_) {}
      }
      return {
        contextState: this.ctx ? this.ctx.state : 'uninitialized',
        muted: this.muted,
        sfxVolume: this.sfxVolume,
        bgmVolume: this.bgmVolume,
        isTrainDispatched: this.isTrainDispatched,
        isPreviewPlaying: this.isPreviewPlaying,
        samplesLoaded: this.samplesLoadedCount,
        samplesTotal: this.samplesTotalCount,
        sampleKeysLoaded: Object.keys(this.sampleBank).length,
        activeSkinId: this.activeSkinId,
        usingRealSampleLoop: Boolean((this.trainLoops && ((this.trainLoops[1] && this.trainLoops[1].usingSample) || (this.trainLoops[2] && this.trainLoops[2].usingSample))) || (this.trainLoop && this.trainLoop.usingSample)),
        rms: Number(rms.toFixed(5)),
        peak: Number(peak.toFixed(5))
      };
    }

    /**
     * 2D Fallback Chug ONLY: Suppressed automatically whenever 3D Engine is active
     * so there is ZERO double-chug overlap with updateTrainSpatialAudio()!
     */
    playChug(stepIndex = 0, isTurbo = false, skinId = null, force2D = false) {
      if (!force2D && typeof window !== 'undefined' && window.TrainEngine3D && window.TrainEngine3D.enabled) {
        return;
      }
      const sId = skinId || this.activeSkinId || 'crimson';
      const prof = this.getLocomotiveProfile(sId);
      const beat = stepIndex % 4;

      if (prof.chuffPrefix) {
        const chuffKey = `${prof.chuffPrefix}_${beat + 1}`;
        const rate = isTurbo ? 1.15 : 0.98;
        if (!this.playSample(chuffKey, { gain: beat % 2 === 0 ? 0.30 : 0.24, rate, reverb: false })) {
          this.playNoiseBurst({ duration: 0.14, filterFreq: 560, q: 0.9, gain: 0.14 });
        }
        if (beat % 2 === 0 && prof.clackKey) {
          this.playRailJointClack(0, 0.1, 0, isTurbo ? 1.3 : 1.0, prof.clackKey, 0.26);
        }
        return;
      }

      if (prof.clackKey) {
        this.playRailJointClack(0, 0.1, 0, isTurbo ? 1.3 : 1.0, prof.clackKey, prof.stepGain || 0.25);
      }
    }

    playSparkCollect(sparkNumber = 1) {
      const baseScale = [587.33, 739.99, 880.0];
      const root = baseScale[Math.min(2, Math.max(0, sparkNumber - 1))];
      this.playTone({ freq: root, type: 'sine', duration: 0.22, gain: 0.14, reverb: true });
      this.playTone({ freq: root * 1.5, type: 'triangle', duration: 0.28, delay: 0.055, gain: 0.13, reverb: true });
    }

    playHintLock() {
      [659.25, 880.0, 1318.5].forEach((f, i) => {
        this.playTone({ freq: f, type: 'sine', duration: 0.24, delay: i * 0.065, gain: 0.12, reverb: true });
      });
    }

    playCoinChime() {
      this.playTone({ freq: 1046.5, type: 'sine', duration: 0.12, gain: 0.13, reverb: true });
      this.playTone({ freq: 1567.98, type: 'sine', duration: 0.26, delay: 0.065, gain: 0.14, reverb: true });
    }

    playVictoryFanfare() {
      this.setTrainDispatchState(false);
      this.stopTrainEngineLoop();
      const melody = [
        { f: 523.25, d: 0.18, t: 0.00 },
        { f: 659.25, d: 0.18, t: 0.14 },
        { f: 783.99, d: 0.18, t: 0.28 },
        { f: 1046.50, d: 0.34, t: 0.42 },
        { f: 987.77, d: 0.16, t: 0.72 },
        { f: 1046.50, d: 0.65, t: 0.88 }
      ];
      melody.forEach((note) => {
        this.playTone({ freq: note.f, type: 'triangle', duration: note.d, delay: note.t, gain: 0.14, reverb: true, filterHz: 2300 });
        this.playTone({ freq: note.f * 0.5, type: 'sine', duration: note.d, delay: note.t, gain: 0.09, reverb: true, filterHz: 1100 });
      });
    }

    playOutOfMoves() {
      this.setTrainDispatchState(false);
      this.stopTrainEngineLoop();
      [392.0, 349.23, 329.63, 293.66].forEach((f, idx) => {
        this.playTone({ freq: f, endFreq: f * 0.97, type: 'triangle', duration: 0.26, delay: idx * 0.15, gain: 0.11, reverb: true, filterHz: 1150 });
      });
    }
  }

  window.GameAudio = new DreamAudioEngineV11();
})();
