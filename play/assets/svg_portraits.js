/**
 * 🚂 قطار الأحلام: ألغاز المحطات - الإصدار الثالث ثلاثي الأبعاد (Version 3.0 — 3D PBR & 100 Levels Edition)
 * مكتبة الأصول البصرية المتجهية للقاطرات المدرعة والشخصيات والبيئات العشر (10 Biomes / 100 Levels)
 * الأسلوب الفني: Semi-Realistic 2.5D/3D Lighting & Sleek Industrial Graphic Novel Vector Art
 * إعداد: مدير الفنون وتصميم الشخصيات (Character & Art Director)
 *
 * تصدّر الكائن العام: window.GameArt
 * - window.GameArt.portraits: { fouad, amal, saffar, saffar_spring, saffar_brass, saffar_gold, rabie, burhan, siraj, tariq, layla }
 * - window.GameArt.stations:  { station1 .. station10 } (تغطي 10 بيئات كاملة للمراحل الـ 100)
 * - window.GameArt.palette:   لوحة الألوان الاحترافية للإصدار 3.0
 */
(function (global) {
  'use strict';

  const PALETTE = {
    outline: '#0F172A',
    steelDark: '#1E293B',
    steelMid: '#475569',
    steelLight: '#94A3B8',
    plasmaCyan: '#38BDF8',
    plasmaCore: '#E0F2FE',
    amberGold: '#F59E0B',
    royalGold: '#FACC15',
    crimsonArmor: '#DC2626',
    emeraldTech: '#10B981',
    violetCore: '#A855F7',
    magmaOrange: '#EA580C'
  };

  // ============================================================================
  // 1. القاطرات المدرعة التوربينية وبورتريهات القادة والمهندسين (200x200 ViewBox)
  // ============================================================================

  const PORTRAITS = {
    /**
     * 1. القاطرة التوربينية المدرعة "صفّار" (Saffar - Crimson Hawk Turbine Locomotive)
     * تصميم هندسي صناعي فخم بدون أي ملامح طفولية: دروع فولاذية وقرمزية، نواة بلازما توربينية زرقاء متوهجة، كشاف علوي، وتروس نحاسية
     */
    saffar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="saffar_bg" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#1E293B"/>
          <stop offset="65%" stop-color="#0F172A"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
        <linearGradient id="saffar_armor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EF4444"/>
          <stop offset="50%" stop-color="#B91C1C"/>
          <stop offset="100%" stop-color="#7F1D1D"/>
        </linearGradient>
        <linearGradient id="saffar_steel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#64748B"/>
          <stop offset="50%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <linearGradient id="saffar_brass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="50%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#92400E"/>
        </linearGradient>
        <radialGradient id="saffar_plasma" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="40%" stop-color="#38BDF8"/>
          <stop offset="75%" stop-color="#0284C7"/>
          <stop offset="100%" stop-color="#1E3A8A"/>
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="94" fill="url(#saffar_bg)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="100" r="89" fill="none" stroke="url(#saffar_brass)" stroke-width="2.5"/>
      <circle cx="100" cy="100" r="84" fill="none" stroke="#38BDF8" stroke-width="1" stroke-dasharray="8 6" opacity="0.5"/>

      <path d="M148 22 L136 42 L146 44 L130 68" fill="none" stroke="#38BDF8" stroke-width="2" opacity="0.8"/>
      <path d="M46 30 L56 48 L48 50 L60 68" fill="none" stroke="#38BDF8" stroke-width="1.5" opacity="0.6"/>

      <path d="M92 38 C90 24, 108 16, 126 18 C142 14, 158 22, 152 34 C138 40, 110 42, 92 38 Z" fill="#334155" opacity="0.85"/>
      <circle cx="112" cy="26" r="2.2" fill="#FACC15"/>
      <circle cx="128" cy="22" r="1.8" fill="#F97316"/>
      <circle cx="140" cy="28" r="2" fill="#FACC15"/>

      <path d="M26 172 L174 172 M38 180 L162 180" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M26 172 L174 172" stroke="#E0F2FE" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M48 168 L40 184 M74 168 L68 184 M100 168 L100 184 M126 168 L132 184 M152 168 L160 184" stroke="#475569" stroke-width="4" stroke-linecap="round"/>

      <g stroke="#0F172A" stroke-width="3">
        <circle cx="60" cy="158" r="14" fill="url(#saffar_steel)"/>
        <circle cx="60" cy="158" r="6" fill="url(#saffar_brass)"/>
        <circle cx="140" cy="158" r="14" fill="url(#saffar_steel)"/>
        <circle cx="140" cy="158" r="6" fill="url(#saffar_brass)"/>
        <rect x="52" y="154" width="96" height="6" rx="3" fill="#94A3B8"/>
      </g>

      <polygon points="44,68 100,56 156,68 150,78 50,78" fill="url(#saffar_steel)" stroke="#0F172A" stroke-width="3.5"/>
      <rect x="48" y="76" width="104" height="66" rx="6" fill="url(#saffar_armor)" stroke="#0F172A" stroke-width="3.8"/>
      <polygon points="56,84 78,84 78,100 56,104" fill="#FEF08A" stroke="#0F172A" stroke-width="2.5"/>
      <polygon points="144,84 122,84 122,100 144,104" fill="#FEF08A" stroke="#0F172A" stroke-width="2.5"/>

      <path d="M44 114 L64 114 M136 114 L156 114" stroke="url(#saffar_brass)" stroke-width="5" stroke-linecap="round"/>
      <path d="M46 124 L66 124 M134 124 L154 124" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>

      <polygon points="86,40 114,40 110,74 90,74" fill="url(#saffar_steel)" stroke="#0F172A" stroke-width="3.5"/>
      <rect x="82" y="36" width="36" height="7" rx="3" fill="url(#saffar_brass)" stroke="#0F172A" stroke-width="2.8"/>

      <circle cx="100" cy="60" r="11" fill="url(#saffar_brass)" stroke="#0F172A" stroke-width="3"/>
      <circle cx="100" cy="60" r="7" fill="#FEF9C3"/>
      <circle cx="100" cy="60" r="3.5" fill="#FFFFFF"/>

      <circle cx="100" cy="112" r="44" fill="url(#saffar_steel)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="112" r="38" fill="none" stroke="url(#saffar_brass)" stroke-width="4" stroke-dasharray="12 6"/>
      <circle cx="100" cy="112" r="32" fill="#0F172A" stroke="#475569" stroke-width="3"/>

      <circle cx="100" cy="112" r="25" fill="url(#saffar_plasma)"/>
      <g stroke="#0F172A" stroke-width="2.5">
        <line x1="100" y1="84" x2="100" y2="140"/>
        <line x1="72" y1="112" x2="128" y2="112"/>
        <line x1="80" y1="92" x2="120" y2="132"/>
        <line x1="120" y1="92" x2="80" y2="132"/>
      </g>
      <circle cx="100" cy="112" r="14" fill="url(#saffar_brass)" stroke="#0F172A" stroke-width="3"/>
      <circle cx="100" cy="112" r="8" fill="#E0F2FE"/>
      <circle cx="100" cy="112" r="4" fill="#FFFFFF"/>

      <polygon points="48,142 152,142 160,152 40,152" fill="url(#saffar_armor)" stroke="#0F172A" stroke-width="3.5"/>
      <polygon points="56,152 144,152 156,170 100,176 44,170" fill="url(#saffar_steel)" stroke="#0F172A" stroke-width="3.5"/>
      <path d="M68 152 L60 171 M84 152 L80 173 M100 152 L100 176 M116 152 L120 173 M132 152 L140 171" stroke="url(#saffar_brass)" stroke-width="3"/>

      <circle cx="56" cy="138" r="7" fill="url(#saffar_brass)" stroke="#0F172A" stroke-width="2.5"/>
      <circle cx="56" cy="138" r="4" fill="#38BDF8"/>
      <circle cx="144" cy="138" r="7" fill="url(#saffar_brass)" stroke="#0F172A" stroke-width="2.5"/>
      <circle cx="144" cy="138" r="4" fill="#38BDF8"/>
    </svg>`,

    /**
     * 2. القاطرة الإمبراطورية الذهبية (VIP Royal Gold & Plasma Dreadnought - saffar_gold)
     */
    saffar_gold: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="sgold_bg" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#3B0764"/>
          <stop offset="65%" stop-color="#1E1B4B"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
        <linearGradient id="sgold_armor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF9C3"/>
          <stop offset="35%" stop-color="#FACC15"/>
          <stop offset="75%" stop-color="#CA8A04"/>
          <stop offset="100%" stop-color="#854D0E"/>
        </linearGradient>
        <linearGradient id="sgold_obsidian" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#581C87"/>
          <stop offset="50%" stop-color="#1E1B4B"/>
          <stop offset="100%" stop-color="#090D16"/>
        </linearGradient>
        <radialGradient id="sgold_core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="45%" stop-color="#38BDF8"/>
          <stop offset="80%" stop-color="#A855F7"/>
          <stop offset="100%" stop-color="#3B0764"/>
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="94" fill="url(#sgold_bg)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="url(#sgold_armor)" stroke-width="3.5"/>

      <path d="M150 28 L153 35 L160 38 L153 41 L150 48 L147 41 L140 38 L147 35 Z" fill="#FACC15"/>
      <path d="M46 34 L48 40 L54 42 L48 44 L46 50 L44 44 L38 42 L44 40 Z" fill="#38BDF8"/>

      <path d="M26 172 L174 172 M38 180 L162 180" stroke="url(#sgold_armor)" stroke-width="5" stroke-linecap="round"/>
      <path d="M48 168 L40 184 M74 168 L68 184 M100 168 L100 184 M126 168 L132 184 M152 168 L160 184" stroke="#7E22CE" stroke-width="4" stroke-linecap="round"/>

      <g stroke="#0F172A" stroke-width="3">
        <circle cx="60" cy="158" r="14" fill="url(#sgold_obsidian)"/>
        <circle cx="60" cy="158" r="7" fill="url(#sgold_armor)"/>
        <circle cx="140" cy="158" r="14" fill="url(#sgold_obsidian)"/>
        <circle cx="140" cy="158" r="7" fill="url(#sgold_armor)"/>
        <rect x="52" y="154" width="96" height="6" rx="3" fill="url(#sgold_armor)"/>
      </g>

      <polygon points="42,66 100,52 158,66 150,78 50,78" fill="url(#sgold_obsidian)" stroke="url(#sgold_armor)" stroke-width="3"/>
      <rect x="48" y="76" width="104" height="66" rx="6" fill="url(#sgold_armor)" stroke="#0F172A" stroke-width="3.8"/>
      <polygon points="56,84 78,84 78,100 56,104" fill="#38BDF8" stroke="#0F172A" stroke-width="2.5"/>
      <polygon points="144,84 122,84 122,100 144,104" fill="#38BDF8" stroke="#0F172A" stroke-width="2.5"/>

      <polygon points="78,48 74,26 90,36 100,20 110,36 126,26 122,48" fill="url(#sgold_armor)" stroke="#0F172A" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="100,26 105,35 100,44 95,35" fill="#38BDF8" stroke="#0F172A" stroke-width="2"/>
      <polygon points="84,48 116,48 112,74 88,74" fill="url(#sgold_obsidian)" stroke="url(#sgold_armor)" stroke-width="3"/>

      <polygon points="100,48 112,60 100,72 88,60" fill="url(#sgold_armor)" stroke="#0F172A" stroke-width="2.8"/>
      <circle cx="100" cy="60" r="5" fill="#FFFFFF"/>

      <circle cx="100" cy="112" r="44" fill="url(#sgold_obsidian)" stroke="url(#sgold_armor)" stroke-width="4.5"/>
      <circle cx="100" cy="112" r="36" fill="none" stroke="url(#sgold_armor)" stroke-width="3" stroke-dasharray="10 5"/>
      <circle cx="100" cy="112" r="28" fill="url(#sgold_core)"/>
      <g stroke="url(#sgold_armor)" stroke-width="2.5">
        <line x1="100" y1="82" x2="100" y2="142"/>
        <line x1="70" y1="112" x2="130" y2="112"/>
        <line x1="79" y1="91" x2="121" y2="133"/>
        <line x1="121" y1="91" x2="79" y2="133"/>
      </g>
      <polygon points="100,96 116,112 100,128 84,112" fill="url(#sgold_armor)" stroke="#0F172A" stroke-width="3"/>
      <polygon points="100,103 109,112 100,121 91,112" fill="#38BDF8"/>
      <circle cx="100" cy="112" r="3.5" fill="#FFFFFF"/>

      <polygon points="48,142 152,142 160,152 40,152" fill="url(#sgold_obsidian)" stroke="url(#sgold_armor)" stroke-width="3"/>
      <polygon points="56,152 144,152 156,170 100,176 44,170" fill="url(#sgold_armor)" stroke="#0F172A" stroke-width="3.5"/>
      <path d="M68 152 L60 171 M84 152 L80 173 M100 152 L100 176 M116 152 L120 173 M132 152 L140 171" stroke="#581C87" stroke-width="3.5"/>
      <circle cx="56" cy="138" r="7" fill="url(#sgold_armor)" stroke="#0F172A" stroke-width="2.5"/>
      <circle cx="56" cy="138" r="4" fill="#38BDF8"/>
      <circle cx="144" cy="138" r="7" fill="url(#sgold_armor)" stroke="#0F172A" stroke-width="2.5"/>
      <circle cx="144" cy="138" r="4" fill="#38BDF8"/>
    </svg>`,

    /**
     * 3. قاطرة العاصفة الزمردية التوربينية (Emerald Bio-Turbine Locomotive - saffar_spring)
     */
    saffar_spring: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="sspring_bg" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#064E3B"/>
          <stop offset="70%" stop-color="#022C22"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
        <linearGradient id="sspring_armor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34D399"/>
          <stop offset="50%" stop-color="#059669"/>
          <stop offset="100%" stop-color="#064E3B"/>
        </linearGradient>
        <radialGradient id="sspring_core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="45%" stop-color="#4ADE80"/>
          <stop offset="85%" stop-color="#059669"/>
          <stop offset="100%" stop-color="#022C22"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill="url(#sspring_bg)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="#10B981" stroke-width="2.5"/>
      <path d="M26 172 L174 172 M38 180 L162 180" stroke="#4ADE80" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="60" cy="158" r="14" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
      <circle cx="140" cy="158" r="14" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
      <polygon points="44,68 100,56 156,68 150,78 50,78" fill="#1E293B" stroke="#0F172A" stroke-width="3.5"/>
      <rect x="48" y="76" width="104" height="66" rx="6" fill="url(#sspring_armor)" stroke="#0F172A" stroke-width="3.8"/>
      <polygon points="86,40 114,40 110,74 90,74" fill="#1E293B" stroke="#0F172A" stroke-width="3.5"/>
      <circle cx="100" cy="60" r="10" fill="#FACC15" stroke="#0F172A" stroke-width="3"/>
      <circle cx="100" cy="60" r="5" fill="#FFFFFF"/>
      <circle cx="100" cy="112" r="44" fill="#1E293B" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="112" r="36" fill="none" stroke="#34D399" stroke-width="3" stroke-dasharray="10 5"/>
      <circle cx="100" cy="112" r="26" fill="url(#sspring_core)"/>
      <g stroke="#0F172A" stroke-width="2.5">
        <line x1="100" y1="84" x2="100" y2="140"/>
        <line x1="72" y1="112" x2="128" y2="112"/>
        <line x1="80" y1="92" x2="120" y2="132"/>
        <line x1="120" y1="92" x2="80" y2="132"/>
      </g>
      <circle cx="100" cy="112" r="10" fill="#FACC15" stroke="#0F172A" stroke-width="2.5"/>
      <circle cx="100" cy="112" r="5" fill="#FFFFFF"/>
      <polygon points="48,142 152,142 160,152 40,152" fill="url(#sspring_armor)" stroke="#0F172A" stroke-width="3.5"/>
      <polygon points="56,152 144,152 156,170 100,176 44,170" fill="#1E293B" stroke="#0F172A" stroke-width="3.5"/>
      <path d="M68 152 L60 171 M84 152 L80 173 M100 152 L100 176 M116 152 L120 173 M132 152 L140 171" stroke="#34D399" stroke-width="3"/>
    </svg>`,

    /**
     * 4. قاطرة القلعة النحاسية المدرعة (Steampunk Brass Dreadnought - saffar_brass)
     */
    saffar_brass: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="sbrass_bg" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#78350F"/>
          <stop offset="70%" stop-color="#451A03"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </radialGradient>
        <linearGradient id="sbrass_armor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FBBF24"/>
          <stop offset="50%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#78350F"/>
        </linearGradient>
        <radialGradient id="sbrass_core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="45%" stop-color="#F97316"/>
          <stop offset="85%" stop-color="#DC2626"/>
          <stop offset="100%" stop-color="#451A03"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill="url(#sbrass_bg)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="#F59E0B" stroke-width="2.5"/>
      <path d="M26 172 L174 172 M38 180 L162 180" stroke="#F59E0B" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="60" cy="158" r="14" fill="#451A03" stroke="#0F172A" stroke-width="3"/>
      <circle cx="140" cy="158" r="14" fill="#451A03" stroke="#0F172A" stroke-width="3"/>
      <polygon points="44,68 100,56 156,68 150,78 50,78" fill="#451A03" stroke="#0F172A" stroke-width="3.5"/>
      <rect x="48" y="76" width="104" height="66" rx="6" fill="url(#sbrass_armor)" stroke="#0F172A" stroke-width="3.8"/>
      <polygon points="86,40 114,40 110,74 90,74" fill="#451A03" stroke="#0F172A" stroke-width="3.5"/>
      <circle cx="100" cy="60" r="10" fill="#FEF08A" stroke="#0F172A" stroke-width="3"/>
      <circle cx="100" cy="112" r="44" fill="url(#sbrass_armor)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="112" r="35" fill="#1E293B" stroke="#F59E0B" stroke-width="3" stroke-dasharray="8 4"/>
      <circle cx="100" cy="112" r="25" fill="url(#sbrass_core)"/>
      <g stroke="#0F172A" stroke-width="2.5">
        <line x1="100" y1="84" x2="100" y2="140"/>
        <line x1="72" y1="112" x2="128" y2="112"/>
        <line x1="80" y1="92" x2="120" y2="132"/>
        <line x1="120" y1="92" x2="80" y2="132"/>
      </g>
      <circle cx="100" cy="112" r="11" fill="url(#sbrass_armor)" stroke="#0F172A" stroke-width="2.5"/>
      <circle cx="100" cy="112" r="5" fill="#FEF08A"/>
      <polygon points="48,142 152,142 160,152 40,152" fill="#451A03" stroke="#0F172A" stroke-width="3.5"/>
      <polygon points="56,152 144,152 156,170 100,176 44,170" fill="url(#sbrass_armor)" stroke="#0F172A" stroke-width="3.5"/>
      <path d="M68 152 L60 171 M84 152 L80 173 M100 152 L100 176 M116 152 L120 173 M132 152 L140 171" stroke="#451A03" stroke-width="3.5"/>
    </svg>`,

    /**
     * 5. الكابتن فؤاد (Captain Fouad - Veteran Train Commander)
     * تصميم فني حديث غني بالتدرجات اللونية والظلال الناعمة والإضاءة المحيطية
     */
    fouad: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="fouad_bg" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stop-color="#2563EB"/>
          <stop offset="55%" stop-color="#1E3A8A"/>
          <stop offset="100%" stop-color="#090D16"/>
        </radialGradient>
        <linearGradient id="fouad_coat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2563EB"/>
          <stop offset="50%" stop-color="#1D4ED8"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <linearGradient id="fouad_skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F6C9A8"/>
          <stop offset="65%" stop-color="#E5A97E"/>
          <stop offset="100%" stop-color="#C6865A"/>
        </linearGradient>
        <linearGradient id="fouad_beard" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F8FAFC"/>
          <stop offset="60%" stop-color="#CBD5E1"/>
          <stop offset="100%" stop-color="#64748B"/>
        </linearGradient>
        <linearGradient id="fouad_gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="45%" stop-color="#FACC15"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
        <linearGradient id="fouad_visor" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.75"/>
          <stop offset="50%" stop-color="#E0F2FE" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#0284C7" stop-opacity="0.75"/>
        </linearGradient>
      </defs>

      <!-- Outer Frame & Ambient Glow -->
      <circle cx="100" cy="100" r="95" fill="url(#fouad_bg)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="100" r="90" fill="none" stroke="url(#fouad_gold)" stroke-width="3"/>
      <circle cx="100" cy="95" r="72" fill="#38BDF8" opacity="0.12"/>

      <!-- Commander Coat & Epaulettes -->
      <path d="M26 182 C34 136, 62 122, 100 122 C138 122, 166 136, 174 182 A92 92 0 0 1 26 182 Z" fill="url(#fouad_coat)" stroke="#0F172A" stroke-width="3.5"/>
      <path d="M78 124 L100 176 L122 124 Z" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
      <path d="M95 130 L105 130 L103 172 L100 178 L97 172 Z" fill="#DC2626"/>
      <path d="M54 146 L68 116 L86 128 L72 168 Z" fill="#1E3A8A" stroke="url(#fouad_gold)" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M146 146 L132 116 L114 128 L128 168 Z" fill="#1E3A8A" stroke="url(#fouad_gold)" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="36" y="132" width="32" height="10" rx="5" transform="rotate(-20 52 137)" fill="url(#fouad_gold)" stroke="#0F172A" stroke-width="2.2"/>
      <rect x="132" y="132" width="32" height="10" rx="5" transform="rotate(20 148 137)" fill="url(#fouad_gold)" stroke="#0F172A" stroke-width="2.2"/>

      <!-- Neck & Ears -->
      <rect x="85" y="108" width="30" height="24" rx="8" fill="#D4956A" stroke="#0F172A" stroke-width="2.8"/>
      <ellipse cx="62" cy="88" rx="7" ry="12" fill="url(#fouad_skin)" stroke="#0F172A" stroke-width="2.5"/>
      <ellipse cx="138" cy="88" rx="7" ry="12" fill="url(#fouad_skin)" stroke="#0F172A" stroke-width="2.5"/>

      <!-- Smooth Sculpted Head & Hair -->
      <path d="M64 62 C64 42, 136 42, 136 62 L134 102 C134 122, 118 136, 100 136 C82 136, 66 122, 66 102 Z" fill="url(#fouad_skin)" stroke="#0F172A" stroke-width="3.2"/>
      <path d="M62 66 C60 80, 62 94, 68 100 L68 72 Z" fill="url(#fouad_beard)" stroke="#0F172A" stroke-width="2"/>
      <path d="M138 66 C140 80, 138 94, 132 100 L132 72 Z" fill="url(#fouad_beard)" stroke="#0F172A" stroke-width="2"/>

      <!-- Full Silver-White Commander Beard & Mustache -->
      <path d="M66 96 C66 120, 80 138, 100 138 C120 138, 134 120, 134 96 C126 104, 118 108, 100 108 C82 108, 74 104, 66 96 Z" fill="url(#fouad_beard)" stroke="#0F172A" stroke-width="3" stroke-linejoin="round"/>
      <path d="M72 104 C82 96, 94 98, 100 102 C106 98, 118 96, 128 104 C122 112, 108 110, 100 106 C92 110, 78 112, 72 104 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M90 115 Q100 120 110 115" fill="none" stroke="#0F172A" stroke-width="2.6" stroke-linecap="round"/>

      <!-- Expressive Eyes, Brows & Tactical Gold Glasses -->
      <path d="M70 73 Q82 69 92 74" fill="none" stroke="#E2E8F0" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M130 73 Q118 69 108 74" fill="none" stroke="#E2E8F0" stroke-width="4.5" stroke-linecap="round"/>
      <rect x="68" y="77" width="26" height="16" rx="6" fill="url(#fouad_visor)" stroke="url(#fouad_gold)" stroke-width="2.8"/>
      <rect x="106" y="77" width="26" height="16" rx="6" fill="url(#fouad_visor)" stroke="url(#fouad_gold)" stroke-width="2.8"/>
      <line x1="94" y1="84" x2="106" y2="84" stroke="url(#fouad_gold)" stroke-width="3"/>
      <circle cx="81" cy="85" r="3.6" fill="#0F172A"/>
      <circle cx="82.2" cy="83.8" r="1.4" fill="#FFFFFF"/>
      <circle cx="119" cy="85" r="3.6" fill="#0F172A"/>
      <circle cx="120.2" cy="83.8" r="1.4" fill="#FFFFFF"/>
      <path d="M100 82 L97 96 C99 98, 102 98, 104 96" fill="none" stroke="#B87348" stroke-width="2.6" stroke-linecap="round"/>

      <!-- Commander Peaked Cap & Winged Train Emblem -->
      <path d="M46 56 C44 26, 70 16, 100 16 C130 16, 156 26, 154 56 Z" fill="url(#fouad_coat)" stroke="#0F172A" stroke-width="3.5"/>
      <rect x="50" y="48" width="100" height="10" rx="4" fill="url(#fouad_gold)" stroke="#0F172A" stroke-width="2.5"/>
      <path d="M48 56 Q100 46 152 56 Q140 68 100 64 Q60 68 48 56 Z" fill="#090D16" stroke="#0F172A" stroke-width="3"/>
      <path d="M74 35 L92 31 L100 24 L108 31 L126 35 L114 42 L100 39 L86 42 Z" fill="url(#fouad_gold)" stroke="#0F172A" stroke-width="2"/>
      <circle cx="100" cy="35" r="5" fill="#38BDF8" stroke="#0F172A" stroke-width="1.8"/>
    </svg>`,

    /**
     * 6. المهندسة أمل (Chief Engineer Amal - Lead Energy & Track Systems Engineer)
     * تصميم فني حديث وودود بملامح ناعمة ونظارة الواقع المعزز
     */
    amal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="amal_bg" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stop-color="#0EA5E9"/>
          <stop offset="55%" stop-color="#0369A1"/>
          <stop offset="100%" stop-color="#090D16"/>
        </radialGradient>
        <linearGradient id="amal_jacket" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F97316"/>
          <stop offset="55%" stop-color="#EA580C"/>
          <stop offset="100%" stop-color="#9A3412"/>
        </linearGradient>
        <linearGradient id="amal_skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FDE2CE"/>
          <stop offset="65%" stop-color="#F5C29E"/>
          <stop offset="100%" stop-color="#DBA079"/>
        </linearGradient>
        <linearGradient id="amal_hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#312E81"/>
          <stop offset="50%" stop-color="#1E1B4B"/>
          <stop offset="100%" stop-color="#090D16"/>
        </linearGradient>
        <linearGradient id="amal_holo" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.72"/>
          <stop offset="100%" stop-color="#22D3EE" stop-opacity="0.32"/>
        </linearGradient>
      </defs>

      <!-- Outer Ring & Glow -->
      <circle cx="100" cy="100" r="95" fill="url(#amal_bg)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="100" r="90" fill="none" stroke="#38BDF8" stroke-width="3"/>
      <circle cx="100" cy="95" r="72" fill="#38BDF8" opacity="0.15"/>

      <!-- Back Hair Volume -->
      <path d="M50 56 C38 84, 42 122, 56 138 L144 138 C158 122, 162 84, 150 56 Z" fill="url(#amal_hair)" stroke="#0F172A" stroke-width="3.2"/>

      <!-- Engineer Jacket & Glowing Core Badge -->
      <path d="M30 182 C38 138, 64 124, 100 124 C136 124, 162 138, 170 182 A92 92 0 0 1 30 182 Z" fill="url(#amal_jacket)" stroke="#0F172A" stroke-width="3.5"/>
      <path d="M74 124 L100 176 L126 124 Z" fill="#1E293B" stroke="#38BDF8" stroke-width="2.2"/>
      <circle cx="100" cy="152" r="9" fill="#38BDF8" stroke="#0F172A" stroke-width="2.2"/>
      <circle cx="100" cy="152" r="4" fill="#FFFFFF"/>

      <!-- Neck & Smooth Oval Face -->
      <rect x="88" y="108" width="24" height="22" rx="8" fill="#E5AE88" stroke="#0F172A" stroke-width="2.6"/>
      <path d="M68 58 C68 40, 132 40, 132 58 L130 96 C130 116, 116 128, 100 128 C84 128, 70 116, 70 96 Z" fill="url(#amal_skin)" stroke="#0F172A" stroke-width="3.2"/>

      <!-- Soft Blush -->
      <ellipse cx="78" cy="96" rx="7" ry="4" fill="#FB7185" opacity="0.35"/>
      <ellipse cx="122" cy="96" rx="7" ry="4" fill="#FB7185" opacity="0.35"/>

      <!-- Expressive Emerald Eyes & Lashes -->
      <path d="M72 74 Q82 69 91 74" fill="none" stroke="#1E1B4B" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M109 74 Q118 69 128 74" fill="none" stroke="#1E1B4B" stroke-width="3.2" stroke-linecap="round"/>
      <ellipse cx="82" cy="84" rx="7.5" ry="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.2"/>
      <circle cx="82" cy="84" r="4.5" fill="#10B981"/>
      <circle cx="82" cy="84" r="2.2" fill="#0F172A"/>
      <circle cx="83.8" cy="82.2" r="1.5" fill="#FFFFFF"/>

      <ellipse cx="118" cy="84" rx="7.5" ry="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.2"/>
      <circle cx="118" cy="84" r="4.5" fill="#10B981"/>
      <circle cx="118" cy="84" r="2.2" fill="#0F172A"/>
      <circle cx="119.8" cy="82.2" r="1.5" fill="#FFFFFF"/>

      <!-- AR Holo-Lens Visor -->
      <rect x="103" y="74" width="34" height="20" rx="6" fill="url(#amal_holo)" stroke="#38BDF8" stroke-width="2.2"/>
      <line x1="108" y1="80" x2="132" y2="80" stroke="#E0F2FE" stroke-width="1.2" stroke-dasharray="4 2"/>

      <!-- Nose & Warm Confident Smile -->
      <path d="M100 83 L98 94 C99 96, 102 96, 103 94" fill="none" stroke="#C6865A" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M89 105 Q100 114 111 105" fill="none" stroke="#991B1B" stroke-width="3" stroke-linecap="round"/>

      <!-- Stylish Swept Hair & Engineer Headset -->
      <path d="M62 72 C62 34, 90 24, 118 30 C138 34, 144 54, 138 74 C130 52, 112 44, 92 48 C76 52, 68 62, 62 72 Z" fill="url(#amal_hair)" stroke="#0F172A" stroke-width="3.2"/>
      <path d="M60 72 C58 30, 142 30, 140 72" fill="none" stroke="#FACC15" stroke-width="5" stroke-linecap="round"/>
      <rect x="52" y="70" width="13" height="24" rx="6" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5"/>
      <circle cx="58.5" cy="82" r="3.5" fill="#38BDF8"/>
    </svg>`,

    /**
     * 7. الحارس ربيع (Ranger Rabie - Sector 1)
     */
    rabie: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="rabie_bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#065F46"/>
          <stop offset="65%" stop-color="#022C22"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
        <linearGradient id="rabie_cloak" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#15803D"/>
          <stop offset="100%" stop-color="#052E16"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill="url(#rabie_bg)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="#10B981" stroke-width="2.5"/>
      <path d="M32 182 C38 138, 66 126, 100 126 C134 126, 162 138, 168 182 A92 92 0 0 1 32 182 Z" fill="url(#rabie_cloak)" stroke="#0F172A" stroke-width="4"/>
      <polygon points="36,148 68,132 74,146 42,162" fill="#334155" stroke="#0F172A" stroke-width="3"/>
      <polygon points="164,148 132,132 126,146 158,162" fill="#334155" stroke="#0F172A" stroke-width="3"/>
      <path d="M68 134 L126 184" stroke="#78350F" stroke-width="10"/>
      <circle cx="100" cy="158" r="9" fill="#10B981" stroke="#0F172A" stroke-width="3"/>
      <path d="M48 92 C44 36, 70 20, 100 20 C130 20, 156 36, 152 92 L136 124 L64 124 Z" fill="#064E3B" stroke="#0F172A" stroke-width="3.8"/>
      <path d="M68 58 C68 40, 132 40, 132 58 L130 100 C130 120, 116 132, 100 132 C84 132, 70 120, 70 100 Z" fill="#D9A07E" stroke="#0F172A" stroke-width="3.2"/>
      <path d="M68 96 C68 118, 82 134, 100 134 C118 134, 132 118, 132 96 C124 104, 114 108, 100 108 C86 108, 76 104, 68 96 Z" fill="#64748B" stroke="#0F172A" stroke-width="3"/>
      <path d="M76 108 Q100 102 124 108" fill="none" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>
      <path d="M72 76 L92 79 M128 76 L108 79" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
      <circle cx="82" cy="86" r="3.8" fill="#0F172A"/>
      <circle cx="83.2" cy="84.8" r="1.4" fill="#4ADE80"/>
      <circle cx="118" cy="86" r="12" fill="#10B981" fill-opacity="0.45" stroke="#34D399" stroke-width="3"/>
      <circle cx="118" cy="86" r="4" fill="#E0F2FE"/>
      <path d="M100 82 L98 96 C99 98, 102 98, 103 96" fill="none" stroke="#0F172A" stroke-width="2.6" stroke-linecap="round"/>
    </svg>`,

    /**
     * 8. المستر برهان (Master Burhan - Sector 2)
     */
    burhan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="burhan_bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#D97706"/>
          <stop offset="65%" stop-color="#451A03"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </radialGradient>
        <linearGradient id="burhan_coat" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#92400E"/>
          <stop offset="100%" stop-color="#271206"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill="url(#burhan_bg)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="#F59E0B" stroke-width="2.5"/>
      <circle cx="44" cy="54" r="16" fill="none" stroke="#F59E0B" stroke-width="4" stroke-dasharray="6 4" opacity="0.5"/>
      <circle cx="156" cy="54" r="16" fill="none" stroke="#F59E0B" stroke-width="4" stroke-dasharray="6 4" opacity="0.5"/>
      <path d="M32 182 C38 138, 66 126, 100 126 C134 126, 162 138, 168 182 A92 92 0 0 1 32 182 Z" fill="url(#burhan_coat)" stroke="#0F172A" stroke-width="4"/>
      <polygon points="58,142 68,112 86,128 76,162" fill="#451A03" stroke="#F59E0B" stroke-width="2.5"/>
      <polygon points="142,142 132,112 114,128 124,162" fill="#451A03" stroke="#F59E0B" stroke-width="2.5"/>
      <polygon points="84,128 100,176 116,128" fill="#1E293B" stroke="#F59E0B" stroke-width="2"/>
      <rect x="88" y="112" width="24" height="22" rx="8" fill="#D9A07E" stroke="#0F172A" stroke-width="3"/>
      <path d="M66 56 C66 38, 134 38, 134 56 L130 98 C130 118, 116 132, 100 132 C84 132, 70 118, 70 98 Z" fill="#E6B394" stroke="#0F172A" stroke-width="3.2"/>
      <path d="M62 66 C58 34, 76 24, 100 24 C124 24, 142 34, 138 66 C132 48, 118 42, 100 42 C82 42, 68 48, 62 66 Z" fill="#64748B" stroke="#0F172A" stroke-width="3.2"/>
      <line x1="64" y1="82" x2="136" y2="82" stroke="#0F172A" stroke-width="3.2"/>
      <circle cx="80" cy="84" r="15" fill="#F59E0B" stroke="#0F172A" stroke-width="3"/>
      <circle cx="80" cy="84" r="10" fill="#38BDF8" stroke="#0F172A" stroke-width="2"/>
      <circle cx="80" cy="84" r="4" fill="#E0F2FE"/>
      <circle cx="118" cy="84" r="3.8" fill="#0F172A"/>
      <circle cx="119.2" cy="82.8" r="1.4" fill="#FFFFFF"/>
      <path d="M108 75 L128 72" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M100 80 L97 96 C99 98, 102 98, 103 96" fill="none" stroke="#0F172A" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M76 108 Q100 100 124 108 Q112 114 100 110 Q88 114 76 108 Z" fill="#475569" stroke="#0F172A" stroke-width="2"/>
      <path d="M90 118 Q100 122 110 118" fill="none" stroke="#0F172A" stroke-width="2.8" stroke-linecap="round"/>
    </svg>`,

    /**
     * 9. الأدميرال سراج (Admiral Siraj - Sector 3)
     */
    siraj: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="siraj_bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#0284C7"/>
          <stop offset="55%" stop-color="#0F172A"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
        <linearGradient id="siraj_coat" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1E293B"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill="url(#siraj_bg)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="#38BDF8" stroke-width="2.5"/>
      <path d="M44 36 L56 54 L48 56 L62 78" fill="none" stroke="#38BDF8" stroke-width="2"/>
      <path d="M30 182 C36 138, 64 126, 100 126 C136 126, 164 138, 170 182 A92 92 0 0 1 30 182 Z" fill="url(#siraj_coat)" stroke="#0F172A" stroke-width="4"/>
      <polygon points="54,146 66,112 86,128 74,164" fill="#0F172A" stroke="#FACC15" stroke-width="2.5"/>
      <polygon points="146,146 134,112 114,128 126,164" fill="#0F172A" stroke="#FACC15" stroke-width="2.5"/>
      <polygon points="36,146 66,132 70,140 40,154" fill="#FACC15" stroke="#0F172A" stroke-width="2.5"/>
      <polygon points="164,146 134,132 130,140 160,154" fill="#FACC15" stroke="#0F172A" stroke-width="2.5"/>
      <path d="M64 60 C64 42, 136 42, 136 60 L132 102 C132 122, 118 136, 100 136 C82 136, 68 122, 68 102 Z" fill="#C68B59" stroke="#0F172A" stroke-width="3.2"/>
      <path d="M66 96 C66 120, 80 138, 100 138 C120 138, 134 120, 134 96 C126 104, 116 108, 100 108 C84 108, 74 104, 66 96 Z" fill="#E2E8F0" stroke="#0F172A" stroke-width="3"/>
      <path d="M74 108 Q100 100 126 108 Q116 115 100 110 Q84 115 74 108 Z" fill="#F8FAFC" stroke="#0F172A" stroke-width="2.4"/>
      <path d="M68 74 Q82 70 92 75" fill="none" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
      <path d="M132 74 Q118 70 108 75" fill="none" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
      <circle cx="81" cy="86" r="3.8" fill="#38BDF8" stroke="#0F172A" stroke-width="1.5"/>
      <circle cx="119" cy="86" r="3.8" fill="#38BDF8" stroke="#0F172A" stroke-width="1.5"/>
      <path d="M100 80 L97 96 C99 98, 102 98, 104 96" fill="none" stroke="#0F172A" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M50 62 Q100 50 150 62 Q140 72 100 68 Q60 72 50 62 Z" fill="#020617" stroke="#0F172A" stroke-width="3.2"/>
      <rect x="52" y="48" width="96" height="12" rx="4" fill="#0F172A" stroke="#FACC15" stroke-width="2.5"/>
      <path d="M44 48 C42 26, 70 18, 100 18 C130 18, 158 26, 156 48 Z" fill="#F8FAFC" stroke="#0F172A" stroke-width="3.5"/>
      <polygon points="100,28 108,38 100,48 92,38" fill="#FACC15" stroke="#0F172A" stroke-width="2"/>
    </svg>`,

    /**
     * 10. القائد طارق (Commander Tariq - Sector 4)
     */
    tariq: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="tariq_bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#D97706"/>
          <stop offset="60%" stop-color="#7C2D12"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </radialGradient>
        <linearGradient id="tariq_armor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F59E0B"/>
          <stop offset="50%" stop-color="#B45309"/>
          <stop offset="100%" stop-color="#451A03"/>
        </linearGradient>
        <linearGradient id="tariq_visor" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38BDF8"/>
          <stop offset="50%" stop-color="#E0F2FE"/>
          <stop offset="100%" stop-color="#38BDF8"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill="url(#tariq_bg)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="#FACC15" stroke-width="2.5"/>
      <polygon points="40,86 32,54 46,44 52,78" fill="#38BDF8" opacity="0.65" stroke="#0F172A" stroke-width="2"/>
      <polygon points="160,86 168,54 154,44 148,78" fill="#38BDF8" opacity="0.65" stroke="#0F172A" stroke-width="2"/>
      <path d="M30 182 C36 138, 64 126, 100 126 C136 126, 164 138, 170 182 A92 92 0 0 1 30 182 Z" fill="url(#tariq_armor)" stroke="#0F172A" stroke-width="4"/>
      <polygon points="34,146 70,130 76,148 40,164" fill="#1E293B" stroke="#FACC15" stroke-width="2.5"/>
      <polygon points="166,146 130,130 124,148 160,164" fill="#1E293B" stroke="#FACC15" stroke-width="2.5"/>
      <path d="M56 120 Q100 146 144 120 L136 154 Q100 172 64 154 Z" fill="#78350F" stroke="#0F172A" stroke-width="3.2"/>
      <polygon points="100,146 112,162 100,178 88,162" fill="#38BDF8" stroke="#0F172A" stroke-width="2.8"/>
      <path d="M66 56 C66 38, 134 38, 134 56 L130 100 C130 120, 116 132, 100 132 C84 132, 70 120, 70 100 Z" fill="#C68B59" stroke="#0F172A" stroke-width="3.2"/>
      <path d="M70 98 C70 118, 82 134, 100 134 C118 134, 130 118, 130 98 C122 106, 112 110, 100 110 C88 110, 78 106, 70 98 Z" fill="#1E293B" stroke="#0F172A" stroke-width="2.8"/>
      <path d="M80 110 Q100 104 120 110" fill="none" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>
      <rect x="66" y="76" width="68" height="16" rx="8" fill="url(#tariq_visor)" stroke="#0F172A" stroke-width="2.8"/>
      <path d="M70 72 L94 75 M130 72 L106 75" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M48 84 C44 34, 68 20, 100 20 C132 20, 156 34, 152 84 C144 58, 126 50, 100 50 C74 50, 56 58, 48 84 Z" fill="#92400E" stroke="#0F172A" stroke-width="3.5"/>
      <rect x="64" y="42" width="72" height="14" rx="5" fill="#1E293B" stroke="#FACC15" stroke-width="2.5"/>
    </svg>`,

    /**
     * 11. الدكتورة ليلى (Dr. Layla - Sector 5)
     */
    layla: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="layla_bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#9333EA"/>
          <stop offset="55%" stop-color="#3B0764"/>
          <stop offset="100%" stop-color="#090D16"/>
        </radialGradient>
        <linearGradient id="layla_suit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F8FAFC"/>
          <stop offset="60%" stop-color="#CBD5E1"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
        <linearGradient id="layla_visor" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#F43F5E"/>
          <stop offset="50%" stop-color="#D946EF"/>
          <stop offset="100%" stop-color="#8B5CF6"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill="url(#layla_bg)" stroke="#0F172A" stroke-width="4"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke="#D946EF" stroke-width="2.5"/>
      <path d="M52 54 C40 84, 42 124, 54 142 L146 142 C158 124, 160 84, 148 54 Z" fill="#0F172A" stroke="#020617" stroke-width="3.2"/>
      <path d="M32 182 C38 140, 66 128, 100 128 C134 128, 162 140, 168 182 A92 92 0 0 1 32 182 Z" fill="url(#layla_suit)" stroke="#0F172A" stroke-width="3.5"/>
      <polygon points="74,128 100,180 126,128" fill="#1E1B4B" stroke="#D946EF" stroke-width="2.5"/>
      <polygon points="56,138 72,114 84,128 70,158" fill="#1E293B" stroke="#D946EF" stroke-width="2"/>
      <polygon points="144,138 128,114 116,128 130,158" fill="#1E293B" stroke="#D946EF" stroke-width="2"/>
      <circle cx="100" cy="156" r="11" fill="#0F172A" stroke="#D946EF" stroke-width="2.5"/>
      <circle cx="100" cy="156" r="6" fill="#F43F5E"/>
      <circle cx="100" cy="156" r="3" fill="#FFFFFF"/>
      <rect x="88" y="110" width="24" height="20" rx="8" fill="#E6B394" stroke="#0F172A" stroke-width="2.8"/>
      <path d="M68 58 C68 40, 132 40, 132 58 L130 96 C130 116, 116 128, 100 128 C84 128, 70 116, 70 96 Z" fill="#F1C2A5" stroke="#0F172A" stroke-width="3.2"/>
      <rect x="68" y="76" width="64" height="16" rx="8" fill="url(#layla_visor)" stroke="#0F172A" stroke-width="2.6"/>
      <line x1="76" y1="84" x2="124" y2="84" stroke="#FFFFFF" stroke-width="1.5" opacity="0.85"/>
      <path d="M100 84 L98 96 C99 98, 102 98, 103 96" fill="none" stroke="#0F172A" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M90 107 Q100 114 110 107" fill="none" stroke="#991B1B" stroke-width="3" stroke-linecap="round"/>
      <path d="M60 68 C62 32, 90 24, 118 30 C138 34, 144 54, 138 72 C130 50, 112 44, 92 48 C76 52, 66 60, 60 68 Z" fill="#0F172A" stroke="#020617" stroke-width="3.2"/>
      <path d="M72 38 C86 32, 108 34, 124 46" fill="none" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
    </svg>`
  };

  PORTRAITS.uncle_fouad = PORTRAITS.fouad;
  PORTRAITS.captain_fouad = PORTRAITS.fouad;
  PORTRAITS.saffar_vip = PORTRAITS.saffar_gold;
  PORTRAITS.royal_gold = PORTRAITS.saffar_gold;
  PORTRAITS.vip = PORTRAITS.saffar_gold;
  PORTRAITS.spring = PORTRAITS.saffar_spring;
  PORTRAITS.steampunk = PORTRAITS.saffar_brass;
  PORTRAITS.brass = PORTRAITS.saffar_brass;
  PORTRAITS.uncle_rabie = PORTRAITS.rabie;
  PORTRAITS.ranger_rabie = PORTRAITS.rabie;
  PORTRAITS.master_burhan = PORTRAITS.burhan;
  PORTRAITS.captain_siraj = PORTRAITS.siraj;
  PORTRAITS.admiral_siraj = PORTRAITS.siraj;
  PORTRAITS.commander_tariq = PORTRAITS.tariq;
  PORTRAITS.dr_layla = PORTRAITS.layla;

  // ============================================================================
  // 2. المشاهد البانورامية للبيئات العشر (10 Biomes for 100 Levels - 800x320 ViewBox)
  // ============================================================================

  const STATIONS = {
    /**
     * البيئة 1 (`station1` - المراحل 1-10): وادي الضباب والجسور المعلقة (Mist Valley & Suspension Bridges)
     */
    station1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st1_sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#022C22"/>
          <stop offset="55%" stop-color="#065F46"/>
          <stop offset="100%" stop-color="#34D399"/>
        </linearGradient>
        <linearGradient id="st1_cliff" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1E293B"/>
          <stop offset="100%" stop-color="#090D16"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st1_sky)"/>
      <polygon points="180,0 320,0 460,320 260,320" fill="#A7F3D0" opacity="0.16"/>
      <polygon points="480,0 600,0 740,320 560,320" fill="#A7F3D0" opacity="0.12"/>
      <polygon points="0,240 140,75 290,220 430,90 590,230 730,65 800,150 800,320 0,320" fill="#064E3B" opacity="0.7"/>
      <polygon points="0,140 180,140 230,320 0,320" fill="url(#st1_cliff)" stroke="#0F172A" stroke-width="3"/>
      <polygon points="800,130 610,130 560,320 800,320" fill="url(#st1_cliff)" stroke="#0F172A" stroke-width="3"/>
      <rect x="380" y="150" width="36" height="170" fill="#38BDF8" opacity="0.45"/>
      <line x1="392" y1="150" x2="392" y2="320" stroke="#E0F2FE" stroke-width="3" stroke-dasharray="12 8"/>
      <g stroke="#0F172A" stroke-width="3.5" fill="#334155">
        <polygon points="205,260 220,48 240,48 255,260"/>
        <polygon points="545,260 560,48 580,48 595,260"/>
        <rect x="210" y="85" width="40" height="10" fill="#F59E0B"/>
        <rect x="550" y="85" width="40" height="10" fill="#F59E0B"/>
      </g>
      <path d="M0 165 Q115 155 230 55 Q400 215 570 55 Q685 155 800 165" fill="none" stroke="#94A3B8" stroke-width="4"/>
      <g stroke="#64748B" stroke-width="2">
        <line x1="280" y1="102" x2="280" y2="236"/>
        <line x1="330" y1="130" x2="330" y2="236"/>
        <line x1="380" y1="142" x2="380" y2="236"/>
        <line x1="420" y1="142" x2="420" y2="236"/>
        <line x1="470" y1="130" x2="470" y2="236"/>
        <line x1="520" y1="102" x2="520" y2="236"/>
      </g>
      <rect x="0" y="236" width="800" height="18" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
      <line x1="0" y1="238" x2="800" y2="238" stroke="#34D399" stroke-width="4"/>
      <line x1="0" y1="250" x2="800" y2="250" stroke="#FACC15" stroke-width="3"/>
      <path d="M0 280 Q200 250 400 280 T800 270 L800 320 L0 320 Z" fill="#A7F3D0" opacity="0.25"/>
    </svg>`,

    /**
     * البيئة 2 (`station2` - المراحل 11-20): قلعة التروس الصناعية العملاقة (Industrial Gear Fortress)
     */
    station2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st2_sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#090D16"/>
          <stop offset="55%" stop-color="#451A03"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
        <linearGradient id="st2_brass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="50%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#78350F"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st2_sky)"/>
      <g fill="#1E293B" stroke="#0F172A" stroke-width="3">
        <rect x="70" y="45" width="34" height="220"/>
        <rect x="120" y="75" width="28" height="190"/>
        <rect x="650" y="50" width="36" height="215"/>
        <rect x="700" y="80" width="28" height="185"/>
      </g>
      <g stroke="#0F172A" stroke-width="4">
        <circle cx="235" cy="160" r="68" fill="url(#st2_brass)"/>
        <circle cx="235" cy="160" r="34" fill="#1E293B"/>
        <path d="M235 82 L235 238 M157 160 L313 160 M180 105 L290 215 M290 105 L180 215" stroke="url(#st2_brass)" stroke-width="10"/>
        <circle cx="565" cy="160" r="68" fill="url(#st2_brass)"/>
        <circle cx="565" cy="160" r="34" fill="#1E293B"/>
        <path d="M565 82 L565 238 M487 160 L643 160 M510 105 L620 215 M620 105 L510 215" stroke="url(#st2_brass)" stroke-width="10"/>
      </g>
      <g transform="translate(400, 15)" stroke="#0F172A" stroke-width="4">
        <polygon points="-85,245 -65,55 65,55 85,245" fill="#1E293B"/>
        <polygon points="-75,55 0,0 75,55" fill="url(#st2_brass)"/>
        <circle cx="0" cy="125" r="46" fill="url(#st2_brass)"/>
        <circle cx="0" cy="125" r="36" fill="#0F172A"/>
        <circle cx="0" cy="125" r="24" fill="#F59E0B" opacity="0.85"/>
        <path d="M0 92 L0 125 L22 135" fill="none" stroke="#FEF08A" stroke-width="5" stroke-linecap="round"/>
      </g>
      <rect x="0" y="252" width="800" height="68" fill="#0F172A"/>
      <line x1="0" y1="254" x2="800" y2="254" stroke="#FACC15" stroke-width="5"/>
      <line x1="0" y1="264" x2="800" y2="264" stroke="#EA580C" stroke-width="3.5"/>
    </svg>`,

    /**
     * البيئة 3 (`station3` - المراحل 21-30): ميناء العواصف والمنارة المدرعة (Storm Harbor & Armored Lighthouse)
     */
    station3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st3_sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="50%" stop-color="#0F172A"/>
          <stop offset="100%" stop-color="#0369A1"/>
        </linearGradient>
        <linearGradient id="st3_beam" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.95"/>
          <stop offset="45%" stop-color="#38BDF8" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#38BDF8" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st3_sky)"/>
      <path d="M180 0 L155 68 L185 74 L135 165" fill="none" stroke="#E0F2FE" stroke-width="3"/>
      <path d="M420 0 L395 55 L418 62 L380 135" fill="none" stroke="#38BDF8" stroke-width="2.5"/>
      <polygon points="650,70 0,10 0,155" fill="url(#st3_beam)"/>
      <polygon points="540,320 580,185 740,185 800,320" fill="#0F172A" stroke="#1E293B" stroke-width="3"/>
      <g transform="translate(650, 30)" stroke="#0F172A" stroke-width="4">
        <polygon points="-34,170 -20,45 20,45 34,170" fill="#334155"/>
        <rect x="-26" y="85" width="52" height="24" fill="#FACC15"/>
        <rect x="-22" y="20" width="44" height="26" fill="#38BDF8"/>
        <polygon points="-28,20 0,-6 28,20" fill="#1E293B"/>
        <circle cx="0" cy="33" r="10" fill="#FFFFFF"/>
      </g>
      <path d="M0 230 Q90 205 180 230 T360 230 T540 230 T720 230 L800 230 L800 320 L0 320 Z" fill="#0C4A6E" stroke="#38BDF8" stroke-width="2.5"/>
      <rect x="0" y="255" width="800" height="16" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
      <line x1="0" y1="258" x2="800" y2="258" stroke="#38BDF8" stroke-width="4.5"/>
    </svg>`,

    /**
     * البيئة 4 (`station4` - المراحل 31-40): صحراء الكريستال ووادي الصواعق (Crystal Canyon & Lightning Desert)
     */
    station4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st4_sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1E1B4B"/>
          <stop offset="50%" stop-color="#9A3412"/>
          <stop offset="100%" stop-color="#F59E0B"/>
        </linearGradient>
        <linearGradient id="st4_crystal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E0F2FE"/>
          <stop offset="45%" stop-color="#38BDF8"/>
          <stop offset="100%" stop-color="#0284C7"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st4_sky)"/>
      <circle cx="400" cy="130" r="65" fill="#FEF08A" opacity="0.35"/>
      <polygon points="0,260 110,95 230,240 360,115 510,245 660,85 800,235 800,320 0,320" fill="#451A03" stroke="#0F172A" stroke-width="3.5"/>
      <g stroke="#0F172A" stroke-width="3.5" fill="url(#st4_crystal)">
        <polygon points="150,255 125,115 160,75 185,255"/>
        <polygon points="185,255 190,145 215,120 215,255"/>
        <polygon points="580,255 560,105 595,65 620,255"/>
        <polygon points="620,255 630,135 655,110 650,255"/>
        <polygon points="375,255 385,140 405,105 425,255"/>
      </g>
      <path d="M160 85 L275 125 L405 110 L500 130 L595 75" fill="none" stroke="#E0F2FE" stroke-width="3" stroke-dasharray="10 6"/>
      <rect x="0" y="250" width="800" height="70" fill="#1E293B" stroke="#0F172A" stroke-width="4"/>
      <line x1="0" y1="254" x2="800" y2="254" stroke="#38BDF8" stroke-width="5"/>
      <line x1="0" y1="264" x2="800" y2="264" stroke="#FACC15" stroke-width="4"/>
    </svg>`,

    /**
     * البيئة 5 (`station5` - المراحل 41-50): مفاعل البركان النجمي (Astral Volcano Core Reactor)
     */
    station5: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st5_sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#090D16"/>
          <stop offset="45%" stop-color="#3B0764"/>
          <stop offset="100%" stop-color="#991B1B"/>
        </linearGradient>
        <linearGradient id="st5_lava" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="45%" stop-color="#F97316"/>
          <stop offset="100%" stop-color="#991B1B"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st5_sky)"/>
      <ellipse cx="400" cy="58" rx="190" ry="34" fill="none" stroke="#D946EF" stroke-width="4" stroke-dasharray="16 10" opacity="0.75"/>
      <ellipse cx="400" cy="58" rx="120" ry="20" fill="none" stroke="#FEF08A" stroke-width="3" opacity="0.85"/>
      <polygon points="120,320 310,78 490,78 680,320" fill="#0F172A" stroke="#1E293B" stroke-width="4"/>
      <path d="M350 78 C365 150, 330 220, 310 320 L490 320 C470 220, 435 150, 450 78 Z" fill="url(#st5_lava)"/>
      <rect x="230" y="135" width="340" height="26" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="3.5"/>
      <circle cx="400" cy="148" r="24" fill="#0F172A" stroke="#FACC15" stroke-width="4"/>
      <circle cx="400" cy="148" r="12" fill="#38BDF8"/>
      <circle cx="400" cy="148" r="5" fill="#FFFFFF"/>
      <rect x="0" y="254" width="800" height="66" fill="#090D16" stroke="#F97316" stroke-width="3"/>
      <line x1="0" y1="258" x2="800" y2="258" stroke="#FACC15" stroke-width="5"/>
      <line x1="0" y1="268" x2="800" y2="268" stroke="#D946EF" stroke-width="4"/>
    </svg>`,

    /**
     * البيئة 6 (`station6` - المراحل 51-60): قمم الجليد القطبي والأنفاق الجليدية (Arctic Tundra & Glacial Ice Tunnels)
     */
    station6: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st6_sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="45%" stop-color="#0F172A"/>
          <stop offset="100%" stop-color="#0284C7"/>
        </linearGradient>
        <linearGradient id="st6_aurora" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.1"/>
          <stop offset="35%" stop-color="#34D399" stop-opacity="0.65"/>
          <stop offset="70%" stop-color="#38BDF8" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="#A855F7" stop-opacity="0.15"/>
        </linearGradient>
        <linearGradient id="st6_ice" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F8FAFC"/>
          <stop offset="55%" stop-color="#BAE6FD"/>
          <stop offset="100%" stop-color="#0369A1"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st6_sky)"/>
      <!-- شفق قطبي ساحر (Aurora Borealis) -->
      <path d="M0 75 Q200 20 400 65 T800 45 L800 115 Q600 85 400 115 T0 115 Z" fill="url(#st6_aurora)"/>
      <!-- جبال جليدية شاهقة ثلاثية الأبعاد -->
      <polygon points="0,260 110,65 240,245 380,45 530,240 675,60 800,235 800,320 0,320" fill="url(#st6_ice)" stroke="#0F172A" stroke-width="3.5"/>
      <!-- قبة محطة الأبحاث القطبية والأنفاق الجليدية -->
      <g transform="translate(400, 175)" stroke="#0F172A" stroke-width="3.5">
        <path d="M-95 75 C-95 10, 95 10, 95 75 Z" fill="#1E293B"/>
        <path d="M-70 75 C-70 30, 70 30, 70 75 Z" fill="#38BDF8" opacity="0.75"/>
        <rect x="-110" y="70" width="220" height="16" fill="#475569"/>
      </g>
      <!-- جسر قطبي حراري مدفأ بشرارات برتقالية -->
      <rect x="0" y="250" width="800" height="70" fill="#0F172A" stroke="#38BDF8" stroke-width="3"/>
      <line x1="0" y1="255" x2="800" y2="255" stroke="#F97316" stroke-width="5"/>
      <line x1="0" y1="265" x2="800" y2="265" stroke="#E0F2FE" stroke-width="4"/>
    </svg>`,

    /**
     * البيئة 7 (`station7` - المراحل 61-70): أدغال الأمازون الكثيفة والمعابد المفقودة (Emerald Jungle & Ancient Ruins Viaduct)
     */
    station7: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st7_sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#052E16"/>
          <stop offset="50%" stop-color="#15803D"/>
          <stop offset="100%" stop-color="#FEF08A"/>
        </linearGradient>
        <linearGradient id="st7_temple" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#A8A29E"/>
          <stop offset="100%" stop-color="#44403C"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st7_sky)"/>
      <!-- هرم المعبد الحجري المدرج وسط الأدغال -->
      <g transform="translate(400, 55)" stroke="#0F172A" stroke-width="3.5" fill="url(#st7_temple)">
        <rect x="-150" y="150" width="300" height="50"/>
        <rect x="-115" y="105" width="230" height="45"/>
        <rect x="-80" y="60" width="160" height="45"/>
        <rect x="-45" y="20" width="90" height="40"/>
        <polygon points="-25,195 -15,60 15,60 25,195" fill="#78716C"/>
        <circle cx="0" cy="40" r="10" fill="#10B981"/>
      </g>
      <!-- أشجار الأدغال العملاقة والشلالات المتدفقة -->
      <polygon points="0,320 0,85 140,190 210,320" fill="#064E3B" stroke="#0F172A" stroke-width="3"/>
      <polygon points="800,320 800,85 660,190 590,320" fill="#064E3B" stroke="#0F172A" stroke-width="3"/>
      <!-- جسر القناطر الحجرية المفقودة والسكة الذهبية -->
      <rect x="0" y="250" width="800" height="70" fill="#292524" stroke="#0F172A" stroke-width="3.5"/>
      <line x1="0" y1="254" x2="800" y2="254" stroke="#FACC15" stroke-width="5"/>
      <line x1="0" y1="264" x2="800" y2="264" stroke="#10B981" stroke-width="4"/>
    </svg>`,

    /**
     * البيئة 8 (`station8` - المراحل 71-80): مدينة النيون السيبرانية الفائقة (Cyber-Neon Megacity Express Terminal)
     */
    station8: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st8_sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="55%" stop-color="#1E1B4B"/>
          <stop offset="100%" stop-color="#701A75"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st8_sky)"/>
      <!-- ناطحات سحاب سيبرانية عملاقة مضاءة بالنيون -->
      <g fill="#0F172A" stroke="#38BDF8" stroke-width="2">
        <rect x="45" y="40" width="75" height="220"/>
        <rect x="140" y="75" width="65" height="185" stroke="#D946EF"/>
        <rect x="230" y="25" width="90" height="235"/>
        <rect x="480" y="30" width="85" height="230" stroke="#D946EF"/>
        <rect x="590" y="65" width="70" height="195"/>
        <rect x="680" y="45" width="75" height="215" stroke="#F43F5E"/>
      </g>
      <!-- محطة القطار المغناطيسي الزجاجية في وسط المدينة -->
      <g transform="translate(400, 120)">
        <polygon points="-130,135 -85,15 85,15 130,135" fill="#1E293B" fill-opacity="0.85" stroke="#38BDF8" stroke-width="3.5"/>
        <line x1="-95" y1="55" x2="95" y2="55" stroke="#D946EF" stroke-width="3"/>
        <line x1="-110" y1="95" x2="110" y2="95" stroke="#38BDF8" stroke-width="3"/>
      </g>
      <!-- جسر الماغليف الفائق السرعة -->
      <rect x="0" y="250" width="800" height="70" fill="#090D16" stroke="#38BDF8" stroke-width="3"/>
      <line x1="0" y1="255" x2="800" y2="255" stroke="#38BDF8" stroke-width="5"/>
      <line x1="0" y1="265" x2="800" y2="265" stroke="#D946EF" stroke-width="4"/>
    </svg>`,

    /**
     * البيئة 9 (`station9` - المراحل 81-90): مضيق الغروب الذهبي وسد الطاقة الكهرومائية (Golden Canyon & Hydroelectric Mega-Dam)
     */
    station9: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st9_sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#451A03"/>
          <stop offset="45%" stop-color="#EA580C"/>
          <stop offset="100%" stop-color="#FEF08A"/>
        </linearGradient>
        <linearGradient id="st9_dam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#475569"/>
          <stop offset="50%" stop-color="#94A3B8"/>
          <stop offset="100%" stop-color="#334155"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st9_sky)"/>
      <circle cx="400" cy="85" r="55" fill="#FEF9C3" opacity="0.8"/>
      <!-- جدار السد الكهرومائي العملاق وبوابات تدفق المياه -->
      <polygon points="150,120 650,120 720,320 80,320" fill="url(#st9_dam)" stroke="#0F172A" stroke-width="4"/>
      <g fill="#38BDF8" opacity="0.8">
        <polygon points="270,150 310,150 330,320 250,320"/>
        <polygon points="380,150 420,150 440,320 360,320"/>
        <polygon points="490,150 530,150 550,320 470,320"/>
      </g>
      <!-- صخور مضيق الغروب الجانبية -->
      <polygon points="0,95 170,120 110,320 0,320" fill="#7C2D12" stroke="#0F172A" stroke-width="3.5"/>
      <polygon points="800,95 630,120 690,320 800,320" fill="#7C2D12" stroke="#0F172A" stroke-width="3.5"/>
      <!-- مسار القطار فوق قمة السد -->
      <rect x="0" y="250" width="800" height="70" fill="#1E293B" stroke="#0F172A" stroke-width="3.5"/>
      <line x1="0" y1="255" x2="800" y2="255" stroke="#FACC15" stroke-width="5"/>
      <line x1="0" y1="265" x2="800" y2="265" stroke="#38BDF8" stroke-width="4"/>
    </svg>`,

    /**
     * البيئة 10 (`station10` - المراحل 91-100): المحطة المدارية الفضائية وجسر النجوم (Orbital Space Elevator & Starlight Nexus)
     */
    station10: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="st10_space" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000000"/>
          <stop offset="55%" stop-color="#090D16"/>
          <stop offset="85%" stop-color="#0284C7"/>
          <stop offset="100%" stop-color="#BAE6FD"/>
        </linearGradient>
      </defs>
      <rect width="800" height="320" fill="url(#st10_space)"/>
      <!-- نجوم الفضاء العميق -->
      <g fill="#FFFFFF">
        <circle cx="90" cy="40" r="2"/>
        <circle cx="210" cy="25" r="2.5"/>
        <circle cx="340" cy="55" r="1.8"/>
        <circle cx="490" cy="30" r="2.5"/>
        <circle cx="640" cy="45" r="2"/>
        <circle cx="730" cy="25" r="2.2"/>
      </g>
      <!-- انحناء كوكب الأرض المتوهج في الأفق السفلي -->
      <path d="M-100 320 Q400 165 900 320 Z" fill="#0369A1" stroke="#7DD3FC" stroke-width="5"/>
      <!-- حلقة المحطة المدارية الفضائية وألواح الطاقة الشمسية -->
      <ellipse cx="400" cy="135" rx="240" ry="48" fill="none" stroke="#94A3B8" stroke-width="8"/>
      <ellipse cx="400" cy="135" rx="240" ry="48" fill="none" stroke="#38BDF8" stroke-width="2.5" stroke-dasharray="14 8"/>
      <g transform="translate(400, 135)" stroke="#0F172A" stroke-width="3.5">
        <polygon points="-55,95 -35,-65 35,-65 55,95" fill="#E2E8F0"/>
        <circle cx="0" cy="0" r="28" fill="#0F172A" stroke="#FACC15" stroke-width="4"/>
        <circle cx="0" cy="0" r="14" fill="#38BDF8"/>
        <circle cx="0" cy="0" r="6" fill="#FFFFFF"/>
      </g>
      <!-- جسر النجوم المداري للمرحلة 100 -->
      <rect x="0" y="252" width="800" height="68" fill="#090D16" stroke="#38BDF8" stroke-width="3.5"/>
      <line x1="0" y1="256" x2="800" y2="256" stroke="#FACC15" stroke-width="5"/>
      <line x1="0" y1="266" x2="800" y2="266" stroke="#38BDF8" stroke-width="4"/>
    </svg>`
  };

  // مفاتيح بديلة لجميع البيئات العشر (1..10, sector1..sector10, biome1..biome10)
  for (let i = 1; i <= 10; i++) {
    STATIONS[i] = STATIONS['station' + i];
    STATIONS['sector' + i] = STATIONS['station' + i];
    STATIONS['biome' + i] = STATIONS['station' + i];
  }

  // ============================================================================
  // 3. تصدير الكائن العام window.GameArt
  // ============================================================================

  const GameArt = {
    version: '3.0.0-3D-PBR',
    portraits: PORTRAITS,
    stations: STATIONS,
    palette: PALETTE,

    getPortrait: function (key) {
      if (!key) return PORTRAITS.saffar;
      const normalized = String(key).trim().toLowerCase();
      return PORTRAITS[normalized] || PORTRAITS[key] || PORTRAITS.saffar;
    },

    getStation: function (stationKey) {
      if (!stationKey) return STATIONS.station1;
      const normalized = String(stationKey).trim().toLowerCase();
      return (
        STATIONS[normalized] ||
        STATIONS['station' + normalized] ||
        STATIONS['sector' + normalized] ||
        STATIONS['biome' + normalized] ||
        STATIONS[stationKey] ||
        STATIONS.station1
      );
    }
  };

  global.GameArt = GameArt;
})(typeof window !== 'undefined' ? window : this);
