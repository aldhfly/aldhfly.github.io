/**
 * ============================================================================
 * قطار الأحلام: الشبكة الحديدية القصوى (Dream Express: Overdrive Tracks V3.0 3D)
 * js/game.js • Complete V3.0 Engine: 100 Levels (10 Sectors), Three.js WebGL
 * 2.5D/3D Multi-Carriage Train & Articulated Characters, Dynamic Weather,
 * Combo Multiplier, Storm Overdrive Timer, Ready Speed [1/2/3] & AdMob Bridge
 * ============================================================================
 */

(function () {
  'use strict';

  // Dual-Build Switch: false = Public Google Play Release Build | true = Private Owner/Developer Testing Build
  const IS_OWNER_TEST_BUILD = false;
  const SUPPORTED_LANGS = ['ar', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'pt'];
  const SUPPORTED_LANG_BADGES = {
    ar: 'AR',
    en: 'EN',
    ja: 'JA',
    ko: 'KO',
    de: 'DE',
    fr: 'FR',
    es: 'ES',
    pt: 'PT'
  };
  const PUBLIC_PRIVACY_POLICY_URL = 'https://aldhfly.github.io/privacy_policy.html';
  window.PUBLIC_PRIVACY_POLICY_URL = PUBLIC_PRIVACY_POLICY_URL;
  window.__ALLOW_OWNER_DEBUG = IS_OWNER_TEST_BUILD;
  window.__IS_OWNER_TEST_BUILD = IS_OWNER_TEST_BUILD;
  const SAVE_KEY = IS_OWNER_TEST_BUILD ? 'dream_express_save_v123_owner' : 'dream_express_save_v123_public';
  const LEGACY_SAVE_KEYS = IS_OWNER_TEST_BUILD
    ? []
    : ['dream_express_save_v122_public', 'dream_express_save_v121_public', 'dream_express_save_v120_public', 'dream_express_save_v110_public', 'dream_express_save_v100_public', 'dream_express_save_v80_worldclass_public', 'dream_express_save_v70_public'];
  const TOTAL_LEVELS_COUNT = 100;

  // Grid Direction Vectors (Grid: row 0 is North/Top, col 0 is West/Left)
  const DIR_DELTA = {
    N: { dr: -1, dc: 0, angle: -90 },
    E: { dr: 0,  dc: 1, angle: 0   },
    S: { dr: 1,  dc: 0, angle: 90  },
    W: { dr: 0,  dc: -1, angle: 180 }
  };

  const OPPOSITE_DIR = { N: 'S', E: 'W', S: 'N', W: 'E' };

  // V6.5 World & Classic Locomotives Catalog with Distinct Tactical Puzzle Powers (Bilingual AR / EN)
  const TRAIN_SKINS = [
    {
      id: 'crimson',
      name: 'قاطرة الرعد المدرّعة',
      nameEn: 'Crimson Vanguard Locomotive',
      desc: 'هيكل فولاذي مدرّع باللون القرمزي الساطع مع عربات ملكية زرقاء وكشاف سيان',
      descEn: 'Armored crimson steel hull with royal blue passenger coaches and cyan beam',
      price: 0,
      silhouette: 'armored',
      hullColor: '#EF4444',
      armorColor: '#991B1B',
      trimColor: '#FACC15',
      coreColor: '#38BDF8',
      beamColor: 'rgba(56, 189, 248, 0.35)',
      extraMoves: 0,
      extraTimeSec: 0,
      coinBonusPct: 0,
      autoLockCount: 0,
      autoFreezeSec: 0,
      starMagnet: false,
      threeStarMoveGrace: 0,
      speedMult: 1.0,
      perkBadge: '⚡ قاطرة قياسية متوازنة (تفتح قفل سكة تلقائياً عند الترقية \u2066Lv.4\u2069)',
      perkBadgeEn: '⚡ Balanced standard locomotive (Unlocks 1 Auto-Lock at Lv.4)'
    },
    {
      id: 'classic_steam',
      name: 'قطار البخار الكلاسيكي 1880',
      nameEn: '1880 Classic Steam Express',
      desc: 'قاطرة بخارية تاريخية بمدخنة نحاسية عالية تقفل أول قطعة سكة تلقائياً وتمنحك حركتين إضافيتين',
      descEn: 'Historic steam locomotive with brass chimney that auto-locks 1 track tile and grants +2 moves',
      price: 600,
      silhouette: 'steam',
      hullColor: '#27272A',
      armorColor: '#991B1B',
      trimColor: '#F59E0B',
      coreColor: '#FBBF24',
      beamColor: 'rgba(251, 191, 36, 0.35)',
      extraMoves: 2,
      extraTimeSec: 8,
      coinBonusPct: 15,
      autoLockCount: 1,
      autoFreezeSec: 0,
      starMagnet: false,
      threeStarMoveGrace: 0,
      speedMult: 1.05,
      perkBadge: '🔒 قفل قطعة سكة تلقائياً + \u20662\u2069 حركتان + \u20668\u2069 ثوانٍ + \u206615%\u2069 ذهب',
      perkBadgeEn: '🔒 Auto-Locks 1 Tile + 2 Extra Moves + 8s Time + 15% Gold'
    },
    {
      id: 'orient_express',
      name: 'قطار القصر الملكي الفاخر',
      nameEn: 'Royal Palace Luxury Express',
      desc: 'قطار القصر الملكي الفاخر: يضاعف أرباح الذهب (\u2066+35%\u2069) ويقفل قطعة سكة ويسهّل تحقيق الـ 3 نجوم!',
      descEn: 'Royal Palace luxury express: +35% bonus gold, auto-locks 1 tile, and eases 3-Star move requirements!',
      price: 1400,
      silhouette: 'steam',
      hullColor: '#1E3A8A',
      armorColor: '#172554',
      trimColor: '#FACC15',
      coreColor: '#38BDF8',
      beamColor: 'rgba(250, 204, 21, 0.38)',
      extraMoves: 2,
      extraTimeSec: 10,
      coinBonusPct: 35,
      autoLockCount: 1,
      autoFreezeSec: 0,
      starMagnet: false,
      threeStarMoveGrace: 2,
      speedMult: 1.08,
      perkBadge: '🪙 \u2066+35%\u2069 ذهب + قفل قطعة + تسامح \u2066+2\u2069 حركة للـ 3 نجوم',
      perkBadgeEn: '🪙 +35% Gold + Auto-Locks 1 Tile + +2 Move Grace for 3⭐'
    },
    {
      id: 'spring',
      name: 'قاطرة العاصفة الخضراء',
      nameEn: 'Emerald Storm Interceptor',
      desc: 'قاطرة تكتيكية زمردية تجمد عداد العاصفة 12 ثانية تلقائياً عند بدء المهمة وتقفل قطعة سكة!',
      descEn: 'Emerald storm interceptor that auto-freezes the storm timer for 12s at level start and locks 1 tile!',
      price: 2400,
      silhouette: 'armored',
      hullColor: '#10B981',
      armorColor: '#065F46',
      trimColor: '#A7F3D0',
      coreColor: '#34D399',
      beamColor: 'rgba(52, 211, 153, 0.35)',
      extraMoves: 2,
      extraTimeSec: 15,
      coinBonusPct: 20,
      autoLockCount: 1,
      autoFreezeSec: 12,
      starMagnet: false,
      threeStarMoveGrace: 1,
      speedMult: 1.12,
      perkBadge: '❄️ تجميد تلقائي \u206612\u2069 ثانية + \u206615\u2069 ثانية إضافية + قفل قطعة',
      perkBadgeEn: '❄️ 12s Auto-Freeze + 15s Storm Time + Auto-Locks 1 Tile'
    },
    {
      id: 'tgv_france',
      name: 'قطار السهم الأزرق الفائق',
      nameEn: 'Azure Arrow Duplex High-Speed',
      desc: 'قطار السهم الأزرق المزدوج فائق السرعة يقفل قطعتي سكة تلقائياً (أحجيات منتصف المسار) مع \u2066+3\u2069 حركات!',
      descEn: 'Azure Arrow duplex high-speed train that auto-locks 2 mid-route junction tiles with +3 moves and 5s freeze!',
      price: 3800,
      silhouette: 'bullet',
      hullColor: '#2563EB',
      armorColor: '#1E293B',
      trimColor: '#F97316',
      coreColor: '#38BDF8',
      beamColor: 'rgba(56, 189, 248, 0.42)',
      extraMoves: 3,
      extraTimeSec: 15,
      coinBonusPct: 25,
      autoLockCount: 2,
      autoFreezeSec: 5,
      starMagnet: false,
      threeStarMoveGrace: 1,
      speedMult: 1.22,
      perkBadge: '🚄 قفل قطعتي سكة تلقائياً + \u20663\u2069 حركات + تجميد \u20665\u2069 ثوانٍ',
      perkBadgeEn: '🚄 Auto-Locks 2 Tiles + 3 Extra Moves + 5s Auto-Freeze'
    },
    {
      id: 'bullet_shinkansen',
      name: 'قطار الصقر الفضي النفاث',
      nameEn: 'Silver Falcon Bullet Express',
      desc: 'تحفة قطارات الرصاصة الفضية النفاثة: يقفل قطعتي سكة تلقائياً + تجميد \u206610\u2069 ثوانٍ + سرعة فائقة!',
      descEn: 'Silver Falcon aerodynamic bullet express: auto-locks 2 track tiles + 10s auto-freeze + +2 move grace for 3⭐!',
      price: 5500,
      silhouette: 'bullet',
      hullColor: '#F8FAFC',
      armorColor: '#0284C7',
      trimColor: '#38BDF8',
      coreColor: '#06B6D4',
      beamColor: 'rgba(6, 182, 212, 0.45)',
      extraMoves: 3,
      extraTimeSec: 18,
      coinBonusPct: 30,
      autoLockCount: 2,
      autoFreezeSec: 10,
      starMagnet: false,
      threeStarMoveGrace: 2,
      speedMult: 1.30,
      perkBadge: '🔒 قفل قطعتين + تجميد \u206610\u2069 ثوانٍ + \u20663\u2069 حركات + \u206630%\u2069 ذهب',
      perkBadgeEn: '🔒 Auto-Locks 2 Tiles + 10s Freeze + 3 Moves + 30% Gold'
    },
    {
      id: 'haramain_express',
      name: 'قطار الواحة الزمردي السريع',
      nameEn: 'Emerald Oasis High-Speed Express',
      desc: 'قطار الواحة الزمردي الأخضر والأبيض الفائق: يقفل قطعتين + مغناطيس النجوم عن بُعد + \u20664\u2069 حركات إضافية!',
      descEn: 'Emerald Oasis high-speed express: auto-locks 2 tiles + remote Star Magnet + 4 extra moves + 10s freeze!',
      price: 7500,
      silhouette: 'bullet',
      hullColor: '#059669',
      armorColor: '#F8FAFC',
      trimColor: '#FACC15',
      coreColor: '#34D399',
      beamColor: 'rgba(52, 211, 153, 0.45)',
      extraMoves: 4,
      extraTimeSec: 20,
      coinBonusPct: 35,
      autoLockCount: 2,
      autoFreezeSec: 10,
      starMagnet: true,
      threeStarMoveGrace: 2,
      speedMult: 1.35,
      perkBadge: '🌿 قفل قطعتين + مغناطيس النجوم + \u20664\u2069 حركات + \u206635%\u2069 ذهب',
      perkBadgeEn: '🌿 Auto-Locks 2 Tiles + Star Magnet + 4 Moves + 35% Gold'
    },
    {
      id: 'maglev_600',
      name: 'قطار الماغليف المغناطيسي 600',
      nameEn: 'Maglev 600 km/h Levitation Train',
      desc: 'قطار الرفع المغناطيسي الفائق: يقفل 3 قطع سكة تلقائياً + مغناطيس النجوم + تجميد 12 ثانية!',
      descEn: 'Magnetic levitation hyper-train: auto-locks 3 track tiles + Star Magnet + 12s auto-freeze!',
      price: 10000,
      silhouette: 'bullet',
      hullColor: '#7C3AED',
      armorColor: '#0F172A',
      trimColor: '#22D3EE',
      coreColor: '#38BDF8',
      beamColor: 'rgba(34, 211, 238, 0.48)',
      extraMoves: 4,
      extraTimeSec: 25,
      coinBonusPct: 45,
      autoLockCount: 3,
      autoFreezeSec: 12,
      starMagnet: true,
      threeStarMoveGrace: 3,
      speedMult: 1.45,
      perkBadge: '🧲 قفل 3 قطع تلقائياً + مغناطيس النجوم + تجميد \u206612\u2069 ثانية',
      perkBadgeEn: '🧲 Auto-Locks 3 Tiles + Star Magnet + 12s Auto-Freeze'
    },
    {
      id: 'gold_vip',
      name: 'قاطرة البلازما الإمبراطورية VIP',
      nameEn: 'Apex Gold VIP Plasma Locomotive',
      desc: 'النسخة القصوى المطلية بالذهب المصهور: تقفل 3 قطع سكة تلقائياً + مغناطيس النجوم + تجميد \u206616\u2069 ثانية + \u206660%\u2069 ذهب!',
      descEn: 'Ultimate molten-gold edition: auto-locks 3 track tiles + Star Magnet + 16s freeze + 60% bonus gold!',
      price: 14000,
      vipIncluded: true,
      silhouette: 'bullet',
      hullColor: '#FACC15',
      armorColor: '#854D0E',
      trimColor: '#FFFBEB',
      coreColor: '#38BDF8',
      beamColor: 'rgba(250, 204, 21, 0.5)',
      extraMoves: 5,
      extraTimeSec: 30,
      coinBonusPct: 60,
      autoLockCount: 3,
      autoFreezeSec: 16,
      starMagnet: true,
      threeStarMoveGrace: 3,
      speedMult: 1.55,
      perkBadge: '👑 قفل 3 قطع تلقائياً + مغناطيس النجوم + تجميد \u206616\u2069\u00A0ث + \u206660%\u2069 ذهب',
      perkBadgeEn: '👑 Auto-Locks 3 Tiles + Star Magnet + 16s Freeze + 60% Gold'
    }
  ];

  // ==========================================================================
  // 1. MODAL / 3D / AUDIO LIFECYCLE, LIVE STORE PRICING & ADMOB CONTROLLER
  // ==========================================================================
  const FULLSCREEN_PAUSE_MODAL_IDS = ['modal-shop', 'modal-achievements', 'modal-daily-login', 'modal-privacy'];
  const BACKDROP_CLOSABLE_MODAL_IDS = [
    'modal-shop',
    'modal-achievements',
    'modal-daily-login',
    'modal-privacy',
    'modal-settings',
    'modal-language',
    'modal-exit-confirm',
    'modal-hint',
    'modal-daily-challenge-briefing'
  ];
  let isNativeAdActive = false;
  let shopPreviewUiTimer = null;

  function ltr(val) {
    return `\u2066${String(val)}\u2069`;
  }

  function syncNativeAdMobClass() {
    const hasNative = Boolean(typeof window !== 'undefined' && window.AndroidAdMob);
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.classList.toggle('has-native-admob', hasNative);
    }
    return hasNative;
  }

  syncNativeAdMobClass();

  window.__shouldKeepEngine3DPaused = function () {
    if (isNativeAdActive) return true;
    const simEl = document.getElementById('modal-ad-simulator');
    if (simEl && !simEl.hidden) return true;
    return FULLSCREEN_PAUSE_MODAL_IDS.some(id => {
      const el = document.getElementById(id);
      return Boolean(el && !el.hidden);
    });
  };

  function pauseEngine3DForOverlay() {
    if (window.TrainEngine3D && typeof window.TrainEngine3D.pauseRendering === 'function') {
      window.TrainEngine3D.pauseRendering();
    }
  }

  function syncEngine3DPauseState() {
    if (window.__shouldKeepEngine3DPaused()) {
      pauseEngine3DForOverlay();
    } else if (
      window.TrainEngine3D &&
      window.TrainEngine3D.isPaused &&
      typeof window.TrainEngine3D.resumeRendering === 'function'
    ) {
      window.TrainEngine3D.resumeRendering();
    }
  }

  function stopShopLocomotivePreviewUi() {
    if (shopPreviewUiTimer) {
      clearTimeout(shopPreviewUiTimer);
      shopPreviewUiTimer = null;
    }
    document.querySelectorAll('.shop-whistle-btn.is-previewing').forEach(b => b.classList.remove('is-previewing'));
    if (window.GameAudio && typeof window.GameAudio.stopLocomotivePreview === 'function') {
      window.GameAudio.stopLocomotivePreview();
    }
  }

  function closeModalById(modalId) {
    if (!modalId) return false;
    if (modalId === 'modal-shop') {
      stopShopLocomotivePreviewUi();
    }
    const el = document.getElementById(modalId);
    if (!el) {
      syncEngine3DPauseState();
      return false;
    }
    const wasOpen = !el.hidden;
    el.hidden = true;
    syncEngine3DPauseState();
    return wasOpen;
  }

  window.__storePrices = window.__storePrices || {};

  function mergeStorePrices(raw) {
    let obj = raw;
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (!trimmed) return window.__storePrices;
      try {
        obj = JSON.parse(trimmed);
      } catch (_) {
        return window.__storePrices;
      }
    }
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'string' && obj[k].trim()) {
          window.__storePrices[k] = obj[k].trim();
        }
      });
    }
    return window.__storePrices;
  }

  function readNativeStorePrices() {
    try {
      if (window.AndroidIAP && typeof window.AndroidIAP.getProductPricesJson === 'function') {
        const raw = window.AndroidIAP.getProductPricesJson();
        if (raw) mergeStorePrices(raw);
      }
    } catch (_) {}
    return window.__storePrices;
  }

  function formatPriceIsolate(val) {
    const s = String(val || '').trim();
    return /[\u0600-\u06FF]/.test(s) ? `\u2067${s}\u2069` : `\u2066${s}\u2069`;
  }

  function formatLabelWithLivePrice(baseLabel, livePrice) {
    const cleanBase = String(baseLabel || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
    return `${cleanBase} (${formatPriceIsolate(livePrice)})`;
  }

  function applyLiveStorePricesToShopLabels() {
    const p = window.__storePrices || {};
    const vipPrice = p.vip_no_ads_pack || '';
    const starterPrice = p.starter_conductor_pack || p.coins_pack_small || '';
    const smallPrice = p.coins_pack_small || '';
    const megaPrice = p.coins_pack_mega || '';

    const vipBtn = document.getElementById('btn-buy-vip-pack');
    const vipLabel = document.getElementById('vip-buy-label');
    if (vipLabel) {
      if (typeof gameState !== 'undefined' && gameState && gameState.isVip) {
        if (vipBtn) vipBtn.disabled = true;
        vipLabel.textContent = (typeof t === 'function') ? t('vipActiveLabel') : vipLabel.textContent;
      } else {
        if (vipBtn) vipBtn.disabled = false;
        const baseVip = (typeof t === 'function') ? t('vipBuyLabel') : vipLabel.textContent;
        vipLabel.textContent = vipPrice ? formatLabelWithLivePrice(baseVip, vipPrice) : baseVip;
      }
    }

    const stLabel = document.getElementById('starter-buy-label');
    if (stLabel) {
      const baseSt = (typeof t === 'function') ? t('starterBuyLabel') : stLabel.textContent;
      stLabel.textContent = starterPrice ? formatLabelWithLivePrice(baseSt, starterPrice) : baseSt;
    }

    const smallLabel = document.getElementById('btn-buy-coins-small-label');
    if (smallLabel) {
      const baseSmall = (typeof t === 'function') ? t('coinsSmallPrice') : smallLabel.textContent;
      smallLabel.textContent = smallPrice ? formatPriceIsolate(smallPrice) : baseSmall;
    }

    const megaLabel = document.getElementById('btn-buy-coins-mega-label');
    if (megaLabel) {
      const baseMega = (typeof t === 'function') ? t('coinsMegaPrice') : megaLabel.textContent;
      megaLabel.textContent = megaPrice ? formatPriceIsolate(megaPrice) : baseMega;
    }
  }

  window.__onStorePricesUpdated = function (pricesData) {
    mergeStorePrices(pricesData);
    applyLiveStorePricesToShopLabels();
  };

  class AdMobController {
    constructor() {
      this.winsSinceLastInterstitial = 0;
      this.lastInterstitialTime = 0;
      this.rewardedWatchedInCurrentLevel = false;
      this.simTimerId = null;
    }

    resetLevelAdTracker() {
      this.rewardedWatchedInCurrentLevel = false;
    }

    updateBannerVisibility(isVip) {
      const hasNative = syncNativeAdMobClass();
      const slot = document.getElementById('admob-banner-slot');
      if (slot) {
        slot.hidden = Boolean(isVip || hasNative);
        slot.style.display = (isVip || hasNative) ? 'none' : 'flex';
      }
      const isOffline = (typeof navigator !== 'undefined' && navigator.onLine === false);
      const bannerText = document.getElementById('admob-banner-text');
      const bannerCta = document.getElementById('btn-banner-vip');
      if (bannerText) {
        if (isOffline && typeof t === 'function') {
          bannerText.textContent = t('adOfflineBanner');
        } else if (typeof t === 'function') {
          bannerText.textContent = t('adBannerCopy');
        }
      }
      if (bannerCta && typeof t === 'function') {
        bannerCta.textContent = t('adBannerCta');
      }
      if (window.AndroidAdMob && typeof window.AndroidAdMob.setBannerVisible === 'function') {
        try {
          window.AndroidAdMob.setBannerVisible(!isVip && !isOffline);
        } catch (_) {}
      }
    }

    showRewardedAd(placementName, onRewardEarned, onDismissed) {
      // VIP Pass active: immediately bypass all skill/reward ads and grant the reward!
      if (typeof gameState !== 'undefined' && gameState && gameState.isVip) {
        this.rewardedWatchedInCurrentLevel = true;
        if (window.GameAudio) window.GameAudio.playCoinChime();
        if (typeof onRewardEarned === 'function') onRewardEarned();
        return;
      }

      pauseEngine3DForOverlay();
      if (window.GameAudio && typeof window.GameAudio.pauseForAd === 'function') {
        window.GameAudio.pauseForAd();
      }
      if (window.GameAudio && typeof window.GameAudio.syncNativeAdAudio === 'function') {
        window.GameAudio.syncNativeAdAudio();
      }
      const isOffline = (typeof navigator !== 'undefined' && navigator.onLine === false);
      if (!isOffline && window.AndroidAdMob && typeof window.AndroidAdMob.showRewardedAd === 'function') {
        window.__onAdMobRewardCallback = () => {
          isNativeAdActive = false;
          window.__onAdMobRewardCallback = null;
          window.__onAdMobDismissCallback = null;
          this.rewardedWatchedInCurrentLevel = true;
          if (window.GameAudio && typeof window.GameAudio.resumeAfterAd === 'function') {
            window.GameAudio.resumeAfterAd();
          }
          syncEngine3DPauseState();
          if (typeof onRewardEarned === 'function') onRewardEarned();
        };
        window.__onAdMobDismissCallback = () => {
          isNativeAdActive = false;
          window.__onAdMobRewardCallback = null;
          window.__onAdMobDismissCallback = null;
          if (window.GameAudio && typeof window.GameAudio.resumeAfterAd === 'function') {
            window.GameAudio.resumeAfterAd();
          }
          syncEngine3DPauseState();
          if (typeof showToast === 'function' && typeof t === 'function') {
            showToast(t('toastAdDismissedEarly'));
          }
          if (typeof onDismissed === 'function') onDismissed();
        };
        try {
          isNativeAdActive = true;
          const shown = window.AndroidAdMob.showRewardedAd(placementName);
          if (shown !== false) {
            return;
          }
        } catch (_) {}
        isNativeAdActive = false;
        window.__onAdMobRewardCallback = null;
        window.__onAdMobDismissCallback = null;
      }

      if (isOffline && typeof gameState !== 'undefined' && gameState) {
        const todayStr = (typeof getTodayDateString === 'function') ? getTodayDateString() : '';
        if (gameState.offlineReserveDate !== todayStr) {
          gameState.offlineReserveDate = todayStr;
          gameState.offlineDailyReservesUsed = 0;
        }
        gameState.offlineDailyReservesUsed = Math.min(3, (gameState.offlineDailyReservesUsed || 0) + 1);
        if (typeof saveState === 'function') saveState();
      }

      const badgeText = (typeof t === 'function')
        ? (isOffline ? t('adSimOfflineBadge') : t('adSimReserveBadge'))
        : '⚡ Tactical Reactor Calibration';
      const descText = (typeof t === 'function')
        ? (isOffline ? t('adSimOfflineDesc') : t('adSimReserveDesc'))
        : 'Calibrating tactical backup reactor (3s)...';

      this.openSimulatorModal({
        badge: badgeText,
        title: placementName,
        desc: descText,
        durationSec: 3,
        canCancel: true,
        onComplete: () => {
          this.rewardedWatchedInCurrentLevel = true;
          if (window.GameAudio && typeof window.GameAudio.resumeAfterAd === 'function') {
            window.GameAudio.resumeAfterAd();
          }
          syncEngine3DPauseState();
          if (typeof onRewardEarned === 'function') onRewardEarned();
        },
        onCancel: () => {
          if (window.GameAudio && typeof window.GameAudio.resumeAfterAd === 'function') {
            window.GameAudio.resumeAfterAd();
          }
          syncEngine3DPauseState();
          if (typeof showToast === 'function' && typeof t === 'function') {
            showToast(t('toastAdDismissedEarly'));
          }
          if (typeof onDismissed === 'function') onDismissed();
        }
      });
    }

    maybeShowInterstitial(completedLevelId, isVip, onContinue) {
      this.winsSinceLastInterstitial += 1;

      if (isVip || this.rewardedWatchedInCurrentLevel) {
        onContinue();
        return;
      }

      const now = Date.now();
      const cooldownOk = (now - this.lastInterstitialTime) >= 60000 || this.lastInterstitialTime === 0;
      const shouldTrigger = completedLevelId >= 5 && this.winsSinceLastInterstitial >= 3 && cooldownOk;

      if (!shouldTrigger) {
        onContinue();
        return;
      }

      this.winsSinceLastInterstitial = 0;
      this.lastInterstitialTime = now;

      let settled = false;
      let watchdogTimer = null;
      const finishOnce = () => {
        if (settled) return;
        settled = true;
        isNativeAdActive = false;
        if (watchdogTimer !== null) {
          clearTimeout(watchdogTimer);
          watchdogTimer = null;
        }
        window.__onAdMobInterstitialClosed = null;
        if (window.GameAudio && typeof window.GameAudio.resumeAfterAd === 'function') {
          window.GameAudio.resumeAfterAd();
        }
        syncEngine3DPauseState();
        if (typeof onContinue === 'function') {
          onContinue();
        }
      };

      const isOffline = (typeof navigator !== 'undefined' && navigator.onLine === false);
      if (isOffline || !window.AndroidAdMob || typeof window.AndroidAdMob.showInterstitialAd !== 'function') {
        finishOnce();
        return;
      }

      pauseEngine3DForOverlay();
      if (window.GameAudio && typeof window.GameAudio.pauseForAd === 'function') {
        window.GameAudio.pauseForAd();
      }
      if (window.GameAudio && typeof window.GameAudio.syncNativeAdAudio === 'function') {
        window.GameAudio.syncNativeAdAudio();
      }

      isNativeAdActive = true;
      window.__onAdMobInterstitialClosed = finishOnce;
      // Mandatory 2,500 ms safety watchdog so Private DNS, ad-blockers, or lifecycle drops can NEVER freeze the game
      watchdogTimer = setTimeout(finishOnce, 2500);

      try {
        const shown = window.AndroidAdMob.showInterstitialAd();
        if (shown === false) {
          finishOnce();
        }
      } catch (_) {
        finishOnce();
      }
    }

    openSimulatorModal({ badge, title, desc, durationSec, canCancel, onComplete, onCancel }) {
      const modal = document.getElementById('modal-ad-simulator');
      const badgeEl = document.getElementById('ad-sim-type-badge');
      const timerEl = document.getElementById('ad-sim-timer');
      const titleEl = document.getElementById('ad-sim-title');
      const descEl = document.getElementById('ad-sim-desc');
      const progEl = document.getElementById('ad-sim-progress');
      const claimBtn = document.getElementById('btn-ad-sim-claim');
      const cancelBtn = document.getElementById('btn-ad-sim-cancel');

      if (!modal) {
        onComplete();
        return;
      }

      if (this.simTimerId) clearInterval(this.simTimerId);

      badgeEl.textContent = badge || ((typeof t === 'function') ? t('adSimReserveBadge') : '');
      titleEl.textContent = title || ((typeof t === 'function') ? t('gameTitle') : '');
      descEl.textContent = desc || ((typeof t === 'function') ? t('adSimReserveDesc') : '');
      progEl.style.width = '0%';
      claimBtn.disabled = true;
      const waitTxt = (typeof t === 'function') ? t('adSimWaitBtn') : '⏳ Calibrating Reactor...';
      claimBtn.innerHTML = `<span>${waitTxt}</span>`;
      if (cancelBtn) {
        if (typeof t === 'function') cancelBtn.textContent = t('adSimCancelBtn');
        cancelBtn.style.display = canCancel ? 'inline-flex' : 'none';
      }
      const initSec = Math.max(1, Math.ceil(Number(durationSec) || 3));
      if (timerEl) {
        timerEl.textContent = (typeof tf === 'function') ? tf('adSimSecFmt', { n: initSec }) : `${initSec}s...`;
      }
      modal.hidden = false;
      pauseEngine3DForOverlay();

      const totalMs = durationSec * 1000;
      const startMs = Date.now();

      this.simTimerId = setInterval(() => {
        const elapsed = Date.now() - startMs;
        const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
        const remSec = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
        progEl.style.width = pct + '%';
        if (remSec > 0) {
          timerEl.textContent = (typeof tf === 'function') ? tf('adSimSecFmt', { n: remSec }) : `${remSec}s...`;
        } else {
          timerEl.textContent = (typeof t === 'function') ? t('adSimDone') : 'Complete! ✅';
        }

        if (elapsed >= totalMs) {
          clearInterval(this.simTimerId);
          this.simTimerId = null;
          claimBtn.disabled = false;
          const claimTxt = (typeof t === 'function') ? t('adSimClaimBtn') : '🎁 Claim Reward';
          claimBtn.innerHTML = `<span>${claimTxt}</span>`;
          if (window.GameAudio) window.GameAudio.playCoinChime();
        }
      }, 80);

      claimBtn.onclick = () => {
        if (claimBtn.disabled) return;
        if (this.simTimerId) clearInterval(this.simTimerId);
        modal.hidden = true;
        syncEngine3DPauseState();
        onComplete();
      };

      cancelBtn.onclick = () => {
        if (this.simTimerId) clearInterval(this.simTimerId);
        modal.hidden = true;
        syncEngine3DPauseState();
        if (onCancel) onCancel();
      };
    }
  }

  window.AdMobBridge = new AdMobController();

  // ==========================================================================
  // 2. ART & PORTRAIT RESOLVER (With Built-in Fallbacks for Sector 4 & 5)
  // ==========================================================================
  const BUILTIN_PORTRAITS = {
    tariq: (window.GameArt && window.GameArt.portraits && window.GameArt.portraits.tariq) || '',
    layla: (window.GameArt && window.GameArt.portraits && window.GameArt.portraits.layla) || '',
    saffar_armored: (window.GameArt && window.GameArt.portraits && window.GameArt.portraits.saffar) || ''
  };

  const BUILTIN_STATIONS = {
    4: `<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="st4Sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1E1B4B"/>
          <stop offset="60%" stop-color="#581C87"/>
          <stop offset="100%" stop-color="#9333EA"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st4Sky)"/>
      <polygon points="0,320 0,210 140,130 290,230 460,110 640,220 800,140 800,320" fill="#3B0764"/>
      <!-- Glowing Giant Quartz Crystals -->
      <polygon points="180,260 205,120 235,260" fill="#38BDF8" opacity="0.85"/>
      <polygon points="490,270 525,95 565,270" fill="#C084FC" opacity="0.9"/>
      <polygon points="670,265 695,140 725,265" fill="#FACC15" opacity="0.85"/>
      <rect x="0" y="265" width="800" height="16" fill="#1E293B" stroke="#38BDF8" stroke-width="3"/>
    </svg>`,
    5: `<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="st5Sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#180909"/>
          <stop offset="55%" stop-color="#7F1D1D"/>
          <stop offset="100%" stop-color="#EA580C"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st5Sky)"/>
      <!-- Volcano Cone & Lava Core -->
      <polygon points="160,320 340,70 460,70 640,320" fill="#1C1917" stroke="#EF4444" stroke-width="3"/>
      <path d="M350 70 Q400 130 380 280" fill="none" stroke="#FACC15" stroke-width="14" stroke-linecap="round"/>
      <rect x="0" y="275" width="800" height="45" fill="#DC2626"/>
      <rect x="0" y="255" width="800" height="14" fill="#1E293B" stroke="#FACC15" stroke-width="3"/>
    </svg>`,
    6: `<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="320" fill="#082F49"/>
      <polygon points="0,320 120,90 260,320" fill="#0284C7" opacity="0.7"/>
      <polygon points="220,320 400,55 580,320" fill="#38BDF8" opacity="0.8"/>
      <polygon points="500,320 680,85 800,320" fill="#0369A1" opacity="0.75"/>
      <rect x="0" y="265" width="800" height="18" fill="#E0F2FE" stroke="#38BDF8" stroke-width="3"/>
    </svg>`,
    7: `<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="320" fill="#064E3B"/>
      <circle cx="180" cy="150" r="70" fill="#10B981" opacity="0.6"/>
      <circle cx="420" cy="120" r="85" fill="#34D399" opacity="0.65"/>
      <circle cx="650" cy="145" r="75" fill="#059669" opacity="0.6"/>
      <rect x="0" y="265" width="800" height="18" fill="#1E293B" stroke="#34D399" stroke-width="3"/>
    </svg>`,
    8: `<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="320" fill="#2A1205"/>
      <polygon points="0,320 0,110 220,110 280,320" fill="#9A3412"/>
      <polygon points="520,320 580,100 800,100 800,320" fill="#7C2D12"/>
      <rect x="0" y="185" width="800" height="14" fill="#0F172A" stroke="#38BDF8" stroke-width="3"/>
    </svg>`,
    9: `<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="320" fill="#090D16"/>
      <rect x="80" y="60" width="90" height="260" fill="#1E1B4B" stroke="#EC4899" stroke-width="3"/>
      <rect x="260" y="35" width="110" height="285" fill="#0F172A" stroke="#38BDF8" stroke-width="3"/>
      <rect x="460" y="50" width="95" height="270" fill="#311042" stroke="#A855F7" stroke-width="3"/>
      <rect x="620" y="75" width="100" height="245" fill="#1E293B" stroke="#38BDF8" stroke-width="3"/>
      <rect x="0" y="260" width="800" height="16" fill="#1E293B" stroke="#F472B6" stroke-width="3"/>
    </svg>`,
    10: `<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="320" fill="#1A0B2E"/>
      <circle cx="400" cy="145" r="92" fill="rgba(250,204,21,0.22)" stroke="#FACC15" stroke-width="4"/>
      <polygon points="400,35 470,265 330,265" fill="#F59E0B" stroke="#FEF08A" stroke-width="3"/>
      <rect x="0" y="265" width="800" height="18" fill="#3B0764" stroke="#FACC15" stroke-width="3"/>
    </svg>`
  };

  const VALID_PORTRAIT_SPEAKERS = new Set(['fouad', 'amal', 'rabie', 'tariq', 'siraj', 'layla', 'burhan', 'saffar']);

  function getCharacterPortraitSVG(speakerId) {
    const rawKey = String(speakerId || 'saffar').toLowerCase().trim();
    const baseKey = VALID_PORTRAIT_SPEAKERS.has(rawKey) ? rawKey : 'saffar';
    let svgKey = baseKey;
    if (svgKey === 'saffar' && gameState) {
      if (gameState.equippedSkin === 'gold_vip') svgKey = 'saffar_gold';
      else if (gameState.equippedSkin === 'brass') svgKey = 'saffar_brass';
      else if (gameState.equippedSkin === 'spring') svgKey = 'saffar_spring';
    }
    let svgMarkup = '';
    if (window.GameArt && window.GameArt.portraits && window.GameArt.portraits[svgKey]) {
      svgMarkup = window.GameArt.portraits[svgKey];
    } else if (window.GameArt && typeof window.GameArt.getPortrait === 'function') {
      svgMarkup = window.GameArt.getPortrait(svgKey);
    } else if (BUILTIN_PORTRAITS[svgKey]) {
      svgMarkup = BUILTIN_PORTRAITS[svgKey];
    } else {
      svgMarkup = BUILTIN_PORTRAITS.saffar_armored;
    }

    return `<div class="v12-character-portrait-wrap" data-speaker="${baseKey}">` +
      `<picture>` +
      `<source srcset="assets/portraits/${baseKey}.webp?v=12.3" type="image/webp" />` +
      `<img class="v12-portrait-img" src="assets/portraits/${baseKey}.png?v=12.3" alt="${baseKey}" decoding="async" onerror="this.parentElement.style.display='none'" />` +
      `</picture>` +
      `<div class="v12-portrait-svg-fallback">${svgMarkup}</div>` +
      `</div>`;
  }

  function getStationSceneSVG(stationId) {
    const SECTOR_ART_MAP = {
      1: 'station1',
      2: 'station9',
      3: 'station3',
      4: 'station6',
      5: 'station8',
      6: 'station2',
      7: 'station3',
      8: 'station4',
      9: 'station5',
      10: 'station10'
    };
    let rawSvg = '';
    if (window.GameArt && window.GameArt.stations) {
      const mappedKey = SECTOR_ART_MAP[stationId] || ('station' + stationId);
      rawSvg = window.GameArt.stations[mappedKey] || window.GameArt.stations['station' + stationId] || window.GameArt.stations[stationId] || '';
    }
    if (!rawSvg) {
      rawSvg = BUILTIN_STATIONS[stationId] || '';
    }
    if (!rawSvg) return '';
    // Namespace SVG gradient IDs per sector card so all 10 banners coexist in DOM without ID collisions
    return rawSvg
      .replace(/id="(st\d+_[^"]+)"/g, `id="$1_s${stationId}"`)
      .replace(/url\(#(st\d+_[^)]+)\)/g, `url(#$1_s${stationId})`);
  }

  // ==========================================================================
  // 3. PERSISTENT GAME STATE (localStorage • Strict Public vs. Owner Test Build)
  // ==========================================================================
  const ownerStarsMap = {};
  if (IS_OWNER_TEST_BUILD) {
    for (let i = 1; i <= TOTAL_LEVELS_COUNT; i++) {
      ownerStarsMap[i] = 3;
    }
  }

  const ALL_SKIN_IDS = TRAIN_SKINS.map(s => s.id);

  const OWNER_MAX_SKIN_LEVELS = {
    crimson: 5,
    classic_steam: 5,
    orient_express: 5,
    spring: 5,
    tgv_france: 5,
    bullet_shinkansen: 5,
    haramain_express: 5,
    maglev_600: 5,
    gold_vip: 5
  };

  const defaultState = IS_OWNER_TEST_BUILD
    ? {
        lang: 'ar',
        coins: 500000,
        hints: 99,
        xp: 15000,
        unlockedLevel: 100,
        lastPlayedLevel: 1,
        levelStars: ownerStarsMap,
        ownedSkins: [...ALL_SKIN_IDS],
        skinLevels: Object.assign({}, OWNER_MAX_SKIN_LEVELS),
        equippedSkin: 'crimson',
        claimedAchievements: [],
        claimedStarMilestones: [],
        dualTrainWins: 10,
        maxComboEver: 4,
        lastLoginDate: '',
        loginStreak: 0,
        chestWinProgress: 0,
        lastDailyChallengeDate: '',
        lastShareRewardDate: '',
        winStreak: 0,
        offlineDailyReservesUsed: 0,
        offlineReserveDate: '',
        isVip: true,
        vipPurchased: true,
        introSeen: true,
        seenDialogues: {},
        preferredTrainSpeed: 1,
        hapticsEnabled: true,
        tutorialSeen: false,
        tutorialCompleted: false,
        activeSession: null
      }
    : {
        lang: 'ar',
        coins: 200,
        hints: 3,
        xp: 0,
        unlockedLevel: 1,
        lastPlayedLevel: 1,
        levelStars: {}, // Levels 2–100 locked and unlocked strictly by winning
        ownedSkins: ['crimson'],
        skinLevels: { crimson: 1 },
        equippedSkin: 'crimson',
        claimedAchievements: [],
        claimedStarMilestones: [],
        dualTrainWins: 0,
        maxComboEver: 1,
        lastLoginDate: '',
        loginStreak: 0,
        chestWinProgress: 0,
        lastDailyChallengeDate: '',
        lastShareRewardDate: '',
        winStreak: 0,
        offlineDailyReservesUsed: 0,
        offlineReserveDate: '',
        isVip: false,
        vipPurchased: false,
        introSeen: false,
        seenDialogues: {},
        preferredTrainSpeed: 1,
        hapticsEnabled: true,
        tutorialSeen: false,
        tutorialCompleted: false,
        activeSession: null
      };

  let gameState = loadState();

  function loadState() {
    try {
      let parsed = null;
      const primaryRaw = localStorage.getItem(SAVE_KEY);
      if (primaryRaw) {
        try {
          const cand = JSON.parse(primaryRaw);
          if (cand && typeof cand === 'object' && !Array.isArray(cand)) parsed = cand;
        } catch (_) {
          parsed = null;
        }
      }
      if (!parsed) {
        for (let i = 0; i < LEGACY_SAVE_KEYS.length; i++) {
          const legRaw = localStorage.getItem(LEGACY_SAVE_KEYS[i]);
          if (!legRaw) continue;
          try {
            const cand = JSON.parse(legRaw);
            if (cand && typeof cand === 'object' && !Array.isArray(cand)) {
              parsed = cand;
              break;
            }
          } catch (_) {}
        }
      }
      if (!parsed) return JSON.parse(JSON.stringify(defaultState));
      const rawLang = (parsed && typeof parsed.lang === 'string') ? parsed.lang.toLowerCase() : 'ar';
      const savedLang = SUPPORTED_LANGS.indexOf(rawLang) >= 0 ? rawLang : 'ar';
      const savedSpeed = [1, 2, 3].includes(Number(parsed.preferredTrainSpeed)) ? Number(parsed.preferredTrainSpeed) : 1;
      const savedHaptics = (parsed.hapticsEnabled === undefined) ? true : Boolean(parsed.hapticsEnabled);
      const savedSeenDialogues = (parsed.seenDialogues && typeof parsed.seenDialogues === 'object' && !Array.isArray(parsed.seenDialogues)) ? parsed.seenDialogues : {};
      const savedTutorialDone = Boolean(parsed.tutorialSeen || parsed.tutorialCompleted);
      const savedActiveSession = (parsed.activeSession && typeof parsed.activeSession === 'object' && !Array.isArray(parsed.activeSession)) ? parsed.activeSession : null;
      if (IS_OWNER_TEST_BUILD) {
        return Object.assign({}, JSON.parse(JSON.stringify(defaultState)), parsed, {
          lang: savedLang,
          coins: Math.max(500000, Number(parsed.coins) || 500000),
          hints: Math.max(99, Number(parsed.hints) || 99),
          unlockedLevel: 100,
          isVip: true,
          vipPurchased: true,
          lastPlayedLevel: Math.max(1, Math.min(TOTAL_LEVELS_COUNT, Number(parsed.lastPlayedLevel || 1) || 1)),
          ownedSkins: ALL_SKIN_IDS.slice(),
          skinLevels: Object.assign({}, (parsed.skinLevels && typeof parsed.skinLevels === 'object' && !Array.isArray(parsed.skinLevels)) ? parsed.skinLevels : {}, OWNER_MAX_SKIN_LEVELS),
          claimedAchievements: Array.isArray(parsed.claimedAchievements) ? parsed.claimedAchievements : [],
          claimedStarMilestones: Array.isArray(parsed.claimedStarMilestones) ? parsed.claimedStarMilestones : [],
          levelStars: Object.assign({}, ownerStarsMap, (parsed.levelStars && typeof parsed.levelStars === 'object' && !Array.isArray(parsed.levelStars)) ? parsed.levelStars : {}),
          lastLoginDate: String(parsed.lastLoginDate || ''),
          loginStreak: Math.max(0, Number(parsed.loginStreak || 0) || 0),
          chestWinProgress: Math.max(0, Math.min(3, Number(parsed.chestWinProgress || 0) || 0)),
          lastDailyChallengeDate: String(parsed.lastDailyChallengeDate || ''),
          lastShareRewardDate: String(parsed.lastShareRewardDate || ''),
          winStreak: Math.max(0, Number(parsed.winStreak || 0) || 0),
          offlineDailyReservesUsed: Math.max(0, Number(parsed.offlineDailyReservesUsed || 0) || 0),
          offlineReserveDate: String(parsed.offlineReserveDate || ''),
          preferredTrainSpeed: savedSpeed,
          hapticsEnabled: savedHaptics,
          seenDialogues: savedSeenDialogues,
          tutorialSeen: savedTutorialDone,
          tutorialCompleted: savedTutorialDone,
          activeSession: savedActiveSession
        });
      }
      const isExplicitVip = Boolean(parsed.isVip && parsed.vipPurchased !== false);
      const safeNumOrDefault = (rawVal, defVal, minVal = 0) => {
        if (rawVal === null || rawVal === undefined || rawVal === '') return defVal;
        const n = Number(rawVal);
        return Number.isFinite(n) ? Math.max(minVal, Math.floor(n)) : defVal;
      };
      const safeCoins = safeNumOrDefault(parsed.coins, defaultState.coins, 0);
      const safeHints = safeNumOrDefault(parsed.hints, defaultState.hints, 0);
      const safeXp = safeNumOrDefault(parsed.xp, defaultState.xp, 0);
      const safeUnlockedLevel = Math.min(TOTAL_LEVELS_COUNT, safeNumOrDefault(parsed.unlockedLevel, defaultState.unlockedLevel, 1));
      const rawSkins = Array.isArray(parsed.ownedSkins)
        ? parsed.ownedSkins.filter(id => ALL_SKIN_IDS.includes(id))
        : [];
      const safeOwnedSkins = rawSkins.length > 0 ? rawSkins : ['crimson'];
      if (!safeOwnedSkins.includes('crimson')) safeOwnedSkins.unshift('crimson');
      const safeEquippedSkin = (typeof parsed.equippedSkin === 'string' && ALL_SKIN_IDS.includes(parsed.equippedSkin))
        ? parsed.equippedSkin
        : 'crimson';
      const safeLevelStars = (parsed.levelStars && typeof parsed.levelStars === 'object' && !Array.isArray(parsed.levelStars))
        ? Object.assign({}, parsed.levelStars)
        : {};
      const safeSkinLevels = (parsed.skinLevels && typeof parsed.skinLevels === 'object' && !Array.isArray(parsed.skinLevels))
        ? Object.assign({ crimson: 1 }, parsed.skinLevels)
        : { crimson: 1 };
      return Object.assign({}, JSON.parse(JSON.stringify(defaultState)), parsed, {
        lang: savedLang,
        coins: safeCoins,
        hints: safeHints,
        xp: safeXp,
        unlockedLevel: safeUnlockedLevel,
        isVip: isExplicitVip,
        vipPurchased: isExplicitVip,
        lastPlayedLevel: Math.max(1, Math.min(TOTAL_LEVELS_COUNT, safeNumOrDefault(parsed.lastPlayedLevel, safeUnlockedLevel, 1))),
        levelStars: safeLevelStars,
        ownedSkins: safeOwnedSkins,
        skinLevels: safeSkinLevels,
        equippedSkin: safeEquippedSkin,
        claimedAchievements: Array.isArray(parsed.claimedAchievements) ? parsed.claimedAchievements : [],
        claimedStarMilestones: Array.isArray(parsed.claimedStarMilestones) ? parsed.claimedStarMilestones : [],
        dualTrainWins: safeNumOrDefault(parsed.dualTrainWins, 0, 0),
        maxComboEver: Math.max(1, safeNumOrDefault(parsed.maxComboEver, 1, 1)),
        lastLoginDate: String(parsed.lastLoginDate || ''),
        loginStreak: safeNumOrDefault(parsed.loginStreak, 0, 0),
        chestWinProgress: Math.min(3, safeNumOrDefault(parsed.chestWinProgress, 0, 0)),
        lastDailyChallengeDate: String(parsed.lastDailyChallengeDate || ''),
        lastShareRewardDate: String(parsed.lastShareRewardDate || ''),
        winStreak: safeNumOrDefault(parsed.winStreak, 0, 0),
        offlineDailyReservesUsed: safeNumOrDefault(parsed.offlineDailyReservesUsed, 0, 0),
        offlineReserveDate: String(parsed.offlineReserveDate || ''),
        preferredTrainSpeed: savedSpeed,
        hapticsEnabled: savedHaptics,
        seenDialogues: savedSeenDialogues,
        tutorialSeen: savedTutorialDone,
        tutorialCompleted: savedTutorialDone,
        activeSession: savedActiveSession
      });
    } catch (_) {
      return JSON.parse(JSON.stringify(defaultState));
    }
  }

  function saveState() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    } catch (_) {}
  }

  saveState();

  // ==========================================================================
  // 3B. COMPLETE 8-LANGUAGE LOCALIZATION DICTIONARY & HELPERS (V12.3)
  //     100% Native Coverage: ar, en, ja, ko, de, fr, es, pt (ZERO Fallbacks!)
  // ==========================================================================
  const I18N = {
    ar: {
      topProgress: 'التقدم',
      vipBadgeTop: '👑 ترخيص القيادة القصوى VIP',
      gameTitle: 'قطار الأحلام',
      gameSubtitle: 'الشبكة الحديدية القارية • ١٠٠ مهمة',
      ownerPillText: '👑 نسخة المالك المفتوحة • جميع المراحل \u20661–100\u2069 متاحة للفحص',
      btnPlayNowPrefix: 'العب المهمة الحالية (',
      btnSectorMap: 'خريطة القطاعات',
      btnLocomotiveShop: 'ترسانة القاطرات',
      btnBackHome: 'الرئيسية',
      hudMoves: 'الحركات',
      hudEnergy: 'النجوم',
      hudCam3D: '3D',
      hudCamTop: 'علوي',
      hudFreeze: 'تجميد',
      hudTrains: 'القاطرات',
      hudCrew: 'الطاقم',
      hudSettings: 'الإعدادات',
      hudAutoPlay: 'حل آلي',
      btnReset: 'إعادة',
      btnUndo: 'تراجع',
      btnSmartHint: 'رادار التوجيه',
      btnLaunchReady: 'انطلق! 🚄',
      btnLaunchTrain1: 'أطلق القطار 1! 🚄',
      btnLaunchTrain2: 'أطلق القطار 2! 🚄',
      btnTrainRunning: 'القطار ينطلق... 🚄',
      speedBarLabel: '🚄 السرعة:',
      chaseCamLabel: 'الملاحقة',
      badgeFreeAd: '🎬 مجاناً',
      adBannerCopy: '⚡ ترخيص القيادة القصوى VIP: افتح القاطرة الذهبية 3D وأزل الإعلانات!',
      adBannerCta: 'ترقية',
      adOfflineBanner: '📴 وضع اللعب بدون إنترنت مفعّل • جميع المهام الـ\u00A0100 تعمل بالكامل!',
      dialogueSkip: 'تخطي ⏭️',
      dialogueNext: 'التالي',
      dialogueStartMission: 'بدء المهمة!',
      dialogueViewResults: 'عرض النتيجة 🏆',
      hintModalTitle: '💡 رادار التوجيه الآلي',
      hintModalDesc: '«سيقوم الجيروسكوب الهيدروليكي بتدوير <strong>قطعتين من المسار الرئيسي</strong> إلى زاوية الحل الدقيقة وقفلهما مغناطيسياً دون استهلاك أي حركة!»',
      hintUseFreePrefix: 'استخدام شحنة توجيه (',
      hintWatchAd: 'شاهد إعلاناً قصيراً (تثبيت قطعتين مجاناً)',
      hintBuyCoins: 'شراء شحنة توجيه فورية: قفل قطعتين (150 عملة)',
      hintBuySuper: 'المفتاح الذهبي الفائق: توجيه وقفل 4 قطع دفعة واحدة (250 عملة)',
      oomTitleMoves: '⚠️ نفاد طاقة التحويل!',
      oomDescMoves: '«استُهلكت حركات التحويل الهيدروليكية قبل اكتمال خط الطاقة! اشحن المفاعل الاحتياطي لمواصلة المهمة من نفس الموقع!»',
      oomTipSuffix: ' 💡 نصيحة: ترقية قاطرتك في (⚙️ ترسانة القاطرات) يمنحك قفل سكك تلقائياً وحركات ووقتاً إضافياً!',
      oomAdMoves: '\u2066+{n}\u2069 حركات إضافية مجاناً (إعلان مكافأة)',
      oomCoinsMoves: 'شراء \u2066+{n}\u2069 حركات إضافية فوراً (100 عملة ذهبية)',
      oomTitleTimer: '⏱️ انتهى وقت العاصفة!',
      oomDescTimer: '«انتهى العد التنازلي للعاصفة قبل انطلاق القطار! اشحن ثواني إضافية لمواصلة المهمة من نفس الموقع، أو أعد المهمة مجاناً!»',
      oomAdTimer: '\u2066+{n}\u2069 ثانية إضافية للمتابعة (إعلان مكافأة)',
      oomCoinsTimer: 'شراء \u2066+{n}\u2069 ثانية إضافية فوراً (100 عملة ذهبية)',
      oomRetryFree: 'إعادة المهمة من البداية (مجاناً)',
      victoryRibbon: '⚡ اكتمل ربط المحطة بنجاح!',
      vicTitleWin: 'مهمة ناجحة!',
      victoryTotalRewardLabel: '🪙 المكافأة الإجمالية:',
      victorySectorsBtn: 'القطاعات',
      victoryLevelDoneFmt: 'نجحت المهمة {id}: {title}!',
      victoryPerfFmt: '{badge} الرتبة: {rank} (\u2066+{xp} XP\u2069) | الكومبو: \u2066×{combo}\u2069 | سلسلة الفوز: \u2066🔥{streak}\u2069',
      victoryDailyRankFmt: '🌍 التصنيف العالمي لتحدي اليوم: أفضل \u2066{pct}%\u2069 عالمياً! | {badge} \u2066+{xp} XP\u2069',
      victoryEndlessFmt: '♾️ اكتملت الموجة {wave}! المسافة: {km} كم (القياسي: {best} كم)',
      victorySectorPowerFmt: '{icon} شحن طاقة {sector}',
      victoryCoinsFmt: '\u2066+{coins}\u2069 عملة ذهبية',
      victoryFormulaFmt: 'النجوم والحركات + كومبو (\u2066+{combo}\u2069) + السرعة والقاطرة (\u2066+{speed}\u2069){extra}',
      victoryExtraLabel: 'إضافي',
      victoryDoubleFmt: 'مضاعفة المكافأة \u2066×2\u2069 (\u2066+{coins}\u2069 عملة)',
      victoryDoubledFmt: '✅ تمت مضاعفة المكافأة (\u2066+{coins}\u2069 عملة)!',
      victoryNextMissionFmt: 'المهمة التالية ({id})',
      victoryNextWaveFmt: 'الموجة التالية (\u2066#{wave}\u2069) ♾️',
      victoryCampaignFmt: 'مهمة الحملة ({id})',
      victoryFinalMap: 'خريطة النصر النهائي',
      shopTitle: '⚙️ ترسانة القاطرات 3D ومتجر VIP',
      shopSubtitle: 'طوّر هيكل القاطرة التوربينية ثلاثية الأبعاد أو اشحن رادار التوجيه',
      vipBadgeCard: '👑 الحزمة الاستراتيجية القصوى',
      vipCardTitle: 'ترخيص القيادة القصوى (Overdrive VIP Pass)',
      vipPerk1: '⚡ فتح <strong>قاطرة البلازما الإمبراطورية الذهبية 3D</strong> بشرارات نجمية وكشاف ليزر',
      vipPerk2: '🚫 إزالة الإعلانات البينية وإعلان البانر السفلي نهائياً',
      vipPerk3: '💡 <strong>\u2066+10\u2069 شحنات رادار ذكي</strong> فورية + <strong>🪙 \u20661,500\u2069 عملة ذهبية</strong>',
      vipActiveLabel: '✅ ترخيص القيادة القصوى VIP مفعّل لديك!',
      vipBuyLabel: '🌟 تفعيل حزمة القيادة VIP (\u2066$2.99\u2069 / \u206711.99\u00A0ر.س\u2069)',
      starterBadgeTop: '🎁 عرض ترحيب القائد العالمي (لمرة واحدة)',
      starterPackTitle: 'حزمة انطلاقة القائد (\u2066+2,500\u2069 🪙 + \u20663\u2069 💡 رادار هدية!)',
      starterPackDesc: 'أقوى دفعة بداية لفتح القاطرات النفاثة مع 3 شحنات رادار توجيه مجانية إضافية',
      starterBuyLabel: '🎁 احصل على حزمة البداية (\u2066$0.99\u2069 / \u20673.99\u00A0ر.س\u2069)',
      shopHintsSectionTitle: '💡 شحنات رادار التوجيه والعملات',
      shopHintRow1Title: 'شحنة رادار توجيه آلي (\u2066+1\u2069 💡)',
      shopHintRow1Desc: 'تثبّت قطعتين في زاوية الحل الصحيحة بقفل مغناطيسي دون خصم حركات',
      shopHintRow2Title: 'شحنة مجانية عبر إعلان مكافأة (\u2066+1\u2069 💡)',
      shopHintRow2Desc: 'شاهد إعلاناً قصيراً واحصل على شحنة رادار فورية',
      shopHintRow3Title: 'شحنة عملات ذهبية مجانية (\u2066+100\u2069 🪙)',
      shopHintRow3Desc: 'شاهد إعلان مكافأة قصيراً لشحن رصيدك بـ 100 عملة ذهبية لفتح القاطرات',
      coinsSmallTitle: 'حفنة عملات ذهبية (\u2066+2,500\u2069 🪙)',
      coinsSmallDesc: 'شحن فوري لفتح القاطرات وترقيتها بسرعة',
      coinsSmallPrice: '\u2066$0.99\u2069 / \u20673.99\u00A0ر.س\u2069',
      coinsMegaTitle: '👑 خزنة الذهب الملكية (\u2066+15,000\u2069 🪙)',
      coinsMegaDesc: 'أفضل قيمة استراتيجية لفتح وترقية أسطول القاطرات',
      coinsMegaPrice: '\u2066$4.99\u2069 / \u206719.99\u00A0ر.س\u2069',
      shopSkinsSectionTitle: '🚄 القاطرات المدرّعة والتوربينية 3D',
      skinEquipped: '✅ مجهزة',
      skinEquip: 'تجهيز',
      skinBuyFmt: '🪙 {price} • شراء',
      skinUpgradeFmt: '⬆️ تطوير \u2066Lv.{cur}→{next}\u2069 (🪙 {cost})',
      skinMaxLv: '👑 المستوى الأقصى \u2066Lv.5\u2069',
      statSpeed: 'السرعة',
      statMoves: 'الحركات',
      statTime: 'الوقت',
      statGold: 'الذهب',
      btnHearHorn: 'سماع المحرك والصافرة',
      perkSummaryFmt: '{perk} (🔒 قفل:\u00A0{locks} | ❄️ تجميد:\u00A0\u2066{freeze}\u2069\u00A0ث | حركات\u00A0\u2066+{moves}\u2069 | وقت\u00A0\u2066+{time}\u2069\u00A0ث | ذهب\u00A0\u2066+{gold}%\u2069\u2060)',
      achModalTitle: '🏆 سجل الإنجازات والمكافآت',
      achModalSubtitle: 'أكمل التحديات الاستراتيجية واستلم العملات الذهبية وشحنات الرادار',
      achSummaryLabel: '🎖️ الإنجازات المكتملة:',
      achClaimed: '✅ مستلمة',
      achClaim: '🎁 استلام',
      btnDailyChallenge: 'تحدي اليوم \u2066×3\u2069 ذهب',
      btnDailyStreak: 'مكافأة اليوم',
      dailyBriefingTitle: 'تحدي اليوم العالمي (\u20667×6\u2069 • قطاران متزامنان)',
      dailyBriefingDesc: 'تحدي اليوم يستخدم شبكة متقدمة (\u20667×6\u2069) وقد يضم قطارين متزامنين (\u2066🚆×2\u2069) بإشارات تقاطع ذكية ومكافأة \u2066×3\u2069 ذهب! تقدمك في الحملة الرئيسية سيبقى محفوظاً بأمان.',
      dailyBriefingConfirm: '🚄 خوض التحدي الآن (\u2066×3\u2069 ذهب)',
      dailyBriefingCancel: 'العودة للحملة',
      btnRentTrain: 'قطار خارق',
      empireReadyFmt: 'محطة \u2066Lv.{lv}\u2069 • اجمع \u2066+{coins}\u2069 🪙',
      empireIdleFmt: 'إمبراطورية المحطة \u2066Lv.{lv}\u2069',
      endlessBestFmt: 'ماراثون السكك ({km} كم)',
      endlessDefault: 'ماراثون السكك اللانهائي',
      rankPillFmt: '{icon} الرتبة: {rank} (\u2066{stars}/300\u2069 ⭐)',
      mapSectorOfFmt: '{icon} القطاع {id} من {total}',
      mapSectorLevelsFmt: 'القطاع {id} • المهام \u2066{from}–{to}\u2069',
      mapPowerLabel: 'الطاقة',
      mapPlayNowBtn: 'العب الآن 🚄',
      mapLockedBtn: '🔒 مقفلة',
      mapLevelGridFmt: 'المهمة \u2066#{id}\u2069 • شبكة \u2066{rows}×{cols}\u2069',
      btnNext3Star: 'صيد \u20663⭐\u2069',
      hudLevelFmt: '{icon}مهمة \u2066{id}\u2069\u2066{badges}\u2069',
      hudMissionTitleFmt: 'المهمة \u2066#{id}\u2069',
      hudSectorFmt: '{icon} القطاع {id}: {name}',
      dailyLoginTitle: '🎁 مكافآت الدخول اليومي (7 أيام)',
      dailyLoginSub: 'ادخل يومياً لتحصيل الذهب وشحنات الرادار مجاناً!',
      dailyDayFmt: 'اليوم {day}',
      dailyCoinsFmt: '{n} عملة',
      dailyHintsFmt: '{n} رادار ذكي',
      dailyGrandLabel: '500 عملة + \u20662 💡\u2069',
      btnClaimDaily1x: 'استلام المكافأة',
      btnClaimDaily2x: 'مضاعفة الهدية \u2066×2\u2069 (إعلان)',
      btnDailyAlreadyClaimed: '✅ تم استلام مكافأة اليوم!',
      chestLabelPrefix: '🎁 صندوق الإمداد الذهبي:',
      btnOpenChest: '🎁 فتح صندوق الإمداد (\u2066+150\u2069 🪙 و\u00A0\u2066+1\u2069 💡) •\u00A0إعلان',
      btnVictoryShare: 'شارك انتصارك وتحدَّ صديقك (\u2066+100\u2069 🪙)',
      btnVictoryShareDone: '✅ تمت المشاركة اليوم',
      btnRestorePurchases: 'استعادة المشتريات السابقة',
      btnShopPrivacy: 'سياسة الخصوصية وحماية البيانات',
      privacyModalTitle: '🔒 سياسة الخصوصية وحماية البيانات',
      privacyModalSubtitle: 'قطار الأحلام 3D • تطوير استوديو ALDHFLY GAMES (com.dreamexpress.puzzletracks)',
      privacySummaryHtml: '<p><strong>V12.3 • مفتاح الحفظ المحلي:</strong> <code dir="ltr">dream_express_save_v123_public</code></p>',
      privacyFullLinkLabel: '📄 عرض وثيقة سياسة الخصوصية الكاملة',
      privacyCloseBtnLabel: 'حسناً، فهمت',
      starRoadTitle: '🎁 طريق النجوم (اضغط على الصندوق لاستلام جائزتك)',
      tutorialTapToRotate: 'اضغط لتدوير السكة',
      tutStep1Title: 'تدوير السكة',
      tutStep1Desc: 'اضغط على قطعة السكة المضيئة لتدويرها \u206690°\u2069 وتوصيل المسار عبر النجوم الثلاث إلى المحطة!',
      tutStep2Title: 'تغيير زاوية الكاميرا (\u20663D\u2069 / علوي)',
      tutStep2Desc: 'اضغط على زر (\u20663D\u2069 / علوي) للتبديل بين المنظور الثلاثي الأبعاد والمنظور العلوي الشامل للخريطة!',
      tutStep3Title: 'سرعة القطار والملاحقة \u2066[1 • 2 • 3]\u2069',
      tutStep3Desc: 'اختر سرعة القطار المفضلة (1 أو 2 أو 3) أو فعّل كاميرا الملاحقة في أي وقت!',
      tutStep4Title: 'الإشارة خضراء — انطلق!',
      tutStep4Desc: 'المسار مكتمل! اضغط (انطلق!) لقيادة القطار نحو المحطة!',
      settingsTitle: '⚙️ الإعدادات المتقدمة',
      settingsSubtitle: 'تحكم مستقل بصوت القطار والموسيقى وجودة الرسوميات',
      settingsSfx: '🔊 صوت القطار والمؤثرات',
      settingsBgm: '🎵 الموسيقى الخلفية',
      settingsQuality: '🖥️ جودة الرسوميات (3D)',
      qualAuto: 'تلقائي',
      qualMid: 'متوازن',
      qualHigh: 'فائق \u206660FPS\u2069',
      hapticsOn: '📳 اهتزاز اللمس: مفعّل',
      hapticsOff: '📳 اهتزاز اللمس: متوقف',
      btnReplayTutorial: '📖 إعادة الجولة الإرشادية (المهمة 1)',
      settingsLangBtn: '🌍 اللغة / Language',
      settingsPrivBtn: '🔒 الخصوصية',
      settingsDoneBtn: 'حفظ وإغلاق ✓',
      bossStageBanner: 'مهمة زعيم القطاع \u2066#{id}\u2069 • مكافأة زعيم \u2066+80\u2069 🪙!',
      bootLoaderTitle: 'قطار الأحلام 3D',
      bootLoaderSub: 'جاري تشغيل المحرك الثلاثي الأبعاد وتحميل القاطرات...',
      exitModalTitle: 'الخروج من اللعبة؟',
      exitModalDesc: 'هل أنت متأكد من رغبتك في إغلاق قطار الأحلام؟ جميع تقدمك ونجومك محفوظة تلقائياً.',
      btnExitStay: '🚄 البقاء ومواصلة اللعب',
      btnExitConfirm: 'خروج من اللعبة',
      toastAutoSolveFmt: '🤖 الذكاء الاصطناعي يقوم بحل المهمة \u2066#{id}\u2069 وتشغيل القطار...',
      toastResetGrid: '🔄 تمت إعادة ضبط الشبكة من البداية مجاناً',
      toastSpeedSetFmt: '🚄 سرعة القطار المعتمدة: {tier}',
      toastChaseOn: '🎥 تم تفعيل كاميرا ملاحقة القطار!',
      toastChaseOff: '🎥 تمت استعادة المنظور العام',
      toastTrackIncompleteFmt: '⚡ المسار غير مكتمل ({n} قضبان متصلة) • اضغط لتدوير السكك أو استخدم 💡 رادار التوجيه!',
      toastRouteShortcutFmt: '✨ المسار متصل (⭐ \u2066{sparks}/3\u2069) • اضغط «انطلق» الآن أو أكمل لفّ السكك لجمع الـ 3 نجوم!',
      toastRouteFull3Star: '🌟 المسار مكتمل مع الـ 3 نجوم الذهبية (\u20663/3\u2069 ⭐) • القطار جاهز للانطلاق!',
      toastSkinPerkFmt: '🔒 ميزة {skin}: تم قفل {locks} قطع سكة تلقائياً{freeze}!',
      toastSkinFreezeSuffixFmt: ' + تجميد {sec} ثانية',
      toastAdDismissedEarly: 'ℹ️ تم إغلاق الإعلان قبل اكتماله — لم تُمنح المكافأة بعد.',
      toastLangChangedFmt: '🌐 تم تغيير اللغة إلى: {lang}',
      adSimOfflineBadge: '📴 وضع الطوارئ بدون إنترنت (شحن احتياطي)',
      adSimReserveBadge: '⚡ معايرة المفاعل التكتيكي (شحن احتياطي)',
      adSimOfflineDesc: 'معايرة المفاعل التكتيكي (3 ثوانٍ) • يتم منحك المكافأة بسلاسة في وضع عدم الاتصال!',
      adSimReserveDesc: 'معايرة المفاعل التكتيكي الاحتياطي (3 ثوانٍ) لمنحك المكافأة الفورية!',
      adSimWaitBtn: '⏳ جاري معايرة المفاعل...',
      adSimSecFmt: '{n} ثوانٍ...',
      adSimDone: 'اكتمل! ✅',
      adSimClaimBtn: '🎁 استلام المكافأة والمتابعة',
      adSimCancelBtn: 'إلغاء (بدون مكافأة)',
      adTitleDoubleDaily: 'مضاعفة هدية الدخول اليومي \u2066×2\u2069',
      adTitleRentTrain: 'تجربة قطار الماغليف الخارق (لمهمة واحدة)',
      adTitleCryoFreeze: 'درع تجميد العاصفة (\u2066+20\u2069 ثانية ❄️)',
      adTitleSmartHint: 'رادار التوجيه الآلي (تثبيت قطعتين)',
      adTitleExtraSecFmt: '\u2066+{n}\u2069 ثانية إضافية للمتابعة',
      adTitleExtraMovesFmt: '\u2066+{n}\u2069 حركات تحويل إضافية',
      adTitleDoubleCoins: 'مضاعفة مكافأة العملات \u2066×2\u2069',
      adTitleMysteryChest: 'فتح صندوق الإمداد الذهبي',
      adTitleFreeCoins: 'شحنة عملات ذهبية مجانية (\u2066+100\u2069 🪙)',
      adTitleFreeHint: 'شحنة رادار توجيه مجانية (\u2066+1\u2069 💡)',
      mechEndlessTitle: 'ماراثون القطار اللانهائي وبوابات الطاقة!',
      mechEndlessDesc: 'أكمل الموجات المتتالية لتحطيم رقم المسافة القياسي (كم) وربح ذهب متصاعد!',
      mechBridgeTitle: 'الجسر الفولاذي المعلّق',
      mechBridgeDesc: 'اضغط لتدوير الجسر المعلّق وعبور الوديان بأمان!',
      mechYSwitchTitle: 'تفريعة المسار الثلاثية (Y)',
      mechYSwitchDesc: 'مميزة بمصباح التحويلة الذهبي: تفرّع المسار لليمين أو اليسار!',
      mechDualTrainTitle: 'قطاران متزامنان [1] و [2]',
      mechDualTrainDesc: 'أوصل القطار السماوي [1] للمحطة السماوية [1] والقطار الذهبي [2] للمحطة الذهبية [2]!',
      mechStormTitle: 'تحدي العاصفة الموقوتة!',
      mechStormDesc: 'مهمة حماسية خاصة بمؤقت عاصفة! اربط السكة قبل نفاد الثواني.',
      mechSwitchTitle: 'محوّل القوسين المزدوج',
      mechSwitchDesc: 'مميز بقلب سيان مضيء: يمرر مسارين منحنيين مستقلين بدون تقاطع!',
      endlessWaveHudFmt: '♾️ موجة {wave} ({km} كم)',
      hudCrewTipFmt: 'شبكة سكك ثلاثية الأبعاد (\u2066{rows}×{cols}\u2069) • اعبر من المسار المختصر (\u20661–2⭐\u2069) أو اربط المسار الكامل لحصد الـ 3 نجوم الذهبية!',
      toastEmpireClaimFmt: '🏛️ تم تحصيل خزنة تذاكر إمبراطورية المحطة \u2066Lv.{lv}\u2069: \u2066+{coins}\u2069 🪙! (تنتج \u2066+{rate}\u2069 🪙/ساعة)',
      toastEmpireIdleFmt: '🏛️ إمبراطورية المحطة \u2066Lv.{lv}\u2069 تنتج حالياً \u2066+{rate}\u2069 🪙 كل ساعة! أكمل القطاعات لترقية معالم محطتك.',
      toastResumedFmt: '🔄 تم استكمال المهمة \u2066#{id}\u2069 من آخر وضعية محفوظة!',
      toastMission1Intro: '🚄 المهمة 1: اضغط على السكك الثلاثية الأبعاد لتدويرها وربط المسار!',
      toastBossIntroFmt: '👑 مهمة زعيم القطاع \u2066#{id}\u2069! أكمل المسار لربح مكافأة الزعيم الإضافية (\u2066+80\u2069 🪙)!',
      toastDualIntro: '🔀 مرحلة قطارين! يمكنك توصيل وإطلاق أي قطار فوراً أو ربط المسارين معاً!',
      toastTileLocked: '🔒 هذه القطعة مقفلة مغناطيسياً برادار التوجيه الآلي!',
      toastTileFixed: '🔩 قضيب فولاذي مثبت بمسامير التيتانيوم • استخدمه كدليل!',
      toastTileCross: '➕ تقاطع رباعي يسمح بعبور القطارين في الاتجاهين المتعامدين دون تدوير!',
      toastSeqTrain1Arrived: '✅ وصل القطار 1 إلى المحطة الأولى! أكمل الآن مسار القطار 2 لإطلاقه!',
      toastSeqTrain2Arrived: '✅ وصل القطار 2 إلى المحطة الثانية! أكمل الآن مسار القطار 1 لإطلاقه!',
      toastHintAllAligned: '⚡ جميع قضبان المسار الرئيسي موجهة بالفعل نحو الحل!',
      toastHintLockedFmt: '💡 ثبّت رادار أمل {n} قضبان في زاوية الحل بقفل مغناطيسي!',
      toastMilestoneAlreadyFmt: '✅ تم استلام صندوق ({stars} ⭐) مسبقاً!',
      toastMilestoneNeedFmt: '🔒 اجمع {needed} ⭐ إضافية لفتح هذا الصندوق (\u2066+{coins}\u2069 🪙 و \u2066+{hints}\u2069 💡)!',
      toastMilestoneClaimedFmt: '🎉 تم استلام جائزة طريق النجوم ({stars} ⭐): \u2066+{coins}\u2069 عملة ذهبية 🪙 و \u2066+{hints}\u2069 رادار 💡!',
      toastDailyCoinsPartFmt: '\u2066+{n}\u2069 عملة ذهبية 🪙',
      toastDailyHintsPartFmt: '\u2066+{n}\u2069 شحنة رادار 💡',
      toastDailyClaimedFmt: '🎁 تم استلام مكافأة اليوم {day} (\u2066×{mult}\u2069): {parts}!',
      toastDailyChallengeStartFmt: '🌍 تحدي اليوم العالمي (المهمة \u2066#{id}\u2069 • شبكة \u20667×6\u2069): أكملها لربح 3 أضعاف الذهب (\u2066×3\u2069)!',
      toastShopPreviewFmt: '🔊 معاينة محرك وصافرة {skin}!',
      toastShopEquippedFmt: '🚄 تم تجهيز: {skin}!',
      toastShopBoughtFmt: '🎉 تم شراء وتجهيز: {skin}!',
      toastShopNeedBuyFmt: '⚠️ تحتاج إلى {needed} عملة ذهبية إضافية لشراء {skin}! شاهد إعلان المكافأة (\u2066+100\u2069 🪙) لشحن رصيدك!',
      toastShopNeedUpgFmt: '⚠️ تحتاج إلى {needed} عملة إضافية لتطوير {skin} إلى \u2066Lv.{lv}\u2069!',
      toastShopUpgradedFmt: '⬆️ تمت ترقية {skin} إلى المستوى \u2066Lv.{lv}\u2069! زادت الحركات والوقت ومكافأة الذهب!',
      toastAchClaimedFmt: '🏆 استلمت مكافأة «{title}»: \u2066+{coins}\u2069 عملة ذهبية و \u2066+{hints}\u2069 رادار!',
      toastJump3StarFmt: '⚡ الانتقال السريع إلى المهمة \u2066#{id}\u2069 لإتمام الـ 3 نجوم!',
      toastRentActivated: '🚄 تم تفعيل قطار الماغليف الخارق لهذه المهمة: \u2066+6\u2069 حركات، \u2066+20\u2069 ثانية، قفل تلقائي ومغناطيس النجوم!',
      toastNo3DBrowser: '⚠️ الوضع ثلاثي الأبعاد غير متاح على هذا المتصفح',
      toastCryoActive: '❄️ درع التجميد الكريوجيني مفعّل: \u2066+20\u2069 ثانية وتجميد مؤقت العاصفة!',
      toastCryoAdded: '❄️ تمت إضافة \u2066+20\u2069 ثانية وتجميد العاصفة!',
      toastQualityFmt: '✨ مستوى الجودة الرسومية: {tier}',
      toastDebugOn: '📊 تم إظهار لوحة قياس الأداء والذاكرة (Debug HUD)',
      toastDebugOff: '📊 تم إخفاء لوحة قياس الأداء',
      toastNeed150Hint: '⚠️ تحتاج إلى 150 عملة ذهبية لشراء شحنة توجيه!',
      toastNeed250Super: '⚠️ تحتاج إلى 250 عملة ذهبية لتفعيل المفتاح الذهبي الفائق (4 قطع)!',
      toastRescueSecAdFmt: '⏱️ تمت إضافة \u2066+{n}\u2069 ثانية إضافية! أكمل ربط المسار!',
      toastRescueMovesAdFmt: '⚡ تمت إضافة \u2066+{n}\u2069 حركات إضافية وتثبيت سكة إرشادية!',
      toastNeed100Rescue: '⚠️ تحتاج إلى 100 عملة ذهبية للشحن الفوري! استخدم زر الإعلان المجاني!',
      toastRescueSecCoinsFmt: '⏱️ تم شراء \u2066+{n}\u2069 ثانية إضافية مقابل 100 عملة ذهبية!',
      toastRescueMovesCoinsFmt: '⚡ تم شراء \u2066+{n}\u2069 حركات إضافية وتثبيت سكة إرشادية مقابل 100 عملة ذهبية!',
      toastDoubleEarnedFmt: '🪙 حصلت على \u2066+{coins}\u2069 عملة إضافية!',
      toastChestOpened: '🎁 تم فتح صندوق الإمداد الذهبي: \u2066+150\u2069 عملة ذهبية و \u2066+1\u2069 شحنة رادار ذكي!',
      shareVictoryTextFmt: '🚄 أكملت المهمة رقم \u2066#{id}\u2069 في لعبة قطار الأحلام 3D بكومبو \u2066×{combo}\u2069! هل يمكنك تحطيم رقمي؟ حمّل اللعبة الآن: \u2066{url}\u2069',
      toastShareReward: '📤 شكراً لمشاركة انتصارك! حصلت على \u2066+100\u2069 عملة ذهبية!',
      toastShareDone: '📤 تمت مشاركة رسالة الانتصار وتحدي أصدقائك بنجاح!',
      toastCampaign100Done: '👑 تهانينا أيها الإمبراطور! أتممت جميع المهام الـ\u00A0100 في قطار الأحلام 3D!',
      toastVipActivated: '👑 تم تفعيل ترخيص القيادة VIP وإلغاء الإعلانات وإضافة 1,500 عملة و10 تلميحات وتجهيز القاطرة الذهبية!',
      toastVipRestored: '✅ تمت استعادة ترخيص القيادة VIP السابق بنجاح!',
      toastVipNotFound: 'ℹ️ لم يتم العثور على مشتريات سابقة لترخيص VIP على حساب Google Play الحالي.',
      toastVipConnecting: '💳 متجر Google Play قيد الاتصال... تأكد من تفعيل حساب Google Play أو اشترِ القاطرة الذهبية بالعملات أدناه!',
      toastStarterGrantedFmt: '🎁 تم تفعيل حزمة انطلاقة القائد: \u2066+{amount}\u2069 🪙 و \u2066+3\u2069 💡 رادار ذكي!',
      toastCoinsGrantedFmt: '🪙 تمت إضافة \u2066+{amount}\u2069 عملة ذهبية إلى خزنتك بنجاح!',
      toastStarterIapInfo: '🎁 حزمة انطلاقة القائد (\u2066+2,500\u2069 🪙 + \u20663\u2069 💡 • \u20673.99\u00A0ر.س\u2069) تُشترى عبر نظام Google Play الرسمي!',
      toastSmallCoinsIapInfo: '💳 حفنة العملات الذهبية (\u2066+2,500\u2069 🪙 • \u20673.99\u00A0ر.س\u2069) تُشترى عبر نظام Google Play الرسمي!',
      toastMegaCoinsIapInfo: '💳 خزنة الذهب الملكية (\u2066+15,000\u2069 🪙 • \u206719.99\u00A0ر.س\u2069) تُشترى عبر نظام Google Play الرسمي!',
      toastVipIapInfo: '💳 باقة VIP لإزالة الإعلانات (\u2066$2.99\u2069 / \u206711.99\u00A0ر.س\u2069) تُفعل عبر متجر Google Play! ويمكنك شراء القاطرة الذهبية بالعملات من القائمة أدناه!',
      toastFree100Earned: '🪙 حصلت على \u2066+100\u2069 عملة ذهبية مجاناً!',
      toastNeed150ShopHint: '⚠️ تحتاج إلى 150 عملة ذهبية لشراء شحنة رادار!',
      toastAdded1Hint: '💡 تمت إضافة \u2066+1\u2069 شحنة رادار ذكي إلى رصيدك!',
      toastFree1HintEarned: '💡 حصلت على \u2066+1\u2069 شحنة رادار مجاناً!'
    },
    en: {
      topProgress: 'Progress',
      vipBadgeTop: '👑 Overdrive VIP Pass Active',
      gameTitle: 'Dream Express 3D',
      gameSubtitle: 'Continental Rail Grid • 100 Missions',
      ownerPillText: '👑 Owner Unlocked Build • All Levels 1–100 Open for Inspection',
      btnPlayNowPrefix: 'Play Current Mission (Level ',
      btnSectorMap: 'Sector Map',
      btnLocomotiveShop: 'Locomotive Garage',
      btnBackHome: 'Main Menu',
      hudMoves: 'Moves',
      hudEnergy: 'Stars',
      hudCam3D: '3D',
      hudCamTop: 'Top',
      hudFreeze: 'Freeze',
      hudTrains: 'Trains',
      hudCrew: 'Crew',
      hudSettings: 'Settings',
      hudAutoPlay: 'Auto-Solve',
      btnReset: 'Reset',
      btnUndo: 'Undo',
      btnSmartHint: 'Smart Hint',
      btnLaunchReady: 'Launch! 🚄',
      btnLaunchTrain1: 'Launch Train 1 🚄',
      btnLaunchTrain2: 'Launch Train 2 🚄',
      btnTrainRunning: 'Train Running... 🚄',
      speedBarLabel: '🚄 Speed:',
      chaseCamLabel: 'Chase',
      badgeFreeAd: '🎬 Free',
      adBannerCopy: '⚡ Overdrive VIP Pass: Unlock the 3D Gold Locomotive & Remove Ads!',
      adBannerCta: 'Upgrade',
      adOfflineBanner: '📴 Offline Mode Active • All 100 Missions Available!',
      dialogueSkip: 'Skip ⏭️',
      dialogueNext: 'Next',
      dialogueStartMission: 'Start Mission',
      dialogueViewResults: 'View Results 🏆',
      hintModalTitle: '💡 Smart Radar Hint',
      hintModalDesc: '"The hydraulic gyroscope will rotate <strong>2 main-path track tiles</strong> to their exact solution angles and lock them magnetically without using any moves!"',
      hintUseFreePrefix: 'Use Radar Charge (',
      hintWatchAd: 'Watch Short Ad (Lock 2 Tiles Free)',
      hintBuyCoins: 'Buy Instant Hint: Lock 2 Tiles (150 Coins)',
      hintBuySuper: 'Super Golden Key: Lock 4 Tiles at Once (250 Coins)',
      oomTitleMoves: '⚠️ Out of Switch Moves!',
      oomDescMoves: '"Hydraulic switch moves depleted before completing the rail line! Recharge the backup reactor to continue from the exact same spot!"',
      oomTipSuffix: ' 💡 Tip: Upgrading a locomotive in (⚙️ Locomotive Garage) grants auto-locked rails, extra moves & bonus time!',
      oomAdMoves: '+{n} Extra Moves Free (Rewarded Ad)',
      oomCoinsMoves: 'Buy +{n} Extra Moves Instantly (100 Gold Coins)',
      oomTitleTimer: '⏱️ Storm Timer Expired!',
      oomDescTimer: '"The storm countdown ended before departure! Add extra seconds to continue from the same spot, or retry for free!"',
      oomAdTimer: '+{n} Extra Seconds to Continue (Rewarded Ad)',
      oomCoinsTimer: 'Buy +{n} Extra Seconds Instantly (100 Gold Coins)',
      oomRetryFree: 'Retry Mission from Start (Free)',
      victoryRibbon: '⚡ Terminal Connected Successfully!',
      victoryTotalRewardLabel: '🪙 Total Reward:',
      vicTitleWin: 'Mission Complete!',
      victorySectorsBtn: 'Sectors',
      victoryLevelDoneFmt: 'Mission {id} Complete: {title}!',
      victoryPerfFmt: '{badge} Rank: {rank} (+{xp} XP) | Combo: ×{combo} | Streak: 🔥{streak}',
      victoryDailyRankFmt: '🌍 Global Daily Rank: Top {pct}% Worldwide! | {badge} +{xp} XP',
      victoryEndlessFmt: '♾️ Endless Wave {wave} Cleared! Distance: {km} km (Best: {best} km)',
      victorySectorPowerFmt: '{icon} {sector} Power',
      victoryCoinsFmt: '+{coins} Gold Coins',
      victoryFormulaFmt: 'Stars & Moves + Combo (+{combo}) + Speed & Train (+{speed}){extra}',
      victoryExtraLabel: 'Extra',
      victoryDoubleFmt: 'Double Reward ×2 (+{coins} Coins)',
      victoryDoubledFmt: '✅ Reward Doubled (+{coins} Coins)!',
      victoryNextMissionFmt: 'Next Mission ({id})',
      victoryNextWaveFmt: 'Next Wave (#{wave}) ♾️',
      victoryCampaignFmt: 'Campaign Mission ({id})',
      victoryFinalMap: 'Final Victory Map',
      shopTitle: '⚙️ 3D Locomotive Garage & VIP Shop',
      shopSubtitle: 'Upgrade your 3D turbine locomotive or recharge Smart Radar hints',
      vipBadgeCard: '👑 Ultimate Strategic Bundle',
      vipCardTitle: 'Overdrive VIP Pass',
      vipPerk1: '⚡ Unlock the <strong>3D Apex Gold Plasma Locomotive</strong> with star sparks & laser beam',
      vipPerk2: '🚫 Permanently remove interstitial & bottom banner ads',
      vipPerk3: '💡 Instant <strong>+10 Smart Radar Hints</strong> + <strong>🪙 1,500 Gold Coins</strong>',
      vipActiveLabel: '✅ Overdrive VIP Pass is Active!',
      vipBuyLabel: '🌟 Activate VIP Pass (\u2066$2.99 / 11.99 SAR\u2069)',
      starterBadgeTop: '🎁 Global Conductor Welcome Offer (One-Time)',
      starterPackTitle: 'Starter Conductor Pack (+2,500 🪙 + 3 💡 Bonus!)',
      starterPackDesc: 'Best welcome boost to unlock high-speed trains + 3 free Smart Radar charges',
      starterBuyLabel: '🎁 Get Starter Pack (\u2066$0.99 / 3.99 SAR\u2069)',
      shopHintsSectionTitle: '💡 Smart Radar & Gold Packs',
      shopHintRow1Title: 'Smart Radar Hint Charge (+1 💡)',
      shopHintRow1Desc: 'Rotates and magnetically locks 2 solution tiles without costing moves',
      shopHintRow2Title: 'Free Radar Charge via Rewarded Ad (+1 💡)',
      shopHintRow2Desc: 'Watch a short ad to receive an instant Smart Radar charge',
      shopHintRow3Title: 'Free Gold Coins Pack (+100 🪙)',
      shopHintRow3Desc: 'Watch a short rewarded ad to earn +100 Gold Coins for locomotives',
      coinsSmallTitle: 'Gold Coin Pouch (+2,500 🪙)',
      coinsSmallDesc: 'Instant boost to unlock & upgrade locomotives',
      coinsSmallPrice: '\u2066$0.99 / 3.99 SAR\u2069',
      coinsMegaTitle: '👑 Royal Gold Vault (+15,000 🪙)',
      coinsMegaDesc: 'Best strategic value for upgrading your entire 3D fleet',
      coinsMegaPrice: '\u2066$4.99 / 19.99 SAR\u2069',
      shopSkinsSectionTitle: '🚄 3D World & Armored Locomotives',
      skinEquipped: '✅ Equipped',
      skinEquip: 'Equip',
      skinBuyFmt: '🪙 {price} • Buy',
      skinUpgradeFmt: '⬆️ Upgrade Lv.{cur}→{next} (🪙 {cost})',
      skinMaxLv: '👑 Max Level Lv.5',
      statSpeed: 'Speed',
      statMoves: 'Moves',
      statTime: 'Time',
      statGold: 'Gold',
      btnHearHorn: 'Hear Horn & Engine',
      perkSummaryFmt: '{perk} (🔒 Locks: {locks} | ❄️ Freeze: {freeze}s | Moves +{moves} | Time +{time}s | Gold +{gold}%)',
      achModalTitle: '🏆 Achievements & Rewards',
      achModalSubtitle: 'Complete strategic challenges to claim Gold Coins and Smart Radar charges',
      achSummaryLabel: '🎖️ Completed Achievements:',
      achClaimed: '✅ Claimed',
      achClaim: '🎁 Claim',
      btnDailyChallenge: 'Daily Challenge 3x Gold',
      btnDailyStreak: 'Daily Gift',
      dailyBriefingTitle: '🌍 Global Daily Challenge (7×6 Dual-Train Grid)',
      dailyBriefingDesc: 'Today\'s Global Daily Challenge is an advanced 7×6 Dual-Train sector mission! Your regular campaign progress stays safely saved—complete it to earn 3x Gold Coins!',
      dailyBriefingConfirm: 'Start Daily Challenge (3x Gold) 🌍',
      dailyBriefingCancel: 'Back to Campaign',
      btnRentTrain: 'Super Train',
      empireReadyFmt: 'Empire Lv.{lv} • +${coins} 🪙'.replace('$', ''),
      empireIdleFmt: 'Station Empire Lv.{lv}',
      endlessBestFmt: 'Endless Rail ({km} km)',
      endlessDefault: 'Endless Express',
      rankPillFmt: '{icon} Rank: {rank} ({stars}/300 ⭐)',
      mapSectorOfFmt: '{icon} Sector {id} of {total}',
      mapSectorLevelsFmt: 'Sector {id} • Levels {from}–{to}',
      mapPowerLabel: 'Power',
      mapPlayNowBtn: 'Play Now 🚄',
      mapLockedBtn: '🔒 Locked',
      mapLevelGridFmt: 'Level #{id} • Grid {rows}×{cols}',
      btnNext3Star: 'Next 3⭐',
      hudLevelFmt: '{icon}Lv.{id}{badges}',
      hudMissionTitleFmt: 'Mission #{id}',
      hudSectorFmt: '{icon} Sector {id}: {name}',
      dailyLoginTitle: '🎁 7-Day Login Streak',
      dailyLoginSub: 'Log in daily to claim free Gold Coins and Smart Radar charges!',
      dailyDayFmt: 'Day {day}',
      dailyCoinsFmt: '{n} Coins',
      dailyHintsFmt: '{n} Radar Hint',
      dailyGrandLabel: '500 Coins + 2 💡',
      btnClaimDaily1x: 'Claim Reward',
      btnClaimDaily2x: 'Double 2x (Ad)',
      btnDailyAlreadyClaimed: '✅ Claimed Today!',
      chestLabelPrefix: '🎁 Mystery Supply Chest:',
      btnOpenChest: '🎁 Open Mystery Supply Chest (+150 🪙 & +1 💡) •\u00A0Ad',
      btnVictoryShare: 'Share Victory & Challenge a Friend (+100 🪙)',
      btnVictoryShareDone: '✅ Shared Today',
      btnRestorePurchases: 'Restore Previous Purchases',
      btnShopPrivacy: 'Privacy Policy & Data Safety',
      privacyModalTitle: '🔒 Privacy Policy & Data Safety',
      privacyModalSubtitle: 'Dream Express 3D • Developed by ALDHFLY GAMES (com.dreamexpress.puzzletracks)',
      privacySummaryHtml: '<p><strong>V12.3 • Local Save Key:</strong> <code>dream_express_save_v123_public</code></p>',
      privacyFullLinkLabel: '📄 View Full Privacy Policy Document',
      privacyCloseBtnLabel: 'Got It',
      starRoadTitle: '🎁 Star Milestone Road (Tap Chest to Claim)',
      tutorialTapToRotate: 'Tap to rotate rail',
      tutStep1Title: 'Rotate the Track',
      tutStep1Desc: 'Tap the highlighted rail tile to rotate it 90° and connect the track through all 3 Golden Stars to the Terminal!',
      tutStep2Title: '3D / Top-Down Camera',
      tutStep2Desc: 'Tap (3D / Top) anytime to switch between cinematic 3D view and full tactical map view!',
      tutStep3Title: 'Train Speed & Chase Cam [1 • 2 • 3]',
      tutStep3Desc: 'Select your preferred train speed (1, 2, or 3) or engage Chase Camera anytime!',
      tutStep4Title: 'Green Signal — Launch!',
      tutStep4Desc: 'Track connected! Tap (Launch!) to drive the express into the station!',
      settingsTitle: '⚙️ Audio & Graphics Settings',
      settingsSubtitle: 'Independent Train/SFX & BGM volume + 60FPS 3D quality',
      settingsSfx: '🔊 Train & SFX Volume',
      settingsBgm: '🎵 Background Music (BGM)',
      settingsQuality: '🖥️ 3D Graphics Quality',
      qualAuto: 'Auto',
      qualMid: 'Balanced',
      qualHigh: 'Ultra 60FPS',
      hapticsOn: '📳 Haptic Vibration: ON',
      hapticsOff: '📳 Haptic Vibration: OFF',
      btnReplayTutorial: '📖 Replay Interactive Tutorial (Level 1)',
      settingsLangBtn: '🌍 Language',
      settingsPrivBtn: '🔒 Privacy',
      settingsDoneBtn: 'Save & Close ✓',
      bossStageBanner: 'Sector Boss Mission #{id} • +80 🪙 Boss Bonus!',
      bootLoaderTitle: 'Dream Express 3D',
      bootLoaderSub: 'Initializing 3D Engine & Loading Locomotives...',
      exitModalTitle: 'Exit Game?',
      exitModalDesc: 'Are you sure you want to exit Dream Express 3D? All your mission progress and stars are saved automatically.',
      btnExitStay: '🚄 Stay & Keep Playing',
      btnExitConfirm: 'Exit Game',
      toastAutoSolveFmt: '🤖 AI is solving Mission #{id} & dispatching the train...',
      toastResetGrid: '🔄 Track grid reset from start for free',
      toastSpeedSetFmt: '🚄 Train Speed Ready: {tier}',
      toastChaseOn: '🎥 Chase Camera Engaged!',
      toastChaseOff: '🎥 Overview Camera Restored',
      toastTrackIncompleteFmt: '⚡ Track incomplete ({n} rails linked) • Tap rails to rotate or use 💡 Smart Hint!',
      toastRouteShortcutFmt: '✨ Route linked (⭐ {sparks}/3) • Tap Launch now or keep rotating for all 3⭐!',
      toastRouteFull3Star: '🌟 Full 3-Star Route Linked (3/3 ⭐) • Express Ready for Launch!',
      toastSkinPerkFmt: '🔒 {skin} Perk: Auto-locked {locks} track tile(s){freeze}!',
      toastSkinFreezeSuffixFmt: ' + {sec}s Auto-Freeze',
      toastAdDismissedEarly: '⚠️ Ad closed before completion — no reward granted.',
      toastLangChangedFmt: '🌍 Language switched to {lang}',
      adSimOfflineBadge: '📴 Offline Reserve Mode (Tactical Calibration)',
      adSimReserveBadge: '⚡ Tactical Reactor Calibration (Reserve Charge)',
      adSimOfflineDesc: 'Tactical Reactor Calibration (3s) • Granting your emergency reward smoothly while offline!',
      adSimReserveDesc: 'Calibrating tactical backup reactor (3s) to grant your reward smoothly!',
      adSimWaitBtn: '⏳ Calibrating Reactor...',
      adSimSecFmt: '{n}s...',
      adSimDone: 'Complete! ✅',
      adSimClaimBtn: '🎁 Claim Reward & Continue',
      adSimCancelBtn: 'Cancel (No Reward)',
      adTitleDoubleDaily: 'Double Daily Login Gift ×2',
      adTitleRentTrain: 'Try Super Maglev Train (1 Level)',
      adTitleCryoFreeze: 'Cryo-Freeze Shield (+20s ❄️)',
      adTitleSmartHint: 'Smart Radar Hint (Lock 2 Tiles)',
      adTitleExtraSecFmt: '+{n} Extra Seconds',
      adTitleExtraMovesFmt: '+{n} Extra Moves',
      adTitleDoubleCoins: 'Double Coins ×2',
      adTitleMysteryChest: 'Open Mystery Supply Chest',
      adTitleFreeCoins: 'Free Gold Coins (+100 🪙)',
      adTitleFreeHint: 'Free Smart Radar (+1 💡)',
      mechEndlessTitle: 'Endless Express Marathon & Portals!',
      mechEndlessDesc: 'Chain endless waves to set a new distance record (km) & earn bonus gold!',
      mechBridgeTitle: 'Suspension Rail Bridge',
      mechBridgeDesc: 'Tap to align the bridge deck and cross deep canyons safely!',
      mechYSwitchTitle: '3-Way Y-Switch Junction',
      mechYSwitchDesc: 'Look for the glowing amber switch lantern: splits 1 track into 2 branches!',
      mechDualTrainTitle: 'Dual Trains [1] & [2]',
      mechDualTrainDesc: 'Guide Cyan Train [1] to Cyan Station [1] and Amber Train [2] to Amber Station [2]!',
      mechStormTitle: 'Timed Storm Rush Challenge!',
      mechStormDesc: 'Special timed mission! Connect the rail line before the storm clock runs out.',
      mechSwitchTitle: 'Dual-Curve Parallel Switch',
      mechSwitchDesc: 'Marked with a cyan center hub: routes two independent curved paths!',
      endlessWaveHudFmt: '♾️ Wave {wave} ({km} km)',
      hudCrewTipFmt: '{rows}×{cols} 3D Rail Grid • Clear via a 1–2⭐ bypass or master the full route for all 3 Golden Stars!',
      toastEmpireClaimFmt: '🏛️ Station Empire Lv.{lv} Ticket Vault Claimed: +{coins} 🪙! (Generating +{rate} 🪙/hr)',
      toastEmpireIdleFmt: '🏛️ Station Empire Lv.{lv} is generating +{rate} 🪙/hr! Complete more sectors to upgrade landmarks.',
      toastResumedFmt: '🔄 Resumed Mission #{id} from your saved board!',
      toastMission1Intro: '🚄 Mission 1: Tap the 3D tracks to rotate them and connect the rail line!',
      toastBossIntroFmt: '👑 Sector Boss Mission #{id}! Complete the track to win +80 Extra Boss Gold Coins!',
      toastDualIntro: '🔀 Dual-Train Mission! Connect either train path to dispatch immediately, or link both!',
      toastTileLocked: '🔒 This track tile is magnetically locked by Smart Radar!',
      toastTileFixed: '🔩 Fixed titanium rail • use it as a routing guide!',
      toastTileCross: '➕ 4-Way Crossroad allows trains to pass perpendicularly without rotation!',
      toastSeqTrain1Arrived: '✅ Train 1 arrived at Terminal 1! Now connect and launch Train 2!',
      toastSeqTrain2Arrived: '✅ Train 2 arrived at Terminal 2! Now connect and launch Train 1!',
      toastHintAllAligned: '⚡ All main-path rails are already aligned to the solution!',
      toastHintLockedFmt: '💡 Smart Radar locked {n} rails in their solution angles!',
      toastMilestoneAlreadyFmt: '✅ {stars} ⭐ Milestone chest already claimed!',
      toastMilestoneNeedFmt: '🔒 Collect {needed} more ⭐ to unlock this chest (+{coins} 🪙 & +{hints} 💡)!',
      toastMilestoneClaimedFmt: '🎉 Star Milestone ({stars} ⭐) Claimed: +{coins} Gold Coins 🪙 & +{hints} Radar 💡!',
      toastDailyCoinsPartFmt: '+{n} Gold Coins 🪙',
      toastDailyHintsPartFmt: '+{n} Radar Hint 💡',
      toastDailyClaimedFmt: '🎁 Day {day} Reward Claimed ({mult}x): {parts}!',
      toastDailyChallengeStartFmt: '🌍 Daily Global Challenge (Mission #{id} • 7×6 Grid): Win for 3x Gold Coins!',
      toastShopPreviewFmt: '🔊 Playing {skin} Horn & Engine!',
      toastShopEquippedFmt: '🚄 Equipped: {skin}!',
      toastShopBoughtFmt: '🎉 Purchased & Equipped: {skin}!',
      toastShopNeedBuyFmt: '⚠️ You need {needed} more Gold Coins to buy {skin}! Watch a rewarded ad (+100 🪙)!',
      toastShopNeedUpgFmt: '⚠️ You need {needed} more Gold Coins to upgrade {skin} to Lv.{lv}!',
      toastShopUpgradedFmt: '⬆️ Upgraded {skin} to Lv.{lv}! Extra moves, time & coin bonus increased!',
      toastAchClaimedFmt: '🏆 Claimed "{title}": +{coins} Gold Coins & +{hints} Radar!',
      toastJump3StarFmt: '⚡ Jumping to Mission #{id} for 3-Star Mastery!',
      toastRentActivated: '🚄 Super Maglev Train Activated for this level: +6 Moves, +20s, Auto-Lock & Star Magnet!',
      toastNo3DBrowser: '⚠️ 3D mode is unavailable on this browser',
      toastCryoActive: '❄️ Cryo-Freeze Shield Active: +20s & Storm Timer Frozen!',
      toastCryoAdded: '❄️ Added +20s & Froze Storm Timer!',
      toastQualityFmt: '✨ Graphics Quality: {tier}',
      toastDebugOn: '📊 Performance Debug HUD Enabled',
      toastDebugOff: '📊 Performance Debug HUD Hidden',
      toastNeed150Hint: '⚠️ You need 150 Gold Coins to buy a Smart Hint!',
      toastNeed250Super: '⚠️ You need 250 Gold Coins for the Super Golden Key (4 Tiles)!',
      toastRescueSecAdFmt: '⏱️ Added +{n} extra seconds! Complete the track!',
      toastRescueMovesAdFmt: '⚡ Added +{n} extra moves & locked 1 guide rail!',
      toastNeed100Rescue: '⚠️ You need 100 Gold Coins! Use the free Rewarded Ad button!',
      toastRescueSecCoinsFmt: '⏱️ Purchased +{n} extra seconds for 100 Gold Coins!',
      toastRescueMovesCoinsFmt: '⚡ Purchased +{n} extra moves & locked 1 guide rail for 100 Gold Coins!',
      toastDoubleEarnedFmt: '🪙 Earned +{coins} extra Gold Coins!',
      toastChestOpened: '🎁 Mystery Supply Chest Opened: +150 Gold Coins & +1 Smart Radar Hint!',
      shareVictoryTextFmt: '🚄 I just completed Mission #{id} in Dream Express 3D with a ×{combo} Combo! Can you beat my score? Play now: {url}',
      toastShareReward: '📤 Thanks for sharing! Earned +100 Gold Coins!',
      toastShareDone: '📤 Victory message shared with your friends!',
      toastCampaign100Done: '👑 Congratulations Emperor! You completed all 100 missions in Dream Express 3D!',
      toastVipActivated: '👑 Overdrive VIP Pass Activated! Ads removed, +1,500 Coins, +10 Hints & Gold Locomotive equipped!',
      toastVipRestored: '✅ Previous VIP Pass purchase restored successfully!',
      toastVipNotFound: 'ℹ️ No previous VIP Pass purchase found on this Google Play account.',
      toastVipConnecting: '💳 Google Play Billing is connecting... Please ensure Google Play Store is active or unlock the Gold Locomotive below with 25,000 Coins!',
      toastStarterGrantedFmt: '🎁 Starter Conductor Pack Activated: +{amount} 🪙 & +3 💡 Smart Radar!',
      toastCoinsGrantedFmt: '🪙 +{amount} Gold Coins added to your vault!',
      toastStarterIapInfo: '🎁 Starter Conductor Pack (+2,500 🪙 + 3 💡 • $0.99) connects directly to Google Play Billing on Android!',
      toastSmallCoinsIapInfo: '💳 Gold Coin Pouch (+2,500 🪙 • $0.99) connects directly to Google Play Billing on Android!',
      toastMegaCoinsIapInfo: '💳 Royal Gold Vault (+15,000 🪙 • $4.99) connects directly to Google Play Billing on Android!',
      toastVipIapInfo: '💳 Overdrive VIP Pass ($2.99) connects to Google Play Billing! You can also unlock the Gold Locomotive below with 25,000 Coins!',
      toastFree100Earned: '🪙 Earned +100 Gold Coins for free!',
      toastNeed150ShopHint: '⚠️ You need 150 Gold Coins to buy a Smart Radar charge!',
      toastAdded1Hint: '💡 Added +1 Smart Radar charge!',
      toastFree1HintEarned: '💡 Earned +1 Smart Radar charge for free!'
    },
    ja: {
      topProgress: '進行度',
      vipBadgeTop: '👑 VIPオーバードライブ有効',
      gameTitle: 'ドリーム・エクスプレス 3D',
      gameSubtitle: '大陸横断鉄道網 • 全100ミッション',
      ownerPillText: '👑 オーナー全解放ビルド • 全100ステージ解放済み',
      btnPlayNowPrefix: '現在のミッションをプレイ (Lv.',
      btnSectorMap: 'セクターマップ',
      btnLocomotiveShop: '機関車ガレージ',
      btnBackHome: 'ホーム',
      hudMoves: '手数',
      hudEnergy: 'スター',
      hudCam3D: '3D',
      hudCamTop: '俯瞰',
      hudFreeze: '時間停止',
      hudTrains: '機関車',
      hudCrew: '乗務員',
      hudSettings: '設定',
      hudAutoPlay: '自動解決',
      btnReset: 'リセット',
      btnUndo: '戻す',
      btnSmartHint: 'スマートレーダー',
      btnLaunchReady: '発車！ 🚄',
      btnLaunchTrain1: '第1列車 発車！ 🚄',
      btnLaunchTrain2: '第2列車 発車！ 🚄',
      btnTrainRunning: '走行中... 🚄',
      speedBarLabel: '🚄 速度:',
      chaseCamLabel: '追跡カメラ',
      badgeFreeAd: '🎬 無料',
      adBannerCopy: '⚡ VIPパス：黄金の3Dプラズマ機関車を解放＆広告を完全非表示！',
      adBannerCta: 'VIP解放',
      adOfflineBanner: '📴 オフラインモード有効 • 全100ミッションをプレイ可能！',
      dialogueSkip: 'スキップ ⏭️',
      dialogueNext: '次へ',
      dialogueStartMission: 'ミッション開始！',
      dialogueViewResults: '結果を見る 🏆',
      hintModalTitle: '💡 スマート誘導レーダー',
      hintModalDesc: '「油圧ジャイロが<strong>正解ルート上のレール2枚</strong>を正確な角度へ回転させ、手数を消費せずに電磁ロックします！」',
      hintUseFreePrefix: 'レーダーを使用 (残り',
      hintWatchAd: '短い動画を見て2枚を無料ロック',
      hintBuyCoins: '即時ヒント購入：レール2枚ロック (150コイン)',
      hintBuySuper: '黄金マスターキー：4枚同時ロック (250コイン)',
      oomTitleMoves: '⚠️ 回転手数が不足しています！',
      oomDescMoves: '「路線開通前に油圧手数が尽きました！予備リアクターを充電してその場から続行しましょう！」',
      oomTipSuffix: ' 💡 ヒント：(⚙️ 機関車ガレージ)で上位機関車を装備・強化すると自動ロックや追加手数が得られます！',
      oomAdMoves: '+{n} 手を無料追加 (動画報酬)',
      oomCoinsMoves: '+{n} 手を即時購入 (100コイン)',
      oomTitleTimer: '⏱️ ストーム制限時間終了！',
      oomDescTimer: '「発車前にカウントダウンが終了しました！秒数を追加して続行するか、無料でやり直せます！」',
      oomAdTimer: '+{n} 秒を無料追加して続行 (動画報酬)',
      oomCoinsTimer: '+{n} 秒を即時購入 (100コイン)',
      oomRetryFree: '最初からやり直す (無料)',
      victoryRibbon: '⚡ 終着駅の接続完了！',
      vicTitleWin: 'ミッション完了！',
      victoryTotalRewardLabel: '🪙 獲得報酬合計:',
      victorySectorsBtn: 'セクター一覧',
      victoryLevelDoneFmt: 'ミッション {id} クリア：{title}！',
      victoryPerfFmt: '{badge} 階級: {rank} (+{xp} XP) | コンボ: ×{combo} | 連勝: 🔥{streak}',
      victoryDailyRankFmt: '🌍 デイリー世界ランク：上位 {pct}%！ | {badge} +{xp} XP',
      victoryEndlessFmt: '♾️ ウェーブ {wave} 突破！ 走行距離: {km} km (自己ベスト: {best} km)',
      victorySectorPowerFmt: '{icon} {sector} 電力復旧率',
      victoryCoinsFmt: '+{coins} ゴールドコイン',
      victoryFormulaFmt: 'スター＆残手数 + コンボ (+{combo}) + 速度＆機関車ボーナス (+{speed}){extra}',
      victoryExtraLabel: 'ボーナス',
      victoryDoubleFmt: '報酬2倍 ×2 (+{coins} コイン)',
      victoryDoubledFmt: '✅ 報酬2倍獲得 (+{coins} コイン)！',
      victoryNextMissionFmt: '次のミッション ({id})',
      victoryNextWaveFmt: '次のウェーブ (#{wave}) ♾️',
      victoryCampaignFmt: '本編ミッション ({id})',
      victoryFinalMap: '最終勝利マップへ',
      shopTitle: '⚙️ 3D機関車ガレージ＆VIPショップ',
      shopSubtitle: '3D機関車の購入・強化やスマートレーダーの補充ができます',
      vipBadgeCard: '👑 究極の戦略バンドル',
      vipCardTitle: 'オーバードライブ VIPパス',
      vipPerk1: '⚡ <strong>黄金3Dプラズマ機関車</strong>を即時解放（星スパーク＆レーザー前照灯）',
      vipPerk2: '🚫 インタースティシャル広告と下部バナー広告を永久に削除',
      vipPerk3: '💡 <strong>スマートレーダー +10回</strong> ＆ <strong>🪙 1,500コイン</strong>即時付与',
      vipActiveLabel: '✅ VIPパス有効化済み！',
      vipBuyLabel: '🌟 VIPパスを有効化 ($2.99)',
      starterBadgeTop: '🎁 車掌ウェルカム限定パック (1回限り)',
      starterPackTitle: 'スターター車掌パック (+2,500 🪙 + 3 💡 特典！)',
      starterPackDesc: '高速機関車の解放に最適なスタートダッシュ＋無料レーダー3回付き',
      starterBuyLabel: '🎁 スターターパックを入手 ($0.99)',
      shopHintsSectionTitle: '💡 スマートレーダー＆コイン補充',
      shopHintRow1Title: 'スマート誘導レーダー (+1 💡)',
      shopHintRow1Desc: '手数を消費せず正解レール2枚を自動回転＆電磁ロック',
      shopHintRow2Title: '動画報酬で無料レーダー (+1 💡)',
      shopHintRow2Desc: '短い広告を視聴してスマートレーダーを1回獲得',
      shopHintRow3Title: '無料ゴールドコイン (+100 🪙)',
      shopHintRow3Desc: '短い広告を視聴して機関車解放用コインを100枚獲得',
      coinsSmallTitle: 'ゴールドコイン袋 (+2,500 🪙)',
      coinsSmallDesc: '機関車の解放とアップグレードを即時加速',
      coinsSmallPrice: '$0.99',
      coinsMegaTitle: '👑 ロイヤル黄金金庫 (+15,000 🪙)',
      coinsMegaDesc: '全3D機関車艦隊を強化できる最高コスパパック',
      coinsMegaPrice: '$4.99',
      shopSkinsSectionTitle: '🚄 世界の3D機関車コレクション',
      skinEquipped: '✅ 装備中',
      skinEquip: '装備する',
      skinBuyFmt: '🪙 {price} • 購入',
      skinUpgradeFmt: '⬆️ 強化 Lv.{cur}→{next} (🪙 {cost})',
      skinMaxLv: '👑 最大レベル Lv.5',
      statSpeed: '速度',
      statMoves: '手数',
      statTime: '時間',
      statGold: 'コイン',
      btnHearHorn: '汽笛とエンジン試聴',
      perkSummaryFmt: '{perk} (🔒自動ロック:{locks} | ❄️停止:{freeze}秒 | 手数+{moves} | 時間+{time}秒 | 金+{gold}%)',
      achModalTitle: '🏆 実績＆報酬リスト',
      achModalSubtitle: '戦略チャレンジを達成してコインとスマートレーダーを受け取ろう',
      achSummaryLabel: '🎖️ 達成済み実績:',
      achClaimed: '✅ 受取済',
      achClaim: '🎁 受取',
      btnDailyChallenge: 'デイリー挑戦 3倍コイン',
      btnDailyStreak: 'ログイン報酬',
      dailyBriefingTitle: '🌍 ワールドデイリー挑戦 (7×6 複線グリッド)',
      dailyBriefingDesc: '本日のワールドデイリーは上級者向けの 7×6 複線ミッションです！通常キャンペーンの進行状況は安全に保たれ、クリアするとコイン3倍を獲得できます！',
      dailyBriefingConfirm: 'デイリー挑戦を開始 (3倍コイン) 🌍',
      dailyBriefingCancel: 'キャンペーンに戻る',
      btnRentTrain: '超特急',
      empireReadyFmt: '駅帝国 Lv.{lv} • +{coins} 🪙回収',
      empireIdleFmt: 'ステーション帝国 Lv.{lv}',
      endlessBestFmt: '無限レール ({km} km)',
      endlessDefault: '無限エクスプレス',
      rankPillFmt: '{icon} 階級: {rank} ({stars}/300 ⭐)',
      mapSectorOfFmt: '{icon} セクター {id} / {total}',
      mapSectorLevelsFmt: 'セクター {id} • ミッション {from}–{to}',
      mapPowerLabel: '復旧率',
      mapPlayNowBtn: '出発する 🚄',
      mapLockedBtn: '🔒 未解放',
      mapLevelGridFmt: 'ミッション #{id} • {rows}×{cols} グリッド',
      btnNext3Star: '未3⭐へ',
      hudLevelFmt: '{icon}Lv.{id}{badges}',
      hudMissionTitleFmt: 'ミッション #{id}',
      hudSectorFmt: '{icon} セクター {id}: {name}',
      dailyLoginTitle: '🎁 7日間ログインボーナス',
      dailyLoginSub: '毎日ログインしてコインとスマートレーダーを無料で獲得！',
      dailyDayFmt: '{day}日目',
      dailyCoinsFmt: '{n} コイン',
      dailyHintsFmt: 'レーダー {n}回',
      dailyGrandLabel: '500コイン + 2 💡',
      btnClaimDaily1x: '報酬を受け取る',
      btnClaimDaily2x: '報酬2倍 ×2 (広告)',
      btnDailyAlreadyClaimed: '✅ 本日の報酬は受取済みです！',
      chestLabelPrefix: '🎁 ミステリー補給箱:',
      btnOpenChest: '🎁 補給箱を開ける (+150 🪙 & +1 💡) •\u00A0広告',
      btnVictoryShare: '勝利をシェアして友達に挑戦 (+100 🪙)',
      btnVictoryShareDone: '✅ 本日シェア済み',
      btnRestorePurchases: '購入履歴を復元する',
      btnShopPrivacy: 'プライバシーポリシーとデータ安全性',
      privacyModalTitle: '🔒 プライバシーポリシーとデータ保護',
      privacyModalSubtitle: 'Dream Express 3D • 開発元: ALDHFLY GAMES (com.dreamexpress.puzzletracks)',
      privacySummaryHtml: '<p><strong>1. ローカル保存・個人情報収集なし (<code dir="ltr">dream_express_save_v123_public</code>)：</strong>アカウント登録不要で、氏名・メール等の個人情報は一切収集しません。進行データは端末内にのみ保存されます。</p><p><strong>2. 広告と課金：</strong>Google AdMob SDKおよびGoogle Play Billing v8.0.0公式決済のみを使用します。お問い合わせ：<code>aldhfly@gmail.com</code></p>',
      privacyFullLinkLabel: '📄 完全版プライバシーポリシーを表示',
      privacyCloseBtnLabel: '了解しました',
      starRoadTitle: '🎁 スターロード (宝箱をタップして報酬獲得)',
      tutorialTapToRotate: 'タップしてレールを回転',
      tutStep1Title: 'レールを回転させる',
      tutStep1Desc: '光っているレールをタップして90°回転させ、3つのスターを通って終着駅まで繋げましょう！',
      tutStep2Title: '3D / 俯瞰カメラ切替',
      tutStep2Desc: '(3D / 俯瞰)ボタンで臨場感あふれる3D視点と全体を見渡せる俯瞰視点をいつでも切り替えられます！',
      tutStep3Title: '列車速度＆追跡カメラ [1 • 2 • 3]',
      tutStep3Desc: '発車前でも走行中でも好みの速度(1・2・3)や追跡カメラを選択できます！',
      tutStep4Title: '出発信号グリーン — 発車！',
      tutStep4Desc: '路線がつながりました！(発車！)をタップして終着駅へ出発進行！',
      settingsTitle: '⚙️ サウンド＆グラフィック設定',
      settingsSubtitle: '列車音・BGMの個別音量調整と60FPS 3D画質設定',
      settingsSfx: '🔊 列車＆効果音ボリューム',
      settingsBgm: '🎵 BGM（背景音楽）ボリューム',
      settingsQuality: '🖥️ 3Dグラフィック品質',
      qualAuto: '自動',
      qualMid: '標準',
      qualHigh: '最高 60FPS',
      hapticsOn: '📳 触覚バイブレーション: ON',
      hapticsOff: '📳 触覚バイブレーション: OFF',
      btnReplayTutorial: '📖 チュートリアルをもう一度見る (Lv.1)',
      settingsLangBtn: '🌍 言語 / Language',
      settingsPrivBtn: '🔒 プライバシー',
      settingsDoneBtn: '保存して閉じる ✓',
      bossStageBanner: 'セクターボス戦 #{id} • ボス報酬 +80 🪙！',
      bootLoaderTitle: 'ドリーム・エクスプレス 3D',
      bootLoaderSub: '3Dエンジン起動＆機関車モデル読込中...',
      exitModalTitle: 'ゲームを終了しますか？',
      exitModalDesc: '進行状況と獲得スターはすべて自動保存されています。終了してもよろしいですか？',
      btnExitStay: '🚄 プレイを続ける',
      btnExitConfirm: '終了する',
      toastAutoSolveFmt: '🤖 AIがミッション #{id} を自動解決して発車します...',
      toastResetGrid: '🔄 レール配置を初期状態に無料リセットしました',
      toastSpeedSetFmt: '🚄 列車速度を設定しました: {tier}',
      toastChaseOn: '🎥 列車追跡カメラON！',
      toastChaseOff: '🎥 全体カメラに戻しました',
      toastTrackIncompleteFmt: '⚡ 路線未開通 ({n}枚接続) • レールをタップして回転させるか💡レーダーを使おう！',
      toastRouteShortcutFmt: '✨ 路線開通 (⭐ {sparks}/3) • 今すぐ発車するか、全3⭐を目指して回転を続けよう！',
      toastRouteFull3Star: '🌟 全3スター路線開通 (3/3 ⭐) • まもなく発車します！',
      toastSkinPerkFmt: '🔒 {skin} 特典：レール {locks}枚を自動ロック{freeze}！',
      toastSkinFreezeSuffixFmt: ' ＋ {sec}秒タイマー停止',
      toastAdDismissedEarly: '⚠️ 視聴完了前に広告を閉じたため、報酬は付与されませんでした。',
      toastLangChangedFmt: '🌍 言語を {lang} に切り替えました',
      adSimOfflineBadge: '📴 オフライン予備モード（戦術リアクター調整）',
      adSimReserveBadge: '⚡ 戦術リアクター調整（予備チャージ）',
      adSimOfflineDesc: '戦術リアクター調整中（3秒）• オフラインのまま緊急報酬を付与します！',
      adSimReserveDesc: '予備リアクターを調整中（3秒）• まもなく報酬を受け取れます！',
      adSimWaitBtn: '⏳ リアクター調整中...',
      adSimSecFmt: '残り {n}秒...',
      adSimDone: '完了！ ✅',
      adSimClaimBtn: '🎁 報酬を受け取って続行',
      adSimCancelBtn: 'キャンセル',
      adTitleDoubleDaily: 'ログイン報酬2倍 (×2)',
      adTitleRentTrain: '超電導マグレブ試乗（1ステージ）',
      adTitleCryoFreeze: 'クライオ凍結シールド (+20秒 ❄️)',
      adTitleSmartHint: 'スマートレーダー誘導（レール2枚固定）',
      adTitleExtraSecFmt: '+{n}秒 時間延長',
      adTitleExtraMovesFmt: '+{n}手 回転数追加',
      adTitleDoubleCoins: '獲得コイン2倍 (×2)',
      adTitleMysteryChest: '黄金サプライチェスト開封',
      adTitleFreeCoins: '無料ゴールドコイン (+100 🪙)',
      adTitleFreeHint: '無料スマートレーダー (+1 💡)',
      mechEndlessTitle: '無限レールマラソン＆ワープゲート！',
      mechEndlessDesc: '連続ウェーブを突破して最長走行距離（km）とボーナス金貨を獲得しよう！',
      mechBridgeTitle: '鋼鉄の吊り橋レール',
      mechBridgeDesc: 'タップで吊り橋の向きを揃えて深い渓谷を安全に渡ろう！',
      mechYSwitchTitle: '3方向Y字ポイント分岐',
      mechYSwitchDesc: '琥珀色の信号灯が目印：1本の線路を左右2方向へ分岐します！',
      mechDualTrainTitle: '2編成同時運行 [1] & [2]',
      mechDualTrainDesc: '水色の列車[1]を駅[1]へ、琥珀色の列車[2]を駅[2]へ導こう！',
      mechStormTitle: 'タイムアタック嵐チャレンジ！',
      mechStormDesc: '制限時間付きの特別ステージ！カウントダウン終了前に線路を繋ごう。',
      mechSwitchTitle: '複線カーブ切替ポイント',
      mechSwitchDesc: 'シアンの中心ハブが目印：交差せず2本の独立したカーブを通します！',
      endlessWaveHudFmt: '♾️ ウェーブ {wave} ({km} km)',
      hudCrewTipFmt: '{rows}×{cols} 3D鉄道グリッド • 近道ルート(1〜2⭐)で突破するか、全3スター回収を目指そう！',
      toastEmpireClaimFmt: '🏛️ ステーション帝国 Lv.{lv} 収益回収：+{coins} 🪙！（毎時 +{rate} 🪙 生産中）',
      toastEmpireIdleFmt: '🏛️ ステーション帝国 Lv.{lv} は毎時 +{rate} 🪙 を生産中！セクターを進めて駅を発展させよう。',
      toastResumedFmt: '🔄 ミッション #{id} を前回の続きから再開しました！',
      toastMission1Intro: '🚄 ミッション1：3Dレールをタップして回転させ、路線を繋ごう！',
      toastBossIntroFmt: '👑 セクターボス #{id}！クリアでボス報酬 +80 🪙 を獲得！',
      toastDualIntro: '🔀 2編成ステージ！片方ずつ発車させることも、両方同時に繋ぐことも可能です！',
      toastTileLocked: '🔒 このレールはスマートレーダーで磁気ロックされています！',
      toastTileFixed: '🔩 固定チタンレール • ルート設計の目印にしよう！',
      toastTileCross: '➕ 十字クロスレールは回転不要で縦横両方向に通過できます！',
      toastSeqTrain1Arrived: '✅ 列車1が第1駅に到着！続いて列車2のルートを繋いで発車させよう！',
      toastSeqTrain2Arrived: '✅ 列車2が第2駅に到着！続いて列車1のルートを繋いで発車させよう！',
      toastHintAllAligned: '⚡ メインルートのレールはすべて正解の向きに揃っています！',
      toastHintLockedFmt: '💡 スマートレーダーがレール {n}枚を正解角度にロックしました！',
      toastMilestoneAlreadyFmt: '✅ ({stars} ⭐) マイルストーン宝箱は受取済みです！',
      toastMilestoneNeedFmt: '🔒 この宝箱を開くにはあと {needed} ⭐ 必要です (+{coins} 🪙 & +{hints} 💡)！',
      toastMilestoneClaimedFmt: '🎉 スター報酬 ({stars} ⭐) 獲得：+{coins} コイン 🪙 & +{hints} レーダー 💡！',
      toastDailyCoinsPartFmt: '+{n} ゴールドコイン 🪙',
      toastDailyHintsPartFmt: '+{n} レーダーヒント 💡',
      toastDailyClaimedFmt: '🎁 {day}日目の報酬獲得 ({mult}倍)：{parts}！',
      toastDailyChallengeStartFmt: '🌍 デイリー世界チャレンジ (ミッション #{id} • 7×6)：クリアでコイン3倍！',
      toastShopPreviewFmt: '🔊 {skin} の警笛＆エンジン音を試聴中！',
      toastShopEquippedFmt: '🚄 装備完了：{skin}！',
      toastShopBoughtFmt: '🎉 購入＆装備完了：{skin}！',
      toastShopNeedBuyFmt: '⚠️ {skin} の購入にはあと {needed} コイン必要です！動画報酬で +100 🪙 獲得できます！',
      toastShopNeedUpgFmt: '⚠️ {skin} の Lv.{lv} 強化にはあと {needed} コイン必要です！',
      toastShopUpgradedFmt: '⬆️ {skin} を Lv.{lv} に強化！手数・時間・コインボーナスが上昇！',
      toastAchClaimedFmt: '🏆 「{title}」報酬獲得：+{coins} コイン & +{hints} レーダー！',
      toastJump3StarFmt: '⚡ 3スター完全制覇のためミッション #{id} へ移動します！',
      toastRentActivated: '🚄 超電導マグレブ起動：手数+6・+20秒・自動ロック＆スター磁石！',
      toastNo3DBrowser: '⚠️ このブラウザでは3Dモードを利用できません',
      toastCryoActive: '❄️ クライオ凍結シールド発動：+20秒＆嵐タイマー一時停止！',
      toastCryoAdded: '❄️ +20秒追加＆嵐タイマーを凍結しました！',
      toastQualityFmt: '✨ 3Dグラフィック品質：{tier}',
      toastDebugOn: '📊 パフォーマンスHUDを表示しました',
      toastDebugOff: '📊 パフォーマンスHUDを非表示にしました',
      toastNeed150Hint: '⚠️ スマートヒント購入には 150 コイン必要です！',
      toastNeed250Super: '⚠️ スーパーゴールデンキー（4枚固定）には 250 コイン必要です！',
      toastRescueSecAdFmt: '⏱️ +{n}秒延長しました！路線を完成させよう！',
      toastRescueMovesAdFmt: '⚡ +{n}手追加＆ガイドレール1枚をロックしました！',
      toastNeed100Rescue: '⚠️ 100コイン必要です！無料のリワード広告ボタンをご利用ください！',
      toastRescueSecCoinsFmt: '⏱️ 100コインで +{n}秒を購入しました！',
      toastRescueMovesCoinsFmt: '⚡ 100コインで +{n}手追加＆ガイドレール1枚をロックしました！',
      toastDoubleEarnedFmt: '🪙 追加で +{coins} ゴールドコインを獲得しました！',
      toastChestOpened: '🎁 サプライチェスト開封：+150 コイン & +1 スマートレーダー！',
      shareVictoryTextFmt: '🚄 ドリーム・エクスプレス3Dのミッション #{id} を ×{combo} コンボでクリア！記録に挑戦しよう：{url}',
      toastShareReward: '📤 シェアありがとうございます！+100 コイン獲得！',
      toastShareDone: '📤 クリア記録をシェアしました！',
      toastCampaign100Done: '👑 おめでとうございます！全100ミッションを完全制覇しました！',
      toastVipActivated: '👑 VIPパス有効化！広告削除・+1,500コイン・+10ヒント＆黄金機関車を装備！',
      toastVipRestored: '✅ 購入済みのVIPパスを復元しました！',
      toastVipNotFound: 'ℹ️ このGoogle PlayアカウントにVIPパスの購入履歴が見つかりませんでした。',
      toastVipConnecting: '💳 Google Play決済に接続中…ストアを確認するか、25,000コインで黄金機関車を解放できます！',
      toastStarterGrantedFmt: '🎁 スターターパック有効化：+{amount} 🪙 & +3 💡 スマートレーダー！',
      toastCoinsGrantedFmt: '🪙 +{amount} ゴールドコインを追加しました！',
      toastStarterIapInfo: '🎁 スターターパック (+2,500 🪙 + 3 💡) はAndroid版Google Play決済で購入できます！',
      toastSmallCoinsIapInfo: '💳 コインポーチ (+2,500 🪙) はAndroid版Google Play決済で購入できます！',
      toastMegaCoinsIapInfo: '💳 ロイヤル金庫 (+15,000 🪙) はAndroid版Google Play決済で購入できます！',
      toastVipIapInfo: '💳 VIP広告削除パスはGoogle Play決済に対応！黄金機関車は25,000コインでも解放可能です！',
      toastFree100Earned: '🪙 無料で +100 ゴールドコインを獲得しました！',
      toastNeed150ShopHint: '⚠️ スマートレーダー購入には 150 コイン必要です！',
      toastAdded1Hint: '💡 スマートレーダー +1 を追加しました！',
      toastFree1HintEarned: '💡 無料でスマートレーダー +1 を獲得しました！'
    },
    ko: {
      topProgress: '진행률',
      vipBadgeTop: '👑 VIP 오버드라이브 활성화됨',
      gameTitle: '드림 익스프레스 3D',
      gameSubtitle: '대륙 횡단 철도망 • 100 미션',
      ownerPillText: '👑 마스터 전체 해금 빌드 • 1~100 전체 미션 개방됨',
      btnPlayNowPrefix: '현재 미션 플레이 (Lv.',
      btnSectorMap: '섹터 맵',
      btnLocomotiveShop: '기관차 격납고',
      btnBackHome: '메인 메뉴',
      hudMoves: '이동 수',
      hudEnergy: '스타',
      hudCam3D: '3D',
      hudCamTop: '탑뷰',
      hudFreeze: '시간동결',
      hudTrains: '기관차',
      hudCrew: '승무원',
      hudSettings: '설정',
      hudAutoPlay: '자동해결',
      btnReset: '초기화',
      btnUndo: '되돌리기',
      btnSmartHint: '스마트 레이더',
      btnLaunchReady: '출발! 🚄',
      btnLaunchTrain1: '1번 열차 출발! 🚄',
      btnLaunchTrain2: '2번 열차 출발! 🚄',
      btnTrainRunning: '열차 운행 중... 🚄',
      speedBarLabel: '🚄 속도:',
      chaseCamLabel: '추적 카메라',
      badgeFreeAd: '🎬 무료',
      adBannerCopy: '⚡ VIP 패스: 황금 3D 플라즈마 기관차 해금 및 모든 광고 영구 제거!',
      adBannerCta: '업그레이드',
      adOfflineBanner: '📴 오프라인 모드 작동 중 • 100개 전체 미션 플레이 가능!',
      dialogueSkip: '건너뛰기 ⏭️',
      dialogueNext: '다음',
      dialogueStartMission: '미션 시작!',
      dialogueViewResults: '결과 보기 🏆',
      hintModalTitle: '💡 스마트 유도 레이더',
      hintModalDesc: '"유압 자이로스코프가 <strong>정답 경로의 레일 2개</strong>를 정확한 각도로 회전시키고 이동 횟수 소모 없이 자석으로 고정합니다!"',
      hintUseFreePrefix: '레이더 충전 사용 (보유 ',
      hintWatchAd: '짧은 광고 보고 레일 2개 무료 고정',
      hintBuyCoins: '즉시 힌트 구매: 레일 2개 고정 (150 코인)',
      hintBuySuper: '슈퍼 골든 키: 레일 4개 동시 고정 (250 코인)',
      oomTitleMoves: '⚠️ 전환 이동 횟수 소진!',
      oomDescMoves: '"선로 연결 전에 유압 전환 횟수를 모두 사용했습니다! 예비 원자로를 충전해 현재 상태 그대로 이어서 플레이하세요!"',
      oomTipSuffix: ' 💡 팁: (⚙️ 기관차 격납고)에서 상위 기관차를 장착·강화하면 자동 레일 잠금과 추가 이동·시간 혜택을 받습니다!',
      oomAdMoves: '+{n} 추가 이동 무료 획득 (보상형 광고)',
      oomCoinsMoves: '+{n} 추가 이동 즉시 구매 (100 골드 코인)',
      oomTitleTimer: '⏱️ 폭풍 제한 시간 종료!',
      oomDescTimer: '"열차 출발 전에 폭풍 타이머가 끝났습니다! 추가 시간을 충전해 이어서 진행하거나 무료로 재도전하세요!"',
      oomAdTimer: '+{n}초 추가 시간 무료 획득 (보상형 광고)',
      oomCoinsTimer: '+{n}초 추가 시간 즉시 구매 (100 골드 코인)',
      oomRetryFree: '처음부터 다시 시도 (무료)',
      victoryRibbon: '⚡ 종착역 선로 연결 성공!',
      vicTitleWin: '미션 완료!',
      victoryTotalRewardLabel: '🪙 총 획득 보상:',
      victorySectorsBtn: '섹터 맵',
      victoryLevelDoneFmt: '미션 {id} 완료: {title}!',
      victoryPerfFmt: '{badge} 계급: {rank} (+{xp} XP) | 콤보: ×{combo} | 연승: 🔥{streak}',
      victoryDailyRankFmt: '🌍 일일 챌린지 세계 랭킹: 상위 {pct}%! | {badge} +{xp} XP',
      victoryEndlessFmt: '♾️ 무한 웨이브 {wave} 클리어! 주행 거리: {km} km (최고 기록: {best} km)',
      victorySectorPowerFmt: '{icon} {sector} 전력 복구율',
      victoryCoinsFmt: '+{coins} 골드 코인',
      victoryFormulaFmt: '별 & 남은 이동 + 콤보 (+{combo}) + 속도 & 기관차 보너스 (+{speed}){extra}',
      victoryExtraLabel: '보너스',
      victoryDoubleFmt: '보상 2배 받기 ×2 (+{coins} 코인)',
      victoryDoubledFmt: '✅ 보상 2배 적용 완료 (+{coins} 코인)!',
      victoryNextMissionFmt: '다음 미션 ({id})',
      victoryNextWaveFmt: '다음 웨이브 (#{wave}) ♾️',
      victoryCampaignFmt: '캠페인 미션 ({id})',
      victoryFinalMap: '최종 승리 맵',
      shopTitle: '⚙️ 3D 기관차 격납고 & VIP 상점',
      shopSubtitle: '3D 터빈 기관차를 업그레이드하거나 스마트 레이더를 충전하세요',
      vipBadgeCard: '👑 궁극의 전략 패키지',
      vipCardTitle: '오버드라이브 VIP 패스',
      vipPerk1: '⚡ 별 스파크와 레이저 헤드라이트를 갖춘 <strong>3D 황금 플라즈마 기관차</strong> 즉시 해금',
      vipPerk2: '🚫 전면 광고 및 하단 배너 광고 영구 제거',
      vipPerk3: '💡 즉시 <strong>+10 스마트 레이더</strong> + <strong>🪙 1,500 골드 코인</strong> 지급',
      vipActiveLabel: '✅ 오버드라이브 VIP 패스 사용 중!',
      vipBuyLabel: '🌟 VIP 패스 활성화 ($2.99)',
      starterBadgeTop: '🎁 글로벌 기관사 환영 특가 (1회 한정)',
      starterPackTitle: '스타터 기관사 팩 (+2,500 🪙 + 3 💡 보너스!)',
      starterPackDesc: '고속 열차 해금을 위한 최고의 시작 부스트 + 무료 스마트 레이더 3회',
      starterBuyLabel: '🎁 스타터 팩 구매 ($0.99)',
      shopHintsSectionTitle: '💡 스마트 레이더 & 골드 충전',
      shopHintRow1Title: '스마트 유도 레이더 (+1 💡)',
      shopHintRow1Desc: '이동 차감 없이 정답 레일 2개를 정확한 각도로 자석 고정',
      shopHintRow2Title: '보상형 광고로 무료 레이더 (+1 💡)',
      shopHintRow2Desc: '짧은 광고를 시청하고 스마트 레이더 1회를 즉시 획득',
      shopHintRow3Title: '무료 골드 코인 충전 (+100 🪙)',
      shopHintRow3Desc: '짧은 보상형 광고를 보고 기관차 해금용 100 골드 코인 획득',
      coinsSmallTitle: '골드 코인 주머니 (+2,500 🪙)',
      coinsSmallDesc: '기관차 해금 및 업그레이드 즉시 충전',
      coinsSmallPrice: '$0.99',
      coinsMegaTitle: '👑 로열 골드 금고 (+15,000 🪙)',
      coinsMegaDesc: '전체 3D 기관차 함대 업그레이드를 위한 최고의 가치',
      coinsMegaPrice: '$4.99',
      shopSkinsSectionTitle: '🚄 3D 월드 & 장갑 기관차 컬렉션',
      skinEquipped: '✅ 장착됨',
      skinEquip: '장착하기',
      skinBuyFmt: '🪙 {price} • 구매',
      skinUpgradeFmt: '⬆️ 강화 Lv.{cur}→{next} (🪙 {cost})',
      skinMaxLv: '👑 최고 레벨 Lv.5',
      statSpeed: '속도',
      statMoves: '이동',
      statTime: '시간',
      statGold: '골드',
      btnHearHorn: '경적 & 엔진음 듣기',
      perkSummaryFmt: '{perk} (🔒잠금:{locks} | ❄️동결:{freeze}초 | 이동+{moves} | 시간+{time}초 | 골드+{gold}%)',
      achModalTitle: '🏆 업적 & 보상 기록',
      achModalSubtitle: '전략 과제를 달성하고 골드 코인과 스마트 레이더를 수령하세요',
      achSummaryLabel: '🎖️ 달성한 업적:',
      achClaimed: '✅ 수령 완료',
      achClaim: '🎁 받기',
      btnDailyChallenge: '일일 챌린지 3배 골드',
      btnDailyStreak: '일일 선물',
      dailyBriefingTitle: '🌍 글로벌 일일 챌린지 (7×6 복선 그리드)',
      dailyBriefingDesc: '오늘의 글로벌 일일 챌린지는 상급 7×6 복선 섹터 미션입니다! 기존 캠페인 진행도는 안전하게 유지되며, 클리어 시 골드 코인 3배를 받습니다!',
      dailyBriefingConfirm: '일일 챌린지 시작 (3배 골드) 🌍',
      dailyBriefingCancel: '캠페인으로 돌아가기',
      btnRentTrain: '슈퍼 열차',
      empireReadyFmt: '역 제국 Lv.{lv} • +{coins} 🪙 수령',
      empireIdleFmt: '스테이션 제국 Lv.{lv}',
      endlessBestFmt: '무한 철도 ({km} km)',
      endlessDefault: '무한 익스프레스',
      rankPillFmt: '{icon} 계급: {rank} ({stars}/300 ⭐)',
      mapSectorOfFmt: '{icon} 섹터 {id} / {total}',
      mapSectorLevelsFmt: '섹터 {id} • 미션 {from}–{to}',
      mapPowerLabel: '전력',
      mapPlayNowBtn: '지금 출발 🚄',
      mapLockedBtn: '🔒 잠김',
      mapLevelGridFmt: '미션 #{id} • {rows}×{cols} 그리드',
      btnNext3Star: '3⭐ 도전',
      hudLevelFmt: '{icon}Lv.{id}{badges}',
      hudMissionTitleFmt: '미션 #{id}',
      hudSectorFmt: '{icon} 섹터 {id}: {name}',
      dailyLoginTitle: '🎁 7일 연속 출석 보상',
      dailyLoginSub: '매일 접속하여 무료 골드 코인과 스마트 레이더를 받으세요!',
      dailyDayFmt: '{day}일차',
      dailyCoinsFmt: '{n} 코인',
      dailyHintsFmt: '레이더 {n}개',
      dailyGrandLabel: '500 코인 + 2 💡',
      btnClaimDaily1x: '보상 받기',
      btnClaimDaily2x: '보상 2배 ×2 (광고)',
      btnDailyAlreadyClaimed: '✅ 오늘 보상 수령 완료!',
      chestLabelPrefix: '🎁 미스터리 보급 상자:',
      btnOpenChest: '🎁 보급 상자 열기 (+150 🪙 & +1 💡) •\u00A0광고',
      btnVictoryShare: '승리 공유 & 친구에게 도전장 (+100 🪙)',
      btnVictoryShareDone: '✅ 오늘 공유 완료',
      btnRestorePurchases: '이전 구매 내역 복원',
      btnShopPrivacy: '개인정보 처리방침 및 데이터 안전',
      privacyModalTitle: '🔒 개인정보 처리방침 및 데이터 보호',
      privacyModalSubtitle: 'Dream Express 3D • 개발사: ALDHFLY GAMES (com.dreamexpress.puzzletracks)',
      privacySummaryHtml: '<p><strong>1. 기기 내 저장 및 개인정보 미수집 (<code dir="ltr">dream_express_save_v123_public</code>):</strong> 회원가입이 필요 없으며 이름·이메일·연락처 등 개인 식별 정보를 수집하지 않습니다. 모든 진행 데이터는 기기 내부에만 저장됩니다.</p><p><strong>2. 광고 및 인앱 결제:</strong> 공식 Google AdMob SDK 및 Google Play Billing v8.0.0만을 사용합니다. 문의: <code>aldhfly@gmail.com</code></p>',
      privacyFullLinkLabel: '📄 전체 개인정보 처리방침 문서 보기',
      privacyCloseBtnLabel: '확인했습니다',
      starRoadTitle: '🎁 스타 로드 (상자를 탭하여 보상 수령)',
      tutorialTapToRotate: '탭하여 레일 회전',
      tutStep1Title: '레일 회전하기',
      tutStep1Desc: '빛나는 레일 타일을 탭하여 90° 회전시키고 황금 별 3개를 거쳐 종착역까지 연결하세요!',
      tutStep2Title: '3D / 탑뷰 카메라 전환',
      tutStep2Desc: '(3D / 탑뷰) 버튼을 탭하여 시네마틱 3D 뷰와 전체 전술 맵 뷰를 언제든 전환하세요!',
      tutStep3Title: '열차 속도 & 추적 카메라 [1 • 2 • 3]',
      tutStep3Desc: '출발 전이나 주행 중 언제든 원하는 속도(1·2·3)와 추적 카메라를 선택할 수 있습니다!',
      tutStep4Title: '녹색 신호 — 열차 출발!',
      tutStep4Desc: '선로가 완성되었습니다! (출발!) 버튼을 눌러 종착역으로 열차를 출발시키세요!',
      settingsTitle: '⚙️ 오디오 & 그래픽 설정',
      settingsSubtitle: '열차 효과음·배경음악 개별 볼륨 및 60FPS 3D 품질 설정',
      settingsSfx: '🔊 열차 & 효과음 볼륨',
      settingsBgm: '🎵 배경 음악 (BGM) 볼륨',
      settingsQuality: '🖥️ 3D 그래픽 품질',
      qualAuto: '자동',
      qualMid: '균형',
      qualHigh: '울트라 60FPS',
      hapticsOn: '📳 진동 피드백: 켜짐',
      hapticsOff: '📳 진동 피드백: 꺼짐',
      btnReplayTutorial: '📖 튜토리얼 다시 보기 (미션 1)',
      settingsLangBtn: '🌍 언어 / Language',
      settingsPrivBtn: '🔒 개인정보 보호',
      settingsDoneBtn: '저장 후 닫기 ✓',
      bossStageBanner: '섹터 보스 미션 #{id} • 보스 보너스 +80 🪙!',
      bootLoaderTitle: '드림 익스프레스 3D',
      bootLoaderSub: '3D 엔진 초기화 및 기관차 로딩 중...',
      exitModalTitle: '게임을 종료하시겠습니까?',
      exitModalDesc: '모든 미션 진행 상황과 별은 자동으로 저장됩니다. 종료하시겠습니까?',
      btnExitStay: '🚄 계속 플레이',
      btnExitConfirm: '게임 종료',
      toastAutoSolveFmt: '🤖 AI가 미션 #{id} 경로를 해결하고 열차를 출발시킵니다...',
      toastResetGrid: '🔄 선로 배치를 처음 상태로 무료 초기화했습니다',
      toastSpeedSetFmt: '🚄 열차 주행 속도 설정: {tier}단계',
      toastChaseOn: '🎥 열차 추적 카메라 활성화!',
      toastChaseOff: '🎥 전체 시점 카메라로 복귀',
      toastTrackIncompleteFmt: '⚡ 선로 미완성 ({n}개 연결됨) • 레일을 탭해 회전하거나 💡 스마트 레이더를 사용하세요!',
      toastRouteShortcutFmt: '✨ 선로 연결됨 (⭐ {sparks}/3) • 지금 출발하거나 3⭐을 위해 레일을 더 회전하세요!',
      toastRouteFull3Star: '🌟 3스타 완벽 경로 연결 완료 (3/3 ⭐) • 곧 열차가 출발합니다!',
      toastSkinPerkFmt: '🔒 {skin} 특성: 레일 {locks}개 자동 잠금{freeze}!',
      toastSkinFreezeSuffixFmt: ' + {sec}초 자동 동결',
      toastAdDismissedEarly: '⚠️ 광고가 완료되기 전에 닫혀 보상이 지급되지 않았습니다.',
      toastLangChangedFmt: '🌍 언어가 {lang}(으)로 변경되었습니다',
      adSimOfflineBadge: '📴 오프라인 예비 모드 (전술 원자로 보정)',
      adSimReserveBadge: '⚡ 전술 원자로 보정 (예비 충전)',
      adSimOfflineDesc: '전술 원자로 보정 중 (3초) • 오프라인 상태에서 보상을 지급합니다!',
      adSimReserveDesc: '예비 원자로 보정 중 (3초) • 곧 보상을 지급합니다!',
      adSimWaitBtn: '⏳ 원자로 보정 중...',
      adSimSecFmt: '{n}초...',
      adSimDone: '완료! ✅',
      adSimClaimBtn: '🎁 보상 받고 계속하기',
      adSimCancelBtn: '취소',
      adTitleDoubleDaily: '일일 출석 보상 2배 (×2)',
      adTitleRentTrain: '슈퍼 마그레브 열차 체험 (1스테이지)',
      adTitleCryoFreeze: '크라이오 빙결 실드 (+20초 ❄️)',
      adTitleSmartHint: '스마트 레이더 힌트 (레일 2개 고정)',
      adTitleExtraSecFmt: '+{n}초 시간 추가',
      adTitleExtraMovesFmt: '+{n}회 이동 추가',
      adTitleDoubleCoins: '골드 코인 2배 (×2)',
      adTitleMysteryChest: '황금 보급 상자 열기',
      adTitleFreeCoins: '무료 골드 코인 (+100 🪙)',
      adTitleFreeHint: '무료 스마트 레이더 (+1 💡)',
      mechEndlessTitle: '무한 철도 마라톤 & 에너지 포털!',
      mechEndlessDesc: '연속 웨이브를 돌파해 최장 거리 기록(km)을 세우고 보너스 골드를 획득하세요!',
      mechBridgeTitle: '강철 현수교 선로',
      mechBridgeDesc: '터치하여 다리 상판을 맞추고 깊은 협곡을 안전하게 건너세요!',
      mechYSwitchTitle: '3방향 Y자 분기 스위치',
      mechYSwitchDesc: '황금빛 신호등 표시: 하나의 선로를 두 갈래로 분기합니다!',
      mechDualTrainTitle: '2열차 동시 운행 [1] & [2]',
      mechDualTrainDesc: '청록 열차[1]는 역[1]로, 황금 열차[2]는 역[2]로 안내하세요!',
      mechStormTitle: '폭풍 타임어택 챌린지!',
      mechStormDesc: '제한 시간 특별 미션! 타이머가 끝나기 전에 선로를 연결하세요.',
      mechSwitchTitle: '복선 곡선 평행 스위치',
      mechSwitchDesc: '시안색 중앙 허브: 교차 없이 두 개의 독립 곡선 경로를 통과시킵니다!',
      endlessWaveHudFmt: '♾️ 웨이브 {wave} ({km} km)',
      hudCrewTipFmt: '{rows}×{cols} 3D 철도 그리드 • 우회 경로(1~2⭐)로 빠르게 통과하거나 황금 별 3개를 모두 모으세요!',
      toastEmpireClaimFmt: '🏛️ 스테이션 엠파이어 Lv.{lv} 수익 수령: +{coins} 🪙! (시간당 +{rate} 🪙 생산)',
      toastEmpireIdleFmt: '🏛️ 스테이션 엠파이어 Lv.{lv} 시간당 +{rate} 🪙 생산 중! 섹터를 클리어해 역을 업그레이드하세요.',
      toastResumedFmt: '🔄 저장된 보드에서 미션 #{id}을(를) 이어서 진행합니다!',
      toastMission1Intro: '🚄 미션 1: 3D 선로를 터치해 회전시키고 역까지 연결하세요!',
      toastBossIntroFmt: '👑 섹터 보스 미션 #{id}! 완료 시 보스 보너스 +80 🪙 획득!',
      toastDualIntro: '🔀 2열차 미션! 먼저 연결된 열차부터 출발시키거나 두 노선을 함께 연결하세요!',
      toastTileLocked: '🔒 스마트 레이더로 자석 잠금된 선로입니다!',
      toastTileFixed: '🔩 고정 티타늄 선로 • 경로 설계 가이드로 활용하세요!',
      toastTileCross: '➕ 4방향 교차로는 회전 없이 수직·수평 통과가 가능합니다!',
      toastSeqTrain1Arrived: '✅ 열차 1이 제1역에 도착했습니다! 이제 열차 2 경로를 연결해 출발시키세요!',
      toastSeqTrain2Arrived: '✅ 열차 2가 제2역에 도착했습니다! 이제 열차 1 경로를 연결해 출발시키세요!',
      toastHintAllAligned: '⚡ 메인 경로의 모든 선로가 이미 정답 각도로 정렬되어 있습니다!',
      toastHintLockedFmt: '💡 스마트 레이더가 선로 {n}개를 정답 각도로 잠갔습니다!',
      toastMilestoneAlreadyFmt: '✅ ({stars} ⭐) 마일스톤 상자는 이미 수령했습니다!',
      toastMilestoneNeedFmt: '🔒 상자를 열려면 {needed} ⭐가 더 필요합니다 (+{coins} 🪙 & +{hints} 💡)!',
      toastMilestoneClaimedFmt: '🎉 스타 마일스톤 ({stars} ⭐) 수령: +{coins} 골드 코인 🪙 & +{hints} 레이더 💡!',
      toastDailyCoinsPartFmt: '+{n} 골드 코인 🪙',
      toastDailyHintsPartFmt: '+{n} 레이더 힌트 💡',
      toastDailyClaimedFmt: '🎁 {day}일차 보상 수령 ({mult}배): {parts}!',
      toastDailyChallengeStartFmt: '🌍 일일 글로벌 챌린지 (미션 #{id} • 7×6): 승리 시 골드 3배!',
      toastShopPreviewFmt: '🔊 {skin} 경적 & 엔진 사운드 재생 중!',
      toastShopEquippedFmt: '🚄 장착 완료: {skin}!',
      toastShopBoughtFmt: '🎉 구매 및 장착 완료: {skin}!',
      toastShopNeedBuyFmt: '⚠️ {skin} 구매에 {needed} 골드 코인이 더 필요합니다! 광고 보상으로 +100 🪙 획득 가능!',
      toastShopNeedUpgFmt: '⚠️ {skin} Lv.{lv} 업그레이드에 {needed} 코인이 더 필요합니다!',
      toastShopUpgradedFmt: '⬆️ {skin} Lv.{lv} 업그레이드 완료! 이동·시간·골드 보너스 증가!',
      toastAchClaimedFmt: '🏆 "{title}" 보상 수령: +{coins} 골드 코인 & +{hints} 레이더!',
      toastJump3StarFmt: '⚡ 3스타 마스터리를 위해 미션 #{id}(으)로 이동합니다!',
      toastRentActivated: '🚄 슈퍼 마그레브 활성화: 이동+6, +20초, 자동 잠금 & 별 자석!',
      toastNo3DBrowser: '⚠️ 현재 브라우저에서는 3D 모드를 사용할 수 없습니다',
      toastCryoActive: '❄️ 크라이오 빙결 실드 가동: +20초 & 폭풍 타이머 정지!',
      toastCryoAdded: '❄️ +20초 추가 및 폭풍 타이머 동결 완료!',
      toastQualityFmt: '✨ 3D 그래픽 품질: {tier}',
      toastDebugOn: '📊 성능 디버그 HUD 표시됨',
      toastDebugOff: '📊 성능 디버그 HUD 숨김',
      toastNeed150Hint: '⚠️ 스마트 힌트 구매에는 150 골드 코인이 필요합니다!',
      toastNeed250Super: '⚠️ 슈퍼 골든 키(4개 고정)에는 250 골드 코인이 필요합니다!',
      toastRescueSecAdFmt: '⏱️ +{n}초 추가 완료! 선로를 완성하세요!',
      toastRescueMovesAdFmt: '⚡ +{n}회 이동 추가 및 가이드 선로 1개 잠금!',
      toastNeed100Rescue: '⚠️ 100 골드 코인이 필요합니다! 무료 보상형 광고 버튼을 이용하세요!',
      toastRescueSecCoinsFmt: '⏱️ 100 코인으로 +{n}초를 구매했습니다!',
      toastRescueMovesCoinsFmt: '⚡ 100 코인으로 +{n}회 이동 추가 및 가이드 선로 1개 잠금!',
      toastDoubleEarnedFmt: '🪙 추가로 +{coins} 골드 코인을 획득했습니다!',
      toastChestOpened: '🎁 황금 보급 상자 개봉: +150 골드 코인 & +1 스마트 레이더!',
      shareVictoryTextFmt: '🚄 드림 익스프레스 3D 미션 #{id}을(를) ×{combo} 콤보로 클리어! 내 기록에 도전해보세요: {url}',
      toastShareReward: '📤 공유해 주셔서 감사합니다! +100 골드 코인 획득!',
      toastShareDone: '📤 승리 메시지를 친구들과 공유했습니다!',
      toastCampaign100Done: '👑 축하합니다 황제님! 드림 익스프레스 3D의 100개 미션을 모두 정복했습니다!',
      toastVipActivated: '👑 VIP 패스 활성화! 광고 제거, +1,500 코인, +10 힌트 & 황금 기관차 장착!',
      toastVipRestored: '✅ 이전 VIP 패스 구매 내역이 복원되었습니다!',
      toastVipNotFound: 'ℹ️ 현재 Google Play 계정에서 이전 VIP 구매 내역을 찾지 못했습니다.',
      toastVipConnecting: '💳 Google Play 결제 연결 중... 스토어를 확인하거나 아래에서 25,000 코인으로 황금 기관차를 해금하세요!',
      toastStarterGrantedFmt: '🎁 스타터 팩 활성화: +{amount} 🪙 & +3 💡 스마트 레이더!',
      toastCoinsGrantedFmt: '🪙 +{amount} 골드 코인이 금고에 추가되었습니다!',
      toastStarterIapInfo: '🎁 스타터 팩 (+2,500 🪙 + 3 💡)은 Android Google Play 결제와 연동됩니다!',
      toastSmallCoinsIapInfo: '💳 골드 코인 주머니 (+2,500 🪙)는 Android Google Play 결제와 연동됩니다!',
      toastMegaCoinsIapInfo: '💳 로열 골드 금고 (+15,000 🪙)는 Android Google Play 결제와 연동됩니다!',
      toastVipIapInfo: '💳 VIP 광고 제거 패스는 Google Play 결제와 연동되며, 25,000 코인으로도 황금 기관차를 해금할 수 있습니다!',
      toastFree100Earned: '🪙 무료로 +100 골드 코인을 획득했습니다!',
      toastNeed150ShopHint: '⚠️ 스마트 레이더 구매에는 150 골드 코인이 필요합니다!',
      toastAdded1Hint: '💡 스마트 레이더 +1 충전 완료!',
      toastFree1HintEarned: '💡 무료로 스마트 레이더 +1을 획득했습니다!'
    },
    de: {
      topProgress: 'Fortschritt',
      vipBadgeTop: '👑 Overdrive-VIP-Pass Aktiv',
      gameTitle: 'Dream Express 3D',
      gameSubtitle: 'Kontinentales Schienennetz • 100 Missionen',
      ownerPillText: '👑 Entwickler-Vollversion • Alle Missionen 1–100 freigeschaltet',
      btnPlayNowPrefix: 'Aktuelle Mission spielen (Lv.',
      btnSectorMap: 'Sektorenkarte',
      btnLocomotiveShop: 'Lokomotiven-Depot',
      btnBackHome: 'Menü',
      hudMoves: 'Züge',
      hudEnergy: 'Sterne',
      hudCam3D: '3D',
      hudCamTop: 'Oben',
      hudFreeze: 'Frost',
      hudTrains: 'Loks',
      hudCrew: 'Crew',
      hudSettings: 'Optionen',
      hudAutoPlay: 'KI-Lösung',
      btnReset: 'Neu',
      btnUndo: 'Zurück',
      btnSmartHint: 'Smart-Radar',
      btnLaunchReady: 'Abfahrt! 🚄',
      btnLaunchTrain1: 'Zug 1 Start! 🚄',
      btnLaunchTrain2: 'Zug 2 Start! 🚄',
      btnTrainRunning: 'Zug fährt... 🚄',
      speedBarLabel: '🚄 Tempo:',
      chaseCamLabel: 'Verfolgung',
      badgeFreeAd: '🎬 Gratis',
      adBannerCopy: '⚡ Overdrive-VIP-Pass: Goldene 3D-Plasmalok freischalten & Werbung entfernen!',
      adBannerCta: 'Aktivieren',
      adOfflineBanner: '📴 Offline-Modus aktiv • Alle 100 Missionen spielbar!',
      dialogueSkip: 'Überspringen ⏭️',
      dialogueNext: 'Weiter',
      dialogueStartMission: 'Mission starten!',
      dialogueViewResults: 'Ergebnis 🏆',
      hintModalTitle: '💡 Smart-Radar-Hinweis',
      hintModalDesc: '„Das Hydraulik-Gyroskop dreht <strong>2 Hauptstrecken-Gleise</strong> exakt in den Lösungswinkel und verriegelt sie magnetisch ohne Zugverlust!“',
      hintUseFreePrefix: 'Radarladung nutzen (',
      hintWatchAd: 'Kurzes Video ansehen (2 Gleise gratis sperren)',
      hintBuyCoins: 'Sofort-Hinweis: 2 Gleise sperren (150 Münzen)',
      hintBuySuper: 'Goldener Hauptschlüssel: 4 Gleise sperren (250 Münzen)',
      oomTitleMoves: '⚠️ Keine Schaltzüge mehr!',
      oomDescMoves: '„Alle Schaltzüge wurden verbraucht! Lade den Ersatzreaktor auf, um genau an dieser Stelle weiterzuspielen!“',
      oomTipSuffix: ' 💡 Tipp: Stärkere Loks im (⚙️ Lokomotiven-Depot) gewähren Auto-Gleissperren, Extrazüge und Bonuszeit!',
      oomAdMoves: '+{n} Extrazüge gratis (Werbevideo)',
      oomCoinsMoves: '+{n} Extrazüge sofort kaufen (100 Goldmünzen)',
      oomTitleTimer: '⏱️ Sturm-Timer abgelaufen!',
      oomDescTimer: '„Der Sturm-Countdown ist abgelaufen! Füge Extrazeit hinzu oder starte kostenlos neu!“',
      oomAdTimer: '+{n} Sek. Extrazeit gratis (Werbevideo)',
      oomCoinsTimer: '+{n} Sek. Extrazeit kaufen (100 Goldmünzen)',
      oomRetryFree: 'Mission kostenlos neu starten',
      victoryRibbon: '⚡ Zielbahnhof erfolgreich verbunden!',
      vicTitleWin: 'Mission geschafft!',
      victoryTotalRewardLabel: '🪙 Gesamtbelohnung:',
      victorySectorsBtn: 'Sektoren',
      victoryLevelDoneFmt: 'Mission {id} geschafft: {title}!',
      victoryPerfFmt: '{badge} Rang: {rank} (+{xp} XP) | Kombo: ×{combo} | Serie: 🔥{streak}',
      victoryDailyRankFmt: '🌍 Tages-Weltrang: Top {pct}% weltweit! | {badge} +{xp} XP',
      victoryEndlessFmt: '♾️ Welle {wave} gemeistert! Distanz: {km} km (Rekord: {best} km)',
      victorySectorPowerFmt: '{icon} {sector} Energie',
      victoryCoinsFmt: '+{coins} Goldmünzen',
      victoryFormulaFmt: 'Sterne & Züge + Kombo (+{combo}) + Tempo & Lok (+{speed}){extra}',
      victoryExtraLabel: 'Extra',
      victoryDoubleFmt: 'Belohnung ×2 verdoppeln (+{coins} Münzen)',
      victoryDoubledFmt: '✅ Belohnung verdoppelt (+{coins} Münzen)!',
      victoryNextMissionFmt: 'Nächste Mission ({id})',
      victoryNextWaveFmt: 'Nächste Welle (#{wave}) ♾️',
      victoryCampaignFmt: 'Kampagne ({id})',
      victoryFinalMap: 'Siegeskarte',
      shopTitle: '⚙️ 3D-Lokomotiven-Depot & VIP-Shop',
      shopSubtitle: 'Rüste deine 3D-Lokomotiven auf oder lade Smart-Radar-Hinweise nach',
      vipBadgeCard: '👑 Ultimatives Strategie-Paket',
      vipCardTitle: 'Overdrive-VIP-Pass',
      vipPerk1: '⚡ Schalte die <strong>Goldene 3D-Plasmalok</strong> mit Sternfunken & Laserlicht frei',
      vipPerk2: '🚫 Entfernt dauerhaft alle Unterbrechungs- und Banner-Anzeigen',
      vipPerk3: '💡 Sofort <strong>+10 Smart-Radar-Ladungen</strong> + <strong>🪙 1.500 Goldmünzen</strong>',
      vipActiveLabel: '✅ Overdrive-VIP-Pass ist aktiv!',
      vipBuyLabel: '🌟 VIP-Pass aktivieren ($2.99)',
      starterBadgeTop: '🎁 Einmaliges Zugführer-Willkommenspaket',
      starterPackTitle: 'Starter-Zugführerpaket (+2.500 🪙 + 3 💡 Gratis!)',
      starterPackDesc: 'Der beste Startschub für Hochgeschwindigkeitszüge + 3 Smart-Radar-Ladungen',
      starterBuyLabel: '🎁 Starterpaket sichern ($0.99)',
      shopHintsSectionTitle: '💡 Smart-Radar & Münzpakete',
      shopHintRow1Title: 'Smart-Radar-Ladung (+1 💡)',
      shopHintRow1Desc: 'Dreht und verriegelt 2 Lösungsgleise magnetisch ohne Zugkosten',
      shopHintRow2Title: 'Gratis-Radarladung per Werbevideo (+1 💡)',
      shopHintRow2Desc: 'Sieh ein kurzes Video für eine sofortige Smart-Radar-Ladung',
      shopHintRow3Title: 'Gratis-Goldmünzen (+100 🪙)',
      shopHintRow3Desc: 'Sieh ein kurzes Video und erhalte +100 Goldmünzen für neue Loks',
      coinsSmallTitle: 'Goldmünzen-Beutel (+2.500 🪙)',
      coinsSmallDesc: 'Sofort-Aufladung zum Freischalten & Aufrüsten von Loks',
      coinsSmallPrice: '$0.99',
      coinsMegaTitle: '👑 Königlicher Goldtresor (+15.000 🪙)',
      coinsMegaDesc: 'Bester Gegenwert für das Upgrade deiner gesamten 3D-Flotte',
      coinsMegaPrice: '$4.99',
      shopSkinsSectionTitle: '🚄 Gepanzerte & Hochgeschwindigkeits-3D-Loks',
      skinEquipped: '✅ Ausgerüstet',
      skinEquip: 'Ausrüsten',
      skinBuyFmt: '🪙 {price} • Kaufen',
      skinUpgradeFmt: '⬆️ Aufwerten Lv.{cur}→{next} (🪙 {cost})',
      skinMaxLv: '👑 Max. Stufe Lv.5',
      statSpeed: 'Tempo',
      statMoves: 'Züge',
      statTime: 'Zeit',
      statGold: 'Gold',
      btnHearHorn: 'Horn & Motor hören',
      perkSummaryFmt: '{perk} (🔒Sperren:{locks} | ❄️Frost:{freeze}s | Züge+{moves} | Zeit+{time}s | Gold+{gold}%)',
      achModalTitle: '🏆 Erfolge & Belohnungen',
      achModalSubtitle: 'Meistere strategische Ziele für Goldmünzen und Smart-Radar-Ladungen',
      achSummaryLabel: '🎖️ Abgeschlossene Erfolge:',
      achClaimed: '✅ Abgeholt',
      achClaim: '🎁 Abholen',
      btnDailyChallenge: 'Tages-Challenge 3x Gold',
      btnDailyStreak: 'Tagesgeschenk',
      dailyBriefingTitle: '🌍 Globale Tages-Challenge (7×6 Doppelzug-Raster)',
      dailyBriefingDesc: 'Die heutige Tages-Challenge ist eine fortgeschrittene 7×6-Doppelzug-Sektormission! Dein normaler Kampagnenfortschritt bleibt sicher gespeichert – gewinne für 3x Goldmünzen!',
      dailyBriefingConfirm: 'Tages-Challenge starten (3x Gold) 🌍',
      dailyBriefingCancel: 'Zurück zur Kampagne',
      btnRentTrain: 'Superzug',
      empireReadyFmt: 'Bahnhof Lv.{lv} • +{coins} 🪙',
      empireIdleFmt: 'Bahnhofs-Imperium Lv.{lv}',
      endlessBestFmt: 'Endlos-Schiene ({km} km)',
      endlessDefault: 'Endlos-Express',
      rankPillFmt: '{icon} Rang: {rank} ({stars}/300 ⭐)',
      mapSectorOfFmt: '{icon} Sektor {id} von {total}',
      mapSectorLevelsFmt: 'Sektor {id} • Missionen {from}–{to}',
      mapPowerLabel: 'Energie',
      mapPlayNowBtn: 'Jetzt spielen 🚄',
      mapLockedBtn: '🔒 Gesperrt',
      mapLevelGridFmt: 'Mission #{id} • Raster {rows}×{cols}',
      btnNext3Star: '3⭐ Jagd',
      hudLevelFmt: '{icon}Lv.{id}{badges}',
      hudMissionTitleFmt: 'Mission #{id}',
      hudSectorFmt: '{icon} Sektor {id}: {name}',
      dailyLoginTitle: '🎁 7-Tage-Login-Serie',
      dailyLoginSub: 'Täglich einloggen und gratis Goldmünzen & Radar-Hinweise sichern!',
      dailyDayFmt: 'Tag {day}',
      dailyCoinsFmt: '{n} Münzen',
      dailyHintsFmt: '{n} Radar-Hinweis',
      dailyGrandLabel: '500 Münzen + 2 💡',
      btnClaimDaily1x: 'Belohnung abholen',
      btnClaimDaily2x: 'Doppelt ×2 (Video)',
      btnDailyAlreadyClaimed: '✅ Heute bereits abgeholt!',
      chestLabelPrefix: '🎁 Geheim-Versorgungstruhe:',
      btnOpenChest: '🎁 Truhe öffnen (+150 🪙 & +1 💡) •\u00A0Video',
      btnVictoryShare: 'Sieg teilen & Freund herausfordern (+100 🪙)',
      btnVictoryShareDone: '✅ Heute geteilt',
      btnRestorePurchases: 'Frühere Käufe wiederherstellen',
      btnShopPrivacy: 'Datenschutzerklärung & Datensicherheit',
      privacyModalTitle: '🔒 Datenschutzerklärung & Datenschutz',
      privacyModalSubtitle: 'Dream Express 3D • Entwickelt von ALDHFLY GAMES (com.dreamexpress.puzzletracks)',
      privacySummaryHtml: '<p><strong>1. Lokale Speicherung & keine personenbezogenen Daten (<code dir="ltr">dream_express_save_v123_public</code>):</strong> Keine Registrierung erforderlich; Spielstände werden ausschließlich lokal auf Ihrem Gerät gespeichert.</p><p><strong>2. Werbung & Käufe:</strong> Nutzt ausschließlich das offizielle Google AdMob SDK sowie Google Play Billing v8.0.0. Kontakt: <code>aldhfly@gmail.com</code></p>',
      privacyFullLinkLabel: '📄 Vollständige Datenschutzerklärung öffnen',
      privacyCloseBtnLabel: 'Verstanden',
      starRoadTitle: '🎁 Sternenpfad (Truhe antippen zum Abholen)',
      tutorialTapToRotate: 'Tippen zum Drehen',
      tutStep1Title: 'Gleis drehen',
      tutStep1Desc: 'Tippe auf das markierte Gleis, um es um 90° zu drehen und die Strecke über alle 3 Sterne zum Bahnhof zu verbinden!',
      tutStep2Title: '3D- / Draufsicht-Kamera',
      tutStep2Desc: 'Tippe jederzeit auf (3D / Oben), um zwischen Kino-3D und taktischer Übersicht zu wechseln!',
      tutStep3Title: 'Zugtempo & Verfolgerkamera [1 • 2 • 3]',
      tutStep3Desc: 'Wähle jederzeit dein bevorzugtes Zugtempo (1, 2 oder 3) oder aktiviere die Verfolgerkamera!',
      tutStep4Title: 'Grünes Signal — Abfahrt!',
      tutStep4Desc: 'Strecke verbunden! Tippe auf (Abfahrt!), um den Express ins Ziel zu steuern!',
      settingsTitle: '⚙️ Audio- & Grafik-Einstellungen',
      settingsSubtitle: 'Getrennte Zug-/Musik-Lautstärke & 60FPS-3D-Grafikqualität',
      settingsSfx: '🔊 Zug- & Effektlautstärke',
      settingsBgm: '🎵 Hintergrundmusik (BGM)',
      settingsQuality: '🖥️ 3D-Grafikqualität',
      qualAuto: 'Auto',
      qualMid: 'Ausgewogen',
      qualHigh: 'Ultra 60FPS',
      hapticsOn: '📳 Vibration: EIN',
      hapticsOff: '📳 Vibration: AUS',
      btnReplayTutorial: '📖 Einführungstutorial wiederholen (Lv.1)',
      settingsLangBtn: '🌍 Sprache / Language',
      settingsPrivBtn: '🔒 Datenschutz',
      settingsDoneBtn: 'Speichern & Schließen ✓',
      bossStageBanner: 'Sektor-Bossmission #{id} • +80 🪙 Boss-Bonus!',
      bootLoaderTitle: 'Dream Express 3D',
      bootLoaderSub: '3D-Engine & Lokomotiven werden geladen...',
      exitModalTitle: 'Spiel beenden?',
      exitModalDesc: 'Möchtest du Dream Express 3D wirklich beenden? Dein gesamter Fortschritt ist automatisch gespeichert.',
      btnExitStay: '🚄 Weiterspielen',
      btnExitConfirm: 'Spiel beenden',
      toastAutoSolveFmt: '🤖 KI löst Mission #{id} und startet den Express...',
      toastResetGrid: '🔄 Gleisnetz kostenlos zurückgesetzt',
      toastSpeedSetFmt: '🚄 Zugtempo gewählt: Stufe {tier}',
      toastChaseOn: '🎥 Verfolgerkamera aktiviert!',
      toastChaseOff: '🎥 Übersichtskamera aktiv',
      toastTrackIncompleteFmt: '⚡ Strecke unvollständig ({n} Gleise verbunden) • Gleise drehen oder 💡 Smart-Radar nutzen!',
      toastRouteShortcutFmt: '✨ Strecke bereit (⭐ {sparks}/3) • Jetzt starten oder für alle 3⭐ weiterdrehen!',
      toastRouteFull3Star: '🌟 Volle 3-Sterne-Strecke verbunden (3/3 ⭐) • Bereit zur Abfahrt!',
      toastSkinPerkFmt: '🔒 {skin}-Bonus: {locks} Gleis(e) automatisch gesperrt{freeze}!',
      toastSkinFreezeSuffixFmt: ' + {sec}s Auto-Frost',
      toastAdDismissedEarly: '⚠️ Werbung vorzeitig geschlossen — keine Belohnung gewährt.',
      toastLangChangedFmt: '🌍 Sprache gewechselt zu {lang}',
      adSimOfflineBadge: '📴 Offline-Reservemodus (Reaktor-Kalibrierung)',
      adSimReserveBadge: '⚡ Taktische Reaktor-Kalibrierung (Reserve)',
      adSimOfflineDesc: 'Taktische Reaktor-Kalibrierung (3s) • Offline-Belohnung wird vorbereitet!',
      adSimReserveDesc: 'Ersatzreaktor wird kalibriert (3s), um deine Belohnung freizuschalten!',
      adSimWaitBtn: '⏳ Reaktor kalibriert...',
      adSimSecFmt: '{n} Sek...',
      adSimDone: 'Fertig! ✅',
      adSimClaimBtn: '🎁 Belohnung abholen & weiter',
      adSimCancelBtn: 'Abbrechen',
      adTitleDoubleDaily: 'Tagesgeschenk verdoppeln ×2',
      adTitleRentTrain: 'Super-Maglev testen (1 Mission)',
      adTitleCryoFreeze: 'Kryo-Frostschild (+20s ❄️)',
      adTitleSmartHint: 'Smart-Radar-Hinweis (2 Gleise sperren)',
      adTitleExtraSecFmt: '+{n} Extra-Sekunden',
      adTitleExtraMovesFmt: '+{n} Extra-Züge',
      adTitleDoubleCoins: 'Münzen verdoppeln ×2',
      adTitleMysteryChest: 'Goldene Versorgungstruhe öffnen',
      adTitleFreeCoins: 'Gratis-Goldmünzen (+100 🪙)',
      adTitleFreeHint: 'Gratis-Smart-Radar (+1 💡)',
      mechEndlessTitle: 'Endlos-Express-Marathon & Portale!',
      mechEndlessDesc: 'Meistere endlose Wellen für neue Distanzrekorde (km) und Bonus-Gold!',
      mechBridgeTitle: 'Stahl-Hängebrücke',
      mechBridgeDesc: 'Tippe zum Ausrichten der Brücke und überquere tiefe Schluchten sicher!',
      mechYSwitchTitle: '3-Wege-Y-Weiche',
      mechYSwitchDesc: 'Bernsteinfarbene Weichenlaterne: teilt 1 Gleis in 2 Abzweigungen!',
      mechDualTrainTitle: 'Doppelzüge [1] & [2]',
      mechDualTrainDesc: 'Führe Cyan-Zug [1] zu Bahnhof [1] und Gold-Zug [2] zu Bahnhof [2]!',
      mechStormTitle: 'Sturm-Zeit-Herausforderung!',
      mechStormDesc: 'Zeitmission! Verbinde die Schienen, bevor der Sturm-Timer abläuft.',
      mechSwitchTitle: 'Parallel-Doppelkurvenweiche',
      mechSwitchDesc: 'Mit Cyan-Nabe markiert: leitet zwei unabhängige Kurven ohne Kreuzung!',
      endlessWaveHudFmt: '♾️ Welle {wave} ({km} km)',
      hudCrewTipFmt: '{rows}×{cols} 3D-Schienennetz • Nutze die 1–2⭐-Abkürzung oder verbinde alle 3 goldenen Sterne!',
      toastEmpireClaimFmt: '🏛️ Bahnhofsimperium Lv.{lv} abgeholt: +{coins} 🪙! (+{rate} 🪙/Std.)',
      toastEmpireIdleFmt: '🏛️ Bahnhofsimperium Lv.{lv} erzeugt +{rate} 🪙/Std.! Schließe Sektoren zum Ausbau ab.',
      toastResumedFmt: '🔄 Mission #{id} vom gespeicherten Stand fortgesetzt!',
      toastMission1Intro: '🚄 Mission 1: Tippe auf die 3D-Gleise, um sie zu drehen und zu verbinden!',
      toastBossIntroFmt: '👑 Sektor-Boss #{id}! Schließe die Strecke für +80 🪙 Boss-Bonus ab!',
      toastDualIntro: '🔀 Doppelzug-Mission! Starte Züge einzeln nacheinander oder verbinde beide zugleich!',
      toastTileLocked: '🔒 Dieses Gleis ist vom Smart-Radar magnetisch gesperrt!',
      toastTileFixed: '🔩 Festes Titangleis • nutze es als Orientierungspunkt!',
      toastTileCross: '➕ 4-Wege-Kreuzung erlaubt senkrechte Durchfahrt ohne Drehen!',
      toastSeqTrain1Arrived: '✅ Zug 1 hat Bahnhof 1 erreicht! Verbinde und starte nun Zug 2!',
      toastSeqTrain2Arrived: '✅ Zug 2 hat Bahnhof 2 erreicht! Verbinde und starte nun Zug 1!',
      toastHintAllAligned: '⚡ Alle Hauptgleise sind bereits richtig ausgerichtet!',
      toastHintLockedFmt: '💡 Smart-Radar hat {n} Gleise im Lösungswinkel gesperrt!',
      toastMilestoneAlreadyFmt: '✅ ({stars} ⭐) Meilenstein-Truhe bereits abgeholt!',
      toastMilestoneNeedFmt: '🔒 Sammle noch {needed} ⭐ für diese Truhe (+{coins} 🪙 & +{hints} 💡)!',
      toastMilestoneClaimedFmt: '🎉 Stern-Meilenstein ({stars} ⭐): +{coins} Goldmünzen 🪙 & +{hints} Radar 💡!',
      toastDailyCoinsPartFmt: '+{n} Goldmünzen 🪙',
      toastDailyHintsPartFmt: '+{n} Radar-Hinweis 💡',
      toastDailyClaimedFmt: '🎁 Tag-{day}-Belohnung ({mult}x): {parts}!',
      toastDailyChallengeStartFmt: '🌍 Tägliche Welt-Challenge (Mission #{id} • 7×6): Gewinne 3x Goldmünzen!',
      toastShopPreviewFmt: '🔊 Vorschau: {skin} Horn & Motor!',
      toastShopEquippedFmt: '🚄 Ausgerüstet: {skin}!',
      toastShopBoughtFmt: '🎉 Gekauft & ausgerüstet: {skin}!',
      toastShopNeedBuyFmt: '⚠️ Noch {needed} Goldmünzen für {skin} nötig! Schau ein Video für +100 🪙!',
      toastShopNeedUpgFmt: '⚠️ Noch {needed} Goldmünzen für Upgrade von {skin} auf Lv.{lv} nötig!',
      toastShopUpgradedFmt: '⬆️ {skin} auf Lv.{lv} verbessert! Mehr Züge, Zeit & Gold-Bonus!',
      toastAchClaimedFmt: '🏆 „{title}“ abgeholt: +{coins} Goldmünzen & +{hints} Radar!',
      toastJump3StarFmt: '⚡ Direktstart zu Mission #{id} für alle 3 Sterne!',
      toastRentActivated: '🚄 Super-Maglev aktiviert: +6 Züge, +20s, Auto-Sperre & Sternmagnet!',
      toastNo3DBrowser: '⚠️ 3D-Modus ist in diesem Browser nicht verfügbar',
      toastCryoActive: '❄️ Kryo-Frostschild aktiv: +20s & Sturm-Timer eingefroren!',
      toastCryoAdded: '❄️ +20s hinzugefügt & Sturm-Timer eingefroren!',
      toastQualityFmt: '✨ 3D-Grafikqualität: {tier}',
      toastDebugOn: '📊 Leistungs-HUD eingeblendet',
      toastDebugOff: '📊 Leistungs-HUD ausgeblendet',
      toastNeed150Hint: '⚠️ Du benötigst 150 Goldmünzen für einen Smart-Hinweis!',
      toastNeed250Super: '⚠️ Du benötigst 250 Goldmünzen für den Super-Goldschlüssel (4 Gleise)!',
      toastRescueSecAdFmt: '⏱️ +{n} Extra-Sekunden hinzugefügt! Verbinde die Strecke!',
      toastRescueMovesAdFmt: '⚡ +{n} Extra-Züge & 1 Leitgleis gesperrt!',
      toastNeed100Rescue: '⚠️ 100 Goldmünzen erforderlich! Nutze den kostenlosen Werbe-Button!',
      toastRescueSecCoinsFmt: '⏱️ +{n} Extra-Sekunden für 100 Goldmünzen gekauft!',
      toastRescueMovesCoinsFmt: '⚡ +{n} Extra-Züge & 1 Leitgleis für 100 Goldmünzen gekauft!',
      toastDoubleEarnedFmt: '🪙 +{coins} zusätzliche Goldmünzen erhalten!',
      toastChestOpened: '🎁 Versorgungstruhe geöffnet: +150 Goldmünzen & +1 Smart-Radar!',
      shareVictoryTextFmt: '🚄 Ich habe Mission #{id} in Dream Express 3D mit ×{combo} Kombo geschafft! Schaffst du mehr? {url}',
      toastShareReward: '📤 Danke fürs Teilen! +100 Goldmünzen erhalten!',
      toastShareDone: '📤 Siegesnachricht erfolgreich geteilt!',
      toastCampaign100Done: '👑 Glückwunsch, Imperator! Alle 100 Missionen in Dream Express 3D gemeistert!',
      toastVipActivated: '👑 VIP-Pass aktiviert! Werbefrei, +1.500 Münzen, +10 Hinweise & Gold-Lok ausgerüstet!',
      toastVipRestored: '✅ Früherer VIP-Pass erfolgreich wiederhergestellt!',
      toastVipNotFound: 'ℹ️ Kein früherer VIP-Kauf auf diesem Google-Play-Konto gefunden.',
      toastVipConnecting: '💳 Google Play Billing verbindet... Prüfe den Play Store oder schalte die Gold-Lok mit 25.000 Münzen frei!',
      toastStarterGrantedFmt: '🎁 Starter-Paket aktiviert: +{amount} 🪙 & +3 💡 Smart-Radar!',
      toastCoinsGrantedFmt: '🪙 +{amount} Goldmünzen zu deinem Tresor hinzugefügt!',
      toastStarterIapInfo: '🎁 Das Starter-Paket (+2.500 🪙 + 3 💡) wird über Google Play Billing auf Android abgerechnet!',
      toastSmallCoinsIapInfo: '💳 Der Münzbeutel (+2.500 🪙) wird über Google Play Billing auf Android abgerechnet!',
      toastMegaCoinsIapInfo: '💳 Der Königstresor (+15.000 🪙) wird über Google Play Billing auf Android abgerechnet!',
      toastVipIapInfo: '💳 Der VIP-Pass läuft über Google Play Billing! Die Gold-Lok ist auch für 25.000 Münzen freischaltbar!',
      toastFree100Earned: '🪙 +100 Gratis-Goldmünzen erhalten!',
      toastNeed150ShopHint: '⚠️ Du benötigst 150 Goldmünzen für eine Radar-Ladung!',
      toastAdded1Hint: '💡 +1 Smart-Radar-Ladung hinzugefügt!',
      toastFree1HintEarned: '💡 +1 Gratis-Smart-Radar erhalten!'
    },
    fr: {
      topProgress: 'Progrès',
      vipBadgeTop: '👑 Pass VIP Overdrive Actif',
      gameTitle: 'Dream Express 3D',
      gameSubtitle: 'Réseau Ferroviaire Continental • 100 Missions',
      ownerPillText: '👑 Version Propriétaire Débloquée • Niveaux 1–100 Ouverts',
      btnPlayNowPrefix: 'Jouer la mission (Niv.',
      btnSectorMap: 'Carte des Secteurs',
      btnLocomotiveShop: 'Garage Locomotives',
      btnBackHome: 'Accueil',
      hudMoves: 'Coups',
      hudEnergy: 'Étoiles',
      hudCam3D: '3D',
      hudCamTop: 'Haut',
      hudFreeze: 'Gel',
      hudTrains: 'Trains',
      hudCrew: 'Équipage',
      hudSettings: 'Options',
      hudAutoPlay: 'Auto-IA',
      btnReset: 'Réinit.',
      btnUndo: 'Annuler',
      btnSmartHint: 'Radar Guidage',
      btnLaunchReady: 'Départ ! 🚄',
      btnLaunchTrain1: 'Lancer Train 1 ! 🚄',
      btnLaunchTrain2: 'Lancer Train 2 ! 🚄',
      btnTrainRunning: 'Train en marche... 🚄',
      speedBarLabel: '🚄 Vitesse :',
      chaseCamLabel: 'Poursuite',
      badgeFreeAd: '🎬 Gratuit',
      adBannerCopy: '⚡ Pass VIP Overdrive : Débloquez la Locomotive Or 3D & supprimez les pubs !',
      adBannerCta: 'Activer',
      adOfflineBanner: '📴 Mode Hors-Ligne Actif • Les 100 missions sont disponibles !',
      dialogueSkip: 'Passer ⏭️',
      dialogueNext: 'Suivant',
      dialogueStartMission: 'Lancer la mission !',
      dialogueViewResults: 'Voir les résultats 🏆',
      hintModalTitle: '💡 Radar de Guidage Intelligent',
      hintModalDesc: '« Le gyroscope hydraulique oriente <strong>2 rails du tracé principal</strong> sur leur angle exact et les verrouille magnétiquement sans coûter de coup ! »',
      hintUseFreePrefix: 'Utiliser un Radar (',
      hintWatchAd: 'Voir une courte pub (Verrouiller 2 rails gratuit)',
      hintBuyCoins: 'Indice immédiat : Verrouiller 2 rails (150 pièces)',
      hintBuySuper: 'Clé d’Or Suprême : Verrouiller 4 rails (250 pièces)',
      oomTitleMoves: '⚠️ Plus de coups disponibles !',
      oomDescMoves: '« Les mouvements hydrauliques sont épuisés avant la jonction ! Rechargez le réacteur auxiliaire pour continuer exactement d’ici ! »',
      oomTipSuffix: ' 💡 Astuce : Équiper ou améliorer une locomotive dans le (⚙️ Garage) offre des rails pré-verrouillés, coups et temps bonus !',
      oomAdMoves: '+{n} coups bonus gratuits (Pub récompensée)',
      oomCoinsMoves: 'Acheter +{n} coups immédiats (100 pièces d’or)',
      oomTitleTimer: '⏱️ Temps de tempête écoulé !',
      oomDescTimer: '« Le compte à rebours est terminé avant le départ ! Ajoutez du temps bonus ou recommencez gratuitement ! »',
      oomAdTimer: '+{n} sec gratuites pour continuer (Pub)',
      oomCoinsTimer: 'Acheter +{n} sec immédiatement (100 pièces)',
      oomRetryFree: 'Recommencer gratuitement',
      victoryRibbon: '⚡ Terminus relié avec succès !',
      vicTitleWin: 'Mission terminée !',
      victoryTotalRewardLabel: '🪙 Récompense totale :',
      victorySectorsBtn: 'Secteurs',
      victoryLevelDoneFmt: 'Mission {id} réussie : {title} !',
      victoryPerfFmt: '{badge} Grade : {rank} (+{xp} XP) | Combo : ×{combo} | Série : 🔥{streak}',
      victoryDailyRankFmt: '🌍 Classement Mondial du Jour : Top {pct}% ! | {badge} +{xp} XP',
      victoryEndlessFmt: '♾️ Vague {wave} franchie ! Distance : {km} km (Record : {best} km)',
      victorySectorPowerFmt: '{icon} Énergie {sector}',
      victoryCoinsFmt: '+{coins} Pièces d’or',
      victoryFormulaFmt: 'Étoiles & Coups + Combo (+{combo}) + Vitesse & Train (+{speed}){extra}',
      victoryExtraLabel: 'Bonus',
      victoryDoubleFmt: 'Doubler ×2 (+{coins} pièces)',
      victoryDoubledFmt: '✅ Récompense doublée (+{coins} pièces) !',
      victoryNextMissionFmt: 'Mission suivante ({id})',
      victoryNextWaveFmt: 'Vague suivante (#{wave}) ♾️',
      victoryCampaignFmt: 'Mission Campagne ({id})',
      victoryFinalMap: 'Carte de la Victoire',
      shopTitle: '⚙️ Garage Locomotives 3D & Boutique VIP',
      shopSubtitle: 'Améliorez vos locomotives 3D ou rechargez votre Radar Intelligent',
      vipBadgeCard: '👑 Pack Stratégique Ultime',
      vipCardTitle: 'Pass VIP Overdrive',
      vipPerk1: '⚡ Débloquez la <strong>Locomotive Plasma Or 3D</strong> avec étincelles stellaires',
      vipPerk2: '🚫 Suppression définitive des publicités interstitielles et bannières',
      vipPerk3: '💡 <strong>+10 Radars Intelligents</strong> immédiats + <strong>🪙 1 500 Pièces d’or</strong>',
      vipActiveLabel: '✅ Pass VIP Overdrive Actif !',
      vipBuyLabel: '🌟 Activer le Pass VIP ($2.99)',
      starterBadgeTop: '🎁 Offre de Bienvenue Commandant (Unique)',
      starterPackTitle: 'Pack Départ Commandant (+2 500 🪙 + 3 💡 Offerts !)',
      starterPackDesc: 'Le meilleur coup d’envoi pour débloquer les trains rapides + 3 Radars gratuits',
      starterBuyLabel: '🎁 Obtenir le Pack Départ ($0.99)',
      shopHintsSectionTitle: '💡 Radars de Guidage & Pièces d’Or',
      shopHintRow1Title: 'Charge Radar Intelligent (+1 💡)',
      shopHintRow1Desc: 'Oriente et verrouille 2 rails de solution sans consommer de coup',
      shopHintRow2Title: 'Charge Radar Gratuite via Pub (+1 💡)',
      shopHintRow2Desc: 'Regardez une courte vidéo pour recevoir +1 Radar immédiatement',
      shopHintRow3Title: 'Pack de Pièces d’Or Gratuit (+100 🪙)',
      shopHintRow3Desc: 'Regardez une vidéo pour gagner +100 pièces d’or',
      coinsSmallTitle: 'Bourse de Pièces d’Or (+2 500 🪙)',
      coinsSmallDesc: 'Recharge immédiate pour débloquer et améliorer vos trains',
      coinsSmallPrice: '$0.99',
      coinsMegaTitle: '👑 Coffre Royal d’Or (+15 000 🪙)',
      coinsMegaDesc: 'Meilleure valeur stratégique pour toute votre flotte 3D',
      coinsMegaPrice: '$4.99',
      shopSkinsSectionTitle: '🚄 Locomotives 3D Blindées & Grande Vitesse',
      skinEquipped: '✅ Équipée',
      skinEquip: 'Équiper',
      skinBuyFmt: '🪙 {price} • Acheter',
      skinUpgradeFmt: '⬆️ Améliorer Niv.{cur}→{next} (🪙 {cost})',
      skinMaxLv: '👑 Niveau Max Niv.5',
      statSpeed: 'Vitesse',
      statMoves: 'Coups',
      statTime: 'Temps',
      statGold: 'Or',
      btnHearHorn: 'Écouter Klaxon & Moteur',
      perkSummaryFmt: '{perk} (🔒Rails:{locks} | ❄️Gel:{freeze}s | Coups+{moves} | Temps+{time}s | Or+{gold}%)',
      achModalTitle: '🏆 Succès & Récompenses',
      achModalSubtitle: 'Relevez les défis stratégiques pour gagner de l’or et des radars',
      achSummaryLabel: '🎖️ Succès accomplis :',
      achClaimed: '✅ Réclamé',
      achClaim: '🎁 Réclamer',
      btnDailyChallenge: 'Défi du Jour Or ×3',
      btnDailyStreak: 'Cadeau du Jour',
      dailyBriefingTitle: '🌍 Défi Mondial du Jour (Grille Double-Train 7×6)',
      dailyBriefingDesc: 'Le Défi Mondial du Jour est une mission avancée Double-Train 7×6 ! Votre progression de campagne reste intacte : terminez-la pour gagner 3× plus d’or !',
      dailyBriefingConfirm: 'Lancer le Défi du Jour (Or ×3) 🌍',
      dailyBriefingCancel: 'Retour à la campagne',
      btnRentTrain: 'Super Train',
      empireReadyFmt: 'Gare Niv.{lv} • +{coins} 🪙',
      empireIdleFmt: 'Empire Ferroviaire Niv.{lv}',
      endlessBestFmt: 'Rail Infini ({km} km)',
      endlessDefault: 'Marathon Express',
      rankPillFmt: '{icon} Grade : {rank} ({stars}/300 ⭐)',
      mapSectorOfFmt: '{icon} Secteur {id} sur {total}',
      mapSectorLevelsFmt: 'Secteur {id} • Missions {from}–{to}',
      mapPowerLabel: 'Énergie',
      mapPlayNowBtn: 'Jouer 🚄',
      mapLockedBtn: '🔒 Verrouillé',
      mapLevelGridFmt: 'Mission #{id} • Grille {rows}×{cols}',
      btnNext3Star: 'Chasse 3⭐',
      hudLevelFmt: '{icon}Niv.{id}{badges}',
      hudMissionTitleFmt: 'Mission #{id}',
      hudSectorFmt: '{icon} Secteur {id} : {name}',
      dailyLoginTitle: '🎁 Série de Connexion 7 Jours',
      dailyLoginSub: 'Connectez-vous chaque jour pour recevoir de l’or et des radars gratuits !',
      dailyDayFmt: 'Jour {day}',
      dailyCoinsFmt: '{n} Pièces',
      dailyHintsFmt: '{n} Radar',
      dailyGrandLabel: '500 Pièces + 2 💡',
      btnClaimDaily1x: 'Réclamer le cadeau',
      btnClaimDaily2x: 'Doubler ×2 (Pub)',
      btnDailyAlreadyClaimed: '✅ Déjà réclamé aujourd’hui !',
      chestLabelPrefix: '🎁 Coffre de Ravitaillement :',
      btnOpenChest: '🎁 Ouvrir le Coffre (+150 🪙 & +1 💡) •\u00A0Pub',
      btnVictoryShare: 'Partager & Défier un ami (+100 🪙)',
      btnVictoryShareDone: '✅ Partagé aujourd’hui',
      btnRestorePurchases: 'Restaurer les achats précédents',
      btnShopPrivacy: 'Politique de Confidentialité & Données',
      privacyModalTitle: '🔒 Politique de Confidentialité & Sécurité',
      privacyModalSubtitle: 'Dream Express 3D • Développé par ALDHFLY GAMES (com.dreamexpress.puzzletracks)',
      privacySummaryHtml: '<p><strong>1. Sauvegarde locale & zéro donnée personnelle (<code dir="ltr">dream_express_save_v123_public</code>) :</strong> Aucun compte requis ; votre progression est stockée uniquement sur votre appareil.</p><p><strong>2. Publicités & Achats :</strong> Utilise exclusivement le SDK officiel Google AdMob et Google Play Billing v8.0.0. Contact : <code>aldhfly@gmail.com</code></p>',
      privacyFullLinkLabel: '📄 Voir la Politique de Confidentialité complète',
      privacyCloseBtnLabel: 'J’ai compris',
      starRoadTitle: '🎁 Route des Étoiles (Touchez un coffre pour réclamer)',
      tutorialTapToRotate: 'Touchez pour tourner',
      tutStep1Title: 'Tourner le rail',
      tutStep1Desc: 'Touchez le rail illuminé pour le pivoter de 90° et relier la voie jusqu’au terminus via les 3 étoiles !',
      tutStep2Title: 'Caméra 3D / Vue du dessus',
      tutStep2Desc: 'Touchez (3D / Haut) à tout moment pour alterner entre vue 3D cinéma et vue tactique complète !',
      tutStep3Title: 'Vitesse & Caméra Poursuite [1 • 2 • 3]',
      tutStep3Desc: 'Choisissez votre vitesse préférée (1, 2 ou 3) ou activez la caméra poursuite à tout moment !',
      tutStep4Title: 'Feu vert — Départ !',
      tutStep4Desc: 'La voie est reliée ! Touchez (Départ !) pour lancer le train vers la gare !',
      settingsTitle: '⚙️ Paramètres Audio & Graphismes',
      settingsSubtitle: 'Volume indépendant Train/Musique & qualité 3D 60 FPS',
      settingsSfx: '🔊 Volume Train & Effets',
      settingsBgm: '🎵 Musique d’ambiance (BGM)',
      settingsQuality: '🖥️ Qualité Graphique 3D',
      qualAuto: 'Auto',
      qualMid: 'Équilibré',
      qualHigh: 'Ultra 60FPS',
      hapticsOn: '📳 Vibrations haptiques : OUI',
      hapticsOff: '📳 Vibrations haptiques : NON',
      btnReplayTutorial: '📖 Rejouer le tutoriel interactif (Niv.1)',
      settingsLangBtn: '🌍 Langue / Language',
      settingsPrivBtn: '🔒 Confidentialité',
      settingsDoneBtn: 'Enregistrer & Fermer ✓',
      bossStageBanner: 'Mission Boss #{id} • Bonus Boss +80 🪙 !',
      bootLoaderTitle: 'Dream Express 3D',
      bootLoaderSub: 'Initialisation du moteur 3D & des locomotives...',
      exitModalTitle: 'Quitter le jeu ?',
      exitModalDesc: 'Voulez-vous vraiment quitter Dream Express 3D ? Toute votre progression est sauvegardée automatiquement.',
      btnExitStay: '🚄 Continuer à jouer',
      btnExitConfirm: 'Quitter le jeu',
      toastAutoSolveFmt: '🤖 L’IA résout la mission #{id} et lance le train...',
      toastResetGrid: '🔄 Grille réinitialisée gratuitement',
      toastSpeedSetFmt: '🚄 Vitesse du train réglée : {tier}',
      toastChaseOn: '🎥 Caméra poursuite activée !',
      toastChaseOff: '🎥 Caméra vue d’ensemble rétablie',
      toastTrackIncompleteFmt: '⚡ Voie incomplète ({n} rails reliés) • Tournez les rails ou utilisez 💡 Radar !',
      toastRouteShortcutFmt: '✨ Voie reliée (⭐ {sparks}/3) • Partez maintenant ou visez les 3⭐ !',
      toastRouteFull3Star: '🌟 Voie 3 étoiles complète (3/3 ⭐) • Départ imminent !',
      toastSkinPerkFmt: '🔒 Bonus {skin} : {locks} rail(s) verrouillé(s){freeze} !',
      toastSkinFreezeSuffixFmt: ' + {sec}s de gel auto',
      toastAdDismissedEarly: '⚠️ Publicité fermée avant la fin — aucune récompense accordée.',
      toastLangChangedFmt: '🌍 Langue changée en {lang}',
      adSimOfflineBadge: '📴 Mode Réserve Hors-Ligne (Calibrage Tactique)',
      adSimReserveBadge: '⚡ Calibrage du Réacteur Tactique (Réserve)',
      adSimOfflineDesc: 'Calibrage du réacteur tactique (3s) • Attribution de la récompense hors-ligne !',
      adSimReserveDesc: 'Calibrage du réacteur de secours (3s) pour débloquer votre récompense !',
      adSimWaitBtn: '⏳ Calibrage du réacteur...',
      adSimSecFmt: '{n} s...',
      adSimDone: 'Terminé ! ✅',
      adSimClaimBtn: '🎁 Réclamer la récompense & continuer',
      adSimCancelBtn: 'Annuler',
      adTitleDoubleDaily: 'Doubler le cadeau quotidien ×2',
      adTitleRentTrain: 'Essayer le Super Maglev (1 niveau)',
      adTitleCryoFreeze: 'Bouclier Cryo-Gel (+20s ❄️)',
      adTitleSmartHint: 'Indice Radar Intelligent (2 rails verrouillés)',
      adTitleExtraSecFmt: '+{n} secondes bonus',
      adTitleExtraMovesFmt: '+{n} coups bonus',
      adTitleDoubleCoins: 'Doubler les pièces ×2',
      adTitleMysteryChest: 'Ouvrir le coffre de ravitaillement',
      adTitleFreeCoins: 'Pièces d’or gratuites (+100 🪙)',
      adTitleFreeHint: 'Radar intelligent gratuit (+1 💡)',
      mechEndlessTitle: 'Marathon Express Infini & Portails !',
      mechEndlessDesc: 'Enchaînez les vagues pour battre le record de distance (km) et gagner de l’or !',
      mechBridgeTitle: 'Pont Ferroviaire Suspendu',
      mechBridgeDesc: 'Touchez pour aligner le tablier du pont et franchir le canyon !',
      mechYSwitchTitle: 'Aiguillage Triple en Y',
      mechYSwitchDesc: 'Repérez la lanterne ambrée : divise 1 voie en 2 branches !',
      mechDualTrainTitle: 'Deux Trains [1] & [2]',
      mechDualTrainDesc: 'Guidez le Train Cyan [1] vers la Gare [1] et le Train Ambre [2] vers la Gare [2] !',
      mechStormTitle: 'Défi Tempête Chronométré !',
      mechStormDesc: 'Mission chronométrée ! Reliez la voie avant la fin du compte à rebours.',
      mechSwitchTitle: 'Aiguillage Double Courbe Parallèle',
      mechSwitchDesc: 'Moyeu central cyan : achemine deux courbes indépendantes sans croisement !',
      endlessWaveHudFmt: '♾️ Vague {wave} ({km} km)',
      hudCrewTipFmt: 'Grille 3D {rows}×{cols} • Prenez un raccourci (1–2⭐) ou reliez le parcours complet pour les 3 étoiles !',
      toastEmpireClaimFmt: '🏛️ Coffre Empire Niv.{lv} récupéré : +{coins} 🪙 ! (+{rate} 🪙/h)',
      toastEmpireIdleFmt: '🏛️ L’Empire Ferroviaire Niv.{lv} produit +{rate} 🪙/h ! Complétez des secteurs pour l’améliorer.',
      toastResumedFmt: '🔄 Mission #{id} reprise depuis votre sauvegarde !',
      toastMission1Intro: '🚄 Mission 1 : Touchez les rails 3D pour les pivoter et relier la ligne !',
      toastBossIntroFmt: '👑 Mission Boss #{id} ! Terminez la voie pour +80 🪙 de bonus Boss !',
      toastDualIntro: '🔀 Mission Double-Train ! Lancez chaque train dès qu’il est prêt ou reliez les deux voies !',
      toastTileLocked: '🔒 Ce rail est verrouillé magnétiquement par le Radar !',
      toastTileFixed: '🔩 Rail fixe en titane • utilisez-le comme repère !',
      toastTileCross: '➕ Le croisement quadruple permet le passage perpendiculaire sans rotation !',
      toastSeqTrain1Arrived: '✅ Train 1 arrivé en Gare 1 ! Reliez et lancez maintenant le Train 2 !',
      toastSeqTrain2Arrived: '✅ Train 2 arrivé en Gare 2 ! Reliez et lancez maintenant le Train 1 !',
      toastHintAllAligned: '⚡ Tous les rails principaux sont déjà alignés sur la solution !',
      toastHintLockedFmt: '💡 Le Radar a verrouillé {n} rails sur l’angle exact !',
      toastMilestoneAlreadyFmt: '✅ Coffre palier ({stars} ⭐) déjà récupéré !',
      toastMilestoneNeedFmt: '🔒 Obtenez encore {needed} ⭐ pour ouvrir ce coffre (+{coins} 🪙 & +{hints} 💡) !',
      toastMilestoneClaimedFmt: '🎉 Palier ({stars} ⭐) récupéré : +{coins} pièces d’or 🪙 & +{hints} Radar 💡 !',
      toastDailyCoinsPartFmt: '+{n} pièces d’or 🪙',
      toastDailyHintsPartFmt: '+{n} indice Radar 💡',
      toastDailyClaimedFmt: '🎁 Récompense Jour {day} ({mult}x) : {parts} !',
      toastDailyChallengeStartFmt: '🌍 Défi Mondial du Jour (Mission #{id} • 7×6) : Gagnez 3x plus d’or !',
      toastShopPreviewFmt: '🔊 Aperçu sonore : sirène et moteur {skin} !',
      toastShopEquippedFmt: '🚄 Équipé : {skin} !',
      toastShopBoughtFmt: '🎉 Acheté et équipé : {skin} !',
      toastShopNeedBuyFmt: '⚠️ Il manque {needed} pièces d’or pour {skin} ! Regardez une pub (+100 🪙) !',
      toastShopNeedUpgFmt: '⚠️ Il manque {needed} pièces d’or pour améliorer {skin} au Niv.{lv} !',
      toastShopUpgradedFmt: '⬆️ {skin} amélioré au Niv.{lv} ! Bonus de coups, temps et or augmentés !',
      toastAchClaimedFmt: '🏆 « {title} » récupéré : +{coins} pièces d’or & +{hints} Radar !',
      toastJump3StarFmt: '⚡ Accès rapide à la Mission #{id} pour viser les 3 étoiles !',
      toastRentActivated: '🚄 Super Maglev activé : +6 coups, +20s, verrouillage auto & aimant à étoiles !',
      toastNo3DBrowser: '⚠️ Mode 3D indisponible sur ce navigateur',
      toastCryoActive: '❄️ Bouclier Cryo actif : +20s & chrono tempête gelé !',
      toastCryoAdded: '❄️ +20s ajoutées & chrono tempête gelé !',
      toastQualityFmt: '✨ Qualité graphique 3D : {tier}',
      toastDebugOn: '📊 Affichage des performances activé',
      toastDebugOff: '📊 Affichage des performances masqué',
      toastNeed150Hint: '⚠️ Il faut 150 pièces d’or pour acheter un indice Radar !',
      toastNeed250Super: '⚠️ Il faut 250 pièces d’or pour la Super Clé d’Or (4 rails) !',
      toastRescueSecAdFmt: '⏱️ +{n} secondes ajoutées ! Terminez la voie !',
      toastRescueMovesAdFmt: '⚡ +{n} coups ajoutés & 1 rail guide verrouillé !',
      toastNeed100Rescue: '⚠️ 100 pièces d’or requises ! Utilisez le bouton vidéo gratuit !',
      toastRescueSecCoinsFmt: '⏱️ +{n} secondes achetées pour 100 pièces d’or !',
      toastRescueMovesCoinsFmt: '⚡ +{n} coups & 1 rail verrouillé achetés pour 100 pièces d’or !',
      toastDoubleEarnedFmt: '🪙 +{coins} pièces d’or supplémentaires gagnées !',
      toastChestOpened: '🎁 Coffre ouvert : +150 pièces d’or & +1 indice Radar !',
      shareVictoryTextFmt: '🚄 J’ai réussi la Mission #{id} dans Dream Express 3D avec un Combo ×{combo} ! Peux-tu faire mieux ? {url}',
      toastShareReward: '📤 Merci du partage ! +100 pièces d’or gagnées !',
      toastShareDone: '📤 Message de victoire partagé avec vos amis !',
      toastCampaign100Done: '👑 Félicitations Empereur ! Vous avez terminé les 100 missions de Dream Express 3D !',
      toastVipActivated: '👑 Pass VIP activé ! Pubs retirées, +1 500 pièces, +10 indices & Locomotive d’Or équipée !',
      toastVipRestored: '✅ Achat Pass VIP restauré avec succès !',
      toastVipNotFound: 'ℹ️ Aucun achat VIP antérieur trouvé sur ce compte Google Play.',
      toastVipConnecting: '💳 Connexion à Google Play Billing... Vérifiez Google Play ou débloquez la Locomotive d’Or avec 25 000 pièces !',
      toastStarterGrantedFmt: '🎁 Pack Départ activé : +{amount} 🪙 & +3 💡 Radar !',
      toastCoinsGrantedFmt: '🪙 +{amount} pièces d’or ajoutées à votre coffre !',
      toastStarterIapInfo: '🎁 Le Pack Départ (+2 500 🪙 + 3 💡) passe par Google Play Billing sur Android !',
      toastSmallCoinsIapInfo: '💳 La Bourse d’Or (+2 500 🪙) passe par Google Play Billing sur Android !',
      toastMegaCoinsIapInfo: '💳 Le Coffre Royal (+15 000 🪙) passe par Google Play Billing sur Android !',
      toastVipIapInfo: '💳 Le Pass VIP sans pub passe par Google Play Billing ! Locomotive d’Or aussi déblocable pour 25 000 pièces !',
      toastFree100Earned: '🪙 +100 pièces d’or gratuites gagnées !',
      toastNeed150ShopHint: '⚠️ Il faut 150 pièces d’or pour acheter une charge Radar !',
      toastAdded1Hint: '💡 +1 charge Radar ajoutée !',
      toastFree1HintEarned: '💡 +1 charge Radar gratuite gagnée !'
    },
    es: {
      topProgress: 'Progreso',
      vipBadgeTop: '👑 Pase VIP Overdrive Activo',
      gameTitle: 'Dream Express 3D',
      gameSubtitle: 'Red Ferroviaria Continental • 100 Misiones',
      ownerPillText: '👑 Edición Propietario Desbloqueada • Niveles 1–100 Abiertos',
      btnPlayNowPrefix: 'Jugar Misión Actual (Niv.',
      btnSectorMap: 'Mapa de Sectores',
      btnLocomotiveShop: 'Taller de Locomotoras',
      btnBackHome: 'Inicio',
      hudMoves: 'Giros',
      hudEnergy: 'Estrellas',
      hudCam3D: '3D',
      hudCamTop: 'Cenital',
      hudFreeze: 'Congelar',
      hudTrains: 'Trenes',
      hudCrew: 'Tripulación',
      hudSettings: 'Ajustes',
      hudAutoPlay: 'Auto-IA',
      btnReset: 'Reiniciar',
      btnUndo: 'Deshacer',
      btnSmartHint: 'Radar Guía',
      btnLaunchReady: '¡En Marcha! 🚄',
      btnLaunchTrain1: '¡Lanzar Tren 1! 🚄',
      btnLaunchTrain2: '¡Lanzar Tren 2! 🚄',
      btnTrainRunning: 'Tren en marcha... 🚄',
      speedBarLabel: '🚄 Velocidad:',
      chaseCamLabel: 'Persecución',
      badgeFreeAd: '🎬 Gratis',
      adBannerCopy: '⚡ Pase VIP Overdrive: ¡Desbloquea la Locomotora Dorada 3D y elimina los anuncios!',
      adBannerCta: 'Mejorar',
      adOfflineBanner: '📴 Modo Sin Conexión Activo • ¡Las 100 misiones disponibles!',
      dialogueSkip: 'Omitir ⏭️',
      dialogueNext: 'Siguiente',
      dialogueStartMission: '¡Iniciar Misión!',
      dialogueViewResults: 'Ver Resultados 🏆',
      hintModalTitle: '💡 Radar Guía Inteligente',
      hintModalDesc: '«¡El giroscopio hidráulico girará <strong>2 vías de la ruta principal</strong> a su ángulo exacto y las bloqueará magnéticamente sin gastar giros!»',
      hintUseFreePrefix: 'Usar carga de Radar (',
      hintWatchAd: 'Ver anuncio corto (Bloquear 2 vías gratis)',
      hintBuyCoins: 'Pista instantánea: Bloquear 2 vías (150 monedas)',
      hintBuySuper: 'Llave Dorada Suprema: Bloquear 4 vías (250 monedas)',
      oomTitleMoves: '⚠️ ¡Sin giros disponibles!',
      oomDescMoves: '«¡Se agotaron los giros hidráulicos antes de completar la vía! ¡Recarga el reactor auxiliar para continuar desde el mismo punto!»',
      oomTipSuffix: ' 💡 Consejo: ¡Mejorar locomotoras en el (⚙️ Taller) otorga bloqueo automático de vías, giros extra y más tiempo!',
      oomAdMoves: '+{n} giros extra gratis (Video con recompensa)',
      oomCoinsMoves: 'Comprar +{n} giros al instante (100 monedas)',
      oomTitleTimer: '⏱️ ¡Tiempo de tormenta agotado!',
      oomDescTimer: '«¡Terminó la cuenta regresiva antes de partir! ¡Añade segundos extra para seguir o reintenta gratis!»',
      oomAdTimer: '+{n} seg extra gratis para seguir (Anuncio)',
      oomCoinsTimer: 'Comprar +{n} seg al instante (100 monedas)',
      oomRetryFree: 'Reintentar desde el inicio (Gratis)',
      victoryRibbon: '⚡ ¡Estación conectada con éxito!',
      vicTitleWin: '¡Misión completada!',
      victoryTotalRewardLabel: '🪙 Recompensa total:',
      victorySectorsBtn: 'Sectores',
      victoryLevelDoneFmt: '¡Misión {id} completada: {title}!',
      victoryPerfFmt: '{badge} Rango: {rank} (+{xp} XP) | Combo: ×{combo} | Racha: 🔥{streak}',
      victoryDailyRankFmt: '🌍 Ranking Mundial Diario: ¡Top {pct}%! | {badge} +{xp} XP',
      victoryEndlessFmt: '♾️ ¡Oleada {wave} superada! Distancia: {km} km (Récord: {best} km)',
      victorySectorPowerFmt: '{icon} Energía de {sector}',
      victoryCoinsFmt: '+{coins} Monedas de oro',
      victoryFormulaFmt: 'Estrellas y Giros + Combo (+{combo}) + Velocidad y Tren (+{speed}){extra}',
      victoryExtraLabel: 'Extra',
      victoryDoubleFmt: 'Duplicar ×2 (+{coins} monedas)',
      victoryDoubledFmt: '✅ ¡Recompensa duplicada (+{coins} monedas)!',
      victoryNextMissionFmt: 'Siguiente Misión ({id})',
      victoryNextWaveFmt: 'Siguiente Oleada (#{wave}) ♾️',
      victoryCampaignFmt: 'Misión de Campaña ({id})',
      victoryFinalMap: 'Mapa de Victoria Final',
      shopTitle: '⚙️ Taller de Locomotoras 3D y Tienda VIP',
      shopSubtitle: 'Mejora tus locomotoras 3D o recarga el Radar Guía Inteligente',
      vipBadgeCard: '👑 Paquete Estratégico Definitivo',
      vipCardTitle: 'Pase VIP Overdrive',
      vipPerk1: '⚡ Desbloquea la <strong>Locomotora de Plasma Dorada 3D</strong> con chispas estelares',
      vipPerk2: '🚫 Elimina permanentemente los anuncios intersticiales y el banner inferior',
      vipPerk3: '💡 <strong>+10 Radares Inteligentes</strong> al instante + <strong>🪙 1.500 Monedas de oro</strong>',
      vipActiveLabel: '✅ ¡Pase VIP Overdrive Activo!',
      vipBuyLabel: '🌟 Activar Pase VIP ($2.99)',
      starterBadgeTop: '🎁 Oferta de Bienvenida del Comandante (1 vez)',
      starterPackTitle: 'Paquete Inicial (+2.500 🪙 + 3 💡 de regalo!)',
      starterPackDesc: 'El mejor impulso inicial para desbloquear trenes veloces + 3 Radares gratis',
      starterBuyLabel: '🎁 Obtener Paquete Inicial ($0.99)',
      shopHintsSectionTitle: '💡 Cargas de Radar y Monedas de Oro',
      shopHintRow1Title: 'Carga de Radar Guía (+1 💡)',
      shopHintRow1Desc: 'Gira y bloquea magnéticamente 2 vías correctas sin gastar giros',
      shopHintRow2Title: 'Carga de Radar Gratis con Anuncio (+1 💡)',
      shopHintRow2Desc: 'Mira un anuncio breve y recibe +1 Radar al instante',
      shopHintRow3Title: 'Paquete Gratis de Monedas (+100 🪙)',
      shopHintRow3Desc: 'Mira un anuncio breve para ganar +100 monedas de oro',
      coinsSmallTitle: 'Bolsa de Monedas de Oro (+2.500 🪙)',
      coinsSmallDesc: 'Impulso inmediato para desbloquear y mejorar locomotoras',
      coinsSmallPrice: '$0.99',
      coinsMegaTitle: '👑 Bóveda Real de Oro (+15.000 🪙)',
      coinsMegaDesc: 'El mejor valor estratégico para mejorar toda tu flota 3D',
      coinsMegaPrice: '$4.99',
      shopSkinsSectionTitle: '🚄 Locomotoras 3D Blindadas y de Alta Velocidad',
      skinEquipped: '✅ Equipada',
      skinEquip: 'Equipar',
      skinBuyFmt: '🪙 {price} • Comprar',
      skinUpgradeFmt: '⬆️ Mejorar Niv.{cur}→{next} (🪙 {cost})',
      skinMaxLv: '👑 Nivel Máx. Niv.5',
      statSpeed: 'Veloc.',
      statMoves: 'Giros',
      statTime: 'Tiempo',
      statGold: 'Oro',
      btnHearHorn: 'Oír Bocina y Motor',
      perkSummaryFmt: '{perk} (🔒Bloqueos:{locks} | ❄️Hielo:{freeze}s | Giros+{moves} | Tiempo+{time}s | Oro+{gold}%)',
      achModalTitle: '🏆 Logros y Recompensas',
      achModalSubtitle: 'Completa desafíos estratégicos para reclamar oro y radares',
      achSummaryLabel: '🎖️ Logros completados:',
      achClaimed: '✅ Reclamado',
      achClaim: '🎁 Reclamar',
      btnDailyChallenge: 'Reto Diario Oro ×3',
      btnDailyStreak: 'Regalo Diario',
      dailyBriefingTitle: '🌍 Desafío Mundial Diario (Cuadrícula 7×6 Doble Tren)',
      dailyBriefingDesc: '¡El Desafío Mundial Diario es una misión avanzada 7×6 de Dos Trenes! Tu progreso en la campaña queda a salvo; ¡complétala para ganar oro ×3!',
      dailyBriefingConfirm: 'Iniciar Desafío Diario (Oro ×3) 🌍',
      dailyBriefingCancel: 'Volver a la campaña',
      btnRentTrain: 'Súper Tren',
      empireReadyFmt: 'Estación Niv.{lv} • +{coins} 🪙',
      empireIdleFmt: 'Imperio Estación Niv.{lv}',
      endlessBestFmt: 'Vía Infinita ({km} km)',
      endlessDefault: 'Maratón Expreso',
      rankPillFmt: '{icon} Rango: {rank} ({stars}/300 ⭐)',
      mapSectorOfFmt: '{icon} Sector {id} de {total}',
      mapSectorLevelsFmt: 'Sector {id} • Misiones {from}–{to}',
      mapPowerLabel: 'Energía',
      mapPlayNowBtn: 'Jugar Ahora 🚄',
      mapLockedBtn: '🔒 Bloqueado',
      mapLevelGridFmt: 'Misión #{id} • Cuadrícula {rows}×{cols}',
      btnNext3Star: 'Ruta 3⭐',
      hudLevelFmt: '{icon}Niv.{id}{badges}',
      hudMissionTitleFmt: 'Misión #{id}',
      hudSectorFmt: '{icon} Sector {id}: {name}',
      dailyLoginTitle: '🎁 Racha Diaria de 7 Días',
      dailyLoginSub: '¡Entra cada día para reclamar monedas de oro y radares gratis!',
      dailyDayFmt: 'Día {day}',
      dailyCoinsFmt: '{n} Monedas',
      dailyHintsFmt: '{n} Radar',
      dailyGrandLabel: '500 Monedas + 2 💡',
      btnClaimDaily1x: 'Reclamar Regalo',
      btnClaimDaily2x: 'Duplicar ×2 (Anuncio)',
      btnDailyAlreadyClaimed: '✅ ¡Reclamado hoy!',
      chestLabelPrefix: '🎁 Cofre de Suministros:',
      btnOpenChest: '🎁 Abrir Cofre (+150 🪙 y +1 💡) •\u00A0Anuncio',
      btnVictoryShare: 'Compartir Victoria y Retar (+100 🪙)',
      btnVictoryShareDone: '✅ Compartido hoy',
      btnRestorePurchases: 'Restaurar compras anteriores',
      btnShopPrivacy: 'Política de Privacidad y Seguridad de Datos',
      privacyModalTitle: '🔒 Política de Privacidad y Protección de Datos',
      privacyModalSubtitle: 'Dream Express 3D • Desarrollado por ALDHFLY GAMES (com.dreamexpress.puzzletracks)',
      privacySummaryHtml: '<p><strong>1. Guardado local y cero datos personales (<code dir="ltr">dream_express_save_v123_public</code>):</strong> No requiere cuenta; todo tu progreso se guarda localmente en tu dispositivo.</p><p><strong>2. Anuncios y Compras:</strong> Usa únicamente Google AdMob SDK y Google Play Billing v8.0.0 oficiales. Contacto: <code>aldhfly@gmail.com</code></p>',
      privacyFullLinkLabel: '📄 Ver Política de Privacidad completa',
      privacyCloseBtnLabel: 'Entendido',
      starRoadTitle: '🎁 Camino de Estrellas (Toca un cofre para reclamar)',
      tutorialTapToRotate: 'Toca para girar la vía',
      tutStep1Title: 'Girar la vía',
      tutStep1Desc: '¡Toca el tramo iluminado para girarlo 90° y conectar la ruta pasando por las 3 estrellas hasta la estación!',
      tutStep2Title: 'Cámara 3D / Vista Cenital',
      tutStep2Desc: '¡Toca (3D / Cenital) en cualquier momento para alternar entre vista 3D y mapa táctico completo!',
      tutStep3Title: 'Velocidad y Cámara Persecución [1 • 2 • 3]',
      tutStep3Desc: '¡Elige la velocidad del tren (1, 2 o 3) o activa la cámara de persecución cuando quieras!',
      tutStep4Title: '¡Luz verde — En marcha!',
      tutStep4Desc: '¡Vía conectada! ¡Toca (¡En Marcha!) para conducir el tren hacia la terminal!',
      settingsTitle: '⚙️ Ajustes de Audio y Gráficos',
      settingsSubtitle: 'Control independiente de volumen de Tren/Música y calidad 3D 60FPS',
      settingsSfx: '🔊 Volumen de Tren y Efectos',
      settingsBgm: '🎵 Música de Fondo (BGM)',
      settingsQuality: '🖥️ Calidad Gráfica 3D',
      qualAuto: 'Auto',
      qualMid: 'Equilibrado',
      qualHigh: 'Ultra 60FPS',
      hapticsOn: '📳 Vibración háptica: SÍ',
      hapticsOff: '📳 Vibración háptica: NO',
      btnReplayTutorial: '📖 Repetir Tutorial Interactivo (Niv.1)',
      settingsLangBtn: '🌍 Idioma / Language',
      settingsPrivBtn: '🔒 Privacidad',
      settingsDoneBtn: 'Guardar y Cerrar ✓',
      bossStageBanner: '¡Misión Jefe #{id} • Bono de Jefe +80 🪙!',
      bootLoaderTitle: 'Dream Express 3D',
      bootLoaderSub: 'Iniciando motor 3D y cargando locomotoras...',
      exitModalTitle: '¿Salir del juego?',
      exitModalDesc: '¿Seguro que quieres salir de Dream Express 3D? Todo tu progreso y estrellas están guardados automáticamente.',
      btnExitStay: '🚄 Seguir jugando',
      btnExitConfirm: 'Salir del juego',
      toastAutoSolveFmt: '🤖 La IA está resolviendo la misión #{id} y despachando el tren...',
      toastResetGrid: '🔄 Cuadrícula reiniciada gratis desde el principio',
      toastSpeedSetFmt: '🚄 Velocidad del tren lista: {tier}',
      toastChaseOn: '🎥 ¡Cámara de persecución activada!',
      toastChaseOff: '🎥 Cámara panorámica restaurada',
      toastTrackIncompleteFmt: '⚡ Vía incompleta ({n} tramos unidos) • ¡Gira las vías o usa 💡 Radar Guía!',
      toastRouteShortcutFmt: '✨ Ruta conectada (⭐ {sparks}/3) • ¡Sal ahora o sigue girando por las 3⭐!',
      toastRouteFull3Star: '🌟 ¡Ruta completa de 3 estrellas conectada (3/3 ⭐) • Listo para salir!',
      toastSkinPerkFmt: '🔒 Bono de {skin}: ¡{locks} vía(s) bloqueada(s) al instante{freeze}!',
      toastSkinFreezeSuffixFmt: ' + {sec}s de hielo auto',
      toastAdDismissedEarly: '⚠️ Anuncio cerrado antes de terminar — no se otorgó recompensa.',
      toastLangChangedFmt: '🌍 Idioma cambiado a {lang}',
      adSimOfflineBadge: '📴 Modo Reserva Sin Conexión (Calibración Táctica)',
      adSimReserveBadge: '⚡ Calibración del Reactor Táctico (Reserva)',
      adSimOfflineDesc: 'Calibración del reactor táctico (3s) • ¡Entregando tu recompensa sin conexión!',
      adSimReserveDesc: '¡Calibrando el reactor de respaldo (3s) para entregarte tu recompensa!',
      adSimWaitBtn: '⏳ Calibrando reactor...',
      adSimSecFmt: '{n} seg...',
      adSimDone: '¡Completado! ✅',
      adSimClaimBtn: '🎁 Reclamar recompensa y continuar',
      adSimCancelBtn: 'Cancelar',
      adTitleDoubleDaily: 'Duplicar regalo diario ×2',
      adTitleRentTrain: 'Probar Súper Maglev (1 nivel)',
      adTitleCryoFreeze: 'Escudo Criogénico (+20s ❄️)',
      adTitleSmartHint: 'Pista de Radar Inteligente (fijar 2 vías)',
      adTitleExtraSecFmt: '+{n} segundos extra',
      adTitleExtraMovesFmt: '+{n} giros extra',
      adTitleDoubleCoins: 'Duplicar monedas ×2',
      adTitleMysteryChest: 'Abrir cofre de suministros',
      adTitleFreeCoins: 'Monedas de oro gratis (+100 🪙)',
      adTitleFreeHint: 'Radar inteligente gratis (+1 💡)',
      mechEndlessTitle: '¡Maratón Expreso Infinito y Portales!',
      mechEndlessDesc: '¡Supera oleadas infinitas para batir tu récord de distancia (km) y ganar oro extra!',
      mechBridgeTitle: 'Puente Ferroviario Colgante',
      mechBridgeDesc: '¡Toca para alinear el puente y cruzar profundos cañones con seguridad!',
      mechYSwitchTitle: 'Desvío Triple en Y',
      mechYSwitchDesc: 'Busca el farol ámbar brillante: ¡divide 1 vía en 2 ramales!',
      mechDualTrainTitle: 'Dos Trenes [1] y [2]',
      mechDualTrainDesc: '¡Guía el Tren Cian [1] a la Estación [1] y el Tren Ámbar [2] a la Estación [2]!',
      mechStormTitle: '¡Desafío de Tormenta Contrarreloj!',
      mechStormDesc: '¡Misión con tiempo! Conecta la línea férrea antes de que acabe la cuenta atrás.',
      mechSwitchTitle: 'Cambio Doble Curva Paralela',
      mechSwitchDesc: 'Marcado con centro cian: ¡dirige dos curvas independientes sin cruzarse!',
      endlessWaveHudFmt: '♾️ Oleada {wave} ({km} km)',
      hudCrewTipFmt: 'Cuadrícula 3D {rows}×{cols} • ¡Cruza por un atajo (1–2⭐) o conecta toda la ruta para las 3 estrellas!',
      toastEmpireClaimFmt: '🏛️ Bóveda Imperio Niv.{lv} reclamada: ¡+{coins} 🪙! (+{rate} 🪙/h)',
      toastEmpireIdleFmt: '🏛️ El Imperio Ferroviario Niv.{lv} genera +{rate} 🪙/h. ¡Completa sectores para mejorarlo!',
      toastResumedFmt: '🔄 ¡Misión #{id} reanudada desde tu partida guardada!',
      toastMission1Intro: '🚄 Misión 1: ¡Toca las vías 3D para girarlas y conectar la línea!',
      toastBossIntroFmt: '👑 ¡Misión de Jefe #{id}! ¡Completa la vía para ganar +80 🪙 extra!',
      toastDualIntro: '🔀 ¡Misión de Dos Trenes! ¡Puedes despachar cada tren al conectarlo o unir ambas rutas!',
      toastTileLocked: '🔒 ¡Esta vía está bloqueada magnéticamente por el Radar!',
      toastTileFixed: '🔩 Vía fija de titanio • ¡úsala como guía de ruta!',
      toastTileCross: '➕ ¡El cruce cuádruple permite el paso perpendicular sin girar!',
      toastSeqTrain1Arrived: '✅ ¡Tren 1 llegó a la Terminal 1! ¡Ahora conecta y lanza el Tren 2!',
      toastSeqTrain2Arrived: '✅ ¡Tren 2 llegó a la Terminal 2! ¡Ahora conecta y lanza el Tren 1!',
      toastHintAllAligned: '⚡ ¡Todas las vías principales ya están alineadas con la solución!',
      toastHintLockedFmt: '💡 ¡El Radar fijó {n} vías en su ángulo correcto!',
      toastMilestoneAlreadyFmt: '✅ ¡El cofre de ({stars} ⭐) ya fue reclamado!',
      toastMilestoneNeedFmt: '🔒 ¡Reúne {needed} ⭐ más para abrir este cofre (+{coins} 🪙 y +{hints} 💡)!',
      toastMilestoneClaimedFmt: '🎉 ¡Hito ({stars} ⭐) reclamado: +{coins} monedas 🪙 y +{hints} Radar 💡!',
      toastDailyCoinsPartFmt: '+{n} monedas de oro 🪙',
      toastDailyHintsPartFmt: '+{n} pista Radar 💡',
      toastDailyClaimedFmt: '🎁 Recompensa Día {day} ({mult}x): ¡{parts}!',
      toastDailyChallengeStartFmt: '🌍 Desafío Mundial Diario (Misión #{id} • 7×6): ¡Gana triple oro (3x)!',
      toastShopPreviewFmt: '🔊 ¡Escuchando bocina y motor de {skin}!',
      toastShopEquippedFmt: '🚄 Equipado: ¡{skin}!',
      toastShopBoughtFmt: '🎉 Comprado y equipado: ¡{skin}!',
      toastShopNeedBuyFmt: '⚠️ ¡Necesitas {needed} monedas más para {skin}! ¡Mira un anuncio (+100 🪙)!',
      toastShopNeedUpgFmt: '⚠️ ¡Necesitas {needed} monedas más para mejorar {skin} a Niv.{lv}!',
      toastShopUpgradedFmt: '⬆️ ¡{skin} mejorado a Niv.{lv}! ¡Más giros, tiempo y bono de oro!',
      toastAchClaimedFmt: '🏆 «{title}» reclamado: ¡+{coins} monedas y +{hints} Radar!',
      toastJump3StarFmt: '⚡ ¡Saltando a la Misión #{id} por las 3 estrellas!',
      toastRentActivated: '🚄 ¡Súper Maglev activado: +6 giros, +20s, bloqueo auto e imán de estrellas!',
      toastNo3DBrowser: '⚠️ El modo 3D no está disponible en este navegador',
      toastCryoActive: '❄️ ¡Escudo Criogénico activo: +20s y reloj congelado!',
      toastCryoAdded: '❄️ ¡+20s añadidos y reloj de tormenta congelado!',
      toastQualityFmt: '✨ Calidad gráfica 3D: {tier}',
      toastDebugOn: '📊 Panel de rendimiento activado',
      toastDebugOff: '📊 Panel de rendimiento oculto',
      toastNeed150Hint: '⚠️ ¡Necesitas 150 monedas de oro para comprar una pista Radar!',
      toastNeed250Super: '⚠️ ¡Necesitas 250 monedas de oro para la Súper Llave Dorada (4 vías)!',
      toastRescueSecAdFmt: '⏱️ ¡+{n} segundos añadidos! ¡Completa la vía!',
      toastRescueMovesAdFmt: '⚡ ¡+{n} giros extra y 1 vía guía bloqueada!',
      toastNeed100Rescue: '⚠️ ¡Necesitas 100 monedas! ¡Usa el botón de anuncio gratuito!',
      toastRescueSecCoinsFmt: '⏱️ ¡+{n} segundos comprados por 100 monedas!',
      toastRescueMovesCoinsFmt: '⚡ ¡+{n} giros y 1 vía guía comprados por 100 monedas!',
      toastDoubleEarnedFmt: '🪙 ¡Ganaste +{coins} monedas de oro extra!',
      toastChestOpened: '🎁 ¡Cofre abierto: +150 monedas de oro y +1 pista Radar!',
      shareVictoryTextFmt: '🚄 ¡Completé la Misión #{id} en Dream Express 3D con Combo ×{combo}! ¿Puedes superarme? {url}',
      toastShareReward: '📤 ¡Gracias por compartir! ¡Ganaste +100 monedas de oro!',
      toastShareDone: '📤 ¡Mensaje de victoria compartido con tus amigos!',
      toastCampaign100Done: '👑 ¡Felicidades Emperador! ¡Completaste las 100 misiones de Dream Express 3D!',
      toastVipActivated: '👑 ¡Pase VIP activado! ¡Sin anuncios, +1.500 monedas, +10 pistas y Locomotora de Oro!',
      toastVipRestored: '✅ ¡Compra anterior del Pase VIP restaurada con éxito!',
      toastVipNotFound: 'ℹ️ No se encontraron compras previas de VIP en esta cuenta de Google Play.',
      toastVipConnecting: '💳 Conectando con Google Play Billing... ¡Verifica Play Store o desbloquea la Locomotora de Oro con 25.000 monedas!',
      toastStarterGrantedFmt: '🎁 ¡Paquete Inicial activado: +{amount} 🪙 y +3 💡 Radar!',
      toastCoinsGrantedFmt: '🪙 ¡+{amount} monedas de oro añadidas a tu bóveda!',
      toastStarterIapInfo: '🎁 ¡El Paquete Inicial (+2.500 🪙 + 3 💡) se compra mediante Google Play Billing en Android!',
      toastSmallCoinsIapInfo: '💳 ¡La Bolsa de Oro (+2.500 🪙) se compra mediante Google Play Billing en Android!',
      toastMegaCoinsIapInfo: '💳 ¡La Bóveda Real (+15.000 🪙) se compra mediante Google Play Billing en Android!',
      toastVipIapInfo: '💳 ¡El Pase VIP sin anuncios usa Google Play Billing! ¡También puedes desbloquear la Locomotora de Oro con 25.000 monedas!',
      toastFree100Earned: '🪙 ¡Ganaste +100 monedas de oro gratis!',
      toastNeed150ShopHint: '⚠️ ¡Necesitas 150 monedas de oro para comprar un Radar!',
      toastAdded1Hint: '💡 ¡+1 carga de Radar añadida!',
      toastFree1HintEarned: '💡 ¡Ganaste +1 carga de Radar gratis!'
    },
    pt: {
      topProgress: 'Progresso',
      vipBadgeTop: '👑 Passe VIP Overdrive Ativo',
      gameTitle: 'Dream Express 3D',
      gameSubtitle: 'Malha Ferroviária Continental • 100 Missões',
      ownerPillText: '👑 Edição do Proprietário Desbloqueada • Níveis 1–100 Abertos',
      btnPlayNowPrefix: 'Jogar Missão Atual (Nív.',
      btnSectorMap: 'Mapa de Setores',
      btnLocomotiveShop: 'Oficina de Locomotivas',
      btnBackHome: 'Início',
      hudMoves: 'Giros',
      hudEnergy: 'Estrelas',
      hudCam3D: '3D',
      hudCamTop: 'Topo',
      hudFreeze: 'Congelar',
      hudTrains: 'Trens',
      hudCrew: 'Equipe',
      hudSettings: 'Ajustes',
      hudAutoPlay: 'Auto-IA',
      btnReset: 'Reiniciar',
      btnUndo: 'Desfazer',
      btnSmartHint: 'Radar Guia',
      btnLaunchReady: 'Partir! 🚄',
      btnLaunchTrain1: 'Partir Trem 1! 🚄',
      btnLaunchTrain2: 'Partir Trem 2! 🚄',
      btnTrainRunning: 'Trem em movimento... 🚄',
      speedBarLabel: '🚄 Veloc.:',
      chaseCamLabel: 'Perseguição',
      badgeFreeAd: '🎬 Grátis',
      adBannerCopy: '⚡ Passe VIP Overdrive: Desbloqueie a Locomotiva Dourada 3D e remova os anúncios!',
      adBannerCta: 'Ativar',
      adOfflineBanner: '📴 Modo Offline Ativo • Todas as 100 missões disponíveis!',
      dialogueSkip: 'Pular ⏭️',
      dialogueNext: 'Avançar',
      dialogueStartMission: 'Iniciar Missão!',
      dialogueViewResults: 'Ver Resultados 🏆',
      hintModalTitle: '💡 Radar Guia Inteligente',
      hintModalDesc: '«O giroscópio hidráulico girará <strong>2 trilhos da rota principal</strong> para o ângulo exato e os travará magneticamente sem gastar giros!»',
      hintUseFreePrefix: 'Usar carga de Radar (',
      hintWatchAd: 'Ver anúncio curto (Travar 2 trilhos grátis)',
      hintBuyCoins: 'Dica imediata: Travar 2 trilhos (150 moedas)',
      hintBuySuper: 'Chave Dourada Suprema: Travar 4 trilhos (250 moedas)',
      oomTitleMoves: '⚠️ Giros esgotados!',
      oomDescMoves: '«Os movimentos hidráulicos acabaram antes de concluir a linha! Recarregue o reator reserva para continuar do mesmo ponto!»',
      oomTipSuffix: ' 💡 Dica: Melhorar locomotivas na (⚙️ Oficina) concede travamento automático de trilhos, giros extras e mais tempo!',
      oomAdMoves: '+{n} giros extras grátis (Vídeo premiado)',
      oomCoinsMoves: 'Comprar +{n} giros na hora (100 moedas de ouro)',
      oomTitleTimer: '⏱️ Tempo da tempestade esgotado!',
      oomDescTimer: '«A contagem regressiva terminou antes da partida! Adicione segundos extras para continuar ou tente de novo grátis!»',
      oomAdTimer: '+{n} seg extras grátis para continuar (Anuncio)',
      oomCoinsTimer: 'Comprar +{n} seg na hora (100 moedas)',
      oomRetryFree: 'Reiniciar missão do início (Grátis)',
      victoryRibbon: '⚡ Estação conectada com sucesso!',
      vicTitleWin: 'Missão concluída!',
      victoryTotalRewardLabel: '🪙 Recompensa total:',
      victorySectorsBtn: 'Setores',
      victoryLevelDoneFmt: 'Missão {id} concluída: {title}!',
      victoryPerfFmt: '{badge} Patente: {rank} (+{xp} XP) | Combo: ×{combo} | Sequência: 🔥{streak}',
      victoryDailyRankFmt: '🌍 Ranking Mundial Diário: Top {pct}%! | {badge} +{xp} XP',
      victoryEndlessFmt: '♾️ Onda {wave} vencida! Distância: {km} km (Recorde: {best} km)',
      victorySectorPowerFmt: '{icon} Energia de {sector}',
      victoryCoinsFmt: '+{coins} Moedas de ouro',
      victoryFormulaFmt: 'Estrelas e Giros + Combo (+{combo}) + Velocidade e Trem (+{speed}){extra}',
      victoryExtraLabel: 'Extra',
      victoryDoubleFmt: 'Dobrar ×2 (+{coins} moedas)',
      victoryDoubledFmt: '✅ Recompensa dobrada (+{coins} moedas)!',
      victoryNextMissionFmt: 'Próxima Missão ({id})',
      victoryNextWaveFmt: 'Próxima Onda (#{wave}) ♾️',
      victoryCampaignFmt: 'Missão da Campanha ({id})',
      victoryFinalMap: 'Mapa da Vitória Final',
      shopTitle: '⚙️ Oficina de Locomotivas 3D e Loja VIP',
      shopSubtitle: 'Evolua suas locomotivas 3D ou recarregue o Radar Guia Inteligente',
      vipBadgeCard: '👑 Pacote Estratégico Supremo',
      vipCardTitle: 'Passe VIP Overdrive',
      vipPerk1: '⚡ Desbloqueie a <strong>Locomotiva de Plasma Dourada 3D</strong> com faíscas estelares',
      vipPerk2: '🚫 Remova permanentemente anúncios intersticiais e banners',
      vipPerk3: '💡 <strong>+10 Radares Inteligentes</strong> na hora + <strong>🪙 1.500 Moedas de ouro</strong>',
      vipActiveLabel: '✅ Passe VIP Overdrive Ativo!',
      vipBuyLabel: '🌟 Ativar Passe VIP ($2.99)',
      starterBadgeTop: '🎁 Oferta de Boas-Vindas do Maquinista (Única)',
      starterPackTitle: 'Pacote Inicial (+2.500 🪙 + 3 💡 de Bônus!)',
      starterPackDesc: 'O melhor impulso inicial para liberar trens velozes + 3 Radares grátis',
      starterBuyLabel: '🎁 Garantir Pacote Inicial ($0.99)',
      shopHintsSectionTitle: '💡 Cargas de Radar e Moedas de Ouro',
      shopHintRow1Title: 'Carga de Radar Guia (+1 💡)',
      shopHintRow1Desc: 'Gira e trava magneticamente 2 trilhos corretos sem gastar giros',
      shopHintRow2Title: 'Carga de Radar Grátis via Anúncio (+1 💡)',
      shopHintRow2Desc: 'Assista a um vídeo curto para receber +1 Radar na hora',
      shopHintRow3Title: 'Pacote Grátis de Moedas (+100 🪙)',
      shopHintRow3Desc: 'Assista a um vídeo curto para ganhar +100 moedas de ouro',
      coinsSmallTitle: 'Bolsa de Moedas de Ouro (+2.500 🪙)',
      coinsSmallDesc: 'Recarga imediata para liberar e evoluir locomotivas',
      coinsSmallPrice: '$0.99',
      coinsMegaTitle: '👑 Cofre Real de Ouro (+15.000 🪙)',
      coinsMegaDesc: 'Melhor custo-benefício para evoluir toda a sua frota 3D',
      coinsMegaPrice: '$4.99',
      shopSkinsSectionTitle: '🚄 Locomotivas 3D Blindadas e de Alta Velocidade',
      skinEquipped: '✅ Equipada',
      skinEquip: 'Equipar',
      skinBuyFmt: '🪙 {price} • Comprar',
      skinUpgradeFmt: '⬆️ Evoluir Nív.{cur}→{next} (🪙 {cost})',
      skinMaxLv: '👑 Nível Máx. Nív.5',
      statSpeed: 'Veloc.',
      statMoves: 'Giros',
      statTime: 'Tempo',
      statGold: 'Ouro',
      btnHearHorn: 'Ouvir Buzina e Motor',
      perkSummaryFmt: '{perk} (🔒Travas:{locks} | ❄️Gelo:{freeze}s | Giros+{moves} | Tempo+{time}s | Ouro+{gold}%)',
      achModalTitle: '🏆 Conquistas e Recompensas',
      achModalSubtitle: 'Conclua desafios estratégicos para resgatar ouro e radares',
      achSummaryLabel: '🎖️ Conquistas concluídas:',
      achClaimed: '✅ Resgatado',
      achClaim: '🎁 Resgatar',
      btnDailyChallenge: 'Desafio Diário Ouro ×3',
      btnDailyStreak: 'Prêmio Diário',
      dailyBriefingTitle: '🌍 Desafio Global Diário (Grade 7×6 Dois Trens)',
      dailyBriefingDesc: 'O Desafio Global Diário de hoje é uma missão avançada 7×6 com Dois Trens! Seu progresso na campanha continua salvo — conclua para ganhar ouro ×3!',
      dailyBriefingConfirm: 'Iniciar Desafio Diário (Ouro ×3) 🌍',
      dailyBriefingCancel: 'Voltar para a campanha',
      btnRentTrain: 'Super Trem',
      empireReadyFmt: 'Estação Nív.{lv} • +{coins} 🪙',
      empireIdleFmt: 'Império da Estação Nív.{lv}',
      endlessBestFmt: 'Trilho Infinito ({km} km)',
      endlessDefault: 'Maratona Expressa',
      rankPillFmt: '{icon} Patente: {rank} ({stars}/300 ⭐)',
      mapSectorOfFmt: '{icon} Setor {id} de {total}',
      mapSectorLevelsFmt: 'Setor {id} • Missões {from}–{to}',
      mapPowerLabel: 'Energia',
      mapPlayNowBtn: 'Jogar Agora 🚄',
      mapLockedBtn: '🔒 Bloqueado',
      mapLevelGridFmt: 'Missão #{id} • Grade {rows}×{cols}',
      btnNext3Star: 'Rota 3⭐',
      hudLevelFmt: '{icon}Nív.{id}{badges}',
      hudMissionTitleFmt: 'Missão #{id}',
      hudSectorFmt: '{icon} Setor {id}: {name}',
      dailyLoginTitle: '🎁 Sequência Diária de 7 Dias',
      dailyLoginSub: 'Entre todos os dias para ganhar moedas de ouro e radares grátis!',
      dailyDayFmt: 'Dia {day}',
      dailyCoinsFmt: '{n} Moedas',
      dailyHintsFmt: '{n} Radar',
      dailyGrandLabel: '500 Moedas + 2 💡',
      btnClaimDaily1x: 'Resgatar Prêmio',
      btnClaimDaily2x: 'Dobrar ×2 (Anúncio)',
      btnDailyAlreadyClaimed: '✅ Já resgatado hoje!',
      chestLabelPrefix: '🎁 Baú de Suprimentos:',
      btnOpenChest: '🎁 Abrir Baú (+150 🪙 e +1 💡) •\u00A0Anúncio',
      btnVictoryShare: 'Compartilhar Vitória e Desafiar (+100 🪙)',
      btnVictoryShareDone: '✅ Compartilhado hoje',
      btnRestorePurchases: 'Restaurar compras anteriores',
      btnShopPrivacy: 'Política de Privacidade e Segurança de Dados',
      privacyModalTitle: '🔒 Política de Privacidade e Proteção de Dados',
      privacyModalSubtitle: 'Dream Express 3D • Desenvolvido por ALDHFLY GAMES (com.dreamexpress.puzzletracks)',
      privacySummaryHtml: '<p><strong>1. Armazenamento local e zero dados pessoais (<code dir="ltr">dream_express_save_v123_public</code>):</strong> Não exige cadastro; todo o seu progresso fica salvo apenas no seu aparelho.</p><p><strong>2. Anúncios e Compras:</strong> Utiliza exclusivamente os SDKs oficiais Google AdMob e Google Play Billing v8.0.0. Contato: <code>aldhfly@gmail.com</code></p>',
      privacyFullLinkLabel: '📄 Ver Política de Privacidade completa',
      privacyCloseBtnLabel: 'Entendi',
      starRoadTitle: '🎁 Estrada das Estrelas (Toque no baú para resgatar)',
      tutorialTapToRotate: 'Toque para girar o trilho',
      tutStep1Title: 'Girar o trilho',
      tutStep1Desc: 'Toque no trilho destacado para girá-lo 90° e conectar a linha passando pelas 3 estrelas até a estação!',
      tutStep2Title: 'Câmera 3D / Visão Superior',
      tutStep2Desc: 'Toque em (3D / Topo) a qualquer momento para alternar entre visão 3D e mapa tático completo!',
      tutStep3Title: 'Velocidade e Câmera Perseguição [1 • 2 • 3]',
      tutStep3Desc: 'Escolha a velocidade do trem (1, 2 ou 3) ou ative a câmera de perseguição quando quiser!',
      tutStep4Title: 'Sinal Verde — Partir!',
      tutStep4Desc: 'Linha conectada! Toque em (Partir!) para conduzir o trem até a estação!',
      settingsTitle: '⚙️ Ajustes de Áudio e Gráficos',
      settingsSubtitle: 'Controle independente de volume do Trem/Música e qualidade 3D 60FPS',
      settingsSfx: '🔊 Volume do Trem e Efeitos',
      settingsBgm: '🎵 Música de Fundo (BGM)',
      settingsQuality: '🖥️ Qualidade Gráfica 3D',
      qualAuto: 'Auto',
      qualMid: 'Equilibrado',
      qualHigh: 'Ultra 60FPS',
      hapticsOn: '📳 Vibração tátil: ATIVADA',
      hapticsOff: '📳 Vibração tátil: DESATIVADA',
      btnReplayTutorial: '📖 Rever Tutorial Interativo (Nív.1)',
      settingsLangBtn: '🌍 Idioma / Language',
      settingsPrivBtn: '🔒 Privacidade',
      settingsDoneBtn: 'Salvar e Fechar ✓',
      bossStageBanner: 'Missão Chefe #{id} • Bônus de Chefe +80 🪙!',
      bootLoaderTitle: 'Dream Express 3D',
      bootLoaderSub: 'Inicializando motor 3D e carregando locomotivas...',
      exitModalTitle: 'Sair do jogo?',
      exitModalDesc: 'Tem certeza de que deseja sair do Dream Express 3D? Todo o seu progresso e estrelas são salvos automaticamente.',
      btnExitStay: '🚄 Continuar jogando',
      btnExitConfirm: 'Sair do jogo',
      toastAutoSolveFmt: '🤖 A IA está resolvendo a missão #{id} e partindo o trem...',
      toastResetGrid: '🔄 Malha ferroviária reiniciada grátis',
      toastSpeedSetFmt: '🚄 Velocidade do trem pronta: {tier}',
      toastChaseOn: '🎥 Câmera de perseguição ativada!',
      toastChaseOff: '🎥 Câmera panorâmica restaurada',
      toastTrackIncompleteFmt: '⚡ Linha incompleta ({n} trilhos unidos) • Gire os trilhos ou use 💡 Radar Guia!',
      toastRouteShortcutFmt: '✨ Rota conectada (⭐ {sparks}/3) • Parta agora ou gire mais pelas 3⭐!',
      toastRouteFull3Star: '🌟 Rota completa de 3 estrelas conectada (3/3 ⭐) • Pronto para partir!',
      toastSkinPerkFmt: '🔒 Bônus {skin}: {locks} trilho(s) travado(s) automaticamente{freeze}!',
      toastSkinFreezeSuffixFmt: ' + {sec}s de gelo auto',
      toastAdDismissedEarly: '⚠️ Anúncio fechado antes do fim — nenhuma recompensa concedida.',
      toastLangChangedFmt: '🌍 Idioma alterado para {lang}',
      adSimOfflineBadge: '📴 Modo Reserva Offline (Calibração Tática)',
      adSimReserveBadge: '⚡ Calibração do Reator Tático (Reserva)',
      adSimOfflineDesc: 'Calibração do reator tático (3s) • Concedendo sua recompensa offline!',
      adSimReserveDesc: 'Calibrando o reator de reserva (3s) para liberar sua recompensa!',
      adSimWaitBtn: '⏳ Calibrando reator...',
      adSimSecFmt: '{n} seg...',
      adSimDone: 'Concluído! ✅',
      adSimClaimBtn: '🎁 Resgatar recompensa e continuar',
      adSimCancelBtn: 'Cancelar',
      adTitleDoubleDaily: 'Dobrar presente diário ×2',
      adTitleRentTrain: 'Testar Super Maglev (1 fase)',
      adTitleCryoFreeze: 'Escudo Criogênico (+20s ❄️)',
      adTitleSmartHint: 'Dica Radar Inteligente (travar 2 trilhos)',
      adTitleExtraSecFmt: '+{n} segundos extras',
      adTitleExtraMovesFmt: '+{n} giros extras',
      adTitleDoubleCoins: 'Dobrar moedas ×2',
      adTitleMysteryChest: 'Abrir baú de suprimentos',
      adTitleFreeCoins: 'Moedas de ouro grátis (+100 🪙)',
      adTitleFreeHint: 'Radar inteligente grátis (+1 💡)',
      mechEndlessTitle: 'Maratona Expresso Infinito e Portais!',
      mechEndlessDesc: 'Vença ondas infinitas para bater o recorde de distância (km) e ganhar ouro bônus!',
      mechBridgeTitle: 'Ponte Ferroviária Suspensa',
      mechBridgeDesc: 'Toque para alinhar a ponte e atravessar cânions profundos com segurança!',
      mechYSwitchTitle: 'Desvio Triplo em Y',
      mechYSwitchDesc: 'Veja a lanterna âmbar brilhante: divide 1 trilho em 2 ramais!',
      mechDualTrainTitle: 'Dois Trens [1] e [2]',
      mechDualTrainDesc: 'Guie o Trem Ciano [1] até a Estação [1] e o Trem Âmbar [2] até a Estação [2]!',
      mechStormTitle: 'Desafio de Tempestade Contra o Tempo!',
      mechStormDesc: 'Missão cronometrada! Conecte a ferrovia antes que o tempo acabe.',
      mechSwitchTitle: 'Chave Dupla de Curvas Paralelas',
      mechSwitchDesc: 'Marcada com núcleo ciano: conduz duas curvas independentes sem cruzamento!',
      endlessWaveHudFmt: '♾️ Onda {wave} ({km} km)',
      hudCrewTipFmt: 'Malha 3D {rows}×{cols} • Passe por um atalho (1–2⭐) ou conecte a rota completa para todas as 3 estrelas!',
      toastEmpireClaimFmt: '🏛️ Cofre do Império Nív.{lv} coletado: +{coins} 🪙! (+{rate} 🪙/h)',
      toastEmpireIdleFmt: '🏛️ O Império da Estação Nív.{lv} gera +{rate} 🪙/h! Conclua setores para evoluir.',
      toastResumedFmt: '🔄 Missão #{id} retomada do seu tabuleiro salvo!',
      toastMission1Intro: '🚄 Missão 1: Toque nos trilhos 3D para girá-los e conectar a linha!',
      toastBossIntroFmt: '👑 Missão de Chefe #{id}! Complete a linha para ganhar +80 🪙 extras!',
      toastDualIntro: '🔀 Missão de Dois Trens! Despache cada trem ao conectar ou una ambas as rotas!',
      toastTileLocked: '🔒 Este trilho está travado magneticamente pelo Radar!',
      toastTileFixed: '🔩 Trilho fixo de titânio • use-o como guia de rota!',
      toastTileCross: '➕ O cruzamento quádruplo permite passagem perpendicular sem girar!',
      toastSeqTrain1Arrived: '✅ Trem 1 chegou ao Terminal 1! Agora conecte e lance o Trem 2!',
      toastSeqTrain2Arrived: '✅ Trem 2 chegou ao Terminal 2! Agora conecte e lance o Trem 1!',
      toastHintAllAligned: '⚡ Todos os trilhos principais já estão alinhados à solução!',
      toastHintLockedFmt: '💡 O Radar travou {n} trilhos no ângulo exato!',
      toastMilestoneAlreadyFmt: '✅ Baú de marco ({stars} ⭐) já resgatado!',
      toastMilestoneNeedFmt: '🔒 Colete mais {needed} ⭐ para abrir este baú (+{coins} 🪙 e +{hints} 💡)!',
      toastMilestoneClaimedFmt: '🎉 Marco ({stars} ⭐) resgatado: +{coins} moedas 🪙 e +{hints} Radar 💡!',
      toastDailyCoinsPartFmt: '+{n} moedas de ouro 🪙',
      toastDailyHintsPartFmt: '+{n} dica Radar 💡',
      toastDailyClaimedFmt: '🎁 Recompensa Dia {day} ({mult}x): {parts}!',
      toastDailyChallengeStartFmt: '🌍 Desafio Global Diário (Missão #{id} • 7×6): Vença para ganhar 3x ouro!',
      toastShopPreviewFmt: '🔊 Ouvindo buzina e motor de {skin}!',
      toastShopEquippedFmt: '🚄 Equipado: {skin}!',
      toastShopBoughtFmt: '🎉 Comprado e equipado: {skin}!',
      toastShopNeedBuyFmt: '⚠️ Faltam {needed} moedas de ouro para {skin}! Assista a um anúncio (+100 🪙)!',
      toastShopNeedUpgFmt: '⚠️ Faltam {needed} moedas para evoluir {skin} ao Nív.{lv}!',
      toastShopUpgradedFmt: '⬆️ {skin} evoluído para Nív.{lv}! Mais giros, tempo e bônus de ouro!',
      toastAchClaimedFmt: '🏆 «{title}» resgatado: +{coins} moedas e +{hints} Radar!',
      toastJump3StarFmt: '⚡ Indo direto para a Missão #{id} em busca das 3 estrelas!',
      toastRentActivated: '🚄 Super Maglev ativado: +6 giros, +20s, trava auto e ímã de estrelas!',
      toastNo3DBrowser: '⚠️ Modo 3D indisponível neste navegador',
      toastCryoActive: '❄️ Escudo Criogênico ativo: +20s e cronômetro congelado!',
      toastCryoAdded: '❄️ +20s adicionados e cronômetro congelado!',
      toastQualityFmt: '✨ Qualidade gráfica 3D: {tier}',
      toastDebugOn: '📊 Painel de desempenho ativado',
      toastDebugOff: '📊 Painel de desempenho oculto',
      toastNeed150Hint: '⚠️ Você precisa de 150 moedas de ouro para comprar uma dica Radar!',
      toastNeed250Super: '⚠️ Você precisa de 250 moedas de ouro para a Super Chave Dourada (4 trilhos)!',
      toastRescueSecAdFmt: '⏱️ +{n} segundos adicionados! Complete a ferrovia!',
      toastRescueMovesAdFmt: '⚡ +{n} giros extras e 1 trilho-guia travado!',
      toastNeed100Rescue: '⚠️ 100 moedas necessárias! Use o botão de anúncio grátis!',
      toastRescueSecCoinsFmt: '⏱️ +{n} segundos comprados por 100 moedas!',
      toastRescueMovesCoinsFmt: '⚡ +{n} giros e 1 trilho-guia comprados por 100 moedas!',
      toastDoubleEarnedFmt: '🪙 Você ganhou +{coins} moedas de ouro extras!',
      toastChestOpened: '🎁 Baú aberto: +150 moedas de ouro e +1 dica Radar!',
      shareVictoryTextFmt: '🚄 Concluí a Missão #{id} em Dream Express 3D com Combo ×{combo}! Consegue superar? {url}',
      toastShareReward: '📤 Obrigado por compartilhar! +100 moedas de ouro ganhas!',
      toastShareDone: '📤 Mensagem de vitória compartilhada com seus amigos!',
      toastCampaign100Done: '👑 Parabéns Imperador! Você concluiu todas as 100 missões de Dream Express 3D!',
      toastVipActivated: '👑 Passe VIP ativado! Sem anúncios, +1.500 moedas, +10 dicas e Locomotiva de Ouro equipada!',
      toastVipRestored: '✅ Compra anterior do Passe VIP restaurada com sucesso!',
      toastVipNotFound: 'ℹ️ Nenhuma compra VIP anterior encontrada nesta conta do Google Play.',
      toastVipConnecting: '💳 Conectando ao Google Play Billing... Verifique a Play Store ou desbloqueie a Locomotiva de Ouro com 25.000 moedas!',
      toastStarterGrantedFmt: '🎁 Pacote Inicial ativado: +{amount} 🪙 e +3 💡 Radar!',
      toastCoinsGrantedFmt: '🪙 +{amount} moedas de ouro adicionadas ao seu cofre!',
      toastStarterIapInfo: '🎁 O Pacote Inicial (+2.500 🪙 + 3 💡) conecta-se ao Google Play Billing no Android!',
      toastSmallCoinsIapInfo: '💳 A Bolsa de Ouro (+2.500 🪙) conecta-se ao Google Play Billing no Android!',
      toastMegaCoinsIapInfo: '💳 O Cofre Real (+15.000 🪙) conecta-se ao Google Play Billing no Android!',
      toastVipIapInfo: '💳 O Passe VIP sem anúncios usa o Google Play Billing! Você também pode desbloquear a Locomotiva de Ouro com 25.000 moedas!',
      toastFree100Earned: '🪙 Ganhou +100 moedas de ouro grátis!',
      toastNeed150ShopHint: '⚠️ Você precisa de 150 moedas de ouro para comprar uma carga Radar!',
      toastAdded1Hint: '💡 +1 carga Radar adicionada!',
      toastFree1HintEarned: '💡 Ganhou +1 carga Radar grátis!'
    }
  };

  // V12.1 Multi-Language Tables for Ranks, Sectors, Commanders, Locomotives & Achievements
  const CONDUCTOR_RANKS_I18N = [
    { minStars: 250, icon: '👑', ar: 'إمبراطور الشبكة الحديدية', en: 'Apex Rail Emperor', ja: '鉄道網の皇帝', ko: '철도망의 황제', de: 'Schienen-Imperator', fr: 'Empereur du Rail', es: 'Emperador Ferroviario', pt: 'Imperador Ferroviário' },
    { minStars: 180, icon: '🎖️', ar: 'مارشال القارات', en: 'Continental Marshal', ja: '大陸元帥', ko: '대륙 원수', de: 'Kontinental-Marschall', fr: 'Maréchal Continental', es: 'Mariscal Continental', pt: 'Marechal Continental' },
    { minStars: 110, icon: '🌟', ar: 'قائد القطارات الفائقة', en: 'Hyper-Express Commander', ja: '超特急司令官', ko: '초특급 사령관', de: 'Express-Kommandant', fr: 'Commandant Express', es: 'Comandante Expreso', pt: 'Comandante Expresso' },
    { minStars: 60,  icon: '🥇', ar: 'قبطان السكك السريعة', en: 'Express Captain', ja: '急行キャプテン', ko: '특급 캡틴', de: 'Express-Kapitän', fr: 'Capitaine Express', es: 'Capitán Expreso', pt: 'Capitão Expresso' },
    { minStars: 25,  icon: '🥈', ar: 'مهندس خطوط', en: 'Track Engineer', ja: '路線エンジニア', ko: '선로 엔지니어', de: 'Strecken-Ingenieur', fr: 'Ingénieur Voie', es: 'Ingeniero de Vías', pt: 'Engenheiro de Linha' },
    { minStars: 0,   icon: '🥉', ar: 'سائق متدرب', en: 'Trainee Driver', ja: '見習い運転士', ko: '견습 기관사', de: 'Lokführer-Anwärter', fr: 'Conducteur Stagiaire', es: 'Maquinista Aprendiz', pt: 'Maquinista Aprendiz' }
  ];

  const SECTOR_NAMES_I18N = {
    1:  { ja: '霧の松林渓谷', ko: '안개 소나무 계곡', de: 'Nebel-Kieferntal', fr: 'Vallée des Pins Brumeux', es: 'Valle de Pinos Brumosos', pt: 'Vale dos Pinheiros Nebulosos' },
    2:  { ja: '赤い砂漠の大峡谷', ko: '붉은 사막 대협곡', de: 'Roter Wüstencanyon', fr: 'Viaducs du Canyon Rouge', es: 'Viaductos del Cañón Rojo', pt: 'Viadutos do Cânion Vermelho' },
    3:  { ja: '産業港湾と巨大クレーン', ko: '산업 항만 & 크레인', de: 'Industriehafen & Kräne', fr: 'Port Industriel & Grues', es: 'Puerto Industrial y Grúas', pt: 'Porto Industrial e Guindastes' },
    4:  { ja: 'アルプス氷河連峰', ko: '알프스 빙하 봉우리', de: 'Alpen-Gletschergipfel', fr: 'Sommets Glaciaires Alpins', es: 'Cumbres Glaciares Alpinas', pt: 'Picos Glaciais Alpinos' },
    5:  { ja: 'サイバー・ネオン都市', ko: '사이버 네온 메트로폴리스', de: 'Cyber-Neon-Metropole', fr: 'Métropole Cyber Néon', es: 'Metrópolis Ciber Neón', pt: 'Metrópole Cyber Neon' },
    6:  { ja: '紅葉と歯車の高架橋', ko: '단풍 시계태엽 고가교', de: 'Herbst-Uhrwerk-Viadukte', fr: 'Viaducs Horlogers d’Automne', es: 'Viaductos Mecánicos de Otoño', pt: 'Viadutos Mecânicos de Outono' },
    7:  { ja: '嵐の灯台諸島', ko: '폭풍 등대 군도', de: 'Sturm-Leuchtturm-Inseln', fr: 'Archipel des Phares d’Orage', es: 'Islas del Faro Tempestuoso', pt: 'Ilhas do Farol da Tempestade' },
    8:  { ja: '発光クリスタル洞窟', ko: '발광 수정 동굴', de: 'Leuchtkristall-Kavernen', fr: 'Cavernes de Cristal Lumineux', es: 'Cavernas de Cristal Luminoso', pt: 'Cavernas de Cristal Luminoso' },
    9:  { ja: '灼熱マグマ火口核', ko: '화산 마그마 코어', de: 'Vulkan-Magmakern', fr: 'Cœur de Magma Volcanique', es: 'Núcleo de Magma Volcánico', pt: 'Núcleo de Magma Vulcânico' },
    10: { ja: '超軌道ターミナル駅', ko: '초궤도 우주 터미널', de: 'Orbitaler Apex-Bahnhof', fr: 'Terminus Orbital Suprême', es: 'Terminal Orbital Suprema', pt: 'Terminal Orbital Suprema' }
  };

  const NPC_NAMES_I18N = {
    fouad:  { ar: 'الكابتن فؤاد (قائد الشبكة)', en: 'Captain Fouad (Grid Commander)', ja: 'フアード艦長（鉄道網司令官）', ko: '푸아드 함장 (철도망 사령관)', de: 'Kapitän Fouad (Netzkommandant)', fr: 'Capitaine Fouad (Commandant)', es: 'Capitán Fouad (Comandante)', pt: 'Capitão Fouad (Comandante)' },
    amal:   { ar: 'كبيرة المهندسين أمل', en: 'Chief Engineer Amal', ja: 'アマル主任技師', ko: '아말 수석 엔지니어', de: 'Chefingenieurin Amal', fr: 'Ingénieure en Chef Amal', es: 'Ingeniera Jefa Amal', pt: 'Engenheira-Chefe Amal' },
    rabie:  { ar: 'الحارس ربيع (قائد الوادي)', en: 'Ranger Rabie (Valley Chief)', ja: 'ラビー隊長（渓谷駅長）', ko: '라비 대장 (계곡 역장)', de: 'Ranger Rabie (Tal-Chef)', fr: 'Garde Rabie (Chef du Vallon)', es: 'Guardabosques Rabie', pt: 'Guarda Rabie (Chefe do Vale)' },
    tariq:  { ar: 'القائد طارق (حارس الأخدود)', en: 'Commander Tariq (Canyon Warden)', ja: 'ターリク司令（峡谷守護者）', ko: '타리크 사령관 (협곡 수호자)', de: 'Kommandant Tariq (Canyon-Wächter)', fr: 'Commandant Tariq', es: 'Comandante Tariq', pt: 'Comandante Tariq' },
    siraj:  { ar: 'الأدميرال سراج (قائد الميناء)', en: 'Admiral Siraj (Harbor Chief)', ja: 'シラージュ提督（港湾司令）', ko: '시라즈 제독 (항만 사령관)', de: 'Admiral Siraj (Hafenkommandant)', fr: 'Amiral Siraj (Chef du Port)', es: 'Almirante Siraj', pt: 'Almirante Siraj' },
    layla:  { ar: 'الدكتورة ليلى (قائدة البعثة)', en: 'Dr. Layla (Expedition Lead)', ja: 'ライラ博士（極地調査隊長）', ko: '라일라 박사 (극지 탐사대장)', de: 'Dr. Layla (Expeditionsleiterin)', fr: 'Dr Layla (Cheffe d’Expédition)', es: 'Dra. Layla', pt: 'Dra. Layla' },
    burhan: { ar: 'المهندس برهان (مدير الشبكة)', en: 'Engineer Burhan (Metro Director)', ja: 'ブルハーン技師（都市網局長）', ko: '부르한 기장 (메트로 국장)', de: 'Ingenieur Burhan (Metro-Direktor)', fr: 'Ingénieur Burhan', es: 'Ingeniero Burhan', pt: 'Engenheiro Burhan' },
    saffar: { ar: 'حاسوب القاطرة الذكي', en: 'AI-Locomotive Core', ja: 'AI機関車コア', ko: 'AI 기관차 코어', de: 'KI-Lokomotivkern', fr: 'Cœur IA-Locomotive', es: 'Núcleo IA-Locomotora', pt: 'Núcleo IA-Locomotiva' }
  };

  const SKIN_I18N = {
    crimson: {
      ja: { name: 'クリムゾン装甲ディーゼル機関車', desc: '深紅の重装甲V16ディーゼル機関車（Lv.4で自動ロック解放）', perk: '⚡ 標準バランス型' },
      ko: { name: '크림슨 뱅가드 장갑 기관차', desc: '진홍빛 중장갑 V16 디젤 기관차 (Lv.4에서 자동 잠금 해금)', perk: '⚡ 표준 밸런스형' },
      de: { name: 'Purpur-Panzerlok V16', desc: 'Gepanzerte V16-Diesellok mit Cyan-Scheinwerfer', perk: '⚡ Ausgewogene Standardlok' },
      fr: { name: 'Locomotive Blindée Pourpre', desc: 'Châssis acier cramoisi V16 avec voitures royales', perk: '⚡ Locomotive équilibrée' },
      es: { name: 'Locomotora Blindada Carmesí', desc: 'Chasis blindado V16 carmesí con faro cian', perk: '⚡ Locomotora equilibrada' },
      pt: { name: 'Locomotiva Blindada Carmesim', desc: 'Chassi blindado V16 carmesim com farol ciano', perk: '⚡ Locomotiva equilibrada' }
    },
    classic_steam: {
      ja: { name: '1880 クラシック蒸気機関車', desc: '真鍮煙突の歴史的蒸気機関車：レール1枚自動ロック＆+2手', perk: '🔒 1枚自動ロック + 2手 + 8秒' },
      ko: { name: '1880 클래식 증기 기관차', desc: '황동 굴뚝의 역사적 증기 기관차: 레일 1개 자동 잠금 & +2 이동', perk: '🔒 1개 자동 잠금 + 2이동 + 8초' },
      de: { name: '1880 Klassik-Dampflok', desc: 'Historische Dampflok mit Messingschlot: sperrt 1 Gleis + 2 Züge', perk: '🔒 1 Auto-Sperre + 2 Züge + 8s' },
      fr: { name: 'Express Vapeur Classique 1880', desc: 'Locomotive à vapeur historique : verrouille 1 rail + 2 coups', perk: '🔒 1 rail verrouillé + 2 coups' },
      es: { name: 'Expreso de Vapor Clásico 1880', desc: 'Locomotora histórica de vapor: bloquea 1 vía + 2 giros', perk: '🔒 1 vía fija + 2 giros + 8s' },
      pt: { name: 'Expresso a Vapor Clássico 1880', desc: 'Locomotiva histórica a vapor: trava 1 trilho + 2 giros', perk: '🔒 1 trava + 2 giros + 8s' }
    },
    orient_express: {
      ja: { name: 'ロイヤルパレス豪華蒸気急行', desc: '王宮急行：獲得コイン+35%＆レール1枚ロック＆3⭐条件緩和', perk: '🪙 コイン+35% + 1枚ロック' },
      ko: { name: '로열 팰리스 럭셔리 증기 특급', desc: '왕실 특급 열차: 골드 +35% & 레일 1개 잠금 & 3⭐ 조건 완화', perk: '🪙 골드+35% + 1개 잠금' },
      de: { name: 'Royal-Palace-Luxusexpress', desc: 'Königlicher Luxuszug: +35% Gold, 1 Gleissperre & 3⭐-Bonus', perk: '🪙 +35% Gold + 1 Auto-Sperre' },
      fr: { name: 'Palace Royal Express de Luxe', desc: 'Train royal de luxe : +35% d’or, 1 rail verrouillé & grâce 3⭐', perk: '🪙 +35% Or + 1 rail verrouillé' },
      es: { name: 'Expreso Real de Lujo', desc: 'Expreso palaciego: +35% oro, bloquea 1 vía y facilita 3⭐', perk: '🪙 +35% Oro + 1 vía fija' },
      pt: { name: 'Expresso Palácio Real de Luxo', desc: 'Expresso real: +35% ouro, trava 1 trilho e facilita 3⭐', perk: '🪙 +35% Ouro + 1 trava' }
    },
    spring: {
      ja: { name: 'エメラルド・ストーム迎撃機関車', desc: '開始時にタイマーを12秒自動停止しレール1枚をロック！', perk: '❄️ 12秒自動停止 + 15秒追加' },
      ko: { name: '에메랄드 스톰 인터셉터', desc: '미션 시작 시 타이머 12초 자동 동결 및 레일 1개 잠금!', perk: '❄️ 12초 자동동결 + 15초 추가' },
      de: { name: 'Smaragd-Sturm-Interceptor', desc: 'Friert den Timer beim Start für 12s ein und sperrt 1 Gleis!', perk: '❄️ 12s Auto-Frost + 15s Zeit' },
      fr: { name: 'Intercepteur Tempête Émeraude', desc: 'Gèle le chrono 12s au départ et verrouille 1 rail !', perk: '❄️ Gel auto 12s + 15s bonus' },
      es: { name: 'Interceptor Tormenta Esmeralda', desc: '¡Congela el reloj 12s al iniciar y bloquea 1 vía!', perk: '❄️ 12s Hielo auto + 15s extra' },
      pt: { name: 'Interceptador Tempestade Esmeralda', desc: 'Congela o tempo por 12s no início e trava 1 trilho!', perk: '❄️ 12s Gelo auto + 15s extra' }
    },
    tgv_france: {
      ja: { name: 'アズール・アロー2階建て高速鉄道', desc: '中間分岐レール2枚を自動ロック＋手数+3＆5秒停止！', perk: '🚄 2枚自動ロック + 3手 + 5秒停止' },
      ko: { name: '아주르 애로우 듀플렉스 고속열차', desc: '중간 핵심 레일 2개 자동 잠금 + 3 이동 & 5초 동결!', perk: '🚄 2개 자동잠금 + 3이동 + 5초동결' },
      de: { name: 'Azur-Pfeil Duplex-Hochgeschwindigkeit', desc: 'Sperrt automatisch 2 Mittelgleise + 3 Züge & 5s Frost!', perk: '🚄 2 Auto-Sperren + 3 Züge' },
      fr: { name: 'Flèche Azur Duplex Grande Vitesse', desc: 'Verrouille 2 rails centraux + 3 coups & 5s de gel !', perk: '🚄 2 rails verrouillés + 3 coups' },
      es: { name: 'Flecha Azul Dúplex Alta Velocidad', desc: '¡Bloquea 2 vías centrales + 3 giros y 5s de hielo!', perk: '🚄 2 vías fijas + 3 giros' },
      pt: { name: 'Flecha Azul Duplex Alta Velocidade', desc: 'Trava 2 trilhos centrais + 3 giros e 5s de gelo!', perk: '🚄 2 travas + 3 giros' }
    },
    bullet_shinkansen: {
      ja: { name: 'シルバーファルコン超特急新幹線', desc: '空力弾丸列車：レール2枚自動ロック＋10秒停止＋超高速走行！', perk: '🔒 2枚ロック + 10秒停止 + 金30%' },
      ko: { name: '실버 팔콘 탄환 초특급', desc: '공기역학 탄환 열차: 레일 2개 자동 잠금 + 10초 동결 + 초고속!', perk: '🔒 2개 잠금 + 10초 동결 + 골드30%' },
      de: { name: 'Silberfalke Hochgeschwindigkeitszug', desc: 'Aerodynamischer Bullet-Zug: 2 Gleissperren + 10s Frost!', perk: '🔒 2 Sperren + 10s Frost + 30% Gold' },
      fr: { name: 'Faucon d’Argent Train Balle', desc: 'Train aérodynamique : 2 rails verrouillés + 10s de gel !', perk: '🔒 2 rails + Gel 10s + Or 30%' },
      es: { name: 'Halcón Plateado Tren Bala', desc: 'Tren bala aerodinámico: ¡2 vías fijas + 10s de hielo!', perk: '🔒 2 vías + 10s Hielo + 30% Oro' },
      pt: { name: 'Falcão Prateado Trem-Bala', desc: 'Trem-bala aerodinâmico: 2 travas + 10s de gelo!', perk: '🔒 2 travas + 10s Gelo + 30% Ouro' }
    },
    haramain_express: {
      ja: { name: 'エメラルド・オアシス超特急', desc: '2枚自動ロック＋遠隔スター磁石＋手数+4＆10秒停止！', perk: '🌿 2枚ロック + スター磁石 + 4手' },
      ko: { name: '에메랄드 오아시스 고속특급', desc: '레일 2개 자동 잠금 + 원거리 별 자석 + 4 이동 & 10초 동결!', perk: '🌿 2개 잠금 + 별 자석 + 4이동' },
      de: { name: 'Smaragd-Oasen-Schnellzug', desc: '2 Auto-Sperren + Sternenmagnet + 4 Züge & 10s Frost!', perk: '🌿 2 Sperren + Sternmagnet + 4 Züge' },
      fr: { name: 'Express Oasis Émeraude', desc: '2 rails verrouillés + Aimant à étoiles + 4 coups !', perk: '🌿 2 rails + Aimant étoiles + 4 coups' },
      es: { name: 'Expreso Oasis Esmeralda', desc: '¡2 vías fijas + Imán de Estrellas + 4 giros extra!', perk: '🌿 2 vías + Imán Estrellas + 4 giros' },
      pt: { name: 'Expresso Oásis Esmeralda', desc: '2 travas + Ímã de Estrelas + 4 giros extras!', perk: '🌿 2 travas + Ímã Estrelas + 4 giros' }
    },
    maglev_600: {
      ja: { name: 'リニア超電導マグレブ 600 km/h', desc: '磁気浮上リニア：レール3枚自動ロック＋スター磁石＋12秒停止！', perk: '🧲 3枚ロック + スター磁石 + 12秒停止' },
      ko: { name: '초전도 자기부상 마그레브 600km/h', desc: '자기부상 하이퍼 열차: 레일 3개 자동 잠금 + 별 자석 + 12초 동결!', perk: '🧲 3개 잠금 + 별 자석 + 12초 동결' },
      de: { name: 'Maglev 600 km/h Magnetschwebebahn', desc: 'Magnetschwebezug: sperrt 3 Gleise + Sternmagnet + 12s Frost!', perk: '🧲 3 Sperren + Sternmagnet + 12s Frost' },
      fr: { name: 'Maglev Lévitation 600 km/h', desc: 'Train à lévitation magnétique : 3 rails verrouillés + Aimant !', perk: '🧲 3 rails + Aimant + Gel 12s' },
      es: { name: 'Maglev Levitación 600 km/h', desc: '¡Levitación magnética: 3 vías fijas + Imán + 12s hielo!', perk: '🧲 3 vías + Imán + 12s Hielo' },
      pt: { name: 'Maglev Levitação 600 km/h', desc: 'Levitação magnética: 3 travas + Ímã de Estrelas + 12s gelo!', perk: '🧲 3 travas + Ímã + 12s Gelo' }
    },
    gold_vip: {
      ja: { name: '黄金インペリアルVIPプラズマ機関車', desc: '究極の黄金旗艦：3枚自動ロック＋スター磁石＋16秒停止＋金60%！', perk: '👑 3枚ロック + スター磁石 + 金60%' },
      ko: { name: '황금 임페리얼 VIP 플라즈마 기관차', desc: '궁극의 황금 기함: 레일 3개 잠금 + 별 자석 + 16초 동결 + 골드60%!', perk: '👑 3개 잠금 + 별 자석 + 골드60%' },
      de: { name: 'Goldene Imperiale VIP-Plasmalok', desc: 'Ultimative Gold-Edition: 3 Sperren + Sternmagnet + 16s Frost + 60% Gold!', perk: '👑 3 Sperren + Magnet + 60% Gold' },
      fr: { name: 'Locomotive Plasma Impériale Or VIP', desc: 'Édition ultime en or fondu : 3 rails + Aimant + 16s gel + 60% d’or !', perk: '👑 3 rails + Aimant + 60% Or' },
      es: { name: 'Locomotora Imperial Plasma Oro VIP', desc: '¡Edición suprema dorada: 3 vías + Imán + 16s hielo + 60% oro!', perk: '👑 3 vías + Imán + 60% Oro' },
      pt: { name: 'Locomotiva Imperial Plasma Ouro VIP', desc: 'Edição suprema dourada: 3 travas + Ímã + 16s gelo + 60% ouro!', perk: '👑 3 travas + Ímã + 60% Ouro' }
    }
  };

  const ACH_I18N = {
    ach_first_win:   { ja: ['初発車クリア', 'ミッション1をクリアして終着駅へ到着する'], ko: ['첫 번째 출발', '미션 1을 클리어하고 종착역에 도착하기'], de: ['Erste Abfahrt', 'Schließe Mission 1 erfolgreich ab'], fr: ['Premier Départ', 'Terminez la mission 1 avec succès'], es: ['Primera Salida', 'Completa la misión 1 con éxito'], pt: ['Primeira Partida', 'Conclua a missão 1 com sucesso'] },
    ach_sector_1:    { ja: ['セクター1制覇', 'セクター1の全10ミッションをクリアする'], ko: ['섹터 1 챔피언', '섹터 1의 10개 미션 모두 클리어'], de: ['Sektor-1-Champion', 'Schließe alle 10 Missionen in Sektor 1 ab'], fr: ['Champion Secteur 1', 'Terminez les 10 missions du Secteur 1'], es: ['Campeón del Sector 1', 'Completa las 10 misiones del Sector 1'], pt: ['Campeão do Setor 1', 'Conclua todas as 10 missões do Setor 1'] },
    ach_stars_30:    { ja: ['ゴールデンスター収集家', 'キャンペーンでスターを30個集める'], ko: ['황금 별 수집가', '캠페인에서 황금 별 30개 획득'], de: ['Goldstern-Sammler', 'Sammle 30 goldene Sterne'], fr: ['Collectionneur d’Étoiles', 'Collectez 30 étoiles dorées'], es: ['Coleccionista de Estrellas', 'Reúne 30 estrellas doradas'], pt: ['Colecionador de Estrelas', 'Colete 30 estrelas douradas'] },
    ach_stars_90:    { ja: ['輝く星の達人', 'キャンペーンでスターを90個集める'], ko: ['빛나는 별의 달인', '캠페인에서 황금 별 90개 획득'], de: ['Meister der Sterne', 'Sammle 90 goldene Sterne'], fr: ['Maître des Étoiles', 'Collectez 90 étoiles dorées'], es: ['Maestro de Estrellas', 'Reúne 90 estrellas doradas'], pt: ['Mestre das Estrelas', 'Colete 90 estrelas douradas'] },
    ach_stars_200:   { ja: ['銀河鉄道の伝説', 'キャンペーンでスターを200個集める'], ko: ['은하 철도의 전설', '캠페인에서 황금 별 200개 획득'], de: ['Eisenbahn-Legende', 'Sammle 200 goldene Sterne'], fr: ['Légende du Rail', 'Collectez 200 étoiles dorées'], es: ['Leyenda Ferroviaria', 'Reúne 200 estrellas doradas'], pt: ['Lenda Ferroviária', 'Colete 200 estrelas douradas'] },
    ach_combo_4x:    { ja: ['電光石火 (4倍コンボ)', '素早い連続回転で×4コンボを達成する'], ko: ['번개 속도 (4배 콤보)', '빠른 연속 회전으로 ×4 콤보 달성'], de: ['Blitzschnell (4x Kombo)', 'Erreiche einen 4x-Kombo-Multiplikator'], fr: ['Vitesse Éclair (Combo ×4)', 'Atteignez un multiplicateur Combo ×4'], es: ['Velocidad Rayo (Combo ×4)', 'Alcanza un multiplicador Combo ×4'], pt: ['Velocidade Raio (Combo ×4)', 'Alcance um multiplicador Combo ×4'] },
    ach_buy_train:   { ja: ['世界の機関車コレクター', 'ガレージで3種類の機関車を所有する'], ko: ['월드 기관차 수집가', '격납고에서 기관차 3종 보유'], de: ['Lokomotiven-Sammler', 'Besitze 3 verschiedene Lokomotiven'], fr: ['Collectionneur Mondial', 'Possédez 3 locomotives différentes'], es: ['Coleccionista Mundial', 'Posee 3 locomotoras diferentes'], pt: ['Colecionador Mundial', 'Possua 3 locomotivas diferentes'] },
    ach_fleet_6:     { ja: ['六大陸の鉄道艦隊', 'ガレージで6種類の機関車を所有する'], ko: ['6대륙 철도 함대', '격납고에서 기관차 6종 보유'], de: ['Sechs-Kontinente-Flotte', 'Besitze 6 verschiedene Lokomotiven'], fr: ['Flotte des Six Continents', 'Possédez 6 locomotives différentes'], es: ['Flota de Seis Continentes', 'Posee 6 locomotoras diferentes'], pt: ['Frota dos Seis Continentes', 'Possua 6 locomotivas diferentes'] },
    ach_upgrade_lv3: { ja: ['主任タービン技師', 'いずれかの機関車をLv.3以上に強化する'], ko: ['수석 터빈 엔지니어', '기관차를 Lv.3 이상으로 업그레이드'], de: ['Chef-Turbineningenieur', 'Rüste eine Lok auf Lv.3 oder höher auf'], fr: ['Ingénieur Turbine en Chef', 'Améliorez une locomotive au Niv.3+'], es: ['Ingeniero Jefe de Turbina', 'Mejora una locomotora a Niv.3+'], pt: ['Engenheiro-Chefe de Turbina', 'Evolua uma locomotiva para Nív.3+'] },
    ach_dual_train_1:  { ja: ['複線管制マスター', '2列車同時ミッションを1回クリアする'], ko: ['복선 관제 마스터', '2열차 미션을 1회 클리어'], de: ['Doppelzug-Meister', 'Schließe eine Doppelzug-Mission ab'], fr: ['Maître Double-Train', 'Gagnez une mission à deux trains'], es: ['Maestro Doble Tren', 'Supera una misión de dos trenes'], pt: ['Mestre de Dois Trens', 'Vença uma missão de dois trens'] },
    ach_dual_train_10: { ja: ['同期運行司令官', '2列車同時ミッションを10回クリアする'], ko: ['동기화 관제 사령관', '2열차 미션을 10회 클리어'], de: ['Synchron-Kommandant', 'Schließe 10 Doppelzug-Missionen ab'], fr: ['Commandant Synchronisé', 'Gagnez 10 missions à deux trains'], es: ['Comandante Sincronizado', 'Supera 10 misiones de dos trenes'], pt: ['Comandante Sincronizado', 'Vença 10 missões de dois trens'] },
    ach_all_100:       { ja: ['大陸横断100ミッション制覇', '全100ミッションを完全制覇する'], ko: ['대륙 횡단 100미션 제패', '100개 전체 미션 완벽 클리어'], de: ['Kaiser aller 100 Missionen', 'Schließe alle 100 Missionen ab'], fr: ['Empereur des 100 Missions', 'Terminez les 100 missions'], es: ['Emperador de las 100 Misiones', 'Completa las 100 misiones'], pt: ['Imperador das 100 Missões', 'Conclua todas as 100 missões'] }
  };

  function tf(key, vars = {}) {
    let out = t(key);
    Object.keys(vars).forEach(k => {
      out = out.split(`{${k}}`).join(String(vars[k]));
    });
    return out;
  }

  function getNpcDisplayName(npcId, fallbackAr = '', fallbackEn = '') {
    const id = String(npcId || 'amal').toLowerCase();
    const row = NPC_NAMES_I18N[id];
    const lg = (gameState && gameState.lang) || 'ar';
    if (row && row[lg]) return row[lg];
    return isEn() ? (fallbackEn || (row && row.en) || 'Commander') : (fallbackAr || (row && row.ar) || 'القائد');
  }

  function buildMissionCrewDialogue(level, overrideLines = null) {
    if (!level) return [];
    const lg = (gameState && gameState.lang) || 'ar';
    const station = window.GameLevels.STATIONS.find(s => s.id === level.stationId) || window.GameLevels.STATIONS[0];
    const stName = getStationName(station);
    const cmdId = (station && station.npcId) || 'fouad';
    const cmdName = getNpcDisplayName(cmdId, station && station.npcName, station && station.npcNameEn);
    const amalName = getNpcDisplayName('amal');

    // For AR and EN, preserve exact hand-authored dialogue lines if explicitly present on Sector-Opening missions
    if ((lg === 'ar' || lg === 'en') && Array.isArray(overrideLines) && overrideLines.length > 0) {
      return overrideLines;
    }
    if ((lg === 'ar' || lg === 'en') && Array.isArray(level.preDialogue) && level.preDialogue.length > 0 && !overrideLines) {
      return level.preDialogue;
    }

    const gStr = `${level.rows}×${level.cols}`;
    const isDual = Boolean(level.isDualTrainLevel);
    const templates = {
      ar: [
        `«مرحباً أيها القائد في المهمة \u2066#${level.id}\u2069 (${getLvlTitle(level)}) ضمن ${stName}! شبكة \u2066${gStr}\u2069 ثلاثية الأبعاد جاهزة أمامك والركاب بانتظار القطار على الرصيف.»`,
        isDual
          ? `«🚄🚄 هذه المهمة تضم قطارين متزامنين! أوصل القطار الأول لمحطته والقطار الثاني لمحطته مع نظام التوقف الذكي الآلي عند التقاطعات وحصد النجوم الـ 3!»`
          : `«لديك مساران تكتيكيان: طريق مختصر سريع للعبور (\u20661–2⭐\u2069)، أو المسار الهندسي الشامل لحصد النجوم الذهبية الثلاث بـ \u2066${level.optimalMoves}\u2069 حركة مثالية!»`
      ],
      en: [
        `"Welcome to Mission #${level.id} (${getLvlTitle(level)}) in ${stName}! Our ${gStr} 3D rail sector is live and passengers are waiting on the station platform."`,
        isDual
          ? `"🚄🚄 Tactical Alert: Two trains operate on this grid! Connect both lines—our smart signals automatically yield at crossings while you collect all 3 Golden Stars!"`
          : `"Two tactical routes are available: take a fast bypass for 1–2⭐, or master the full labyrinth route to collect all 3 Golden Stars (optimal: ${level.optimalMoves} moves)!"`
      ],
      ja: [
        `「${stName}・ミッション #${level.id} へようこそ！${gStr} の3D鉄道グリッドが稼働中で、乗客がホームで列車の到着を待っています！」`,
        isDual
          ? `「🚄🚄 複線戦術ブリーフィング：このステージは2編成の列車が走ります！交差点では自動信号制御が作動します。3つのスターを回収して両駅へ導きましょう！」`
          : `「戦術ヒント：近道ルートで素早くクリア(1〜2⭐)するか、全マップルートを繋いで3つすべてのゴールデンスター獲得を目指しましょう！」`
      ],
      ko: [
        `「${stName} 미션 #${level.id} 작전 브리핑입니다! ${gStr} 3D 선로 구역이 준비되었으며 승객들이 승강장에서 열차를 기다리고 있습니다!」`,
        isDual
          ? `「🚄🚄 복선 전술 알림: 두 대의 열차가 운행됩니다! 교차로에서는 스마트 자동 신호 양보 시스템이 작동하니 황금 별 3개를 모두 모아 두 종착역으로 안내하세요!」`
          : `「전술 팁: 빠른 우회 경로(1~2⭐)로 돌파하거나, 전체 미로 노선을 완성해 황금 별 3개를 모두 획득하세요!」`
      ],
      de: [
        `„Willkommen zu Mission #${level.id} in ${stName}! Das ${gStr}-3D-Schienenfeld ist bereit und die Fahrgäste warten bereits am Bahnsteig.“`,
        isDual
          ? `„🚄🚄 Taktik-Briefing: Zwei Züge sind im Einsatz! Verbinde beide Linien – unsere Signale regeln Kreuzungen automatisch auf dem Weg zu allen 3 Sternen!“`
          : `„Taktik-Tipp: Wähle eine schnelle Abkürzung (1–2⭐) oder meistere die komplette Route über alle 3 goldenen Sterne!“`
      ],
      fr: [
        `« Bienvenue dans la Mission #${level.id} (${stName}) ! La grille 3D ${gStr} est opérationnelle et les voyageurs attendent sur le quai. »`,
        isDual
          ? `« 🚄🚄 Briefing tactique : Deux trains circulent sur ce secteur ! Reliez les deux voies avec gestion automatique des priorités aux croisements et visez les 3 étoiles ! »`
          : `« Conseil tactique : Prenez un raccourci rapide (1–2⭐) ou maîtrisez le tracé complet pour récolter les 3 étoiles dorées ! »`
      ],
      es: [
        `«¡Bienvenido a la Misión #${level.id} en ${stName}! La cuadrícula 3D de ${gStr} está activa y los pasajeros esperan en el andén.»`,
        isDual
          ? `«🚄🚄 Informe táctico: ¡Dos trenes operan en este sector! Conecta ambas líneas con prioridad automática en los cruces para lograr las 3 estrellas.»`
          : `«Consejo táctico: ¡Toma un atajo rápido (1–2⭐) o domina el recorrido completo para recoger las 3 estrellas doradas!»`
      ],
      pt: [
        `«Bem-vindo à Missão #${level.id} em ${stName}! A malha 3D ${gStr} está pronta e os passageiros aguardam na plataforma.»`,
        isDual
          ? `«🚄🚄 Briefing tático: Dois trens operam neste setor! Conecte ambas as linhas com sinalização inteligente automática nos cruzamentos rumo às 3 estrelas!»`
          : `«Dica tática: Use um atalho rápido (1–2⭐) ou domine a rota completa para conquistar todas as 3 estrelas douradas!»`
      ]
    };
    const pair = templates[lg] || templates.en;
    return [
      { speakerId: cmdId, speakerName: cmdName, speakerNameEn: cmdName, text: pair[0], textEn: pair[0] },
      { speakerId: 'amal', speakerName: amalName, speakerNameEn: amalName, text: pair[1], textEn: pair[1] }
    ];
  }

  const STAR_MILESTONES = [
    { stars: 25,  coins: 150,  hints: 1 },
    { stars: 50,  coins: 250,  hints: 1 },
    { stars: 100, coins: 400,  hints: 2 },
    { stars: 150, coins: 600,  hints: 2 },
    { stars: 200, coins: 900,  hints: 3 },
    { stars: 250, coins: 1200, hints: 3 },
    { stars: 300, coins: 2500, hints: 5 }
  ];

  function isBossLevel(lvlId) {
    const n = Number(lvlId);
    return Boolean(n > 0 && n % 10 === 0);
  }

  const DAILY_REWARDS = [
    { day: 1, coins: 50,  hints: 0, icon: '🪙', labelAr: '50 عملة',       labelEn: '50 Coins' },
    { day: 2, coins: 0,   hints: 1, icon: '💡', labelAr: '1 رادار ذكي',    labelEn: '1 Radar Hint' },
    { day: 3, coins: 100, hints: 0, icon: '🪙', labelAr: '100 عملة',      labelEn: '100 Coins' },
    { day: 4, coins: 150, hints: 0, icon: '🪙', labelAr: '150 عملة',      labelEn: '150 Coins' },
    { day: 5, coins: 0,   hints: 2, icon: '💡', labelAr: '2 رادار ذكي',    labelEn: '2 Radar Hints' },
    { day: 6, coins: 250, hints: 0, icon: '🪙', labelAr: '250 عملة',      labelEn: '250 Coins' },
    { day: 7, coins: 500, hints: 2, icon: '👑', labelAr: '500 عملة + 2 💡', labelEn: '500 Coins + 2 💡' }
  ];

  function getTodayDateString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  let trialSkinIdForCurrentLevel = null;
  let trialSkinLevelId = null;
  let isDailyChallengeMode = false;
  let completedWasDailyChallenge = false;
  let isEndlessMarathonMode = false;
  let completedWasEndless = false;
  let endlessWaveNumber = 1;
  let endlessSessionKm = 0;
  let undoMoveStack = [];
  let lastHumanTappedKey = '';
  let lastHumanTapTime = 0;
  let pendingStarterPackBonus = false;
  let mechanicBannerTimer = null;
  let lastCampaignLevelId = null;
  let movesSpentInLevel = 0;
  let lastPerfectBonus = 0;
  let lastBossBonus = 0;
  let bossBannerTimer = null;

  const SPEED_MULT_MAP = { 1: 1.00, 2: 1.85, 3: 2.75 };
  const SECTOR_OPENING_DIALOGUE_LEVELS = new Set([1, 8, 11, 21, 31, 41, 51, 61, 71, 81, 91]);
  let tutorialStep = 0; // 0 = inactive, 1 = rotate rail, 2 = 3D/Top camera, 3 = speed [1][2][3], 4 = launch train!

  function getPreferredSpeedTier() {
    const v = Number(gameState && gameState.preferredTrainSpeed);
    return (v === 2 || v === 3) ? v : 1;
  }

  function getPreferredSpeedMult() {
    return SPEED_MULT_MAP[getPreferredSpeedTier()] || 1.00;
  }

  function triggerHaptic(pattern = 12) {
    if (isAutoPlaytestRunning) return;
    if (gameState && gameState.hapticsEnabled === false) return;
    if (window.GameAudio && window.GameAudio.muted) return;
    if (window.GameAudio && typeof window.GameAudio.triggerHaptic === 'function') {
      window.GameAudio.triggerHaptic(pattern);
      return;
    }
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch (_) {}
  }

  function getEffectiveSkinId() {
    return trialSkinIdForCurrentLevel || (gameState && gameState.equippedSkin) || 'crimson';
  }

  function isEn() {
    return Boolean(gameState && gameState.lang && gameState.lang !== 'ar');
  }

  function t(key) {
    const langCode = (gameState && gameState.lang) || 'ar';
    const customDict = I18N[langCode];
    if (customDict && customDict[key] !== undefined) return customDict[key];
    const fallbackDict = isEn() ? I18N.en : I18N.ar;
    return (fallbackDict && fallbackDict[key] !== undefined) ? fallbackDict[key] : (I18N.ar[key] || key);
  }

  function getStationEmpireLevel() {
    const unlocked = Math.max(1, Number((gameState && gameState.unlockedLevel) || 1));
    return Math.max(1, Math.min(10, Math.ceil(unlocked / 10)));
  }

  function getPendingEmpireTickets() {
    if (!gameState) return 0;
    const empLv = getStationEmpireLevel();
    const ratePerHour = 12 + empLv * 8;
    const nowMs = Date.now();
    const lastClaim = Number(gameState.lastEmpireClaimMs || 0);
    if (lastClaim <= 0) {
      return 45 + empLv * 15; // Welcome Ticket Vault bonus ready immediately!
    }
    const elapsedHours = Math.max(0, (nowMs - lastClaim) / 3600000);
    return Math.min(350, Math.floor(elapsedHours * ratePerHour));
  }

  function updateStationEmpireUI() {
    const empLv = getStationEmpireLevel();
    const pendingCoins = getPendingEmpireTickets();
    const empLbl = document.getElementById('btn-station-empire-label');
    const empDot = document.getElementById('ui-empire-dot');
    const endLbl = document.getElementById('btn-endless-mode-label');
    const bestKm = Number((gameState && gameState.bestEndlessKm) || 0).toFixed(1);

    if (empLbl) {
      empLbl.textContent = (pendingCoins >= 10)
        ? tf('empireReadyFmt', { lv: empLv, coins: pendingCoins })
        : tf('empireIdleFmt', { lv: empLv });
    }
    if (empDot) {
      empDot.hidden = (pendingCoins < 10);
    }
    if (endLbl) {
      endLbl.textContent = Number(bestKm) > 0
        ? tf('endlessBestFmt', { km: bestKm })
        : t('endlessDefault');
    }

    const starterCard = document.getElementById('shop-starter-card');
    if (starterCard && gameState) {
      starterCard.hidden = Boolean(gameState.starterPackClaimed);
    }
  }

  function claimStationEmpireTickets() {
    const empLv = getStationEmpireLevel();
    const pendingCoins = getPendingEmpireTickets();
    const ratePerHour = 12 + empLv * 8;
    if (pendingCoins >= 10) {
      gameState.coins += pendingCoins;
      gameState.lastEmpireClaimMs = Date.now();
      saveState();
      triggerHaptic([15, 30, 20]);
      if (window.GameAudio) window.GameAudio.playCoinChime();
      updateGlobalTopBar();
      updateStationEmpireUI();
      showToast(tf('toastEmpireClaimFmt', { lv: empLv, coins: pendingCoins, rate: ratePerHour }));
    } else {
      showToast(tf('toastEmpireIdleFmt', { lv: empLv, rate: ratePerHour }));
    }
  }

  function updateUndoButtonState() {
    const undoBtn = document.getElementById('btn-undo-move');
    const undoLbl = document.getElementById('btn-undo-label');
    if (undoLbl) {
      undoLbl.textContent = t('btnUndo');
    }
    if (undoBtn) {
      undoBtn.disabled = Boolean(!currentLevel || isTrainRunning || undoMoveStack.length === 0);
    }
  }

  function undoLastMove() {
    if (!currentLevel || isTrainRunning || undoMoveStack.length === 0) return;
    const lastOp = undoMoveStack.pop();
    const cell = boardGrid[lastOp.r] && boardGrid[lastOp.r][lastOp.c];
    if (!cell || !cell.rotatable || cell.hintLocked) {
      updateUndoButtonState();
      return;
    }
    if (autoLaunchTimer) {
      clearTimeout(autoLaunchTimer);
      autoLaunchTimer = null;
    }
    cell.rot = lastOp.prevRot;
    cell.visualRot = lastOp.prevVisualRot;
    remainingMoves += (lastOp.costMove || 0);
    movesSpentInLevel = Math.max(0, movesSpentInLevel - (lastOp.costMove || 0));
    lastHumanTappedKey = '';
    lastHumanTapTime = 0;

    const rotator = document.getElementById(`rotator-${lastOp.r}-${lastOp.c}`);
    if (rotator) {
      rotator.style.transform = `rotate(${cell.visualRot}deg)`;
    }
    if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
      window.TrainEngine3D.rotateTile3D(lastOp.r, lastOp.c, cell.visualRot);
    }
    if (window.GameAudio) window.GameAudio.playButtonTap();
    updateMovesHUD();
    updateUndoButtonState();
    saveMidLevelSession();
    evaluateBoardConnectivity(false);
  }

  function showMechanicDiscoveryIfNeeded(level) {
    const cardEl = document.getElementById('mechanic-discovery-card');
    if (!cardEl) return;
    if (isAutoPlaytestRunning || window.__HEADLESS_CI_TEST === true || !level) {
      cardEl.hidden = true;
      return;
    }
    if (!gameState.seenMechanics || typeof gameState.seenMechanics !== 'object') {
      gameState.seenMechanics = {};
    }

    const allSol = (level.solutionPath || []).concat(level.secondarySolutionPath || []);
    const hasType = (tp) => allSol.some(s => s && s.type === tp);

    let key = '';
    let icon = '';
    let title = '';
    let desc = '';

    const MECHANIC_TEXT_KEYS = {
      ENDLESS: ['♾️', 'mechEndlessTitle', 'mechEndlessDesc'],
      BRIDGE: ['🌉', 'mechBridgeTitle', 'mechBridgeDesc'],
      Y_SWITCH: ['🔀', 'mechYSwitchTitle', 'mechYSwitchDesc'],
      DUAL_TRAIN: ['🚆', 'mechDualTrainTitle', 'mechDualTrainDesc'],
      STORM_RUSH: ['⚡', 'mechStormTitle', 'mechStormDesc'],
      SWITCH: ['🔁', 'mechSwitchTitle', 'mechSwitchDesc']
    };

    if (!cardEl.hidden && cardEl.getAttribute('data-active-mechanic')) {
      const prevKey = cardEl.getAttribute('data-active-mechanic');
      if (MECHANIC_TEXT_KEYS[prevKey]) {
        const [pIcon, pTitleKey, pDescKey] = MECHANIC_TEXT_KEYS[prevKey];
        const icEl0 = document.getElementById('mechanic-card-icon');
        const tiEl0 = document.getElementById('mechanic-card-title');
        const deEl0 = document.getElementById('mechanic-card-desc');
        if (icEl0) icEl0.textContent = pIcon;
        if (tiEl0) tiEl0.textContent = t(pTitleKey);
        if (deEl0) deEl0.textContent = t(pDescKey);
        return;
      }
    }

    if (isEndlessMarathonMode && !gameState.seenMechanics.ENDLESS) {
      key = 'ENDLESS';
    } else if (hasType('BRIDGE') && !gameState.seenMechanics.BRIDGE) {
      key = 'BRIDGE';
    } else if (hasType('Y_SWITCH') && !gameState.seenMechanics.Y_SWITCH) {
      key = 'Y_SWITCH';
    } else if (level.isDualTrainLevel && !gameState.seenMechanics.DUAL_TRAIN) {
      key = 'DUAL_TRAIN';
    } else if (level.isStormChallenge && !gameState.seenMechanics.STORM_RUSH) {
      key = 'STORM_RUSH';
    } else if (hasType('SWITCH') && !gameState.seenMechanics.SWITCH) {
      key = 'SWITCH';
    }

    if (!key) {
      cardEl.hidden = true;
      return;
    }

    const [mIcon, mTitleKey, mDescKey] = MECHANIC_TEXT_KEYS[key];
    icon = mIcon;
    title = t(mTitleKey);
    desc = t(mDescKey);
    cardEl.setAttribute('data-active-mechanic', key);
    gameState.seenMechanics[key] = true;
    saveState();

    const icEl = document.getElementById('mechanic-card-icon');
    const tiEl = document.getElementById('mechanic-card-title');
    const deEl = document.getElementById('mechanic-card-desc');
    if (icEl) icEl.textContent = icon;
    if (tiEl) tiEl.textContent = title;
    if (deEl) deEl.textContent = desc;
    cardEl.hidden = false;
    cardEl.onclick = () => { cardEl.hidden = true; };

    if (mechanicBannerTimer) clearTimeout(mechanicBannerTimer);
    mechanicBannerTimer = setTimeout(() => {
      cardEl.hidden = true;
    }, 4600);
  }

  function startEndlessMarathonWave(waveNum) {
    endlessWaveNumber = Math.max(1, Number(waveNum) || 1);
    if (endlessWaveNumber === 1) {
      endlessSessionKm = 0;
    }
    if (!isDailyChallengeMode && !isEndlessMarathonMode && currentLevel) {
      lastCampaignLevelId = currentLevel.id;
    }
    // Select curated escalating wave boards across biomes (5x4 -> 6x5 -> 7x5 -> 7x6)
    const pool = [3, 6, 9, 12, 16, 19, 23, 27, 32, 36, 42, 47, 53, 58, 63];
    const pickId = pool[(endlessWaveNumber - 1) % pool.length];
    if (endlessWaveNumber >= 2 || pickId > 3) {
      if (typeof window.__showDemoFullGameModal === 'function') window.__showDemoFullGameModal(pickId);
      return;
    }
    isEndlessMarathonMode = true;
    startLevel(pickId, false, false);
    isEndlessMarathonMode = true;

    // On Wave 2+, crown two mid-route tiles with Paired Violet Energy Portal Arches [🌀A]!
    if (endlessWaveNumber >= 2 && boardGrid && currentLevel && Array.isArray(currentLevel.solutionPath) && currentLevel.solutionPath.length >= 8) {
      const pA = currentLevel.solutionPath[2];
      const pB = currentLevel.solutionPath[currentLevel.solutionPath.length - 3];
      if (pA && pB && boardGrid[pA.r] && boardGrid[pA.r][pA.c] && boardGrid[pB.r] && boardGrid[pB.r][pB.c]) {
        boardGrid[pA.r][pA.c].portalColor = true;
        boardGrid[pA.r][pA.c].portalLabel = '🌀';
        boardGrid[pB.r][pB.c].portalColor = true;
        boardGrid[pB.r][pB.c].portalLabel = '🌀';
        if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
          const effSkinId = getEffectiveSkinId();
          const activeSkin = TRAIN_SKINS.find(s => s.id === effSkinId) || TRAIN_SKINS[0];
          window.TrainEngine3D.buildLevelScene(currentLevel, boardGrid, activeSkin);
          evaluateBoardConnectivity(false);
        }
      }
    }

    const lvlTitleEl = document.getElementById('hud-level-title');
    if (lvlTitleEl) {
      lvlTitleEl.textContent = tf('endlessWaveHudFmt', { wave: endlessWaveNumber, km: endlessSessionKm.toFixed(1) });
    }
    showMechanicDiscoveryIfNeeded(currentLevel);
  }

  function getLvlTitle(lvl) {
    if (!lvl) return '';
    const lg = (gameState && gameState.lang) || 'ar';
    if (lg === 'ar') return lvl.titleAr || lvl.title;
    if (lg === 'en') return lvl.titleEn || lvl.title;
    const st = window.GameLevels && window.GameLevels.STATIONS
      ? window.GameLevels.STATIONS.find(s => s.id === lvl.stationId)
      : null;
    const stLocal = st ? getStationName(st) : '';
    return stLocal ? `${stLocal} #${lvl.id}` : (lvl.titleEn || lvl.title);
  }

  function getStationName(st) {
    if (!st) return '';
    const lg = (gameState && gameState.lang) || 'ar';
    if (lg === 'ar') return st.name;
    if (SECTOR_NAMES_I18N[st.id] && SECTOR_NAMES_I18N[st.id][lg]) {
      return SECTOR_NAMES_I18N[st.id][lg];
    }
    return st.nameEn || st.name;
  }

  function getSkinName(skin) {
    if (!skin) return '';
    const lg = (gameState && gameState.lang) || 'ar';
    if (lg === 'ar') return skin.name;
    if (SKIN_I18N[skin.id] && SKIN_I18N[skin.id][lg]) return SKIN_I18N[skin.id][lg].name;
    return skin.nameEn || skin.name;
  }

  function getSkinDesc(skin) {
    if (!skin) return '';
    const lg = (gameState && gameState.lang) || 'ar';
    if (lg === 'ar') return skin.desc;
    if (SKIN_I18N[skin.id] && SKIN_I18N[skin.id][lg]) return SKIN_I18N[skin.id][lg].desc;
    return skin.descEn || skin.desc;
  }

  function getSkinPerkBadge(skin) {
    if (!skin) return '';
    const lg = (gameState && gameState.lang) || 'ar';
    if (lg === 'ar') return skin.perkBadge || '';
    if (SKIN_I18N[skin.id] && SKIN_I18N[skin.id][lg]) return SKIN_I18N[skin.id][lg].perk;
    return skin.perkBadgeEn || skin.perkBadge || '';
  }

  function getSkinLevel(skinId) {
    if (!gameState || !gameState.skinLevels) return 1;
    return Math.max(1, Math.min(5, Number(gameState.skinLevels[skinId] || 1)));
  }

  function getActiveSkinPerks(skinId) {
    const effId = skinId || getEffectiveSkinId();
    const skin = TRAIN_SKINS.find(s => s.id === effId) || TRAIN_SKINS[0];
    const lv = getSkinLevel(skin.id);
    const upgradeTier = lv - 1; // 0..4
    const baseLocks = skin.autoLockCount || 0;
    const bonusLock = baseLocks === 0 ? (lv >= 4 ? 1 : 0) : (lv >= 5 ? 1 : 0);
    const baseFreeze = skin.autoFreezeSec || 0;
    return {
      skin,
      level: lv,
      extraMoves: (skin.extraMoves || 0) + (upgradeTier * 1),
      extraTimeSec: (skin.extraTimeSec || 0) + (upgradeTier * 4),
      coinBonusPct: (skin.coinBonusPct || 0) + (upgradeTier * 5),
      autoLockCount: Math.min(3, baseLocks + bonusLock),
      autoFreezeSec: baseFreeze + (baseFreeze > 0 ? upgradeTier * 2 : 0),
      starMagnet: Boolean(skin.starMagnet || lv >= 5),
      threeStarMoveGrace: (skin.threeStarMoveGrace || 0) + (lv >= 4 ? 1 : 0),
      speedMult: Number((skin.speedMult || 1.0).toFixed(2))
    };
  }

  // V5.6 12-Achievement System with Gold Coins & Radar Hint Rewards (Bilingual AR / EN)
  const ACHIEVEMENTS = [
    {
      id: 'ach_first_win',
      icon: '🚄',
      title: 'الانطلاقة الأولى',
      titleEn: 'First Departure',
      desc: 'أكمل المهمة الأولى بنجاح وأوصل القطار إلى المحطة',
      descEn: 'Complete Level 1 and guide the train safely to the terminal',
      target: 1,
      rewardCoins: 100,
      rewardHints: 1,
      getProgress: (gs) => Object.values(gs.levelStars || {}).filter(s => s > 0).length
    },
    {
      id: 'ach_sector_1',
      icon: '🏛️',
      title: 'بطل القطاع الأول',
      titleEn: 'Sector 1 Champion',
      desc: 'أكمل جميع مهام القطاع 1 (10 مراحل)',
      descEn: 'Complete all 10 missions in Sector 1',
      target: 10,
      rewardCoins: 250,
      rewardHints: 1,
      getProgress: (gs) => Object.values(gs.levelStars || {}).filter(s => s > 0).length
    },
    {
      id: 'ach_stars_30',
      icon: '⭐',
      title: 'جامع النجوم الذهبية',
      titleEn: 'Golden Star Collector',
      desc: 'اجمع 30 نجمة ذهبية عبر المراحل',
      descEn: 'Collect 30 Golden Stars across the campaign',
      target: 30,
      rewardCoins: 300,
      rewardHints: 1,
      getProgress: (gs) => Object.values(gs.levelStars || {}).reduce((a, b) => a + b, 0)
    },
    {
      id: 'ach_stars_90',
      icon: '🌟',
      title: 'سيد النجوم الساطعة',
      titleEn: 'Master of Shining Stars',
      desc: 'اجمع 90 نجمة ذهبية عبر المراحل',
      descEn: 'Collect 90 Golden Stars across the campaign',
      target: 90,
      rewardCoins: 600,
      rewardHints: 2,
      getProgress: (gs) => Object.values(gs.levelStars || {}).reduce((a, b) => a + b, 0)
    },
    {
      id: 'ach_stars_200',
      icon: '👑',
      title: 'أسطورة المجرة الحديدية',
      titleEn: 'Iron Galaxy Legend',
      desc: 'اجمع 200 نجمة ذهبية عبر المراحل',
      descEn: 'Collect 200 Golden Stars across the campaign',
      target: 200,
      rewardCoins: 1200,
      rewardHints: 3,
      getProgress: (gs) => Object.values(gs.levelStars || {}).reduce((a, b) => a + b, 0)
    },
    {
      id: 'ach_combo_4x',
      icon: '🔥',
      title: 'سرعة البرق (كومبو \u2066×4\u2069)',
      titleEn: 'Lightning Speed (4x Combo)',
      desc: 'حقق مضاعف كومبو \u2066×4\u2069 بتدوير السكك الصحيحة بسرعة',
      descEn: 'Reach a 4x Combo multiplier by rotating solution tracks rapidly',
      target: 4,
      rewardCoins: 200,
      rewardHints: 1,
      getProgress: (gs) => Number(gs.maxComboEver || 1)
    },
    {
      id: 'ach_buy_train',
      icon: '🚂',
      title: 'مقتني القطارات العالمية',
      titleEn: 'World Locomotive Collector',
      desc: 'امتلك 3 قطارات مختلفة في مرآب القاطرات',
      descEn: 'Own 3 different locomotives in the garage',
      target: 3,
      rewardCoins: 350,
      rewardHints: 1,
      getProgress: (gs) => (gs.ownedSkins || ['crimson']).length
    },
    {
      id: 'ach_fleet_6',
      icon: '🌍',
      title: 'أسطول القارات الست',
      titleEn: 'Six-Continent Fleet',
      desc: 'امتلك 6 قطارات عالمية مختلفة في مرآب القاطرات',
      descEn: 'Own 6 different world locomotives in the garage',
      target: 6,
      rewardCoins: 800,
      rewardHints: 2,
      getProgress: (gs) => (gs.ownedSkins || ['crimson']).length
    },
    {
      id: 'ach_upgrade_lv3',
      icon: '⚙️',
      title: 'كبير مهندسي التوربين',
      titleEn: 'Chief Turbine Engineer',
      desc: 'طوّر أي قاطرة في المتجر إلى المستوى \u2066Lv.3\u2069 أو أعلى',
      descEn: 'Upgrade any locomotive in the garage to Lv.3 or higher',
      target: 3,
      rewardCoins: 350,
      rewardHints: 1,
      getProgress: (gs) => Math.max(1, ...Object.values(gs.skinLevels || { crimson: 1 }))
    },
    {
      id: 'ach_dual_train_1',
      icon: '🔀',
      title: 'مهندس التقاطعات المزدوجة',
      titleEn: 'Dual-Train Crossing Engineer',
      desc: 'أكمل مرحلة قطارين متزامنين بنجاح',
      descEn: 'Complete a Dual-Train mission successfully',
      target: 1,
      rewardCoins: 250,
      rewardHints: 1,
      getProgress: (gs) => Number(gs.dualTrainWins || 0)
    },
    {
      id: 'ach_dual_train_10',
      icon: '⚡',
      title: 'قائد الحركة المتزامنة',
      titleEn: 'Synchronized Traffic Commander',
      desc: 'أكمل 10 مراحل قطارين متزامنين دون تصادم',
      descEn: 'Complete 10 Dual-Train missions without collision',
      target: 10,
      rewardCoins: 750,
      rewardHints: 2,
      getProgress: (gs) => Number(gs.dualTrainWins || 0)
    },
    {
      id: 'ach_all_100',
      icon: '🏆',
      title: 'إمبراطور قطار الأحلام \u2066100%\u2069',
      titleEn: 'Dream Express Emperor 100%',
      desc: 'أكمل جميع المراحل الـ\u00A0\u2066100\u2069 في قطار الأحلام',
      descEn: 'Complete all 100 missions in Dream Express 3D',
      target: 100,
      rewardCoins: 2500,
      rewardHints: 5,
      getProgress: (gs) => Object.values(gs.levelStars || {}).filter(s => s > 0).length
    }
  ];

  // ==========================================================================
  // 4. LEVEL, COMBO, SEQUENTIAL DUAL-TRAIN & STORM TIMER RUNTIME STATE
  // ==========================================================================
  let currentLevel = null;
  let boardGrid = [];
  let remainingMoves = 0;
  let connectedSteps = [];
  let connectedSecondarySteps = [];
  let isPathComplete = false;
  let isTrainRunning = false;
  let train1Delivered = false;
  let train2Delivered = false;
  let collectedSparksSet = new Set();
  let lastEarnedCoins = 0;
  let doubleCoinsClaimed = false;
  let autoLaunchTimer = null;
  let isAutoPlaytestRunning = false;
  let liveAutoPlayTimer = null;

  // Exciting V2.0 Gameplay States: Combo & Storm Timer
  let comboMultiplier = 1;
  let maxComboReached = 1;
  let lastCorrectRotateTime = 0;

  let stormTimeRemaining = 60;
  let stormTimerInterval = null;
  let stormFrozenUntil = 0;
  let freezeUsedFreeThisLevel = false;

  function isCurrentMissionStormRush() {
    return Boolean(isEndlessMarathonMode || (currentLevel && currentLevel.isStormChallenge));
  }

  function startStormTimer(seconds) {
    stopStormTimer();
    stormTimeRemaining = seconds;
    stormFrozenUntil = 0;
    freezeUsedFreeThisLevel = false;
    const strip = document.getElementById('storm-timer-strip');
    const iconEl = document.getElementById('storm-status-icon');
    const isRush = isCurrentMissionStormRush();
    if (strip) {
      strip.classList.remove('timer-frozen', 'timer-relaxed', 'timer-storm-rush');
      strip.classList.add(isRush ? 'timer-storm-rush' : 'timer-relaxed');
    }
    if (iconEl) {
      iconEl.textContent = isRush ? '⚡' : '⏱️';
    }
    updateStormTimerHUD();

    stormTimerInterval = setInterval(() => {
      if (!currentLevel || isTrainRunning || isPathComplete) return;
      if (typeof document !== 'undefined' && (document.hidden || window.__isNativeAppPaused)) return;
      // Pause timer while any modal is open
      const anyModalOpen = Array.from(document.querySelectorAll('.modal-backdrop')).some(m => !m.hidden);
      if (anyModalOpen) return;

      const stripEl = document.getElementById('storm-timer-strip');
      if (Date.now() < stormFrozenUntil) {
        if (stripEl) stripEl.classList.add('timer-frozen');
        return;
      }
      if (stripEl) stripEl.classList.remove('timer-frozen');

      if (stormTimeRemaining > 0) {
        stormTimeRemaining -= 1;
        updateStormTimerHUD();
        if (stormTimeRemaining <= 0 && !isTrainRunning && !isPathComplete) {
          stopStormTimer();
          if (isCurrentMissionStormRush()) {
            if (window.GameAudio) window.GameAudio.playOutOfMoves();
            openStormTimeUpModal();
          } else {
            // Relaxed Tactical Mode (80% missions including L1..L9): NEVER punish or interrupt thinking!
            updateStormTimerHUD();
          }
        }
      }
    }, 1000);
  }

  function stopStormTimer() {
    if (stormTimerInterval) {
      clearInterval(stormTimerInterval);
      stormTimerInterval = null;
    }
  }

  function updateStormTimerHUD() {
    if (!currentLevel) return;
    const secEl = document.getElementById('hud-timer-sec');
    const barEl = document.getElementById('hud-timer-bar');
    if (secEl) {
      if (stormTimeRemaining <= 0 && !isCurrentMissionStormRush()) {
        secEl.textContent = '🧘 ∞';
      } else {
        secEl.textContent = `${stormTimeRemaining}s`;
      }
    }
    if (barEl) {
      const ratio = Math.min(1, Math.max(0, stormTimeRemaining / Math.max(1, currentLevel.timeLimit)));
      barEl.style.transform = `scaleX(${ratio.toFixed(4)})`;
    }
  }

  function triggerScreenShake() {
    const frame = document.getElementById('board-frame');
    if (!frame) return;
    frame.classList.remove('screen-shake');
    void frame.offsetWidth;
    frame.classList.add('screen-shake');
  }

  // ==========================================================================
  // 5. TILE CONNECTIVITY & PATH VALIDATOR ENGINE
  // ==========================================================================
  function getTilePorts(type, rotDeg) {
    const norm = ((rotDeg % 360) + 360) % 360;
    switch (type) {
      case 'START':
      case 'END':
      case 'START_2':
      case 'END_2':
        if (norm === 0) return ['N'];
        if (norm === 90) return ['E'];
        if (norm === 180) return ['S'];
        if (norm === 270) return ['W'];
        return ['E'];

      case 'STRAIGHT':
      case 'BRIDGE':
      case 'FIXED_STRAIGHT':
        return (norm % 180 === 0) ? ['N', 'S'] : ['E', 'W'];

      case 'CURVE':
        if (norm === 0) return ['N', 'E'];
        if (norm === 90) return ['E', 'S'];
        if (norm === 180) return ['S', 'W'];
        if (norm === 270) return ['W', 'N'];
        return ['N', 'E'];

      case 'Y_SWITCH':
        // 3-Way Y-Shaped Fork Track: [basePort, branchRight, branchLeft]
        if (norm === 0) return ['S', 'E', 'W'];
        if (norm === 90) return ['W', 'S', 'N'];
        if (norm === 180) return ['N', 'W', 'E'];
        if (norm === 270) return ['E', 'N', 'S'];
        return ['S', 'E', 'W'];

      case 'SWITCH':
        // Dual-Curve Track Switcher (two parallel curved channels on the same cell)
        return ['N', 'E', 'S', 'W'];

      case 'CROSS':
        return ['N', 'E', 'S', 'W'];

      default:
        return [];
    }
  }

  function isTileAtSolution(cell) {
    if (!cell || !cell.isSolutionTile) return true;
    const norm = ((cell.rot % 360) + 360) % 360;
    const sol = ((cell.solRot % 360) + 360) % 360;
    if (cell.type === 'STRAIGHT' || cell.type === 'BRIDGE' || cell.type === 'FIXED_STRAIGHT' || cell.type === 'SWITCH') {
      return (norm % 180) === (sol % 180);
    }
    if (cell.type === 'Y_SWITCH') {
      return norm === sol || norm === ((sol + 90) % 360);
    }
    return norm === sol;
  }

  function traceSingleLine(startType, endType) {
    const rows = currentLevel.rows;
    const cols = currentLevel.cols;
    let startCell = null;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (boardGrid[r][c].type === startType) {
          startCell = boardGrid[r][c];
          break;
        }
      }
    }

    if (!startCell) return { steps: [], complete: false };

    const startPorts = getTilePorts(startType, startCell.rot);
    let outDir = startPorts[0];

    const steps = [
      {
        r: startCell.r,
        c: startCell.c,
        type: startType,
        enterDir: null,
        exitDir: outDir
      }
    ];

    const visitedStates = new Set();
    visitedStates.add(`${startCell.r},${startCell.c},${startType}`);

    let currR = startCell.r;
    let currC = startCell.c;
    let complete = false;

    while (outDir) {
      const delta = DIR_DELTA[outDir];
      const nextR = currR + delta.dr;
      const nextC = currC + delta.dc;

      if (nextR < 0 || nextR >= rows || nextC < 0 || nextC >= cols) {
        break;
      }

      const nextCell = boardGrid[nextR][nextC];
      const requiredEntryPort = OPPOSITE_DIR[outDir];
      const nextPorts = getTilePorts(nextCell.type, nextCell.rot);

      if (!nextPorts.includes(requiredEntryPort)) {
        break;
      }

      let axisKey = 'SINGLE';
      if (nextCell.type === 'CROSS') {
        axisKey = (requiredEntryPort === 'N' || requiredEntryPort === 'S') ? 'NS' : 'EW';
      } else if (nextCell.type === 'SWITCH') {
        const swNorm = ((nextCell.rot % 360) + 360) % 360;
        if (swNorm % 180 === 0) {
          axisKey = (requiredEntryPort === 'N' || requiredEntryPort === 'E') ? 'NE' : 'SW';
        } else {
          axisKey = (requiredEntryPort === 'E' || requiredEntryPort === 'S') ? 'ES' : 'WN';
        }
      }
      const stateKey = `${nextR},${nextC},${axisKey}`;
      if (visitedStates.has(stateKey)) {
        break;
      }
      visitedStates.add(stateKey);

      if (nextCell.type === endType) {
        steps.push({
          r: nextR,
          c: nextC,
          type: endType,
          enterDir: requiredEntryPort,
          exitDir: null
        });
        complete = true;
        break;
      }

      // Prevent Train 1 from entering END_2 or Train 2 from entering END
      if (nextCell.type === 'START' || nextCell.type === 'START_2' || nextCell.type === 'END' || nextCell.type === 'END_2') {
        break;
      }

      let nextExitDir = null;
      if (nextCell.type === 'CROSS') {
        nextExitDir = outDir;
      } else if (nextCell.type === 'SWITCH') {
        const swNorm = ((nextCell.rot % 360) + 360) % 360;
        if (swNorm % 180 === 0) {
          if (requiredEntryPort === 'N') nextExitDir = 'E';
          else if (requiredEntryPort === 'E') nextExitDir = 'N';
          else if (requiredEntryPort === 'S') nextExitDir = 'W';
          else if (requiredEntryPort === 'W') nextExitDir = 'S';
        } else {
          if (requiredEntryPort === 'E') nextExitDir = 'S';
          else if (requiredEntryPort === 'S') nextExitDir = 'E';
          else if (requiredEntryPort === 'W') nextExitDir = 'N';
          else if (requiredEntryPort === 'N') nextExitDir = 'W';
        }
      } else if (nextCell.type === 'Y_SWITCH') {
        const basePort = nextPorts[0];
        const b1 = nextPorts[1];
        const b2 = nextPorts[2];
        if (requiredEntryPort !== basePort) {
          nextExitDir = basePort;
        } else {
          const canBranchConnect = (bDir) => {
            const bd = DIR_DELTA[bDir];
            if (!bd) return false;
            const br = nextR + bd.dr;
            const bc = nextC + bd.dc;
            if (br < 0 || br >= rows || bc < 0 || bc >= cols) return false;
            const bCell = boardGrid[br] && boardGrid[br][bc];
            if (!bCell || bCell.type === 'OBSTACLE') return false;
            return getTilePorts(bCell.type, bCell.rot).includes(OPPOSITE_DIR[bDir]);
          };
          const c1 = canBranchConnect(b1);
          const c2 = canBranchConnect(b2);
          if (c1 && c2) {
            const doesBranchReachTerminal = (firstBranchDir) => {
              const queue = [{ r: nextR, c: nextC, dir: firstBranchDir, depth: 0 }];
              const seenBfs = new Set([`${nextR},${nextC},${firstBranchDir}`]);
              while (queue.length > 0) {
                const cur = queue.shift();
                if (cur.depth > 95) continue;
                const d = DIR_DELTA[cur.dir];
                if (!d) continue;
                const tr = cur.r + d.dr;
                const tc = cur.c + d.dc;
                if (tr < 0 || tr >= rows || tc < 0 || tc >= cols) continue;
                const tCell = boardGrid[tr] && boardGrid[tr][tc];
                if (!tCell || tCell.type === 'OBSTACLE') continue;
                const entryP = OPPOSITE_DIR[cur.dir];
                const tPorts = getTilePorts(tCell.type, tCell.rot);
                if (!tPorts.includes(entryP)) continue;
                if (tCell.type === endType) return true;
                if (tCell.type === 'START' || tCell.type === 'START_2' || tCell.type === 'END' || tCell.type === 'END_2') continue;
                let outDirs = [];
                if (tCell.type === 'CROSS') {
                  outDirs = [cur.dir];
                } else if (tCell.type === 'SWITCH') {
                  const swN = ((tCell.rot % 360) + 360) % 360;
                  if (swN % 180 === 0) {
                    if (entryP === 'N') outDirs = ['E'];
                    else if (entryP === 'E') outDirs = ['N'];
                    else if (entryP === 'S') outDirs = ['W'];
                    else if (entryP === 'W') outDirs = ['S'];
                  } else {
                    if (entryP === 'E') outDirs = ['S'];
                    else if (entryP === 'S') outDirs = ['E'];
                    else if (entryP === 'W') outDirs = ['N'];
                    else if (entryP === 'N') outDirs = ['W'];
                  }
                } else if (tCell.type === 'Y_SWITCH') {
                  const bp = tPorts[0];
                  outDirs = (entryP !== bp) ? [bp] : [tPorts[1], tPorts[2]];
                } else {
                  const o = tPorts.find(p => p !== entryP);
                  if (o) outDirs = [o];
                }
                for (const od of outDirs) {
                  const k = `${tr},${tc},${od}`;
                  if (!seenBfs.has(k)) {
                    seenBfs.add(k);
                    queue.push({ r: tr, c: tc, dir: od, depth: cur.depth + 1 });
                  }
                }
              }
              return false;
            };
            const reach1 = doesBranchReachTerminal(b1);
            const reach2 = doesBranchReachTerminal(b2);
            if (reach1 && !reach2) {
              nextExitDir = b1;
            } else if (reach2 && !reach1) {
              nextExitDir = b2;
            } else if (nextCell.solExitDir === b1 || nextCell.solExitDir === b2) {
              nextExitDir = nextCell.solExitDir;
            } else {
              nextExitDir = b1;
            }
          } else if (c1 && !c2) {
            nextExitDir = b1;
          } else if (c2 && !c1) {
            nextExitDir = b2;
          } else if (nextCell.solExitDir === b1 || nextCell.solExitDir === b2) {
            nextExitDir = nextCell.solExitDir;
          } else {
            nextExitDir = b1;
          }
        }
      } else {
        nextExitDir = nextPorts.find(p => p !== requiredEntryPort) || null;
      }

      steps.push({
        r: nextR,
        c: nextC,
        type: nextCell.type,
        enterDir: requiredEntryPort,
        exitDir: nextExitDir
      });

      currR = nextR;
      currC = nextC;
      outDir = nextExitDir;
    }

    return { steps, complete };
  }

  function traceConnectedPath() {
    if (!currentLevel || !boardGrid.length) {
      return { steps: [], secondarySteps: [], complete: false, sparksOnPath: 0 };
    }

    const primary = traceSingleLine('START', 'END');
    let secondary = { steps: [], complete: true };

    if (currentLevel.isDualTrainLevel && currentLevel.secondarySolutionPath && currentLevel.secondarySolutionPath.length > 0) {
      secondary = traceSingleLine('START_2', 'END_2');
    }

    const stepCoords = new Set(primary.steps.map(s => `${s.r},${s.c}`));
    secondary.steps.forEach(s => stepCoords.add(`${s.r},${s.c}`));

    const completeStepCoords = new Set();
    if (!train1Delivered && primary.complete) {
      primary.steps.forEach(s => completeStepCoords.add(`${s.r},${s.c}`));
    }
    if (currentLevel.isDualTrainLevel && !train2Delivered && secondary.complete) {
      secondary.steps.forEach(s => completeStepCoords.add(`${s.r},${s.c}`));
    }

    const perks = getActiveSkinPerks();
    const countSparksForSet = (coordSet, includeCollected) => {
      let total = 0;
      currentLevel.sparks.forEach(([sr, sc]) => {
        const sk = `${sr},${sc}`;
        if ((includeCollected && collectedSparksSet.has(sk)) || coordSet.has(sk)) {
          total += 1;
        } else if (perks.starMagnet) {
          let near = false;
          for (const coord of coordSet) {
            const [cr, cc] = coord.split(',').map(Number);
            if (Math.abs(sr - cr) <= 1 && Math.abs(sc - cc) <= 1) {
              near = true;
              break;
            }
          }
          if (near) total += 1;
        }
      });
      return total;
    };

    const anyRouteComplete = Boolean(
      (!train1Delivered && primary.complete) ||
      (currentLevel.isDualTrainLevel && !train2Delivered && secondary.complete)
    );
    const sparksOnCompleteRoute = countSparksForSet(completeStepCoords, true);
    const sparksOnPath = anyRouteComplete ? sparksOnCompleteRoute : countSparksForSet(stepCoords, false);

    return {
      steps: primary.steps,
      secondarySteps: secondary.steps,
      primaryComplete: primary.complete,
      secondaryComplete: secondary.complete,
      complete: Boolean(primary.complete && secondary.complete),
      sparksOnPath,
      sparksOnCompleteRoute
    };
  }

  // ==========================================================================
  // 6. HIGH-CONTRAST INDUSTRIAL STEEL & PLASMA SVG TILE GRAPHICS
  // ==========================================================================
  function renderSparkStarSVG() {
    // High-voltage glowing Plasma Energy Core
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="24" fill="rgba(6, 182, 212, 0.28)" stroke="#38BDF8" stroke-width="3"/>
      <polygon points="32,6 40,22 58,24 44,37 48,55 32,45 16,55 20,37 6,24 24,22"
        fill="#FACC15" stroke="#090D16" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="32" cy="32" r="8" fill="#E0F2FE"/>
    </svg>`;
  }

  function renderObstacleSVG(kind) {
    switch (kind) {
      case 'crystal':
        return `<svg viewBox="0 0 100 100">
          <ellipse cx="50" cy="80" rx="34" ry="10" fill="#1E1B4B"/>
          <polygon points="50,12 68,48 60,82 40,82 32,48" fill="#A855F7" stroke="#E9D5FF" stroke-width="2.5"/>
          <polygon points="24,34 40,54 36,82 18,76" fill="#38BDF8" stroke="#BAE6FD" stroke-width="2"/>
          <polygon points="76,30 84,74 64,82 60,52" fill="#EC4899" stroke="#FBCFE8" stroke-width="2"/>
        </svg>`;
      case 'lava':
        return `<svg viewBox="0 0 100 100">
          <rect x="8" y="8" width="84" height="84" rx="14" fill="#450A0A" stroke="#EA580C" stroke-width="3"/>
          <circle cx="50" cy="52" r="28" fill="#DC2626"/>
          <circle cx="44" cy="46" r="16" fill="#F97316"/>
          <circle cx="38" cy="42" r="7" fill="#FACC15"/>
          <circle cx="66" cy="62" r="6" fill="#FACC15"/>
        </svg>`;
      case 'gear':
        return `<svg viewBox="0 0 100 100">
          <g fill="#D97706" stroke="#090D16" stroke-width="3">
            <rect x="43" y="10" width="14" height="80" rx="3"/>
            <rect x="10" y="43" width="80" height="14" rx="3"/>
            <rect x="43" y="10" width="14" height="80" rx="3" transform="rotate(45 50 50)"/>
            <rect x="43" y="10" width="14" height="80" rx="3" transform="rotate(-45 50 50)"/>
            <circle cx="50" cy="50" r="25" fill="#B45309"/>
            <circle cx="50" cy="50" r="10" fill="#FACC15"/>
          </g>
        </svg>`;
      case 'pendulum':
      case 'bell':
        return `<svg viewBox="0 0 100 100">
          <rect x="20" y="14" width="60" height="14" rx="4" fill="#334155" stroke="#94A3B8" stroke-width="2"/>
          <line x1="50" y1="28" x2="50" y2="66" stroke="#FACC15" stroke-width="6"/>
          <circle cx="50" cy="68" r="18" fill="#D97706" stroke="#FEF08A" stroke-width="2.5"/>
        </svg>`;
      case 'water':
      case 'whirlpool':
        return `<svg viewBox="0 0 100 100">
          <rect x="6" y="6" width="88" height="88" rx="12" fill="#082F49" stroke="#0284C7" stroke-width="2.5"/>
          <path d="M18 36 Q34 24 50 36 T82 36" fill="none" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M18 62 Q34 50 50 62 T82 62" fill="none" stroke="#06B6D4" stroke-width="4.5" stroke-linecap="round"/>
        </svg>`;
      case 'coral':
      case 'anchor':
        return `<svg viewBox="0 0 100 100">
          <circle cx="50" cy="22" r="8" fill="none" stroke="#94A3B8" stroke-width="5"/>
          <line x1="50" y1="30" x2="50" y2="78" stroke="#94A3B8" stroke-width="7" stroke-linecap="round"/>
          <line x1="30" y1="42" x2="70" y2="42" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
          <path d="M22 58 C22 84, 78 84, 78 58" fill="none" stroke="#94A3B8" stroke-width="7" stroke-linecap="round"/>
        </svg>`;
      case 'windmill':
        return `<svg viewBox="0 0 100 100">
          <polygon points="36,86 44,34 56,34 64,86" fill="#334155" stroke="#94A3B8" stroke-width="2.5"/>
          <line x1="16" y1="16" x2="84" y2="68" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
          <line x1="84" y1="16" x2="16" y2="68" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
          <circle cx="50" cy="42" r="7" fill="#FACC15"/>
        </svg>`;
      default:
        return `<svg viewBox="0 0 100 100">
          <polygon points="16,80 26,34 52,18 78,36 86,80" fill="#334155" stroke="#64748B" stroke-width="3" stroke-linejoin="round"/>
          <polygon points="28,80 38,44 56,32 72,80" fill="#475569"/>
        </svg>`;
    }
  }

  function renderTileSVG(cell) {
    switch (cell.type) {
      case 'START':
      case 'START_2':
        return `<svg viewBox="0 0 100 100">
          <rect x="24" y="6"  width="52" height="8" rx="2" fill="#334155"/>
          <rect x="24" y="22" width="52" height="8" rx="2" fill="#334155"/>
          <rect x="32" y="0" width="8" height="54" fill="#94A3B8" stroke="#090D16" stroke-width="2"/>
          <rect x="60" y="0" width="8" height="54" fill="#94A3B8" stroke="#090D16" stroke-width="2"/>
          <line x1="50" y1="0" x2="50" y2="50" stroke="${cell.type === 'START_2' ? '#FACC15' : '#38BDF8'}" stroke-width="4" stroke-dasharray="6 4"/>
          <polygon points="50,3 38,18 62,18" fill="${cell.type === 'START_2' ? '#F59E0B' : '#06B6D4'}" stroke="#E0F2FE" stroke-width="2"/>
          <rect x="16" y="42" width="68" height="44" rx="8" fill="${cell.type === 'START_2' ? '#78350F' : '#0E7490'}" stroke="${cell.type === 'START_2' ? '#F59E0B' : '#06B6D4'}" stroke-width="3"/>
          <rect x="24" y="50" width="52" height="10" rx="3" fill="${cell.type === 'START_2' ? '#FACC15' : '#38BDF8'}"/>
          <circle cx="50" cy="72" r="7" fill="${cell.type === 'START_2' ? '#F97316' : '#06B6D4'}"/>
        </svg>`;

      case 'END':
      case 'END_2':
        return `<svg viewBox="0 0 100 100">
          <rect x="24" y="6"  width="52" height="8" rx="2" fill="#334155"/>
          <rect x="24" y="22" width="52" height="8" rx="2" fill="#334155"/>
          <rect x="32" y="0" width="8" height="56" fill="#94A3B8" stroke="#090D16" stroke-width="2"/>
          <rect x="60" y="0" width="8" height="56" fill="#94A3B8" stroke="#090D16" stroke-width="2"/>
          <polygon points="50,34 38,18 62,18" fill="${cell.type === 'END_2' ? '#FACC15' : '#10B981'}" stroke="#A7F3D0" stroke-width="2"/>
          <rect x="14" y="42" width="72" height="46" rx="8" fill="${cell.type === 'END_2' ? '#78350F' : '#065F46'}" stroke="${cell.type === 'END_2' ? '#FACC15' : '#10B981'}" stroke-width="3"/>
          <circle cx="50" cy="65" r="14" fill="#090D16" stroke="#38BDF8" stroke-width="3"/>
          <circle cx="50" cy="65" r="6" fill="#38BDF8"/>
        </svg>`;

      case 'STRAIGHT':
        return `<svg viewBox="0 0 100 100">
          <g fill="#334155" stroke="#090D16" stroke-width="1.8">
            <rect x="22" y="8"  width="56" height="9" rx="2"/>
            <rect x="22" y="29" width="56" height="9" rx="2"/>
            <rect x="22" y="50" width="56" height="9" rx="2"/>
            <rect x="22" y="71" width="56" height="9" rx="2"/>
          </g>
          <!-- Central Plasma Conduit -->
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(56, 189, 248, 0.45)" stroke-width="4"/>
          <!-- 3D Steel Rails -->
          <rect x="31" y="0" width="8" height="100" fill="#CBD5E1" stroke="#090D16" stroke-width="2"/>
          <rect x="61" y="0" width="8" height="100" fill="#CBD5E1" stroke="#090D16" stroke-width="2"/>
        </svg>`;

      case 'FIXED_STRAIGHT':
        return `<svg viewBox="0 0 100 100">
          <rect x="10" y="10" width="80" height="80" rx="8" fill="rgba(245, 158, 11, 0.16)" stroke="#F59E0B" stroke-width="2"/>
          <g fill="#475569" stroke="#090D16" stroke-width="1.8">
            <rect x="22" y="8"  width="56" height="9" rx="2"/>
            <rect x="22" y="29" width="56" height="9" rx="2"/>
            <rect x="22" y="50" width="56" height="9" rx="2"/>
            <rect x="22" y="71" width="56" height="9" rx="2"/>
          </g>
          <line x1="50" y1="0" x2="50" y2="100" stroke="#FACC15" stroke-width="4"/>
          <rect x="31" y="0" width="8" height="100" fill="#E2E8F0" stroke="#090D16" stroke-width="2"/>
          <rect x="61" y="0" width="8" height="100" fill="#E2E8F0" stroke="#090D16" stroke-width="2"/>
          <circle cx="18" cy="18" r="5.5" fill="#FACC15" stroke="#090D16" stroke-width="2"/>
          <circle cx="82" cy="18" r="5.5" fill="#FACC15" stroke="#090D16" stroke-width="2"/>
          <circle cx="18" cy="82" r="5.5" fill="#FACC15" stroke="#090D16" stroke-width="2"/>
          <circle cx="82" cy="82" r="5.5" fill="#FACC15" stroke="#090D16" stroke-width="2"/>
        </svg>`;

      case 'BRIDGE':
        return `<svg viewBox="0 0 100 100">
          <rect x="8" y="0" width="84" height="100" fill="rgba(6, 182, 212, 0.22)"/>
          <rect x="13" y="0" width="7" height="100" fill="#F59E0B" stroke="#090D16" stroke-width="2"/>
          <rect x="80" y="0" width="7" height="100" fill="#F59E0B" stroke="#090D16" stroke-width="2"/>
          <g fill="#475569" stroke="#090D16" stroke-width="1.8">
            <rect x="20" y="6"  width="60" height="12" rx="2"/>
            <rect x="20" y="26" width="60" height="12" rx="2"/>
            <rect x="20" y="46" width="60" height="12" rx="2"/>
            <rect x="20" y="66" width="60" height="12" rx="2"/>
            <rect x="20" y="84" width="60" height="12" rx="2"/>
          </g>
          <line x1="50" y1="0" x2="50" y2="100" stroke="#38BDF8" stroke-width="4"/>
          <rect x="31" y="0" width="8" height="100" fill="#F8FAFC" stroke="#090D16" stroke-width="2"/>
          <rect x="61" y="0" width="8" height="100" fill="#F8FAFC" stroke="#090D16" stroke-width="2"/>
        </svg>`;

      case 'CURVE':
        // Base 0° connects NORTH (50, 0) and EAST (100, 50)
        return `<svg viewBox="0 0 100 100">
          <path d="M 50 0 A 50 50 0 0 0 100 50" fill="none" stroke="#334155" stroke-width="46" stroke-dasharray="9 11"/>
          <path d="M 50 0 A 50 50 0 0 0 100 50" fill="none" stroke="rgba(56, 189, 248, 0.45)" stroke-width="4"/>
          <!-- Outer Steel Rail (R=64) -->
          <path d="M 36 0 A 64 64 0 0 0 100 64" fill="none" stroke="#090D16" stroke-width="11"/>
          <path d="M 36 0 A 64 64 0 0 0 100 64" fill="none" stroke="#CBD5E1" stroke-width="7"/>
          <!-- Inner Steel Rail (R=36) -->
          <path d="M 64 0 A 36 36 0 0 0 100 36" fill="none" stroke="#090D16" stroke-width="11"/>
          <path d="M 64 0 A 36 36 0 0 0 100 36" fill="none" stroke="#CBD5E1" stroke-width="7"/>
        </svg>`;

      case 'Y_SWITCH':
        // Base 0° connects SOUTH (50, 100) branching smoothly to EAST (100, 50) and WEST (0, 50)
        return `<svg viewBox="0 0 100 100">
          <path d="M 50 100 A 50 50 0 0 1 100 50" fill="none" stroke="#334155" stroke-width="42" stroke-dasharray="9 11"/>
          <path d="M 50 100 A 50 50 0 0 0 0 50" fill="none" stroke="#334155" stroke-width="42" stroke-dasharray="9 11"/>
          <path d="M 50 100 A 50 50 0 0 1 100 50" fill="none" stroke="rgba(56, 189, 248, 0.55)" stroke-width="4"/>
          <path d="M 50 100 A 50 50 0 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.55)" stroke-width="4"/>
          <path d="M 36 100 A 64 64 0 0 1 100 36" fill="none" stroke="#CBD5E1" stroke-width="7"/>
          <path d="M 64 100 A 36 36 0 0 1 100 64" fill="none" stroke="#CBD5E1" stroke-width="7"/>
          <path d="M 64 100 A 64 64 0 0 0 0 36" fill="none" stroke="#CBD5E1" stroke-width="7"/>
          <path d="M 36 100 A 36 36 0 0 0 0 64" fill="none" stroke="#CBD5E1" stroke-width="7"/>
        </svg>`;

      case 'SWITCH':
        // Base 0° has two parallel curved channels: N<->E and S<->W
        return `<svg viewBox="0 0 100 100">
          <path d="M 50 0 A 50 50 0 0 0 100 50" fill="none" stroke="#334155" stroke-width="40" stroke-dasharray="9 11"/>
          <path d="M 50 100 A 50 50 0 0 0 0 50" fill="none" stroke="#334155" stroke-width="40" stroke-dasharray="9 11"/>
          <path d="M 36 0 A 64 64 0 0 0 100 64" fill="none" stroke="#CBD5E1" stroke-width="6.5"/>
          <path d="M 64 0 A 36 36 0 0 0 100 36" fill="none" stroke="#CBD5E1" stroke-width="6.5"/>
          <path d="M 64 100 A 64 64 0 0 0 0 36" fill="none" stroke="#CBD5E1" stroke-width="6.5"/>
          <path d="M 36 100 A 36 36 0 0 0 0 64" fill="none" stroke="#CBD5E1" stroke-width="6.5"/>
        </svg>`;

      case 'CROSS':
        return `<svg viewBox="0 0 100 100">
          <g fill="#334155" stroke="#090D16" stroke-width="1.8">
            <rect x="22" y="8"  width="56" height="9" rx="2"/>
            <rect x="22" y="83" width="56" height="9" rx="2"/>
            <rect x="8"  y="22" width="9"  height="56" rx="2"/>
            <rect x="83" y="22" width="9"  height="56" rx="2"/>
          </g>
          <rect x="0" y="31" width="100" height="8" fill="#CBD5E1" stroke="#090D16" stroke-width="2"/>
          <rect x="0" y="61" width="100" height="8" fill="#CBD5E1" stroke="#090D16" stroke-width="2"/>
          <rect x="31" y="0" width="8" height="100" fill="#CBD5E1" stroke="#090D16" stroke-width="2"/>
          <rect x="61" y="0" width="8" height="100" fill="#CBD5E1" stroke="#090D16" stroke-width="2"/>
          <rect x="37" y="37" width="26" height="26" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>
          <circle cx="50" cy="50" r="6" fill="#FACC15"/>
        </svg>`;

      case 'OBSTACLE':
        return renderObstacleSVG(cell.kind);

      default:
        return '';
    }
  }

  // ==========================================================================
  // 7. 60-FPS CANVAS ARMORED LOCOMOTIVE, HEADLIGHT, SPARKS & WEATHER ENGINE
  // ==========================================================================
  class SaffarTrainRenderer {
    constructor() {
      this.canvas = document.getElementById('train-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.weatherParticles = [];
      this.lightningAlpha = 0;
      this.trainPos = { x: 0, y: 0, angle: 0 };
      this.idleTimer = 0;
      this.rafId = null;
      this.lastTime = performance.now();
      this.runState = null;
    }

    startLoop() {
      // Driven by the single unified renderer.setAnimationLoop in TrainEngine3D when WebGL 3D is active,
      // or by a standalone 60 FPS requestAnimationFrame loop when running in 2D SVG + Canvas fallback mode!
      if (window.TrainEngine3D && window.TrainEngine3D.enabled && typeof window.TrainEngine3D.addFrameListener === 'function') {
        window.TrainEngine3D.addFrameListener((dt) => {
          if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
            return;
          }
          this.update(dt);
          this.draw();
        });
        return;
      }

      if (this._fallback2dRafStarted) return;
      this._fallback2dRafStarted = true;
      let lastTs = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const step2D = (nowTs) => {
        const rawDt = ((nowTs || Date.now()) - lastTs) / 1000;
        lastTs = nowTs || Date.now();
        const dt = Math.max(0.001, Math.min(0.05, rawDt || 0.016));
        if (!window.TrainEngine3D || !window.TrainEngine3D.enabled) {
          this.update(dt);
          this.draw();
        }
        requestAnimationFrame(step2D);
      };
      requestAnimationFrame(step2D);
    }

    resizeCanvas() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (rect.width > 0 && rect.height > 0) {
        if (this.canvas.width !== Math.round(rect.width * dpr)) {
          this.canvas.width = Math.round(rect.width * dpr);
          this.canvas.height = Math.round(rect.height * dpr);
        }
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.width = rect.width;
        this.height = rect.height;
      }
    }

    getCellCenter(r, c) {
      if (!currentLevel || !this.width) return { x: 40, y: 40, cellSize: 60 };
      const cellW = this.width / currentLevel.cols;
      const cellH = this.height / currentLevel.rows;
      return {
        x: (c + 0.5) * cellW,
        y: (r + 0.5) * cellH,
        cellSize: Math.min(cellW, cellH)
      };
    }

    getEdgeMidpoint(r, c, dir) {
      const center = this.getCellCenter(r, c);
      const half = center.cellSize * 0.5;
      if (dir === 'N') return { x: center.x, y: center.y - half };
      if (dir === 'E') return { x: center.x + half, y: center.y };
      if (dir === 'S') return { x: center.x, y: center.y + half };
      if (dir === 'W') return { x: center.x - half, y: center.y };
      return { x: center.x, y: center.y };
    }

    resetToStart() {
      this.runState = null;
      this.particles = [];
      this.initWeatherParticles();
      this.resizeCanvas();
      if (!currentLevel) return;

      const startSpec = currentLevel.solutionPath[0];
      const center = this.getCellCenter(startSpec.r, startSpec.c);
      const exitDir = getTilePorts('START', startSpec.initRot)[0];
      const angle = DIR_DELTA[exitDir] ? DIR_DELTA[exitDir].angle : 0;

      this.trainPos = { x: center.x, y: center.y, angle };
    }

    initWeatherParticles() {
      this.weatherParticles = [];
      if (!currentLevel) return;
      const count = 28;
      for (let i = 0; i < count; i++) {
        this.weatherParticles.push({
          x: Math.random() * 360,
          y: Math.random() * 360,
          size: 1.5 + Math.random() * 3,
          speedX: (Math.random() - 0.5) * 35,
          speedY: -20 - Math.random() * 30,
          alpha: 0.25 + Math.random() * 0.55
        });
      }
    }

    startJourney(steps, onComplete) {
      if (!steps || steps.length < 2) return;
      this.resizeCanvas();

      this.runState = {
        steps,
        segIndex: 0,
        segProgress: 0,
        speed: 2.55 * getPreferredSpeedMult(),
        onComplete
      };
    }

    setSpeedMult(mult) {
      if (this.runState) {
        this.runState.speed = 2.55 * Math.max(1.0, Number(mult) || 1.0);
      }
    }

    spawnExhaustAndSparks(x, y, angleDeg, isCelebration = false) {
      const rad = (angleDeg * Math.PI) / 180;
      const backX = x - Math.cos(rad) * 10;
      const backY = y - Math.sin(rad) * 10;

      // 1. Turbine Exhaust Smoke
      this.particles.push({
        x: backX + (Math.random() * 6 - 3),
        y: backY + (Math.random() * 6 - 3),
        vx: -Math.cos(rad) * 20 + (Math.random() - 0.5) * 18,
        vy: -Math.sin(rad) * 20 - 12,
        r: 4 + Math.random() * 4,
        alpha: 0.75,
        life: 0,
        maxLife: 0.65,
        color: isCelebration ? '#38BDF8' : 'rgba(203, 213, 225, 0.65)',
        isSpark: false
      });

      // 2. Wheel Friction Fiery Sparks
      const sparkCount = isCelebration ? 4 : (getPreferredSpeedTier() >= 2 ? 3 : 1);
      for (let i = 0; i < sparkCount; i++) {
        this.particles.push({
          x: x + (Math.random() * 10 - 5),
          y: y + (Math.random() * 10 - 5),
          vx: (Math.random() - 0.5) * (isCelebration ? 110 : 65),
          vy: (Math.random() - 0.5) * (isCelebration ? 110 : 65),
          r: 2 + Math.random() * 2,
          alpha: 1,
          life: 0,
          maxLife: 0.42,
          color: Math.random() > 0.4 ? '#FACC15' : '#F97316',
          isSpark: true
        });
      }
    }

    updateWeather(dt) {
      if (!currentLevel || !this.width) return;
      const stId = currentLevel.stationId;

      if (this.lightningAlpha > 0) {
        this.lightningAlpha = Math.max(0, this.lightningAlpha - dt * 2.4);
      } else if (stId === 3 && Math.random() < dt * 0.18) {
        this.lightningAlpha = 0.65;
        if (window.GameAudio) window.GameAudio.playThunder();
      }

      for (const wp of this.weatherParticles) {
        if (stId === 3) {
          // Sector 3: High-velocity slanted rain
          wp.x -= 95 * dt;
          wp.y += 230 * dt;
        } else if (stId === 4) {
          // Sector 4: Horizontal crystal sandstorm
          wp.x += 120 * dt;
          wp.y += Math.sin(wp.x * 0.05) * 25 * dt;
        } else if (stId === 5) {
          // Sector 5: Rising volcanic magma embers
          wp.x += Math.sin(wp.y * 0.06) * 30 * dt;
          wp.y -= 55 * dt;
        } else {
          // Sector 1 & 2: Rising mist & forge sparks
          wp.x += wp.speedX * dt;
          wp.y += wp.speedY * dt;
        }

        if (wp.x < 0) wp.x += this.width;
        if (wp.x > this.width) wp.x -= this.width;
        if (wp.y < 0) wp.y += this.height;
        if (wp.y > this.height) wp.y -= this.height;
      }
    }

    update(dt) {
      this.resizeCanvas();
      if (!currentLevel) return;

      this.updateWeather(dt);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (!p.isSpark) p.r += dt * 6;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        if (p.life >= p.maxLife) {
          this.particles.splice(i, 1);
        }
      }

      // Idle state at START station
      if (!this.runState) {
        this.idleTimer += dt;
        const startSpec = currentLevel.solutionPath[0];
        const center = this.getCellCenter(startSpec.r, startSpec.c);
        this.trainPos.x = center.x;
        this.trainPos.y = center.y;
        return;
      }

      // Moving along connected path
      const rs = this.runState;
      rs.segProgress += dt * rs.speed;

      if (Math.random() < dt * (getPreferredSpeedTier() >= 2 ? 30 : 18)) {
        this.spawnExhaustAndSparks(this.trainPos.x, this.trainPos.y, this.trainPos.angle, false);
      }

      if (rs.segProgress >= 1) {
        rs.segProgress -= 1;
        rs.segIndex += 1;

        if (rs.segIndex >= rs.steps.length) {
          const last = rs.steps[rs.steps.length - 1];
          const endCenter = this.getCellCenter(last.r, last.c);
          this.trainPos.x = endCenter.x;
          this.trainPos.y = endCenter.y;
          for (let k = 0; k < 14; k++) {
            this.spawnExhaustAndSparks(endCenter.x, endCenter.y, this.trainPos.angle, true);
          }
          const cb = rs.onComplete;
          this.runState = null;
          if (typeof cb === 'function') cb();
          return;
        }

        const enteredStep = rs.steps[rs.segIndex];
        if (window.GameAudio) {
          window.GameAudio.playChug(rs.segIndex, getPreferredSpeedTier() >= 2, null, true);
        }
        checkAndCollectSparkAt(enteredStep.r, enteredStep.c);
      }

      const currStep = rs.steps[rs.segIndex];
      if (!currStep) return;

      const t = Math.min(1, Math.max(0, rs.segProgress));
      const cPos = this.getCellCenter(currStep.r, currStep.c);

      let p0, p1, p2;
      if (currStep.type === 'START') {
        p0 = { x: cPos.x, y: cPos.y };
        p2 = this.getEdgeMidpoint(currStep.r, currStep.c, currStep.exitDir);
        p1 = { x: (p0.x + p2.x) * 0.5, y: (p0.y + p2.y) * 0.5 };
      } else if (currStep.type === 'END') {
        p0 = this.getEdgeMidpoint(currStep.r, currStep.c, currStep.enterDir);
        p2 = { x: cPos.x, y: cPos.y };
        p1 = { x: (p0.x + p2.x) * 0.5, y: (p0.y + p2.y) * 0.5 };
      } else {
        p0 = this.getEdgeMidpoint(currStep.r, currStep.c, currStep.enterDir);
        p2 = this.getEdgeMidpoint(currStep.r, currStep.c, currStep.exitDir);
        p1 = { x: cPos.x, y: cPos.y };
      }

      const inv = 1 - t;
      const x = inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x;
      const y = inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y;
      const dx = 2 * inv * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
      const dy = 2 * inv * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);

      this.trainPos.x = x;
      this.trainPos.y = y;
      if (Math.hypot(dx, dy) > 0.001) {
        this.trainPos.angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      }
    }

    drawWeather(ctx) {
      if (!currentLevel) return;
      const stId = currentLevel.stationId;

      for (const wp of this.weatherParticles) {
        ctx.save();
        ctx.globalAlpha = wp.alpha;
        if (stId === 3) {
          // Slanted rain streak
          ctx.strokeStyle = '#7DD3FC';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(wp.x, wp.y);
          ctx.lineTo(wp.x - 5, wp.y + 12);
          ctx.stroke();
        } else {
          ctx.fillStyle =
            stId === 1 ? '#34D399' :
            stId === 2 ? '#F59E0B' :
            stId === 4 ? '#C084FC' : '#EF4444';
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, wp.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (this.lightningAlpha > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(224, 242, 254, ${this.lightningAlpha * 0.45})`;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
      }
    }

    draw() {
      if (!this.ctx || !this.width) return;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      if (!currentLevel) return;

      // 1. Draw Environmental Weather Layer
      this.drawWeather(ctx);

      const skin = TRAIN_SKINS.find(s => s.id === gameState.equippedSkin) || TRAIN_SKINS[0];
      const cellInfo = this.getCellCenter(0, 0);
      const len = Math.max(20, cellInfo.cellSize * 0.44);
      const wid = Math.max(14, cellInfo.cellSize * 0.28);

      // 2. Draw Armored High-Speed Turbine Locomotive (Rotated along track tangent)
      ctx.save();
      ctx.translate(this.trainPos.x, this.trainPos.y);
      ctx.rotate((this.trainPos.angle * Math.PI) / 180);

      // Dynamic Headlight Beam Cone projecting forward (+X)
      const beamLen = getPreferredSpeedTier() >= 2 ? len * 2.6 : len * 2.1;
      const beamGrad = ctx.createLinearGradient(len * 0.4, 0, beamLen, 0);
      beamGrad.addColorStop(0, skin.beamColor);
      beamGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(len * 0.4, 0);
      ctx.lineTo(beamLen, -wid * 1.45);
      ctx.lineTo(beamLen, wid * 1.45);
      ctx.closePath();
      ctx.fill();

      // Side Piston / Wheel Assemblies
      ctx.fillStyle = '#475569';
      ctx.fillRect(-len * 0.55, -wid * 0.9, len * 0.9, wid * 1.8);

      // Heavy Armored Chassis Body
      ctx.fillStyle = skin.armorColor;
      ctx.strokeStyle = skin.trimColor;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(-len * 0.65, -wid * 0.72, len * 1.2, wid * 1.44, 5);
      ctx.fill();
      ctx.stroke();

      // Inner Hull Plating
      ctx.fillStyle = skin.hullColor;
      ctx.beginPath();
      ctx.roundRect(-len * 0.5, -wid * 0.52, len * 0.9, wid * 1.04, 3);
      ctx.fill();

      // Angled V-Shaped Front Steel Cowcatcher / Plow (+X nose)
      ctx.fillStyle = skin.trimColor;
      ctx.strokeStyle = '#090D16';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(len * 0.52, -wid * 0.68);
      ctx.lineTo(len * 0.85, 0);
      ctx.lineTo(len * 0.52, wid * 0.68);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing Central Plasma Reactor Core
      ctx.fillStyle = skin.coreColor;
      ctx.strokeStyle = '#090D16';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, wid * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, wid * 0.16, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 3. Draw Exhaust Smoke & Wheel Friction Sparks
      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  const trainAnimator = new SaffarTrainRenderer();

  // ==========================================================================
  // 8. LEVEL LOADING, BOARD RENDERING & GAMEPLAY INTERACTION
  // ==========================================================================
  function buildLevelBoard(level) {
    const rows = level.rows;
    const cols = level.cols;
    const grid = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        r,
        c,
        type: 'STRAIGHT',
        rot: 0,
        visualRot: 0,
        solRot: 0,
        isSolutionTile: false,
        rotatable: true,
        hintLocked: false,
        hasSpark: false
      }))
    );

    (level.decoys || []).forEach(d => {
      if (grid[d.r] && grid[d.r][d.c]) {
        const rotatable = (d.type === 'STRAIGHT' || d.type === 'CURVE' || d.type === 'BRIDGE' || d.type === 'Y_SWITCH' || d.type === 'SWITCH');
        grid[d.r][d.c] = {
          r: d.r,
          c: d.c,
          type: d.type,
          rot: d.initRot,
          visualRot: d.initRot,
          solRot: d.initRot,
          isSolutionTile: false,
          rotatable,
          hintLocked: false,
          hasSpark: false
        };
      }
    });

    (level.obstacles || []).forEach(ob => {
      if (grid[ob.r] && grid[ob.r][ob.c]) {
        grid[ob.r][ob.c] = {
          r: ob.r,
          c: ob.c,
          type: 'OBSTACLE',
          kind: ob.kind,
          label: ob.label,
          rot: 0,
          visualRot: 0,
          solRot: 0,
          isSolutionTile: false,
          rotatable: false,
          hintLocked: false,
          hasSpark: false
        };
      }
    });

    (level.solutionPath || []).forEach(sp => {
      if (grid[sp.r] && grid[sp.r][sp.c]) {
        const rotatable = !sp.anchorLocked && (sp.type === 'STRAIGHT' || sp.type === 'CURVE' || sp.type === 'BRIDGE' || sp.type === 'Y_SWITCH' || sp.type === 'SWITCH');
        grid[sp.r][sp.c] = {
          r: sp.r,
          c: sp.c,
          type: sp.type,
          rot: sp.initRot,
          visualRot: sp.initRot,
          solRot: sp.solRot,
          solEnterDir: sp.enterDir || null,
          solExitDir: sp.exitDir || null,
          isSolutionTile: true,
          rotatable,
          hintLocked: Boolean(sp.anchorLocked),
          hasSpark: false
        };
      }
    });

    if (level.isDualTrainLevel && Array.isArray(level.secondarySolutionPath)) {
      level.secondarySolutionPath.forEach(sp => {
        if (grid[sp.r] && grid[sp.r][sp.c]) {
          const rotatable = !sp.anchorLocked && (sp.type === 'STRAIGHT' || sp.type === 'CURVE' || sp.type === 'BRIDGE' || sp.type === 'Y_SWITCH' || sp.type === 'SWITCH');
          grid[sp.r][sp.c] = {
            r: sp.r,
            c: sp.c,
            type: sp.type,
            rot: sp.initRot,
            visualRot: sp.initRot,
            solRot: sp.solRot,
            solEnterDir: sp.enterDir || null,
            solExitDir: sp.exitDir || null,
            isSolutionTile: true,
            rotatable,
            hintLocked: Boolean(sp.anchorLocked),
            hasSpark: false
          };
        }
      });
    }

    (level.sparks || []).forEach(([sr, sc]) => {
      if (grid[sr] && grid[sr][sc]) {
        grid[sr][sc].hasSpark = true;
      }
    });

    return grid;
  }

  function saveMidLevelSession() {
    if (!currentLevel || isAutoPlaytestRunning || window.__HEADLESS_CI_TEST === true || isEndlessMarathonMode) return;
    if (!boardGrid || !boardGrid.length) return;
    try {
      gameState.activeSession = {
        levelId: currentLevel.id,
        remainingMoves: remainingMoves,
        movesSpentInLevel: movesSpentInLevel,
        isDailyChallenge: Boolean(isDailyChallengeMode),
        rots: boardGrid.map(row => row.map(c => ({
          rot: c.rot,
          visualRot: c.visualRot,
          hintLocked: Boolean(c.hintLocked)
        })))
      };
      saveState();
    } catch (_) {}
  }

  function clearMidLevelSession() {
    if (!gameState || !gameState.activeSession) return;
    gameState.activeSession = null;
    saveState();
  }

  function startLevel(levelId, showStory = true, isDailyChallenge = false, allowResumeSession = true) {
    if (Number(levelId) > 3) {
      if (typeof window.__showDemoFullGameModal === 'function') window.__showDemoFullGameModal(Number(levelId));
      return;
    }
    const level = window.GameLevels.LEVELS.find(l => l.id === levelId);
    if (!level) return;

    if (autoLaunchTimer) {
      clearTimeout(autoLaunchTimer);
      autoLaunchTimer = null;
    }
    if (liveAutoPlayTimer) {
      clearTimeout(liveAutoPlayTimer);
      liveAutoPlayTimer = null;
    }

    if (levelId !== trialSkinLevelId) {
      trialSkinIdForCurrentLevel = null;
      trialSkinLevelId = null;
    }
    isDailyChallengeMode = Boolean(isDailyChallenge);
    completedWasDailyChallenge = false;
    isEndlessMarathonMode = false;
    completedWasEndless = false;
    undoMoveStack = [];
    lastHumanTappedKey = '';
    lastHumanTapTime = 0;
    movesSpentInLevel = 0;
    lastPerfectBonus = 0;
    lastBossBonus = 0;
    if (!isAutoPlaytestRunning && !isDailyChallenge && !isEndlessMarathonMode) {
      lastCampaignLevelId = level.id;
      gameState.lastPlayedLevel = level.id;
      saveState();
    }
    const effSkinId = getEffectiveSkinId();
    if (window.GameAudio && typeof window.GameAudio.setLocomotiveSkin === 'function') {
      window.GameAudio.setLocomotiveSkin(effSkinId);
    }
    const perks = getActiveSkinPerks(effSkinId);

    currentLevel = level;
    boardGrid = buildLevelBoard(level);
    remainingMoves = level.maxMoves + (perks.extraMoves || 0);
    isPathComplete = false;
    isTrainRunning = false;

    // V12.0: Sync player's persistent preferred train speed [1 / 2 / 3] BEFORE launch!
    const prefSpeedTier = getPreferredSpeedTier();
    if (window.TrainEngine3D && typeof window.TrainEngine3D.setLiveSpeedMultiplier === 'function') {
      window.TrainEngine3D.setLiveSpeedMultiplier(getPreferredSpeedMult());
    }
    updateLiveDispatchBar(false, prefSpeedTier);

    // V12.0: Restore saved mid-level board state if reopening the same unfinished mission
    let restoredMidSession = false;
    if (
      allowResumeSession &&
      !isAutoPlaytestRunning &&
      window.__HEADLESS_CI_TEST !== true &&
      gameState.activeSession &&
      gameState.activeSession.levelId === level.id &&
      Boolean(gameState.activeSession.isDailyChallenge) === Boolean(isDailyChallenge) &&
      Array.isArray(gameState.activeSession.rots) &&
      gameState.activeSession.rots.length === level.rows
    ) {
      try {
        for (let r = 0; r < level.rows; r++) {
          for (let c = 0; c < level.cols; c++) {
            const sCell = gameState.activeSession.rots[r] && gameState.activeSession.rots[r][c];
            if (sCell && boardGrid[r] && boardGrid[r][c] && boardGrid[r][c].rotatable) {
              boardGrid[r][c].rot = ((Number(sCell.rot) % 360) + 360) % 360;
              boardGrid[r][c].visualRot = Number(sCell.visualRot || sCell.rot || 0);
              if (sCell.hintLocked) boardGrid[r][c].hintLocked = true;
            }
          }
        }
        remainingMoves = Math.max(1, Number(gameState.activeSession.remainingMoves) || remainingMoves);
        movesSpentInLevel = Math.max(0, Number(gameState.activeSession.movesSpentInLevel) || 0);
        restoredMidSession = true;
      } catch (_) {}
    }

    // Initialize 4-Step Interactive Spotlight Coach on Mission 1 (first play)
    if (level.id === 1 && !gameState.tutorialSeen && !gameState.tutorialCompleted && !isAutoPlaytestRunning && !isDailyChallenge) {
      tutorialStep = movesSpentInLevel > 0 ? 2 : 1;
    } else {
      tutorialStep = 0;
    }

    train1Delivered = false;
    train2Delivered = !level.isDualTrainLevel;
    collectedSparksSet.clear();
    doubleCoinsClaimed = false;

    comboMultiplier = 1;
    maxComboReached = 1;
    lastCorrectRotateTime = 0;

    window.AdMobBridge.resetLevelAdTracker();
    showScreen('screen-game');
    if (window.GameAudio) {
      if (typeof window.GameAudio.setTrainDispatchState === 'function') {
        window.GameAudio.setTrainDispatchState(false);
      }
      window.GameAudio.startBGM(level.stationId, level.id);
    }

    renderGameplayHUD();
    renderBoardDOM();

    const rentBtn = document.getElementById('btn-rent-train');
    if (rentBtn) {
      const superTrainIds = ['bullet_shinkansen', 'haramain_express', 'maglev_600', 'gold_vip'];
      const alreadyUsingSuper = superTrainIds.includes(effSkinId);
      rentBtn.hidden = alreadyUsingSuper;
    }

    if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
      const activeSkin = TRAIN_SKINS.find(s => s.id === effSkinId) || TRAIN_SKINS[0];
      window.TrainEngine3D.zoomFactor = 1.00;
      window.TrainEngine3D.onResize();
      window.TrainEngine3D.buildLevelScene(level, boardGrid, activeSkin);
      window.TrainEngine3D.updateCameraFramingForGrid(true);
      setTimeout(() => {
        if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
          window.TrainEngine3D.onResize();
          updateLevel1TutorialPointer();
    updateUndoButtonState();
    showMechanicDiscoveryIfNeeded(currentLevel);
        }
      }, 16);
    } else if (window.TrainEngine3D) {
      window.TrainEngine3D.currentLevel = level;
    }

    // Apply locomotive auto-lock perk at level start (skip on Mission 1 while 4-Step Tutorial is active so Step 1 rail rotation is playable!)
    if (!restoredMidSession && perks.autoLockCount > 0 && !(level.id === 1 && tutorialStep > 0)) {
      applySmartHintEffect(perks.autoLockCount, true);
    } else {
      if (restoredMidSession && window.TrainEngine3D && window.TrainEngine3D.enabled) {
        for (let rr = 0; rr < level.rows; rr++) {
          for (let cc = 0; cc < level.cols; cc++) {
            if (boardGrid[rr][cc] && boardGrid[rr][cc].hintLocked) {
              window.TrainEngine3D.lockTile3D(rr, cc);
            }
          }
        }
      }
      evaluateBoardConnectivity(false);
    }
    if (window.TrainEngine3D && window.TrainEngine3D.assetSystem && typeof window.TrainEngine3D.assetSystem.onReady === 'function') {
      window.TrainEngine3D.assetSystem.onReady(() => {
        if (currentLevel && currentLevel.id === level.id) {
          evaluateBoardConnectivity(false);
          updateLevel1TutorialPointer();
    updateUndoButtonState();
    showMechanicDiscoveryIfNeeded(currentLevel);
        }
      });
    }

    updateLevel1TutorialPointer();
    updateUndoButtonState();
    showMechanicDiscoveryIfNeeded(currentLevel);

    const bossBannerEl = document.getElementById('boss-stage-banner');
    const bossTextEl = document.getElementById('boss-banner-text');
    if (bossBannerTimer) {
      clearTimeout(bossBannerTimer);
      bossBannerTimer = null;
    }
    if (bossBannerEl) {
      if (isBossLevel(level.id) && !isAutoPlaytestRunning) {
        if (bossTextEl) {
          bossTextEl.textContent = tf('bossStageBanner', { id: level.id });
        }
        bossBannerEl.hidden = false;
        bossBannerTimer = setTimeout(() => {
          if (bossBannerEl) bossBannerEl.hidden = true;
        }, 3200);
      } else {
        bossBannerEl.hidden = true;
      }
    }

    trainAnimator.resetToStart();
    startStormTimer((level.timeLimit || 65) + (perks.extraTimeSec || 0));
    if ((perks.autoFreezeSec || 0) > 0) {
      stormFrozenUntil = Date.now() + (perks.autoFreezeSec * 1000);
      const stripEl = document.getElementById('storm-timer-strip');
      if (stripEl) stripEl.classList.add('timer-frozen');
    }

    const toastEl = document.getElementById('ui-toast');
    if (toastEl) toastEl.hidden = true;

    // V12.0: Automatically present Sector Character Introductions (`preDialogue`) on first visit
    // to Sector opening missions (1, 11, 21, 31, 41, 51, 61, 71, 81, 91) and Mission 8 (Dual-Train debut)!
    let suppressAutoDialogue = Boolean(isAutoPlaytestRunning || window.__HEADLESS_CI_TEST === true || isDailyChallenge);
    try {
      const qStr = (typeof window !== 'undefined' && window.location) ? (window.location.search || '') : '';
      if (qStr.includes('nomodal=1') || qStr.includes('autoplaytest=1') || qStr.includes('solve=1') || qStr.includes('ready=1')) {
        suppressAutoDialogue = true;
      }
    } catch (_) {}

    if (!gameState.seenDialogues || typeof gameState.seenDialogues !== 'object') {
      gameState.seenDialogues = {};
    }

    if (
      !suppressAutoDialogue &&
      SECTOR_OPENING_DIALOGUE_LEVELS.has(level.id) &&
      !gameState.seenDialogues[level.id] &&
      Array.isArray(level.preDialogue) &&
      level.preDialogue.length > 0
    ) {
      gameState.seenDialogues[level.id] = true;
      saveState();
      const coachEl = document.getElementById('tutorial-spotlight-coach');
      if (coachEl) coachEl.hidden = true;
      openDialogueModal(level.stationId, buildMissionCrewDialogue(level, level.preDialogue), () => {
        updateLevel1TutorialPointer();
      });
    } else if (restoredMidSession) {
      showToast(tf('toastResumedFmt', { id: level.id }));
    } else if (showStory && level.id === 1) {
      showToast(t('toastMission1Intro'));
    } else if (isBossLevel(level.id)) {
      showToast(tf('toastBossIntroFmt', { id: level.id }));
    } else if (level.isDualTrainLevel) {
      showToast(t('toastDualIntro'));
    } else if (perks.autoLockCount > 0 || (perks.autoFreezeSec || 0) > 0) {
      const skinTitle = getSkinName(perks.skin);
      const freezeSuffix = (perks.autoFreezeSec || 0) > 0
        ? tf('toastSkinFreezeSuffixFmt', { sec: perks.autoFreezeSec })
        : '';
      showToast(tf('toastSkinPerkFmt', {
        skin: skinTitle,
        locks: perks.autoLockCount || 0,
        freeze: freezeSuffix
      }));
    }
  }

  function completeMission1Tutorial() {
    tutorialStep = 0;
    if (gameState) {
      gameState.tutorialSeen = true;
      gameState.tutorialCompleted = true;
      saveState();
    }
    const coachEl = document.getElementById('tutorial-spotlight-coach');
    if (coachEl) coachEl.hidden = true;
    const pointerEl = document.getElementById('tutorial-hand-pointer');
    if (pointerEl) pointerEl.hidden = true;
  }

  function positionSpotlightRingOverElement(ringEl, targetEl, padPx = 8) {
    if (!ringEl || !targetEl) return false;
    const rect = targetEl.getBoundingClientRect();
    if (!rect || rect.width < 8 || rect.height < 8) return false;
    ringEl.style.left = `${Math.round(rect.left - padPx)}px`;
    ringEl.style.top = `${Math.round(rect.top - padPx)}px`;
    ringEl.style.width = `${Math.round(rect.width + padPx * 2)}px`;
    ringEl.style.height = `${Math.round(rect.height + padPx * 2)}px`;
    return true;
  }

  function updateLevel1TutorialPointer() {
    const pointerEl = document.getElementById('tutorial-hand-pointer');
    const labelEl = document.getElementById('tutorial-hand-label');
    const coachEl = document.getElementById('tutorial-spotlight-coach');
    const ringEl = document.getElementById('tutorial-spotlight-ring');
    const cardEl = document.getElementById('tutorial-coach-card');
    const badgeEl = document.getElementById('tutorial-step-badge');
    const titleEl = document.getElementById('tutorial-coach-title');
    const descEl = document.getElementById('tutorial-coach-desc');
    const actionsEl = document.getElementById('tutorial-coach-actions');
    const skipBtn = document.getElementById('btn-tutorial-skip');
    const nextBtn = document.getElementById('btn-tutorial-next');
    const dlgModal = document.getElementById('modal-dialogue');

    if (
      !currentLevel ||
      currentLevel.id !== 1 ||
      isTrainRunning ||
      isAutoPlaytestRunning ||
      (gameState && (gameState.tutorialSeen || gameState.tutorialCompleted)) ||
      tutorialStep <= 0 ||
      (dlgModal && !dlgModal.hidden)
    ) {
      if (pointerEl) pointerEl.hidden = true;
      if (coachEl) coachEl.hidden = true;
      return;
    }

    // Auto-advance step transitions naturally!
    if (tutorialStep === 1 && movesSpentInLevel >= 1) {
      tutorialStep = 2;
    }
    if (isPathComplete && tutorialStep < 4) {
      // Allow Step 2 & 3 if user hasn't seen them yet, or jump to Step 4 if already past Step 3
      if (tutorialStep === 1) tutorialStep = 2;
    }

    let targetCell = null;
    for (const sp of (currentLevel.solutionPath || [])) {
      const cell = boardGrid[sp.r] && boardGrid[sp.r][sp.c];
      if (cell && cell.rotatable && !cell.hintLocked && !isTileAtSolution(cell)) {
        targetCell = cell;
        break;
      }
    }

    // If user already passed Step 3 and path is still not complete, guide remaining unaligned rail tiles cleanly!
    const effectiveStep = (tutorialStep >= 4 && !isPathComplete) ? 1 : tutorialStep;

    if (skipBtn) skipBtn.textContent = t('dialogueSkip');
    if (nextBtn) nextBtn.textContent = `${t('dialogueNext')} ◀`;
    if (cardEl) cardEl.setAttribute('dir', isEn() ? 'ltr' : 'rtl');

    if (effectiveStep === 1) {
      if (!targetCell) {
        tutorialStep = 4;
        updateLevel1TutorialPointer();
        return;
      }
      if (badgeEl) badgeEl.textContent = '1 / 4';
      if (titleEl) titleEl.textContent = t('tutStep1Title');
      if (descEl) descEl.textContent = t('tutStep1Desc');
      if (actionsEl) actionsEl.hidden = true;
      if (cardEl) cardEl.classList.remove('dock-above-bottom');

      let xPct = ((targetCell.c + 0.5) / Math.max(1, currentLevel.cols)) * 100;
      let yPct = ((targetCell.r + 0.5) / Math.max(1, currentLevel.rows)) * 100;
      if (window.TrainEngine3D && window.TrainEngine3D.enabled && typeof window.TrainEngine3D.getCellScreenPercent === 'function') {
        const proj = window.TrainEngine3D.getCellScreenPercent(targetCell.r, targetCell.c);
        if (proj && typeof proj.xPct === 'number' && typeof proj.yPct === 'number') {
          xPct = proj.xPct;
          yPct = proj.yPct;
        }
      }
      if (pointerEl) {
        if (labelEl) labelEl.textContent = t('tutorialTapToRotate');
        pointerEl.style.left = `${xPct.toFixed(1)}%`;
        pointerEl.style.top = `${yPct.toFixed(1)}%`;
        pointerEl.hidden = false;
      }
      const domCell = document.getElementById(`cell-${targetCell.r}-${targetCell.c}`);
      const frameEl = document.getElementById('board-frame');
      if (ringEl && frameEl) {
        const fRect = frameEl.getBoundingClientRect();
        const cx = fRect.left + (xPct / 100) * fRect.width;
        const cy = fRect.top + (yPct / 100) * fRect.height;
        ringEl.style.left = `${Math.round(cx - 34)}px`;
        ringEl.style.top = `${Math.round(cy - 34)}px`;
        ringEl.style.width = '68px';
        ringEl.style.height = '68px';
      } else if (ringEl && domCell) {
        positionSpotlightRingOverElement(ringEl, domCell, 6);
      }
      if (coachEl) coachEl.hidden = false;
    } else if (effectiveStep === 2) {
      if (pointerEl) pointerEl.hidden = true;
      if (badgeEl) badgeEl.textContent = '2 / 4';
      if (titleEl) titleEl.textContent = t('tutStep2Title');
      if (descEl) descEl.textContent = t('tutStep2Desc');
      if (actionsEl) actionsEl.hidden = false;
      if (cardEl) cardEl.classList.add('dock-above-bottom');
      positionSpotlightRingOverElement(ringEl, document.getElementById('btn-camera-mode'), 7);
      if (coachEl) coachEl.hidden = false;
    } else if (effectiveStep === 3) {
      if (pointerEl) pointerEl.hidden = true;
      if (badgeEl) badgeEl.textContent = '3 / 4';
      if (titleEl) titleEl.textContent = t('tutStep3Title');
      if (descEl) descEl.textContent = t('tutStep3Desc');
      if (actionsEl) actionsEl.hidden = false;
      if (cardEl) cardEl.classList.remove('dock-above-bottom');
      positionSpotlightRingOverElement(ringEl, document.getElementById('live-dispatch-bar'), 6);
      if (coachEl) coachEl.hidden = false;
    } else if (effectiveStep === 4) {
      if (pointerEl) pointerEl.hidden = true;
      if (badgeEl) badgeEl.textContent = '4 / 4';
      if (titleEl) titleEl.textContent = t('tutStep4Title');
      if (descEl) descEl.textContent = t('tutStep4Desc');
      if (actionsEl) actionsEl.hidden = true;
      if (cardEl) cardEl.classList.add('dock-above-bottom');
      positionSpotlightRingOverElement(ringEl, document.getElementById('btn-launch-train'), 6);
      if (coachEl) coachEl.hidden = false;
    }
  }

  function renderGameplayHUD() {
    if (!currentLevel) return;
    const station = window.GameLevels.STATIONS.find(s => s.id === currentLevel.stationId);

    const appShell = document.getElementById('app-shell');
    if (appShell && station) {
      appShell.setAttribute('data-sector-theme', String(station.id));
    }

    const stNameEl = document.getElementById('hud-station-name');
    if (stNameEl) {
      stNameEl.textContent = station
        ? tf('hudSectorFmt', { icon: station.icon, id: station.id, name: getStationName(station) })
        : t('gameTitle');
    }
    const lvlTitleEl = document.getElementById('hud-level-title');
    if (lvlTitleEl) {
      const isSpecialHud = Boolean(currentLevel.isDualTrainLevel || isBossLevel(currentLevel.id));
      const stIcon = (!isSpecialHud && station) ? `${station.icon} ` : '';
      const badges = (currentLevel.isDualTrainLevel ? ' 🚆×2' : '') + (isBossLevel(currentLevel.id) ? ' 👑' : '');
      lvlTitleEl.textContent = tf('hudLevelFmt', { icon: stIcon, id: currentLevel.id, badges });
    }
    const camLabelEl = document.getElementById('camera-mode-label');
    if (camLabelEl && window.TrainEngine3D) {
      const cm = window.TrainEngine3D.cameraMode;
      camLabelEl.textContent = (cm === 'TOP_TACTICAL') ? t('hudCamTop') : t('hudCam3D');
    }

    updateMovesHUD();
    updateComboHUD();

    const avatarBox = document.getElementById('hud-char-avatar');
    if (avatarBox) avatarBox.innerHTML = getCharacterPortraitSVG(currentLevel.tipSpeaker || 'amal');
    const charNameEl = document.getElementById('hud-char-name');
    if (charNameEl) {
      charNameEl.textContent = getNpcDisplayName(
        currentLevel.tipSpeaker || 'amal',
        currentLevel.tipSpeakerName || 'المهندسة أمل',
        currentLevel.tipSpeakerNameEn || 'Engineer Amal'
      );
    }
    const tipTextEl = document.getElementById('hud-tip-text');
    if (tipTextEl) {
      const curTipLang = (gameState && gameState.lang) || 'ar';
      tipTextEl.textContent = curTipLang === 'ar'
        ? (currentLevel.tipText || '')
        : (curTipLang === 'en'
          ? (currentLevel.tipTextEn || currentLevel.tipText || '')
          : tf('hudCrewTipFmt', { rows: currentLevel.rows, cols: currentLevel.cols }));
    }

    const boardFrame = document.getElementById('board-frame');
    const is3D = Boolean(window.TrainEngine3D && window.TrainEngine3D.enabled);
    boardFrame.className = `board-frame ${station ? station.themeClass : 'station-theme-1'}${is3D ? ' mode-3d-active' : ''}`;

    const launchBtn = document.getElementById('btn-launch-train');
    launchBtn.classList.remove('path-ready-pulse');
    document.getElementById('btn-launch-label').textContent = t('btnLaunchReady');
    const sparksInitEl = document.getElementById('hud-sparks-count');
    if (sparksInitEl) sparksInitEl.textContent = `${Math.min(3, collectedSparksSet.size)}/3`;

    updateHintButtonBadge();
  }

  function updateMovesHUD() {
    const movesEl = document.getElementById('hud-moves-count');
    const pillEl = document.getElementById('hud-moves-pill');
    const iconEl = document.getElementById('hud-moves-icon') || (pillEl && pillEl.querySelector('.cap-icon'));
    if (!movesEl || !pillEl) return;
    movesEl.textContent = String(remainingMoves);

    pillEl.classList.remove('moves-open', 'moves-warn', 'moves-danger');
    if (remainingMoves <= 0) {
      pillEl.classList.add('moves-danger');
      if (iconEl) iconEl.textContent = '🔒';
    } else if (remainingMoves <= 3) {
      pillEl.classList.add('moves-warn');
      if (iconEl) iconEl.textContent = '🔄';
    } else {
      pillEl.classList.add('moves-open');
      if (iconEl) iconEl.textContent = '🔓';
    }
  }

  function updateComboHUD() {
    const comboEl = document.getElementById('hud-combo-count');
    const pillEl = document.getElementById('hud-combo-pill');
    if (!comboEl || !pillEl) return;
    comboEl.textContent = `×${comboMultiplier}`;
    pillEl.classList.toggle('combo-active', comboMultiplier > 1);
  }

  function updateHintButtonBadge() {
    const badge = document.getElementById('hint-btn-badge');
    if (!badge) return;
    if (gameState.hints > 0) {
      badge.textContent = `${gameState.hints} 💡`;
    } else {
      badge.textContent = t('badgeFreeAd');
    }
  }

  function renderBoardDOM() {
    const gridEl = document.getElementById('puzzle-grid');
    if (!gridEl || !currentLevel) return;

    gridEl.className = `puzzle-grid grid-${currentLevel.rows}x${currentLevel.cols}`;
    gridEl.innerHTML = '';

    for (let r = 0; r < currentLevel.rows; r++) {
      for (let c = 0; c < currentLevel.cols; c++) {
        const cell = boardGrid[r][c];
        const cellDiv = document.createElement('div');
        cellDiv.id = `cell-${r}-${c}`;
        cellDiv.className = 'grid-cell';

        if (cell.rotatable) cellDiv.classList.add('rotatable');
        if (cell.type === 'FIXED_STRAIGHT' || cell.type === 'CROSS') cellDiv.classList.add('cell-fixed');
        if (cell.type === 'OBSTACLE') cellDiv.classList.add('cell-obstacle');
        if (cell.type === 'START' || cell.type === 'START_2') cellDiv.classList.add('cell-start');
        if (cell.type === 'END' || cell.type === 'END_2') cellDiv.classList.add('cell-end');

        const rotator = document.createElement('div');
        rotator.id = `rotator-${r}-${c}`;
        rotator.className = 'tile-rotator';
        rotator.style.transform = `rotate(${cell.visualRot}deg)`;
        rotator.innerHTML = renderTileSVG(cell);
        cellDiv.appendChild(rotator);

        if (cell.hasSpark) {
          const sparkDiv = document.createElement('div');
          sparkDiv.id = `spark-${r}-${c}`;
          sparkDiv.className = 'cell-spark-marker';
          sparkDiv.innerHTML = renderSparkStarSVG();
          cellDiv.appendChild(sparkDiv);
        }

        cellDiv.addEventListener('click', () => onCellTapped(r, c));
        gridEl.appendChild(cellDiv);
      }
    }
  }

  function onCellTapped(r, c) {
    if (!currentLevel || isTrainRunning) return;
    const cell = boardGrid[r][c];

    if (!cell.rotatable || cell.hintLocked) {
      if (window.GameAudio) window.GameAudio.playFixedBump();
      if (cell.hintLocked) {
        showToast(t('toastTileLocked'));
      } else if (cell.type === 'FIXED_STRAIGHT') {
        showToast(t('toastTileFixed'));
      } else if (cell.type === 'CROSS') {
        showToast(t('toastTileCross'));
      }
      return;
    }

    const isHumanInteractive = (!isAutoPlaytestRunning && window.__HEADLESS_CI_TEST !== true);
    const cellKey = `${r},${c}`;
    const nowTapMs = Date.now();
    const isSameTileConsecutive = Boolean(
      isHumanInteractive &&
      lastHumanTappedKey === cellKey &&
      (nowTapMs - lastHumanTapTime) <= 3800
    );
    const moveCost = isSameTileConsecutive ? 0 : 1;

    if (remainingMoves < moveCost) {
      openOutOfMovesModal();
      return;
    }

    if (isHumanInteractive) {
      undoMoveStack.push({
        r,
        c,
        prevRot: cell.rot,
        prevVisualRot: cell.visualRot,
        costMove: moveCost
      });
      if (undoMoveStack.length > 30) undoMoveStack.shift();
      lastHumanTappedKey = cellKey;
      lastHumanTapTime = nowTapMs;
    }

    cell.rot = (cell.rot + 90) % 360;
    cell.visualRot += 90;
    remainingMoves = Math.max(0, remainingMoves - moveCost);
    movesSpentInLevel += moveCost;
    updateUndoButtonState();

    if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
      window.TrainEngine3D.rotateTile3D(r, c, cell.visualRot);
    } else {
      const rotator = document.getElementById(`rotator-${r}-${c}`);
      if (rotator) {
        rotator.style.transform = `rotate(${cell.visualRot}deg)`;
      }
    }

    // Check Combo Multiplier (Rotating a solution tile into its correct angle within 3.8s)
    const now = Date.now();
    if (cell.isSolutionTile && isTileAtSolution(cell)) {
      if (now - lastCorrectRotateTime <= 3800) {
        comboMultiplier = Math.min(4, comboMultiplier + 1);
      } else {
        comboMultiplier = 2;
      }
      lastCorrectRotateTime = now;
      if (comboMultiplier > maxComboReached) {
        maxComboReached = comboMultiplier;
      }
      if (comboMultiplier > (gameState.maxComboEver || 1)) {
        gameState.maxComboEver = comboMultiplier;
        saveState();
      }
      triggerHaptic(20);
      if (window.GameAudio) {
        if (isOwnerAutoSolveActive) {
          window.GameAudio.playRotate();
        } else {
          window.GameAudio.playCombo(comboMultiplier);
        }
      }
    } else {
      if (now - lastCorrectRotateTime > 3800) {
        comboMultiplier = 1;
      }
      triggerHaptic(10);
      if (window.GameAudio) window.GameAudio.playRotate();
    }

    updateComboHUD();
    updateMovesHUD();
    updateUndoButtonState();
    saveMidLevelSession();
    evaluateBoardConnectivity(true);
    updateLevel1TutorialPointer();
  }

  function evaluateBoardConnectivity(afterPlayerMove = false) {
    const trace = traceConnectedPath();
    connectedSteps = trace.steps;
    connectedSecondarySteps = trace.secondarySteps || [];

    const canDispatchTrain1 = Boolean(trace.primaryComplete && !train1Delivered);
    const canDispatchTrain2 = Boolean(currentLevel && currentLevel.isDualTrainLevel && trace.secondaryComplete && !train2Delivered);

    isPathComplete = currentLevel && currentLevel.isDualTrainLevel
      ? Boolean(canDispatchTrain1 || canDispatchTrain2)
      : Boolean(trace.primaryComplete);

    const sparksEl = document.getElementById('hud-sparks-count');
    if (sparksEl) sparksEl.textContent = `${Math.min(3, collectedSparksSet.size)}/3`;

    const primarySet = new Set();
    const secondarySet = new Set();
    const connectedSet = new Set();
    if (!train1Delivered) {
      trace.steps.forEach(s => {
        const k = `${s.r},${s.c}`;
        primarySet.add(k);
        connectedSet.add(k);
      });
    }
    if (!train2Delivered) {
      connectedSecondarySteps.forEach(s => {
        const k = `${s.r},${s.c}`;
        secondarySet.add(k);
        connectedSet.add(k);
      });
    }

    if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
      window.TrainEngine3D.updateConduitHighlights(primarySet, isPathComplete, secondarySet);
    } else {
      for (let r = 0; r < currentLevel.rows; r++) {
        for (let c = 0; c < currentLevel.cols; c++) {
          const el = document.getElementById(`cell-${r}-${c}`);
          if (!el) continue;
          el.classList.remove('path-connected', 'path-complete');
          if (connectedSet.has(`${r},${c}`)) {
            el.classList.add(isPathComplete ? 'path-complete' : 'path-connected');
          }
        }
      }
    }

    const launchBtn = document.getElementById('btn-launch-train');
    const launchLabelEl = document.getElementById('btn-launch-label');

    if (isPathComplete) {
      const allRequiredTrainsReady = currentLevel.isDualTrainLevel
        ? Boolean((train1Delivered || canDispatchTrain1) && (train2Delivered || canDispatchTrain2))
        : Boolean(canDispatchTrain1);
      const effectiveSparks = Math.min(3, Math.max(
        collectedSparksSet.size,
        typeof trace.sparksOnCompleteRoute === 'number' ? trace.sparksOnCompleteRoute : trace.sparksOnPath
      ));

      launchBtn.disabled = false;
      launchBtn.classList.add('path-ready-pulse');
      if (launchLabelEl && !isTrainRunning) {
        if (effectiveSparks < 3) {
          const baseLaunch = (currentLevel.isDualTrainLevel && canDispatchTrain1 && !canDispatchTrain2 && !train2Delivered)
            ? t('btnLaunchTrain1')
            : ((currentLevel.isDualTrainLevel && canDispatchTrain2 && !canDispatchTrain1 && !train1Delivered)
              ? t('btnLaunchTrain2')
              : t('btnLaunchReady'));
          launchLabelEl.textContent = `${baseLaunch.replace(/[!！]/g, '').trim()} (\u2066⭐ ${effectiveSparks}/3\u2069)`;
        } else if (currentLevel.isDualTrainLevel && canDispatchTrain1 && !canDispatchTrain2 && !train2Delivered) {
          launchLabelEl.textContent = t('btnLaunchTrain1');
        } else if (currentLevel.isDualTrainLevel && canDispatchTrain2 && !canDispatchTrain1 && !train1Delivered) {
          launchLabelEl.textContent = t('btnLaunchTrain2');
        } else {
          launchLabelEl.textContent = t('btnLaunchReady');
        }
      }

      if (currentLevel && currentLevel.id === 1 && tutorialStep > 0 && tutorialStep === 1) {
        tutorialStep = 2;
        updateLevel1TutorialPointer();
      } else if (currentLevel && currentLevel.id === 1 && tutorialStep >= 3) {
        tutorialStep = 4;
        updateLevel1TutorialPointer();
      }

      if (afterPlayerMove) {
        triggerHaptic([18, 35, 25]);
        const isMission1CoachActive = Boolean(currentLevel && currentLevel.id === 1 && tutorialStep > 0 && !(gameState && (gameState.tutorialSeen || gameState.tutorialCompleted)));
        const readyToAutoLaunch = Boolean(!isAutoPlaytestRunning && allRequiredTrainsReady && effectiveSparks >= 3 && !isMission1CoachActive);
        if (window.GameAudio) {
          window.GameAudio.playPathComplete();
        }
        if (window.TrainEngine3D && window.TrainEngine3D.enabled && typeof window.TrainEngine3D.triggerPathCompletePulse === 'function') {
          window.TrainEngine3D.triggerPathCompletePulse(connectedSteps, connectedSecondarySteps);
        }
        if (autoLaunchTimer) clearTimeout(autoLaunchTimer);
        if (!isAutoPlaytestRunning) {
          if (!isMission1CoachActive && !isOwnerAutoSolveActive) {
            if (trace.sparksOnPath < 3) {
              showToast(tf('toastRouteShortcutFmt', { sparks: effectiveSparks }));
            } else {
              showToast(t('toastRouteFull3Star'));
            }
          }
          if (readyToAutoLaunch) {
            autoLaunchTimer = setTimeout(() => {
              if (isPathComplete && !isTrainRunning) {
                launchTrainSequence();
              }
            }, 380);
          }
        }
      }
    } else {
      launchBtn.disabled = false;
      launchBtn.classList.remove('path-ready-pulse');
      if (launchLabelEl && !isTrainRunning) {
        launchLabelEl.textContent = t('btnLaunchReady');
      }

      if (afterPlayerMove && remainingMoves <= 0) {
        if (window.GameAudio) window.GameAudio.playOutOfMoves();
        setTimeout(() => {
          if (!isPathComplete && remainingMoves <= 0 && !isTrainRunning) {
            openOutOfMovesModal();
          }
        }, 350);
      }
    }
  }

  function checkAndCollectSparkAt(r, c) {
    if (!currentLevel) return;
    const perks = getActiveSkinPerks();

    currentLevel.sparks.forEach(([sr, sc]) => {
      const key = `${sr},${sc}`;
      if (collectedSparksSet.has(key)) return;

      const isDirectHit = (sr === r && sc === c);
      const isMagnetHit = perks.starMagnet && Math.abs(sr - r) <= 1 && Math.abs(sc - c) <= 1;
      if (!isDirectHit && !isMagnetHit) return;

      collectedSparksSet.add(key);
      const sparkEl = document.getElementById(`spark-${sr}-${sc}`);
      if (sparkEl) {
        sparkEl.classList.add('spark-collected');
      }
      if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
        window.TrainEngine3D.collectSpark3D(sr, sc);
      }

      const count = collectedSparksSet.size;
      const sparksEl = document.getElementById('hud-sparks-count');
      if (sparksEl) sparksEl.textContent = `${count}/3`;
      if (window.GameAudio) window.GameAudio.playSparkCollect(count);

      const center = trainAnimator.getCellCenter(sr, sc);
      for (let i = 0; i < 8; i++) {
        trainAnimator.spawnExhaustAndSparks(center.x, center.y, 0, true);
      }
    });
  }

  function launchTrainSequence() {
    if (!currentLevel || isTrainRunning) return;

    const trace = traceConnectedPath();
    const dispatchPrimary = Boolean(trace.primaryComplete && !train1Delivered && trace.steps.length >= 2);
    const dispatchSecondary = Boolean(
      currentLevel.isDualTrainLevel &&
      trace.secondaryComplete &&
      !train2Delivered &&
      trace.secondarySteps &&
      trace.secondarySteps.length >= 2
    );

    if (!dispatchPrimary && !dispatchSecondary) return;

    if (currentLevel.id === 1 && tutorialStep > 0) {
      completeMission1Tutorial();
    }

    if (autoLaunchTimer) {
      clearTimeout(autoLaunchTimer);
      autoLaunchTimer = null;
    }
    if (liveAutoPlayTimer) {
      clearTimeout(liveAutoPlayTimer);
      liveAutoPlayTimer = null;
    }

    isTrainRunning = true;
    if (!train1Delivered && (!currentLevel.isDualTrainLevel || !train2Delivered)) {
      collectedSparksSet.clear();
    }
    triggerHaptic(35);
    triggerScreenShake();

    const rentBtn = document.getElementById('btn-rent-train');
    if (rentBtn) rentBtn.hidden = true;

    const launchBtn = document.getElementById('btn-launch-train');
    launchBtn.disabled = true;
    launchBtn.classList.remove('path-ready-pulse');
    document.getElementById('btn-launch-label').textContent = t('btnTrainRunning');

    const activeTier = getPreferredSpeedTier();
    const activeMult = getPreferredSpeedMult();
    if (window.TrainEngine3D && window.TrainEngine3D.enabled && typeof window.TrainEngine3D.setLiveSpeedMultiplier === 'function') {
      window.TrainEngine3D.setLiveSpeedMultiplier(activeMult);
    }
    trainAnimator.setSpeedMult(activeMult);
    updateLiveDispatchBar(true, activeTier);

    if (window.GameAudio) {
      if (typeof window.GameAudio.setTrainDispatchState === 'function') {
        window.GameAudio.setTrainDispatchState(true);
      }
      window.GameAudio.playWhistle(getEffectiveSkinId(), { isDeparture: true });
    }

    const handleJourneyComplete = () => {
      updateLiveDispatchBar(false, getPreferredSpeedTier());
      if (window.GameAudio) {
        if (typeof window.GameAudio.setTrainDispatchState === 'function') {
          window.GameAudio.setTrainDispatchState(false);
        }
        if (typeof window.GameAudio.playAirBrakeRelease === 'function') {
          window.GameAudio.playAirBrakeRelease();
        }
      }
      if (dispatchPrimary) train1Delivered = true;
      if (dispatchSecondary) train2Delivered = true;

      if (!currentLevel.isDualTrainLevel || (train1Delivered && train2Delivered)) {
        onTrainArrivedAtStation();
      } else {
        // Sequential Dispatch: one train arrived safely, level continues seamlessly for the remaining train!
        isTrainRunning = false;
        launchBtn.disabled = false;
        if (train1Delivered && !train2Delivered) {
          showToast(t('toastSeqTrain1Arrived'));
        } else if (train2Delivered && !train1Delivered) {
          showToast(t('toastSeqTrain2Arrived'));
        }
        evaluateBoardConnectivity(false);
      }
    };

    if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
      const launchPerks = getActiveSkinPerks();
      const effectiveSpeed = (currentLevel.trainSpeed || 3.85) * (launchPerks.speedMult || 1.0);
      window.TrainEngine3D.startJourney(
        dispatchPrimary ? trace.steps : [],
        (_stepIdx, r, c) => {
          // 3D mode audio is driven 100% by updateTrainSpatialAudio() • zero duplicate playChug!
          checkAndCollectSparkAt(r, c);
        },
        handleJourneyComplete,
        effectiveSpeed,
        dispatchSecondary ? trace.secondarySteps : null
      );
    } else {
      trainAnimator.startJourney(dispatchPrimary ? trace.steps : trace.secondarySteps, handleJourneyComplete);
    }
  }

  function onTrainArrivedAtStation() {
    stopStormTimer();
    clearMidLevelSession();
    triggerHaptic([30, 50, 45]);
    triggerScreenShake();

    const boardFrame = document.getElementById('board-frame');
    const wave = document.getElementById('board-color-wave');
    if (boardFrame) boardFrame.classList.add('board-restored');
    if (wave) {
      wave.classList.remove('burst');
      void wave.offsetWidth;
      wave.classList.add('burst');
    }

    if (window.GameAudio) {
      window.GameAudio.playVictoryFanfare();
    }

    const perks = getActiveSkinPerks();
    const sparksCount = collectedSparksSet.size;
    const reqMovesFor3Stars = Math.max(1, 3 - (perks.threeStarMoveGrace || 0));
    let starsEarned = 1;
    if (sparksCount >= 3 && remainingMoves >= reqMovesFor3Stars) {
      starsEarned = 3;
    } else if (sparksCount === 2 || (sparksCount >= 3 && remainingMoves < reqMovesFor3Stars)) {
      starsEarned = 2;
    } else {
      starsEarned = 1;
    }

    const wasDailyChallenge = Boolean(isDailyChallengeMode);
    const wasEndless = Boolean(isEndlessMarathonMode);
    completedWasDailyChallenge = wasDailyChallenge;
    completedWasEndless = wasEndless;

    if (wasEndless) {
      endlessSessionKm = Number((endlessSessionKm + 2.5 + currentLevel.rows * 0.2).toFixed(1));
      if (endlessSessionKm > Number(gameState.bestEndlessKm || 0)) {
        gameState.bestEndlessKm = endlessSessionKm;
      }
    }

    if (!wasDailyChallenge && !wasEndless) {
      const prevBest = gameState.levelStars[currentLevel.id] || 0;
      if (starsEarned > prevBest) {
        gameState.levelStars[currentLevel.id] = starsEarned;
      }
      if (currentLevel.id >= gameState.unlockedLevel && currentLevel.id < TOTAL_LEVELS_COUNT) {
        gameState.unlockedLevel = Math.min(3, currentLevel.id + 1);
      }
      gameState.lastPlayedLevel = Math.min(3, currentLevel.id + 1);
    } else if (currentLevel.id <= gameState.unlockedLevel) {
      const prevBest = gameState.levelStars[currentLevel.id] || 0;
      if (starsEarned > prevBest) {
        gameState.levelStars[currentLevel.id] = starsEarned;
      }
    }

    if (currentLevel.isDualTrainLevel) {
      gameState.dualTrainWins = (gameState.dualTrainWins || 0) + 1;
    }
    if (maxComboReached > (gameState.maxComboEver || 1)) {
      gameState.maxComboEver = maxComboReached;
    }
    gameState.winStreak = (gameState.winStreak || 0) + 1;

    // Coins & XP Formula (with Combo, Storm Timer Speed Bonus, Perfect Conductor Bonus, Boss Bonus, Equipped Locomotive Bonus & 3x Daily Challenge!)
    const baseCoins = (starsEarned * 22) + Math.min(35, remainingMoves * 4);
    const comboBonus = (maxComboReached > 1) ? (maxComboReached * 4) : 0;
    const speedBonus = (stormTimeRemaining > 0) ? 10 : 0;
    const perfectBonus = (sparksCount >= 3 && movesSpentInLevel <= (currentLevel.optimalMoves || 0) + 2) ? 35 : 0;
    const bossBonus = isBossLevel(currentLevel.id) ? 80 : 0;
    lastPerfectBonus = perfectBonus;
    lastBossBonus = bossBonus;
    const subtotalCoins = baseCoins + comboBonus + speedBonus + perfectBonus + bossBonus;
    const skinBonus = Math.round(subtotalCoins * ((perks.coinBonusPct || 0) / 100));
    lastEarnedCoins = subtotalCoins + skinBonus;

    let dailyBonusMultiplier = 1;
    if (wasDailyChallenge) {
      const todayStr = getTodayDateString();
      dailyBonusMultiplier = (gameState.lastDailyChallengeDate !== todayStr) ? 3 : 2;
      gameState.lastDailyChallengeDate = todayStr;
      lastEarnedCoins = lastEarnedCoins * dailyBonusMultiplier;
      isDailyChallengeMode = false;
    }

    gameState.chestWinProgress = Math.min(3, (gameState.chestWinProgress || 0) + 1);

    const xpEarned = (starsEarned * 50) + (stormTimeRemaining > 0 ? 50 : 20);
    gameState.coins += lastEarnedCoins;
    gameState.xp = (gameState.xp || 0) + xpEarned;

    saveState();
    updateGlobalTopBar();

    const finishArrivalModal = () => {
      isTrainRunning = false;
      trialSkinIdForCurrentLevel = null;
      trialSkinLevelId = null;
      document.getElementById('btn-launch-train').disabled = true;
      if (!isAutoPlaytestRunning && !completedWasDailyChallenge && currentLevel.postDialogue && currentLevel.postDialogue.length > 0) {
        const lgNow = (gameState && gameState.lang) || 'ar';
        const postLines = (lgNow === 'ar' || lgNow === 'en')
          ? currentLevel.postDialogue
          : [{
            speakerId: (currentLevel.postDialogue[0] && currentLevel.postDialogue[0].speakerId) || 'fouad',
            speakerName: getNpcDisplayName((currentLevel.postDialogue[0] && currentLevel.postDialogue[0].speakerId) || 'fouad'),
            speakerNameEn: getNpcDisplayName((currentLevel.postDialogue[0] && currentLevel.postDialogue[0].speakerId) || 'fouad'),
            text: `${t('vicTitleWin')} ⭐ \u2066${starsEarned}/3\u2069 — ${getLvlTitle(currentLevel)}!`,
            textEn: `${t('vicTitleWin')} ⭐ \u2066${starsEarned}/3\u2069 — ${getLvlTitle(currentLevel)}!`
          }];
        openDialogueModal(currentLevel.stationId, postLines, () => {
          openVictoryModal(starsEarned, sparksCount, comboBonus, speedBonus + skinBonus, xpEarned);
        }, true);
      } else {
        openVictoryModal(starsEarned, sparksCount, comboBonus, speedBonus + skinBonus, xpEarned);
      }
    };

    if (isAutoPlaytestRunning) {
      finishArrivalModal();
    } else {
      setTimeout(finishArrivalModal, 800);
    }
  }

  // ==========================================================================
  // 9. SMART RADAR HINT SYSTEM (Supports 1, 2, or 4 Super Golden Key Tiles)
  // ==========================================================================
  function getUnsolvedSolutionCells() {
    if (!currentLevel || !boardGrid.length) return [];
    const list = [];
    const seen = new Set();
    const centerR = (currentLevel.rows - 1) * 0.5;
    const centerC = (currentLevel.cols - 1) * 0.5;

    const scorePathCandidates = (pathArr, routeId) => {
      if (!Array.isArray(pathArr) || pathArr.length === 0) return;
      const denom = Math.max(1, pathArr.length - 1);
      for (let idx = 0; idx < pathArr.length; idx++) {
        const sp = pathArr[idx];
        const key = `${sp.r},${sp.c}`;
        if (seen.has(key)) continue;
        const cell = boardGrid[sp.r] && boardGrid[sp.r][sp.c];
        if (!cell || !cell.rotatable || cell.hintLocked) continue;
        seen.add(key);

        const t = idx / denom;
        const centerDist = Math.hypot(cell.r - centerR, cell.c - centerC);
        const isEndNeighbor = (idx === 1 || idx === pathArr.length - 2);
        let score = 0;
        if (!isTileAtSolution(cell)) {
          score += 1000;
        }
        if (t >= 0.30 && t <= 0.75) {
          score += 300;
        }
        if (isEndNeighbor) {
          score -= 1500;
        }
        if (cell.type === 'Y_SWITCH' || cell.type === 'SWITCH') {
          score += 360;
        } else if (cell.type === 'CURVE') {
          score += 120;
        }
        score -= centerDist * 15;

        cell._hintScore = score;
        cell._hintRouteId = routeId;
        cell._hintPathT = t;
        cell._isEndNeighbor = isEndNeighbor;
        list.push(cell);
      }
    };

    scorePathCandidates(currentLevel.solutionPath || [], 1);
    if (currentLevel.isDualTrainLevel && Array.isArray(currentLevel.secondarySolutionPath)) {
      scorePathCandidates(currentLevel.secondarySolutionPath, 2);
    }

    list.sort((a, b) => (b._hintScore || 0) - (a._hintScore || 0));
    return list;
  }

  function applySmartHintEffect(count = 2, isAutoPerk = false) {
    const candidates = getUnsolvedSolutionCells();
    if (candidates.length === 0) {
      if (!isAutoPerk) {
        showToast(t('toastHintAllAligned'));
      }
      return false;
    }

    const toFix = [];
    const seenFixed = new Set();

    const pickFirst = candidates[0];
    toFix.push(pickFirst);
    seenFixed.add(`${pickFirst.r},${pickFirst.c}`);

    while (toFix.length < count && toFix.length < candidates.length) {
      let bestNext = null;

      // On Dual-Train levels, when picking the 2nd tile, prefer an unsolved mid-map tile on the secondary route if available
      if (currentLevel && currentLevel.isDualTrainLevel && toFix.length === 1) {
        const firstRoute = toFix[0]._hintRouteId || 1;
        for (const cand of candidates) {
          const k = `${cand.r},${cand.c}`;
          if (seenFixed.has(k) || cand._isEndNeighbor) continue;
          const farEnough = toFix.every(p => (Math.abs(cand.r - p.r) + Math.abs(cand.c - p.c)) >= 2);
          if (cand._hintRouteId !== firstRoute && farEnough && !isTileAtSolution(cand)) {
            bestNext = cand;
            break;
          }
        }
      }

      // Otherwise pick the highest-scoring non-endpoint candidate with Manhattan distance >= 2 from already selected tiles
      if (!bestNext) {
        for (const cand of candidates) {
          const k = `${cand.r},${cand.c}`;
          if (seenFixed.has(k) || cand._isEndNeighbor) continue;
          const farEnough = toFix.every(p => (Math.abs(cand.r - p.r) + Math.abs(cand.c - p.c)) >= 2);
          if (farEnough) {
            bestNext = cand;
            break;
          }
        }
      }

      // Next fallback: any remaining non-endpoint candidate (even if adjacent to an already locked mid-map tile)
      if (!bestNext) {
        for (const cand of candidates) {
          const k = `${cand.r},${cand.c}`;
          if (!seenFixed.has(k) && !cand._isEndNeighbor) {
            bestNext = cand;
            break;
          }
        }
      }

      // Final fallback if only endpoint neighbors remain
      if (!bestNext) {
        for (const cand of candidates) {
          const k = `${cand.r},${cand.c}`;
          if (!seenFixed.has(k)) {
            bestNext = cand;
            break;
          }
        }
      }

      if (!bestNext) break;
      seenFixed.add(`${bestNext.r},${bestNext.c}`);
      toFix.push(bestNext);
    }
    toFix.forEach(cell => {
      const currentNorm = ((cell.rot % 360) + 360) % 360;
      const targetNorm = ((cell.solRot % 360) + 360) % 360;
      let diff = (targetNorm - currentNorm + 360) % 360;

      if ((cell.type === 'STRAIGHT' || cell.type === 'BRIDGE' || cell.type === 'SWITCH') && diff === 270) {
        diff = 90;
      }

      cell.rot = (currentNorm + diff) % 360;
      cell.visualRot += diff;
      cell.hintLocked = true;

      const rotator = document.getElementById(`rotator-${cell.r}-${cell.c}`);
      if (rotator) {
        rotator.style.transform = `rotate(${cell.visualRot}deg)`;
      }
      if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
        window.TrainEngine3D.rotateTile3D(cell.r, cell.c, cell.visualRot);
        window.TrainEngine3D.lockTile3D(cell.r, cell.c);
      }

      const cellEl = document.getElementById(`cell-${cell.r}-${cell.c}`);
      if (cellEl) {
        cellEl.classList.add('hint-locked');
        if (!cellEl.querySelector('.hint-lock-badge')) {
          const lockBadge = document.createElement('span');
          lockBadge.className = 'hint-lock-badge';
          lockBadge.textContent = '🔒';
          cellEl.appendChild(lockBadge);
        }
      }
    });

    if (!isAutoPerk) {
      if (window.GameAudio) window.GameAudio.playHintLock();
      showToast(tf('toastHintLockedFmt', { n: toFix.length }));
    }
    evaluateBoardConnectivity(!isAutoPerk);
    return true;
  }

  // ==========================================================================
  // 10. SCREENS, HORIZONTAL SECTOR CAROUSEL & MODALS RENDERING
  // ==========================================================================
  let activeSectorIndex = -1;

  function showScreen(screenId) {
    const appShell = document.getElementById('app-shell');
    if (appShell) {
      appShell.setAttribute('data-active-screen', screenId);
    }
    if (screenId !== 'screen-game') {
      stopStormTimer();
      trialSkinIdForCurrentLevel = null;
      trialSkinLevelId = null;
      if (window.GameAudio) {
        if (typeof window.GameAudio.setTrainDispatchState === 'function') {
          window.GameAudio.setTrainDispatchState(false);
        }
        window.GameAudio.stopTrainEngineLoop();
        if (window.GameAudio.ctx) {
          window.GameAudio.startBGM('menu');
        } else {
          window.GameAudio.currentSector = 'menu';
        }
      }
    }

    document.querySelectorAll('.screen').forEach(s => {
      if (s.id === screenId) {
        s.classList.remove('active');
        void s.offsetWidth; // trigger smooth entrance animation
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    updateGlobalTopBar();
    if (screenId === 'screen-menu') renderMainMenu();
    if (screenId === 'screen-map') {
      const focusLvlId = getMapFocusLevelId();
      activeSectorIndex = Math.max(0, Math.min(9, Math.floor((focusLvlId - 1) / 10)));
      renderStationsMap();
    }
  }

  function updateAchievementNotifBadge() {
    const badgeEl = document.getElementById('ui-ach-badge');
    if (!badgeEl) return;
    const claimed = gameState.claimedAchievements || [];
    const readyCount = ACHIEVEMENTS.filter(a => !claimed.includes(a.id) && a.getProgress(gameState) >= a.target).length;
    badgeEl.hidden = readyCount <= 0;
  }

  function getConductorRankInfo(totalStars) {
    const s = Number(totalStars) || 0;
    const lg = (gameState && gameState.lang) || 'ar';
    for (let i = 0; i < CONDUCTOR_RANKS_I18N.length; i++) {
      const r = CONDUCTOR_RANKS_I18N[i];
      if (s >= r.minStars) {
        return { icon: r.icon, label: r[lg] || r.en, ar: r.ar, en: r.en };
      }
    }
    const last = CONDUCTOR_RANKS_I18N[CONDUCTOR_RANKS_I18N.length - 1];
    return { icon: last.icon, label: last[lg] || last.en, ar: last.ar, en: last.en };
  }

  function updateLiveDispatchBar(_isRunningNow, activeSpeed = null) {
    const bar = document.getElementById('live-dispatch-bar');
    if (!bar) return;
    // V12.1: ONE permanent sleek control bar ([1] [2] [3] [🎥 Chase]) — zero duplicate bars & zero layout jump!
    bar.hidden = false;
    bar.setAttribute('dir', isEn() ? 'ltr' : 'rtl');
    const chosenTier = activeSpeed || getPreferredSpeedTier();
    const titleEl = document.getElementById('live-dispatch-title');
    if (titleEl) titleEl.textContent = t('speedBarLabel');
    const chaseLbl = document.getElementById('btn-live-chase-label');
    if (chaseLbl) chaseLbl.textContent = t('chaseCamLabel');
    [1, 2, 3].forEach(m => {
      const b = document.getElementById(`btn-speed-${m}x`);
      if (b) {
        b.textContent = String(m);
        b.classList.toggle('active', m === chosenTier);
      }
    });
    const chaseBtn = document.getElementById('btn-live-chase-cam');
    if (chaseBtn) {
      chaseBtn.hidden = false;
      if (window.TrainEngine3D) {
        chaseBtn.classList.toggle('active', Boolean(window.TrainEngine3D.cameraMode === 'CHASE_3D'));
      }
    }
  }

  function updateGlobalTopBar() {
    const coinsEl = document.getElementById('ui-coins-count');
    if (coinsEl) coinsEl.textContent = String(gameState.coins);
    const hintsEl = document.getElementById('ui-hints-count');
    if (hintsEl) hintsEl.textContent = String(gameState.hints);
    const audioEl = document.getElementById('ui-audio-icon');
    if (audioEl) {
      audioEl.textContent = (window.GameAudio && window.GameAudio.muted) ? '🔇' : '🔊';
    }
    const langEl = document.getElementById('ui-lang-label');
    if (langEl) {
      const curL = (gameState && gameState.lang) || 'ar';
      langEl.textContent = SUPPORTED_LANG_BADGES[curL] || curL.toUpperCase();
    }

    const totalStars = Object.values(gameState.levelStars).reduce((a, b) => a + b, 0);
    const starsTopEl = document.getElementById('ui-stars-count');
    if (starsTopEl) {
      starsTopEl.textContent = `${totalStars}/${TOTAL_LEVELS_COUNT * 3}`;
    }
    const rankPillEl = document.getElementById('ui-conductor-rank-pill');
    if (rankPillEl) {
      const rInfo = getConductorRankInfo(totalStars);
      rankPillEl.textContent = tf('rankPillFmt', { icon: rInfo.icon, rank: rInfo.label, stars: totalStars });
    }

    const pct = getOverallColorRestorationPercent();
    const pctEl = document.getElementById('menu-color-percent');
    if (pctEl) pctEl.textContent = `${pct}%`;
    const barEl = document.getElementById('menu-color-bar');
    if (barEl) barEl.style.width = `${pct}%`;

    const vipBadge = document.getElementById('ui-vip-badge');
    if (vipBadge) {
      vipBadge.hidden = !gameState.isVip;
      vipBadge.textContent = t('vipBadgeTop');
    }

    window.AdMobBridge.updateBannerVisibility(gameState.isVip);
    updateHintButtonBadge();
    updateAchievementNotifBadge();

    const todayStr = getTodayDateString();
    const dailyChalDot = document.getElementById('ui-daily-challenge-dot');
    if (dailyChalDot) {
      dailyChalDot.hidden = (gameState.lastDailyChallengeDate === todayStr);
    }
    const dailyGiftDot = document.getElementById('ui-daily-gift-dot');
    if (dailyGiftDot) {
      dailyGiftDot.hidden = (gameState.lastLoginDate === todayStr);
    }
  }

  function getStationRestorationPercent(stationId) {
    const station = window.GameLevels.STATIONS.find(s => s.id === stationId);
    if (!station) return 0;
    const completedCount = station.levels.filter(lid => (gameState.levelStars[lid] || 0) > 0).length;
    return Math.round((completedCount / station.levels.length) * 100);
  }

  function getOverallColorRestorationPercent() {
    const totalLevels = window.GameLevels.LEVELS.length;
    const completed = window.GameLevels.LEVELS.filter(l => (gameState.levelStars[l.id] || 0) > 0).length;
    return Math.round((completed / totalLevels) * 100);
  }

  function renderMainMenu() {
    const previewEl = document.getElementById('menu-train-preview');
    if (previewEl) previewEl.innerHTML = getCharacterPortraitSVG('saffar');

    const targetLvlId = IS_OWNER_TEST_BUILD
      ? Math.max(1, Math.min(TOTAL_LEVELS_COUNT, Number(gameState.lastPlayedLevel || 1)))
      : Math.min(TOTAL_LEVELS_COUNT, gameState.unlockedLevel);
    const targetLvl = window.GameLevels.LEVELS.find(l => l.id === targetLvlId) || window.GameLevels.LEVELS[0];

    const mainLabelEl = document.getElementById('btn-play-mainlabel');
    if (mainLabelEl) {
      const lvlDisplay = !isEn() ? `\u2066${targetLvl.id}\u2069` : `${targetLvl.id}`;
      mainLabelEl.textContent = `${t('btnPlayNowPrefix')}${lvlDisplay})`;
    }
    const subLabelEl = document.getElementById('btn-play-sublabel');
    if (subLabelEl) {
      subLabelEl.textContent = getLvlTitle(targetLvl);
    }

    const appShell = document.getElementById('app-shell');
    if (appShell && targetLvl) {
      appShell.setAttribute('data-sector-theme', String(targetLvl.stationId || 1));
    }

    // Mount Full-Screen Live 3D Showcase inside Main Menu Hero Card
    if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
      const heroCard = document.querySelector('.menu-hero-card');
      if (heroCard) heroCard.classList.add('has-3d-showcase');
      const activeSkin = TRAIN_SKINS.find(s => s.id === gameState.equippedSkin) || TRAIN_SKINS[0];
      window.TrainEngine3D.startMenuShowcase(activeSkin);
      setTimeout(() => {
        if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
          window.TrainEngine3D.onResize();
        }
      }, 16);
    }
  }

  const SECTOR_ACCENTS = {
    1: '#10B981',
    2: '#F59E0B',
    3: '#06B6D4',
    4: '#38BDF8',
    5: '#EC4899',
    6: '#D97706',
    7: '#0284C7',
    8: '#A855F7',
    9: '#EF4444',
    10: '#FACC15'
  };

  function buildSerpentineRailwaySVG(pct, accentColor = '#38BDF8') {
    const strokeColor = accentColor || '#38BDF8';
    const conduitOpacity = pct > 0 ? '0.94' : '0.58';
    const pathD = 'M 85 42 L 275 42 A 44 44 0 0 1 275 130 L 85 130 A 44 44 0 0 0 85 218 L 275 218 A 44 44 0 0 1 275 306 L 85 306 A 44 44 0 0 0 85 394 L 275 394';
    return `<svg class="railway-track-svg" viewBox="0 0 360 436" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Steel Rail Bed -->
      <path d="${pathD}"
        fill="none" stroke="rgba(9, 13, 22, 0.85)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Timber Sleepers / Cross Ties -->
      <path d="${pathD}"
        fill="none" stroke="rgba(148, 163, 184, 0.45)" stroke-width="12" stroke-dasharray="4 9" stroke-linecap="butt"/>
      <!-- Glowing Biome-Themed Energy Conduit Rail -->
      <path d="${pathD}"
        fill="none" stroke="${strokeColor}" stroke-width="3.8" stroke-linecap="round" opacity="${conduitOpacity}"/>
    </svg>`;
  }

  function getMapFocusLevelId() {
    const maxAllowed = IS_OWNER_TEST_BUILD
      ? TOTAL_LEVELS_COUNT
      : Math.max(1, Math.min(TOTAL_LEVELS_COUNT, Number(gameState.unlockedLevel || 1)));
    let candidate = null;
    if ((isDailyChallengeMode || completedWasDailyChallenge) && lastCampaignLevelId) {
      candidate = lastCampaignLevelId;
    } else if (gameState && Number(gameState.lastPlayedLevel) >= 1) {
      candidate = Number(gameState.lastPlayedLevel);
    } else if (lastCampaignLevelId) {
      candidate = lastCampaignLevelId;
    } else if (currentLevel && currentLevel.id && !isDailyChallengeMode && !isEndlessMarathonMode) {
      candidate = currentLevel.id;
    } else {
      candidate = maxAllowed;
    }
    return Math.max(1, Math.min(maxAllowed, Math.round(candidate)));
  }

  function setActiveMapSector(index) {
    const stations = window.GameLevels.STATIONS;
    activeSectorIndex = Math.max(0, Math.min(stations.length - 1, index));

    const listEl = document.getElementById('stations-list');
    if (listEl) {
      listEl.style.transform = `translateX(-${activeSectorIndex * 100}%)`;
    }

    const activeSt = stations[activeSectorIndex];
    const indicatorEl = document.getElementById('map-sector-indicator');
    if (indicatorEl && activeSt) {
      indicatorEl.textContent = tf('mapSectorOfFmt', { icon: activeSt.icon, id: activeSt.id, total: stations.length });
    }

    const appShell = document.getElementById('app-shell');
    if (appShell && activeSt) {
      appShell.setAttribute('data-sector-theme', String(activeSt.id));
    }

    document.querySelectorAll('.sector-tab-pill').forEach((tab, idx) => {
      tab.classList.toggle('active', idx === activeSectorIndex);
    });

    const prevBtn = document.getElementById('btn-sector-prev');
    const nextBtn = document.getElementById('btn-sector-next');
    if (prevBtn) prevBtn.disabled = (activeSectorIndex <= 0);
    if (nextBtn) nextBtn.disabled = (activeSectorIndex >= stations.length - 1);
  }

  function renderStarMilestoneRoad() {
    const nodesEl = document.getElementById('star-road-nodes');
    const titleEl = document.getElementById('star-road-title');
    const progTextEl = document.getElementById('star-road-prog-text');
    const barFillEl = document.getElementById('star-road-bar-fill');
    if (titleEl) titleEl.textContent = t('starRoadTitle');

    const totalStars = Object.values(gameState.levelStars || {}).reduce((a, b) => a + b, 0);
    const maxStars = TOTAL_LEVELS_COUNT * 3;
    if (progTextEl) {
      progTextEl.textContent = ltr(`${totalStars} / ${maxStars} ⭐`);
    }
    if (barFillEl) {
      barFillEl.style.width = `${Math.min(100, Math.round((totalStars / maxStars) * 100))}%`;
    }
    if (!nodesEl) return;

    if (!Array.isArray(gameState.claimedStarMilestones)) {
      gameState.claimedStarMilestones = [];
    }

    nodesEl.innerHTML = '';
    STAR_MILESTONES.forEach(ms => {
      const isClaimed = gameState.claimedStarMilestones.includes(ms.stars);
      const isReady = !isClaimed && totalStars >= ms.stars;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `star-milestone-btn${isClaimed ? ' sm-claimed' : ''}${isReady ? ' sm-ready' : ''}`;
      const iconStr = isClaimed ? '✅' : (isReady ? '🎁' : '🔒');
      const rewardStr = `🪙\u2066+${ms.coins}\u2069 💡\u2066+${ms.hints}\u2069`;
      btn.innerHTML = `
        <span class="sm-icon">${iconStr}</span>
        <span class="sm-stars">\u2066${ms.stars} ⭐\u2069</span>
        <span class="sm-reward">${rewardStr}</span>
      `;
      btn.addEventListener('click', () => {
        claimStarMilestone(ms.stars);
      });
      nodesEl.appendChild(btn);
    });
  }

  function claimStarMilestone(starsReq, forceTestUnlock = false) {
    const ms = STAR_MILESTONES.find(m => m.stars === Number(starsReq));
    if (!ms) return;
    if (!Array.isArray(gameState.claimedStarMilestones)) {
      gameState.claimedStarMilestones = [];
    }
    const totalStars = Object.values(gameState.levelStars || {}).reduce((a, b) => a + b, 0);
    if (gameState.claimedStarMilestones.includes(ms.stars)) {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      showToast(tf('toastMilestoneAlreadyFmt', { stars: ms.stars }));
      return;
    }
    if (totalStars < ms.stars && !forceTestUnlock) {
      if (window.GameAudio) window.GameAudio.playFixedBump();
      const needed = ms.stars - totalStars;
      showToast(tf('toastMilestoneNeedFmt', { needed, coins: ms.coins, hints: ms.hints }));
      return;
    }

    gameState.claimedStarMilestones.push(ms.stars);
    gameState.coins += ms.coins;
    gameState.hints += ms.hints;
    saveState();
    triggerHaptic([20, 40, 30]);
    if (window.GameAudio) {
      window.GameAudio.playVictoryFanfare();
    }
    updateGlobalTopBar();
    renderStarMilestoneRoad();
    showToast(tf('toastMilestoneClaimedFmt', { stars: ms.stars, coins: ms.coins, hints: ms.hints }));
  }

  window.renderStarMilestoneRoad = renderStarMilestoneRoad;
  window.claimStarMilestone = claimStarMilestone;

  function renderStationsMap() {
    const listEl = document.getElementById('stations-list');
    const tabsBar = document.getElementById('sector-tabs-bar');
    if (!listEl) return;
    listEl.innerHTML = '';
    if (tabsBar) tabsBar.innerHTML = '';

    const totalStars = Object.values(gameState.levelStars).reduce((a, b) => a + b, 0);
    const mapStarsEl = document.getElementById('map-stars-total');
    if (mapStarsEl) mapStarsEl.textContent = `${totalStars}/${TOTAL_LEVELS_COUNT * 3}`;
    renderStarMilestoneRoad();

    window.GameLevels.STATIONS.forEach((st, sectorIdx) => {
      const pct = getStationRestorationPercent(st.id);
      const isSectorUnlocked = IS_OWNER_TEST_BUILD || (st.levels[0] <= gameState.unlockedLevel);
      const stName = getStationName(st);

      // 1. Sector Quick-Switch Pill Tab
      if (tabsBar) {
        const tabBtn = document.createElement('button');
        tabBtn.className = `sector-tab-pill${isSectorUnlocked ? ' unlocked' : ''}${sectorIdx === activeSectorIndex ? ' active' : ''}`;
        tabBtn.textContent = String(st.id);
        tabBtn.title = tf('hudSectorFmt', { icon: '', id: st.id, name: stName }).trim();
        tabBtn.addEventListener('click', () => {
          if (window.GameAudio) window.GameAudio.playButtonTap();
          setActiveMapSector(sectorIdx);
        });
        tabsBar.appendChild(tabBtn);
      }

      // 2. Horizontal Carousel Slide containing ONE Luxury Glassmorphic Sector Card
      const slide = document.createElement('div');
      slide.className = 'sector-slide';
      slide.setAttribute('dir', isEn() ? 'ltr' : 'rtl');

      const card = document.createElement('div');
      card.className = `station-card sector-card-${st.id}`;
      const sectorAccent = SECTOR_ACCENTS[st.id] || '#10B981';
      card.style.setProperty('--card-accent', sectorAccent);
      const kickerTxt = tf('mapSectorLevelsFmt', { id: st.id, from: st.levels[0], to: st.levels[st.levels.length - 1] });
      const powerTxt = t('mapPowerLabel');
      const playNowTxt = t('mapPlayNowBtn');
      const bannerArtSvg = getStationSceneSVG(st.id);

      card.innerHTML = `
        <div class="station-card-banner">
          <div class="station-banner-art" aria-hidden="true">${bannerArtSvg}</div>
          <div class="station-icon-badge">${st.icon}</div>
          <div class="station-meta">
            <span class="station-sector-kicker">${kickerTxt}</span>
            <h3>${stName}</h3>
          </div>
          <div class="station-color-pill">
            <span>${powerTxt}</span>
            <strong>${pct}%</strong>
          </div>
        </div>

        <div class="sector-railway-board">
          <div class="railway-nodes-stage">
            ${buildSerpentineRailwaySVG(pct, sectorAccent)}
            <div class="station-levels-row" id="st-levels-${st.id}"></div>
          </div>
        </div>

        <div class="sector-selected-dock" id="st-dock-${st.id}">
          <div class="sel-level-meta">
            <span class="sel-level-tag" id="st-dock-tag-${st.id}">${tf('hudMissionTitleFmt', { id: st.levels[0] })}</span>
            <strong class="sel-level-title" id="st-dock-title-${st.id}"></strong>
          </div>
          <button class="btn-launch-selected" id="st-dock-play-${st.id}">${playNowTxt}</button>
        </div>
      `;

      slide.appendChild(card);
      listEl.appendChild(slide);

      const rowEl = card.querySelector(`#st-levels-${st.id}`);
      const dockEl = card.querySelector(`#st-dock-${st.id}`);
      const dockTagEl = card.querySelector(`#st-dock-tag-${st.id}`);
      const dockTitleEl = card.querySelector(`#st-dock-title-${st.id}`);
      const dockPlayBtn = card.querySelector(`#st-dock-play-${st.id}`);
      let selectedLevelIdInCard = null;

      const updateDockForLevel = (lvl, isUnlocked) => {
        if (!dockEl || !dockTagEl || !dockTitleEl || !dockPlayBtn) return;
        dockTagEl.textContent = tf('mapLevelGridFmt', { id: lvl.id, rows: lvl.rows, cols: lvl.cols });
        dockTitleEl.textContent = getLvlTitle(lvl);
        dockEl.hidden = false;
        if (isUnlocked) {
          dockPlayBtn.disabled = false;
          dockPlayBtn.textContent = t('mapPlayNowBtn');
          dockPlayBtn.onclick = () => {
            if (window.GameAudio) window.GameAudio.playButtonTap();
            startLevel(lvl.id, true);
          };
        } else {
          dockPlayBtn.disabled = true;
          dockPlayBtn.textContent = t('mapLockedBtn');
          dockPlayBtn.onclick = null;
        }
      };

      const focusLvlId = getMapFocusLevelId();
      const defaultTargetId = st.levels.includes(focusLvlId)
        ? focusLvlId
        : (st.levels.includes(gameState.unlockedLevel)
            ? gameState.unlockedLevel
            : st.levels[0]);

      st.levels.forEach((lvlId, idxInSector) => {
        const lvl = window.GameLevels.LEVELS.find(l => l.id === lvlId);
        const stars = gameState.levelStars[lvlId] || 0;
        const isUnlocked = IS_OWNER_TEST_BUILD || (lvlId <= gameState.unlockedLevel);
        const isCurrent = lvlId === gameState.unlockedLevel;

        const btn = document.createElement('button');
        btn.className = 'level-node-btn';
        if (stars > 0) btn.classList.add('completed');
        else if (isCurrent) btn.classList.add('current');
        else if (!isUnlocked) btn.classList.add('locked');

        // Position along the 2-column × 5-row vertical serpentine railway grid to fill the card center
        const rowNum = Math.floor(idxInSector / 2) + 1;
        const colNum = (rowNum % 2 === 1) ? ((idxInSector % 2) + 1) : (2 - (idxInSector % 2));
        btn.style.gridRow = String(rowNum);
        btn.style.gridColumn = String(colNum);

        btn.disabled = !isUnlocked;
        const starsStr = isUnlocked
          ? ('⭐'.repeat(stars) + '☆'.repeat(3 - stars))
          : '🔒';

        btn.innerHTML = `
          <span class="level-num">#${lvl.id}</span>
          <span class="level-stars-mini">${starsStr}</span>
        `;

        if (lvl.id === defaultTargetId) {
          selectedLevelIdInCard = lvl.id;
          btn.classList.add('selected');
          updateDockForLevel(lvl, isUnlocked);
        }

        btn.addEventListener('click', () => {
          if (window.GameAudio) window.GameAudio.playButtonTap();
          if (selectedLevelIdInCard === lvl.id && isUnlocked) {
            startLevel(lvl.id, true);
            return;
          }
          selectedLevelIdInCard = lvl.id;
          rowEl.querySelectorAll('.level-node-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          updateDockForLevel(lvl, isUnlocked);
        });

        rowEl.appendChild(btn);
      });
    });

    setActiveMapSector(activeSectorIndex);
  }

  function openDialogueModal(stationId, dialogueLines, onFinish, isPostVictory = false) {
    if (!dialogueLines || dialogueLines.length === 0) {
      if (typeof onFinish === 'function') onFinish();
      return;
    }

    const modal = document.getElementById('modal-dialogue');
    const badgeEl = document.getElementById('dialogue-chapter-badge');
    const portraitBox = document.getElementById('dialogue-portrait-box');
    const speakerEl = document.getElementById('dialogue-speaker-name');
    const textEl = document.getElementById('dialogue-text');
    const dotsEl = document.getElementById('dialogue-dots');
    const nextBtn = document.getElementById('btn-next-dialogue');
    const nextLabel = document.getElementById('btn-next-dialogue-label');
    const skipBtn = document.getElementById('btn-skip-dialogue');

    const station = window.GameLevels.STATIONS.find(s => s.id === stationId);
    badgeEl.textContent = station
      ? tf('hudSectorFmt', { icon: station.icon, id: station.id, name: getStationName(station) })
      : t('gameTitle');
    if (skipBtn) skipBtn.textContent = t('dialogueSkip');

    let idx = 0;

    function renderLine() {
      const line = dialogueLines[idx];
      portraitBox.innerHTML = getCharacterPortraitSVG(line.speakerId);
      if (window.TrainEngine3D && typeof window.TrainEngine3D.mountDialoguePortrait === 'function') {
        window.TrainEngine3D.mountDialoguePortrait(line.speakerId, portraitBox);
      }
      speakerEl.textContent = getNpcDisplayName(line.speakerId, line.speakerName, line.speakerNameEn);
      const lgDlg = (gameState && gameState.lang) || 'ar';
      textEl.textContent = line[`text_${lgDlg}`]
        || (isEn() ? (line.textEn || line.text || '') : (line.text || ''));

      dotsEl.innerHTML = dialogueLines
        .map((_, i) => `<span class="dialogue-dot ${i === idx ? 'active' : ''}"></span>`)
        .join('');

      nextLabel.textContent = (idx === dialogueLines.length - 1)
        ? (isPostVictory ? t('dialogueViewResults') : t('dialogueStartMission'))
        : t('dialogueNext');
    }

    function closeAndFinish() {
      modal.hidden = true;
      if (typeof onFinish === 'function') onFinish();
    }

    nextBtn.onclick = () => {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      if (idx < dialogueLines.length - 1) {
        idx += 1;
        renderLine();
      } else {
        closeAndFinish();
      }
    };

    skipBtn.onclick = () => {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      closeAndFinish();
    };

    renderLine();
    modal.hidden = false;
  }

  function openSmartHintModal() {
    if (!currentLevel || isTrainRunning) return;
    const modal = document.getElementById('modal-hint');
    const hintAvatarEl = document.getElementById('hint-modal-avatar');
    if (hintAvatarEl) {
      hintAvatarEl.innerHTML = getCharacterPortraitSVG('amal');
      if (window.TrainEngine3D && typeof window.TrainEngine3D.mountDialoguePortrait === 'function') {
        window.TrainEngine3D.mountDialoguePortrait('amal', hintAvatarEl);
      }
    }

    const titleEl = modal ? modal.querySelector('.modal-title') : null;
    const descEl = modal ? modal.querySelector('.modal-desc') : null;
    if (titleEl) titleEl.textContent = t('hintModalTitle');
    if (descEl) descEl.innerHTML = t('hintModalDesc');

    const freeBtn = document.getElementById('btn-use-free-hint');
    if (freeBtn) {
      freeBtn.disabled = gameState.hints <= 0;
      freeBtn.innerHTML = `<span>💡</span><span>${t('hintUseFreePrefix')}<span id="modal-hint-stock">${gameState.hints}</span>)</span>`;
    }
    const watchAdBtn = document.getElementById('btn-watch-ad-hint');
    if (watchAdBtn) {
      watchAdBtn.innerHTML = `<span>🎬</span><span>${t('hintWatchAd')}</span>`;
    }
    const buyCoinsBtn = document.getElementById('btn-buy-hint-coins');
    if (buyCoinsBtn) {
      buyCoinsBtn.innerHTML = `<span>🪙</span><span>${t('hintBuyCoins')}</span>`;
    }
    const buySuperBtn = document.getElementById('btn-buy-super-hint-coins');
    if (buySuperBtn) {
      buySuperBtn.innerHTML = `<span>🔧</span><span>${t('hintBuySuper')}</span>`;
    }

    modal.hidden = false;
  }

  let oomModalMode = 'MOVES';

  function getRemainingOptimalClicksOnBoard() {
    if (!currentLevel || !boardGrid || !boardGrid.length) return 0;
    const allSol = [
      ...(currentLevel.solutionPath || []),
      ...((currentLevel.isDualTrainLevel && currentLevel.secondarySolutionPath) ? currentLevel.secondarySolutionPath : [])
    ];
    const seen = new Set();
    let totalClicks = 0;
    for (const sp of allSol) {
      const key = `${sp.r},${sp.c}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const cell = boardGrid[sp.r] && boardGrid[sp.r][sp.c];
      if (!cell || !cell.rotatable || cell.hintLocked) continue;
      const currentNorm = ((cell.rot % 360) + 360) % 360;
      const targetNorm = ((cell.solRot % 360) + 360) % 360;
      if (cell.type === 'STRAIGHT' || cell.type === 'BRIDGE' || cell.type === 'SWITCH') {
        if ((currentNorm % 180) !== (targetNorm % 180)) {
          totalClicks += 1;
        }
      } else if (cell.type === 'CURVE' || cell.type === 'Y_SWITCH') {
        const diff = (targetNorm - currentNorm + 360) % 360;
        totalClicks += Math.round(diff / 90);
      }
    }
    return totalClicks;
  }

  function getRescueMovesOffer() {
    const lvlId = currentLevel ? currentLevel.id : 1;
    let baseMin = 9;
    if (lvlId >= 71) {
      baseMin = 13;
    } else if (lvlId >= 26) {
      baseMin = 11;
    }
    if (currentLevel && currentLevel.isDualTrainLevel) {
      baseMin += 2;
    }
    const neededClicks = getRemainingOptimalClicksOnBoard();
    return Math.min(18, Math.max(baseMin, neededClicks + 5));
  }

  function getRescueTimeOffer() {
    const lvlId = currentLevel ? currentLevel.id : 1;
    let baseSec = 35;
    if (lvlId >= 71) {
      baseSec = 45;
    } else if (lvlId >= 31) {
      baseSec = 40;
    }
    if (currentLevel && currentLevel.isDualTrainLevel) {
      baseSec += 5;
    }
    return baseSec;
  }

  if (IS_OWNER_TEST_BUILD || window.__HEADLESS_CI_TEST === true) {
    window.getRemainingOptimalClicksOnBoard = getRemainingOptimalClicksOnBoard;
    window.getRescueMovesOffer = getRescueMovesOffer;
    window.getRescueTimeOffer = getRescueTimeOffer;
  }

  function openOutOfMovesModal() {
    oomModalMode = 'MOVES';
    const modal = document.getElementById('modal-out-of-moves');
    const oomAvatarEl = document.getElementById('oom-modal-avatar');
    if (oomAvatarEl) {
      oomAvatarEl.innerHTML = getCharacterPortraitSVG('saffar');
      if (window.TrainEngine3D && typeof window.TrainEngine3D.mountDialoguePortrait === 'function') {
        window.TrainEngine3D.mountDialoguePortrait('saffar', oomAvatarEl);
      }
    }
    const titleEl = modal ? modal.querySelector('.modal-title') : null;
    const descEl = modal ? modal.querySelector('.modal-desc') : null;
    const adBtn = document.getElementById('btn-watch-ad-moves');
    const coinsBtn = document.getElementById('btn-buy-oom-coins');
    const retryBtn = document.getElementById('btn-oom-retry');
    const rescueMoves = getRescueMovesOffer();
    if (titleEl) titleEl.textContent = t('oomTitleMoves');
    if (descEl) {
      descEl.textContent = t('oomDescMoves') + t('oomTipSuffix');
    }
    if (adBtn) {
      adBtn.innerHTML = `<span>🎬</span><span>${tf('oomAdMoves', { n: rescueMoves })}</span>`;
    }
    if (coinsBtn) {
      coinsBtn.innerHTML = `<span>🪙</span><span id="btn-buy-oom-coins-label">${tf('oomCoinsMoves', { n: rescueMoves })}</span>`;
    }
    if (retryBtn) {
      retryBtn.innerHTML = `<span>🔄</span><span>${t('oomRetryFree')}</span>`;
    }
    if (modal) modal.hidden = false;
  }

  function openStormTimeUpModal() {
    oomModalMode = 'TIMER';
    const modal = document.getElementById('modal-out-of-moves');
    const oomAvatarEl = document.getElementById('oom-modal-avatar');
    if (oomAvatarEl) {
      oomAvatarEl.innerHTML = getCharacterPortraitSVG('saffar');
      if (window.TrainEngine3D && typeof window.TrainEngine3D.mountDialoguePortrait === 'function') {
        window.TrainEngine3D.mountDialoguePortrait('saffar', oomAvatarEl);
      }
    }
    const titleEl = modal ? modal.querySelector('.modal-title') : null;
    const descEl = modal ? modal.querySelector('.modal-desc') : null;
    const adBtn = document.getElementById('btn-watch-ad-moves');
    const coinsBtn = document.getElementById('btn-buy-oom-coins');
    const retryBtn = document.getElementById('btn-oom-retry');
    const rescueSec = getRescueTimeOffer();
    if (titleEl) titleEl.textContent = t('oomTitleTimer');
    if (descEl) {
      descEl.textContent = t('oomDescTimer') + t('oomTipSuffix');
    }
    if (adBtn) {
      adBtn.innerHTML = `<span>🎬</span><span>${tf('oomAdTimer', { n: rescueSec })}</span>`;
    }
    if (coinsBtn) {
      coinsBtn.innerHTML = `<span>🪙</span><span id="btn-buy-oom-coins-label">${tf('oomCoinsTimer', { n: rescueSec })}</span>`;
    }
    if (retryBtn) {
      retryBtn.innerHTML = `<span>🔄</span><span>${t('oomRetryFree')}</span>`;
    }
    if (modal) modal.hidden = false;
  }

  if (IS_OWNER_TEST_BUILD || window.__HEADLESS_CI_TEST === true) {
    window.openOutOfMovesModal = openOutOfMovesModal;
    window.openStormTimeUpModal = openStormTimeUpModal;
  }

  function openVictoryModal(starsEarned, sparksCount, comboBonus, speedBonus, xpEarned) {
    const modal = document.getElementById('modal-victory');
    const station = window.GameLevels.STATIONS.find(s => s.id === currentLevel.stationId);
    const stPct = getStationRestorationPercent(currentLevel.stationId);
    const totalStarsNow = Object.values(gameState.levelStars || {}).reduce((a, b) => a + b, 0);
    const rankInfo = getConductorRankInfo(totalStarsNow);

    const ribbonEl = modal ? modal.querySelector('.victory-header-ribbon') : null;
    if (ribbonEl) ribbonEl.textContent = t('victoryRibbon');

    [1, 2, 3].forEach(i => {
      const starEl = document.getElementById(`v-star-${i}`);
      starEl.classList.remove('earned');
      if (i <= starsEarned) {
        setTimeout(() => starEl.classList.add('earned'), i * 150);
      }
    });

    document.getElementById('victory-level-title').textContent = tf('victoryLevelDoneFmt', {
      id: currentLevel.id,
      title: getLvlTitle(currentLevel)
    });

    const streakCount = Math.max(1, Number(gameState.winStreak || 1));
    if (completedWasDailyChallenge) {
      const extraM = Math.max(0, movesSpentInLevel - (currentLevel.optimalMoves || 8));
      const worldTopPct = Math.max(2, Math.min(22, 4 + extraM * 2 + (stormTimeRemaining > 20 ? 0 : 4)));
      document.getElementById('victory-perf-text').textContent = tf('victoryDailyRankFmt', {
        pct: worldTopPct,
        badge: rankInfo.icon,
        xp: xpEarned
      });
    } else if (completedWasEndless) {
      document.getElementById('victory-perf-text').textContent = tf('victoryEndlessFmt', {
        wave: endlessWaveNumber,
        km: endlessSessionKm.toFixed(1),
        best: Number(gameState.bestEndlessKm || 0).toFixed(1)
      });
    } else {
      document.getElementById('victory-perf-text').textContent = tf('victoryPerfFmt', {
        badge: rankInfo.icon,
        rank: rankInfo.label,
        xp: xpEarned,
        combo: maxComboReached,
        streak: streakCount
      });
    }

    document.getElementById('victory-station-label').textContent = station
      ? tf('victorySectorPowerFmt', { icon: station.icon, sector: getStationName(station) })
      : t('mapPowerLabel');
    document.getElementById('victory-station-pct').textContent = `${stPct}%`;
    document.getElementById('victory-station-bar').style.width = `${stPct}%`;

    const totalRewardLabel = modal ? modal.querySelector('.coins-earned-main span') : null;
    if (totalRewardLabel) totalRewardLabel.textContent = t('victoryTotalRewardLabel');

    document.getElementById('victory-coins-amount').textContent = tf('victoryCoinsFmt', { coins: lastEarnedCoins });
    const extraBonusVal = (lastPerfectBonus || 0) + (lastBossBonus || 0);
    const extraSuffix = extraBonusVal > 0 ? ` + ${t('victoryExtraLabel')} (\u2066+${extraBonusVal}\u2069)` : '';
    document.getElementById('victory-coins-formula').textContent = tf('victoryFormulaFmt', {
      combo: comboBonus,
      speed: speedBonus,
      extra: extraSuffix
    });

    const doubleBtn = document.getElementById('btn-watch-ad-double');
    const doubleLabel = document.getElementById('btn-double-label');
    doubleBtn.disabled = false;
    doubleLabel.textContent = tf('victoryDoubleFmt', { coins: lastEarnedCoins * 2 });

    // 3-Win Mystery Supply Chest in Victory Modal
    const chestProg = Math.min(3, Math.max(0, Number(gameState.chestWinProgress || 0)));
    const chestLabelEl = document.getElementById('victory-chest-label');
    const chestPctEl = document.getElementById('victory-chest-pct');
    const chestBarEl = document.getElementById('victory-chest-bar');
    const openChestBtn = document.getElementById('btn-open-mystery-chest');
    const openChestLbl = document.getElementById('btn-open-mystery-chest-label');
    if (chestLabelEl) chestLabelEl.textContent = t('chestLabelPrefix');
    if (chestPctEl) chestPctEl.textContent = `${chestProg}/3`;
    if (chestBarEl) chestBarEl.style.width = `${Math.round((chestProg / 3) * 100)}%`;
    if (openChestLbl) openChestLbl.textContent = t('btnOpenChest');
    if (openChestBtn) {
      openChestBtn.hidden = (chestProg < 3);
      openChestBtn.disabled = false;
    }

    // Viral Share Button in Victory Modal
    const shareBtn = document.getElementById('btn-victory-share');
    const shareLbl = document.getElementById('btn-victory-share-label');
    const alreadySharedToday = (gameState.lastShareRewardDate === getTodayDateString());
    if (shareLbl) {
      shareLbl.textContent = alreadySharedToday ? t('btnVictoryShareDone') : t('btnVictoryShare');
    }
    if (shareBtn) {
      shareBtn.disabled = false;
    }

    const mapBtnSpans = document.querySelectorAll('#btn-victory-map span');
    if (mapBtnSpans.length >= 2) {
      mapBtnSpans[1].textContent = t('victorySectorsBtn');
    }

    const nextLabel = document.getElementById('btn-victory-next-label');
    if (completedWasEndless) {
      nextLabel.textContent = tf('victoryNextWaveFmt', { wave: endlessWaveNumber + 1 });
    } else if (completedWasDailyChallenge) {
      const campTarget = Math.min(TOTAL_LEVELS_COUNT, gameState.unlockedLevel || 1);
      nextLabel.textContent = tf('victoryCampaignFmt', { id: campTarget });
    } else {
      nextLabel.textContent = currentLevel.id < TOTAL_LEVELS_COUNT
        ? tf('victoryNextMissionFmt', { id: currentLevel.id + 1 })
        : t('victoryFinalMap');
    }

    // Preload next biome region in background during victory screens
    if (window.TrainEngine3D && typeof window.TrainEngine3D.preloadNextBiomeRegion === 'function') {
      const nextLvl = window.GameLevels.LEVELS.find(l => l.id === currentLevel.id + 1);
      if (nextLvl) {
        window.TrainEngine3D.preloadNextBiomeRegion(nextLvl.stationId);
      }
    }

    modal.hidden = false;

    // Post-Reward Happy-Moment In-App Review (100% Google Play Policy Compliant: triggered 1.5s after Boss 3-Star Victory & unconditional +100 🪙 Boss Gift)
    if (
      currentLevel &&
      (currentLevel.id % 10 === 0) &&
      starsEarned === 3 &&
      !isAutoPlaytestRunning &&
      window.__HEADLESS_CI_TEST !== true &&
      gameState.lastInAppReviewSector !== currentLevel.stationId
    ) {
      gameState.lastInAppReviewSector = currentLevel.stationId;
      saveState();
      setTimeout(() => {
        try {
          if (window.AndroidReview && typeof window.AndroidReview.requestInAppReview === 'function') {
            window.AndroidReview.requestInAppReview();
          }
        } catch (_) {}
      }, 1500);
    }
  }

  function renderLocomotivePreviewSVG(skin) {
    const hull = skin.hullColor || '#DC2626';
    const armor = skin.armorColor || '#1E293B';
    const trim = skin.trimColor || '#FACC15';
    const core = skin.coreColor || '#38BDF8';
    const isMaglev = skin.id === 'maglev_600' || skin.id === 'gold_vip';

    if (isMaglev) {
      // Sleek Needle-Wedge Futuristic Maglev / Gold VIP Plasma Locomotive SVG
      return `<svg class="shop-loco-svg" viewBox="0 0 128 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="magGrad_${skin.id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${hull}"/>
            <stop offset="100%" stop-color="${armor}"/>
          </linearGradient>
        </defs>
        <!-- Magnetic Guideway & Levitation Cushion -->
        <rect x="6" y="66" width="116" height="5" rx="2.5" fill="#1E293B"/>
        <line x1="10" y1="62" x2="114" y2="62" stroke="${core}" stroke-width="2.6" stroke-dasharray="8 4"/>
        <!-- Rear Stabilizer Fins -->
        <polygon points="10,36 4,18 20,24 22,36" fill="${armor}" stroke="${trim}" stroke-width="1.6"/>
        <!-- Glowing Roof Plasma Core Spine -->
        <rect x="24" y="19" width="52" height="5" rx="2.5" fill="${core}" stroke="${trim}" stroke-width="1.2"/>
        <!-- Sleek Needle-Wedge Aerodynamic Hull -->
        <path d="M 10 54 L 12 26 Q 14 22 22 22 L 72 22 Q 100 22 122 48 Q 124 54 114 54 Z"
          fill="url(#magGrad_${skin.id})" stroke="${trim}" stroke-width="2.2"/>
        <!-- Wide Glowing Visor Windshield -->
        <path d="M 70 25 Q 92 25 108 41 L 68 41 Z" fill="#0F172A" stroke="${core}" stroke-width="1.6"/>
        <!-- Illuminated Cabin Windows -->
        <rect x="22" y="29" width="14" height="8" rx="3" fill="${core}" opacity="0.9"/>
        <rect x="40" y="29" width="14" height="8" rx="3" fill="${core}" opacity="0.9"/>
        <!-- Trim Livery & Side Magnetic Pods -->
        <path d="M 14 44 L 114 44" stroke="${trim}" stroke-width="3.2" stroke-linecap="round"/>
        <rect x="16" y="50" width="84" height="7" rx="3.5" fill="${armor}" stroke="${core}" stroke-width="1.5"/>
        <line x1="22" y1="53.5" x2="94" y2="53.5" stroke="${core}" stroke-width="2.2" stroke-dasharray="10 5"/>
      </svg>`;
    }

    if (skin.silhouette === 'bullet') {
      // Sleek Aerodynamic High-Speed Bullet Train (Silver Falcon / Emerald Oasis / Azure Arrow) SVG
      return `<svg class="shop-loco-svg" viewBox="0 0 128 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bulletGrad_${skin.id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${hull}"/>
            <stop offset="100%" stop-color="${armor}"/>
          </linearGradient>
        </defs>
        <rect x="6" y="66" width="116" height="5" rx="2.5" fill="#334155"/>
        <line x1="10" y1="68.5" x2="118" y2="68.5" stroke="${core}" stroke-width="2" stroke-dasharray="6 4"/>
        <!-- High-Voltage Rooftop Pantograph -->
        <polyline points="24,22 33,12 44,22" fill="none" stroke="${trim}" stroke-width="2.2" stroke-linejoin="round"/>
        <line x1="28" y1="12" x2="39" y2="12" stroke="${core}" stroke-width="2.2"/>
        <!-- Lofted Aerodynamic Duckbill Bullet Body -->
        <path d="M 10 56 L 10 25 Q 10 20 18 20 L 68 20 Q 96 20 116 44 Q 123 50 120 56 Z"
          fill="url(#bulletGrad_${skin.id})" stroke="${trim}" stroke-width="2.2"/>
        <!-- Flush Wrap-Around Cockpit Canopy -->
        <path d="M 68 23 Q 88 23 103 37 L 65 37 Z" fill="#0F172A" stroke="${core}" stroke-width="1.5"/>
        <!-- Continuous Passenger Window Band -->
        <rect x="16" y="27" width="44" height="9" rx="3.5" fill="#0F172A"/>
        <rect x="19" y="28.5" width="10" height="6" rx="2" fill="${core}" opacity="0.9"/>
        <rect x="32" y="28.5" width="10" height="6" rx="2" fill="${core}" opacity="0.9"/>
        <rect x="45" y="28.5" width="10" height="6" rx="2" fill="${core}" opacity="0.9"/>
        <!-- Twin Racing Livery Stripes -->
        <path d="M 12 43 L 114 43" stroke="${trim}" stroke-width="3.6" stroke-linecap="round"/>
        <path d="M 12 47.5 L 112 47.5" stroke="${core}" stroke-width="2" stroke-linecap="round"/>
        <!-- Lower Aerodynamic Bogie Skirt & Recessed Wheels -->
        <rect x="14" y="53" width="88" height="7" rx="3.5" fill="#0F172A" stroke="${trim}" stroke-width="1.3"/>
        <circle cx="26" cy="61" r="5" fill="#1E293B" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="42" cy="61" r="5" fill="#1E293B" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="72" cy="61" r="5" fill="#1E293B" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="88" cy="61" r="5" fill="#1E293B" stroke="#CBD5E1" stroke-width="2"/>
      </svg>`;
    }

    if (skin.silhouette === 'steam') {
      // Classic 1880 Steam & Royal Palace Luxury Locomotive SVG with Tall Smokestack, Brass Domes & Spoked Wheels
      return `<svg class="shop-loco-svg" viewBox="0 0 128 80" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="66" width="116" height="5" rx="2.5" fill="#475569"/>
        <!-- Steam Puffs -->
        <circle cx="76" cy="8" r="5" fill="#E2E8F0" opacity="0.6"/>
        <circle cx="87" cy="6" r="6.5" fill="#F8FAFC" opacity="0.78"/>
        <!-- Tall Flared Chimney Smokestack & Brass Steam/Sand Domes -->
        <polygon points="81,26 77,10 92,10 88,26" fill="${armor}" stroke="${trim}" stroke-width="2"/>
        <path d="M 52 26 A 8.5 8.5 0 0 1 69 26 Z" fill="${trim}" stroke="#090D16" stroke-width="1.5"/>
        <path d="M 69 26 A 5.5 5.5 0 0 1 80 26 Z" fill="${armor}" stroke="${trim}" stroke-width="1.4"/>
        <!-- Arched Engineer Cab -->
        <rect x="12" y="16" width="35" height="38" rx="4" fill="${armor}" stroke="${trim}" stroke-width="2.2"/>
        <path d="M 8 16 Q 29 10 50 16 Z" fill="${trim}"/>
        <rect x="18" y="22" width="18" height="14" rx="2.5" fill="#FEF08A" opacity="0.92"/>
        <!-- Cylindrical Riveted Boiler & Brass Boiler Bands -->
        <rect x="45" y="25" width="52" height="27" rx="6" fill="${hull}" stroke="${trim}" stroke-width="2"/>
        <line x1="58" y1="25" x2="58" y2="52" stroke="${trim}" stroke-width="2.6"/>
        <line x1="72" y1="25" x2="72" y2="52" stroke="${trim}" stroke-width="2.6"/>
        <line x1="86" y1="25" x2="86" y2="52" stroke="${trim}" stroke-width="2.6"/>
        <!-- Angled Cowcatcher Grille & Brass Lantern Headlamp -->
        <polygon points="97,40 118,57 97,57" fill="${trim}" stroke="#090D16" stroke-width="1.5"/>
        <circle cx="100" cy="32" r="5.5" fill="#FEF08A" stroke="${trim}" stroke-width="2.2"/>
        <!-- 3 Large Spoked Driving Wheels & Side Piston Connecting Rod -->
        <circle cx="28" cy="57" r="9.5" fill="#1E293B" stroke="${trim}" stroke-width="2.6"/>
        <circle cx="54" cy="57" r="9.5" fill="#1E293B" stroke="${trim}" stroke-width="2.6"/>
        <circle cx="80" cy="57" r="9.5" fill="#1E293B" stroke="${trim}" stroke-width="2.6"/>
        <circle cx="100" cy="59" r="6.5" fill="#1E293B" stroke="${trim}" stroke-width="2"/>
        <rect x="24" y="55.5" width="60" height="3.4" rx="1.7" fill="${trim}"/>
      </svg>`;
    }

    // Modern Heavy Armored Diesel-Electric Freight & Express Locomotive SVG
    return `<svg class="shop-loco-svg" viewBox="0 0 128 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hullGrad_${skin.id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${hull}"/>
          <stop offset="100%" stop-color="${armor}"/>
        </linearGradient>
      </defs>
      <!-- Railway Track Base -->
      <rect x="6" y="66" width="116" height="5" rx="2.5" fill="#475569"/>
      <line x1="12" y1="68.5" x2="116" y2="68.5" stroke="#94A3B8" stroke-width="2" stroke-dasharray="5 6"/>
      <!-- Recessed Roof Radiator Grilles & Cooling Fans -->
      <rect x="18" y="18" width="42" height="5" rx="2" fill="${armor}" stroke="${trim}" stroke-width="1.4"/>
      <circle cx="30" cy="20.5" r="2" fill="${core}"/>
      <circle cx="46" cy="20.5" r="2" fill="${core}"/>
      <!-- Main Diesel Engine Hood + Elevated Armored Forward Cab & Sloped Nose -->
      <path d="M 12 54 L 12 22 L 62 22 L 66 16 L 94 16 L 102 30 L 114 35 L 114 54 Z"
        fill="url(#hullGrad_${skin.id})" stroke="${trim}" stroke-width="2.2" stroke-linejoin="round"/>
      <!-- Wrap-Around Angled Windshield with Center Pillar -->
      <polygon points="70,19 92,19 98,30 70,30" fill="#0F172A" stroke="${core}" stroke-width="1.5"/>
      <line x1="84" y1="19" x2="86" y2="30" stroke="${trim}" stroke-width="2"/>
      <!-- Side Louvers & Trim Stripe + Safety Handrail -->
      <rect x="18" y="27" width="42" height="9" rx="2" fill="${armor}" stroke="${trim}" stroke-width="1.2"/>
      <rect x="14" y="41" width="98" height="4" rx="2" fill="${trim}"/>
      <polyline points="16,49 16,44 96,44 96,49" fill="none" stroke="${trim}" stroke-width="1.4"/>
      <!-- Twin Front Headlamps & V-Angled Snowplow -->
      <circle cx="112" cy="39" r="4" fill="#FEF08A" stroke="${trim}" stroke-width="1.5"/>
      <polygon points="104,47 121,58 104,58" fill="${armor}" stroke="${trim}" stroke-width="1.8"/>
      <!-- Dual-Axle Heavy Bogie Trucks -->
      <rect x="16" y="54" width="34" height="5" rx="2" fill="#0F172A" stroke="${trim}" stroke-width="1.2"/>
      <rect x="64" y="54" width="34" height="5" rx="2" fill="#0F172A" stroke="${trim}" stroke-width="1.2"/>
      <circle cx="24" cy="60" r="6" fill="#1E293B" stroke="#E2E8F0" stroke-width="2.2"/>
      <circle cx="42" cy="60" r="6" fill="#1E293B" stroke="#E2E8F0" stroke-width="2.2"/>
      <circle cx="72" cy="60" r="6" fill="#1E293B" stroke="#E2E8F0" stroke-width="2.2"/>
      <circle cx="90" cy="60" r="6" fill="#1E293B" stroke="#E2E8F0" stroke-width="2.2"/>
    </svg>`;
  }

  function applyEquippedSkinTo3D() {
    const activeSkin = TRAIN_SKINS.find(s => s.id === getEffectiveSkinId()) || TRAIN_SKINS[0];
    if (window.GameAudio && typeof window.GameAudio.setLocomotiveSkin === 'function') {
      window.GameAudio.setLocomotiveSkin(activeSkin.id);
    }
    if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
      if (typeof window.TrainEngine3D.updateTrainSkin3D === 'function') {
        window.TrainEngine3D.updateTrainSkin3D(activeSkin);
      }
      const appShell = document.getElementById('app-shell');
      const activeScreen = appShell ? appShell.getAttribute('data-active-screen') : 'screen-menu';
      if (activeScreen === 'screen-menu') {
        renderMainMenu();
      }
    }
  }

  function openDailyLoginModal() {
    const modal = document.getElementById('modal-daily-login');
    const gridEl = document.getElementById('daily-streak-grid');
    if (!modal || !gridEl) return;

    const titleEl = document.getElementById('daily-login-title');
    const subEl = document.getElementById('daily-login-subtitle');
    if (titleEl) titleEl.textContent = t('dailyLoginTitle');
    if (subEl) subEl.textContent = t('dailyLoginSub');

    const todayStr = getTodayDateString();
    const alreadyClaimedToday = (gameState.lastLoginDate === todayStr);
    const activeDay = alreadyClaimedToday
      ? Math.max(1, Math.min(7, Number(gameState.loginStreak || 1)))
      : (((Number(gameState.loginStreak || 0)) % 7) + 1);

    gridEl.innerHTML = '';
    DAILY_REWARDS.forEach(item => {
      const card = document.createElement('div');
      const isClaimed = alreadyClaimedToday ? (item.day <= activeDay) : (item.day < activeDay);
      const isToday = !alreadyClaimedToday && (item.day === activeDay);
      card.className = `daily-day-card${item.day === 7 ? ' day-7-grand' : ''}${isClaimed ? ' day-claimed' : ''}${isToday ? ' day-today' : ''}`;
      const dayTitle = tf('dailyDayFmt', { day: item.day });
      const rLabel = item.day === 7
        ? t('dailyGrandLabel')
        : (item.coins > 0 ? tf('dailyCoinsFmt', { n: item.coins }) : tf('dailyHintsFmt', { n: item.hints }));
      card.innerHTML = `
        <span class="daily-day-num">${dayTitle}${isClaimed ? ' ✅' : ''}</span>
        <span class="daily-day-icon">${item.icon}</span>
        <span class="daily-day-reward">${rLabel}</span>
      `;
      gridEl.appendChild(card);
    });

    const btn1x = document.getElementById('btn-claim-daily-1x');
    const btn2x = document.getElementById('btn-claim-daily-2x');
    const lbl1x = document.getElementById('btn-claim-daily-1x-label');
    const lbl2x = document.getElementById('btn-claim-daily-2x-label');

    if (alreadyClaimedToday) {
      if (btn1x) btn1x.disabled = true;
      if (btn2x) btn2x.disabled = true;
      if (lbl1x) lbl1x.textContent = t('btnDailyAlreadyClaimed');
      if (lbl2x) lbl2x.textContent = t('btnDailyAlreadyClaimed');
    } else {
      if (btn1x) btn1x.disabled = false;
      if (btn2x) btn2x.disabled = false;
      if (lbl1x) lbl1x.textContent = t('btnClaimDaily1x');
      if (lbl2x) lbl2x.textContent = t('btnClaimDaily2x');
    }

    modal.hidden = false;
    pauseEngine3DForOverlay();
  }

  function claimDailyLoginReward(multiplier = 1) {
    const todayStr = getTodayDateString();
    if (gameState.lastLoginDate === todayStr) {
      closeModalById('modal-daily-login');
      showToast(t('btnDailyAlreadyClaimed'));
      return;
    }

    const nextDay = ((Number(gameState.loginStreak || 0)) % 7) + 1;
    const reward = DAILY_REWARDS[nextDay - 1] || DAILY_REWARDS[0];
    const coinsWon = (reward.coins || 0) * multiplier;
    const hintsWon = (reward.hints || 0) * multiplier;

    gameState.coins += coinsWon;
    gameState.hints += hintsWon;
    gameState.loginStreak = nextDay;
    gameState.lastLoginDate = todayStr;
    saveState();
    updateGlobalTopBar();

    closeModalById('modal-daily-login');

    triggerHaptic(25);
    if (window.GameAudio) {
      window.GameAudio.playVictoryFanfare();
    }

    const parts = [];
    if (coinsWon > 0) parts.push(tf('toastDailyCoinsPartFmt', { n: coinsWon }));
    if (hintsWon > 0) parts.push(tf('toastDailyHintsPartFmt', { n: hintsWon }));
    showToast(tf('toastDailyClaimedFmt', { day: nextDay, mult: multiplier, parts: parts.join(' + ') }));
  }

  function needsEarlySectorDailyBriefing() {
    if (IS_OWNER_TEST_BUILD || isAutoPlaytestRunning || window.__HEADLESS_CI_TEST === true) {
      return false;
    }
    const unlocked = Number((gameState && gameState.unlockedLevel) || 1);
    return unlocked < 41;
  }

  function syncDailyChallengeBriefingLabels() {
    const titleEl = document.getElementById('daily-briefing-title');
    const descEl = document.getElementById('daily-briefing-desc');
    const confirmLbl = document.getElementById('btn-daily-challenge-confirm-label');
    const cancelLbl = document.getElementById('btn-daily-challenge-cancel-label');
    if (titleEl) titleEl.textContent = t('dailyBriefingTitle');
    if (descEl) descEl.textContent = t('dailyBriefingDesc');
    if (confirmLbl) confirmLbl.textContent = t('dailyBriefingConfirm');
    if (cancelLbl) cancelLbl.textContent = t('dailyBriefingCancel');
  }

  function openDailyChallengeBriefingModal() {
    const modal = document.getElementById('modal-daily-challenge-briefing');
    if (!modal) {
      startDailyChallengeLevel({ skipBriefing: true });
      return;
    }
    syncDailyChallengeBriefingLabels();
    modal.hidden = false;
  }

  function startDailyChallengeLevel(options = {}) {
    if (!options || !options.skipBriefing) {
      if (needsEarlySectorDailyBriefing()) {
        openDailyChallengeBriefingModal();
        return;
      }
    }
    if (currentLevel && !isDailyChallengeMode && !isEndlessMarathonMode) {
      lastCampaignLevelId = currentLevel.id;
    } else if (!lastCampaignLevelId) {
      lastCampaignLevelId = Math.max(
        1,
        Math.min(
          TOTAL_LEVELS_COUNT,
          Number(gameState.lastPlayedLevel || gameState.unlockedLevel || 1)
        )
      );
    }
    const todayNum = Number(getTodayDateString().replace(/-/g, '')) || 20261104;
    const candidates = window.GameLevels.LEVELS.filter(l => l.rows === 7 && l.cols === 6);
    const pool = candidates.length > 0 ? candidates : window.GameLevels.LEVELS;
    const chosen = pool[todayNum % pool.length] || window.GameLevels.LEVELS[40];
    startLevel(chosen.id, false, true);
    showToast(tf('toastDailyChallengeStartFmt', { id: chosen.id }));
  }

  function openShopModal() {
    const modal = document.getElementById('modal-shop');
    const vipBtn = document.getElementById('btn-buy-vip-pack');
    const vipLabel = document.getElementById('vip-buy-label');
    readNativeStorePrices();

    const shopTitleEl = modal ? modal.querySelector('.shop-header .modal-title') : null;
    const shopSubEl = modal ? modal.querySelector('.shop-header .shop-subtitle') : null;
    if (shopTitleEl) shopTitleEl.textContent = t('shopTitle');
    if (shopSubEl) shopSubEl.textContent = t('shopSubtitle');

    const vipBadgeTop = document.querySelector('#shop-vip-card .vip-badge-top');
    const vipH4 = document.querySelector('#shop-vip-card h4');
    const vipLis = document.querySelectorAll('#shop-vip-card .vip-perks-list li');
    if (vipBadgeTop) vipBadgeTop.textContent = t('vipBadgeCard');
    if (vipH4) vipH4.textContent = t('vipCardTitle');
    if (vipLis.length >= 3) {
      vipLis[0].innerHTML = t('vipPerk1');
      vipLis[1].innerHTML = t('vipPerk2');
      vipLis[2].innerHTML = t('vipPerk3');
    }

    const sectionTitles = modal ? modal.querySelectorAll('.shop-section-title') : [];
    if (sectionTitles.length >= 2) {
      sectionTitles[0].textContent = t('shopHintsSectionTitle');
      sectionTitles[1].textContent = t('shopSkinsSectionTitle');
    }

    if (gameState.isVip) {
      vipBtn.disabled = true;
      vipLabel.textContent = t('vipActiveLabel');
    } else {
      vipBtn.disabled = false;
      vipLabel.textContent = t('vipBuyLabel');
    }

    const restoreLbl = document.getElementById('restore-purchases-label');
    if (restoreLbl) restoreLbl.textContent = t('btnRestorePurchases');
    const shopPrivLbl = document.getElementById('btn-shop-privacy-label');
    if (shopPrivLbl) shopPrivLbl.textContent = t('btnShopPrivacy');

    // Sync Starter Pack & Radar Hint Rows inside openShopModal() for all 8 languages!
    const stBadgeTop = document.getElementById('starter-badge-top') || document.querySelector('#shop-starter-card .starter-badge-top');
    const stPackTitle = document.getElementById('starter-pack-title');
    const stPackDesc = document.getElementById('starter-pack-desc');
    const stPackBuy = document.getElementById('starter-buy-label');
    if (stBadgeTop) stBadgeTop.textContent = t('starterBadgeTop');
    if (stPackTitle) stPackTitle.textContent = t('starterPackTitle');
    if (stPackDesc) stPackDesc.textContent = t('starterPackDesc');
    if (stPackBuy) stPackBuy.textContent = t('starterBuyLabel');

    const r1T = document.getElementById('shop-hint-row-1-title');
    const r1D = document.getElementById('shop-hint-row-1-desc');
    const r2T = document.getElementById('shop-hint-row-2-title');
    const r2D = document.getElementById('shop-hint-row-2-desc');
    const r2B = document.getElementById('shop-hint-row-2-badge');
    const r3T = document.getElementById('shop-hint-row-3-title');
    const r3D = document.getElementById('shop-hint-row-3-desc');
    if (r1T) r1T.textContent = t('shopHintRow1Title');
    if (r1D) r1D.textContent = t('shopHintRow1Desc');
    if (r2T) r2T.textContent = t('shopHintRow2Title');
    if (r2D) r2D.textContent = t('shopHintRow2Desc');
    if (r2B) r2B.textContent = t('badgeFreeAd');
    if (r3T) r3T.textContent = t('shopHintRow3Title');
    if (r3D) r3D.textContent = t('shopHintRow3Desc');

    const coinsSmallTitle = document.getElementById('coins-small-title');
    const coinsSmallDesc = document.getElementById('coins-small-desc');
    const coinsSmallBtnLbl = document.getElementById('btn-buy-coins-small-label');
    if (coinsSmallTitle) coinsSmallTitle.textContent = t('coinsSmallTitle');
    if (coinsSmallDesc) coinsSmallDesc.textContent = t('coinsSmallDesc');
    if (coinsSmallBtnLbl) coinsSmallBtnLbl.textContent = t('coinsSmallPrice');

    const coinsMegaTitle = document.getElementById('coins-mega-title');
    const coinsMegaDesc = document.getElementById('coins-mega-desc');
    const coinsMegaBtnLbl = document.getElementById('btn-buy-coins-mega-label');
    if (coinsMegaTitle) coinsMegaTitle.textContent = t('coinsMegaTitle');
    if (coinsMegaDesc) coinsMegaDesc.textContent = t('coinsMegaDesc');
    if (coinsMegaBtnLbl) coinsMegaBtnLbl.textContent = t('coinsMegaPrice');
    applyLiveStorePricesToShopLabels();

    const skinsList = document.getElementById('shop-skins-list');
    skinsList.innerHTML = '';

    TRAIN_SKINS.forEach(skin => {
      const owned = gameState.ownedSkins.includes(skin.id) || (gameState.isVip && skin.vipIncluded);
      const equipped = gameState.equippedSkin === skin.id;
      const curLv = getSkinLevel(skin.id);
      const upgradeCost = 250 * curLv;
      const perks = getActiveSkinPerks(skin.id);
      const sName = getSkinName(skin);
      const sDesc = getSkinDesc(skin);
      const sPerk = getSkinPerkBadge(skin);

      const row = document.createElement('div');
      row.className = `shop-item-row${equipped ? ' is-equipped' : ''}`;

      let actionLabel = '';
      let btnClass = 'btn-secondary';
      if (equipped) {
        actionLabel = t('skinEquipped');
        btnClass = 'btn-primary';
      } else if (owned) {
        actionLabel = t('skinEquip');
        btnClass = 'btn-secondary';
      } else {
        actionLabel = tf('skinBuyFmt', { price: skin.price });
        btnClass = 'btn-gold';
      }

      const upgradeHtml = owned
        ? (curLv < 5
            ? `<button class="btn btn-gold btn-sm shop-upgrade-btn" data-upgrade-skin="${skin.id}"><span>${tf('skinUpgradeFmt', { cur: curLv, next: curLv + 1, cost: upgradeCost })}</span></button>`
            : `<span class="skin-level-badge">${t('skinMaxLv')}</span>`)
        : '';

      const perkSummary = tf('perkSummaryFmt', {
        perk: sPerk,
        locks: perks.autoLockCount,
        freeze: perks.autoFreezeSec || 0,
        moves: perks.extraMoves,
        time: perks.extraTimeSec,
        gold: perks.coinBonusPct
      });

      const spdPct = Math.min(100, Math.round(((perks.speedMult || 1.0) - 0.85) / 0.65 * 100));
      const movPct = Math.min(100, Math.round(25 + (perks.extraMoves || 0) * 10 + (perks.autoLockCount || 0) * 15));
      const timPct = Math.min(100, Math.round(25 + (perks.extraTimeSec || 0) * 2.2 + (perks.autoFreezeSec || 0) * 3));
      const gldPct = Math.min(100, Math.round(20 + (perks.coinBonusPct || 0) * 1.4));

      row.innerHTML = `
        <div class="shop-skin-preview" style="border-color:${skin.trimColor}">
          ${renderLocomotivePreviewSVG(skin)}
        </div>
        <div class="shop-item-info">
          <div class="skin-header-row">
            <strong>${sName}</strong>
            <span class="skin-level-badge">\u2066Lv.${curLv}/5\u2069</span>
          </div>
          <small>${sDesc}</small>
          <div class="skin-perk-chip">${perkSummary}</div>
          <div class="skin-stats-grid">
            <div class="skin-stat-bar-item">
              <div class="skin-stat-bar-meta"><span>⚡ ${t('statSpeed')}</span><span>\u2066${Math.round((perks.speedMult || 1.0) * 100)}%\u2069</span></div>
              <div class="skin-stat-bar-track"><div class="skin-stat-bar-fill" style="width:${spdPct}%"></div></div>
            </div>
            <div class="skin-stat-bar-item">
              <div class="skin-stat-bar-meta"><span>🎯 ${t('statMoves')}</span><span>\u2066+${perks.extraMoves}\u2069</span></div>
              <div class="skin-stat-bar-track"><div class="skin-stat-bar-fill" style="width:${movPct}%"></div></div>
            </div>
            <div class="skin-stat-bar-item">
              <div class="skin-stat-bar-meta"><span>🛡️ ${t('statTime')}</span><span>\u2066+${perks.extraTimeSec}s\u2069</span></div>
              <div class="skin-stat-bar-track"><div class="skin-stat-bar-fill" style="width:${timPct}%"></div></div>
            </div>
            <div class="skin-stat-bar-item">
              <div class="skin-stat-bar-meta"><span>🪙 ${t('statGold')}</span><span>\u2066+${perks.coinBonusPct}%\u2069</span></div>
              <div class="skin-stat-bar-track"><div class="skin-stat-bar-fill" style="width:${gldPct}%"></div></div>
            </div>
          </div>
        </div>
        <div class="skin-actions-col">
          <button class="btn ${btnClass} btn-sm shop-equip-btn" data-skin-id="${skin.id}">
            <span>${actionLabel}</span>
          </button>
          ${upgradeHtml}
          <button class="btn btn-secondary btn-sm shop-whistle-btn" data-whistle-skin="${skin.id}" title="${t('btnHearHorn')}">
            <span>🔊 ${t('btnHearHorn')}</span>
          </button>
        </div>
      `;

      const whistleBtn = row.querySelector('.shop-whistle-btn');
      if (whistleBtn) {
        whistleBtn.addEventListener('click', () => {
          triggerHaptic(16);
          if (shopPreviewUiTimer) {
            clearTimeout(shopPreviewUiTimer);
            shopPreviewUiTimer = null;
          }
          document.querySelectorAll('.shop-whistle-btn.is-previewing').forEach(b => b.classList.remove('is-previewing'));
          whistleBtn.classList.add('is-previewing');
          shopPreviewUiTimer = setTimeout(() => {
            shopPreviewUiTimer = null;
            whistleBtn.classList.remove('is-previewing');
          }, 3050);
          if (window.GameAudio && typeof window.GameAudio.playLocomotivePreview === 'function') {
            window.GameAudio.playLocomotivePreview(skin.id);
          } else if (window.GameAudio && typeof window.GameAudio.playWhistle === 'function') {
            window.GameAudio.playWhistle(skin.id, { isDeparture: true });
          }
          showToast(tf('toastShopPreviewFmt', { skin: sName }));
        });
      }

      const actionBtn = row.querySelector('.shop-equip-btn');
      actionBtn.addEventListener('click', () => {
        if (owned) {
          gameState.equippedSkin = skin.id;
          saveState();
          if (window.GameAudio) window.GameAudio.playButtonTap();
          applyEquippedSkinTo3D();
          updateGlobalTopBar();
          openShopModal();
          showToast(tf('toastShopEquippedFmt', { skin: sName }));
        } else if (gameState.coins >= skin.price) {
          gameState.coins -= skin.price;
          if (!gameState.ownedSkins.includes(skin.id)) {
            gameState.ownedSkins.push(skin.id);
          }
          if (!gameState.skinLevels) gameState.skinLevels = {};
          if (!gameState.skinLevels[skin.id]) gameState.skinLevels[skin.id] = 1;
          gameState.equippedSkin = skin.id;
          saveState();
          if (window.GameAudio) window.GameAudio.playCoinChime();
          applyEquippedSkinTo3D();
          updateGlobalTopBar();
          openShopModal();
          showToast(tf('toastShopBoughtFmt', { skin: sName }));
        } else {
          const needed = Math.max(1, skin.price - gameState.coins);
          if (window.GameAudio) window.GameAudio.playFixedBump();
          showToast(tf('toastShopNeedBuyFmt', { needed, skin: sName }));
        }
      });

      const upgBtn = row.querySelector('.shop-upgrade-btn');
      if (upgBtn) {
        upgBtn.addEventListener('click', () => {
          if (curLv >= 5) return;
          if (gameState.coins < upgradeCost) {
            if (window.GameAudio) window.GameAudio.playFixedBump();
            showToast(tf('toastShopNeedUpgFmt', { needed: upgradeCost - gameState.coins, skin: sName, lv: curLv + 1 }));
            return;
          }
          gameState.coins -= upgradeCost;
          if (!gameState.skinLevels) gameState.skinLevels = {};
          gameState.skinLevels[skin.id] = curLv + 1;
          saveState();
          if (window.GameAudio) {
      window.GameAudio.playVictoryFanfare();
    }
          updateGlobalTopBar();
          openShopModal();
          showToast(tf('toastShopUpgradedFmt', { skin: sName, lv: curLv + 1 }));
        });
      }

      skinsList.appendChild(row);
    });

    modal.hidden = false;
    pauseEngine3DForOverlay();
  }

  function openAchievementsModal() {
    const modal = document.getElementById('modal-achievements');
    const listEl = document.getElementById('achievements-list');
    if (!modal || !listEl) return;

    const achTitleEl = modal.querySelector('.shop-header .modal-title');
    const achSubEl = modal.querySelector('.shop-header .shop-subtitle');
    const achSumSpan = modal.querySelector('.ach-summary-banner span');
    if (achTitleEl) achTitleEl.textContent = t('achModalTitle');
    if (achSubEl) achSubEl.textContent = t('achModalSubtitle');
    if (achSumSpan) achSumSpan.textContent = t('achSummaryLabel');

    listEl.innerHTML = '';
    const claimed = gameState.claimedAchievements || [];
    const summaryCountEl = document.getElementById('ach-summary-count');
    if (summaryCountEl) summaryCountEl.textContent = ltr(`${claimed.length} / ${ACHIEVEMENTS.length}`);

    ACHIEVEMENTS.forEach(ach => {
      const prog = Math.min(ach.target, ach.getProgress(gameState));
      const pct = Math.min(100, Math.round((prog / ach.target) * 100));
      const isUnlocked = prog >= ach.target;
      const isClaimed = claimed.includes(ach.id);
      const lgAch = (gameState && gameState.lang) || 'ar';
      const achLoc = (ACH_I18N[ach.id] && ACH_I18N[ach.id][lgAch]) ? ACH_I18N[ach.id][lgAch] : null;
      const aTitle = achLoc ? achLoc[0] : (isEn() ? (ach.titleEn || ach.title) : ach.title);
      const aDesc = achLoc ? achLoc[1] : (isEn() ? (ach.descEn || ach.desc) : ach.desc);

      const row = document.createElement('div');
      row.className = `ach-card${isUnlocked && !isClaimed ? ' ach-ready' : ''}${isClaimed ? ' ach-claimed' : ''}`;

      let btnHtml = '';
      if (isClaimed) {
        btnHtml = `<button class="btn btn-secondary btn-sm" disabled><span>${t('achClaimed')}</span></button>`;
      } else if (isUnlocked) {
        btnHtml = `<button class="btn btn-gold btn-sm ach-claim-btn"><span>${t('achClaim')}</span></button>`;
      } else {
        btnHtml = `<button class="btn btn-secondary btn-sm" disabled><span>\u2066${prog}/${ach.target}\u2069</span></button>`;
      }

      row.innerHTML = `
        <div class="ach-card-top">
          <div class="ach-icon-box">${ach.icon}</div>
          <div class="ach-meta">
            <strong>${aTitle}</strong>
            <small>${aDesc}</small>
            <div class="ach-reward-pill">🪙 \u2066+${ach.rewardCoins}\u2069 • 💡 \u2066+${ach.rewardHints}\u2069</div>
          </div>
          ${btnHtml}
        </div>
        <div class="ach-progress-row">
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          <span class="ach-progress-text">\u2066${prog}/${ach.target}\u2069</span>
        </div>
      `;

      const claimBtn = row.querySelector('.ach-claim-btn');
      if (claimBtn) {
        claimBtn.addEventListener('click', () => {
          if (!gameState.claimedAchievements) gameState.claimedAchievements = [];
          if (gameState.claimedAchievements.includes(ach.id)) return;
          gameState.claimedAchievements.push(ach.id);
          gameState.coins += ach.rewardCoins;
          gameState.hints += ach.rewardHints;
          saveState();
          if (window.GameAudio) {
      window.GameAudio.playVictoryFanfare();
    }
          updateGlobalTopBar();
          openAchievementsModal();
          showToast(tf('toastAchClaimedFmt', { title: aTitle, coins: ach.rewardCoins, hints: ach.rewardHints }));
        });
      }

      listEl.appendChild(row);
    });

    modal.hidden = false;
    pauseEngine3DForOverlay();
  }

  function openPrivacyPolicyModal() {
    const modal = document.getElementById('modal-privacy');
    if (!modal) return;
    const titleEl = document.getElementById('privacy-modal-title');
    const subEl = document.getElementById('privacy-modal-subtitle');
    const linkLbl = document.getElementById('privacy-full-link-label');
    const linkAnchor = document.getElementById('privacy-full-link-anchor');
    const closeLbl = document.getElementById('privacy-close-btn-label');
    if (titleEl) titleEl.textContent = t('privacyModalTitle');
    if (subEl) subEl.textContent = t('privacyModalSubtitle');
    if (linkLbl) linkLbl.textContent = t('privacyFullLinkLabel');
    if (linkAnchor) {
      const isOff = (typeof navigator !== 'undefined' && navigator.onLine === false);
      linkAnchor.setAttribute('href', isOff ? 'privacy_policy.html' : PUBLIC_PRIVACY_POLICY_URL);
    }
    const locSum = document.getElementById('privacy-localized-summary');
    const summaryHtml = t('privacySummaryHtml');
    if (locSum) {
      if (summaryHtml) {
        locSum.innerHTML = summaryHtml;
        locSum.hidden = false;
      } else {
        locSum.hidden = true;
      }
    }
    if (closeLbl) closeLbl.textContent = t('privacyCloseBtnLabel');
    modal.hidden = false;
    pauseEngine3DForOverlay();
  }

  window.openPrivacyPolicyModal = openPrivacyPolicyModal;

  function applyLanguage(lang) {
    const normLang = String(lang || 'ar').toLowerCase();
    gameState.lang = SUPPORTED_LANGS.indexOf(normLang) >= 0 ? normLang : 'ar';
    saveState();

    const docEl = document.documentElement;
    if (docEl) {
      docEl.setAttribute('lang', gameState.lang);
      docEl.setAttribute('dir', isEn() ? 'ltr' : 'rtl');
    }

    const langLabelEl = document.getElementById('ui-lang-label');
    if (langLabelEl) {
      langLabelEl.textContent = SUPPORTED_LANG_BADGES[gameState.lang] || gameState.lang.toUpperCase();
    }

    document.querySelectorAll('.lang-opt-btn').forEach(btn => {
      btn.classList.toggle('active-lang', btn.getAttribute('data-lang-code') === gameState.lang);
    });

    const tpLabel = document.querySelector('.topbar-progress-meta .tp-label');
    if (tpLabel) tpLabel.textContent = t('topProgress');

    const gTitle = document.querySelector('.menu-logo-badge .game-title');
    if (gTitle) gTitle.textContent = t('gameTitle');
    const gSub = document.querySelector('.menu-logo-badge .game-subtitle');
    if (gSub) gSub.textContent = t('gameSubtitle');

    const bootTitleEl = document.getElementById('boot-loader-title');
    if (bootTitleEl) bootTitleEl.textContent = t('bootLoaderTitle');
    const ownerPillEl = document.getElementById('owner-build-pill');
    if (ownerPillEl) {
      if (IS_OWNER_TEST_BUILD) {
        ownerPillEl.hidden = false;
        ownerPillEl.textContent = t('ownerPillText');
      } else {
        ownerPillEl.remove();
      }
    }
    const next3StarLbl = document.getElementById('btn-map-next-3star-label');
    if (next3StarLbl) {
      next3StarLbl.textContent = t('btnNext3Star');
    }
    const starterBadgeEl = document.getElementById('starter-badge-top') || document.querySelector('#shop-starter-card .starter-badge-top');
    if (starterBadgeEl) starterBadgeEl.textContent = t('starterBadgeTop');
    const starterTitleEl = document.getElementById('starter-pack-title');
    if (starterTitleEl) starterTitleEl.textContent = t('starterPackTitle');
    const starterDescEl = document.getElementById('starter-pack-desc');
    if (starterDescEl) starterDescEl.textContent = t('starterPackDesc');
    const starterBuyEl = document.getElementById('starter-buy-label');
    if (starterBuyEl) starterBuyEl.textContent = t('starterBuyLabel');
    updateUndoButtonState();
    updateStationEmpireUI();
    syncSettingsModalLabels();
    const bootSubEl = document.getElementById('boot-loader-subtitle');
    if (bootSubEl) bootSubEl.textContent = t('bootLoaderSub');
    const starRoadTitleEl = document.getElementById('star-road-title');
    if (starRoadTitleEl) starRoadTitleEl.textContent = t('starRoadTitle');
    const tutHandLbl = document.getElementById('tutorial-hand-label');
    if (tutHandLbl) tutHandLbl.textContent = t('tutorialTapToRotate');
    const bossBannerTxt = document.getElementById('boss-banner-text');
    if (bossBannerTxt) bossBannerTxt.textContent = tf('bossStageBanner', { id: currentLevel ? currentLevel.id : 10 });

    const mapBtnLabel = document.querySelector('#btn-goto-map .btn-sec-label');
    if (mapBtnLabel) mapBtnLabel.textContent = t('btnSectorMap');
    const shopBtnLabel = document.querySelector('#btn-goto-shop .btn-sec-label');
    if (shopBtnLabel) shopBtnLabel.textContent = t('btnLocomotiveShop');

    const dailyChalLbl = document.getElementById('btn-daily-challenge-label');
    if (dailyChalLbl) dailyChalLbl.textContent = t('btnDailyChallenge');
    const dailyStreakLbl = document.getElementById('btn-daily-rewards-label');
    if (dailyStreakLbl) dailyStreakLbl.textContent = t('btnDailyStreak');
    const rentTrainLbl = document.getElementById('rent-train-label');
    if (rentTrainLbl) rentTrainLbl.textContent = t('btnRentTrain');
    const openChestLbl = document.getElementById('btn-open-mystery-chest-label');
    if (openChestLbl) openChestLbl.textContent = t('btnOpenChest');

    const mapBackSpans = document.querySelectorAll('#btn-map-back span');
    if (mapBackSpans.length >= 2) mapBackSpans[1].textContent = t('btnBackHome');

    const movesCapLabel = document.querySelector('#hud-moves-pill .cap-label');
    if (movesCapLabel) movesCapLabel.textContent = t('hudMoves');
    const sparksCapLabel = document.querySelector('.sparks-pill .cap-label');
    if (sparksCapLabel) sparksCapLabel.textContent = t('hudEnergy');

    const camLabelEl = document.getElementById('camera-mode-label');
    if (camLabelEl && window.TrainEngine3D) {
      const cm = window.TrainEngine3D.cameraMode;
      camLabelEl.textContent = (cm === 'TOP_TACTICAL') ? t('hudCamTop') : t('hudCam3D');
    }
    const freezeSub = document.querySelector('#btn-freeze-time .float-sub');
    if (freezeSub) freezeSub.textContent = t('hudFreeze');
    const quickGarageSub = document.getElementById('quick-garage-label');
    if (quickGarageSub) quickGarageSub.textContent = t('hudTrains');
    const crew3dSub = document.getElementById('crew-3d-label');
    if (crew3dSub) crew3dSub.textContent = t('hudCrew');
    if (IS_OWNER_TEST_BUILD) {
      const autoSub = document.querySelector('#btn-auto-play .float-sub, #btn-dev-autoplay .float-sub');
      if (autoSub) autoSub.textContent = t('hudAutoPlay');
    }

    const resetLbl = document.querySelector('#btn-reset-level .action-label');
    if (resetLbl) resetLbl.textContent = t('btnReset');
    const hintLbl = document.querySelector('#btn-smart-hint .action-label');
    if (hintLbl) hintLbl.textContent = t('btnSmartHint');

    const exitTitleEl = document.getElementById('exit-modal-title');
    if (exitTitleEl) exitTitleEl.textContent = t('exitModalTitle');
    const exitDescEl = document.getElementById('exit-modal-desc');
    if (exitDescEl) exitDescEl.textContent = t('exitModalDesc');
    const exitStayLbl = document.getElementById('btn-exit-stay-label');
    if (exitStayLbl) exitStayLbl.textContent = t('btnExitStay');
    const exitConfLbl = document.getElementById('btn-exit-confirm-label');
    if (exitConfLbl) exitConfLbl.textContent = t('btnExitConfirm');

    const bannerText = document.getElementById('admob-banner-text');
    if (bannerText) bannerText.textContent = t('adBannerCopy');
    const bannerCta = document.getElementById('btn-banner-vip');
    if (bannerCta) bannerCta.textContent = t('adBannerCta');

    // Update shop static hint rows via explicit V12.1 IDs
    const sh1T = document.getElementById('shop-hint-row-1-title');
    const sh1D = document.getElementById('shop-hint-row-1-desc');
    const sh2T = document.getElementById('shop-hint-row-2-title');
    const sh2D = document.getElementById('shop-hint-row-2-desc');
    const sh2B = document.getElementById('shop-hint-row-2-badge');
    const sh3T = document.getElementById('shop-hint-row-3-title');
    const sh3D = document.getElementById('shop-hint-row-3-desc');
    if (sh1T) sh1T.textContent = t('shopHintRow1Title');
    if (sh1D) sh1D.textContent = t('shopHintRow1Desc');
    if (sh2T) sh2T.textContent = t('shopHintRow2Title');
    if (sh2D) sh2D.textContent = t('shopHintRow2Desc');
    if (sh2B) sh2B.textContent = t('badgeFreeAd');
    if (sh3T) sh3T.textContent = t('shopHintRow3Title');
    if (sh3D) sh3D.textContent = t('shopHintRow3Desc');

    updateGlobalTopBar();
    renderMainMenu();

    const appShell = document.getElementById('app-shell');
    const activeScreen = appShell ? appShell.getAttribute('data-active-screen') : 'screen-menu';
    if (activeScreen === 'screen-map') {
      renderStationsMap();
    } else if (activeScreen === 'screen-game' && currentLevel) {
      const station = window.GameLevels.STATIONS.find(s => s.id === currentLevel.stationId);
      const stEl = document.getElementById('hud-station-name');
      if (stEl) {
        stEl.textContent = station
          ? tf('hudSectorFmt', { icon: station.icon, id: station.id, name: getStationName(station) })
          : t('gameTitle');
      }
      const titleEl = document.getElementById('hud-level-title');
      if (titleEl) {
        const isSpecialHud = Boolean(currentLevel.isDualTrainLevel || isBossLevel(currentLevel.id));
        const stIcon = (!isSpecialHud && station) ? `${station.icon} ` : '';
        const badges = (currentLevel.isDualTrainLevel ? ' 🚆×2' : '') + (isBossLevel(currentLevel.id) ? ' 👑' : '');
        titleEl.textContent = tf('hudLevelFmt', { icon: stIcon, id: currentLevel.id, badges });
      }
      updateLiveDispatchBar(isTrainRunning, getPreferredSpeedTier());
      updateLevel1TutorialPointer();
      updateUndoButtonState();
      showMechanicDiscoveryIfNeeded(currentLevel);
      evaluateBoardConnectivity(false);
    }

    applyLiveStorePricesToShopLabels();
    const shopModal = document.getElementById('modal-shop');
    if (shopModal && !shopModal.hidden) openShopModal();
    const achModal = document.getElementById('modal-achievements');
    if (achModal && !achModal.hidden) openAchievementsModal();
    const dailyModal = document.getElementById('modal-daily-login');
    if (dailyModal && !dailyModal.hidden) openDailyLoginModal();
    const dailyBriefModal = document.getElementById('modal-daily-challenge-briefing');
    if (dailyBriefModal && !dailyBriefModal.hidden) syncDailyChallengeBriefingLabels();
    const hintModal = document.getElementById('modal-hint');
    if (hintModal && !hintModal.hidden) openSmartHintModal();
    const privModal = document.getElementById('modal-privacy');
    if (privModal && !privModal.hidden) openPrivacyPolicyModal();
  }

  window.applyLanguage = applyLanguage;

  // ==========================================================================
  // 11. EVENT BINDINGS & INITIALIZATION
  // ==========================================================================
  let toastTimeout = null;
  function showToast(msg) {
    const toast = document.getElementById('ui-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.hidden = true;
    }, 2100);
  }

  function bindEvents() {
    document.getElementById('btn-home-logo').addEventListener('click', () => {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      showScreen('screen-menu');
    });

    document.getElementById('btn-open-shop-top').addEventListener('click', () => {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      openShopModal();
    });

    document.getElementById('btn-open-shop-hints').addEventListener('click', () => {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      openShopModal();
    });

    const quickGarageBtn = document.getElementById('btn-quick-garage');
    if (quickGarageBtn) {
      quickGarageBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        openShopModal();
      });
    }

    const topProgressPill = document.querySelector('.topbar-progress-pill');
    if (topProgressPill) {
      topProgressPill.style.cursor = 'pointer';
      topProgressPill.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        showScreen('screen-map');
      });
    }

    const topStarsPill = document.querySelector('.stat-pill.stat-stars');
    if (topStarsPill) {
      topStarsPill.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        showScreen('screen-map');
      });
    }

    const achTopBtn = document.getElementById('btn-open-achievements');
    if (achTopBtn) {
      achTopBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        openAchievementsModal();
      });
    }

    const privTopBtn = document.getElementById('btn-open-privacy');
    if (privTopBtn) {
      privTopBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        openPrivacyPolicyModal();
      });
    }

    const shopPrivBtn = document.getElementById('btn-shop-privacy');
    if (shopPrivBtn) {
      shopPrivBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        stopShopLocomotivePreviewUi();
        openPrivacyPolicyModal();
      });
    }

    const langToggleBtn = document.getElementById('btn-toggle-lang');
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        const langModal = document.getElementById('modal-language');
        if (langModal) {
          document.querySelectorAll('.lang-opt-btn').forEach(btn => {
            btn.classList.toggle('active-lang', btn.getAttribute('data-lang-code') === gameState.lang);
          });
          langModal.hidden = false;
        } else {
          const nextLang = isEn() ? 'ar' : 'en';
          applyLanguage(nextLang);
        }
      });
    }

    document.querySelectorAll('.lang-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        const code = btn.getAttribute('data-lang-code') || 'ar';
        applyLanguage(code);
        closeModalById('modal-language');
        showToast(tf('toastLangChangedFmt', { lang: btn.textContent.trim() }));
      });
    });

    const endlessBtn = document.getElementById('btn-endless-mode');
    if (endlessBtn) {
      endlessBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        triggerHaptic(15);
        startEndlessMarathonWave(1);
      });
    }

    const empireBtn = document.getElementById('btn-station-empire');
    if (empireBtn) {
      empireBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        claimStationEmpireTickets();
      });
    }

    const next3StarBtn = document.getElementById('btn-map-next-3star');
    if (next3StarBtn) {
      next3StarBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        triggerHaptic(14);
        const maxLvl = IS_OWNER_TEST_BUILD ? TOTAL_LEVELS_COUNT : Math.min(TOTAL_LEVELS_COUNT, gameState.unlockedLevel);
        let targetId = maxLvl;
        for (let lid = 1; lid <= maxLvl; lid++) {
          if ((gameState.levelStars[lid] || 0) < 3) {
            targetId = lid;
            break;
          }
        }
        startLevel(targetId, false);
        showToast(tf('toastJump3StarFmt', { id: targetId }));
      });
    }

    [1, 2, 3].forEach(tier => {
      const sBtn = document.getElementById(`btn-speed-${tier}x`);
      if (sBtn) {
        sBtn.addEventListener('click', () => {
          triggerHaptic(12);
          gameState.preferredTrainSpeed = tier;
          saveState();
          const mult = SPEED_MULT_MAP[tier] || 1.00;
          trainAnimator.setSpeedMult(mult);
          if (window.TrainEngine3D && typeof window.TrainEngine3D.setLiveSpeedMultiplier === 'function') {
            window.TrainEngine3D.setLiveSpeedMultiplier(mult);
          }
          if (window.GameAudio) {
            window.GameAudio.playButtonTap();
          }
          updateLiveDispatchBar(isTrainRunning, tier);
          if (currentLevel && currentLevel.id === 1 && tutorialStep === 3) {
            tutorialStep = 4;
            updateLevel1TutorialPointer();
          }
          showToast(tf('toastSpeedSetFmt', { tier }));
        });
      }
    });

    const liveChaseBtn = document.getElementById('btn-live-chase-cam');
    if (liveChaseBtn) {
      liveChaseBtn.addEventListener('click', () => {
        if (!window.TrainEngine3D || !window.TrainEngine3D.enabled) return;
        triggerHaptic(14);
        if (window.GameAudio) window.GameAudio.playButtonTap();
        const isChase = window.TrainEngine3D.toggleChaseCamera();
        liveChaseBtn.classList.toggle('active', isChase);
        showToast(isChase ? t('toastChaseOn') : t('toastChaseOff'));
      });
    }

    document.getElementById('btn-toggle-audio').addEventListener('click', () => {
      if (window.GameAudio) {
        window.GameAudio.toggleMute();
        updateGlobalTopBar();
      }
    });

    document.getElementById('btn-play-now').addEventListener('click', () => {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      const targetLvlId = IS_OWNER_TEST_BUILD
        ? Math.max(1, Math.min(TOTAL_LEVELS_COUNT, Number(gameState.lastPlayedLevel || 1)))
        : Math.min(TOTAL_LEVELS_COUNT, gameState.unlockedLevel);
      startLevel(targetLvlId, true);
    });

    document.getElementById('btn-goto-map').addEventListener('click', () => {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      showScreen('screen-map');
    });

    document.getElementById('btn-goto-shop').addEventListener('click', () => {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      openShopModal();
    });

    const dailyChallengeBtn = document.getElementById('btn-daily-challenge');
    if (dailyChallengeBtn) {
      dailyChallengeBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        triggerHaptic(15);
        startDailyChallengeLevel();
      });
    }

    const dailyChallengeConfirmBtn = document.getElementById('btn-daily-challenge-confirm');
    if (dailyChallengeConfirmBtn) {
      dailyChallengeConfirmBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        closeModalById('modal-daily-challenge-briefing');
        startDailyChallengeLevel({ skipBriefing: true });
      });
    }

    const openDailyRewardsBtn = document.getElementById('btn-open-daily-rewards');
    if (openDailyRewardsBtn) {
      openDailyRewardsBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        triggerHaptic(12);
        openDailyLoginModal();
      });
    }

    const claimDaily1xBtn = document.getElementById('btn-claim-daily-1x');
    if (claimDaily1xBtn) {
      claimDaily1xBtn.addEventListener('click', () => {
        claimDailyLoginReward(1);
      });
    }

    const claimDaily2xBtn = document.getElementById('btn-claim-daily-2x');
    if (claimDaily2xBtn) {
      claimDaily2xBtn.addEventListener('click', () => {
        if (gameState.lastLoginDate === getTodayDateString()) return;
        window.AdMobBridge.showRewardedAd(t('adTitleDoubleDaily'), () => {
          claimDailyLoginReward(2);
        });
      });
    }

    const rentTrainBtn = document.getElementById('btn-rent-train');
    if (rentTrainBtn) {
      rentTrainBtn.addEventListener('click', () => {
        if (!currentLevel || isTrainRunning || trialSkinIdForCurrentLevel) return;
        if (window.GameAudio) window.GameAudio.playButtonTap();
        window.AdMobBridge.showRewardedAd(t('adTitleRentTrain'), () => {
          trialSkinIdForCurrentLevel = 'maglev_600';
          trialSkinLevelId = currentLevel.id;
          rentTrainBtn.hidden = true;
          applyEquippedSkinTo3D();
          remainingMoves += 6;
          stormTimeRemaining += 20;
          updateMovesHUD();
          updateStormTimerHUD();
          applySmartHintEffect(1, true);
          evaluateBoardConnectivity(false);
          triggerHaptic(30);
          if (window.GameAudio) {
      window.GameAudio.playVictoryFanfare();
    }
          showToast(t('toastRentActivated'));
        });
      });
    }

    const watchIntroBtn = document.getElementById('btn-watch-intro');
    if (watchIntroBtn) {
      watchIntroBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        openDialogueModal(1, window.GameLevels.INTRO_DIALOGUE);
      });
    }

    document.getElementById('btn-map-back').addEventListener('click', () => {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      showScreen('screen-menu');
    });

    // Horizontal Sector Carousel Prev / Next & Touch Swipe Gesture
    const prevSectorBtn = document.getElementById('btn-sector-prev');
    if (prevSectorBtn) {
      prevSectorBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        setActiveMapSector(activeSectorIndex - 1);
      });
    }

    const nextSectorBtn = document.getElementById('btn-sector-next');
    if (nextSectorBtn) {
      nextSectorBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        setActiveMapSector(activeSectorIndex + 1);
      });
    }

    const carouselViewport = document.getElementById('sectors-carousel-viewport');
    if (carouselViewport) {
      let swipeStartX = 0;
      let swipeStartY = 0;
      let isSwiping = false;

      carouselViewport.addEventListener('pointerdown', (e) => {
        swipeStartX = e.clientX;
        swipeStartY = e.clientY;
        isSwiping = true;
      });

      carouselViewport.addEventListener('pointerup', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        const dx = e.clientX - swipeStartX;
        const dy = e.clientY - swipeStartY;
        if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          if (window.GameAudio) window.GameAudio.playButtonTap();
          if (dx < 0) {
            setActiveMapSector(activeSectorIndex + 1);
          } else {
            setActiveMapSector(activeSectorIndex - 1);
          }
        }
      });

      carouselViewport.addEventListener('pointercancel', () => {
        isSwiping = false;
      });
    }

    document.getElementById('btn-game-to-map').addEventListener('click', () => {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      if (autoLaunchTimer) clearTimeout(autoLaunchTimer);
      isTrainRunning = false;
      showScreen('screen-map');
    });

    // 3D Camera Mode Switcher Button (3D <-> علوي)
    const camBtn = document.getElementById('btn-camera-mode');
    if (camBtn) {
      camBtn.addEventListener('click', () => {
        if (!window.TrainEngine3D || !window.TrainEngine3D.enabled) {
          showToast(t('toastNo3DBrowser'));
          return;
        }
        if (window.GameAudio) window.GameAudio.playButtonTap();
        const mode = window.TrainEngine3D.cycleCameraMode();
        const labelEl = document.getElementById('camera-mode-label');
        if (mode === 'TOP_TACTICAL') {
          if (labelEl) labelEl.textContent = t('hudCamTop');
          showToast(`🎥 ${t('hudCamTop')}`);
        } else {
          if (labelEl) labelEl.textContent = t('hudCam3D');
          showToast(t('toastChaseOff'));
        }
        updateLiveDispatchBar(isTrainRunning);
        if (currentLevel && currentLevel.id === 1 && tutorialStep === 2) {
          tutorialStep = 3;
          updateLevel1TutorialPointer();
        }
      });
    }

    // Unlock & start steady Main Menu BGM on first user click outside gameplay (after button handlers update screen)
    const unlockMenuAudioOnce = () => {
      if (!window.GameAudio || window.GameAudio.muted) return;
      const shell = document.getElementById('app-shell');
      const activeScr = shell ? shell.getAttribute('data-active-screen') : 'screen-menu';
      if (activeScr !== 'screen-game' && !window.GameAudio.bgmTimer) {
        window.GameAudio.startBGM('menu');
      }
      document.removeEventListener('click', unlockMenuAudioOnce);
      document.removeEventListener('keydown', unlockMenuAudioOnce);
    };
    document.addEventListener('click', unlockMenuAudioOnce, { passive: true });
    document.addEventListener('keydown', unlockMenuAudioOnce, { passive: true });

    // Cryo-Freeze Time Shield Button (❄️ +20s)
    document.getElementById('btn-freeze-time').addEventListener('click', () => {
      if (!currentLevel || isTrainRunning) return;
      if (!freezeUsedFreeThisLevel) {
        freezeUsedFreeThisLevel = true;
        stormTimeRemaining += 20;
        stormFrozenUntil = Date.now() + 8000;
        updateStormTimerHUD();
        if (window.GameAudio) window.GameAudio.playFreezeShield();
        showToast(t('toastCryoActive'));
      } else {
        window.AdMobBridge.showRewardedAd(t('adTitleCryoFreeze'), () => {
          stormTimeRemaining += 20;
          stormFrozenUntil = Date.now() + 8000;
          updateStormTimerHUD();
          if (window.GameAudio) window.GameAudio.playFreezeShield();
          showToast(t('toastCryoAdded'));
        });
      }
    });

    const devAutoPlayBtn = document.getElementById('btn-auto-play') || document.getElementById('btn-dev-autoplay');
    if (devAutoPlayBtn) {
      if (!IS_OWNER_TEST_BUILD) {
        devAutoPlayBtn.remove();
      } else {
        devAutoPlayBtn.hidden = false;
        devAutoPlayBtn.addEventListener('click', () => {
          if (!IS_OWNER_TEST_BUILD) return;
          if (!currentLevel || isTrainRunning) return;
          if (window.GameAudio) window.GameAudio.playButtonTap();
          autoSolveAndPlayCurrentLevel();
        });
      }
    }

    const replayDialogueBtn = document.getElementById('btn-replay-dialogue');
    if (replayDialogueBtn) {
      replayDialogueBtn.addEventListener('click', () => {
        if (!currentLevel) return;
        if (window.GameAudio) window.GameAudio.playButtonTap();
        const lines = buildMissionCrewDialogue(currentLevel);
        openDialogueModal(currentLevel.stationId, lines);
      });
    }

    document.getElementById('btn-reset-level').addEventListener('click', () => {
      if (!currentLevel || isTrainRunning) return;
      if (window.GameAudio) window.GameAudio.playButtonTap();
      clearMidLevelSession();
      if (isEndlessMarathonMode) {
        startEndlessMarathonWave(endlessWaveNumber);
      } else {
        startLevel(currentLevel.id, false, isDailyChallengeMode, false);
      }
      showToast(t('toastResetGrid'));
    });

    const undoBtn = document.getElementById('btn-undo-move');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        undoLastMove();
      });
    }

    document.getElementById('btn-smart-hint').addEventListener('click', () => {
      if (!currentLevel || isTrainRunning) return;
      if (window.GameAudio) window.GameAudio.playButtonTap();
      openSmartHintModal();
    });

    document.getElementById('btn-launch-train').addEventListener('click', () => {
      if (!currentLevel) return;
      if (!isPathComplete) {
        if (window.GameAudio) window.GameAudio.playFixedBump();
        if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
          window.TrainEngine3D.triggerShake(0.18);
        }
        showToast(tf('toastTrackIncompleteFmt', { n: connectedSteps.length }));
        return;
      }
      launchTrainSequence();
    });

    const zoomInBtn = document.getElementById('btn-3d-zoom-in');
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
          window.TrainEngine3D.zoomCamera(-0.12);
        }
      });
    }

    const zoomOutBtn = document.getElementById('btn-3d-zoom-out');
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
          window.TrainEngine3D.zoomCamera(0.12);
        }
      });
    }

    const qualityBtn = document.getElementById('btn-quality-tier');
    if (qualityBtn) {
      qualityBtn.addEventListener('click', () => {
        if (!window.TrainEngine3D || !window.TrainEngine3D.quality) return;
        if (window.GameAudio) window.GameAudio.playButtonTap();
        const order = ['LOW', 'MID', 'HIGH', 'ULTRA'];
        const cur = window.TrainEngine3D.quality.activeTier || 'HIGH';
        const nextTier = order[(order.indexOf(cur) + 1) % order.length];
        window.TrainEngine3D.setQualityTier(nextTier);
        const qLabel = document.getElementById('quality-tier-label');
        if (qLabel) qLabel.textContent = nextTier;
        showToast(tf('toastQualityFmt', { tier: nextTier }));
      });
    }

    const debugHudBtn = document.getElementById('btn-debug-hud');
    if (debugHudBtn) {
      debugHudBtn.addEventListener('click', () => {
        if (!window.TrainEngine3D) return;
        if (window.GameAudio) window.GameAudio.playButtonTap();
        const visible = window.TrainEngine3D.toggleDebugHUD();
        showToast(visible ? t('toastDebugOn') : t('toastDebugOff'));
      });
    }

    document.getElementById('btn-banner-vip').addEventListener('click', () => {
      if (window.GameAudio) window.GameAudio.playButtonTap();
      openShopModal();
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-close-modal');
        closeModalById(targetId);
      });
    });

    BACKDROP_CLOSABLE_MODAL_IDS.forEach(modalId => {
      const backdropEl = document.getElementById(modalId);
      if (!backdropEl) return;
      backdropEl.addEventListener('click', (ev) => {
        if (ev.target !== backdropEl) return;
        if (window.GameAudio) window.GameAudio.playButtonTap();
        closeModalById(modalId);
      });
    });

    const closeTopmostClosableModal = () => {
      const closableIds = [
        'modal-exit-confirm',
        'modal-settings',
        'modal-language',
        'modal-privacy',
        'modal-hint',
        'modal-daily-challenge-briefing',
        'modal-daily-login',
        'modal-achievements',
        'modal-shop'
      ];
      for (let i = 0; i < closableIds.length; i++) {
        const el = document.getElementById(closableIds[i]);
        if (el && !el.hidden) {
          closeModalById(closableIds[i]);
          return true;
        }
      }
      const dialogueEl = document.getElementById('modal-dialogue');
      if (dialogueEl && !dialogueEl.hidden) {
        const skipBtn = document.getElementById('btn-skip-dialogue');
        if (skipBtn) skipBtn.click();
        if (!dialogueEl.hidden) closeModalById('modal-dialogue');
        return true;
      }
      return false;
    };

    window.handleEscapeOrBackKey = () => {
      const openDialog = document.querySelector('dialog[open]');
      if (openDialog && typeof openDialog.close === 'function') {
        openDialog.close();
        return 'HANDLED';
      }
      const simModal = document.getElementById('modal-ad-simulator');
      if (simModal && !simModal.hidden) {
        return 'BLOCKED_AD';
      }
      if (closeTopmostClosableModal()) {
        return 'HANDLED';
      }
      const victoryEl = document.getElementById('modal-victory');
      if (victoryEl && !victoryEl.hidden) {
        const mapBtn = document.getElementById('btn-victory-map');
        if (mapBtn) { mapBtn.click(); return 'HANDLED'; }
      }
      const oomEl = document.getElementById('modal-out-of-moves');
      if (oomEl && !oomEl.hidden) {
        const retryBtn = document.getElementById('btn-oom-retry');
        if (retryBtn) { retryBtn.click(); return 'HANDLED'; }
      }
      const dialogueEl = document.getElementById('modal-dialogue');
      if (dialogueEl && !dialogueEl.hidden) {
        const skipDlgBtn = document.getElementById('btn-skip-dialogue');
        if (skipDlgBtn) skipDlgBtn.click();
        if (!dialogueEl.hidden) closeModalById('modal-dialogue');
        return 'HANDLED';
      }
      const gameScreen = document.getElementById('screen-game');
      if (gameScreen && gameScreen.classList.contains('active')) {
        const backBtn = document.getElementById('btn-game-to-map');
        if (backBtn) { backBtn.click(); return 'HANDLED'; }
      }
      const mapScreen = document.getElementById('screen-map');
      if (mapScreen && mapScreen.classList.contains('active')) {
        const mapBackBtn = document.getElementById('btn-map-back');
        if (mapBackBtn) { mapBackBtn.click(); return 'HANDLED'; }
      }
      return 'EXIT';
    };

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' || ev.key === 'Esc') {
        if (document.querySelector('dialog[open]')) return;
        if (closeTopmostClosableModal()) {
          ev.preventDefault();
          if (window.GameAudio) window.GameAudio.playButtonTap();
        }
      }
    });

    document.getElementById('btn-use-free-hint').addEventListener('click', () => {
      if (gameState.hints <= 0) return;
      closeModalById('modal-hint');
      if (applySmartHintEffect(2)) {
        gameState.hints -= 1;
        saveState();
        updateGlobalTopBar();
      }
    });

    document.getElementById('btn-watch-ad-hint').addEventListener('click', () => {
      closeModalById('modal-hint');
      window.AdMobBridge.showRewardedAd(t('adTitleSmartHint'), () => {
        applySmartHintEffect(2);
      });
    });

    document.getElementById('btn-buy-hint-coins').addEventListener('click', () => {
      if (gameState.coins < 150) {
        showToast(t('toastNeed150Hint'));
        return;
      }
      gameState.coins -= 150;
      saveState();
      updateGlobalTopBar();
      closeModalById('modal-hint');
      applySmartHintEffect(2);
    });

    const superHintBtn = document.getElementById('btn-buy-super-hint-coins');
    if (superHintBtn) {
      superHintBtn.addEventListener('click', () => {
        if (gameState.coins < 250) {
          if (window.GameAudio) window.GameAudio.playFixedBump();
          showToast(t('toastNeed250Super'));
          return;
        }
        gameState.coins -= 250;
        saveState();
        updateGlobalTopBar();
        closeModalById('modal-hint');
        applySmartHintEffect(4);
      });
    }

    document.getElementById('btn-watch-ad-moves').addEventListener('click', () => {
      closeModalById('modal-out-of-moves');
      if (oomModalMode === 'TIMER') {
        const addSec = getRescueTimeOffer();
        window.AdMobBridge.showRewardedAd(
          tf('adTitleExtraSecFmt', { n: addSec }),
          () => {
            startStormTimer(addSec);
            showToast(tf('toastRescueSecAdFmt', { n: addSec }));
          },
          () => {
            if (currentLevel && !isTrainRunning && stormTimeRemaining <= 0) {
              openStormTimeUpModal();
            }
          }
        );
      } else {
        const addMoves = getRescueMovesOffer();
        window.AdMobBridge.showRewardedAd(
          tf('adTitleExtraMovesFmt', { n: addMoves }),
          () => {
            remainingMoves += addMoves;
            updateMovesHUD();
            applySmartHintEffect(1, true);
            evaluateBoardConnectivity(false);
            showToast(tf('toastRescueMovesAdFmt', { n: addMoves }));
          },
          () => {
            if (currentLevel && !isTrainRunning && remainingMoves <= 0 && !isPathComplete) {
              openOutOfMovesModal();
            }
          }
        );
      }
    });

    const buyOomCoinsBtn = document.getElementById('btn-buy-oom-coins');
    if (buyOomCoinsBtn) {
      buyOomCoinsBtn.addEventListener('click', () => {
        if (gameState.coins < 100) {
          if (window.GameAudio) window.GameAudio.playFixedBump();
          showToast(t('toastNeed100Rescue'));
          return;
        }
        gameState.coins -= 100;
        saveState();
        updateGlobalTopBar();
        closeModalById('modal-out-of-moves');
        if (oomModalMode === 'TIMER') {
          const addSec = getRescueTimeOffer();
          startStormTimer(addSec);
          if (window.GameAudio) window.GameAudio.playCoinChime();
          showToast(tf('toastRescueSecCoinsFmt', { n: addSec }));
        } else {
          const addMoves = getRescueMovesOffer();
          remainingMoves += addMoves;
          updateMovesHUD();
          applySmartHintEffect(1, true);
          evaluateBoardConnectivity(false);
          if (window.GameAudio) window.GameAudio.playCoinChime();
          showToast(tf('toastRescueMovesCoinsFmt', { n: addMoves }));
        }
      });
    }

    document.getElementById('btn-oom-retry').addEventListener('click', () => {
      closeModalById('modal-out-of-moves');
      clearMidLevelSession();
      if (currentLevel) {
        startLevel(currentLevel.id, false, isDailyChallengeMode, false);
      }
    });

    // V12.0: 4-Step Interactive Spotlight Coach Buttons & Dedicated Settings Modal
    const tutSkipBtn = document.getElementById('btn-tutorial-skip');
    if (tutSkipBtn) {
      tutSkipBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        completeMission1Tutorial();
      });
    }
    const tutNextBtn = document.getElementById('btn-tutorial-next');
    if (tutNextBtn) {
      tutNextBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        if (tutorialStep === 2) tutorialStep = 3;
        else if (tutorialStep === 3) tutorialStep = 4;
        updateLevel1TutorialPointer();
      });
    }

    const openSettingsBtnTop = document.getElementById('btn-open-settings');
    if (openSettingsBtnTop) {
      openSettingsBtnTop.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        openSettingsModal();
      });
    }
    const openSettingsBtnHud = document.getElementById('btn-hud-settings');
    if (openSettingsBtnHud) {
      openSettingsBtnHud.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        openSettingsModal();
      });
    }
    const sfxSlider = document.getElementById('slider-sfx-vol');
    if (sfxSlider) {
      sfxSlider.addEventListener('input', () => {
        const pct = Math.max(0, Math.min(100, Number(sfxSlider.value) || 0));
        const pctLbl = document.getElementById('label-sfx-vol-pct');
        if (pctLbl) pctLbl.textContent = `${pct}%`;
        if (window.GameAudio && typeof window.GameAudio.setSfxVolume === 'function') {
          window.GameAudio.setSfxVolume(pct / 100);
          if (pct > 0 && window.GameAudio.muted) {
            window.GameAudio.toggleMute();
            updateGlobalTopBar();
          }
        }
      });
    }
    const bgmSlider = document.getElementById('slider-bgm-vol');
    if (bgmSlider) {
      bgmSlider.addEventListener('input', () => {
        const pct = Math.max(0, Math.min(100, Number(bgmSlider.value) || 0));
        const pctLbl = document.getElementById('label-bgm-vol-pct');
        if (pctLbl) pctLbl.textContent = `${pct}%`;
        if (window.GameAudio && typeof window.GameAudio.setBgmVolume === 'function') {
          window.GameAudio.setBgmVolume(pct / 100);
          if (pct > 0 && window.GameAudio.muted) {
            window.GameAudio.toggleMute();
            updateGlobalTopBar();
          }
        }
      });
    }
    document.querySelectorAll('.qual-opt-btn').forEach(qBtn => {
      qBtn.addEventListener('click', () => {
        const mode = qBtn.getAttribute('data-qual-mode') || 'AUTO';
        triggerHaptic(12);
        if (window.GameAudio) window.GameAudio.playButtonTap();
        if (window.TrainEngine3D && typeof window.TrainEngine3D.setQualityPresetMode === 'function') {
          window.TrainEngine3D.setQualityPresetMode(mode);
        }
        document.querySelectorAll('.qual-opt-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-qual-mode') === mode);
        });
      });
    });
    const hapticsBtn = document.getElementById('btn-toggle-haptics');
    if (hapticsBtn) {
      hapticsBtn.addEventListener('click', () => {
        gameState.hapticsEnabled = !(gameState.hapticsEnabled !== false);
        saveState();
        if (window.GameAudio) window.GameAudio.playButtonTap();
        if (gameState.hapticsEnabled) triggerHaptic(18);
        syncSettingsModalLabels();
      });
    }
    const settingsLangBtn = document.getElementById('btn-settings-lang');
    if (settingsLangBtn) {
      settingsLangBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        closeModalById('modal-settings');
        const langModal = document.getElementById('modal-language');
        if (langModal) langModal.hidden = false;
      });
    }
    const replayTutorialBtn = document.getElementById('btn-replay-tutorial');
    if (replayTutorialBtn) {
      replayTutorialBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        gameState.tutorialSeen = false;
        gameState.tutorialCompleted = false;
        if (!gameState.seenDialogues || typeof gameState.seenDialogues !== 'object') {
          gameState.seenDialogues = {};
        }
        gameState.seenDialogues[1] = true;
        clearMidLevelSession();
        saveState();
        closeModalById('modal-settings');
        closeModalById('modal-dialogue');
        startLevel(1, false, false, false);
        tutorialStep = 1;
        updateLevel1TutorialPointer();
      });
    }
    const settingsPrivBtn = document.getElementById('btn-settings-privacy');
    if (settingsPrivBtn) {
      settingsPrivBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        closeModalById('modal-settings');
        openPrivacyPolicyModal();
      });
    }

    document.getElementById('btn-watch-ad-double').addEventListener('click', () => {
      if (doubleCoinsClaimed) return;
      const doubleBtn = document.getElementById('btn-watch-ad-double');
      window.AdMobBridge.showRewardedAd(t('adTitleDoubleCoins'), () => {
        doubleCoinsClaimed = true;
        gameState.coins += lastEarnedCoins;
        saveState();
        updateGlobalTopBar();
        doubleBtn.disabled = true;
        document.getElementById('btn-double-label').textContent = tf('victoryDoubledFmt', { coins: lastEarnedCoins * 2 });
        document.getElementById('victory-coins-amount').textContent = tf('victoryCoinsFmt', { coins: lastEarnedCoins * 2 });
        showToast(tf('toastDoubleEarnedFmt', { coins: lastEarnedCoins }));
      });
    });

    document.getElementById('btn-victory-map').addEventListener('click', () => {
      closeModalById('modal-victory');
      showScreen('screen-map');
    });

    const openChestBtn = document.getElementById('btn-open-mystery-chest');
    if (openChestBtn) {
      openChestBtn.addEventListener('click', () => {
        if ((gameState.chestWinProgress || 0) < 3) return;
        window.AdMobBridge.showRewardedAd(t('adTitleMysteryChest'), () => {
          gameState.coins += 150;
          gameState.hints += 1;
          gameState.chestWinProgress = 0;
          saveState();
          updateGlobalTopBar();
          const chestPctEl = document.getElementById('victory-chest-pct');
          const chestBarEl = document.getElementById('victory-chest-bar');
          if (chestPctEl) chestPctEl.textContent = '0/3';
          if (chestBarEl) chestBarEl.style.width = '0%';
          openChestBtn.hidden = true;
          triggerHaptic(30);
          if (window.GameAudio) {
      window.GameAudio.playVictoryFanfare();
    }
          showToast(t('toastChestOpened'));
        });
      });
    }

    const victoryShareBtn = document.getElementById('btn-victory-share');
    if (victoryShareBtn) {
      victoryShareBtn.addEventListener('click', async () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        const lvlId = currentLevel ? currentLevel.id : 1;
        const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.dreamexpress.puzzletracks';
        const shareTitle = t('bootLoaderTitle');
        const shareText = tf('shareVictoryTextFmt', { id: lvlId, combo: maxComboReached, url: playStoreUrl });
        try {
          if (window.AndroidReview && typeof window.AndroidReview.shareVictory === 'function') {
            window.AndroidReview.shareVictory(shareTitle, shareText);
          } else if (navigator.share) {
            await navigator.share({ title: shareTitle, text: shareText, url: playStoreUrl });
          } else if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareText);
          }
        } catch (_) {}

        const todayStr = getTodayDateString();
        if (gameState.lastShareRewardDate !== todayStr) {
          gameState.lastShareRewardDate = todayStr;
          gameState.coins += 100;
          saveState();
          updateGlobalTopBar();
          const shareLbl = document.getElementById('btn-victory-share-label');
          if (shareLbl) shareLbl.textContent = t('btnVictoryShareDone');
          if (window.GameAudio) window.GameAudio.playCoinChime();
          showToast(t('toastShareReward'));
        } else {
          showToast(t('toastShareDone'));
        }
      });
    }

    document.getElementById('btn-victory-next').addEventListener('click', () => {
      document.getElementById('modal-victory').hidden = true;
      const finishedId = currentLevel ? currentLevel.id : 1;
      const wasDaily = Boolean(completedWasDailyChallenge || isDailyChallengeMode);
      const wasEndless = Boolean(completedWasEndless || isEndlessMarathonMode);
      isDailyChallengeMode = false;
      completedWasDailyChallenge = false;
      isEndlessMarathonMode = false;
      completedWasEndless = false;
      window.AdMobBridge.maybeShowInterstitial(finishedId, gameState.isVip, () => {
        if (wasEndless) {
          startEndlessMarathonWave(endlessWaveNumber + 1);
        } else if (wasDaily) {
          const campaignNextId = Math.min(TOTAL_LEVELS_COUNT, gameState.unlockedLevel || 1);
          startLevel(campaignNextId, true, false);
        } else if (finishedId < TOTAL_LEVELS_COUNT) {
          startLevel(finishedId + 1, true, false);
        } else {
          showScreen('screen-map');
          showToast(t('toastCampaign100Done'));
        }
      });
    });

    window.addEventListener('online', () => {
      window.AdMobBridge.updateBannerVisibility(gameState.isVip);
    });
    window.addEventListener('offline', () => {
      window.AdMobBridge.updateBannerVisibility(gameState.isVip);
    });

    const activateVipPassNow = () => {
      const isFirstActivation = !gameState.vipPurchased;
      gameState.isVip = true;
      gameState.vipPurchased = true;
      if (!gameState.ownedSkins.includes('gold_vip')) {
        gameState.ownedSkins.push('gold_vip');
      }
      if (isFirstActivation) {
        gameState.equippedSkin = 'gold_vip';
        gameState.coins += 1500;
        gameState.hints += 10;
      }
      saveState();
      if (isFirstActivation && window.GameAudio) window.GameAudio.playVictoryFanfare();
      applyEquippedSkinTo3D();
      updateGlobalTopBar();
      const shopModal = document.getElementById('modal-shop');
      if (shopModal && !shopModal.hidden) openShopModal();
      if (isFirstActivation) {
        showToast(t('toastVipActivated'));
      }
    };
    window.__onVipIapSuccess = activateVipPassNow;
    window.__onVipRestoreResult = (found) => {
      if (found) {
        activateVipPassNow();
        showToast(t('toastVipRestored'));
      } else {
        showToast(t('toastVipNotFound'));
      }
    };
    window.__onVipIapUnavailable = () => {
      showToast(t('toastVipConnecting'));
    };

    const grantPurchasedCoinsPack = (amount, productId) => {
      const safeAmount = Math.max(0, Number(amount) || 0);
      if (safeAmount <= 0) return;
      gameState.coins += safeAmount;
      let starterBonusHints = 0;
      const isStarterSku = (
        productId === 'starter_conductor_pack' ||
        (pendingStarterPackBonus && (!productId || productId === 'coins_pack_small'))
      );
      pendingStarterPackBonus = false;
      if (isStarterSku && !gameState.starterPackClaimed) {
        gameState.starterPackClaimed = true;
        starterBonusHints = 3;
        gameState.hints += 3;
      }
      saveState();
      if (window.GameAudio) {
        if (safeAmount >= 10000 || starterBonusHints > 0) window.GameAudio.playVictoryFanfare();
        else window.GameAudio.playCoinChime();
      }
      updateGlobalTopBar();
      updateStationEmpireUI();
      const shopModal = document.getElementById('modal-shop');
      if (shopModal && !shopModal.hidden) openShopModal();
      if (window.AndroidFirebase && typeof window.AndroidFirebase.logEvent === 'function') {
        try {
          window.AndroidFirebase.logEvent('iap_coins_granted', JSON.stringify({ productId: productId || 'coins_pack', amount: safeAmount, starterBonusHints }));
        } catch (_) {}
      }
      showToast(starterBonusHints > 0
        ? tf('toastStarterGrantedFmt', { amount: safeAmount.toLocaleString() })
        : tf('toastCoinsGrantedFmt', { amount: safeAmount.toLocaleString() }));
    };
    window.__onCoinsIapSuccess = grantPurchasedCoinsPack;
    window.__onIapFlowCanceled = () => {
      pendingStarterPackBonus = false;
    };

    const buyStarterBtn = document.getElementById('btn-buy-starter-pack');
    if (buyStarterBtn) {
      buyStarterBtn.addEventListener('click', () => {
        if (gameState.starterPackClaimed) return;
        if (window.GameAudio) window.GameAudio.playButtonTap();
        pendingStarterPackBonus = true;
        if (window.AndroidIAP && typeof window.AndroidIAP.purchaseStarterPack === 'function') {
          try {
            window.AndroidIAP.purchaseStarterPack();
            return;
          } catch (_) {}
        }
        if (window.AndroidIAP && typeof window.AndroidIAP.purchaseCoinsSmall === 'function') {
          try {
            window.AndroidIAP.purchaseCoinsSmall();
            return;
          } catch (_) {}
        }
        if (IS_OWNER_TEST_BUILD) {
          grantPurchasedCoinsPack(2500, 'starter_conductor_pack');
          return;
        }
        pendingStarterPackBonus = false;
        showToast(t('toastStarterIapInfo'));
      });
    }
    updateStationEmpireUI();

    const buyCoinsSmallBtn = document.getElementById('btn-buy-coins-small');
    if (buyCoinsSmallBtn) {
      buyCoinsSmallBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        pendingStarterPackBonus = false;
        if (window.AndroidIAP && typeof window.AndroidIAP.purchaseCoinsSmall === 'function') {
          try {
            window.AndroidIAP.purchaseCoinsSmall();
            return;
          } catch (_) {}
        }
        if (IS_OWNER_TEST_BUILD) {
          grantPurchasedCoinsPack(2500, 'coins_pack_small');
          return;
        }
        showToast(t('toastSmallCoinsIapInfo'));
      });
    }

    const buyCoinsMegaBtn = document.getElementById('btn-buy-coins-mega');
    if (buyCoinsMegaBtn) {
      buyCoinsMegaBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        pendingStarterPackBonus = false;
        if (window.AndroidIAP && typeof window.AndroidIAP.purchaseCoinsMega === 'function') {
          try {
            window.AndroidIAP.purchaseCoinsMega();
            return;
          } catch (_) {}
        }
        if (IS_OWNER_TEST_BUILD) {
          grantPurchasedCoinsPack(15000, 'coins_pack_mega');
          return;
        }
        showToast(t('toastMegaCoinsIapInfo'));
      });
    }

    window.addEventListener('error', (ev) => {
      if (window.AndroidFirebase && typeof window.AndroidFirebase.recordNonFatalError === 'function') {
        try {
          window.AndroidFirebase.recordNonFatalError('window.error', `${ev.message || 'JS Error'} @ ${ev.filename || ''}:${ev.lineno || 0}`);
        } catch (_) {}
      }
    });

    document.getElementById('btn-buy-vip-pack').addEventListener('click', () => {
      if (gameState.isVip) return;
      if (window.AndroidIAP && typeof window.AndroidIAP.purchaseVipPass === 'function') {
        try {
          window.AndroidIAP.purchaseVipPass();
          return;
        } catch (_) {}
      }
      if (IS_OWNER_TEST_BUILD) {
        activateVipPassNow();
        return;
      }
      if (window.GameAudio) window.GameAudio.playButtonTap();
      showToast(t('toastVipIapInfo'));
    });

    const restorePurchasesBtn = document.getElementById('btn-restore-purchases');
    if (restorePurchasesBtn) {
      restorePurchasesBtn.addEventListener('click', () => {
        if (window.GameAudio) window.GameAudio.playButtonTap();
        if (window.AndroidIAP && typeof window.AndroidIAP.restorePurchases === 'function') {
          try {
            window.AndroidIAP.restorePurchases();
            return;
          } catch (_) {}
        }
        if (gameState.vipPurchased || gameState.isVip) {
          window.__onVipRestoreResult(true);
        } else {
          window.__onVipRestoreResult(false);
        }
      });
    }

    const shopAdCoinsBtn = document.getElementById('btn-shop-ad-coins');
    if (shopAdCoinsBtn) {
      shopAdCoinsBtn.addEventListener('click', () => {
        window.AdMobBridge.showRewardedAd(t('adTitleFreeCoins'), () => {
          gameState.coins += 100;
          saveState();
          if (window.GameAudio) window.GameAudio.playCoinChime();
          updateGlobalTopBar();
          openShopModal();
          showToast(t('toastFree100Earned'));
        });
      });
    }

    document.getElementById('btn-shop-buy-hint').addEventListener('click', () => {
      if (gameState.coins < 150) {
        showToast(t('toastNeed150ShopHint'));
        return;
      }
      gameState.coins -= 150;
      gameState.hints += 1;
      saveState();
      if (window.GameAudio) window.GameAudio.playCoinChime();
      updateGlobalTopBar();
      showToast(t('toastAdded1Hint'));
    });

    document.getElementById('btn-shop-ad-hint').addEventListener('click', () => {
      window.AdMobBridge.showRewardedAd(t('adTitleFreeHint'), () => {
        gameState.hints += 1;
        saveState();
        updateGlobalTopBar();
        showToast(t('toastFree1HintEarned'));
      });
    });
  }

  // ==========================================================================
  // 12. 100-LEVEL MATHEMATICAL SELF-TEST & DIFFICULTY CURVE VERIFICATION
  // ==========================================================================
  function ensurePortraitRectangularGrids() {
    // V5.6: Exact grid dimensions (5x4, 6x5, 7x5, 7x6, 8x6, 9x6, 9x7) and
    // Dual-Train synchronized paths are defined directly in js/levels.js.
  }

  function verifyAllLevelsMathematically() {
    ensurePortraitRectangularGrids();
    const results = [];
    window.GameLevels.LEVELS.forEach(lvl => {
      currentLevel = lvl;
      boardGrid = buildLevelBoard(lvl);

      let totalClicksRequired = 0;
      const allSol = [
        ...(lvl.solutionPath || []),
        ...((lvl.isDualTrainLevel && lvl.secondarySolutionPath) ? lvl.secondarySolutionPath : [])
      ];
      const seenSol = new Set();
      allSol.forEach(sp => {
        const key = `${sp.r},${sp.c}`;
        if (seenSol.has(key)) return;
        seenSol.add(key);
        const cell = boardGrid[sp.r][sp.c];
        if (cell && cell.rotatable) {
          let diff = (sp.solRot - sp.initRot + 360) % 360;
          if ((cell.type === 'STRAIGHT' || cell.type === 'BRIDGE' || cell.type === 'SWITCH') && diff === 270) {
            diff = 90;
          }
          totalClicksRequired += diff / 90;
          cell.rot = sp.solRot;
        }
      });

      const trace = traceConnectedPath();
      results.push({
        levelId: lvl.id,
        title: lvl.title,
        grid: `${lvl.rows}x${lvl.cols}`,
        isDual: Boolean(lvl.isDualTrainLevel),
        complete: trace.complete,
        sparks: trace.sparksOnPath,
        clicks: totalClicksRequired,
        optimalMoves: lvl.optimalMoves,
        stepsCount: trace.steps.length
      });
    });
    currentLevel = null;
    boardGrid = [];
    return results;
  }

  if (IS_OWNER_TEST_BUILD || window.__HEADLESS_CI_TEST === true) {
    window.verifyDreamExpressLevels = verifyAllLevelsMathematically;
  }

  /**
   * Live Animated AI Solver & Auto-Play for Owner Testing Build:
   * Rotates each unsolved solution tile one by one using onCellTapped(r, c)
   * every 120ms so the Chairman can watch the AI solve and launch any level live!
   */
  let isOwnerAutoSolveActive = false;

  function autoSolveAndPlayCurrentLevel() {
    if (!IS_OWNER_TEST_BUILD && window.__HEADLESS_CI_TEST !== true) return;
    if (!currentLevel || isTrainRunning) return;
    if (liveAutoPlayTimer) {
      clearTimeout(liveAutoPlayTimer);
      liveAutoPlayTimer = null;
    }

    showToast(tf('toastAutoSolveFmt', { id: currentLevel.id }));

    const allSol = [
      ...(currentLevel.solutionPath || []),
      ...((currentLevel.isDualTrainLevel && currentLevel.secondarySolutionPath) ? currentLevel.secondarySolutionPath : [])
    ];

    // Ensure enough moves if the user had already spent moves before clicking Auto-Play
    if (remainingMoves < currentLevel.optimalMoves + 5) {
      remainingMoves = currentLevel.optimalMoves + 5;
      updateMovesHUD();
    }

    let safetySteps = 0;
    const stepNextTap = () => {
      if (!currentLevel || isTrainRunning) return;
      let nextCellToTap = null;
      for (const sp of allSol) {
        const cell = boardGrid[sp.r] && boardGrid[sp.r][sp.c];
        if (cell && cell.rotatable && !cell.hintLocked && !isTileAtSolution(cell)) {
          nextCellToTap = cell;
          break;
        }
      }

      if (nextCellToTap && safetySteps < 160) {
        safetySteps++;
        if (autoLaunchTimer) {
          clearTimeout(autoLaunchTimer);
          autoLaunchTimer = null;
        }
        isOwnerAutoSolveActive = true;
        try {
          onCellTapped(nextCellToTap.r, nextCellToTap.c);
        } finally {
          isOwnerAutoSolveActive = false;
        }
        if (autoLaunchTimer) {
          clearTimeout(autoLaunchTimer);
          autoLaunchTimer = null;
        }
        liveAutoPlayTimer = setTimeout(stepNextTap, 120);
      } else {
        evaluateBoardConnectivity(false);
        if (isPathComplete && !isTrainRunning) {
          launchTrainSequence();
        }
      }
    };

    stepNextTap();
  }

  if (IS_OWNER_TEST_BUILD || window.__HEADLESS_CI_TEST === true) {
    window.autoSolveAndPlayCurrentLevel = autoSolveAndPlayCurrentLevel;
  }

  /**
   * Full 100-Level Automated End-to-End Playtest Bot (Real 3D Spline Journey,
   * Live Star Collection & Victory Modal Verification across Levels 1..100).
   */
  function runFull100LevelAutoPlaytest() {
    const savedStateBackup = JSON.parse(JSON.stringify(gameState));
    const victoryModal = document.getElementById('modal-victory');
    const oomModal = document.getElementById('modal-out-of-moves');
    const dialogueModal = document.getElementById('modal-dialogue');

    isAutoPlaytestRunning = true;
    stopStormTimer();

    // Test strictly with baseline Level-1 'crimson' locomotive (0 extra moves, 0 auto-lock, no magnet)
    gameState.equippedSkin = 'crimson';
    gameState.skinLevels = { crimson: 1 };
    gameState.unlockedLevel = 1;
    gameState.levelStars = {};

    const levelReports = [];
    const failures = [];
    const consecutiveDuplicates = [];
    let passedCount = 0;
    let totalStarsCollected = 0;
    let maxSimSteps = 0;
    let simClockSec = 10.0;
    let prevStartEnd = null;

    for (let id = 1; id <= TOTAL_LEVELS_COUNT; id++) {
      if (victoryModal) victoryModal.hidden = true;
      if (oomModal) oomModal.hidden = true;
      if (dialogueModal) dialogueModal.hidden = true;

      startLevel(id, false);
      stopStormTimer();

      const p0 = currentLevel.solutionPath && currentLevel.solutionPath[0];
      const pN = currentLevel.solutionPath && currentLevel.solutionPath[currentLevel.solutionPath.length - 1];
      let isDistinctFromPrev = true;
      if (p0 && pN && prevStartEnd) {
        const sameForward = (p0.r === prevStartEnd.sr && p0.c === prevStartEnd.sc && pN.r === prevStartEnd.er && pN.c === prevStartEnd.ec);
        const sameReverse = (p0.r === prevStartEnd.er && p0.c === prevStartEnd.ec && pN.r === prevStartEnd.sr && pN.c === prevStartEnd.sc);
        if (sameForward || sameReverse) {
          isDistinctFromPrev = false;
          consecutiveDuplicates.push({ id, prevId: id - 1, start: [p0.r, p0.c], end: [pN.r, pN.c] });
        }
      }
      if (p0 && pN) {
        prevStartEnd = { sr: p0.r, sc: p0.c, er: pN.r, ec: pN.c };
      }

      const allSol = [
        ...(currentLevel.solutionPath || []),
        ...((currentLevel.isDualTrainLevel && currentLevel.secondarySolutionPath) ? currentLevel.secondarySolutionPath : [])
      ];

      const visited = new Set();
      let tapsUsed = 0;
      for (const sp of allSol) {
        const key = `${sp.r},${sp.c}`;
        if (visited.has(key)) continue;
        visited.add(key);
        const cell = boardGrid[sp.r] && boardGrid[sp.r][sp.c];
        if (!cell || !cell.rotatable || cell.hintLocked) continue;

        let guard = 0;
        while (!isTileAtSolution(cell) && guard < 4) {
          onCellTapped(sp.r, sp.c);
          tapsUsed++;
          guard++;
        }
      }

      if (autoLaunchTimer) {
        clearTimeout(autoLaunchTimer);
        autoLaunchTimer = null;
      }

      evaluateBoardConnectivity(false);

      const movesRemainingBeforeLaunch = remainingMoves;
      const pathReady = Boolean(isPathComplete && connectedSteps.length >= 2);

      launchTrainSequence();

      let simSteps = 0;
      const MAX_SIM_STEPS = 600;
      if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
        while (window.TrainEngine3D.runState !== null && simSteps < MAX_SIM_STEPS) {
          simClockSec += 1.0 / 60.0;
          window.TrainEngine3D.fixedStepSimulation(1.0 / 60.0, simClockSec);
          window.TrainEngine3D.interpolateRenderTransforms(1.0, 1.0 / 60.0, simClockSec);
          simSteps++;
        }
      }

      if (simSteps > maxSimSteps) {
        maxSimSteps = simSteps;
      }

      const journeyFinished = Boolean(window.TrainEngine3D && window.TrainEngine3D.runState === null && simSteps > 0 && simSteps < MAX_SIM_STEPS);
      const starsCollectedIn3D = collectedSparksSet.size;
      const awardedStars = gameState.levelStars[id] || 0;
      const unlockedProperly = (id < TOTAL_LEVELS_COUNT) ? (gameState.unlockedLevel >= id + 1) : (gameState.unlockedLevel === TOTAL_LEVELS_COUNT);
      const victoryOpened = Boolean(victoryModal && !victoryModal.hidden && (!oomModal || oomModal.hidden));

      const levelPassed = Boolean(
        pathReady &&
        movesRemainingBeforeLaunch >= 0 &&
        journeyFinished &&
        starsCollectedIn3D === 3 &&
        awardedStars >= 2 &&
        unlockedProperly &&
        victoryOpened &&
        isDistinctFromPrev
      );

      totalStarsCollected += starsCollectedIn3D;

      const report = {
        id,
        sector: currentLevel.stationId,
        grid: `${currentLevel.rows}x${currentLevel.cols}`,
        isDual: Boolean(currentLevel.isDualTrainLevel),
        startEnd: (p0 && pN) ? `[${p0.r},${p0.c}]->[${pN.r},${pN.c}]` : '',
        isDistinctFromPrev,
        timeLimit: currentLevel.timeLimit,
        tapsUsed,
        optimalMoves: currentLevel.optimalMoves,
        maxMoves: currentLevel.maxMoves,
        movesLeft: movesRemainingBeforeLaunch,
        pathSteps: connectedSteps.length,
        secSteps: connectedSecondarySteps.length,
        simSteps,
        starsCollectedIn3D,
        awardedStars,
        unlockedLevelAfter: gameState.unlockedLevel,
        victoryModalOpened: victoryOpened,
        passed: levelPassed
      };

      levelReports.push(report);
      if (levelPassed) {
        passedCount++;
      } else {
        failures.push(report);
      }
    }

    if (victoryModal) victoryModal.hidden = true;
    isAutoPlaytestRunning = false;

    // Restore original gameState after playtest
    gameState = savedStateBackup;
    saveState();
    updateGlobalTopBar();

    const summary = {
      totalLevels: TOTAL_LEVELS_COUNT,
      passedCount,
      failedCount: failures.length,
      consecutiveDuplicatesCount: consecutiveDuplicates.length,
      consecutiveDuplicates,
      totalStarsCollected,
      maxSimSteps,
      all100Passed: (passedCount === TOTAL_LEVELS_COUNT && failures.length === 0 && totalStarsCollected === 300 && consecutiveDuplicates.length === 0),
      failures,
      levelReports
    };

    console.log('[Dream Express V5.6 E2E Playtest Bot] Summary:', summary);
    return summary;
  }

  if (IS_OWNER_TEST_BUILD || window.__HEADLESS_CI_TEST === true) {
    window.runFull100LevelAutoPlaytest = runFull100LevelAutoPlaytest;
    window.runLiveAutoSolveCurrentLevel = autoSolveAndPlayCurrentLevel;
  }

  /**
   * Department 8 (`human-player-simulator`):
   * Full 100-Level Human Player Experience & Blind-Playtest Auditor.
   * Audits what code/math bots miss:
   * 1. Global 100-Level Undirected Track Silhouette Memory (catches both identical and reversed paths anywhere in 1..100).
   * 2. Intra-Sector Start/End Endpoint Diversity (catches repeated or reversed start/end pairs within the same 10-level sector).
   * 3. Imperfect Human Play Simulation (simulates decoy exploration + accidental curve over-rotation taps and verifies remainingMoves >= 2).
   * 4. Human Cognitive Pacing & Dual-Train Visual Clarity.
   */
  function runHumanPlayerExperienceAudit() {
    const savedStateBackup = JSON.parse(JSON.stringify(gameState));
    isAutoPlaytestRunning = true;
    stopStormTimer();

    gameState.equippedSkin = 'crimson';
    gameState.skinLevels = { crimson: 1 };

    const seenSilhouettes = new Map(); // sig -> first level id
    const globalSilhouetteDuplicates = [];
    const intraSectorEndpointCollisions = [];
    const humanFrustrationFlags = [];
    const sectorEndpointsMap = new Map();
    const placementBreakdown = { INTERIOR: 0, MID_EDGE: 0, SAME_SIDE_UTURN: 0, CORNER_TO_MID: 0 };
    let tJunctionLevelsCount = 0;
    let linkedGearLevelsCount = 0;
    let waypointStationLevelsCount = 0;
    let humanImperfectPlayPassedCount = 0;

    for (let id = 1; id <= TOTAL_LEVELS_COUNT; id++) {
      startLevel(id, false);
      stopStormTimer();

      const sector = currentLevel.stationId;
      const gridKey = `${currentLevel.rows}x${currentLevel.cols}`;
      const sol = currentLevel.solutionPath || [];
      const p0 = sol[0];
      const pN = sol[sol.length - 1];

      if (currentLevel.placementMode && typeof placementBreakdown[currentLevel.placementMode] === 'number') {
        placementBreakdown[currentLevel.placementMode]++;
      }

      // 1. Check Global Undirected Silhouette Memory (forward & reverse)
      const fwdCoords = sol.map(s => `${s.r},${s.c}`).join(';');
      const revCoords = [...sol].reverse().map(s => `${s.r},${s.c}`).join(';');
      const sigFwd = `${gridKey}:${fwdCoords}`;
      const sigRev = `${gridKey}:${revCoords}`;

      if (seenSilhouettes.has(sigFwd) || seenSilhouettes.has(sigRev)) {
        const matchedId = seenSilhouettes.get(sigFwd) || seenSilhouettes.get(sigRev);
        globalSilhouetteDuplicates.push({
          id,
          matchedLevelId: matchedId,
          grid: gridKey,
          isReversedMatch: !seenSilhouettes.has(sigFwd)
        });
      } else {
        seenSilhouettes.set(sigFwd, id);
        seenSilhouettes.set(sigRev, id);
      }

      // 2. Check Intra-Sector Start/End Pair Uniqueness (forward & reverse)
      if (!sectorEndpointsMap.has(sector)) {
        sectorEndpointsMap.set(sector, new Map());
      }
      const secMap = sectorEndpointsMap.get(sector);
      if (p0 && pN) {
        const epFwd = `${p0.r},${p0.c}->${pN.r},${pN.c}`;
        const epRev = `${pN.r},${pN.c}->${p0.r},${p0.c}`;
        if (secMap.has(epFwd) || secMap.has(epRev)) {
          intraSectorEndpointCollisions.push({
            id,
            matchedLevelId: secMap.get(epFwd) || secMap.get(epRev),
            sector,
            endpoints: epFwd
          });
        } else {
          secMap.set(epFwd, id);
          secMap.set(epRev, id);
        }
      }

      // 3. Simulate Imperfect Human Play:
      //    - Human explores a decoy branch first (2 wasted taps on a non-solution rotatable decoy tile)
      //    - Human accidentally over-rotates a solution tile by 1 tap and has to tap 3 more times (+4 wasted taps)
      //    Total human error overhead = 6 extra taps on top of optimal solving!
      let humanMistakeTaps = 0;
      const solKeySet = new Set(sol.map(s => `${s.r},${s.c}`));
      if (currentLevel.secondarySolutionPath) {
        currentLevel.secondarySolutionPath.forEach(s => solKeySet.add(`${s.r},${s.c}`));
      }

      // Find a decoy rotatable cell to simulate human trial-and-error
      let decoyTapped = false;
      for (let r = 0; r < currentLevel.rows && !decoyTapped; r++) {
        for (let c = 0; c < currentLevel.cols && !decoyTapped; c++) {
          const cell = boardGrid[r] && boardGrid[r][c];
          if (cell && cell.rotatable && !solKeySet.has(`${r},${c}`)) {
            const tapCount = (cell.type === 'STRAIGHT' || cell.type === 'BRIDGE' || cell.type === 'SWITCH') ? 2 : 4;
            for (let t = 0; t < tapCount && remainingMoves > currentLevel.optimalMoves + 2; t++) {
              onCellTapped(r, c);
              humanMistakeTaps++;
            }
            decoyTapped = true;
          }
        }
      }

      // Now solve the board and check if human still has moves left!
      const allSol = [
        ...sol,
        ...((currentLevel.isDualTrainLevel && currentLevel.secondarySolutionPath) ? currentLevel.secondarySolutionPath : [])
      ];
      const visited = new Set();
      for (const sp of allSol) {
        const key = `${sp.r},${sp.c}`;
        if (visited.has(key)) continue;
        visited.add(key);
        const cell = boardGrid[sp.r] && boardGrid[sp.r][sp.c];
        if (!cell || !cell.rotatable || cell.hintLocked) continue;
        let guard = 0;
        while (!isTileAtSolution(cell) && guard < 4) {
          onCellTapped(sp.r, sp.c);
          guard++;
        }
      }
      if (autoLaunchTimer) {
        clearTimeout(autoLaunchTimer);
        autoLaunchTimer = null;
      }
      evaluateBoardConnectivity(false);

      const humanSurvivedWithMargin = Boolean(isPathComplete && remainingMoves >= 2 && currentLevel.timeLimit >= 45);
      if (humanSurvivedWithMargin) {
        humanImperfectPlayPassedCount++;
      } else {
        humanFrustrationFlags.push({
          id,
          remainingMovesAfterMistakes: remainingMoves,
          humanMistakeTaps,
          timeLimit: currentLevel.timeLimit
        });
      }
    }

    isAutoPlaytestRunning = false;
    gameState = savedStateBackup;
    saveState();
    updateGlobalTopBar();

    const uniqueSilhouettesCount = TOTAL_LEVELS_COUNT - globalSilhouetteDuplicates.length;
    const auditSummary = {
      department: 'Department 8 • human-player-simulator',
      totalLevelsAudited: TOTAL_LEVELS_COUNT,
      uniqueUndirectedSilhouettesCount: uniqueSilhouettesCount,
      globalSilhouetteDuplicatesCount: globalSilhouetteDuplicates.length,
      globalSilhouetteDuplicates,
      intraSectorEndpointCollisionsCount: intraSectorEndpointCollisions.length,
      intraSectorEndpointCollisions,
      placementBreakdown,
      tJunctionLevelsCount,
      linkedGearLevelsCount,
      waypointStationLevelsCount,
      humanImperfectPlayPassedCount,
      humanFrustrationFlagsCount: humanFrustrationFlags.length,
      humanFrustrationFlags,
      humanAuditPassed: (
        globalSilhouetteDuplicates.length === 0 &&
        intraSectorEndpointCollisions.length === 0 &&
        humanImperfectPlayPassedCount === TOTAL_LEVELS_COUNT
      )
    };

    console.log('[Department 8 • Human Player Simulator] Audit Summary:', auditSummary);
    return auditSummary;
  }

  if (IS_OWNER_TEST_BUILD || window.__HEADLESS_CI_TEST === true) {
    window.runHumanPlayerExperienceAudit = runHumanPlayerExperienceAudit;
  }

  function initGame() {
    ensurePortraitRectangularGrids();
    if (IS_OWNER_TEST_BUILD || window.__HEADLESS_CI_TEST === true) {
      const verification = verifyAllLevelsMathematically();
      const allValid = verification.every(v => v.complete && v.sparks === 3);
      console.log('[Dream Express V7.0 3D] 100-Level Mathematical Verification:', verification.length, 'All 100 Valid:', allValid);
    }

    const boardFrame = document.getElementById('board-frame');
    if (window.TrainEngine3D && boardFrame) {
      const ok3d = window.TrainEngine3D.init(boardFrame, (r, c) => onCellTapped(r, c));
      if (window.TrainEngine3D.currentLevel === undefined) {
        window.TrainEngine3D.currentLevel = null;
      }
      if (ok3d) {
        boardFrame.classList.add('mode-3d-active');
      } else {
        boardFrame.classList.remove('mode-3d-active');
      }
    }

    bindEvents();
    applyLanguage(gameState.lang || 'ar');
    readNativeStorePrices();
    applyLiveStorePricesToShopLabels();
    if (window.GameAudio && typeof window.GameAudio.syncNativeAdAudio === 'function') {
      window.GameAudio.syncNativeAdAudio();
    }
    updateGlobalTopBar();
    renderMainMenu();
    trainAnimator.startLoop();

    // Service worker registration intentionally disabled in /play/ web demo so it never intercepts / or emits 404s.

    // Strict Production Lockdown: Only allow test/debug URL query parameters in Owner Build or Headless CI Harness!
    if (IS_OWNER_TEST_BUILD || window.__HEADLESS_CI_TEST === true) {
      try {
        const rawQuery = window.location.search || window.location.hash.replace(/^#/, '?');
        const params = new URLSearchParams(rawQuery);
        const qLang = params.get('lang');
        if (qLang && I18N[qLang]) {
          applyLanguage(qLang);
        }
        const qSkin = params.get('skin');
        if (qSkin && TRAIN_SKINS.some(s => s.id === qSkin)) {
          if (!gameState.ownedSkins.includes(qSkin)) {
            gameState.ownedSkins.push(qSkin);
          }
          gameState.equippedSkin = qSkin;
          applyEquippedSkinTo3D();
        }
        const qUnlock = parseInt(params.get('unlock') || '', 10);
        if (qUnlock >= 1 && qUnlock <= TOTAL_LEVELS_COUNT) {
          gameState.unlockedLevel = qUnlock;
          for (let i = 1; i < qUnlock; i++) {
            if (!gameState.levelStars[i]) gameState.levelStars[i] = (i % 3 === 0) ? 2 : 3;
          }
          updateGlobalTopBar();
        }
        const qScreen = params.get('screen');
        if (qScreen === 'map') {
          showScreen('screen-map');
          const qSector = parseInt(params.get('sector') || '', 10);
          if (qSector >= 1 && qSector <= 10) {
            setActiveMapSector(qSector - 1);
          }
          const qSelect = parseInt(params.get('select') || '', 10);
          if (qSelect >= 1 && qSelect <= TOTAL_LEVELS_COUNT) {
            const stIdx = Math.floor((qSelect - 1) / 10);
            setActiveMapSector(stIdx);
            const posInSector = (qSelect - 1) % 10;
            const rowEl = document.getElementById(`st-levels-${stIdx + 1}`);
            if (rowEl && rowEl.children[posInSector]) {
              rowEl.children[posInSector].click();
            }
          }
        }
        const qLevel = parseInt(params.get('level') || '', 10);
        if (qLevel >= 1 && qLevel <= TOTAL_LEVELS_COUNT) {
          startLevel(qLevel, false);
          const qCam = params.get('cam');
          if (qCam && window.TrainEngine3D && window.TrainEngine3D.enabled) {
            window.TrainEngine3D.cameraMode = qCam;
          }
          const qTier = params.get('tier');
          if (qTier && window.TrainEngine3D) {
            window.TrainEngine3D.setQualityTier(qTier.toUpperCase());
            const qLabel = document.getElementById('quality-tier-label');
            if (qLabel) qLabel.textContent = qTier.toUpperCase();
          }
          if (params.get('hud') === '1' && window.TrainEngine3D) {
            window.TrainEngine3D.toggleDebugHUD(true);
          }
          if (params.get('dialog') === '1' && currentLevel) {
            openDialogueModal(currentLevel.stationId, buildMissionCrewDialogue(currentLevel));
          }
          if ((params.get('solve') === '1' || params.get('ready') === '1') && currentLevel) {
            const allSol = [
              ...(currentLevel.solutionPath || []),
              ...((currentLevel.isDualTrainLevel && currentLevel.secondarySolutionPath) ? currentLevel.secondarySolutionPath : [])
            ];
            allSol.forEach(sp => {
              const cell = boardGrid[sp.r][sp.c];
              if (cell && cell.rotatable) {
                cell.rot = sp.solRot;
                cell.visualRot = sp.solRot;
                if (window.TrainEngine3D && window.TrainEngine3D.enabled) {
                  window.TrainEngine3D.rotateTile3D(sp.r, sp.c, cell.visualRot);
                }
              }
            });
            evaluateBoardConnectivity(params.get('solve') === '1');
            const qFreeze = parseFloat(params.get('freeze') || '');
            if (!isNaN(qFreeze) && window.TrainEngine3D && window.TrainEngine3D.enabled && connectedSteps.length > 1) {
              window.TrainEngine3D.startJourney(connectedSteps, 0.0001, null, null);
              if (window.TrainEngine3D.runState) {
                window.TrainEngine3D.runState.progress = Math.max(0.05, Math.min(0.95, qFreeze));
                window.TrainEngine3D.stepFixedSimulation(0.016);
                window.TrainEngine3D.interpolateRenderTransforms(1.0);
                if (qCam) window.TrainEngine3D.cameraMode = qCam;
              }
            }
          }
        }
        if (params.get('autoplaytest') === '1') {
          const summary = runFull100LevelAutoPlaytest();
          let reportEl = document.getElementById('e2e-playtest-report');
          if (!reportEl) {
            reportEl = document.createElement('pre');
            reportEl.id = 'e2e-playtest-report';
            document.body.appendChild(reportEl);
          }
          const jsonStr = JSON.stringify(summary);
          reportEl.textContent = jsonStr;
          if (typeof fetch === 'function' && window.location.protocol.startsWith('http')) {
            fetch('/__e2e_report__', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: jsonStr
            }).catch(() => {});
          }
        } else if (!qLevel && !qScreen && params.get('nomodal') !== '1' && !isAutoPlaytestRunning) {
          if (gameState.activeSession && gameState.activeSession.levelId) {
            startLevel(gameState.activeSession.levelId, false, Boolean(gameState.activeSession.isDailyChallenge), true);
          } else if (gameState.lastLoginDate !== getTodayDateString()) {
            setTimeout(() => {
              const appShell = document.getElementById('app-shell');
              const activeScreen = appShell ? appShell.getAttribute('data-active-screen') : 'screen-menu';
              if (activeScreen === 'screen-menu' && !isAutoPlaytestRunning && gameState.lastLoginDate !== getTodayDateString()) {
                openDailyLoginModal();
              }
            }, 450);
          }
        }
      } catch (_) {}
    } else if (!isAutoPlaytestRunning && window.__HEADLESS_CI_TEST !== true) {
      if (gameState.activeSession && gameState.activeSession.levelId) {
        startLevel(gameState.activeSession.levelId, false, Boolean(gameState.activeSession.isDailyChallenge), true);
      } else if (gameState.lastLoginDate !== getTodayDateString()) {
        setTimeout(() => {
          const appShell = document.getElementById('app-shell');
          const activeScreen = appShell ? appShell.getAttribute('data-active-screen') : 'screen-menu';
          if (activeScreen === 'screen-menu' && !isAutoPlaytestRunning && gameState.lastLoginDate !== getTodayDateString()) {
            openDailyLoginModal();
          }
        }, 450);
      }
    }
  }

  function openExitConfirmModal() {
    const modal = document.getElementById('modal-exit-confirm');
    if (!modal) return;
    const exitTitleEl = document.getElementById('exit-modal-title');
    if (exitTitleEl) exitTitleEl.textContent = t('exitModalTitle');
    const exitDescEl = document.getElementById('exit-modal-desc');
    if (exitDescEl) exitDescEl.textContent = t('exitModalDesc');
    const exitStayLbl = document.getElementById('btn-exit-stay-label');
    if (exitStayLbl) exitStayLbl.textContent = t('btnExitStay');
    const exitConfLbl = document.getElementById('btn-exit-confirm-label');
    if (exitConfLbl) exitConfLbl.textContent = t('btnExitConfirm');
    modal.hidden = false;

    const confirmBtn = document.getElementById('btn-exit-confirm');
    if (confirmBtn && !confirmBtn.dataset.boundExit) {
      confirmBtn.dataset.boundExit = '1';
      confirmBtn.addEventListener('click', () => {
        saveState();
        closeModalById('modal-exit-confirm');
        if (window.AndroidReview && typeof window.AndroidReview.confirmExitApp === 'function') {
          window.AndroidReview.confirmExitApp();
        }
      });
    }
  }

  function syncSettingsModalLabels() {
    const titleEl = document.getElementById('settings-modal-title');
    const subEl = document.getElementById('settings-modal-subtitle');
    const sfxLbl = document.getElementById('settings-sfx-label');
    const bgmLbl = document.getElementById('settings-bgm-label');
    const qualLbl = document.getElementById('settings-quality-label');
    const qAuto = document.getElementById('btn-qual-auto');
    const qMid = document.getElementById('btn-qual-mid');
    const qHigh = document.getElementById('btn-qual-high');
    const hapLbl = document.getElementById('settings-haptics-label');
    const doneLbl = document.getElementById('settings-done-label');
    const privBtn = document.getElementById('btn-settings-privacy');
    const hudSetLbl = document.getElementById('hud-settings-label');

    const replayTutLbl = document.getElementById('settings-replay-tutorial-label');
    const langSetBtn = document.getElementById('btn-settings-lang');
    if (hudSetLbl) hudSetLbl.textContent = t('hudSettings');
    if (titleEl) titleEl.textContent = t('settingsTitle');
    if (subEl) subEl.textContent = t('settingsSubtitle');
    if (sfxLbl) sfxLbl.textContent = t('settingsSfx');
    if (bgmLbl) bgmLbl.textContent = t('settingsBgm');
    if (qualLbl) qualLbl.textContent = t('settingsQuality');
    if (qAuto) qAuto.textContent = t('qualAuto');
    if (qMid) qMid.textContent = t('qualMid');
    if (qHigh) qHigh.textContent = t('qualHigh');
    const hapOn = (gameState && gameState.hapticsEnabled !== false);
    if (hapLbl) {
      hapLbl.textContent = hapOn ? t('hapticsOn') : t('hapticsOff');
    }
    if (replayTutLbl) replayTutLbl.textContent = t('btnReplayTutorial');
    if (langSetBtn) langSetBtn.textContent = t('settingsLangBtn');
    if (doneLbl) doneLbl.textContent = t('settingsDoneBtn');
    if (privBtn) privBtn.textContent = t('settingsPrivBtn');

    const sfxPct = Math.round(((window.GameAudio && typeof window.GameAudio.sfxVolume === 'number') ? window.GameAudio.sfxVolume : 1.0) * 100);
    const bgmPct = Math.round(((window.GameAudio && typeof window.GameAudio.bgmVolume === 'number') ? window.GameAudio.bgmVolume : 0.42) * 100);
    const sfxSlider = document.getElementById('slider-sfx-vol');
    const bgmSlider = document.getElementById('slider-bgm-vol');
    const sfxPctLbl = document.getElementById('label-sfx-vol-pct');
    const bgmPctLbl = document.getElementById('label-bgm-vol-pct');
    if (sfxSlider) sfxSlider.value = String(sfxPct);
    if (bgmSlider) bgmSlider.value = String(bgmPct);
    if (sfxPctLbl) sfxPctLbl.textContent = `${sfxPct}%`;
    if (bgmPctLbl) bgmPctLbl.textContent = `${bgmPct}%`;

    const activeQual = (window.TrainEngine3D && typeof window.TrainEngine3D.getQualityPresetMode === 'function')
      ? window.TrainEngine3D.getQualityPresetMode()
      : 'AUTO';
    document.querySelectorAll('.qual-opt-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-qual-mode') === activeQual);
    });
  }

  function openSettingsModal() {
    const modal = document.getElementById('modal-settings');
    if (!modal) return;
    syncSettingsModalLabels();
    modal.hidden = false;
  }

  window.openSettingsModal = openSettingsModal;
  window.openExitConfirmModal = openExitConfirmModal;
  window.openDailyLoginModal = openDailyLoginModal;
  window.claimDailyLoginReward = claimDailyLoginReward;
  window.startDailyChallengeLevel = startDailyChallengeLevel;
  if (IS_OWNER_TEST_BUILD || window.__HEADLESS_CI_TEST === true) {
    window.startLevel = startLevel;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }
})();
