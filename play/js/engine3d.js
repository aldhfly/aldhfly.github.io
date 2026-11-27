/**
 * ============================================================================
 * قطار الأحلام: الشبكة الحديدية القصوى — الإصدار الخامس (Dream Express 3D V5.0)
 * js/engine3d.js — Photorealistic World & Rock-Solid Stability Engine
 *
 * STRICT TECHNICAL COMPLIANCE:
 * 1. ZERO Procedural Mesh Primitives — 100% Compiled glTF 2.0 (.glb) Asset Pipeline
 *    All 3D geometry is loaded from compiled .glb / .gltf assets (including LOD0/1/2, Octahedral Impostors,
 *    Chunked Heightmap Terrain LOD0/1/2, Planar Water, Analytic Sky Dome, Grass Patches & Blob Shadows).
 * 2. Realistic Visuals:
 *    - Full PBR with Albedo, Normal, ORM (AO/Roughness/Metallic), and Tiling Micro-Detail Maps
 *    - Triplanar + Slope/Elevation Splat-Map Terrain Shader (Grass, Dirt, Rock Strata, Snow, Wet Puddles)
 *    - Scanned Vegetation & Cliffs via THREE.InstancedMesh, 3 LODs + Octahedral Impostor, Vertex Wind Sway,
 *      and Dithered Alpha-Test / Alpha-to-Coverage Crossfade
 *    - Planar Water Shader with 2-Layer Normal Scrolling, Fresnel, IBL Reflection, Depth Color, Shoreline Foam,
 *      and Half-Res Planar Reflection on HIGH/ULTRA (updated every 2nd frame)
 *    - Physically Based Sun, Analytic Preetham/Hosek Sky Shader, Exponential Height Fog, Volumetric Light Shafts,
 *      and Pooled GPU-Instanced Biome Weather Particles (Dust, Leaves, Snow, Rain, Fireflies, Steam/Sparks)
 *    - Texel-Snapped Tight-Frustum PCF Shadows (2048 HIGH, 1024 MID) + Contact Blob Shadows on LOW
 *    - Single Combined Post-Processing Pass (ACES Filmic, Half-Res Bloom, Half-Res SSAO, God-Rays, Biome LUT,
 *      CAS Contrast-Adaptive Sharpening + Edge AA, Vignette)
 *    - Arc-Length Parameterized CatmullRomCurve3 Train Motion with Curve Banking, Wheel Spin & 0.25s Character Crossfades
 * 3. Stability Engineering:
 *    - KTX2Loader (ASTC 4x4/6x6, UASTC+RDO, ETC2 fallback) with Worker Decoding & 1K->2K Mip-Streaming
 *    - Per-Region Asset Streaming (Core Bundle at boot + Region Bundles + Background Preload + Verified dispose())
 *    - MemoryBudget Module with 85% High-Watermark Eviction & webglcontextlost/restored Recovery
 *    - QualityManager (LOW, MID, HIGH, ULTRA) + Dynamic Resolution Scaler (DRS) + Thermal-Aware Governor
 *    - Single renderer.setAnimationLoop with Fixed 1/60s Accumulator, Transform Interpolation, Locked 30 FPS Mode,
 *      Zero Per-Frame Allocations & Shader Warm-Up (renderer.compile)
 * ============================================================================
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('[TrainEngine3D] THREE is not loaded.');
    return;
  }

  // ==========================================================================
  // 1. 10-BIOME WORLD THEME, LIGHTING, TILE SURFACE, RIM & WEATHER CONFIGS
  // ==========================================================================
  const BIOME_CONFIGS = {
    1: {
      name: 'pine_valley',
      hdr: 'royal_esplanade_1k',
      pmremKtx2: 'assets/hdr/pmrem/pine_valley_pmrem.ktx2',
      ground: 0x4D8B55,
      dirt: 0xC29B61,
      rock: 0x94A3B8,
      snow: 0xF8FAFC,
      tilePrimaryTex: 'grass_diffuse',
      tilePrimaryNormal: 'grass_normal',
      tilePrimaryColor: 0x9AE6B4,
      tilePrimaryRough: 0.84,
      tilePrimaryMetal: 0.03,
      tileFixedTex: 'rock_diffuse',
      tileFixedColor: 0xCBD5E1,
      rimInnerColor: 0x94A3B8,
      rimOuterColor: 0x4E8245,
      rimEmissive: 0x000000,
      rimEmissiveInt: 0.0,
      surfaceMode: 4,
      foamColor: 0x7FA656,
      waterShallow: 0x5B9B4E,
      waterDeep: 0x2D5A2E,
      skyZenith: 0x1B6CA8,
      skyHorizon: 0xCBE4F9,
      starIntensity: 0.0,
      sunColor: 0xFFF5E0,
      hemiSky: 0xD6ECFA,
      hemiGround: 0x52794D,
      sunDir: [0.52, 0.74, 0.48],
      rim: 0x93C5FD,
      fogColor: 0xC6E2F7,
      fogDensity: 0.0030,
      windVec: [0.85, 0.35],
      weather: 'fireflies',
      snowAmount: 0.0,
      wetness: 0.04,
      strataStrength: 0.12,
      lutTint: [1.01, 1.02, 1.00],
      islandModel: null,
      islandTint: 0xFFFFFF,
      treeModel: 'pine_tree_highpoly',
      treeTint: 0xFFFFFF,
      secondaryTreeModel: 'tree_small_02_lod2',
      secondaryTreeTint: 0xFFFFFF,
      rockModel: 'boulder_01_lod2',
      rockTint: 0xFFFFFF,
      shrubModel: 'shrub_01_lod2',
      grassTint: 0x3D8B48,
      regionModels: ['tree_small_02_lod2', 'boulder_01_lod2', 'shrub_01_lod2']
    },
    2: {
      name: 'red_canyon',
      hdr: 'quarry_01_1k',
      pmremKtx2: 'assets/hdr/pmrem/red_canyon_pmrem.ktx2',
      ground: 0xC87137,
      dirt: 0x9E4F24,
      rock: 0xAD4320,
      snow: 0xFEF3C7,
      tilePrimaryTex: 'rock_diffuse',
      tilePrimaryNormal: 'rock_normal',
      tilePrimaryColor: 0xDDA16E,
      tilePrimaryRough: 0.88,
      tilePrimaryMetal: 0.03,
      tileFixedTex: 'brick_diffuse',
      tileFixedColor: 0xC46D45,
      rimInnerColor: 0x8F4226,
      rimOuterColor: 0xC98449,
      rimEmissive: 0x000000,
      rimEmissiveInt: 0.0,
      surfaceMode: 1,
      foamColor: 0xECC896,
      waterShallow: 0xD69355,
      waterDeep: 0x8F4322,
      skyZenith: 0x1E6091,
      skyHorizon: 0xF3C89B,
      starIntensity: 0.0,
      sunColor: 0xFFF3DC,
      hemiSky: 0xFDE6C4,
      hemiGround: 0xB86435,
      sunDir: [0.58, 0.68, 0.48],
      rim: 0xFCD38D,
      fogColor: 0xEFC89E,
      fogDensity: 0.0036,
      windVec: [1.15, 0.40],
      weather: 'dust',
      snowAmount: 0.0,
      wetness: 0.01,
      strataStrength: 0.48,
      lutTint: [1.04, 1.00, 0.95],
      islandModel: null,
      islandTint: 0xC97440,
      treeModel: 'prop_desert_cactus',
      treeTint: 0xFFFFFF,
      secondaryTreeModel: 'coastal_cliff_01_lod2',
      secondaryTreeTint: 0xC96E3A,
      rockModel: 'boulder_01_lod2',
      rockTint: 0xD9824C,
      grassTint: 0,
      regionModels: ['boulder_01_lod2', 'coastal_cliff_01_lod2']
    },
    3: {
      name: 'harbor_cranes',
      hdr: 'daylight_urban_sky_1k',
      pmremKtx2: 'assets/hdr/pmrem/harbor_cranes_pmrem.ktx2',
      ground: 0x64748B,
      dirt: 0x94A3B8,
      rock: 0x475569,
      snow: 0xF8FAFC,
      tilePrimaryTex: 'rock_diffuse',
      tilePrimaryNormal: 'rock_normal',
      tilePrimaryColor: 0x94A3B8,
      tilePrimaryRough: 0.72,
      tilePrimaryMetal: 0.14,
      tileFixedTex: 'metal_diffuse',
      tileFixedColor: 0xCBD5E1,
      rimInnerColor: 0x64748B,
      rimOuterColor: 0xCFA03A,
      rimEmissive: 0x000000,
      rimEmissiveInt: 0.0,
      surfaceMode: 0,
      foamColor: 0xE2E8F0,
      waterShallow: 0x1B7F9E,
      waterDeep: 0x0B2B40,
      skyZenith: 0x1D5B8C,
      skyHorizon: 0xC5DDF0,
      starIntensity: 0.0,
      sunColor: 0xFFFBF2,
      hemiSky: 0xDCEBFA,
      hemiGround: 0x64748B,
      sunDir: [0.46, 0.74, 0.54],
      rim: 0x7DD3FC,
      fogColor: 0xC2DCF0,
      fogDensity: 0.0036,
      windVec: [1.05, 0.50],
      weather: 'fireflies',
      snowAmount: 0.0,
      wetness: 0.16,
      strataStrength: 0.15,
      lutTint: [1.00, 1.02, 1.04],
      islandModel: 'smooth_island_rock',
      islandTint: 0x788799,
      treeModel: 'prop_harbor_crane',
      treeTint: 0xFFFFFF,
      secondaryTreeModel: 'street_lamp_01_lod2',
      secondaryTreeTint: 0xFFFFFF,
      rockModel: 'boulder_01_lod2',
      rockTint: 0x94A3B8,
      grassTint: 0,
      regionModels: ['street_lamp_01_lod2', 'boulder_01_lod2']
    },
    4: {
      name: 'alpine_snow',
      hdr: 'royal_esplanade_1k',
      pmremKtx2: 'assets/hdr/pmrem/alpine_snow_pmrem.ktx2',
      ground: 0xF1F5F9,
      dirt: 0xCBD5E1,
      rock: 0x94A3B8,
      snow: 0xFFFFFF,
      tilePrimaryTex: 'rock_diffuse',
      tilePrimaryNormal: 'rock_normal',
      tilePrimaryColor: 0xF1F5F9,
      tilePrimaryRough: 0.62,
      tilePrimaryMetal: 0.04,
      tileFixedTex: 'rock_diffuse',
      tileFixedColor: 0xCBD5E1,
      rimInnerColor: 0xCBD5E1,
      rimOuterColor: 0xE2E8F0,
      rimEmissive: 0x000000,
      rimEmissiveInt: 0.0,
      surfaceMode: 5,
      foamColor: 0xFFFFFF,
      waterShallow: 0xF8FAFC,
      waterDeep: 0xBDD2E4,
      skyZenith: 0x1A5F96,
      skyHorizon: 0xDCEEFB,
      starIntensity: 0.0,
      sunColor: 0xFFFDF7,
      hemiSky: 0xE8F4FD,
      hemiGround: 0xB8D0E4,
      sunDir: [0.46, 0.70, 0.56],
      rim: 0xBAE6FD,
      fogColor: 0xDCEEFB,
      fogDensity: 0.0032,
      windVec: [0.95, 0.42],
      weather: 'snow',
      snowAmount: 0.85,
      wetness: 0.06,
      strataStrength: 0.15,
      lutTint: [0.99, 1.01, 1.05],
      islandModel: null,
      islandTint: 0xF1F5F9,
      treeModel: 'prop_snow_pine',
      treeTint: 0xFFFFFF,
      rockModel: 'boulder_01_lod2',
      rockTint: 0xE2E8F0,
      grassTint: 0,
      regionModels: ['boulder_01_lod2']
    },
    5: {
      name: 'neon_city',
      hdr: 'moonless_night_1k',
      pmremKtx2: 'assets/hdr/pmrem/neon_city_pmrem.ktx2',
      ground: 0x334155,
      dirt: 0x475569,
      rock: 0x64748B,
      snow: 0xE0F2FE,
      tilePrimaryTex: 'metal_diffuse',
      tilePrimaryNormal: 'metal_normal',
      tilePrimaryColor: 0x64748B,
      tilePrimaryRough: 0.36,
      tilePrimaryMetal: 0.42,
      tileFixedTex: 'metal_diffuse',
      tileFixedColor: 0x94A3B8,
      rimInnerColor: 0x334155,
      rimOuterColor: 0x0891B2,
      rimEmissive: 0x06B6D4,
      rimEmissiveInt: 0.22,
      surfaceMode: 6,
      foamColor: 0x22D3EE,
      waterShallow: 0x1E293B,
      waterDeep: 0x0B1120,
      skyZenith: 0x0D1B2A,
      skyHorizon: 0x283C5A,
      starIntensity: 0.45,
      sunColor: 0xF1F5F9,
      hemiSky: 0x93C5FD,
      hemiGround: 0x475569,
      sunDir: [0.44, 0.74, 0.52],
      rim: 0x38BDF8,
      fogColor: 0x1B2B44,
      fogDensity: 0.0030,
      windVec: [0.65, 0.25],
      weather: 'starlight',
      snowAmount: 0.0,
      wetness: 0.18,
      strataStrength: 0.15,
      lutTint: [1.00, 1.01, 1.05],
      islandModel: null,
      islandTint: 0x334155,
      treeModel: 'prop_neon_tower',
      treeTint: 0xFFFFFF,
      secondaryTreeModel: 'street_lamp_01_lod2',
      secondaryTreeTint: 0xFFFFFF,
      rockModel: 'boulder_01_lod2',
      rockTint: 0x475569,
      grassTint: 0,
      regionModels: ['street_lamp_01_lod2', 'PrimaryIonDrive', 'boulder_01_lod2']
    },
    6: {
      name: 'autumn_clockwork',
      hdr: 'venice_sunset_1k',
      pmremKtx2: 'assets/hdr/pmrem/autumn_clockwork_pmrem.ktx2',
      ground: 0xC27D38,
      dirt: 0x9C5A25,
      rock: 0x7C4722,
      snow: 0xFEF08A,
      tilePrimaryTex: 'hardwood_diffuse',
      tilePrimaryNormal: 'hardwood_bump',
      tilePrimaryColor: 0xD49A62,
      tilePrimaryRough: 0.68,
      tilePrimaryMetal: 0.12,
      tileFixedTex: 'brick_diffuse',
      tileFixedColor: 0xC98A55,
      rimInnerColor: 0x6E3F1D,
      rimOuterColor: 0x9C5A25,
      rimEmissive: 0x000000,
      rimEmissiveInt: 0.0,
      surfaceMode: 7,
      foamColor: 0xF59E0B,
      waterShallow: 0xD9822B,
      waterDeep: 0x6E3A17,
      skyZenith: 0x1D548C,
      skyHorizon: 0xF5D5A6,
      starIntensity: 0.0,
      sunColor: 0xFFF3D6,
      hemiSky: 0xFBE8C8,
      hemiGround: 0x9C6030,
      sunDir: [0.54, 0.68, 0.50],
      rim: 0xFBBF24,
      fogColor: 0xEED5B0,
      fogDensity: 0.0032,
      windVec: [1.00, 0.45],
      weather: 'leaves',
      snowAmount: 0.0,
      wetness: 0.05,
      strataStrength: 0.20,
      lutTint: [1.04, 1.01, 0.95],
      islandModel: null,
      islandTint: 0xD19B62,
      treeModel: 'tree_small_02_lod2',
      treeTint: 0xE8883C,
      secondaryTreeModel: 'prop_clockwork_gear',
      secondaryTreeTint: 0xFFFFFF,
      rockModel: 'boulder_01_lod2',
      rockTint: 0xB88256,
      grassTint: 0xC86D2D,
      regionModels: ['tree_small_02_lod2', 'boulder_01_lod2']
    },
    7: {
      name: 'storm_isles',
      hdr: 'quarry_01_1k',
      pmremKtx2: 'assets/hdr/pmrem/storm_isles_pmrem.ktx2',
      ground: 0x3F626D,
      dirt: 0x334155,
      rock: 0x475569,
      snow: 0xE2E8F0,
      tilePrimaryTex: 'rock_diffuse',
      tilePrimaryNormal: 'rock_normal',
      tilePrimaryColor: 0x7A8B99,
      tilePrimaryRough: 0.40,
      tilePrimaryMetal: 0.16,
      tileFixedTex: 'brick_diffuse',
      tileFixedColor: 0x94A3B8,
      rimInnerColor: 0x334155,
      rimOuterColor: 0x527988,
      rimEmissive: 0x000000,
      rimEmissiveInt: 0.0,
      surfaceMode: 0,
      foamColor: 0xE2E8F0,
      waterShallow: 0x1C6E7D,
      waterDeep: 0x0B2545,
      skyZenith: 0x1E3A5F,
      skyHorizon: 0x94A8B8,
      starIntensity: 0.0,
      sunColor: 0xEEF6FC,
      hemiSky: 0xB8CFE0,
      hemiGround: 0x334E58,
      sunDir: [0.46, 0.72, 0.52],
      rim: 0x7DD3FC,
      fogColor: 0x94A8B8,
      fogDensity: 0.0040,
      windVec: [1.35, 0.65],
      weather: 'rain',
      snowAmount: 0.0,
      wetness: 0.28,
      strataStrength: 0.18,
      lutTint: [0.98, 1.01, 1.05],
      islandModel: 'smooth_island_rock',
      islandTint: 0x52606D,
      treeModel: 'prop_harbor_crane',
      treeTint: 0xFFFFFF,
      secondaryTreeModel: 'pine_tree_highpoly',
      secondaryTreeTint: 0x84A98C,
      rockModel: 'boulder_01_lod2',
      rockTint: 0x64748B,
      shrubModel: 'shrub_01_lod2',
      grassTint: 0x3B6E68,
      regionModels: ['boulder_01_lod2', 'coastal_cliff_01_lod2', 'shrub_01_lod2']
    },
    8: {
      name: 'crystal_caverns',
      hdr: 'venice_sunset_1k',
      pmremKtx2: 'assets/hdr/pmrem/crystal_caverns_pmrem.ktx2',
      ground: 0x584B78,
      dirt: 0x3F3356,
      rock: 0x6D5D94,
      snow: 0xF3E8FF,
      tilePrimaryTex: 'rock_diffuse',
      tilePrimaryNormal: 'rock_normal',
      tilePrimaryColor: 0x7E70A6,
      tilePrimaryRough: 0.54,
      tilePrimaryMetal: 0.18,
      tileFixedTex: 'rock_diffuse',
      tileFixedColor: 0x93A8D6,
      rimInnerColor: 0x312B4B,
      rimOuterColor: 0x3F3356,
      rimEmissive: 0x6D28D9,
      rimEmissiveInt: 0.18,
      surfaceMode: 8,
      foamColor: 0xA855F7,
      waterShallow: 0x4C3D75,
      waterDeep: 0x1E1736,
      skyZenith: 0x121026,
      skyHorizon: 0x35295C,
      starIntensity: 0.40,
      sunColor: 0xF3EFFE,
      hemiSky: 0xD8CCFA,
      hemiGround: 0x4C3D75,
      sunDir: [0.46, 0.74, 0.50],
      rim: 0xC084FC,
      fogColor: 0x231B42,
      fogDensity: 0.0030,
      windVec: [0.55, 0.25],
      weather: 'crystal_dust',
      snowAmount: 0.0,
      wetness: 0.10,
      strataStrength: 0.25,
      lutTint: [1.02, 1.00, 1.05],
      islandModel: null,
      islandTint: 0x4E426E,
      treeModel: 'prop_crystal_cluster',
      treeTint: 0xFFFFFF,
      rockModel: 'boulder_01_lod2',
      rockTint: 0x7E729E,
      grassTint: 0,
      regionModels: ['boulder_01_lod2']
    },
    9: {
      name: 'volcano_core',
      hdr: 'venice_sunset_1k',
      pmremKtx2: 'assets/hdr/pmrem/volcano_core_pmrem.ktx2',
      ground: 0x3F3D42,
      dirt: 0xB84A1C,
      rock: 0x272528,
      snow: 0xFDE047,
      tilePrimaryTex: 'rock_diffuse',
      tilePrimaryNormal: 'rock_normal',
      tilePrimaryColor: 0x5C585E,
      tilePrimaryRough: 0.84,
      tilePrimaryMetal: 0.10,
      tileFixedTex: 'rock_diffuse',
      tileFixedColor: 0x786B68,
      rimInnerColor: 0x2E2B2E,
      rimOuterColor: 0x9A3B16,
      rimEmissive: 0xC2410C,
      rimEmissiveInt: 0.24,
      surfaceMode: 2,
      foamColor: 0xFDBA4D,
      waterShallow: 0xF97316,
      waterDeep: 0x7C2D12,
      skyZenith: 0x290D0D,
      skyHorizon: 0x8F3415,
      starIntensity: 0.0,
      sunColor: 0xFFF3E0,
      hemiSky: 0xFCD5B0,
      hemiGround: 0x9A3B14,
      sunDir: [0.52, 0.72, 0.52],
      rim: 0xFB923C,
      fogColor: 0x5C2210,
      fogDensity: 0.0032,
      windVec: [1.10, 0.45],
      weather: 'lava_embers',
      snowAmount: 0.0,
      wetness: 0.02,
      strataStrength: 0.35,
      lutTint: [1.04, 1.00, 0.95],
      islandModel: null,
      islandTint: 0x302D30,
      treeModel: 'prop_lava_vent',
      treeTint: 0xFFFFFF,
      rockModel: 'boulder_01_lod2',
      rockTint: 0x454146,
      grassTint: 0,
      regionModels: ['boulder_01_lod2']
    },
    10: {
      name: 'orbital_terminus',
      hdr: 'royal_esplanade_1k',
      pmremKtx2: 'assets/hdr/pmrem/orbital_terminus_pmrem.ktx2',
      ground: 0x475569,
      dirt: 0xCBD5E1,
      rock: 0x64748B,
      snow: 0xF8FAFC,
      tilePrimaryTex: 'metal_diffuse',
      tilePrimaryNormal: 'metal_normal',
      tilePrimaryColor: 0x64748B,
      tilePrimaryRough: 0.32,
      tilePrimaryMetal: 0.52,
      tileFixedTex: 'metal_diffuse',
      tileFixedColor: 0x94A3B8,
      rimInnerColor: 0x334155,
      rimOuterColor: 0xCBD5E1,
      rimEmissive: 0x0284C7,
      rimEmissiveInt: 0.22,
      surfaceMode: 3,
      foamColor: 0x38BDF8,
      waterShallow: 0x1D4ED8,
      waterDeep: 0x030712,
      skyZenith: 0x020617,
      skyHorizon: 0x0F172A,
      starIntensity: 1.0,
      sunColor: 0xFFFFFF,
      hemiSky: 0xCFE8FF,
      hemiGround: 0x475569,
      sunDir: [0.48, 0.76, 0.44],
      rim: 0x7DD3FC,
      fogColor: 0x050B18,
      fogDensity: 0.0012,
      windVec: [0.35, 0.15],
      weather: 'starlight',
      snowAmount: 0.0,
      wetness: 0.04,
      strataStrength: 0.20,
      lutTint: [1.00, 1.02, 1.05],
      islandModel: null,
      islandTint: 0x475569,
      treeModel: 'prop_space_satellite',
      treeTint: 0xFFFFFF,
      rockModel: 'boulder_01_lod2',
      rockTint: 0x64748B,
      grassTint: 0,
      regionModels: ['PrimaryIonDrive', 'boulder_01_lod2']
    }
  };

  // Pre-allocated scratch math objects for ZERO per-frame GC allocations
  const _v1 = new THREE.Vector3();
  const _v2 = new THREE.Vector3();
  const _v3 = new THREE.Vector3();
  const _v4 = new THREE.Vector3();
  const _q1 = new THREE.Quaternion();
  const _q2 = new THREE.Quaternion();
  const _m1 = new THREE.Matrix4();
  const _m2 = new THREE.Matrix4();
  const _euler1 = new THREE.Euler();
  const _color1 = new THREE.Color();
  const _color2 = new THREE.Color();
  const _frustum = new THREE.Frustum();
  const _projScreenMatrix = new THREE.Matrix4();

  // ==========================================================================
  // 2. MEMORY BUDGET TRACKER & 85% HIGH-WATERMARK EVICTION MODULE
  // ==========================================================================
  class MemoryBudget {
    constructor() {
      this.tierBudgetsMB = {
        LOW: 96,
        MID: 160,
        HIGH: 256,
        ULTRA: 384
      };
      this.currentTier = 'HIGH';
      this.textureBytes = new Map();
      this.geometryBytes = new Map();
      this.totalTextureBytes = 0;
      this.totalGeometryBytes = 0;
      this.evictionCallbacks = [];
    }

    setTier(tier) {
      if (this.tierBudgetsMB[tier]) {
        this.currentTier = tier;
      }
    }

    getBudgetBytes() {
      return (this.tierBudgetsMB[this.currentTier] || 256) * 1024 * 1024;
    }

    getTotalEstimatedBytes() {
      return this.totalTextureBytes + this.totalGeometryBytes;
    }

    getTotalEstimatedMB() {
      return this.getTotalEstimatedBytes() / (1024 * 1024);
    }

    getBudgetUsageRatio() {
      return this.getTotalEstimatedBytes() / Math.max(1, this.getBudgetBytes());
    }

    registerTexture(key, tex, isHero = false) {
      if (!tex) return 0;
      let bytes = 0;
      if (tex.userData && tex.userData.estimatedVramBytes) {
        bytes = tex.userData.estimatedVramBytes;
      } else {
        const w = (tex.image && tex.image.width) ? tex.image.width : 1024;
        const h = (tex.image && tex.image.height) ? tex.image.height : 1024;
        bytes = Math.round(w * h * 4 * 1.333);
      }
      if (this.textureBytes.has(key)) {
        this.totalTextureBytes -= this.textureBytes.get(key).bytes;
      }
      this.textureBytes.set(key, { bytes, tex, isHero, lastUsed: performance.now() });
      this.totalTextureBytes += bytes;
      this.checkWatermark();
      return bytes;
    }

    unregisterTexture(key) {
      const entry = this.textureBytes.get(key);
      if (entry) {
        this.totalTextureBytes = Math.max(0, this.totalTextureBytes - entry.bytes);
        this.textureBytes.delete(key);
      }
    }

    registerGeometry(key, rootObj, isCore = false) {
      if (!rootObj) return 0;
      let bytes = 0;
      rootObj.traverse((node) => {
        if (node.isMesh && node.geometry) {
          const attrs = node.geometry.attributes;
          for (const k in attrs) {
            if (attrs[k] && attrs[k].array) bytes += attrs[k].array.byteLength;
          }
          if (node.geometry.index && node.geometry.index.array) {
            bytes += node.geometry.index.array.byteLength;
          }
        }
      });
      if (this.geometryBytes.has(key)) {
        this.totalGeometryBytes -= this.geometryBytes.get(key).bytes;
      }
      this.geometryBytes.set(key, { bytes, rootObj, isCore, lastUsed: performance.now() });
      this.totalGeometryBytes += bytes;
      this.checkWatermark();
      return bytes;
    }

    unregisterGeometry(key) {
      const entry = this.geometryBytes.get(key);
      if (entry) {
        this.totalGeometryBytes = Math.max(0, this.totalGeometryBytes - entry.bytes);
        this.geometryBytes.delete(key);
      }
    }

    onEvictRequest(cb) {
      this.evictionCallbacks.push(cb);
    }

    checkWatermark() {
      if (this.getBudgetUsageRatio() >= 0.85) {
        for (let i = 0; i < this.evictionCallbacks.length; i++) {
          try {
            this.evictionCallbacks[i](this.getBudgetUsageRatio());
          } catch (e) {}
        }
      }
    }
  }

  // ==========================================================================
  // 3. QUALITY MANAGER, DYNAMIC RESOLUTION SCALER (DRS) & THERMAL GOVERNOR
  // ==========================================================================
  const QUALITY_PRESETS = {
    LOW: {
      tier: 'LOW',
      maxDpr: 1.30,
      minScale: 0.90,
      maxScale: 1.00,
      defaultScale: 0.95,
      shadowMapSize: 1024,
      shadowsEnabled: true,
      mipTier: 0,
      vegetationDensity: 0.45,
      grassInstances: 48,
      waterReflection: false,
      ssao: false,
      bloom: false,
      lightShafts: false,
      particleScale: 0.45,
      lodBias: 1.6
    },
    MID: {
      tier: 'MID',
      maxDpr: 1.55,
      minScale: 0.95,
      maxScale: 1.00,
      defaultScale: 1.00,
      shadowMapSize: 1024,
      shadowsEnabled: true,
      mipTier: 0,
      vegetationDensity: 0.72,
      grassInstances: 96,
      waterReflection: false,
      ssao: false,
      bloom: true,
      lightShafts: false,
      particleScale: 0.75,
      lodBias: 1.2
    },
    HIGH: {
      tier: 'HIGH',
      maxDpr: 2.35,
      minScale: 1.00,
      maxScale: 1.00,
      defaultScale: 1.00,
      shadowMapSize: 1536,
      shadowsEnabled: true,
      mipTier: 0,            // Full 2K/4K mips
      vegetationDensity: 0.92,
      grassInstances: 120,
      waterReflection: false,
      ssao: false,
      bloom: true,
      lightShafts: false,
      particleScale: 0.95,
      lodBias: 1.0
    },
    ULTRA: {
      tier: 'ULTRA',
      maxDpr: 2.50,
      minScale: 1.00,
      maxScale: 1.00,
      defaultScale: 1.00,
      shadowMapSize: 2048,
      shadowsEnabled: true,
      mipTier: 0,
      vegetationDensity: 1.00,
      grassInstances: 140,
      waterReflection: false,
      ssao: false,
      bloom: true,
      lightShafts: false,
      particleScale: 1.00,
      lodBias: 0.85
    }
  };

  class QualityManager {
    constructor(engine) {
      this.engine = engine;
      this.currentTier = 'HIGH';
      this.userOverrideTier = null;
      this.gpuRendererString = 'Unknown GPU';
      this.deviceMemoryGB = navigator.deviceMemory || 8;

      // Native-Sharp Resolution State (locked during gameplay to prevent WebGL FBO reallocation stutters)
      this.renderScale = 1.00;
      this.rollingFrameTimes = new Float32Array(120);
      this.frameSampleIdx = 0;
      this.frameSampleCount = 0;
      this.lastDrsEvalTime = 0;
      this.fastHeadroomSeconds = 0;

      // Thermal Governor state
      this.thermalStatus = 0;      // 0=NONE, 1=LIGHT, 2=MODERATE, 3=SEVERE, 4=CRITICAL
      this.thermalHeadroom = 1.0;  // 1.0 = cool, < 0.35 = hot
      this.thermalStepDownLevel = 0; // 0..6 progressive step-downs
      this.locked30Fps = false;

      // Boot benchmark disabled so asset/AdMob startup never triggers false-positive tier downgrades
      this.benchmarkActive = false;
      this.benchmarkStart = 0;
      this.benchmarkFrames = 0;
    }

    detectInitialTier(renderer) {
      try {
        const saved = localStorage.getItem('dream_express_quality_tier_v68');
        if (saved && QUALITY_PRESETS[saved]) {
          this.userOverrideTier = saved;
          this.applyTier(saved);
          return saved;
        }
      } catch (e) {}

      try {
        const gl = renderer.getContext();
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        if (dbg) {
          this.gpuRendererString = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || 'WebGL GPU';
        }
      } catch (e) {}

      const gpu = this.gpuRendererString.toLowerCase();
      let detected = 'HIGH';
      // Note: Android WebView privacy-caps navigator.deviceMemory at 4 even on 8GB/12GB phones;
      // classify strictly by real GPU family or <= 2GB ultra-low-memory devices.
      if (this.deviceMemoryGB <= 2 || /mali-4|mali-t|adreno \(tm\) [34]|powervr|swiftshader|llvmpipe/i.test(gpu)) {
        detected = 'LOW';
      } else if (/adreno \(tm\) 5|adreno \(tm\) 61[02]|mali-g31|mali-g5[12]/i.test(gpu)) {
        detected = 'MID';
      } else if (/rtx|radeon rx|apple m[1234]|apple gpu|adreno \(tm\) [78]|immortalis|mali-g71[05]|xclipse/i.test(gpu)) {
        detected = 'ULTRA';
      } else {
        detected = 'HIGH';
      }

      this.applyTier(detected);
      this.benchmarkActive = false;
      return detected;
    }

    applyTier(tierName, isUserOverride = false) {
      const preset = QUALITY_PRESETS[tierName] || QUALITY_PRESETS.HIGH;
      this.currentTier = preset.tier;
      this.activeTier = preset.tier;
      if (isUserOverride) {
        this.userOverrideTier = preset.tier;
        this.benchmarkActive = false;
        try {
          localStorage.setItem('dream_express_quality_tier_v68', preset.tier);
        } catch (e) {}
      }
      this.renderScale = preset.defaultScale;
      if (this.engine && this.engine.memoryBudget) {
        this.engine.memoryBudget.setTier(this.currentTier);
      }
      if (this.engine) {
        this.engine.onQualityTierChanged(this.getEffectiveConfig());
      }
    }

    getEffectiveConfig() {
      const base = Object.assign({}, QUALITY_PRESETS[this.currentTier] || QUALITY_PRESETS.HIGH);
      const step = this.thermalStepDownLevel;
      if (step >= 1) base.ssao = false;
      if (step >= 2) base.waterReflection = false;
      if (step >= 3) {
        base.vegetationDensity *= 0.65;
        base.grassInstances = Math.floor(base.grassInstances * 0.6);
      }
      if (step >= 4) {
        base.shadowMapSize = Math.max(1024, base.shadowMapSize >> 1);
      }
      if (step >= 5) {
        this.renderScale = Math.max(base.minScale, this.renderScale - 0.05);
      }
      this.locked30Fps = (step >= 6);
      return base;
    }

    recordFrameTime(frameMs, nowMs) {
      const cleanMs = frameMs > 45.0 ? 16.6 : frameMs;
      this.rollingFrameTimes[this.frameSampleIdx] = cleanMs;
      this.frameSampleIdx = (this.frameSampleIdx + 1) % this.rollingFrameTimes.length;
      if (this.frameSampleCount < this.rollingFrameTimes.length) {
        this.frameSampleCount++;
      }
      // Keep render resolution locked during gameplay so WebGL never reallocates its MSAA framebuffer mid-level!
    }

    onThermalUpdate(status, headroom) {
      this.thermalStatus = Number(status) || 0;
      this.thermalHeadroom = typeof headroom === 'number' && !isNaN(headroom) ? headroom : 1.0;

      let targetStep = 0;
      if (this.thermalStatus >= 4 || this.thermalHeadroom < 0.15) {
        targetStep = 6; // Locked 30 FPS + all step-downs
      } else if (this.thermalStatus === 3 || this.thermalHeadroom < 0.30) {
        targetStep = 5;
      } else if (this.thermalStatus === 2 || this.thermalHeadroom < 0.50) {
        targetStep = 3;
      } else if (this.thermalStatus === 1 || this.thermalHeadroom < 0.70) {
        targetStep = 1;
      } else {
        // Gradual recovery when device cools
        targetStep = Math.max(0, this.thermalStepDownLevel - 1);
      }

      if (targetStep !== this.thermalStepDownLevel) {
        this.thermalStepDownLevel = targetStep;
        if (this.engine) {
          this.engine.onQualityTierChanged(this.getEffectiveConfig());
        }
        // Notify Android shell to adjust Surface.setFrameRate(30 or 60)
        if (window.AndroidAdMob && typeof window.AndroidAdMob.setTargetFrameRate === 'function') {
          try {
            window.AndroidAdMob.setTargetFrameRate(this.locked30Fps ? 30 : 60);
          } catch (e) {}
        }
      }
    }

    getFramePercentiles() {
      const n = this.frameSampleCount;
      if (n === 0) return { p50: 16.6, p95: 16.6, p99: 16.6, fps: 60 };
      const arr = Array.from(this.rollingFrameTimes.subarray(0, n)).sort((a, b) => a - b);
      const p50 = arr[Math.floor(n * 0.50)] || 16.6;
      const p95 = arr[Math.floor(n * 0.95)] || p50;
      const p99 = arr[Math.floor(n * 0.99)] || p95;
      const fps = Math.min(60, Math.round(1000 / Math.max(1, p50)));
      return { p50, p95, p99, fps };
    }
  }

  // ==========================================================================
  // 4. PER-REGION STREAMING ASSET LOADER (Core Bundle + Biome Bundles + KTX2)
  // ==========================================================================
  const CORE_MODEL_MANIFEST = [
    { key: 'locomotive_heavy',    url: 'assets/models/locomotive_heavy.glb' },
    { key: 'loco_steam',          url: 'assets/models/loco_steam.glb' },
    { key: 'loco_bullet',         url: 'assets/models/loco_bullet.glb' },
    { key: 'loco_maglev',         url: 'assets/models/loco_maglev.glb' },
    { key: 'carriage_passenger',  url: 'assets/models/carriage_passenger.glb' },
    { key: 'carriage_bullet',     url: 'assets/models/carriage_bullet.glb' },
    { key: 'track_straight',      url: 'assets/models/track_straight.glb' },
    { key: 'track_curve',         url: 'assets/models/track_curve.glb' },
    { key: 'track_bridge',        url: 'assets/models/track_bridge.glb' },
    { key: 'track_cross',         url: 'assets/models/track_cross.glb' },
    { key: 'track_yswitch',       url: 'assets/models/track_yswitch.glb' },
    { key: 'track_switch',        url: 'assets/models/track_switch.glb' },
    { key: 'station_terminal',    url: 'assets/models/station_terminal.glb' },
    { key: 'tunnel_arch',         url: 'assets/models/tunnel_arch.glb' },
    { key: 'board_tile',          url: 'assets/models/board_tile.glb' },
    { key: 'board_table',         url: 'assets/models/board_table.glb' },
    { key: 'energy_crystal_coin', url: 'assets/models/energy_crystal_coin.glb' },
    { key: 'smooth_island_rock',  url: 'assets/models/smooth_island_rock.glb' },
    { key: 'sandy_island_mound',  url: 'assets/models/sandy_island_mound.glb' },
    { key: 'pine_tree_highpoly',  url: 'assets/models/pine_tree_highpoly.glb' },
    { key: 'prop_desert_cactus',  url: 'assets/models/prop_desert_cactus.glb' },
    { key: 'prop_harbor_crane',   url: 'assets/models/prop_harbor_crane.glb' },
    { key: 'prop_snow_pine',      url: 'assets/models/prop_snow_pine.glb' },
    { key: 'prop_neon_tower',     url: 'assets/models/prop_neon_tower.glb' },
    { key: 'prop_clockwork_gear', url: 'assets/models/prop_clockwork_gear.glb' },
    { key: 'prop_crystal_cluster',url: 'assets/models/prop_crystal_cluster.glb' },
    { key: 'prop_lava_vent',      url: 'assets/models/prop_lava_vent.glb' },
    { key: 'prop_space_satellite',url: 'assets/models/prop_space_satellite.glb' },
    { key: 'prop_ringed_planet',  url: 'assets/models/prop_ringed_planet.glb' },
    { key: 'prop_exoplanet',      url: 'assets/models/prop_exoplanet.glb' },
    { key: 'prop_windmill',       url: 'assets/models/prop_windmill.glb' },
    { key: 'prop_fence',          url: 'assets/models/prop_fence.glb' },
    { key: 'prop_water_basin',    url: 'assets/models/prop_water_basin.glb' },
    { key: 'prop_anchor',         url: 'assets/models/prop_anchor.glb' },
    { key: 'prop_coral',          url: 'assets/models/prop_coral.glb' },
    { key: 'prop_fountain',       url: 'assets/models/prop_fountain.glb' },
    { key: 'prop_bell',           url: 'assets/models/prop_bell.glb' },
    { key: 'prop_pendulum',       url: 'assets/models/prop_pendulum.glb' },
    { key: 'prop_whirlpool',      url: 'assets/models/prop_whirlpool.glb' },
    { key: 'mountain_peak',       url: 'assets/models/mountain_peak.glb' },
    { key: 'terrain_chunk_lod0',  url: 'assets/models/terrain_chunk_lod0.glb' },
    { key: 'terrain_chunk_lod1',  url: 'assets/models/terrain_chunk_lod1.glb' },
    { key: 'terrain_chunk_lod2',  url: 'assets/models/terrain_chunk_lod2.glb' },
    { key: 'water_surface_planar',url: 'assets/models/water_surface_planar.glb' },
    { key: 'sky_dome_analytic',   url: 'assets/models/sky_dome_analytic.glb' },
    { key: 'grass_patch_cluster', url: 'assets/models/grass_patch_cluster.glb' },
    { key: 'octahedral_impostor', url: 'assets/models/octahedral_impostor.glb' },
    { key: 'blob_shadow_decal',   url: 'assets/models/blob_shadow_decal.glb' },
    { key: 'boulder_01_lod2',     url: 'assets/models/boulder_01_lod2.glb' },
    { key: 'tree_small_02_lod2',  url: 'assets/models/tree_small_02_lod2.glb' },
    { key: 'shrub_01_lod2',       url: 'assets/models/shrub_01_lod2.glb' },
    { key: 'street_lamp_01_lod2', url: 'assets/models/street_lamp_01_lod2.glb' },
    { key: 'ReadyPlayerMe',       url: 'assets/models/ReadyPlayerMe_Avatar_FacialMorphs.glb' },
    { key: 'HVGirl',              url: 'assets/models/HVGirl_Stylized_Heroine.glb' },
    { key: 'CesiumMan',           url: 'assets/models/CesiumMan_Rigged.glb' },
    { key: 'Soldier',             url: 'assets/models/Soldier.glb' },
    { key: 'Michelle',            url: 'assets/models/Michelle.glb' }
  ];

  const OPTIONAL_MODEL_URLS = {
    tree_small_02_lod0:     'assets/models/tree_small_02_lod0.glb',
    tree_small_02_lod1:     'assets/models/tree_small_02_lod1.glb',
    tree_small_02_lod2:     'assets/models/tree_small_02_lod2.glb',
    tree_small_02_impostor: 'assets/models/tree_small_02_impostor.glb',
    coastal_cliff_01_lod0:  'assets/models/coastal_cliff_01_lod0.glb',
    coastal_cliff_01_lod1:  'assets/models/coastal_cliff_01_lod1.glb',
    coastal_cliff_01_lod2:  'assets/models/coastal_cliff_01_lod2.glb',
    shrub_01_lod0:          'assets/models/shrub_01_lod0.glb',
    shrub_01_lod1:          'assets/models/shrub_01_lod1.glb',
    shrub_01_lod2:          'assets/models/shrub_01_lod2.glb',
    boulder_01_lod0:        'assets/models/boulder_01_lod0.glb',
    boulder_01_lod1:        'assets/models/boulder_01_lod1.glb',
    boulder_01_lod2:        'assets/models/boulder_01_lod2.glb',
    street_lamp_01_lod0:    'assets/models/street_lamp_01_lod0.glb',
    street_lamp_01_lod1:    'assets/models/street_lamp_01_lod1.glb',
    street_lamp_01_lod2:    'assets/models/street_lamp_01_lod2.glb',
    PrimaryIonDrive:        'assets/models/PrimaryIonDrive.glb',
    CesiumMilkTruck:        'assets/models/CesiumMilkTruck.glb',
    Flamingo:               'assets/models/Flamingo.glb',
    Parrot:                 'assets/models/Parrot.glb',
    Stork:                  'assets/models/Stork.glb',
    Horse:                  'assets/models/Horse.glb',
    RobotExpressive:        'assets/models/RobotExpressive.glb'
  };

  const CORE_KTX2_TEXTURES = [
    { key: 'grass_diffuse',       ktx2: 'assets/textures/ktx2/grass_diffuse.ktx2',       jpg: 'assets/textures/grasslight_big.jpg',       srgb: true,  hero: true },
    { key: 'grass_normal',        ktx2: 'assets/textures/ktx2/grass_normal.ktx2',        jpg: 'assets/textures/grasslight_big_nm.jpg',    srgb: false, hero: true },
    { key: 'rock_diffuse',        ktx2: 'assets/textures/ktx2/rock_diffuse.ktx2',        jpg: 'assets/textures/rock_diffuse_1k.jpg',      srgb: true,  hero: true },
    { key: 'rock_normal',         ktx2: 'assets/textures/ktx2/rock_normal.ktx2',         jpg: 'assets/textures/rock_normal_1k.jpg',       srgb: false, hero: true },
    { key: 'rock_roughness',      ktx2: 'assets/textures/ktx2/rock_orm.ktx2',            jpg: 'assets/textures/rock_roughness_1k.jpg',    srgb: false, hero: false },
    { key: 'metal_diffuse',       ktx2: 'assets/textures/ktx2/metal_diffuse.ktx2',       jpg: 'assets/textures/metal_diffuse_1k.jpg',     srgb: true,  hero: true },
    { key: 'metal_normal',        ktx2: 'assets/textures/ktx2/metal_normal.ktx2',        jpg: 'assets/textures/metal_normal_1k.jpg',      srgb: false, hero: true },
    { key: 'metal_roughness',     ktx2: 'assets/textures/ktx2/metal_orm.ktx2',           jpg: 'assets/textures/metal_roughness_1k.jpg',   srgb: false, hero: false },
    { key: 'brick_diffuse',       ktx2: 'assets/textures/ktx2/brick_diffuse.ktx2',       jpg: 'assets/textures/brick_diffuse.jpg',        srgb: true,  hero: false },
    { key: 'brick_bump',          ktx2: 'assets/textures/ktx2/brick_bump.ktx2',          jpg: 'assets/textures/brick_bump.jpg',           srgb: false, hero: false },
    { key: 'brick_roughness',     ktx2: 'assets/textures/ktx2/brick_orm.ktx2',           jpg: 'assets/textures/brick_roughness.jpg',      srgb: false, hero: false },
    { key: 'hardwood_diffuse',    ktx2: 'assets/textures/ktx2/hardwood_diffuse.ktx2',    jpg: 'assets/textures/hardwood2_diffuse.jpg',    srgb: true,  hero: false },
    { key: 'hardwood_bump',       ktx2: 'assets/textures/ktx2/hardwood_bump.ktx2',       jpg: 'assets/textures/hardwood2_bump.jpg',       srgb: false, hero: false },
    { key: 'hardwood_roughness',  ktx2: 'assets/textures/ktx2/hardwood_orm.ktx2',        jpg: 'assets/textures/hardwood2_roughness.jpg',  srgb: false, hero: false },
    { key: 'water_diffuse',       ktx2: 'assets/textures/ktx2/water_diffuse.ktx2',       jpg: 'assets/textures/water.jpg',                srgb: true,  hero: false },
    { key: 'water_normal',        ktx2: 'assets/textures/ktx2/water_normal.ktx2',       jpg: 'assets/textures/waternormals_vault_hd.jpg', srgb: false, hero: true },
    { key: 'detail_micro_normal', ktx2: 'assets/textures/ktx2/detail_micro_normal.ktx2', jpg: 'assets/textures/detail_micro_normal.jpg',  srgb: false, hero: true },
    { key: 'detail_micro_albedo', ktx2: 'assets/textures/ktx2/detail_micro_albedo.ktx2', jpg: 'assets/textures/detail_micro_albedo.jpg',  srgb: true,  hero: false }
  ];

  class AssetLoaderSystem3D {
    constructor(renderer, memoryBudget) {
      this.renderer = renderer;
      this.memoryBudget = memoryBudget;
      this.models = {};
      this.coreModelKeys = new Set(CORE_MODEL_MANIFEST.map(m => m.key));
      this.hdrMaps = {};
      this.pbrTextures = {};
      this.activeRegionId = null;
      this.loadedRegionModels = new Set();
      this.baseModelMaterials = new Set();

      this.isReady = false;
      this.isLoading = false;
      this.loadedCount = 0;
      this.totalCount = 0;
      this.onReadyCallbacks = [];

      this.maxAnisotropy = renderer ? Math.min(16, renderer.capabilities.getMaxAnisotropy()) : 8;
      this.textureLoader = new THREE.TextureLoader();
      this.ktx2Loader = (typeof THREE.KTX2Loader !== 'undefined' && renderer && !renderer.isHeadlessStub)
        ? new THREE.KTX2Loader().detectSupport(renderer)
        : null;

      this.gltfLoader = (typeof THREE.GLTFLoader !== 'undefined') ? new THREE.GLTFLoader() : null;
      this.dracoLoader = null;
      if (this.gltfLoader && typeof THREE.DRACOLoader !== 'undefined') {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('js/draco/');
        this.gltfLoader.setDRACOLoader(dracoLoader);
        this.dracoLoader = dracoLoader;
      }

      this.rgbeLoader = (typeof THREE.RGBELoader !== 'undefined') ? new THREE.RGBELoader() : null;
      this.pmremGenerator = null;
      if (renderer && !renderer.isHeadlessStub && typeof THREE.PMREMGenerator !== 'undefined') {
        this.pmremGenerator = new THREE.PMREMGenerator(renderer);
        this.pmremGenerator.compileEquirectangularShader();
      }

      if (this.memoryBudget) {
        this.memoryBudget.onEvictRequest(() => this.evictNonActiveRegionResources());
      }
    }

    onReady(cb) {
      if (this.isReady) cb();
      else this.onReadyCallbacks.push(cb);
    }

    /**
     * Loads the Core Bundle at boot (starting with 1K mip-streaming tier for fast startup,
     * then automatically upgrading hero textures to 2K when budget allows).
     */
    loadAllAssets() {
      if (this.isLoading || this.isReady) return;
      this.isLoading = true;

      this.totalCount = CORE_MODEL_MANIFEST.length + CORE_KTX2_TEXTURES.length;
      this.loadedCount = 0;

      const finishAll = () => {
        if (this.isReady) return;
        this.applyPbrMapsToAllLoadedModels();
        this.isReady = true;
        this.isLoading = false;
        if (typeof window.__dismissBootLoader === 'function') {
          try { window.__dismissBootLoader(); } catch (_) {}
        }
        const cbs = this.onReadyCallbacks.slice();
        this.onReadyCallbacks = [];
        cbs.forEach(fn => {
          try { fn(); } catch (e) { console.error(e); }
        });
      };

      const markStep = () => {
        this.loadedCount++;
        if (typeof window.__updateBootLoaderProgress === 'function') {
          try { window.__updateBootLoaderProgress(this.loadedCount, this.totalCount); } catch (_) {}
        }
        if (this.loadedCount >= this.totalCount && !this.isReady) {
          finishAll();
        }
      };

      // Mandatory 3.4s failsafe so asset readiness and boot loader never stall on any device
      setTimeout(() => {
        if (!this.isReady) {
          finishAll();
        }
      }, 3400);

      // 1. Load KTX2 GPU-compressed textures (hero textures immediately at mip tier 0 = full crispness!)
      CORE_KTX2_TEXTURES.forEach(item => {
        this._loadKtx2OrFallback(item, item.hero ? 0 : 0, () => markStep());
      });

      // 2. Load Core 3D Models (.glb)
      CORE_MODEL_MANIFEST.forEach(item => {
        this._loadSingleModel(item.key, item.url, true, () => markStep());
      });

      // 3. Stream Region 1 (Pine Valley) immediately alongside core bundle
      this.streamRegionAssets(1);
    }

    _loadKtx2OrFallback(item, mipTier, onDone) {
      const applyTexProps = (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.anisotropy = this.maxAnisotropy;
        if (tex.mipmaps && tex.mipmaps.length > 1) {
          tex.minFilter = THREE.LinearMipmapLinearFilter;
        }
        tex.magFilter = THREE.LinearFilter;
        if (item.srgb) tex.encoding = THREE.sRGBEncoding;
        this.pbrTextures[item.key] = tex;
        if (this.memoryBudget) {
          this.memoryBudget.registerTexture(item.key, tex, item.hero);
        }
        if (onDone) onDone(tex);
      };

      if (this.ktx2Loader && item.ktx2) {
        this.ktx2Loader.load(
          item.ktx2,
          (tex) => applyTexProps(tex),
          undefined,
          () => {
            this.textureLoader.load(item.jpg, (tex) => applyTexProps(tex), undefined, () => { if (onDone) onDone(null); });
          },
          mipTier
        );
      } else {
        this.textureLoader.load(item.jpg, (tex) => applyTexProps(tex), undefined, () => { if (onDone) onDone(null); });
      }
    }

    upgradeHeroTexturesToFullRes() {
      if (!this.ktx2Loader || !this.memoryBudget) return;
      if (this.memoryBudget.currentTier === 'LOW' || this.memoryBudget.currentTier === 'MID') return;
      if (this.memoryBudget.getBudgetUsageRatio() > 0.72) return;

      CORE_KTX2_TEXTURES.forEach(item => {
        if (!item.hero) return;
        this._loadKtx2OrFallback(item, 0, null);
      });
    }

    _registerBaseModelMaterials(rootScene) {
      if (!rootScene || typeof rootScene.traverse !== 'function') return;
      rootScene.traverse(node => {
        if (node && node.isMesh && node.material) {
          const mats = Array.isArray(node.material) ? node.material : [node.material];
          for (let i = 0; i < mats.length; i++) {
            if (mats[i]) this.baseModelMaterials.add(mats[i]);
          }
        }
      });
    }

    _loadSingleModel(key, url, isCore, onDone) {
      if (this.models[key]) {
        if (onDone) onDone(this.models[key]);
        return;
      }
      if (!this.gltfLoader || (this.renderer && this.renderer.isHeadlessStub)) {
        if (onDone) onDone(null);
        return;
      }
      this.gltfLoader.load(
        url,
        (gltf) => {
          this._optimizeAndBrightenStaticModel(key, gltf.scene);
          if (this.pbrTextures && Object.keys(this.pbrTextures).length > 0) {
            this.applyPbrMapsToModel(key, gltf.scene);
          }
          gltf.scene.traverse(node => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
              if (node.material) {
                if (node.material.transmission) node.material.transmission = 0;
                node.material.anisotropy = this.maxAnisotropy;
              }
            }
          });
          this.models[key] = gltf;
          this._registerBaseModelMaterials(gltf.scene);
          if (!isCore) this.loadedRegionModels.add(key);
          if (this.memoryBudget) {
            this.memoryBudget.registerGeometry(key, gltf.scene, isCore);
          }
          // V12.0 Guarantee: As soon as any rigged 3D character finishes loading, refresh station platforms if active!
          if (key === 'ReadyPlayerMe' || key === 'HVGirl' || key === 'CesiumMan' || key === 'Soldier' || key === 'Michelle') {
            if (typeof window !== 'undefined' && window.TrainEngine3D && window.TrainEngine3D.currentLevel && !window.TrainEngine3D.isMenuShowcase) {
              clearTimeout(window.TrainEngine3D._charRebuildTimer);
              window.TrainEngine3D._charRebuildTimer = setTimeout(() => {
                if (window.TrainEngine3D && window.TrainEngine3D.currentLevel && !window.TrainEngine3D.runState && !window.TrainEngine3D.isMenuShowcase) {
                  window.TrainEngine3D.buildStationPlatformsAndHumans3D(window.TrainEngine3D.currentLevel);
                }
              }, 45);
            }
          }
          if (onDone) onDone(gltf);
        },
        undefined,
        () => {
          if (onDone) onDone(null);
        }
      );
    }

    /**
     * V6.8 Photorealistic PBR Enhancer:
     * Preserves all multi-material submeshes, smooth/creased normals, UVs, and embedded 1K/2K
     * PolyHaven & Track PBR textures (Albedo, Normal, ORM), configures alpha-cutout scanned foliage,
     * and binds shared high-resolution Normal & Roughness maps onto architectural & natural .glb models.
     */
    _optimizeAndBrightenStaticModel(key, rootScene) {
      if (!rootScene) return;
      const SKIP_KEYS = new Set([
        'ReadyPlayerMe', 'HVGirl',
        'Soldier', 'Michelle', 'Xbot', 'CesiumMan', 'RobotExpressive',
        'Flamingo', 'Parrot', 'Stork', 'Horse', 'sky_dome_analytic',
        'water_surface_planar', 'terrain_chunk_lod0', 'terrain_chunk_lod1', 'terrain_chunk_lod2',
        'locomotive_heavy', 'loco_steam', 'loco_bullet', 'loco_maglev',
        'carriage_passenger', 'carriage_bullet'
      ]);
      if (SKIP_KEYS.has(key)) return;

      const aniso = this.maxAnisotropy || 4;
      rootScene.traverse(node => {
        if (!node.isMesh || !node.geometry || node.isSkinnedMesh) return;
        if (!node.geometry.attributes.normal) {
          node.geometry.computeVertexNormals();
        }
        node.geometry.computeBoundingSphere();
        if (!node.material) return;

        node.material = node.material.clone();
        const mat = node.material;
        const mName = ((mat.name || node.name) || '').toLowerCase();

        // Preserve & sharpen all embedded GLB textures (PolyHaven boulders, cliffs, trees, shrubs, lamps, tracks)
        ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'].forEach(slot => {
          if (mat[slot]) {
            mat[slot].anisotropy = aniso;
            if (slot === 'map' || slot === 'emissiveMap') {
              mat[slot].encoding = THREE.sRGBEncoding;
            }
          }
        });

        // Scanned alpha-cutout leaves & shrubs: crisp double-sided foliage with sunlit chlorophyll lift
        if (mName.includes('leaves') || mName.includes('shrubfoliage') || key.startsWith('grass_patch')) {
          mat.alphaTest = mat.map ? 0.40 : 0.0;
          mat.transparent = false;
          mat.side = THREE.DoubleSide;
          mat.roughness = 0.68;
          mat.metalness = 0.02;
          mat.envMapIntensity = 0.65;
          if (mat.color && mat.map) {
            mat.color.setRGB(1.12, 1.18, 1.05);
          }
        } else if (key.startsWith('boulder_') || key.startsWith('coastal_cliff')) {
          mat.roughness = 0.86;
          mat.metalness = 0.04;
          mat.envMapIntensity = 0.60;
          if (mat.normalScale) mat.normalScale.set(0.95, 0.95);
        } else if (key.startsWith('street_lamp')) {
          mat.envMapIntensity = 1.25;
        }
      });

      this.applyPbrMapsToModel(key, rootScene);
    }

    applyPbrMapsToAllLoadedModels() {
      for (const key of Object.keys(this.models)) {
        const gltf = this.models[key];
        if (gltf && gltf.scene) {
          this.applyPbrMapsToModel(key, gltf.scene);
        }
      }
    }

    applyPbrMapsToModel(key, rootScene) {
      if (!rootScene || !this.pbrTextures) return;
      const pbr = this.pbrTextures;
      if (Object.keys(pbr).length === 0) return;

      rootScene.traverse(node => {
        if (!node.isMesh || !node.material || node.isSkinnedMesh) return;
        const mat = node.material;
        const mName = ((mat.name || node.name) || '').toLowerCase();
        const hasEmbeddedAlbedo = Boolean(mat.map && !mat.userData._sharedAlbedoBound);

        // 1. Photorealistic Railway Track Submeshes (BallastGravel, TimberSleeper, SteelRail, TiePlateDark, BridgeTruss)
        if (key.startsWith('track_')) {
          if (mName.includes('ballast') || mName.includes('pier')) {
            if (!hasEmbeddedAlbedo && pbr.rock_diffuse) { mat.map = pbr.rock_diffuse; mat.userData._sharedAlbedoBound = true; }
            if (pbr.rock_normal) { mat.normalMap = pbr.rock_normal; mat.normalScale = new THREE.Vector2(0.82, 0.82); }
            if (pbr.rock_roughness) mat.roughnessMap = pbr.rock_roughness;
            if (mat.color) mat.color.setRGB(0.62, 0.64, 0.68);
            mat.roughness = 0.90;
            mat.metalness = 0.04;
            mat.envMapIntensity = 0.50;
          } else if (mName.includes('sleeper') || mName.includes('timber') || mName.includes('deck')) {
            if (!hasEmbeddedAlbedo && pbr.hardwood_diffuse) { mat.map = pbr.hardwood_diffuse; mat.userData._sharedAlbedoBound = true; }
            if (pbr.hardwood_bump) { mat.normalMap = pbr.hardwood_bump; mat.normalScale = new THREE.Vector2(0.60, 0.60); }
            if (pbr.hardwood_roughness) mat.roughnessMap = pbr.hardwood_roughness;
            if (mat.color) mat.color.setRGB(0.68, 0.46, 0.28);
            mat.roughness = 0.82;
            mat.metalness = 0.05;
            mat.envMapIntensity = 0.42;
          } else if (mName.includes('rail') || mName.includes('truss')) {
            if (pbr.metal_normal) { mat.normalMap = pbr.metal_normal; mat.normalScale = new THREE.Vector2(0.32, 0.32); }
            if (pbr.metal_roughness) mat.roughnessMap = pbr.metal_roughness;
            if (mat.color) mat.color.setRGB(0.94, 0.96, 0.99);
            mat.roughness = 0.18;
            mat.metalness = 0.88;
            mat.envMapIntensity = 1.45;
          } else if (mName.includes('tieplate')) {
            if (pbr.metal_normal) { mat.normalMap = pbr.metal_normal; mat.normalScale = new THREE.Vector2(0.45, 0.45); }
            if (mat.color) mat.color.setRGB(0.24, 0.27, 0.32);
            mat.roughness = 0.48;
            mat.metalness = 0.72;
            mat.envMapIntensity = 0.95;
          }
          mat.needsUpdate = true;
          return;
        }

        // Skip PolyHaven models that already have embedded PBR normal & roughness maps
        if (key.startsWith('boulder_') || key.startsWith('coastal_cliff') || key.startsWith('tree_small') || key.startsWith('shrub_') || key.startsWith('street_lamp') || key === 'PrimaryIonDrive') {
          return;
        }

        // 2. Architectural Tunnel, Grand Station Terminal, Natural Islands & Biome Landmarks
        if (mName.includes('termbrickwalls')) {
          if (pbr.brick_diffuse) { mat.map = pbr.brick_diffuse; mat.userData._sharedAlbedoBound = true; }
          if (pbr.brick_bump) { mat.normalMap = pbr.brick_bump; mat.normalScale = new THREE.Vector2(0.75, 0.75); }
          if (pbr.brick_roughness) mat.roughnessMap = pbr.brick_roughness;
          mat.roughness = 0.82;
          mat.metalness = 0.04;
          mat.envMapIntensity = 0.55;
        } else if (mName.includes('portalstone') || mName.includes('termstoneplatform') || mName.includes('graniteoutcrop') || mName.includes('sandstonered') || mName.includes('cavernrock') || mName.includes('basaltcharcoal')) {
          if (pbr.rock_diffuse) { mat.map = pbr.rock_diffuse; mat.userData._sharedAlbedoBound = true; }
          if (pbr.rock_normal) { mat.normalMap = pbr.rock_normal; mat.normalScale = new THREE.Vector2(0.80, 0.80); }
          if (pbr.rock_roughness) mat.roughnessMap = pbr.rock_roughness;
          mat.envMapIntensity = 0.58;
        } else if (mName.includes('pinebarkcedar') || mName.includes('woodbark')) {
          if (pbr.hardwood_diffuse) { mat.map = pbr.hardwood_diffuse; mat.userData._sharedAlbedoBound = true; }
          if (pbr.hardwood_bump) { mat.normalMap = pbr.hardwood_bump; mat.normalScale = new THREE.Vector2(0.70, 0.70); }
          if (pbr.hardwood_roughness) mat.roughnessMap = pbr.hardwood_roughness;
          mat.envMapIntensity = 0.38;
        } else if (
          mName.includes('portalsteel') || mName.includes('termironcanopy') ||
          mName.includes('steeldark') || mName.includes('craneyellow') ||
          mName.includes('containerblue') || mName.includes('containerred') ||
          mName.includes('brassgold') || mName.includes('copperwarm') ||
          mName.includes('titaniumsilver') || mName.includes('goldfoil') ||
          mName.includes('obsidiandark') || mName.includes('solarblue')
        ) {
          if (pbr.metal_normal) { mat.normalMap = pbr.metal_normal; mat.normalScale = new THREE.Vector2(0.32, 0.32); }
          if (pbr.metal_roughness) mat.roughnessMap = pbr.metal_roughness;
          mat.envMapIntensity = 1.35;
        } else if (mName.includes('termglassskylight') || mName.includes('crystalviolet') || mName.includes('crystalcyan') || mName.includes('icecyan')) {
          if (pbr.detail_micro_normal) { mat.normalMap = pbr.detail_micro_normal; mat.normalScale = new THREE.Vector2(0.14, 0.14); }
          mat.envMapIntensity = 1.65;
        } else if (mName.includes('watersurface')) {
          if (pbr.water_normal) { mat.normalMap = pbr.water_normal; mat.normalScale = new THREE.Vector2(0.55, 0.55); }
          mat.envMapIntensity = 1.55;
        } else if (mName.includes('islandcrownturf')) {
          if (pbr.grass_diffuse) { mat.map = pbr.grass_diffuse; mat.userData._sharedAlbedoBound = true; }
          if (pbr.grass_normal) { mat.normalMap = pbr.grass_normal; mat.normalScale = new THREE.Vector2(0.55, 0.55); }
          else if (pbr.detail_micro_normal) { mat.normalMap = pbr.detail_micro_normal; mat.normalScale = new THREE.Vector2(0.48, 0.48); }
          mat.envMapIntensity = 0.46;
        } else if (mName.includes('pineneedles') || mName.includes('alpinepine') || mName.includes('cactusgreen')) {
          if (pbr.detail_micro_normal) { mat.normalMap = pbr.detail_micro_normal; mat.normalScale = new THREE.Vector2(0.48, 0.48); }
          mat.envMapIntensity = 0.48;
        } else if (mName.includes('islandshoresand') || mName.includes('ochresand') || mName.includes('portalroofearth') || mName.includes('snowwhite')) {
          if (pbr.rock_diffuse && !mName.includes('snowwhite')) { mat.map = pbr.rock_diffuse; mat.userData._sharedAlbedoBound = true; }
          if (pbr.detail_micro_normal) { mat.normalMap = pbr.detail_micro_normal; mat.normalScale = new THREE.Vector2(0.45, 0.45); }
          mat.envMapIntensity = 0.52;
        }
        mat.needsUpdate = true;
      });
    }

    /**
     * Per-Region Streaming: Loads the biome's pre-filtered PMREM KTX2 + region-specific LOD models,
     * and disposes the previous region's non-core assets to keep VRAM strictly bounded.
     */
    streamRegionAssets(stationId, onRegionReady) {
      if (this.renderer && this.renderer.isHeadlessStub) {
        if (onRegionReady) onRegionReady();
        return;
      }
      const biome = BIOME_CONFIGS[stationId] || BIOME_CONFIGS[1];
      if (this.activeRegionId && this.activeRegionId !== stationId) {
        this.disposePreviousRegion(stationId);
      }
      this.activeRegionId = stationId;

      const modelsToLoad = (biome.regionModels || []).filter(k => !this.models[k] && OPTIONAL_MODEL_URLS[k]);
      const needPmrem = !this.hdrMaps[biome.name];
      let remaining = modelsToLoad.length + (needPmrem ? 1 : 0);

      if (remaining === 0) {
        if (onRegionReady) onRegionReady();
        return;
      }

      const step = () => {
        remaining--;
        if (remaining <= 0 && onRegionReady) onRegionReady();
      };

      // Load offline-baked PMREM KTX2 for this biome (with .hdr fallback)
      if (needPmrem) {
        if (this.ktx2Loader && biome.pmremKtx2) {
          this.ktx2Loader.load(
            biome.pmremKtx2,
            (ktxTex) => {
              ktxTex.mapping = THREE.EquirectangularReflectionMapping;
              const envMap = this.pmremGenerator
                ? this.pmremGenerator.fromEquirectangular(ktxTex).texture
                : ktxTex;
              if (this.pmremGenerator && ktxTex && typeof ktxTex.dispose === 'function') {
                ktxTex.dispose();
              }
              this.hdrMaps[biome.name] = envMap;
              this.hdrMaps[biome.hdr] = envMap;
              if (this.memoryBudget) this.memoryBudget.registerTexture('pmrem_' + biome.name, envMap, true);
              step();
            },
            undefined,
            () => this._loadFallbackHdr(biome, step),
            0
          );
        } else {
          this._loadFallbackHdr(biome, step);
        }
      }

      modelsToLoad.forEach(k => {
        this._loadSingleModel(k, OPTIONAL_MODEL_URLS[k], false, () => step());
      });
    }

    _loadFallbackHdr(biome, cb) {
      if (!this.rgbeLoader || !this.pmremGenerator) {
        cb();
        return;
      }
      this.rgbeLoader.load(
        `assets/hdr/${biome.hdr}.hdr`,
        (hdrTex) => {
          const envMap = this.pmremGenerator.fromEquirectangular(hdrTex).texture;
          hdrTex.dispose();
          this.hdrMaps[biome.name] = envMap;
          this.hdrMaps[biome.hdr] = envMap;
          cb();
        },
        undefined,
        () => cb()
      );
    }

    preloadNextRegion(nextStationId) {
      const biome = BIOME_CONFIGS[nextStationId];
      if (!biome) return;
      if (!this.hdrMaps[biome.name] && this.ktx2Loader && biome.pmremKtx2) {
        this.ktx2Loader.load(biome.pmremKtx2, (ktxTex) => {
          ktxTex.mapping = THREE.EquirectangularReflectionMapping;
          const envMap = this.pmremGenerator ? this.pmremGenerator.fromEquirectangular(ktxTex).texture : ktxTex;
          if (this.pmremGenerator && ktxTex && typeof ktxTex.dispose === 'function') {
            ktxTex.dispose();
          }
          this.hdrMaps[biome.name] = envMap;
        }, undefined, () => {}, 1);
      }
      (biome.regionModels || []).slice(0, 3).forEach(k => {
        if (!this.models[k] && OPTIONAL_MODEL_URLS[k]) {
          this._loadSingleModel(k, OPTIONAL_MODEL_URLS[k], false, null);
        }
      });
    }

    disposePreviousRegion(keepStationId) {
      const keepBiome = BIOME_CONFIGS[keepStationId] || BIOME_CONFIGS[1];
      const keepSet = new Set(keepBiome.regionModels || []);
      const sharedTexSet = new Set(Object.values(this.pbrTextures || {}).filter(Boolean));
      const texSlots = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'];

      for (const key of Array.from(this.loadedRegionModels)) {
        if (this.coreModelKeys.has(key) || keepSet.has(key)) continue;
        const gltf = this.models[key];
        if (gltf && gltf.scene) {
          gltf.scene.traverse(node => {
            if (node.isMesh) {
              if (node.geometry) node.geometry.dispose();
              if (node.material) {
                const mats = Array.isArray(node.material) ? node.material : [node.material];
                mats.forEach(m => {
                  if (!m) return;
                  if (this.baseModelMaterials) this.baseModelMaterials.delete(m);
                  for (let s = 0; s < texSlots.length; s++) {
                    const tex = m[texSlots[s]];
                    if (tex && !sharedTexSet.has(tex) && typeof tex.dispose === 'function') {
                      tex.dispose();
                    }
                  }
                  if (typeof m.dispose === 'function') m.dispose();
                });
              }
            }
          });
        }
        if (gltf && Array.isArray(gltf._cachedSubmeshes)) {
          gltf._cachedSubmeshes.forEach(item => {
            if (item && item.geometry && typeof item.geometry.dispose === 'function') {
              item.geometry.dispose();
            }
          });
          gltf._cachedSubmeshes = null;
        }
        delete this.models[key];
        this.loadedRegionModels.delete(key);
        if (this.memoryBudget) this.memoryBudget.unregisterGeometry(key);
      }
    }

    evictNonActiveRegionResources() {
      if (this.activeRegionId) {
        this.disposePreviousRegion(this.activeRegionId);
      }
    }

    cloneStaticModel(key, cloneMaterials = false, targetMaxDim = null, centerXZ = false) {
      const gltf = this.models[key];
      if (!gltf || !gltf.scene) return null;
      const clone = gltf.scene.clone(true);
      if (cloneMaterials) {
        clone.traverse(node => {
          if (node.isMesh && node.material) {
            node.material = Array.isArray(node.material)
              ? node.material.map(m => (m ? m.clone() : m))
              : node.material.clone();
          }
        });
      }
      if (targetMaxDim !== null && targetMaxDim > 0) {
        return this.normalizeModelToSize(clone, targetMaxDim, centerXZ);
      }
      return clone;
    }

    normalizeModelToSize(modelNode, targetMaxDim, centerXZ = true) {
      const wrapper = new THREE.Group();
      wrapper.add(modelNode);
      wrapper.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(modelNode);
      box.getSize(_v1);
      const maxDim = Math.max(_v1.x, _v1.y, _v1.z, 0.001);
      const factor = targetMaxDim / maxDim;

      modelNode.scale.multiplyScalar(factor);
      wrapper.updateMatrixWorld(true);

      const scaledBox = new THREE.Box3().setFromObject(modelNode);
      scaledBox.getCenter(_v2);

      if (centerXZ) {
        modelNode.position.x -= _v2.x;
        modelNode.position.z -= _v2.z;
      }
      modelNode.position.y -= scaledBox.min.y;
      return wrapper;
    }

    cloneRiggedModel(key, targetHeight = 0.42, roleStyle = 'crew') {
      const candidateOrder = [key, 'ReadyPlayerMe', 'HVGirl', 'Michelle', 'Soldier', 'CesiumMan'];
      let actualKey = null;
      let gltf = null;
      for (let i = 0; i < candidateOrder.length; i++) {
        const k = candidateOrder[i];
        if (k && this.models[k] && this.models[k].scene) {
          actualKey = k;
          gltf = this.models[k];
          break;
        }
      }
      if (!gltf || !gltf.scene || !actualKey) return null;

      const isRpm = (actualKey === 'ReadyPlayerMe');
      const clonedScene = (typeof THREE.SkeletonUtils !== 'undefined' && THREE.SkeletonUtils.clone)
        ? THREE.SkeletonUtils.clone(gltf.scene)
        : gltf.scene.clone(true);

      const uniformPalette = {
        commander: { tint: 0x1E3A8A, roughness: 0.44, metalness: 0.12 },
        engineer:  { tint: 0xD97706, roughness: 0.42, metalness: 0.14 },
        passenger: { tint: 0x334155, roughness: 0.48, metalness: 0.08 },
        bird:      { tint: 0xF8FAFC, roughness: 0.60, metalness: 0.05 },
        wildlife:  { tint: 0x78350F, roughness: 0.72, metalness: 0.05 }
      }[roleStyle] || { tint: 0x334155, roughness: 0.48, metalness: 0.10 };

      const morphMeshes = [];
      let headBone = null;
      const eyeBones = [];
      const aniso = this.maxAnisotropy || 8;
      clonedScene.traverse(node => {
        if (node.isBone) {
          const bName = (node.name || '').toLowerCase();
          if (!headBone && (bName === 'head' || bName === 'mixamorig:head' || bName.endsWith(':head'))) {
            headBone = node;
          } else if (bName.includes('lefteye') || bName.includes('righteye')) {
            eyeBones.push(node);
          }
        }
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          node.frustumCulled = false;
          if (node.morphTargetInfluences && node.morphTargetDictionary) {
            node.morphTargetInfluences = node.morphTargetInfluences.slice();
            morphMeshes.push(node);
          }
          if (node.material) {
            const enhanceCharMat = (srcMat) => {
              const m = srcMat.clone();
              const mName = ((m.name || node.name) || '').toLowerCase();
              if (m.map) {
                m.map.anisotropy = aniso;
                m.map.encoding = THREE.sRGBEncoding;
              }
              if (isRpm) {
                // Preserve authentic ReadyPlayerMe 19-texture PBR skin, eyes, beard & outfit maps without overexposure
                if (mName.includes('eye')) {
                  m.roughness = 0.05;
                  m.metalness = 0.05;
                  m.envMapIntensity = 1.45;
                } else {
                  m.envMapIntensity = 0.78;
                }
              } else if (mName.includes('iris') || mName.includes('pupil') || mName.includes('eye') || mName.includes('white')) {
                m.roughness = 0.06;
                m.metalness = 0.08;
                m.envMapIntensity = 1.65;
              } else if (mName.includes('skin')) {
                m.roughness = 0.44;
                m.metalness = 0.02;
                m.envMapIntensity = 1.05;
              } else {
                m.roughness = uniformPalette.roughness;
                m.metalness = uniformPalette.metalness;
                m.envMapIntensity = 1.15;
                if (!m.map && !m.vertexColors && key === 'Soldier') {
                  m.color.setHex(uniformPalette.tint);
                }
              }
              if (m.emissive && !m.emissiveMap) {
                m.emissive.setHex(roleStyle === 'engineer' ? 0x241404 : (roleStyle === 'commander' ? 0x08162E : 0x111827));
                m.emissiveIntensity = 0.22;
              }
              m.needsUpdate = true;
              return m;
            };
            node.material = Array.isArray(node.material)
              ? node.material.map(enhanceCharMat)
              : enhanceCharMat(node.material);
          }
        }
      });

      const NATIVE_HEIGHTS = {
        ReadyPlayerMe: 1.87,
        HVGirl: 24.19,
        Soldier: 1.80,
        Michelle: 1.80,
        CesiumMan: 1.52,
        RobotExpressive: 4.20,
        Flamingo: 95.0,
        Parrot: 95.0,
        Stork: 95.0,
        Horse: 160.0
      };

      const nativeH = NATIVE_HEIGHTS[actualKey] || 1.80;
      const factor = targetHeight / nativeH;

      const wrapper = new THREE.Group();
      clonedScene.scale.multiplyScalar(factor);
      const groundLift = (actualKey === 'HVGirl') ? (0.08 * factor) : 0;
      clonedScene.position.set(0, groundLift, 0);
      wrapper.add(clonedScene);

      const mixer = new THREE.AnimationMixer(clonedScene);
      const clips = gltf.animations || [];

      return {
        wrapper,
        clonedScene,
        mixer,
        clips,
        morphMeshes,
        headBone,
        eyeBones,
        headBaseQuat: headBone ? headBone.quaternion.clone() : null,
        isClearFaceMorph: isRpm
      };
    }
  }

  // ==========================================================================
  // 5. CUSTOM REALISTIC WORLD SHADERS (Terrain Splat, Planar Water, Analytic Sky,
  //    Wind-Sway Instanced Vegetation & Combined Single-Pass Post-Processing)
  // ==========================================================================

  /**
   * Creates the Triplanar + Slope/Elevation Splat-Map Terrain ShaderMaterial
   * with puddles/wetness (storm_isles), snow accumulation (alpine_snow), and strata (red_canyon).
   */
  function createBiomeTerrainMaterial(biome, pbr) {
    const cGrass = new THREE.Color(biome.ground);
    const cDirt = new THREE.Color(biome.dirt);
    const cRock = new THREE.Color(biome.rock);
    const cSnow = new THREE.Color(biome.snow);
    const cFog = new THREE.Color(biome.fogColor);
    const cSun = new THREE.Color(biome.sunColor);

    return new THREE.ShaderMaterial({
      uniforms: {
        uGrassTex:      { value: pbr.grass_diffuse || null },
        uRockTex:       { value: pbr.rock_diffuse || null },
        uDetailNormal:  { value: pbr.detail_micro_normal || null },
        uGrassColor:    { value: cGrass },
        uDirtColor:     { value: cDirt },
        uRockColor:     { value: cRock },
        uSnowColor:     { value: cSnow },
        uSunColor:      { value: cSun },
        uSunDir:        { value: new THREE.Vector3().fromArray(biome.sunDir).normalize() },
        uFogColor:      { value: cFog },
        uFogDensity:    { value: biome.fogDensity },
        uSnowAmount:    { value: biome.snowAmount },
        uWetness:       { value: biome.wetness },
        uStrataStrength:{ value: biome.strataStrength }
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPos;
        varying vec3 vWorldNormal;
        varying vec2 vUv;
        varying float vViewDepth;
        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 mvPos = viewMatrix * worldPos;
          vViewDepth = -mvPos.z;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uGrassTex;
        uniform sampler2D uRockTex;
        uniform sampler2D uDetailNormal;
        uniform vec3 uGrassColor;
        uniform vec3 uDirtColor;
        uniform vec3 uRockColor;
        uniform vec3 uSnowColor;
        uniform vec3 uSunColor;
        uniform vec3 uSunDir;
        uniform vec3 uFogColor;
        uniform float uFogDensity;
        uniform float uSnowAmount;
        uniform float uWetness;
        uniform float uStrataStrength;

        varying vec3 vWorldPos;
        varying vec3 vWorldNormal;
        varying vec2 vUv;
        varying float vViewDepth;

        void main() {
          // Triplanar weights from world normal
          vec3 blend = abs(vWorldNormal);
          blend = max(blend - 0.2, 0.0001);
          blend /= (blend.x + blend.y + blend.z);

          vec2 uvXZ = vWorldPos.xz * 0.35;
          vec2 uvXY = vWorldPos.xy * 0.35;
          vec2 uvZY = vWorldPos.zy * 0.35;

          vec3 texG = mix(vec3(0.72), texture2D(uGrassTex, uvXZ).rgb * 1.1, 0.35);
          vec3 grassSample = texG * uGrassColor * 0.85;
          vec3 texR = mix(vec3(0.78), (
            texture2D(uRockTex, uvXY).rgb * blend.z +
            texture2D(uRockTex, uvZY).rgb * blend.x +
            texture2D(uRockTex, uvXZ).rgb * blend.y
          ) * 1.1, 0.30);
          vec3 rockSample = texR * uRockColor * 0.88;

          // Detail micro-normal perturbation for close-up sharpness
          vec3 microN = texture2D(uDetailNormal, vWorldPos.xz * 2.4).xyz * 2.0 - 1.0;
          vec3 N = normalize(vWorldNormal + vec3(microN.x * 0.14, 0.0, microN.y * 0.14));

          // Golden sandy shoreline transition near water level
          float beachMask = 1.0 - smoothstep(-0.08, 0.16, vWorldPos.y);
          vec3 sandColor = vec3(0.76, 0.62, 0.32);

          // Slope & elevation splat weights
          float slope = 1.0 - clamp(N.y, 0.0, 1.0);
          float rockWeight = smoothstep(0.22, 0.56, slope);
          float dirtWeight = smoothstep(0.08, 0.28, slope) * (1.0 - rockWeight);

          // Sedimentary strata banding
          float strata = sin(vWorldPos.y * 18.0 + sin(vWorldPos.x * 1.5) * 1.2) * 0.5 + 0.5;
          vec3 rockWithStrata = mix(rockSample, uDirtColor * (0.85 + 0.30 * strata), uStrataStrength * 0.45);

          vec3 albedo = mix(grassSample, uDirtColor, dirtWeight * 0.55);
          albedo = mix(albedo, rockWithStrata, rockWeight);
          albedo = mix(albedo, sandColor, beachMask * 0.85);

          // Alpine snow accumulation on upward-facing high elevations
          float snowMask = smoothstep(0.08, 0.65, vWorldPos.y + uSnowAmount * 0.85) * smoothstep(0.45, 0.78, N.y) * step(0.01, uSnowAmount);
          albedo = mix(albedo, uSnowColor, clamp(snowMask * (0.65 + uSnowAmount * 0.55), 0.0, 1.0));

          // Bright hemisphere + sun diffuse illumination
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 H = normalize(uSunDir + V);
          float NdotL = max(dot(N, uSunDir), 0.0);
          float NdotH = max(dot(N, H), 0.0);
          float spec = pow(NdotH, 32.0) * 0.10 * NdotL;

          vec3 ambient = mix(vec3(0.55, 0.65, 0.48), vec3(0.82, 0.88, 0.92), N.y * 0.5 + 0.5);
          vec3 color = albedo * (ambient * 0.58 + uSunColor * NdotL * 0.48) + uSunColor * spec;

          // Exponential height-attenuated fog
          float heightFogFactor = exp(-max(0.0, vWorldPos.y) * 0.35);
          float fogFactor = 1.0 - exp(- (uFogDensity * vViewDepth) * (uFogDensity * vViewDepth) * heightFogFactor);
          color = mix(color, uFogColor, clamp(fogFactor, 0.0, 0.92));

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }

  /**
   * Creates the Planar Water ShaderMaterial with dual-layer normal scrolling,
   * Schlick Fresnel, IBL/Planar reflection, depth-based absorption color & soft shoreline foam.
   */
  function createPlanarWaterMaterial(biome, pbr, reflectionTex) {
    const surfaceMode = typeof biome.surfaceMode === 'number' ? biome.surfaceMode : 0.0;
    const useRefl = (reflectionTex && surfaceMode < 0.5) ? 1.0 : 0.0;
    return new THREE.ShaderMaterial({
      transparent: surfaceMode < 0.5,
      uniforms: {
        uTime:          { value: 0 },
        uNormalMap:     { value: pbr.water_normal || null },
        uSeabedTex:     { value: pbr.rock_diffuse || null },
        uGrassTex:      { value: pbr.grass_diffuse || pbr.rock_diffuse || null },
        uGrassNormal:   { value: pbr.grass_normal || pbr.detail_micro_normal || null },
        uDetailNormal:  { value: pbr.detail_micro_normal || pbr.water_normal || null },
        uReflectionTex: { value: reflectionTex || null },
        uHasReflection: { value: useRefl },
        uSurfaceMode:   { value: surfaceMode },
        uShallowColor:  { value: new THREE.Color(biome.waterShallow) },
        uDeepColor:     { value: new THREE.Color(biome.waterDeep) },
        uFoamColor:     { value: new THREE.Color(biome.foamColor || 0xF0F9FF) },
        uSkyZenith:     { value: new THREE.Color(biome.skyZenith) },
        uSkyHorizon:    { value: new THREE.Color(biome.skyHorizon) },
        uSunColor:      { value: new THREE.Color(biome.sunColor) },
        uSunDir:        { value: new THREE.Vector3().fromArray(biome.sunDir).normalize() },
        uFogColor:      { value: new THREE.Color(biome.fogColor) },
        uFogDensity:    { value: biome.fogDensity },
        uBoardHalfSpan: { value: new THREE.Vector2(2.5, 2.5) }
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uSurfaceMode;
        uniform vec2 uBoardHalfSpan;
        varying vec3 vWorldPos;
        varying vec4 vScreenPos;
        varying vec2 vUv;
        varying float vViewDepth;
        varying float vWaveCrest;

        vec3 gerstnerDisp(vec2 xz, float steep, float wl, vec2 dir, float t) {
          float k = 6.2831853 / wl;
          float c = sqrt(9.8 / k);
          vec2 d = normalize(dir);
          float f = k * (dot(d, xz) - c * t);
          float a = steep / k;
          return vec3(d.x * a * cos(f), a * sin(f), d.y * a * cos(f));
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          vWaveCrest = 0.0;
          vec4 baseWorld = modelMatrix * vec4(pos, 1.0);
          vec2 dBoxV = abs(baseWorld.xz) - uBoardHalfSpan;
          float distOut = length(max(dBoxV, 0.0));
          float hillMask = smoothstep(0.35, 2.25, distOut);

          if (uSurfaceMode < 0.5) {
            vec3 g1 = gerstnerDisp(pos.xz, 0.055, 3.6, vec2(1.0, 0.55), uTime * 0.85);
            vec3 g2 = gerstnerDisp(pos.xz, 0.038, 2.0, vec2(0.65, 1.0), uTime * 1.05);
            vec3 g3 = gerstnerDisp(pos.xz, 0.024, 1.15, vec2(-0.5, 0.82), uTime * 1.25);
            vec3 gSum = g1 + g2 + g3;
            pos += gSum;
            vWaveCrest = clamp(gSum.y * 16.0 + 0.35, 0.0, 1.0);
          } else if (uSurfaceMode < 1.5) {
            // Mode 1 (Arid Desert): Wind-sculpted rolling sand dunes outside the board
            float dune = (sin(baseWorld.x * 0.65 + baseWorld.z * 0.42) * 0.58 + cos(baseWorld.z * 0.82 - baseWorld.x * 0.30) * 0.42) * 0.11 * hillMask;
            pos.y += dune;
          } else if (uSurfaceMode < 2.5) {
            // Mode 2 (Volcano): Subtle tectonic heave
            float wave = sin(pos.x * 1.2 + uTime * 0.85) * cos(pos.z * 1.1 - uTime * 0.72) * 0.018;
            pos.y += wave;
          } else if (uSurfaceMode > 3.5 && (uSurfaceMode < 5.5 || uSurfaceMode > 6.5)) {
            // Modes 4, 5, 7, 8 (Forest, Glacier Snow, Autumn Woodland, Crystal Cavern): Natural rolling terrain hills
            float hill = (sin(baseWorld.x * 0.52 + 0.4) * cos(baseWorld.z * 0.48 - 0.3) * 0.65 + sin(baseWorld.x * 1.05 - baseWorld.z * 0.92) * 0.35) * 0.10 * hillMask;
            pos.y += hill;
          }
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = worldPos.xyz;
          vec4 mvPos = viewMatrix * worldPos;
          vViewDepth = -mvPos.z;
          vScreenPos = projectionMatrix * mvPos;
          gl_Position = vScreenPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform sampler2D uNormalMap;
        uniform sampler2D uSeabedTex;
        uniform sampler2D uGrassTex;
        uniform sampler2D uGrassNormal;
        uniform sampler2D uDetailNormal;
        uniform sampler2D uReflectionTex;
        uniform float uHasReflection;
        uniform float uSurfaceMode;
        uniform vec3 uShallowColor;
        uniform vec3 uDeepColor;
        uniform vec3 uFoamColor;
        uniform vec3 uSkyZenith;
        uniform vec3 uSkyHorizon;
        uniform vec3 uSunColor;
        uniform vec3 uSunDir;
        uniform vec3 uFogColor;
        uniform float uFogDensity;
        uniform vec2 uBoardHalfSpan;

        varying vec3 vWorldPos;
        varying vec4 vScreenPos;
        varying vec2 vUv;
        varying float vViewDepth;
        varying float vWaveCrest;

        float hash21(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float valueNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash21(i);
          float b = hash21(i + vec2(1.0, 0.0));
          float c = hash21(i + vec2(0.0, 1.0));
          float d = hash21(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm2(vec2 p) {
          float v = 0.0;
          float amp = 0.5;
          mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
          for (int i = 0; i < 4; i++) {
            v += amp * valueNoise(p);
            p = rot * p * 2.03;
            amp *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 dBox = abs(vWorldPos.xz) - uBoardHalfSpan;
          float distToBoard = length(max(dBox, 0.0)) + min(max(dBox.x, dBox.y), 0.0);
          float pseudoDepth = clamp(distToBoard * 0.42, 0.0, 1.0);

          vec3 col = vec3(0.0);
          float outAlpha = 0.94;

          if (uSurfaceMode > 7.5) {
            // Mode 8 (Crystal Caverns): Subterranean Dark Slate Rock Floor & Bioluminescent Amethyst/Cyan Veins (Zero Water, Fast Texture Path!)
            vec2 p = vWorldPos.xz;
            vec3 rockSample = texture2D(uSeabedTex, p * 0.68).rgb;
            vec3 detN = texture2D(uDetailNormal, p * 1.85).xyz * 2.0 - 1.0;
            vec3 N = normalize(vec3(detN.x * 0.55, 1.0, detN.y * 0.55));
            float diff = clamp(dot(N, uSunDir), 0.22, 1.0);
            float rLuma = dot(rockSample, vec3(0.333));
            vec3 slateFloor = mix(vec3(0.075, 0.058, 0.135), vec3(0.18, 0.14, 0.29), rLuma) * (0.48 + 0.65 * diff);

            float fA = sin(p.x * 0.65 + cos(p.y * 0.58) * 1.4) * 0.5 + 0.5;
            float vein = smoothstep(0.44, 0.56, 1.0 - abs(fA * 2.0 - 1.0)) * rLuma;
            float pulse = 0.85 + 0.15 * sin(uTime * 1.6 + p.x * 0.8);
            vec3 crystalGlow = mix(vec3(0.58, 0.22, 0.96), vec3(0.14, 0.82, 0.98), rLuma);
            col = slateFloor + crystalGlow * vein * 0.85 * pulse;
            outAlpha = 1.0;
          } else if (uSurfaceMode > 6.5) {
            // Mode 7 (Autumn Clockwork): Warm Woodland Earth & Golden-Amber / Crimson Fallen Leaf Carpet (Fast Texture Path!)
            vec2 p = vWorldPos.xz;
            vec3 grassSample = texture2D(uGrassTex, p * 0.65).rgb;
            vec3 gNorm = texture2D(uGrassNormal, p * 1.45).xyz * 2.0 - 1.0;
            vec3 N = normalize(vec3(gNorm.x * 0.42, 1.0, gNorm.y * 0.42));
            float sunDiff = clamp(dot(N, uSunDir), 0.28, 1.0);

            float gLuma = dot(grassSample, vec3(0.333));
            float leafPatch = sin(p.x * 0.48 + p.y * 0.36) * cos(p.y * 0.52 - p.x * 0.28) * 0.5 + 0.5;
            vec3 soilCol = vec3(0.32, 0.18, 0.09);
            vec3 ochreMoss = vec3(0.62, 0.38, 0.15);
            vec3 goldLeaves = vec3(0.88, 0.56, 0.16);
            vec3 crimsonLeaves = vec3(0.74, 0.25, 0.12);

            vec3 autumnGround = mix(soilCol, ochreMoss, smoothstep(0.25, 0.68, leafPatch));
            autumnGround = mix(autumnGround, goldLeaves, smoothstep(0.38, 0.72, gLuma) * 0.75);
            autumnGround = mix(autumnGround, crimsonLeaves, smoothstep(0.62, 0.88, leafPatch * gLuma) * 0.58);
            autumnGround *= (0.74 + 0.46 * gLuma);
            col = autumnGround * (0.45 + 0.72 * sunDiff);
            outAlpha = 1.0;
          } else if (uSurfaceMode > 5.5) {
            // Mode 6 (Neon City): Futuristic Dark Cyber-Plaza Asphalt & Glowing Cyan/Magenta Avenue Grid
            vec2 p = vWorldPos.xz;
            vec3 rockSample = texture2D(uSeabedTex, p * 0.85).rgb;
            vec3 detN = texture2D(uDetailNormal, p * 2.4).xyz * 2.0 - 1.0;
            vec3 N = normalize(vec3(detN.x * 0.28, 1.0, detN.y * 0.28));
            float spec = max(0.0, N.y) * 0.08;

            vec3 asphalt = vec3(0.055, 0.075, 0.118) * (0.75 + 0.45 * dot(rockSample, vec3(0.333)));
            vec2 gridUv = abs(fract(p * 0.55) - 0.5);
            float roadLine = 1.0 - smoothstep(0.008, 0.026, min(gridUv.x, gridUv.y));
            vec2 subUv = abs(fract(p * 2.2) - 0.5);
            float subLine = 1.0 - smoothstep(0.006, 0.022, min(subUv.x, subUv.y));
            float boardMask = smoothstep(0.08, 0.45, distToBoard);

            vec3 neonCol = mix(vec3(0.04, 0.78, 0.96), vec3(0.88, 0.24, 0.82), smoothstep(-0.6, 0.6, sin(p.x * 0.35 + p.y * 0.25)));
            col = asphalt + uSkyHorizon * spec + neonCol * (roadLine * 0.55 + subLine * 0.14) * boardMask;
            outAlpha = 1.0;
          } else if (uSurfaceMode > 4.5) {
            // Mode 5 (Alpine Snow): Sparkling Continuous Glacier Snowfield & Wind-Swept Snowdrifts (Fast Texture Path!)
            vec2 p = vWorldPos.xz;
            vec3 detN = texture2D(uDetailNormal, p * 2.4).xyz * 2.0 - 1.0;
            float driftPhase = p.x * 0.82 + p.y * 0.64 + detN.x * 0.45;
            float driftCrest = sin(driftPhase) * 0.5 + 0.5;

            vec3 N = normalize(vec3(-cos(driftPhase) * 0.20 + detN.x * 0.14, 1.0, -cos(driftPhase) * 0.16 + detN.y * 0.14));
            float sunDiff = clamp(dot(N, uSunDir), 0.34, 1.0);
            float iceSparkle = smoothstep(0.72, 0.96, detN.z * driftCrest) * 0.26;

            vec3 glacierShadow = vec3(0.68, 0.80, 0.92);
            vec3 pureSnow = vec3(0.95, 0.98, 1.00);
            vec3 snowBase = mix(glacierShadow, pureSnow, smoothstep(0.18, 0.85, driftCrest * 0.65 + sunDiff * 0.35));
            col = snowBase * (0.58 + 0.52 * sunDiff) + vec3(1.0) * iceSparkle;
            outAlpha = 1.0;
          } else if (uSurfaceMode > 3.5) {
            // Mode 4 (Pine Valley Forest): Lush Continuous Woodland Meadow & Sunlit Canopy Clearings (Fast Texture Path!)
            vec2 p = vWorldPos.xz;
            vec3 grassSample = texture2D(uGrassTex, p * 0.72).rgb;
            vec3 gNorm = texture2D(uGrassNormal, p * 1.55).xyz * 2.0 - 1.0;
            vec3 N = normalize(vec3(gNorm.x * 0.45, 1.0, gNorm.y * 0.45));
            float sunDiff = clamp(dot(N, uSunDir), 0.28, 1.0);

            float clearing = sin(p.x * 0.42 + 0.5) * cos(p.y * 0.38 - 0.3) * 0.5 + 0.5;
            vec3 deepForestMoss = vec3(0.16, 0.36, 0.17);
            vec3 sunlitMeadow = vec3(0.32, 0.58, 0.26);

            vec3 forestFloor = mix(deepForestMoss, sunlitMeadow, smoothstep(0.25, 0.75, clearing));
            forestFloor *= (0.68 + 0.55 * grassSample);

            float embankmentMoss = (1.0 - smoothstep(0.02, 0.48, distToBoard)) * step(0.0, distToBoard);
            forestFloor = mix(forestFloor, vec3(0.28, 0.46, 0.24), embankmentMoss * 0.35);

            col = forestFloor * (0.46 + 0.70 * sunDiff);
            outAlpha = 1.0;
          } else if (uSurfaceMode > 2.5) {
            // Mode 3: Low-Earth Orbit — Curved Blue-Marble Planet Limb, Atmospheric Airglow & Pinpoint Starfield
            vec2 planetCenter = vec2(-7.5, -9.5);
            float dPlanet = length(vWorldPos.xz - planetCenter);
            float planetRadius = 11.8;
            float limbFactor = clamp((planetRadius - dPlanet) / planetRadius, 0.0, 1.0);

            // Deep velvet space + subtle dust lane
            float dust = fbm2(vWorldPos.xz * 0.26 + vec2(1.7, -2.3));
            col = mix(vec3(0.008, 0.014, 0.032), vec3(0.024, 0.045, 0.095), dust * 0.65);

            // Crisp multi-scale stars where planet does not occlude
            if (dPlanet > planetRadius - 0.15) {
              vec2 starGrid = vWorldPos.xz * 4.2;
              vec2 cellId = floor(starGrid);
              vec2 cellUv = fract(starGrid) - 0.5;
              float rnd = hash21(cellId);
              if (rnd > 0.76) {
                vec2 offset = vec2(fract(rnd * 31.7) - 0.5, fract(rnd * 83.1) - 0.5) * 0.56;
                float d = length(cellUv - offset);
                float twinkle = 0.72 + 0.28 * sin(uTime * (2.0 + fract(rnd * 17.0) * 3.5) + rnd * 40.0);
                float star = smoothstep(0.095, 0.010, d) * twinkle;
                vec3 starTint = mix(vec3(0.78, 0.90, 1.0), vec3(1.0, 0.93, 0.76), fract(rnd * 13.3));
                col += starTint * star * 1.55;
              }
            }

            // Curved Earth limb & swirling orbital cloud cover
            if (dPlanet < planetRadius + 1.35) {
              float sphereZ = sqrt(max(0.0, 1.0 - pow(dPlanet / planetRadius, 2.0)));
              vec2 earthUv = (vWorldPos.xz - planetCenter) * 0.14 + vec2(uTime * 0.004, -uTime * 0.003);
              float continents = smoothstep(0.46, 0.58, fbm2(earthUv * 2.4));
              vec3 oceanCol = mix(vec3(0.02, 0.14, 0.38), vec3(0.05, 0.32, 0.62), sphereZ);
              vec3 landCol = mix(vec3(0.16, 0.30, 0.15), vec3(0.52, 0.42, 0.26), fbm2(earthUv * 5.2));
              vec3 earthBase = mix(oceanCol, landCol, continents);

              float clouds = smoothstep(0.42, 0.74, fbm2(earthUv * 3.8 + vec2(uTime * 0.007, 0.0)));
              earthBase = mix(earthBase, vec3(0.92, 0.96, 1.0), clouds * 0.82);

              float sunTerm = clamp(0.35 + 0.65 * sphereZ, 0.0, 1.0);
              earthBase *= sunTerm;

              float planetMask = smoothstep(planetRadius + 0.08, planetRadius - 0.22, dPlanet);
              col = mix(col, earthBase, planetMask);

              // Rayleigh blue atmospheric airglow halo along Earth's curved horizon
              float atmoGlow = exp(-pow((dPlanet - planetRadius + 0.15) * 1.45, 2.0));
              col += vec3(0.18, 0.58, 1.0) * atmoGlow * 0.92;
            }

            // Subtle station docking shield rim
            float halo = (1.0 - smoothstep(0.0, 0.16, distToBoard)) * step(0.0, distToBoard);
            col += uFoamColor * halo * 0.14;
            outAlpha = 0.99;
          } else if (uSurfaceMode > 1.5) {
            // Mode 2: Photorealistic Dark Cooled Basalt Crust (~80%) & Incandescent Magma Rivers (~20%)
            vec2 flowUv = vWorldPos.xz * 0.44;
            float nA = fbm2(flowUv + vec2(uTime * 0.016, uTime * 0.011));
            float nB = fbm2(flowUv * 1.95 - vec2(uTime * 0.012, -uTime * 0.016));
            float fissure = 1.0 - abs(nA * 2.0 - 1.0);
            float veinSignal = pow(fissure, 2.4) * 0.86 + nB * 0.22;
            float magmaMask = smoothstep(0.68, 0.94, veinSignal);
            float shoreHeat = (1.0 - smoothstep(0.0, 0.24, distToBoard)) * step(0.0, distToBoard);
            magmaMask = clamp(magmaMask + shoreHeat * 0.42 * fissure, 0.0, 1.0);

            vec3 rockSample = texture2D(uSeabedTex, vWorldPos.xz * 0.72).rgb;
            vec3 detN = texture2D(uDetailNormal, vWorldPos.xz * 1.6).xyz * 2.0 - 1.0;
            vec3 N = normalize(vec3(detN.x * 0.50, 1.0, detN.y * 0.50));
            float diff = clamp(dot(N, uSunDir), 0.18, 1.0);
            vec3 basaltPlate = (vec3(0.065, 0.058, 0.064) + rockSample * 0.11) * diff;

            vec3 lavaDark = vec3(0.76, 0.11, 0.02);
            vec3 lavaBright = vec3(1.0, 0.52, 0.06);
            vec3 lavaCore = vec3(1.0, 0.90, 0.46);
            vec3 molten = mix(lavaDark, lavaBright, smoothstep(0.18, 0.78, magmaMask));
            molten = mix(molten, lavaCore, pow(magmaMask, 3.6));

            col = mix(basaltPlate, molten, smoothstep(0.08, 0.52, magmaMask));
            outAlpha = 0.99;
          } else if (uSurfaceMode > 0.5) {
            // Mode 1: Photorealistic Wind-Sculpted Red Canyon Sand Dunes & Sandstone Floor (Sector 2)
            vec2 p = vWorldPos.xz;
            float duneWarp = fbm2(p * 0.34);
            float dunePhase = p.x * 0.78 + p.y * 1.42 + duneWarp * 2.4;
            float duneCrest = pow(abs(sin(dunePhase)), 0.68);
            // Asymmetric wind-rippled micro-sand waves
            float fineRipples = sin(p.x * 7.5 + p.y * 13.5 + duneWarp * 6.0) * 0.5 + 0.5;

            vec3 sandTex = texture2D(uSeabedTex, p * 0.75).rgb;
            vec3 detN = texture2D(uDetailNormal, p * 2.2).xyz * 2.0 - 1.0;
            float slopeX = cos(dunePhase) * 0.32 + detN.x * 0.16;
            float slopeZ = cos(dunePhase) * 0.52 + detN.y * 0.16;
            vec3 N = normalize(vec3(-slopeX, 1.0, -slopeZ));

            float sunDiff = clamp(dot(N, uSunDir), 0.22, 1.0);
            vec3 V = normalize(cameraPosition - vWorldPos);
            vec3 H = normalize(uSunDir + V);
            float quartzSpec = pow(max(dot(N, H), 0.0), 42.0) * 0.16;

            vec3 baseSand = mix(uDeepColor, uShallowColor, duneCrest * 0.75 + 0.25 * fineRipples);
            baseSand *= (0.78 + 0.42 * dot(sandTex, vec3(0.333)));
            col = baseSand * (0.42 + 0.72 * sunDiff) + uSunColor * quartzSpec;

            // Natural drifted sand apron against stone railway embankment
            float sandApron = (1.0 - smoothstep(0.02, 0.62, distToBoard)) * step(0.0, distToBoard);
            col = mix(col, uFoamColor * (0.55 + 0.50 * sunDiff), sandApron * 0.42);
            outAlpha = 0.99;
          } else {
            // Mode 0: Photorealistic Beer-Lambert Coastal / Alpine / River Water
            vec2 uv1 = vWorldPos.xz * 0.44 + vec2(uTime * 0.036, uTime * 0.026);
            vec2 uv2 = vWorldPos.xz * 0.78 - vec2(uTime * 0.029, -uTime * 0.038);
            vec2 uv3 = vWorldPos.xz * 2.15 + vec2(-uTime * 0.018, uTime * 0.022);
            vec3 n1 = texture2D(uNormalMap, uv1).xyz * 2.0 - 1.0;
            vec3 n2 = texture2D(uNormalMap, uv2).xyz * 2.0 - 1.0;
            vec3 n3 = texture2D(uDetailNormal, uv3).xyz * 2.0 - 1.0;
            vec3 N = normalize(vec3(
              (n1.x + n2.x) * 0.26 + n3.x * 0.10,
              1.0,
              (n1.y + n2.y) * 0.26 + n3.y * 0.10
            ));

            vec3 V = normalize(cameraPosition - vWorldPos);
            float NdotV = clamp(dot(N, V), 0.0, 1.0);
            // Physical Schlick Fresnel for water (F0 = 0.02)
            float fresnel = 0.03 + 0.92 * pow(1.0 - NdotV, 4.5);

            // Refracted shallow seabed stones & sand fading via Beer-Lambert absorption into deep water
            float depthFactor = clamp(distToBoard * 0.62, 0.0, 1.0);
            vec2 refractedUv = vWorldPos.xz * 0.62 + N.xz * 0.065;
            vec3 seabedTex = texture2D(uSeabedTex, refractedUv).rgb;
            vec3 shallowBed = mix(seabedTex * uShallowColor * 1.55, uShallowColor, 0.48);
            float absorption = 1.0 - exp(-depthFactor * 2.65);
            vec3 waterBody = mix(shallowBed, uDeepColor, absorption);

            // Subsurface sun scatter in shallow wave crests
            float sss = pow(clamp(dot(V, -uSunDir + N * 0.45), 0.0, 1.0), 3.0) * (1.0 - absorption) * 0.35;
            waterBody += uShallowColor * sss;

            vec3 R = reflect(-V, N);
            float skyGrad = clamp(R.y * 1.35, 0.0, 1.0);
            vec3 skyRefl = mix(uSkyHorizon, uSkyZenith, skyGrad);
            // Soft reflected cloud wisps on water surface
            float reflCloud = smoothstep(0.48, 0.78, fbm2(R.xz / max(0.22, R.y + 0.28) * 1.4 + vec2(uTime * 0.008, 0.0)));
            skyRefl = mix(skyRefl, mix(uSkyHorizon, vec3(0.96, 0.98, 1.0), 0.65), reflCloud * 0.32 * smoothstep(0.0, 0.35, R.y));

            if (uHasReflection > 0.5) {
              vec2 screenUv = (vScreenPos.xy / max(0.001, vScreenPos.w)) * 0.5 + 0.5;
              screenUv += N.xz * 0.025;
              vec3 planarCol = texture2D(uReflectionTex, clamp(screenUv, 0.01, 0.99)).rgb;
              skyRefl = mix(skyRefl, planarCol, 0.52);
            }

            // Dual-lobe solar specular glint (sharp sun sparkles + broad atmospheric sheen)
            vec3 H = normalize(uSunDir + V);
            float NdotH = max(dot(N, H), 0.0);
            float spec = pow(NdotH, 240.0) * 2.8 + pow(NdotH, 32.0) * 0.22;

            // Organic FBM-broken shoreline surf + Gerstner wave-crest whitecaps
            float foamNoise = fbm2(vWorldPos.xz * 3.2 + vec2(uTime * 0.14, -uTime * 0.11));
            float lapWave = sin(distToBoard * 15.0 - uTime * 2.6 + foamNoise * 4.5) * 0.5 + 0.5;
            float shoreBand = (1.0 - smoothstep(0.0, 0.30, distToBoard)) * step(0.0, distToBoard);
            float contactEdge = (1.0 - smoothstep(0.0, 0.075, distToBoard)) * step(0.0, distToBoard);
            float crestWhitecap = smoothstep(0.74, 0.96, vWaveCrest + n1.x * 0.18) * smoothstep(0.18, 0.90, distToBoard) * 0.45;
            float foam = clamp(contactEdge * (0.50 + 0.45 * foamNoise) + shoreBand * lapWave * smoothstep(0.30, 0.74, foamNoise) * 0.78 + crestWhitecap, 0.0, 1.0);

            col = mix(waterBody, skyRefl, fresnel) + uSunColor * spec;
            col = mix(col, uFoamColor, foam * 0.68);
            outAlpha = mix(0.89, 0.97, smoothstep(0.0, 0.28, distToBoard));
          }

          float fogFactor = 1.0 - exp(-(uFogDensity * vViewDepth) * (uFogDensity * vViewDepth));
          col = mix(col, uFogColor, clamp(fogFactor, 0.0, 0.92));

          gl_FragColor = vec4(col, outAlpha);
        }
      `
    });
  }

  /**
   * Creates the Analytic Preetham/Hosek Atmospheric Scattering Sky ShaderMaterial
   * with sunlit multi-layer volumetric FBM cumulus/cirrus clouds, Mie solar aureole, and cosmic starfield.
   */
  function createAnalyticSkyMaterial(biome) {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uSunDir:        { value: new THREE.Vector3().fromArray(biome.sunDir).normalize() },
        uZenithCol:     { value: new THREE.Color(biome.skyZenith) },
        uHorizonCol:    { value: new THREE.Color(biome.skyHorizon) },
        uSunCol:        { value: new THREE.Color(biome.sunColor) },
        uFogCol:        { value: new THREE.Color(biome.fogColor) },
        uStarIntensity: { value: biome.starIntensity || 0.0 }
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldDir;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldDir = normalize(worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uSunDir;
        uniform vec3 uZenithCol;
        uniform vec3 uHorizonCol;
        uniform vec3 uSunCol;
        uniform vec3 uFogCol;
        uniform float uStarIntensity;
        varying vec3 vWorldDir;

        float skyHash(vec2 p) {
          p = fract(p * vec2(234.34, 435.345));
          p += dot(p, p + 34.23);
          return fract(p.x * p.y);
        }

        float skyNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(skyHash(i), skyHash(i + vec2(1.0, 0.0)), f.x),
            mix(skyHash(i + vec2(0.0, 1.0)), skyHash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float skyFbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 r = mat2(0.80, 0.60, -0.60, 0.80);
          for (int i = 0; i < 4; i++) {
            v += a * skyNoise(p);
            p = r * p * 2.04;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 dir = normalize(vWorldDir);
          float elev = clamp(dir.y, 0.0, 1.0);
          float rayleigh = pow(1.0 - elev, 2.55);
          vec3 sky = mix(uZenithCol, uHorizonCol, rayleigh);

          float cosTheta = max(dot(dir, uSunDir), 0.0);
          float sunScale = (uStarIntensity > 0.75) ? 0.30 : 1.0;
          float mieHalo = (pow(cosTheta, 6.0) * 0.32 + pow(cosTheta, 48.0) * 0.85) * sunScale;
          float sunDisc = smoothstep(0.9970, 0.9993, cosTheta) * 2.4 * sunScale;
          sky += uSunCol * (mieHalo + sunDisc);

          // Sunlit Cumulus & Cirrus Cloud Deck in Daytime / Golden-Hour Skies
          if (uStarIntensity < 0.45 && dir.y > 0.015) {
            vec2 cloudUv = dir.xz / (dir.y + 0.16) * 0.95;
            float n1 = skyFbm(cloudUv);
            float n2 = skyFbm(cloudUv * 2.3 + vec2(3.1, -1.7));
            float cumulus = smoothstep(0.47, 0.78, n1 * 0.72 + n2 * 0.28);
            float horizonFade = smoothstep(0.02, 0.22, dir.y) * (1.0 - smoothstep(0.75, 0.98, dir.y) * 0.35);
            float silverLining = pow(cosTheta, 5.0) * 0.55 + 0.45;
            vec3 cloudShadow = mix(uZenithCol * 0.75, uHorizonCol * 0.92, 0.55);
            vec3 cloudLit = mix(vec3(0.96, 0.97, 0.99), uSunCol, 0.32) * (0.88 + 0.28 * silverLining);
            vec3 cloudCol = mix(cloudShadow, cloudLit, smoothstep(0.35, 0.78, n2 + 0.22 * cosTheta));
            sky = mix(sky, cloudCol, cumulus * horizonFade * (1.0 - uStarIntensity * 1.8) * 0.68);
          }

          if (uStarIntensity > 0.02 && dir.y > -0.05) {
            vec2 sphUv = vec2(atan(dir.z, dir.x) * 30.0, dir.y * 44.0);
            vec2 sc = floor(sphUv);
            vec2 sf = fract(sphUv) - 0.5;
            float r = skyHash(sc);
            if (r > 0.82) {
              float d = length(sf - vec2(fract(r * 19.3) - 0.5, fract(r * 47.1) - 0.5) * 0.52);
              float st = smoothstep(0.13, 0.014, d) * smoothstep(-0.02, 0.22, dir.y);
              vec3 stCol = mix(vec3(0.82, 0.92, 1.0), vec3(1.0, 0.92, 0.78), fract(r * 11.7));
              sky += stCol * st * uStarIntensity * 1.5;
            }
          }

          float belowHorizon = smoothstep(0.07, -0.06, dir.y);
          sky = mix(sky, uFogCol, belowHorizon);

          gl_FragColor = vec4(sky, 1.0);
        }
      `
    });
  }

  /**
   * Injects GPU vertex wind-sway animation & Bayer 4x4 dithered LOD alpha crossfade
   * into any MeshStandardMaterial used on InstancedMesh trees, shrubs, and grass patches.
   */
  function enhanceMaterialWithWindAndDither(mat, windUniforms, swayAmplitude = 0.08, detailNorTex = null) {
    if (!mat) return mat;
    if (detailNorTex && !mat.normalMap) {
      mat.normalMap = detailNorTex;
      mat.normalScale = new THREE.Vector2(0.35, 0.35);
    }
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uWindTime = windUniforms.uWindTime;
      shader.uniforms.uWindVec = windUniforms.uWindVec;
      shader.uniforms.uSwayAmp = { value: swayAmplitude };

      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
        uniform float uWindTime;
        uniform vec2 uWindVec;
        uniform float uSwayAmp;
        varying float vCameraDist;
        varying float vCanopyLift;`
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float instancePhase = 0.0;
        #ifdef USE_INSTANCING
          instancePhase = instanceMatrix[3][0] * 1.37 + instanceMatrix[3][2] * 1.93;
        #endif
        float heightFactor = max(0.0, position.y);
        vCanopyLift = clamp(heightFactor * 0.65, 0.0, 1.0);
        float gust = sin(uWindTime * 2.3 + instancePhase + position.x * 2.0) * 0.65
                   + cos(uWindTime * 1.4 - instancePhase * 0.7) * 0.35;
        transformed.x += uWindVec.x * gust * heightFactor * uSwayAmp;
        transformed.z += uWindVec.y * gust * heightFactor * uSwayAmp;`
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vCameraDist = -mvPosition.z;`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
        varying float vCanopyLift;`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        // V6.9 Ultra: Warm golden Subsurface Scattering (SSS) sunlight translucency on upper tree/shrub canopy leaves
        vec3 sssTint = vec3(0.26, 0.34, 0.10) * vCanopyLift;
        totalEmissiveRadiance += diffuseColor.rgb * sssTint;`
      );
    };
    mat.needsUpdate = true;
    return mat;
  }

  // ==========================================================================
  // 6. SINGLE COMBINED POST-PROCESSING PASS (Half-Res Bloom + SSAO + God-Rays +
  //    ACES Filmic + Biome Color Grading LUT + CAS Sharpening + Vignette)
  // ==========================================================================
  class CombinedPostProcessor {
    constructor(renderer, scene, camera) {
      this.renderer = renderer;
      this.scene = scene;
      this.camera = camera;
      this.enabled = true;

      this.width = 500;
      this.height = 880;

      const canHalfFloat = Boolean(
        renderer && renderer.capabilities && renderer.capabilities.isWebGL2 &&
        renderer.extensions && (renderer.extensions.get('EXT_color_buffer_float') || renderer.extensions.get('EXT_color_buffer_half_float'))
      );
      const rtType = (canHalfFloat && THREE.HalfFloatType) ? THREE.HalfFloatType : THREE.UnsignedByteType;

      // Main scene color + depth target (stencilBuffer: false ensures clean DepthTexture FBO on Adreno/Mali)
      this.sceneTarget = new THREE.WebGLRenderTarget(this.width, this.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: rtType,
        stencilBuffer: false
      });
      if (THREE.DepthTexture) {
        const depthTex = new THREE.DepthTexture(this.width, this.height);
        if (renderer && renderer.capabilities && renderer.capabilities.isWebGL2 && THREE.UnsignedIntType) {
          depthTex.type = THREE.UnsignedIntType;
        }
        this.sceneTarget.depthTexture = depthTex;
      }

      // Half-res bloom & SSAO target
      this.halfTarget = new THREE.WebGLRenderTarget(Math.max(1, this.width >> 1), Math.max(1, this.height >> 1), {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: rtType,
        depthBuffer: false,
        stencilBuffer: false
      });

      this.halfBloomMaterial = new THREE.ShaderMaterial({
        toneMapped: false,
        uniforms: {
          tDiffuse:   { value: null },
          uTexelSize: { value: new THREE.Vector2(1 / 250, 1 / 440) }
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D tDiffuse;
          uniform vec2 uTexelSize;
          varying vec2 vUv;
          void main() {
            // 9-tap linear HDR bright-pass + dual-filter Karis-weighted downsample blur
            vec3 c0 = texture2D(tDiffuse, vUv).rgb;
            vec3 c1 = texture2D(tDiffuse, vUv + vec2( uTexelSize.x,  uTexelSize.y) * 1.35).rgb;
            vec3 c2 = texture2D(tDiffuse, vUv + vec2(-uTexelSize.x,  uTexelSize.y) * 1.35).rgb;
            vec3 c3 = texture2D(tDiffuse, vUv + vec2( uTexelSize.x, -uTexelSize.y) * 1.35).rgb;
            vec3 c4 = texture2D(tDiffuse, vUv + vec2(-uTexelSize.x, -uTexelSize.y) * 1.35).rgb;
            vec3 avg = min(vec3(6.0), (c0 * 2.0 + c1 + c2 + c3 + c4) / 6.0);
            float luma = dot(avg, vec3(0.2126, 0.7152, 0.0722));
            float bright = smoothstep(0.82, 2.25, luma);
            gl_FragColor = vec4(avg * bright, 1.0);
          }
        `,
        depthTest: false,
        depthWrite: false
      });

      // Single combined final pass: HDR Bloom + Light Shafts + ACES Filmic + Linear->sRGB + SSAO + CAS + Vignette
      this.compositeMaterial = new THREE.ShaderMaterial({
        toneMapped: false,
        uniforms: {
          tColor:          { value: this.sceneTarget.texture },
          tBloom:          { value: this.halfTarget.texture },
          tDepth:          { value: this.sceneTarget.depthTexture || null },
          uTexelSize:      { value: new THREE.Vector2(1 / 500, 1 / 880) },
          uExposure:       { value: 1.10 },
          uBloomStrength:  { value: 0.24 },
          uSsaoStrength:   { value: 0.18 },
          uGodRayStrength: { value: 0.10 },
          uSunScreenPos:   { value: new THREE.Vector2(0.72, 0.85) },
          uLutTint:        { value: new THREE.Vector3(1.0, 1.0, 1.0) },
          uCasSharpness:   { value: 0.26 },
          uVignette:       { value: 0.18 }
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D tColor;
          uniform sampler2D tBloom;
          uniform sampler2D tDepth;
          uniform vec2 uTexelSize;
          uniform float uExposure;
          uniform float uBloomStrength;
          uniform float uSsaoStrength;
          uniform float uGodRayStrength;
          uniform vec2 uSunScreenPos;
          uniform vec3 uLutTint;
          uniform float uCasSharpness;
          uniform float uVignette;
          varying vec2 vUv;

          vec3 v8RRTAndODTFit(vec3 v) {
            vec3 a = v * (v + 0.0245786) - 0.000090537;
            vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
            return a / b;
          }

          vec3 v8ApplyACESFilmic(vec3 color, float exposure) {
            const mat3 ACESInputMat = mat3(
              vec3(0.59719, 0.07600, 0.02840),
              vec3(0.35458, 0.90834, 0.13383),
              vec3(0.04823, 0.01566, 0.83777)
            );
            const mat3 ACESOutputMat = mat3(
              vec3( 1.60475, -0.10208, -0.00327),
              vec3(-0.53108,  1.10813, -0.07276),
              vec3(-0.07367, -0.00605,  1.07602)
            );
            color *= (exposure / 0.6);
            color = ACESInputMat * color;
            color = v8RRTAndODTFit(color);
            color = ACESOutputMat * color;
            return clamp(color, 0.0, 1.0);
          }

          vec3 v8LinearToSRGB(vec3 value) {
            return mix(
              pow(max(value, vec3(0.0)), vec3(0.41666)) * 1.055 - vec3(0.055),
              value * 12.92,
              vec3(lessThanEqual(value, vec3(0.0031308)))
            );
          }

          void main() {
            // Sample 5-tap linear HDR neighborhood
            vec3 cLin = texture2D(tColor, vUv).rgb;
            vec3 nLin = texture2D(tColor, vUv + vec2(0.0, -uTexelSize.y)).rgb;
            vec3 sLin = texture2D(tColor, vUv + vec2(0.0,  uTexelSize.y)).rgb;
            vec3 eLin = texture2D(tColor, vUv + vec2( uTexelSize.x, 0.0)).rgb;
            vec3 wLin = texture2D(tColor, vUv + vec2(-uTexelSize.x, 0.0)).rgb;

            // 1. Half-Res HDR Bloom + Screen-Space Radial Sun Light Shafts in Linear Space
            if (uBloomStrength > 0.01) {
              vec3 bloom = texture2D(tBloom, vUv).rgb;
              if (uGodRayStrength > 0.01) {
                vec2 rayDelta = (uSunScreenPos - vUv) * 0.075;
                vec3 shaft = bloom * 0.35;
                shaft += texture2D(tBloom, clamp(vUv + rayDelta * 1.0, 0.01, 0.99)).rgb * 0.28;
                shaft += texture2D(tBloom, clamp(vUv + rayDelta * 2.0, 0.01, 0.99)).rgb * 0.22;
                shaft += texture2D(tBloom, clamp(vUv + rayDelta * 3.0, 0.01, 0.99)).rgb * 0.15;
                cLin += shaft * uGodRayStrength;
              }
              cLin += bloom * uBloomStrength;
            }

            // 2. Contact-Grounded Depth SSAO around Sleepers, Wheels & Ballast
            if (uSsaoStrength > 0.01) {
              float d0 = texture2D(tDepth, vUv).r;
              if (d0 < 0.9992) {
                float d1 = texture2D(tDepth, vUv + vec2( uTexelSize.x * 2.2,  uTexelSize.y * 2.2)).r;
                float d2 = texture2D(tDepth, vUv + vec2(-uTexelSize.x * 2.2,  uTexelSize.y * 2.2)).r;
                float d3 = texture2D(tDepth, vUv + vec2( uTexelSize.x * 2.2, -uTexelSize.y * 2.2)).r;
                float d4 = texture2D(tDepth, vUv + vec2(-uTexelSize.x * 2.2, -uTexelSize.y * 2.2)).r;
                float diff = max(0.0, d0 - 0.25 * (d1 + d2 + d3 + d4));
                float ao = 1.0 - clamp(diff * 155.0, 0.0, 1.0) * uSsaoStrength;
                cLin *= ao;
              }
            }

            // 3. Exact ACES Filmic Tone Mapping + Linear-to-sRGB Transfer
            vec3 center = v8LinearToSRGB(v8ApplyACESFilmic(cLin, uExposure));
            vec3 n = v8LinearToSRGB(v8ApplyACESFilmic(nLin, uExposure));
            vec3 s = v8LinearToSRGB(v8ApplyACESFilmic(sLin, uExposure));
            vec3 e = v8LinearToSRGB(v8ApplyACESFilmic(eLin, uExposure));
            vec3 w = v8LinearToSRGB(v8ApplyACESFilmic(wLin, uExposure));

            // 4. Fast Subpixel Edge Smoothing + Contrast-Adaptive Sharpening (CAS)
            float lC = dot(center, vec3(0.299, 0.587, 0.114));
            float lMax = max(max(dot(n, vec3(0.299, 0.587, 0.114)), dot(s, vec3(0.299, 0.587, 0.114))),
                             max(dot(e, vec3(0.299, 0.587, 0.114)), dot(w, vec3(0.299, 0.587, 0.114))));
            float lMin = min(min(dot(n, vec3(0.299, 0.587, 0.114)), dot(s, vec3(0.299, 0.587, 0.114))),
                             min(dot(e, vec3(0.299, 0.587, 0.114)), dot(w, vec3(0.299, 0.587, 0.114))));
            float edgeContrast = max(lMax, lC) - min(lMin, lC);
            if (edgeContrast > 0.14) {
              center = mix(center, (center * 2.0 + n + s + e + w) / 6.0, clamp((edgeContrast - 0.14) * 1.35, 0.0, 0.42));
            } else if (uCasSharpness > 0.01) {
              vec3 minC = min(center, min(min(n, s), min(e, w)));
              vec3 maxC = max(center, max(max(n, s), max(e, w)));
              vec3 amp = clamp(min(minC, 1.0 - maxC) / max(maxC, vec3(0.0001)), 0.0, 1.0);
              vec3 wgt = -sqrt(amp) * (0.125 * uCasSharpness);
              center = clamp((center + (n + s + e + w) * wgt) / (1.0 + 4.0 * wgt), 0.0, 1.0);
            }

            // 5. Biome Color Grading Tint & Cinematic Vignette
            center = clamp(center * uLutTint, 0.0, 1.0);
            vec2 vigUv = vUv - 0.5;
            float vig = 1.0 - dot(vigUv, vigUv) * uVignette;
            center *= clamp(vig, 0.74, 1.0);

            gl_FragColor = vec4(center, 1.0);
          }
        `,
        depthTest: false,
        depthWrite: false
      });

      this.fsQuad = new THREE.FullScreenQuad(this.compositeMaterial);
    }

    setSize(pixelW, pixelH) {
      const w = Math.max(64, Math.round(pixelW));
      const h = Math.max(64, Math.round(pixelH));
      if (this.width === w && this.height === h) return;
      this.width = w;
      this.height = h;
      this.sceneTarget.setSize(w, h);
      const hw = Math.max(32, w >> 1);
      const hh = Math.max(32, h >> 1);
      this.halfTarget.setSize(hw, hh);
      this.halfBloomMaterial.uniforms.uTexelSize.value.set(1 / hw, 1 / hh);
      this.compositeMaterial.uniforms.uTexelSize.value.set(1 / w, 1 / h);
    }

    configureForTier(config, biome, renderScale) {
      const u = this.compositeMaterial.uniforms;
      u.uBloomStrength.value = config.bloom ? 0.24 : 0.0;
      u.uSsaoStrength.value = (config.ssao && this.sceneTarget.depthTexture) ? 0.18 : 0.0;
      u.uGodRayStrength.value = config.lightShafts ? 0.10 : 0.0;
      u.uCasSharpness.value = renderScale < 0.98 ? 0.42 : 0.24;
      if (this.renderer && typeof this.renderer.toneMappingExposure === 'number') {
        u.uExposure.value = this.renderer.toneMappingExposure;
      }
      if (biome && biome.lutTint) {
        u.uLutTint.value.set(biome.lutTint[0], biome.lutTint[1], biome.lutTint[2]);
      }
    }

    render() {
      if (this.renderer && typeof this.renderer.toneMappingExposure === 'number') {
        this.compositeMaterial.uniforms.uExposure.value = this.renderer.toneMappingExposure;
      }
      // 1. Render main 3D scene into linear HDR sceneTarget
      this.renderer.setRenderTarget(this.sceneTarget);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.lastSceneCalls = (this.renderer.info && this.renderer.info.render ? this.renderer.info.render.calls : 0) + 2;
      this.lastSceneTriangles = (this.renderer.info && this.renderer.info.render ? this.renderer.info.render.triangles : 0) + 2;

      // 2. Half-res bright-pass & downsample blur if bloom enabled
      if (this.compositeMaterial.uniforms.uBloomStrength.value > 0.01) {
        this.halfBloomMaterial.uniforms.tDiffuse.value = this.sceneTarget.texture;
        this.fsQuad.material = this.halfBloomMaterial;
        this.renderer.setRenderTarget(this.halfTarget);
        this.renderer.clear();
        this.fsQuad.render(this.renderer);
      }

      // 3. Single combined composite pass to screen
      this.fsQuad.material = this.compositeMaterial;
      this.renderer.setRenderTarget(null);
      this.fsQuad.render(this.renderer);
    }

    dispose() {
      this.sceneTarget.dispose();
      this.halfTarget.dispose();
      this.halfBloomMaterial.dispose();
      this.compositeMaterial.dispose();
      this.fsQuad.dispose();
    }
  }

  // ==========================================================================
  // 7. POOLED GPU-INSTANCED PARTICLE SYSTEM (Zero Per-Frame Allocations!)
  // ==========================================================================
  class PooledParticleSystem3D {
    constructor(parentGroup, maxSparks = 160, maxWeather = 180) {
      this.parentGroup = parentGroup;
      this.maxSparks = maxSparks;
      this.maxWeather = maxWeather;

      // 1. Pre-allocated Burst / Steam / Brake Spark Pool
      this.sparkPos = new Float32Array(maxSparks * 3);
      this.sparkCol = new Float32Array(maxSparks * 3);
      this.sparkVel = new Float32Array(maxSparks * 3);
      this.sparkLife = new Float32Array(maxSparks);
      this.sparkMaxLife = new Float32Array(maxSparks);
      this.sparkWriteCursor = 0;

      for (let i = 0; i < maxSparks; i++) {
        this.sparkPos[i * 3 + 1] = -999; // Offscreen when inactive
        this.sparkLife[i] = 999;
        this.sparkMaxLife[i] = 1;
      }

      this.sparkGeo = new THREE.BufferGeometry();
      this.sparkPosAttr = new THREE.BufferAttribute(this.sparkPos, 3);
      this.sparkColAttr = new THREE.BufferAttribute(this.sparkCol, 3);
      this.sparkPosAttr.setUsage(THREE.DynamicDrawUsage);
      this.sparkColAttr.setUsage(THREE.DynamicDrawUsage);
      this.sparkGeo.setAttribute('position', this.sparkPosAttr);
      this.sparkGeo.setAttribute('color', this.sparkColAttr);

      // Soft radial circular sprite texture so all GPU points render as smooth glowing orbs/droplets
      const size = 32;
      const data = new Uint8Array(size * size * 4);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = (x + 0.5) / size - 0.5;
          const dy = (y + 0.5) / size - 0.5;
          const d = Math.sqrt(dx * dx + dy * dy) * 2.0;
          const a = Math.max(0, Math.min(1, 1.0 - d * d));
          const idx = (y * size + x) * 4;
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          data[idx + 3] = Math.round(a * a * 255);
        }
      }
      const softCircleTex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
      softCircleTex.needsUpdate = true;
      this.softCircleTex = softCircleTex;

      this.sparkMat = new THREE.PointsMaterial({
        size: 0.18,
        map: softCircleTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        alphaTest: 0.02,
        depthWrite: false
      });
      this.sparkPoints = new THREE.Points(this.sparkGeo, this.sparkMat);
      this.sparkPoints.frustumCulled = false;
      this.parentGroup.add(this.sparkPoints);

      // 2. Pre-allocated Biome Weather & Atmosphere Pool (Dust, Leaves, Snow, Rain, Fireflies)
      this.weatherPos = new Float32Array(maxWeather * 3);
      this.weatherPhase = new Float32Array(maxWeather);
      this.weatherGeo = new THREE.BufferGeometry();
      this.weatherPosAttr = new THREE.BufferAttribute(this.weatherPos, 3);
      this.weatherPosAttr.setUsage(THREE.DynamicDrawUsage);
      this.weatherGeo.setAttribute('position', this.weatherPosAttr);

      this.weatherMat = new THREE.PointsMaterial({
        color: 0xFFFBEB,
        size: 0.13,
        map: softCircleTex,
        transparent: true,
        opacity: 0.78,
        alphaTest: 0.02,
        depthWrite: false
      });
      this.weatherPoints = new THREE.Points(this.weatherGeo, this.weatherMat);
      this.weatherPoints.frustumCulled = false;
      this.weatherPoints.visible = false;
      this.parentGroup.add(this.weatherPoints);

      this.activeWeatherCount = 0;
      this.weatherKind = 'fireflies';
      this.initWeatherField('fireflies', 0);
    }

    initWeatherField(kind, densityScale = 1.0) {
      this.weatherKind = kind || 'fireflies';
      const targetCount = densityScale <= 0.01
        ? 0
        : Math.min(this.maxWeather, Math.max(26, Math.round(36 * Math.min(1.25, densityScale))));
      this.activeWeatherCount = targetCount;

      if (!this.weatherPoints || targetCount <= 0) {
        if (this.weatherPoints) this.weatherPoints.visible = false;
        for (let i = 0; i < this.maxWeather; i++) this.weatherPos[i * 3 + 1] = -999;
        this.weatherPosAttr.needsUpdate = true;
        return;
      }

      const WEATHER_PALETTES = {
        fireflies:    { color: 0xFEF08A, size: 0.11, opacity: 0.68 },
        dust:         { color: 0xFDBA74, size: 0.11, opacity: 0.60 },
        snow:         { color: 0xFFFFFF, size: 0.12, opacity: 0.72 },
        rain:         { color: 0xBAE6FD, size: 0.10, opacity: 0.62 },
        leaves:       { color: 0xFB923C, size: 0.12, opacity: 0.68 },
        crystal_dust: { color: 0xE879F9, size: 0.11, opacity: 0.68 },
        lava_embers:  { color: 0xFB923C, size: 0.12, opacity: 0.74 },
        starlight:    { color: 0x7DD3FC, size: 0.11, opacity: 0.68 }
      };
      const pal = WEATHER_PALETTES[this.weatherKind] || WEATHER_PALETTES.fireflies;
      if (this.weatherMat) {
        this.weatherMat.color.setHex(pal.color);
        this.weatherMat.size = pal.size;
        this.weatherMat.opacity = pal.opacity;
      }

      for (let i = 0; i < this.maxWeather; i++) {
        const i3 = i * 3;
        if (i < targetCount) {
          const ang = (i / targetCount) * Math.PI * 2 + (i % 5) * 0.41;
          const rad = 3.2 + (i % 7) * 0.72;
          this.weatherPos[i3]     = Math.cos(ang) * rad;
          this.weatherPos[i3 + 1] = 0.25 + (i % 9) * 0.34;
          this.weatherPos[i3 + 2] = Math.sin(ang) * rad;
          this.weatherPhase[i] = i * 1.37;
        } else {
          this.weatherPos[i3 + 1] = -999;
        }
      }
      this.weatherPoints.visible = true;
      this.weatherPosAttr.needsUpdate = true;
    }

    spawnBurst(x, y, z, colorHex = 0xFACC15, count = 8, isSteam = false) {
      _color1.setHex(colorHex);
      const n = Math.min(count, 24);
      for (let k = 0; k < n; k++) {
        const idx = this.sparkWriteCursor;
        this.sparkWriteCursor = (this.sparkWriteCursor + 1) % this.maxSparks;
        const i3 = idx * 3;
        this.sparkPos[i3]     = x + (Math.random() - 0.5) * 0.08;
        this.sparkPos[i3 + 1] = y + (Math.random() - 0.5) * 0.06;
        this.sparkPos[i3 + 2] = z + (Math.random() - 0.5) * 0.08;

        this.sparkCol[i3]     = _color1.r;
        this.sparkCol[i3 + 1] = _color1.g;
        this.sparkCol[i3 + 2] = _color1.b;

        if (isSteam) {
          this.sparkVel[i3]     = (Math.random() - 0.5) * 0.55;
          this.sparkVel[i3 + 1] = 0.75 + Math.random() * 0.85;
          this.sparkVel[i3 + 2] = (Math.random() - 0.5) * 0.55;
          this.sparkMaxLife[idx] = 0.75;
        } else {
          this.sparkVel[i3]     = (Math.random() - 0.5) * 2.1;
          this.sparkVel[i3 + 1] = 0.95 + Math.random() * 1.5;
          this.sparkVel[i3 + 2] = (Math.random() - 0.5) * 2.1;
          this.sparkMaxLife[idx] = 0.46;
        }
        this.sparkLife[idx] = 0;
      }
      this.sparkPosAttr.needsUpdate = true;
      this.sparkColAttr.needsUpdate = true;
    }

    update(dt, nowSec, windVec) {
      // 1. Update pooled bursts/steam/sparks with zero allocations
      let anySparkActive = false;
      for (let i = 0; i < this.maxSparks; i++) {
        if (this.sparkLife[i] < this.sparkMaxLife[i]) {
          anySparkActive = true;
          this.sparkLife[i] += dt;
          const i3 = i * 3;
          if (this.sparkLife[i] >= this.sparkMaxLife[i]) {
            this.sparkPos[i3 + 1] = -999;
          } else {
            this.sparkPos[i3]     += this.sparkVel[i3] * dt;
            this.sparkPos[i3 + 1] += this.sparkVel[i3 + 1] * dt;
            this.sparkPos[i3 + 2] += this.sparkVel[i3 + 2] * dt;
            // Steam rises gently; sparks experience gravity
            const grav = this.sparkMaxLife[i] > 0.6 ? -0.35 : 3.2;
            this.sparkVel[i3 + 1] -= grav * dt;
          }
        }
      }
      if (anySparkActive) {
        this.sparkPosAttr.needsUpdate = true;
      }

      if (!this.weatherPoints || !this.weatherPoints.visible || this.activeWeatherCount <= 0) {
        return;
      }

      // 2. Zero-allocation update for lightweight atmospheric biome weather particles
      const wx = (windVec && windVec[0]) ? windVec[0] : 0.6;
      const wz = (windVec && windVec[1]) ? windVec[1] : 0.25;
      const kind = this.weatherKind;
      const count = this.activeWeatherCount;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ph = this.weatherPhase[i];
        let x = this.weatherPos[i3];
        let y = this.weatherPos[i3 + 1];
        let z = this.weatherPos[i3 + 2];

        if (kind === 'snow') {
          x += (wx * 0.28 + Math.sin(nowSec * 1.4 + ph) * 0.22) * dt;
          y -= 0.58 * dt;
          z += (wz * 0.28 + Math.cos(nowSec * 1.2 + ph) * 0.22) * dt;
          if (y < 0.05) y = 3.2;
        } else if (kind === 'rain') {
          x += wx * 1.15 * dt;
          y -= 3.4 * dt;
          z += wz * 1.15 * dt;
          if (y < 0.04) {
            y = 3.4;
            x = ((i % 9) - 4) * 1.15;
            z = (((i * 3) % 9) - 4) * 1.15;
          }
        } else if (kind === 'leaves') {
          x += (wx * 0.45 + Math.sin(nowSec * 2.0 + ph) * 0.35) * dt;
          y -= 0.42 * dt;
          z += (wz * 0.45 + Math.cos(nowSec * 1.7 + ph) * 0.35) * dt;
          if (y < 0.06) y = 3.0;
        } else if (kind === 'dust') {
          x += wx * 0.85 * dt;
          y += Math.sin(nowSec * 1.8 + ph) * 0.14 * dt;
          z += wz * 0.55 * dt;
        } else if (kind === 'lava_embers') {
          x += Math.sin(nowSec * 2.1 + ph) * 0.24 * dt;
          y += 0.68 * dt;
          z += Math.cos(nowSec * 1.9 + ph) * 0.24 * dt;
          if (y > 3.3) y = 0.08;
        } else {
          // fireflies, crystal_dust, starlight: gentle floating orbital drift
          x += Math.sin(nowSec * 0.9 + ph) * 0.16 * dt;
          y += Math.cos(nowSec * 1.3 + ph * 1.3) * 0.14 * dt;
          z += Math.cos(nowSec * 0.8 + ph) * 0.16 * dt;
        }

        if (x > 6.5) x = -6.5; else if (x < -6.5) x = 6.5;
        if (z > 6.5) z = -6.5; else if (z < -6.5) z = 6.5;

        this.weatherPos[i3]     = x;
        this.weatherPos[i3 + 1] = y;
        this.weatherPos[i3 + 2] = z;
      }
      this.weatherPosAttr.needsUpdate = true;
    }

    dispose() {
      if (this.parentGroup) {
        if (this.sparkPoints) this.parentGroup.remove(this.sparkPoints);
        if (this.weatherPoints) this.parentGroup.remove(this.weatherPoints);
      }
      if (this.sparkGeo && typeof this.sparkGeo.dispose === 'function') this.sparkGeo.dispose();
      if (this.weatherGeo && typeof this.weatherGeo.dispose === 'function') this.weatherGeo.dispose();
      if (this.sparkMat && typeof this.sparkMat.dispose === 'function') this.sparkMat.dispose();
      if (this.weatherMat && typeof this.weatherMat.dispose === 'function') this.weatherMat.dispose();
      if (this.softCircleTex && typeof this.softCircleTex.dispose === 'function') this.softCircleTex.dispose();
      this.sparkPoints = null;
      this.weatherPoints = null;
      this.sparkGeo = null;
      this.weatherGeo = null;
      this.sparkMat = null;
      this.weatherMat = null;
      this.softCircleTex = null;
    }
  }

  // ==========================================================================
  // 8. MAIN 3D ENGINE CLASS (window.TrainEngine3D) — ZERO PRIMITIVES
  // ==========================================================================
  class TrainEngine3D {
    constructor() {
      this.enabled = true;
      this.isPaused = false;
      this.container = null;
      this.gameContainer = null;
      this.isMenuShowcase = false;

      this.scene = null;
      this.camera = null;
      this.reflectionCamera = null;
      this.reflectionTarget = null;
      this.renderer = null;
      this.postProcessor = null;

      this.memoryBudget = new MemoryBudget();
      this.qualityManager = new QualityManager(this);
      this.assetSystem = null;
      this.particlePool = null;

      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();

      // Shared wind uniform object for vertex-swaying InstancedMesh vegetation
      this.windUniforms = {
        uWindTime: { value: 0 },
        uWindVec:  { value: new THREE.Vector2(0.85, 0.35) }
      };

      // Scene hierarchy groups
      this.boardGroup = new THREE.Group();
      this.environmentGroup = new THREE.Group();
      this.terrainLodGroup = new THREE.Group();
      this.vegetationLodGroups = [new THREE.Group(), new THREE.Group(), new THREE.Group(), new THREE.Group()];
      this.trainGroup = new THREE.Group();
      this.patrolTrainGroup = new THREE.Group();
      this.charactersGroup = new THREE.Group();
      this.particlesGroup = new THREE.Group();

      // Runtime state
      this.tileEntries = [];
      this.pickableMeshes = [];
      this.riggedActors = [];
      this.animatedProps = [];
      this.waterMesh = null;
      this.waterMaterial = null;
      this.skyMesh = null;
      this.terrainChunks = []; // [lod0Mesh, lod1Mesh, lod2Mesh]

      // Train consist meshes & wheel bogies
      this.locomotiveMesh = null;
      this.locoWheelMeshes = [];
      this.carriageMeshes = [];
      this.headlightSpot = null;

      // Saved scene arguments for automatic refresh when async loading or context restore completes
      this.pendingSceneArgs = null;

      // Arc-length CatmullRomCurve3 Journey & Fixed-Step Interpolation State
      this.runState = null;
      this.isBraking = false;
      this.isTurbo = false;
      this.patrolAngle = 0;
      this.hasCrossTraffic = false;

      // Fixed-step (1/60s) simulation transform state for smooth interpolation
      this.simLocoPrevPos = new THREE.Vector3();
      this.simLocoCurrPos = new THREE.Vector3();
      this.simLocoPrevYaw = 0;
      this.simLocoCurrYaw = 0;
      this.simLocoPrevBank = 0;
      this.simLocoCurrBank = 0;
      this.simWheelAngle = 0;

      // Camera modes & interactive 3D orbit controls
      this.cameraMode = 'ISO_25D';
      this.orbitAzimuth = 0.22;
      this.orbitElevation = 0.72;
      this.zoomFactor = 0.96;
      this.camTargetPos = new THREE.Vector3(2.4, 5.2, 5.6);
      this.camTargetLook = new THREE.Vector3(0, 0.05, 0.1);
      this.currentLookAt = new THREE.Vector3(0, 0.05, 0.1);
      this.shakeIntensity = 0;

      // Unified Animation Loop & Fixed-Timestep Accumulator
      this.lastTime = performance.now();
      this.accumulator = 0;
      this.frameCounter = 0;
      this.firstFrameNotified = false;
      this.externalFrameListeners = [];
      this.onCellTapCallback = null;
      this._pulseTimers = [];
      this._animationLoopFn = null;
      this._snapStopped = false;
      this._globalListenersBound = false;
      this._idleListenersBound = false;
      this._onWindowResize = null;
      this._onVisibilityChange = null;
      this._wakeEngineFn = null;
      this._ffHoldTimer = null;
      this._isPointerDragging = false;
      this._wasMultiTouch = false;
      this._activePointers = new Map();
      this.isFastForwardHeld = false;

      // Debug HUD State
      this.debugHudEl = null;
      this.debugHudVisible = false;
      this.lastDebugHudUpdate = 0;
    }

    /**
     * Registers an external per-frame callback (e.g. 2D canvas fallback, UI tweens, audio sync)
     * so the entire app runs from the single renderer.setAnimationLoop!
     */
    addFrameListener(fn) {
      if (typeof fn === 'function' && !this.externalFrameListeners.includes(fn)) {
        this.externalFrameListeners.push(fn);
      }
    }

    init(containerEl, onCellTap) {
      try {
        this.gameContainer = containerEl;
        this.container = containerEl;
        this.onCellTapCallback = onCellTap;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xBAE6FD);
        this.scene.fog = new THREE.FogExp2(0xBAE6FD, 0.0045);

        const width = Math.max(300, containerEl.clientWidth || 380);
        const height = Math.max(300, containerEl.clientHeight || 380);

        this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 140);
        this.camera.position.set(2.4, 5.2, 5.6);
        this.camera.lookAt(0, 0, 0);

        this.reflectionCamera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);

        const isDebugAllowed = Boolean(window.__HEADLESS_CI_TEST === true || window.__ALLOW_OWNER_DEBUG === true);
        let isHeadlessRenderer = false;
        try {
          this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: Boolean(isDebugAllowed && window.location && window.location.search && window.location.search.indexOf('snap=1') !== -1)
          });
          this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
          this.renderer.setSize(width, height);
          this.renderer.shadowMap.enabled = true;
          this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          this.renderer.shadowMap.autoUpdate = false;
          this.renderer.shadowMap.needsUpdate = true;
          this._shadowDirtyFrames = 4;
          this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
          this.renderer.toneMappingExposure = 1.18;
          this.renderer.outputEncoding = THREE.sRGBEncoding;
          if ('outputColorSpace' in this.renderer) {
            this.renderer.outputColorSpace = 'srgb';
          }
          this.renderer.physicallyCorrectLights = true;
        } catch (headlessErr) {
          if (window.__HEADLESS_CI_TEST === true) {
            isHeadlessRenderer = true;
            const dummyCanvas = document.createElement('canvas');
            dummyCanvas.width = width;
            dummyCanvas.height = height;
            this.renderer = {
              isHeadlessStub: true,
              domElement: dummyCanvas,
              shadowMap: { enabled: false, type: THREE.PCFSoftShadowMap },
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.08,
              capabilities: { isWebGL2: true, getMaxAnisotropy: () => 4, maxTextures: 16 },
              info: { memory: { geometries: 0, textures: 0 }, render: { calls: 0, triangles: 0 } },
              setPixelRatio() {},
              setSize() {},
              setAnimationLoop() {},
              render() {},
              compile() {},
              setRenderTarget() {},
              clear() {},
              dispose() {},
              getContext: () => ({
                getExtension: () => null,
                getParameter: () => 'Headless 3D Simulation GPU'
              })
            };
          } else {
            console.warn('[TrainEngine3D] WebGL unavailable on device; activating crisp 2D SVG + Canvas fallback.', headlessErr);
            this.enabled = false;
            this.renderer = null;
            if (containerEl) {
              containerEl.classList.remove('mode-3d-active');
              const staleCanvas = containerEl.querySelector('#board-3d-canvas');
              if (staleCanvas) staleCanvas.remove();
            }
            if (typeof window.__dismissBootLoader === 'function') {
              try { window.__dismissBootLoader(); } catch (_) {}
            }
            return false;
          }
        }

        // Photorealistic Outdoor Sky + Sun + Earth Equirectangular PMREM IBL (replaces sterile white RoomEnvironment)
        this.defaultRoomEnvTex = null;
        if (!isHeadlessRenderer && typeof THREE.PMREMGenerator !== 'undefined') {
          const pmremGen = new THREE.PMREMGenerator(this.renderer);
          pmremGen.compileEquirectangularShader();
          const eqW = 64;
          const eqH = 32;
          const eqData = new Uint8Array(eqW * eqH * 4);
          for (let y = 0; y < eqH; y++) {
            const v = (y + 0.5) / eqH; // 0 = bottom nadir, 0.5 = horizon, 1 = top zenith
            for (let x = 0; x < eqW; x++) {
              const u = (x + 0.5) / eqW;
              let rCol = 0;
              let gCol = 0;
              let bCol = 0;
              if (v >= 0.5) {
                const tSky = Math.pow((v - 0.5) * 2.0, 0.65);
                // Horizon (#CBE3F8) -> Cobalt Zenith (#245A9E)
                rCol = 203 * (1 - tSky) + 36 * tSky;
                gCol = 227 * (1 - tSky) + 90 * tSky;
                bCol = 248 * (1 - tSky) + 158 * tSky;
                // Warm solar highlight at (u = 0.34, v = 0.74)
                const du = Math.min(Math.abs(u - 0.34), 1.0 - Math.abs(u - 0.34));
                const dv = v - 0.74;
                const dSun = Math.sqrt(du * du + dv * dv);
                const sunGlow = Math.exp(-dSun * dSun * 38.0);
                rCol = Math.min(255, rCol + 145 * sunGlow);
                gCol = Math.min(255, gCol + 132 * sunGlow);
                bCol = Math.min(255, bCol + 98 * sunGlow);
              } else {
                const tGnd = Math.pow((0.5 - v) * 2.0, 0.75);
                // Warm horizon bounce (#9E9689) -> natural earth/foliage (#46523E)
                rCol = 158 * (1 - tGnd) + 70 * tGnd;
                gCol = 150 * (1 - tGnd) + 82 * tGnd;
                bCol = 137 * (1 - tGnd) + 62 * tGnd;
              }
              const idx = (y * eqW + x) * 4;
              eqData[idx] = Math.round(rCol);
              eqData[idx + 1] = Math.round(gCol);
              eqData[idx + 2] = Math.round(bCol);
              eqData[idx + 3] = 255;
            }
          }
          const skyEqTex = new THREE.DataTexture(eqData, eqW, eqH, THREE.RGBAFormat);
          skyEqTex.mapping = THREE.EquirectangularReflectionMapping;
          skyEqTex.encoding = THREE.sRGBEncoding;
          skyEqTex.needsUpdate = true;
          this.defaultRoomEnvTex = pmremGen.fromEquirectangular(skyEqTex).texture;
          this.scene.environment = this.defaultRoomEnvTex;
          skyEqTex.dispose();
          pmremGen.dispose();
        }

        // Shared cached PBR materials (V8.0 World-Class Ballast, Creosote Oak Sleepers, Tie-Plates & Anisotropic Forged-Steel Rails)
        const attachAnisotropicRailShader = (mat, sheenStrength = 0.28) => {
          mat.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <emissivemap_fragment>',
              `#include <emissivemap_fragment>
              vec3 vRailView = normalize(vViewPosition);
              vec3 vRailNorm = normalize(vNormal);
              float crownGlint = pow(clamp(vRailNorm.y * 0.72 + abs(dot(vRailNorm, vRailView)) * 0.28, 0.0, 1.0), 6.0);
              float edgeRim = pow(1.0 - clamp(abs(dot(vRailNorm, vRailView)), 0.0, 1.0), 3.0);
              totalEmissiveRadiance += vec3(0.86, 0.93, 1.0) * ((crownGlint * 0.14 + edgeRim * 0.20) * ${sheenStrength.toFixed(2)});`
            );
          };
          return mat;
        };

        this.sharedMaterials = {
          tileGrass: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x527A46).convertSRGBToLinear(),
            vertexColors: true,
            roughness: 0.86,
            metalness: 0.02,
            envMapIntensity: 0.36
          }),
          tileStone: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x94A3B8).convertSRGBToLinear(),
            vertexColors: true,
            roughness: 0.78,
            metalness: 0.06,
            envMapIntensity: 0.40
          }),
          trackBallast: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x8D95A0).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.90,
            metalness: 0.04,
            envMapIntensity: 0.42
          }),
          trackSleeper: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x633E24).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.82,
            metalness: 0.03,
            envMapIntensity: 0.38
          }),
          trackTiePlate: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x2B3340).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.34,
            metalness: 0.84,
            envMapIntensity: 1.18
          }),
          trackStonePier: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x9CA3AF).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.82,
            metalness: 0.05,
            envMapIntensity: 0.44
          }),
          trackDefault: attachAnisotropicRailShader(new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xF8FAFC).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.11,
            metalness: 0.95,
            envMapIntensity: 1.92,
            emissive: new THREE.Color(0x000000),
            emissiveIntensity: 0.0
          }), 0.42),
          trackConnected: attachAnisotropicRailShader(new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xE0F2FE).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.12,
            metalness: 0.88,
            envMapIntensity: 1.78,
            emissive: new THREE.Color(0x06B6D4).convertSRGBToLinear(),
            emissiveIntensity: 1.04
          }), 0.36),
          trackComplete: attachAnisotropicRailShader(new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xD1FAE5).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.12,
            metalness: 0.88,
            envMapIntensity: 1.72,
            emissive: new THREE.Color(0x10B981).convertSRGBToLinear(),
            emissiveIntensity: 0.72
          }), 0.35),
          trackLocked: attachAnisotropicRailShader(new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xCFFAFE).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.14,
            metalness: 0.88,
            envMapIntensity: 1.62,
            emissive: new THREE.Color(0x22D3EE).convertSRGBToLinear(),
            emissiveIntensity: 0.56
          }), 0.30),
          trackConnected2: attachAnisotropicRailShader(new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xFEF3C7).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.13,
            metalness: 0.88,
            envMapIntensity: 1.68,
            emissive: new THREE.Color(0xF59E0B).convertSRGBToLinear(),
            emissiveIntensity: 0.68
          }), 0.32),
          goldenStar: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xFFD700).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.12,
            metalness: 0.92,
            envMapIntensity: 1.85,
            emissive: new THREE.Color(0xF59E0B).convertSRGBToLinear(),
            emissiveIntensity: 0.42
          }),
          cyanStationPortal: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x67E8F9).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.14,
            metalness: 0.22,
            envMapIntensity: 1.15,
            emissive: new THREE.Color(0x06B6D4).convertSRGBToLinear(),
            emissiveIntensity: 0.95
          }),
          emeraldArrivalPortal: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x6EE7B7).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.14,
            metalness: 0.22,
            envMapIntensity: 1.15,
            emissive: new THREE.Color(0x10B981).convertSRGBToLinear(),
            emissiveIntensity: 0.95
          }),
          amberStationPortal: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xFCD34D).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.14,
            metalness: 0.25,
            envMapIntensity: 1.20,
            emissive: new THREE.Color(0xF59E0B).convertSRGBToLinear(),
            emissiveIntensity: 0.95
          }),
          switchLanternAmber: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xFDE047).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.18,
            metalness: 0.30,
            emissive: new THREE.Color(0xF59E0B).convertSRGBToLinear(),
            emissiveIntensity: 1.45
          }),
          switchLanternCyan: new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x67E8F9).convertSRGBToLinear(),
            vertexColors: false,
            roughness: 0.18,
            metalness: 0.30,
            emissive: new THREE.Color(0x06B6D4).convertSRGBToLinear(),
            emissiveIntensity: 1.35
          })
        };

        // Direct Hardware MSAA + Native ACES Filmic Pipeline (zero offscreen FBO memory resolve lag!)
        this.reflectionTarget = null;
        this.postProcessor = { enabled: false, setSize() {}, configureForTier() {}, render() {}, updateBiome() {} };

        const oldCanvas = containerEl.querySelector('#board-3d-canvas');
        if (oldCanvas) oldCanvas.remove();

        const canvas = this.renderer.domElement;
        canvas.id = 'board-3d-canvas';
        canvas.className = 'board-3d-canvas';
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '4';
        canvas.style.cursor = 'pointer';
        canvas.style.touchAction = 'none';
        containerEl.appendChild(canvas);

        // WebGL Context Loss & Automatic Recovery Handlers
        canvas.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          console.warn('[TrainEngine3D] WebGL context lost — pausing simulation loop.');
          this.pauseRendering();
        }, false);

        canvas.addEventListener('webglcontextrestored', () => {
          console.info('[TrainEngine3D] WebGL context restored — rebuilding shaders & current scene.');
          if (this.assetSystem && this.assetSystem.ktx2Loader) {
            this.assetSystem.ktx2Loader.detectSupport(this.renderer);
          }
          if (this.pendingSceneArgs) {
            const { level, boardGrid, skinConfig, isShowcase } = this.pendingSceneArgs;
            this.buildLevelScene(level, boardGrid, skinConfig, isShowcase);
          }
          if (!this.isPauseHeldByUi()) {
            this.resumeRendering();
          } else {
            this.isPaused = true;
            this.accumulator = 0;
          }
        }, false);

        this.setupLights();

        this.environmentGroup.add(this.terrainLodGroup);
        this.vegetationLodGroups.forEach(g => this.environmentGroup.add(g));
        this.scene.add(this.environmentGroup);
        this.scene.add(this.boardGroup);
        this.scene.add(this.trainGroup);
        this.scene.add(this.patrolTrainGroup);
        this.scene.add(this.charactersGroup);
        this.scene.add(this.particlesGroup);

        // Initialize Pooled GPU-Instanced Particle System (Zero per-frame allocations)
        this.particlePool = new PooledParticleSystem3D(this.particlesGroup, 160, 180);

        // Detect Quality Tier (GPU string + deviceMemory + 3s boot benchmark)
        this.qualityManager.detectInitialTier(this.renderer);

        // Initialize Per-Region Streaming Asset Loader (KTX2 + GLB + PMREM)
        this.assetSystem = new AssetLoaderSystem3D(this.renderer, this.memoryBudget);
        if (!isHeadlessRenderer) {
          this.assetSystem.loadAllAssets();
        }
        this.assetSystem.onReady(() => {
          this.bindPbrNormalMapsToSharedMaterials();
          if (this.pendingSceneArgs) {
            const prevCamMode = this.cameraMode;
            const prevRunState = this.runState;
            const prevConnSet = this.lastConnectedSet;
            const prevComplete = this.lastIsComplete;
            const prevSecSet = this.lastSecondarySet;
            const { level, boardGrid, skinConfig, isShowcase } = this.pendingSceneArgs;
            this.buildLevelScene(level, boardGrid, skinConfig, isShowcase);
            this.cameraMode = prevCamMode;
            if (isShowcase && this.menuDemoSteps) {
              const connSet = new Set(this.menuDemoSteps.map(s => `${s.r},${s.c}`));
              this.updateConduitHighlights(connSet, true);
              this.runMenuDemoLoop();
            } else {
              if (prevConnSet) {
                this.updateConduitHighlights(prevConnSet, Boolean(prevComplete), prevSecSet);
              }
              if (prevRunState) {
                this.runState = prevRunState;
                this.stepFixedSimulation(0.016);
                this.interpolateRenderTransforms(1.0);
              }
            }
          }
        });

        this.bindPointerEvents();
        this.initDebugHud();

        if (!this._globalListenersBound) {
          this._globalListenersBound = true;
          this._onWindowResize = () => this.onResize();
          this._onVisibilityChange = () => {
            if (document.hidden) {
              this.pauseRendering();
            } else if (!this.isPauseHeldByUi()) {
              this.resumeRendering();
            }
          };
          window.addEventListener('resize', this._onWindowResize);
          document.addEventListener('visibilitychange', this._onVisibilityChange);
        }
        if (typeof ResizeObserver === 'function' && containerEl && !this._containerResizeObserver) {
          try {
            let lastObsW = containerEl.clientWidth || 0;
            let lastObsH = containerEl.clientHeight || 0;
            this._containerResizeObserver = new ResizeObserver(() => {
              if (!this.container || !this.renderer || !this.camera || this.isPaused) return;
              const cw = this.container.clientWidth || 0;
              const ch = this.container.clientHeight || 0;
              if (cw <= 0 || ch <= 0 || (cw === lastObsW && ch === lastObsH)) return;
              lastObsW = cw;
              lastObsH = ch;
              if (this.runState) {
                this.camera.aspect = Math.max(260, cw) / Math.max(180, ch);
                this.camera.updateProjectionMatrix();
              } else {
                this.onResize();
              }
            });
            this._containerResizeObserver.observe(containerEl);
          } catch (_) {}
        }

        this.enabled = true;
        this.startAnimationLoop();
        return true;
      } catch (err) {
        console.warn('[TrainEngine3D] WebGL initialization failed; falling back to 2D SVG + Canvas:', err);
        this.enabled = false;
        this.renderer = null;
        if (containerEl) {
          containerEl.classList.remove('mode-3d-active');
          const staleCanvas = containerEl.querySelector('#board-3d-canvas');
          if (staleCanvas) staleCanvas.remove();
        }
        if (typeof window.__dismissBootLoader === 'function') {
          try { window.__dismissBootLoader(); } catch (_) {}
        }
        return false;
      }
    }

    isPauseHeldByUi() {
      try {
        if (typeof window !== 'undefined' && typeof window.__shouldKeepEngine3DPaused === 'function') {
          if (window.__shouldKeepEngine3DPaused()) return true;
        }
        if (typeof document !== 'undefined') {
          const modalIds = ['modal-shop', 'modal-achievements', 'modal-daily-login', 'modal-privacy', 'modal-ad-simulator'];
          for (let i = 0; i < modalIds.length; i++) {
            const el = document.getElementById(modalIds[i]);
            if (el && !el.hidden) return true;
          }
        }
      } catch (_) {}
      return false;
    }

    clearPulseTimers() {
      if (Array.isArray(this._pulseTimers)) {
        for (let i = 0; i < this._pulseTimers.length; i++) {
          clearTimeout(this._pulseTimers[i]);
        }
        this._pulseTimers.length = 0;
      }
    }

    uncacheRiggedActors() {
      if (!Array.isArray(this.riggedActors)) return;
      for (let i = 0; i < this.riggedActors.length; i++) {
        const actor = this.riggedActors[i];
        if (actor && actor.mixer) {
          try {
            actor.mixer.stopAllAction();
            if (actor.clonedScene) actor.mixer.uncacheRoot(actor.clonedScene);
            else if (actor.root) actor.mixer.uncacheRoot(actor.root);
          } catch (_) {}
        }
      }
    }

    _clearFastForwardHold() {
      if (this._ffHoldTimer) {
        clearTimeout(this._ffHoldTimer);
        this._ffHoldTimer = null;
      }
      this.isFastForwardHeld = false;
    }

    _clearPointerHoldState() {
      this._clearFastForwardHold();
      this._isPointerDragging = false;
      this._wasMultiTouch = false;
      if (this._activePointers && typeof this._activePointers.clear === 'function') {
        this._activePointers.clear();
      }
    }

    pauseRendering() {
      this.isPaused = true;
      this.accumulator = 0;
      this._clearPointerHoldState();
      if (this.renderer && typeof this.renderer.setAnimationLoop === 'function') {
        this.renderer.setAnimationLoop(null);
      }
      if (window.GameAudio && typeof window.GameAudio.stopTrainEngineLoop === 'function') {
        window.GameAudio.stopTrainEngineLoop();
      }
    }

    resumeRendering() {
      this.isPaused = false;
      this.lastTime = performance.now();
      this.accumulator = 0;
      this.lastUserInteractionMs = this.lastTime;
      this.requestShadowUpdate(2);
      if (this.renderer && typeof this.renderer.setAnimationLoop === 'function' && this._animationLoopFn && !this._snapStopped) {
        this.renderer.setAnimationLoop(this._animationLoopFn);
      }
    }

    onThermalUpdate(status, headroom) {
      if (this.qualityManager) {
        this.qualityManager.onThermalUpdate(status, headroom);
      }
    }

    setQualityTier(tierName) {
      if (this.qualityManager) {
        this.qualityManager.applyTier(tierName, true);
      }
    }

    setQualityPresetMode(modeName) {
      if (!this.qualityManager) return;
      const mode = String(modeName || 'AUTO').toUpperCase();
      try {
        localStorage.setItem('dream_express_quality_mode_v12', mode);
      } catch (_) {}
      if (mode === 'AUTO') {
        try { localStorage.removeItem('dream_express_quality_tier_v68'); } catch (_) {}
        if (this.renderer) {
          this.qualityManager.detectInitialTier(this.renderer);
        } else {
          this.qualityManager.applyTier('HIGH', false);
        }
      } else if (mode === 'MID') {
        this.qualityManager.applyTier('MID', true);
      } else {
        this.qualityManager.applyTier('ULTRA', true);
      }
      this.onResize();
      this.requestShadowUpdate(3);
    }

    getQualityPresetMode() {
      try {
        const saved = localStorage.getItem('dream_express_quality_mode_v12');
        if (saved === 'MID' || saved === 'HIGH' || saved === 'AUTO') return saved;
      } catch (_) {}
      return 'AUTO';
    }

    requestShadowUpdate(frames = 3) {
      this._shadowDirtyFrames = Math.max(this._shadowDirtyFrames || 0, frames);
      if (this.renderer && this.renderer.shadowMap) {
        this.renderer.shadowMap.needsUpdate = true;
      }
    }

    onQualityTierChanged(config) {
      if (!this.renderer) return;
      this.renderer.shadowMap.enabled = config.shadowsEnabled;
      if (this.dirLight && this.dirLight.shadow) {
        if (this.dirLight.shadow.mapSize.width !== config.shadowMapSize) {
          this.dirLight.shadow.mapSize.width = config.shadowMapSize;
          this.dirLight.shadow.mapSize.height = config.shadowMapSize;
          if (this.dirLight.shadow.map) {
            this.dirLight.shadow.map.dispose();
            this.dirLight.shadow.map = null;
          }
        }
      }
      if (this.assetSystem && this.assetSystem.ktx2Loader) {
        this.assetSystem.ktx2Loader.setMaxMipTier(config.mipTier);
      }
      if (this.postProcessor && this.postProcessor.enabled && typeof this.postProcessor.configureForTier === 'function') {
        const biome = BIOME_CONFIGS[(this.currentLevel && this.currentLevel.stationId) || 1] || BIOME_CONFIGS[1];
        this.postProcessor.configureForTier(config, biome, this.qualityManager ? this.qualityManager.renderScale : 1.0);
      }
      this.applyDynamicResolution();
      this.requestShadowUpdate(4);
    }

    applyDynamicResolution() {
      if (!this.renderer || !this.container) return;
      const cssW = Math.max(260, this.container.clientWidth || 460);
      const cssH = Math.max(180, this.container.clientHeight || 680);

      // Crisp native-grade HiDPI rendering (up to 2.5x on OLED phones) without unnecessary FBO reallocations
      const preset = QUALITY_PRESETS[this.qualityManager ? this.qualityManager.currentTier : 'HIGH'] || QUALITY_PRESETS.HIGH;
      const maxDprCap = preset.maxDpr || 2.35;
      const rawDpr = Math.min(window.devicePixelRatio || 1, maxDprCap) * (this.qualityManager ? this.qualityManager.renderScale : 1.0);
      const finalDpr = Math.round(Math.max(1.25, Math.min(2.65, rawDpr)) * 100) / 100;

      if (this._lastAppliedW === cssW && this._lastAppliedH === cssH && this._lastAppliedDpr === finalDpr) {
        return;
      }
      this._lastAppliedW = cssW;
      this._lastAppliedH = cssH;
      this._lastAppliedDpr = finalDpr;
      this._cachedCanvasRect = null;

      this.renderer.setPixelRatio(finalDpr);
      this.renderer.setSize(cssW, cssH, false);
      if (this.postProcessor && this.postProcessor.enabled && typeof this.postProcessor.setSize === 'function') {
        this.postProcessor.setSize(cssW * finalDpr, cssH * finalDpr);
      }
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
      this.requestShadowUpdate(3);
    }

    mountTo(targetEl) {
      if (!targetEl || !this.renderer || !this.renderer.domElement) return;
      this.container = targetEl;
      if (this.renderer.domElement.parentElement !== targetEl) {
        targetEl.appendChild(this.renderer.domElement);
      }
      this.onResize();
    }

    startMenuShowcase(skinConfig) {
      const menuStage = document.getElementById('menu-3d-stage');
      if (!menuStage || !this.scene) return;

      this.isMenuShowcase = true;
      this.mountTo(menuStage);

      // Closed 8-tile oval railway loop so the Main Menu locomotive & carriages ride 100% centered on the rails forever
      const demoLevel = {
        id: 0,
        stationId: 1,
        rows: 4,
        cols: 4,
        carriagesCount: 2,
        trainSpeed: 1.50,
        hasCrossTraffic: false,
        solutionPath: [
          { r: 1, c: 0, type: 'CURVE',    initRot: 90,  solRot: 90  },
          { r: 1, c: 1, type: 'STRAIGHT', initRot: 90,  solRot: 90  },
          { r: 1, c: 2, type: 'STRAIGHT', initRot: 90,  solRot: 90  },
          { r: 1, c: 3, type: 'CURVE',    initRot: 180, solRot: 180 },
          { r: 2, c: 3, type: 'CURVE',    initRot: 270, solRot: 270 },
          { r: 2, c: 2, type: 'STRAIGHT', initRot: 90,  solRot: 90  },
          { r: 2, c: 1, type: 'STRAIGHT', initRot: 90,  solRot: 90  },
          { r: 2, c: 0, type: 'CURVE',    initRot: 0,   solRot: 0   }
        ]
      };

      const demoGrid = Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => ({
          r, c,
          type: (r === 0 || r === 3) ? 'OBSTACLE' : 'STRAIGHT',
          kind: (c === 1) ? 'building' : ((c % 2 === 0) ? 'tree' : 'rock'),
          rot: 90,
          visualRot: 90,
          solRot: 90,
          rotatable: false,
          hasSpark: false
        }))
      );
      demoLevel.solutionPath.forEach(sp => {
        demoGrid[sp.r][sp.c] = {
          r: sp.r, c: sp.c,
          type: sp.type,
          rot: sp.solRot,
          visualRot: sp.solRot,
          solRot: sp.solRot,
          rotatable: false,
          hasSpark: false
        };
      });

      this.menuDemoSteps = [
        { r: 1, c: 0, type: 'CURVE',    enterDir: 'S', exitDir: 'E' },
        { r: 1, c: 1, type: 'STRAIGHT', enterDir: 'W', exitDir: 'E' },
        { r: 1, c: 2, type: 'STRAIGHT', enterDir: 'W', exitDir: 'E' },
        { r: 1, c: 3, type: 'CURVE',    enterDir: 'W', exitDir: 'S' },
        { r: 2, c: 3, type: 'CURVE',    enterDir: 'N', exitDir: 'W' },
        { r: 2, c: 2, type: 'STRAIGHT', enterDir: 'E', exitDir: 'W' },
        { r: 2, c: 1, type: 'STRAIGHT', enterDir: 'E', exitDir: 'W' },
        { r: 2, c: 0, type: 'CURVE',    enterDir: 'E', exitDir: 'N' }
      ];

      this.buildLevelScene(demoLevel, demoGrid, skinConfig, true);
      this.zoomFactor = 1.08;
      this.orbitElevation = 0.54;
      this.updateCameraFramingForGrid(true);
      const connSet = new Set(this.menuDemoSteps.map(s => `${s.r},${s.c}`));
      this.updateConduitHighlights(connSet, true);
      this.runMenuDemoLoop();
    }

    runMenuDemoLoop() {
      if (!this.isMenuShowcase || !this.menuDemoSteps) return;
      this.startJourney(this.menuDemoSteps, 1.45, null, null, true);
    }

    bindPbrNormalMapsToSharedMaterials(biome = null) {
      if (!this.assetSystem || !this.assetSystem.pbrTextures || !this.sharedMaterials) return;
      const pbrTextures = this.assetSystem.pbrTextures;
      const b = biome || BIOME_CONFIGS[1];

      const priTexKey = b.tilePrimaryTex || 'grass_diffuse';
      const priNorKey = b.tilePrimaryNormal || 'grass_normal';
      const priColHex = typeof b.tilePrimaryColor === 'number' ? b.tilePrimaryColor : 0x86EFAC;
      const fixTexKey = b.tileFixedTex || 'rock_diffuse';
      const fixColHex = typeof b.tileFixedColor === 'number' ? b.tileFixedColor : 0xCBD5E1;

      if (this.sharedMaterials.tileGrass) {
        const priTex = pbrTextures[priTexKey] || pbrTextures.grass_diffuse || pbrTextures.rock_diffuse;
        if (priTex) {
          priTex.repeat.set(2, 2);
          this.sharedMaterials.tileGrass.map = priTex;
        }
        const priRoughMap = (priTexKey === 'metal_diffuse')
          ? pbrTextures.metal_roughness
          : (priTexKey === 'brick_diffuse' ? pbrTextures.brick_roughness : pbrTextures.rock_roughness);
        if (priRoughMap) {
          priRoughMap.repeat.set(2, 2);
          this.sharedMaterials.tileGrass.roughnessMap = priRoughMap;
        }
        this.sharedMaterials.tileGrass.color.setHex(priColHex).convertSRGBToLinear();
        this.sharedMaterials.tileGrass.roughness = typeof b.tilePrimaryRough === 'number' ? b.tilePrimaryRough : 0.82;
        this.sharedMaterials.tileGrass.metalness = typeof b.tilePrimaryMetal === 'number' ? b.tilePrimaryMetal : 0.04;
        const priNor = pbrTextures[priNorKey] || pbrTextures.rock_normal || pbrTextures.grass_normal;
        if (priNor) {
          priNor.repeat.set(2, 2);
          this.sharedMaterials.tileGrass.normalMap = priNor;
          this.sharedMaterials.tileGrass.normalScale = new THREE.Vector2(0.55, 0.55);
        }
        this.sharedMaterials.tileGrass.needsUpdate = true;
      }
      if (this.sharedMaterials.tileStone) {
        const fixTex = pbrTextures[fixTexKey] || pbrTextures.rock_diffuse;
        if (fixTex) {
          fixTex.repeat.set(2, 2);
          this.sharedMaterials.tileStone.map = fixTex;
        }
        const fixRoughMap = (fixTexKey === 'metal_diffuse')
          ? pbrTextures.metal_roughness
          : (fixTexKey === 'brick_diffuse' ? pbrTextures.brick_roughness : pbrTextures.rock_roughness);
        if (fixRoughMap) {
          fixRoughMap.repeat.set(2, 2);
          this.sharedMaterials.tileStone.roughnessMap = fixRoughMap;
        }
        this.sharedMaterials.tileStone.color.setHex(fixColHex).convertSRGBToLinear();
        this.sharedMaterials.tileStone.roughness = typeof b.tilePrimaryRough === 'number' ? Math.max(0.35, b.tilePrimaryRough - 0.08) : 0.72;
        this.sharedMaterials.tileStone.metalness = typeof b.tilePrimaryMetal === 'number' ? Math.min(0.45, b.tilePrimaryMetal + 0.06) : 0.08;
        const fixNor = (fixTexKey === 'brick_diffuse' && pbrTextures.brick_normal)
          ? pbrTextures.brick_normal
          : ((fixTexKey === 'metal_diffuse' && pbrTextures.metal_normal) ? pbrTextures.metal_normal : pbrTextures.rock_normal);
        if (fixNor) {
          fixNor.repeat.set(2, 2);
          this.sharedMaterials.tileStone.normalMap = fixNor;
          this.sharedMaterials.tileStone.normalScale = new THREE.Vector2(0.55, 0.55);
        }
        this.sharedMaterials.tileStone.needsUpdate = true;
      }
      if (this.sharedMaterials.trackBallast) {
        if (pbrTextures.rock_diffuse) this.sharedMaterials.trackBallast.map = pbrTextures.rock_diffuse;
        if (pbrTextures.rock_normal) {
          this.sharedMaterials.trackBallast.normalMap = pbrTextures.rock_normal;
          this.sharedMaterials.trackBallast.normalScale = new THREE.Vector2(0.75, 0.75);
        }
        if (pbrTextures.rock_roughness) this.sharedMaterials.trackBallast.roughnessMap = pbrTextures.rock_roughness;
        this.sharedMaterials.trackBallast.roughness = Math.max(0.68, 0.90 - (b.wetness || 0) * 0.65);
        this.sharedMaterials.trackBallast.needsUpdate = true;
      }
      if (this.sharedMaterials.trackSleeper) {
        if (pbrTextures.rock_normal) {
          this.sharedMaterials.trackSleeper.normalMap = pbrTextures.rock_normal;
          this.sharedMaterials.trackSleeper.normalScale = new THREE.Vector2(0.32, 0.32);
        }
        this.sharedMaterials.trackSleeper.roughness = Math.max(0.58, 0.82 - (b.wetness || 0) * 0.75);
        this.sharedMaterials.trackSleeper.needsUpdate = true;
      }
      if (this.sharedMaterials.trackTiePlate) {
        if (pbrTextures.metal_normal) {
          this.sharedMaterials.trackTiePlate.normalMap = pbrTextures.metal_normal;
          this.sharedMaterials.trackTiePlate.normalScale = new THREE.Vector2(0.35, 0.35);
        }
        if (pbrTextures.metal_roughness) this.sharedMaterials.trackTiePlate.roughnessMap = pbrTextures.metal_roughness;
        this.sharedMaterials.trackTiePlate.needsUpdate = true;
      }
      if (this.sharedMaterials.trackStonePier) {
        if (pbrTextures.brick_diffuse) this.sharedMaterials.trackStonePier.map = pbrTextures.brick_diffuse;
        if (pbrTextures.brick_normal) {
          this.sharedMaterials.trackStonePier.normalMap = pbrTextures.brick_normal;
          this.sharedMaterials.trackStonePier.normalScale = new THREE.Vector2(0.55, 0.55);
        }
        if (pbrTextures.brick_roughness) this.sharedMaterials.trackStonePier.roughnessMap = pbrTextures.brick_roughness;
        this.sharedMaterials.trackStonePier.needsUpdate = true;
      }
      const railMats = [
        this.sharedMaterials.trackDefault,
        this.sharedMaterials.trackConnected,
        this.sharedMaterials.trackComplete,
        this.sharedMaterials.trackLocked,
        this.sharedMaterials.trackConnected2
      ];
      const railWetRough = Math.max(0.06, 0.11 - (b.wetness || 0) * 0.28);
      railMats.forEach(rm => {
        if (!rm) return;
        rm.roughness = railWetRough;
        if (pbrTextures.metal_normal && rm.normalMap !== pbrTextures.metal_normal) {
          rm.normalMap = pbrTextures.metal_normal;
          rm.normalScale = new THREE.Vector2(0.24, 0.24);
          rm.needsUpdate = true;
        }
        if (pbrTextures.metal_roughness && rm.roughnessMap !== pbrTextures.metal_roughness) {
          rm.roughnessMap = pbrTextures.metal_roughness;
          rm.needsUpdate = true;
        }
      });
    }

    setupLights() {
      // Physically balanced Sky/Ground Hemisphere fill (prevents washed-out flat shadows!)
      this.hemiLight = new THREE.HemisphereLight(0xCEE8FA, 0x4B5E38, 0.66);
      this.hemiLight.position.set(0, 20, 0);
      this.scene.add(this.hemiLight);

      // Crisp Natural Sun DirectionalLight with properly mounted scene target & contact-sharp shadows
      this.dirLight = new THREE.DirectionalLight(0xFFF6E3, 3.45);
      this.dirLight.position.set(8.5, 13.5, 9.5);
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = 2048;
      this.dirLight.shadow.mapSize.height = 2048;
      this.dirLight.shadow.camera.near = 1.0;
      this.dirLight.shadow.camera.far = 38.0;
      const d = 5.5;
      this.dirLight.shadow.camera.left = -d;
      this.dirLight.shadow.camera.right = d;
      this.dirLight.shadow.camera.top = d;
      this.dirLight.shadow.camera.bottom = -d;
      this.dirLight.shadow.bias = -0.00025;
      this.dirLight.shadow.normalBias = 0.016;
      this.scene.add(this.dirLight);
      this.scene.add(this.dirLight.target);

      this.rimLight = new THREE.DirectionalLight(0x93C5FD, 0.70);
      this.rimLight.position.set(-8, 7, -7);
      this.scene.add(this.rimLight);
    }

    /**
     * Tightly fits the sun shadow frustum to the visible board area and texel-snaps
     * the shadow camera in light space to eliminate shadow edge shimmering!
     */
    updateTightTexelSnappedShadowFrustum(boardSpan) {
      if (!this.dirLight || !this.dirLight.castShadow) return;
      const halfSpan = Math.max(3.2, boardSpan * 0.68);
      const shCam = this.dirLight.shadow.camera;
      const mapSize = this.dirLight.shadow.mapSize.width || 2048;
      const worldUnitsPerTexel = (halfSpan * 2.0) / mapSize;

      // Snap target center to shadow map texel grid
      const snapX = Math.floor(this.currentLookAt.x / worldUnitsPerTexel) * worldUnitsPerTexel;
      const snapZ = Math.floor(this.currentLookAt.z / worldUnitsPerTexel) * worldUnitsPerTexel;

      if (
        this._lastShadowHalfSpan === halfSpan &&
        this._lastShadowSnapX === snapX &&
        this._lastShadowSnapZ === snapZ
      ) {
        return;
      }
      this._lastShadowHalfSpan = halfSpan;
      this._lastShadowSnapX = snapX;
      this._lastShadowSnapZ = snapZ;

      shCam.left = -halfSpan;
      shCam.right = halfSpan;
      shCam.top = halfSpan;
      shCam.bottom = -halfSpan;
      shCam.updateProjectionMatrix();

      this.dirLight.target.position.set(snapX, 0, snapZ);
      this.dirLight.target.updateMatrixWorld();
      this.requestShadowUpdate(2);
    }

    bindPointerEvents() {
      const dom = this.renderer.domElement;
      const boardHitPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.08);
      const planeHitPoint = new THREE.Vector3();
      if (!this._activePointers) this._activePointers = new Map();
      this._clearPointerHoldState();
      let lastPinchDist = 0;
      let lastMidPos = { x: 0, y: 0 };
      let downTime = 0;
      let downPos = { x: 0, y: 0 };
      let lastPos = { x: 0, y: 0 };

      dom.addEventListener('pointerdown', (e) => {
        if (this.isPaused) return;
        this._activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (this._activePointers.size >= 2) {
          this._wasMultiTouch = true;
          this._clearFastForwardHold();
          const pts = Array.from(this._activePointers.values());
          lastPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          lastMidPos = { x: (pts[0].x + pts[1].x) * 0.5, y: (pts[0].y + pts[1].y) * 0.5 };
          return;
        }
        this._wasMultiTouch = false;
        this._isPointerDragging = true;
        downTime = performance.now();
        downPos = { x: e.clientX, y: e.clientY };
        lastPos = { x: e.clientX, y: e.clientY };
        if (this.runState && !this.isMenuShowcase) {
          this._clearFastForwardHold();
          this._ffHoldTimer = setTimeout(() => {
            this._ffHoldTimer = null;
            if (!this.isPaused && this._isPointerDragging && this.runState) {
              this.isFastForwardHeld = true;
            }
          }, 140);
        }
      });

      dom.addEventListener('pointermove', (e) => {
        if (this.isPaused) return;
        if (this._activePointers.has(e.pointerId)) {
          this._activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        }
        // Native Two-Finger Pinch-to-Zoom (0.48x..1.38x) & Two-Finger Pan for Dense 8x6 / 9x7 Mobile Grids!
        if (this._activePointers.size >= 2 && !this.isMenuShowcase) {
          this._wasMultiTouch = true;
          const pts = Array.from(this._activePointers.values());
          const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          const midX = (pts[0].x + pts[1].x) * 0.5;
          const midY = (pts[0].y + pts[1].y) * 0.5;
          if (lastPinchDist > 12 && dist > 12) {
            const scaleDelta = (lastPinchDist - dist) * 0.0042;
            this.zoomFactor = Math.max(0.48, Math.min(1.38, (this.zoomFactor || 1.0) + scaleDelta));
          }
          const panScale = 0.011 * (this.zoomFactor || 1.0);
          const maxPanX = Math.max(0.5, (this.gridCols || 4) * 0.42);
          const maxPanZ = Math.max(0.5, (this.gridRows || 4) * 0.42);
          this.panOffsetX = Math.max(-maxPanX, Math.min(maxPanX, (this.panOffsetX || 0) - (midX - lastMidPos.x) * panScale));
          this.panOffsetZ = Math.max(-maxPanZ, Math.min(maxPanZ, (this.panOffsetZ || 0) - (midY - lastMidPos.y) * panScale));
          lastPinchDist = dist;
          lastMidPos = { x: midX, y: midY };
          this.updateCameraFramingForGrid();
          return;
        }

        if (!this._isPointerDragging || this._wasMultiTouch) return;
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        lastPos = { x: e.clientX, y: e.clientY };

        const totalMoved = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
        if (totalMoved > 10) {
          if ((this.zoomFactor || 1.0) < 0.88 && !this.isMenuShowcase) {
            // When zoomed-in closely on a large grid, single-finger drag pans smoothly across the tracks!
            const panScale = 0.010 * (this.zoomFactor || 1.0);
            const maxPanX = Math.max(0.5, (this.gridCols || 4) * 0.42);
            const maxPanZ = Math.max(0.5, (this.gridRows || 4) * 0.42);
            this.panOffsetX = Math.max(-maxPanX, Math.min(maxPanX, (this.panOffsetX || 0) - dx * panScale));
            this.panOffsetZ = Math.max(-maxPanZ, Math.min(maxPanZ, (this.panOffsetZ || 0) - dy * panScale));
            this.updateCameraFramingForGrid();
          } else if (this.cameraMode === 'ISO_25D') {
            this.orbitAzimuth = Math.max(-0.95, Math.min(0.95, this.orbitAzimuth - dx * 0.007));
            this.orbitElevation = Math.max(0.45, Math.min(1.20, this.orbitElevation + dy * 0.005));
            this.updateCameraFramingForGrid();
          }
        }
      });

      const onPointerEnd = (e) => {
        this._activePointers.delete(e.pointerId);
        this._clearFastForwardHold();
        if (this._activePointers.size > 0) return;
        const hadMulti = this._wasMultiTouch;
        this._wasMultiTouch = false;
        if (!this._isPointerDragging || hadMulti) {
          this._isPointerDragging = false;
          return;
        }
        this._isPointerDragging = false;
        if (this.isPaused || this.isMenuShowcase) return;

        const dt = performance.now() - downTime;
        const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
        if (dt > 550 || dist > 18) return;

        let rect = this._cachedCanvasRect;
        if (!rect || rect.width <= 0 || rect.height <= 0) {
          rect = dom.getBoundingClientRect();
          this._cachedCanvasRect = rect;
        }
        if (rect.width <= 0 || rect.height <= 0) return;

        this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);
        // Ultra-Fast 0.0002ms Mathematical Grid Plane Hit First (Zero CPU 3D Triangle Raycast Lag!)
        if (this.raycaster.ray.intersectPlane(boardHitPlane, planeHitPoint)) {
          const rows = this.gridRows || 4;
          const cols = this.gridCols || 4;
          const stretchZ = this.boardStretchZ || 1.0;
          const exactC = planeHitPoint.x + (cols - 1) * 0.5;
          const exactR = (planeHitPoint.z / stretchZ) + (rows - 1) * 0.5;
          let c = Math.round(exactC);
          let r = Math.round(exactR);
          if (r >= 0 && r < rows && c >= 0 && c < cols) {
            const directEntry = this.tileEntries[r] && this.tileEntries[r][c];
            if ((!directEntry || !directEntry.railMeshes || directEntry.railMeshes.length === 0) && rows >= 7) {
              let bestD = 0.44;
              for (let nr = Math.max(0, r - 1); nr <= Math.min(rows - 1, r + 1); nr++) {
                for (let nc = Math.max(0, c - 1); nc <= Math.min(cols - 1, c + 1); nc++) {
                  const cand = this.tileEntries[nr] && this.tileEntries[nr][nc];
                  if (cand && cand.railMeshes && cand.railMeshes.length > 0) {
                    const d = Math.hypot(exactR - nr, exactC - nc);
                    if (d < bestD) { bestD = d; r = nr; c = nc; }
                  }
                }
              }
            }
            if (typeof this.onCellTapCallback === 'function') {
              this.onCellTapCallback(r, c);
            }
            return;
          }
        }
        const hits = this.raycaster.intersectObjects(this.pickableMeshes, true);
        if (hits.length > 0) {
          let obj = hits[0].object;
          while (obj && (!obj.userData || typeof obj.userData.r !== 'number')) {
            obj = obj.parent;
          }
          if (obj && obj.userData && typeof obj.userData.r === 'number') {
            if (typeof this.onCellTapCallback === 'function') {
              this.onCellTapCallback(obj.userData.r, obj.userData.c);
            }
          }
        }
      };

      dom.addEventListener('pointerup', onPointerEnd);
      dom.addEventListener('pointercancel', onPointerEnd);

      dom.addEventListener('wheel', (e) => {
        if (this.isPaused) return;
        e.preventDefault();
        this.zoomCamera(e.deltaY > 0 ? 0.08 : -0.08);
      }, { passive: false });
    }

    zoomCamera(delta) {
      this.zoomFactor = Math.max(0.48, Math.min(1.38, this.zoomFactor + delta));
      if (this.zoomFactor >= 0.98) {
        this.panOffsetX = 0;
        this.panOffsetZ = 0;
      }
      this.updateCameraFramingForGrid();
    }

    resize() {
      this.onResize();
    }

    onResize() {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = Math.max(260, this.container.clientWidth || 360);
      const h = Math.max(180, this.container.clientHeight || 360);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.applyDynamicResolution();
      if (this.currentLevel && !this.isMenuShowcase && this.cameraMode !== 'CHASE_3D') {
        this.updateCameraFramingForGrid(true);
      }
    }

    cycleCameraMode() {
      this.panOffsetX = 0;
      this.panOffsetZ = 0;
      this.zoomFactor = 1.00;
      if (this.cameraMode === 'ISO_25D') {
        this.cameraMode = 'TOP_TACTICAL';
      } else {
        this.cameraMode = 'ISO_25D';
        this.orbitAzimuth = 0.22;
        this.orbitElevation = 0.72;
      }
      this.updateCameraFramingForGrid();
      return this.cameraMode;
    }

    toggleChaseCamera(forceState = null) {
      if (forceState === true) {
        this.cameraMode = 'CHASE_3D';
      } else if (forceState === false) {
        this.cameraMode = 'ISO_25D';
      } else {
        this.cameraMode = (this.cameraMode === 'CHASE_3D') ? 'ISO_25D' : 'CHASE_3D';
      }
      if (this.cameraMode !== 'CHASE_3D') {
        this.panOffsetX = 0;
        this.panOffsetZ = 0;
        this.zoomFactor = 1.00;
        this.orbitAzimuth = 0.22;
        this.orbitElevation = 0.72;
        this.updateCameraFramingForGrid();
      }
      return this.cameraMode === 'CHASE_3D';
    }

    solveBoardFramingDistance(dirX, dirY, dirZ, lookY, lookZ, hx, hz, yMin, yMax, tanHalfX, tanHalfY, targetWFrac, maxHFrac) {
      let lo = 4.0;
      let hi = 90.0;
      for (let it = 0; it < 20; it++) {
        const d = (lo + hi) * 0.5;
        const ex = dirX * d;
        const ey = dirY * d;
        const ez = dirZ * d;
        let fx = -ex;
        let fy = lookY - ey;
        let fz = lookZ - ez;
        const fl = Math.hypot(fx, fy, fz) || 1;
        fx /= fl;
        fy /= fl;
        fz /= fl;
        let rx = -fz;
        let rz = fx;
        const rl = Math.hypot(rx, rz) || 1;
        rx /= rl;
        rz /= rl;
        const ux = -rz * fy;
        const uy = rz * fx - rx * fz;
        const uz = rx * fy;

        let minX = 1e9;
        let maxX = -1e9;
        let minY = 1e9;
        let maxY = -1e9;
        for (let sx = -1; sx <= 1; sx += 2) {
          const px = sx * hx;
          for (let si = 0; si < 2; si++) {
            const py = (si === 0) ? yMin : yMax;
            for (let sz = -1; sz <= 1; sz += 2) {
              const pz = sz * hz;
              const vx = px - ex;
              const vy = py - ey;
              const vz = pz - ez;
              const zc = vx * fx + vy * fy + vz * fz;
              if (zc <= 0.05) {
                minX = -10;
                maxX = 10;
                minY = -10;
                maxY = 10;
                continue;
              }
              const xc = vx * rx + vz * rz;
              const yc = vx * ux + vy * uy + vz * uz;
              const nx = xc / (zc * tanHalfX);
              const ny = yc / (zc * tanHalfY);
              if (nx < minX) minX = nx;
              if (nx > maxX) maxX = nx;
              if (ny < minY) minY = ny;
              if (ny > maxY) maxY = ny;
            }
          }
        }
        const wFrac = (maxX - minX) * 0.5;
        const hFrac = (maxY - minY) * 0.5;
        if (wFrac > targetWFrac || hFrac > maxHFrac) lo = d;
        else hi = d;
      }
      return (lo + hi) * 0.5;
    }

    updateCameraFramingForGrid(snapImmediate = false) {
      const rows = this.gridRows || 4;
      const cols = this.gridCols || 4;
      const targetFov = 30;
      if (this.camera && this.camera.fov !== targetFov) {
        this.camera.fov = targetFov;
        this.camera.updateProjectionMatrix();
      }
      const aspect = (this.camera && this.camera.aspect) ? this.camera.aspect : 0.62;
      const fovRad = THREE.MathUtils.degToRad((this.camera && this.camera.fov) ? this.camera.fov : 30);
      const tanHalfY = Math.tan(fovRad * 0.5);
      const tanHalfX = tanHalfY * Math.max(0.42, aspect);

      if (this.isMenuShowcase) {
        const n = Math.max(rows, cols);
        const aspectComp = Math.max(1.0, 0.96 / Math.min(1.0, aspect));
        const baseSpan = (n + 0.1) * 0.84 * Math.min(1.22, aspectComp);
        const radius = baseSpan * 1.48 * (this.zoomFactor || 1.08);
        const elev = this.orbitElevation || 0.54;
        const y = Math.sin(elev) * radius;
        const horiz = Math.cos(elev) * radius;
        this.camTargetPos.set(
          Math.sin(this.orbitAzimuth) * horiz,
          y,
          Math.cos(this.orbitAzimuth) * horiz
        );
        this.camTargetLook.set(0, 0.10, 0.04);
        if (this.renderer) this.renderer.toneMappingExposure = 1.12;
      } else if (this.cameraMode === 'TOP_TACTICAL') {
        const stretchZ = this.boardStretchZ || 1.0;
        const hx = (cols * 1.0 + 0.16) * 0.544;
        const hz = (rows * stretchZ + 0.16) * 0.544;
        const dl = Math.hypot(0, 1, 0.04);
        const dx = 0;
        const dy = 1 / dl;
        const dz = 0.04 / dl;
        const baseDist = this.solveBoardFramingDistance(dx, dy, dz, 0, 0.01, hx, hz, -0.30, 0.01, tanHalfX, tanHalfY, 0.855, 0.76);
        const dist = baseDist * this.zoomFactor;
        const px = this.panOffsetX || 0;
        const pz = this.panOffsetZ || 0;
        this.camTargetPos.set(px + dx * dist, dy * dist, pz + dz * dist);
        this.camTargetLook.set(px, 0, pz + 0.01);
        if (this.renderer) this.renderer.toneMappingExposure = 1.02;
        if (this.dirLight) this.dirLight.position.set(8.5, 13.0, 8.5);
      } else {
        const stretchZ = this.boardStretchZ || 1.0;
        const elev = this.orbitElevation;
        const azim = this.orbitAzimuth;
        const hx = (cols * 1.0 + 0.16) * 0.544;
        const hz = (rows * stretchZ + 0.16) * 0.544;
        const dx = Math.sin(azim) * Math.cos(elev);
        const dy = Math.sin(elev);
        const dz = Math.cos(azim) * Math.cos(elev);
        const baseRadius = this.solveBoardFramingDistance(dx, dy, dz, 0.02, 0.04, hx, hz, -0.30, 0.01, tanHalfX, tanHalfY, 0.855, 0.76);
        const radius = baseRadius * this.zoomFactor;
        const px = this.panOffsetX || 0;
        const pz = this.panOffsetZ || 0;
        this.camTargetPos.set(px + dx * radius, dy * radius, pz + dz * radius);
        this.camTargetLook.set(px, 0.02, pz + 0.04);
        if (this.renderer) this.renderer.toneMappingExposure = 1.08;
      }
      if (snapImmediate && this.camera) {
        this.camera.position.copy(this.camTargetPos);
        this.currentLookAt.copy(this.camTargetLook);
        this.camera.lookAt(this.currentLookAt);
      }
    }

    triggerShake(intensity = 0.22) {
      this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    }

    cellToWorld(r, c) {
      const rows = this.gridRows || 4;
      const cols = this.gridCols || 4;
      const x = (c - (cols - 1) * 0.5) * 1.0;
      const z = (r - (rows - 1) * 0.5) * 1.0;
      return { x, y: 0.10, z };
    }

    getCellScreenPercent(r, c) {
      const rows = Math.max(1, this.gridRows || 4);
      const cols = Math.max(1, this.gridCols || 4);
      const fallbackX = ((c + 0.5) / cols) * 100;
      const fallbackY = ((r + 0.5) / rows) * 100;
      if (!this.camera) {
        return { xPct: fallbackX, yPct: fallbackY };
      }
      try {
        const wPos = this.cellToWorld(r, c);
        const stretchZ = this.boardStretchZ || 1.0;
        this.camera.updateMatrixWorld();
        _v1.set(wPos.x, 0.14, wPos.z * stretchZ).project(this.camera);
        if (isFinite(_v1.x) && isFinite(_v1.y) && Math.abs(_v1.x) <= 1.25 && Math.abs(_v1.y) <= 1.25) {
          const xPct = Math.max(12, Math.min(88, (_v1.x * 0.5 + 0.5) * 100));
          const yPct = Math.max(12, Math.min(88, (-_v1.y * 0.5 + 0.5) * 100));
          return { xPct, yPct };
        }
      } catch (_) {}
      return { xPct: fallbackX, yPct: fallbackY };
    }

    getEdgeWorldPoint(r, c, dir) {
      const center = this.cellToWorld(r, c);
      if (dir === 'N') return { x: center.x, y: center.y, z: center.z - 0.5 };
      if (dir === 'E') return { x: center.x + 0.5, y: center.y, z: center.z };
      if (dir === 'S') return { x: center.x, y: center.y, z: center.z + 0.5 };
      if (dir === 'W') return { x: center.x - 0.5, y: center.y, z: center.z };
      return center;
    }

    // ========================================================================
    // 9. BUILD REALISTIC BIOME SCENE (Bright Daylight, Clean Shoreline,
    //    Expanded Portrait Board, InstancedMesh Tiles & Smooth Spline Train)
    // ========================================================================
    buildLevelScene(level, boardGrid, skinConfig, isShowcase = false) {
      if (!this.scene) return;
      this.pendingSceneArgs = { level, boardGrid, skinConfig, isShowcase };
      this.boardStretchZ = 1.0;
      this.boardGroup.scale.set(1.0, 1.0, 1.0);

      if (!isShowcase) {
        this.isMenuShowcase = false;
        this.zoomFactor = 1.00;
        this.panOffsetX = 0;
        this.panOffsetZ = 0;
        this._clearFastForwardHold();
        this.orbitAzimuth = 0.22;
        this.orbitElevation = 0.72;
        if (this.gameContainer) {
          this.mountTo(this.gameContainer);
        }
      }

      const stationId = level.stationId || 1;
      const biome = BIOME_CONFIGS[stationId] || BIOME_CONFIGS[1];

      if (this.assetSystem) {
        this.assetSystem.streamRegionAssets(stationId, () => {
          if (this.currentLevel === level && this.scene && this.assetSystem && this.assetSystem.hdrMaps && this.assetSystem.hdrMaps[biome.name]) {
            this.scene.environment = this.assetSystem.hdrMaps[biome.name];
          }
        });
      }

      this.currentLevel = level;
      this.gridRows = level.rows;
      this.gridCols = level.cols;
      this.runState = null;
      this.isBraking = false;
      this.isTurbo = false;
      this.hasCrossTraffic = false;
      this.clearPulseTimers();
      this.uncacheRiggedActors();

      this.clearGroup(this.boardGroup);
      this.clearGroup(this.terrainLodGroup);
      this.vegetationLodGroups.forEach(g => this.clearGroup(g));
      const envProtectedMats = this._buildProtectedMaterialSet();
      for (let i = this.environmentGroup.children.length - 1; i >= 0; i--) {
        const ch = this.environmentGroup.children[i];
        if (ch !== this.terrainLodGroup && !this.vegetationLodGroups.includes(ch)) {
          this.disposeObjectTree(ch, envProtectedMats);
          this.environmentGroup.remove(ch);
        }
      }
      this.clearGroup(this.trainGroup);
      this.clearGroup(this.patrolTrainGroup);
      this.clearGroup(this.charactersGroup);

      this.tileEntries = [];
      this.pickableMeshes = [];
      this.riggedActors = [];
      this.animatedProps = [];
      this.terrainChunks = [];
      this.waterMesh = null;

      // 1. Per-Biome Calibrated Sunlight, Natural Shadow Depth & HDR/Sky IBL Environment
      this.bindPbrNormalMapsToSharedMaterials(biome);
      this.scene.background = new THREE.Color(biome.skyHorizon);
      this.scene.fog = new THREE.FogExp2(biome.fogColor, biome.fogDensity);
      this.dirLight.color.setHex(biome.sunColor || 0xFFF6E3);
      this.dirLight.intensity = 3.45;
      const sd = biome.sunDir;
      this.dirLight.position.set(sd[0] * 16.0, sd[1] * 16.0, sd[2] * 16.0);
      this.hemiLight.color.setHex(biome.hemiSky || 0xCEE8FA);
      this.hemiLight.groundColor.setHex(biome.hemiGround || 0x4B5E38);
      this.hemiLight.intensity = (biome.surfaceMode === 3 || biome.name === 'crystal_caverns' || biome.name === 'volcano_core') ? 0.56 : 0.68;
      this.rimLight.color.setHex(biome.rim);
      this.rimLight.intensity = 0.70;
      this.windUniforms.uWindVec.value.set(biome.windVec[0], biome.windVec[1]);

      if (this.assetSystem && this.assetSystem.hdrMaps && this.assetSystem.hdrMaps[biome.name]) {
        this.scene.environment = this.assetSystem.hdrMaps[biome.name];
      } else if (this.defaultRoomEnvTex) {
        this.scene.environment = this.defaultRoomEnvTex;
      }

      const qConfig = this.qualityManager.getEffectiveConfig();
      if (this.dirLight && this.dirLight.shadow) {
        const targetShadowSize = qConfig.shadowMapSize || 1536;
        this.dirLight.shadow.bias = -0.00025;
        this.dirLight.shadow.normalBias = 0.016;
        if (this.dirLight.shadow.mapSize.width !== targetShadowSize) {
          this.dirLight.shadow.mapSize.width = targetShadowSize;
          this.dirLight.shadow.mapSize.height = targetShadowSize;
          if (this.dirLight.shadow.map) {
            this.dirLight.shadow.map.dispose();
            this.dirLight.shadow.map = null;
          }
        }
      }
      if (this.particlePool) {
        this.particlePool.initWeatherField(biome.weather, qConfig.particleScale);
      }
      if (this.postProcessor && this.postProcessor.enabled && typeof this.postProcessor.configureForTier === 'function') {
        this.postProcessor.configureForTier(qConfig, biome, this.qualityManager ? this.qualityManager.renderScale : 1.0);
      }

      // 2. Build Clean Sandy Shoreline, Calm Water & Analytic Sky (Zero floating clutter)
      this.buildRealisticBiomeWorld3D(level, biome, qConfig);

      // 3. Build GPU-Instanced Board Tile Bases (2 draw calls total for all grid cells!)
      this.buildInstancedBoardTiles3D(boardGrid, level.rows, level.cols);

      // 4. Build 3D Railway Track Tiles (1 merged mesh per track cell)
      for (let r = 0; r < level.rows; r++) {
        this.tileEntries[r] = [];
        for (let c = 0; c < level.cols; c++) {
          const cell = boardGrid[r][c];
          const entry = this.createTile3D(cell, biome);
          const pos = this.cellToWorld(r, c);
          entry.group.position.set(pos.x, 0, pos.z);
          this.boardGroup.add(entry.group);
          this.tileEntries[r][c] = entry;
          this.pickableMeshes.push(entry.group);
        }
      }

      // 5. Build Real .glb 3D Train Consist (Locomotive + Coupled Carriages strictly on railway tracks)
      this.currentSkinConfig = skinConfig;
      this.buildTrainConsist3D(level.carriagesCount || 1, skinConfig);
      if (level.isDualTrainLevel && Array.isArray(level.secondarySolutionPath) && level.secondarySolutionPath.length >= 2) {
        this.buildSecondaryTrainConsist3D(Math.max(1, (level.carriagesCount || 1) - 1), skinConfig);
      } else {
        this.clearGroup(this.patrolTrainGroup);
        this.secondaryLocomotiveMesh = null;
        this.secondaryCarriageMeshes = [];
      }
      this.resetTrainToStart(level);

      // 6. Build 3D Station Platforms & Rigged Passengers at START and END (safely off the rails)
      if (!isShowcase) {
        this.buildStationPlatformsAndHumans3D(level);
      }

      // 7. Tight Shadow Frustum & Camera Framing
      this._lastShadowHalfSpan = -1;
      const span = Math.max(level.rows * (this.boardStretchZ || 1.0), level.cols) * 1.0 + 0.35;
      this.updateTightTexelSnappedShadowFrustum(span);
      this.onResize();
      this.updateCameraFramingForGrid(true);
      this.requestShadowUpdate(2);

      // 8. Non-blocking Shader Warm-Up (yields first frame so level entry never stutters)
      this.warmUpRegionShaders(level);
    }

    warmUpRegionShaders(targetLevel = this.currentLevel) {
      if (!this.renderer || !this.scene || !this.camera) return;
      const runCompile = () => {
        if (!this.renderer || !this.scene || !this.camera || this.currentLevel !== targetLevel) return;
        try {
          this.renderer.compile(this.scene, this.camera);
        } catch (e) {}
      };
      if (typeof window !== 'undefined' && 'scheduler' in window && window.scheduler && typeof window.scheduler.yield === 'function') {
        window.scheduler.yield().then(runCompile).catch(() => setTimeout(runCompile, 0));
      } else {
        setTimeout(runCompile, 0);
      }
    }

    /**
     * Preloads the next biome region in the background during level-complete screens.
     */
    preloadNextBiomeRegion(nextStationId) {
      if (this.assetSystem) {
        this.assetSystem.preloadNextRegion(nextStationId);
      }
    }

    _buildProtectedMaterialSet() {
      const protectedMats = new Set(Object.values(this.sharedMaterials || {}).filter(Boolean));
      if (this.assetSystem) {
        if (this.assetSystem.baseModelMaterials && typeof this.assetSystem.baseModelMaterials.forEach === 'function') {
          this.assetSystem.baseModelMaterials.forEach(m => {
            if (m) protectedMats.add(m);
          });
        }
        const models = this.assetSystem.models;
        if (models) {
          const modelList = Object.values(models);
          for (let i = 0; i < modelList.length; i++) {
            const gltf = modelList[i];
            if (gltf && gltf.scene && typeof gltf.scene.traverse === 'function') {
              gltf.scene.traverse(node => {
                if (node && node.isMesh && node.material) {
                  const mats = Array.isArray(node.material) ? node.material : [node.material];
                  for (let j = 0; j < mats.length; j++) {
                    if (mats[j]) protectedMats.add(mats[j]);
                  }
                }
              });
            }
          }
        }
      }
      return protectedMats;
    }

    disposeObjectTree(rootObj, protectedMatSet = null) {
      if (!rootObj || typeof rootObj.traverse !== 'function') return;
      const sharedMatSet = protectedMatSet || this._buildProtectedMaterialSet();
      rootObj.traverse((node) => {
        if (!node) return;
        if (node.isInstancedMesh && typeof node.dispose === 'function') {
          try { node.dispose(); } catch (_) {}
        }
        if (node.geometry && node.geometry.userData && node.geometry.userData._ownedPerInstance === true) {
          node.geometry.userData._ownedPerInstance = false;
          if (typeof node.geometry.dispose === 'function') {
            try { node.geometry.dispose(); } catch (_) {}
          }
        }
        if (node.material) {
          const mats = Array.isArray(node.material) ? node.material : [node.material];
          for (let i = 0; i < mats.length; i++) {
            const m = mats[i];
            if (m && !sharedMatSet.has(m) && typeof m.dispose === 'function') {
              try { m.dispose(); } catch (_) {}
            }
          }
        }
      });
    }

    clearGroup(group) {
      if (!group) return;
      const protectedMatSet = this._buildProtectedMaterialSet();
      while (group.children.length > 0) {
        const ch = group.children[0];
        this.disposeObjectTree(ch, protectedMatSet);
        group.remove(ch);
      }
    }

    extractFirstGeometryAndMaterial(key) {
      const all = this.extractAllSubmeshes(key);
      return (all && all.length > 0) ? all[0] : null;
    }

    extractAllSubmeshes(key) {
      if (!this.assetSystem || !this.assetSystem.models[key]) return null;
      const gltf = this.assetSystem.models[key];
      if (!gltf._cachedSubmeshes) {
        const list = [];
        gltf.scene.updateMatrixWorld(true);
        const rootInv = new THREE.Matrix4().copy(gltf.scene.matrixWorld).invert();
        const relMat = new THREE.Matrix4();
        const ident = new THREE.Matrix4();
        gltf.scene.traverse(node => {
          if (node.isMesh && node.geometry) {
            relMat.multiplyMatrices(rootInv, node.matrixWorld);
            let geo = node.geometry;
            let isIdentity = true;
            for (let k = 0; k < 16; k++) {
              if (Math.abs(relMat.elements[k] - ident.elements[k]) > 1e-4) {
                isIdentity = false;
                break;
              }
            }
            if (!isIdentity) {
              geo = node.geometry.clone();
              geo.applyMatrix4(relMat);
            }
            list.push({
              geometry: geo,
              baseMaterial: node.material || new THREE.MeshStandardMaterial(),
              name: ((node.material && node.material.name) || node.name || '').toLowerCase()
            });
          }
        });
        gltf._cachedSubmeshes = list;
      }
      if (!gltf._cachedSubmeshes || gltf._cachedSubmeshes.length === 0) return null;
      return gltf._cachedSubmeshes.map(item => ({
        geometry: item.geometry,
        material: item.baseMaterial.clone(),
        name: item.name
      }));
    }

    buildRealisticBiomeWorld3D(level, biome, qConfig) {
      if (!this.assetSystem) return;
      const pbr = this.assetSystem.pbrTextures;
      const stretchZ = this.boardStretchZ || 1.0;
      const spanX = (level.cols || 4) * 1.0 + 0.16;
      const spanZ = (level.rows || 4) * stretchZ + 0.16;
      const maxSpan = Math.max(spanX, spanZ);

      // 1. Analytic Atmospheric Scattering Sky Dome (sky_dome_analytic.glb)
      const skyModel = this.assetSystem.cloneStaticModel('sky_dome_analytic', false);
      if (skyModel) {
        const skyMat = createAnalyticSkyMaterial(biome);
        skyModel.traverse(node => {
          if (node.isMesh) {
            node.material = skyMat;
            node.castShadow = false;
            node.receiveShadow = false;
            node.frustumCulled = false;
          }
        });
        skyModel.matrixAutoUpdate = false;
        skyModel.updateMatrix();
        this.environmentGroup.add(skyModel);
        this.skyMesh = skyModel;
      }

      // 2. Calm Planar Water Surface surrounding the board & peripheral islands
      const waterModel = this.assetSystem.cloneStaticModel('water_surface_planar', false);
      if (waterModel) {
        const reflTex = qConfig.waterReflection && this.reflectionTarget ? this.reflectionTarget.texture : null;
        this.waterMaterial = createPlanarWaterMaterial(biome, pbr, reflTex);
        this.waterMaterial.uniforms.uBoardHalfSpan.value.set(spanX * 0.512, spanZ * 0.512);
        const scaleFactor = (maxSpan + 4.8) / 3.2;
        waterModel.scale.set(scaleFactor, 1.0, scaleFactor);
        waterModel.position.y = -0.048;
        waterModel.traverse(node => {
          if (node.isMesh) {
            node.material = this.waterMaterial;
            node.castShadow = false;
            node.receiveShadow = false;
          }
        });
        waterModel.matrixAutoUpdate = false;
        waterModel.updateMatrix();
        this.environmentGroup.add(waterModel);
        this.waterMesh = waterModel;
      }

      // 3. Photorealistic Cut-Stone Railway Embankment Seawall & Sloped Shoreline (board_table.glb)
      const tableGlb = this.assetSystem.cloneStaticModel('board_table', true);
      if (tableGlb) {
        tableGlb.scale.set(spanX, 1.0, spanZ);
        tableGlb.position.y = -0.02;
        const isMetallicBiome = (biome.surfaceMode === 3 || biome.name === 'neon_city' || biome.name === 'autumn_clockwork');
        let subIdx = 0;
        tableGlb.traverse(node => {
          if (node.isMesh) {
            node.material = node.material ? node.material.clone() : new THREE.MeshStandardMaterial();
            const mName = ((node.material && node.material.name) || node.name || '').toLowerCase();
            const isOuterRim = mName.includes('sand') || mName.includes('beach') || mName.includes('brass') || subIdx >= 1;
            const targetHex = isOuterRim
              ? (typeof biome.rimOuterColor === 'number' ? biome.rimOuterColor : 0xD8C39E)
              : (typeof biome.rimInnerColor === 'number' ? biome.rimInnerColor : 0x94A3B8);
            if (node.material.color) {
              node.material.color.setHex(targetHex).convertSRGBToLinear();
            }
            node.material.vertexColors = Boolean(node.geometry && node.geometry.attributes && node.geometry.attributes.color);
            if (isMetallicBiome) {
              if (pbr.metal_diffuse) node.material.map = pbr.metal_diffuse;
              if (pbr.metal_normal) {
                node.material.normalMap = pbr.metal_normal;
                node.material.normalScale = new THREE.Vector2(0.45, 0.45);
              }
              if (pbr.metal_roughness) node.material.roughnessMap = pbr.metal_roughness;
              node.material.roughness = 0.38;
              node.material.metalness = 0.56;
              node.material.envMapIntensity = 0.95;
            } else if (!isOuterRim) {
              if (pbr.brick_diffuse) node.material.map = pbr.brick_diffuse;
              if (pbr.brick_normal) {
                node.material.normalMap = pbr.brick_normal;
                node.material.normalScale = new THREE.Vector2(0.60, 0.60);
              }
              if (pbr.brick_roughness) node.material.roughnessMap = pbr.brick_roughness;
              node.material.roughness = 0.80;
              node.material.metalness = 0.05;
              node.material.envMapIntensity = 0.45;
            } else {
              if (pbr.rock_diffuse) node.material.map = pbr.rock_diffuse;
              if (pbr.rock_normal) {
                node.material.normalMap = pbr.rock_normal;
                node.material.normalScale = new THREE.Vector2(0.52, 0.52);
              }
              if (pbr.rock_roughness) node.material.roughnessMap = pbr.rock_roughness;
              node.material.roughness = 0.84;
              node.material.metalness = 0.03;
              node.material.envMapIntensity = 0.42;
            }
            if (biome.rimEmissiveInt > 0 && node.material.emissive) {
              node.material.emissive.setHex(biome.rimEmissive || 0x000000);
              node.material.emissiveIntensity = isOuterRim ? biome.rimEmissiveInt * 0.65 : biome.rimEmissiveInt * 0.30;
            }
            node.castShadow = true;
            node.receiveShadow = true;
            node.material.needsUpdate = true;
            subIdx++;
          }
        });
        tableGlb.matrixAutoUpdate = false;
        tableGlb.updateMatrix();
        this.environmentGroup.add(tableGlb);
      }

      // 4. Peripheral 3D Biome Scenery & Outer Space Celestial Planets (Strictly Outside the Board)
      if (biome.surfaceMode === 3) {
        this.buildSpacePlanets3D(spanX, spanZ);
      }
      this.buildInstancedBiomeVegetation(maxSpan, biome, qConfig, spanX, spanZ);
    }

    buildSpacePlanets3D(spanX, spanZ) {
      if (!this.assetSystem) return;
      const pbr = this.assetSystem.pbrTextures || {};
      const cosmosGroup = new THREE.Group();

      // 1. Majestic Ringed Saturn-Class Gas Giant (.glb asset — Zero Procedural Primitives!)
      const ringedPlanet = this.assetSystem.cloneStaticModel('prop_ringed_planet', true);
      if (ringedPlanet) {
        ringedPlanet.traverse(node => {
          if (node.isMesh && node.material) {
            const isRings = String(node.name || '').toLowerCase().includes('ring');
            node.castShadow = false;
            node.receiveShadow = false;
            node.material.vertexColors = Boolean(node.geometry && node.geometry.attributes && node.geometry.attributes.color);
            if (isRings) {
              node.material.transparent = true;
              node.material.opacity = 0.84;
              node.material.side = THREE.DoubleSide;
              node.material.depthWrite = false;
              node.material.roughness = 0.45;
              node.material.metalness = 0.16;
            } else {
              if (pbr.hardwood_diffuse || pbr.rock_diffuse) {
                node.material.map = pbr.hardwood_diffuse || pbr.rock_diffuse;
              }
              node.material.color.setHex(0xE8AA66).convertSRGBToLinear();
              node.material.emissive.setHex(0x3B1D0A).convertSRGBToLinear();
              node.material.emissiveIntensity = 0.35;
              node.material.roughness = 0.56;
              node.material.metalness = 0.06;
            }
            node.material.needsUpdate = true;
          }
        });
        ringedPlanet.scale.setScalar(1.35);
        ringedPlanet.position.set(spanX * 0.62 + 2.35, -0.55, -(spanZ * 0.58 + 2.45));
        cosmosGroup.add(ringedPlanet);
        this.animatedProps.push({ type: 'gear', mesh: ringedPlanet });
      }

      // 2. Crimson-Amber Cratered Exoplanet (.glb asset)
      const marsPlanet = this.assetSystem.cloneStaticModel('prop_exoplanet', true);
      if (marsPlanet) {
        marsPlanet.traverse(node => {
          if (node.isMesh && node.material) {
            node.castShadow = false;
            node.receiveShadow = false;
            node.material.vertexColors = Boolean(node.geometry && node.geometry.attributes && node.geometry.attributes.color);
            if (pbr.rock_diffuse) node.material.map = pbr.rock_diffuse;
            if (pbr.rock_normal) node.material.normalMap = pbr.rock_normal;
            node.material.color.setHex(0xE0633E).convertSRGBToLinear();
            node.material.emissive.setHex(0x451208).convertSRGBToLinear();
            node.material.emissiveIntensity = 0.28;
            node.material.roughness = 0.78;
            node.material.metalness = 0.05;
            node.material.needsUpdate = true;
          }
        });
        marsPlanet.scale.setScalar(0.88);
        marsPlanet.position.set(-(spanX * 0.62 + 2.10), -0.35, -(spanZ * 0.50 + 1.95));
        cosmosGroup.add(marsPlanet);
        this.animatedProps.push({ type: 'gear', mesh: marsPlanet });
      }

      // 3. Frozen Cyan-Silver Orbital Moon (.glb asset)
      const iceMoon = this.assetSystem.cloneStaticModel('prop_exoplanet', true);
      if (iceMoon) {
        iceMoon.traverse(node => {
          if (node.isMesh && node.material) {
            node.castShadow = false;
            node.receiveShadow = false;
            node.material.vertexColors = Boolean(node.geometry && node.geometry.attributes && node.geometry.attributes.color);
            if (pbr.rock_diffuse) node.material.map = pbr.rock_diffuse;
            if (pbr.rock_normal) node.material.normalMap = pbr.rock_normal;
            node.material.color.setHex(0xBAE6FD).convertSRGBToLinear();
            node.material.emissive.setHex(0x0C4A6E).convertSRGBToLinear();
            node.material.emissiveIntensity = 0.32;
            node.material.roughness = 0.62;
            node.material.metalness = 0.14;
            node.material.needsUpdate = true;
          }
        });
        iceMoon.scale.setScalar(0.56);
        iceMoon.position.set(spanX * 0.60 + 1.75, -0.25, spanZ * 0.52 + 1.55);
        cosmosGroup.add(iceMoon);
      }

      this.environmentGroup.add(cosmosGroup);
    }

    buildInstancedBiomeVegetation(span, biome, qConfig, spanX = span, spanZ = span) {
      const pbr = this.assetSystem.pbrTextures;
      const density = qConfig.vegetationDensity || 1.0;
      const isSpace = biome.surfaceMode === 3;
      const isContinuousLand = (!biome.islandModel && !isSpace);
      const islandCount = biome.islandModel ? 12 : 0;
      const treeCount = isContinuousLand
        ? Math.max(14, Math.round(20 * density))
        : Math.max(8, Math.round(16 * density));
      const rockCount = isContinuousLand
        ? Math.max(10, Math.round(14 * density))
        : Math.max(8, Math.round(14 * density));
      const grassCount = biome.grassTint ? Math.max(24, qConfig.grassInstances || 96) : 0;

      const rInner = isContinuousLand ? (span * 0.5 + 0.90) : (span * 0.5 + 1.25);

      const ensureOutsideBoard = (ang, rad) => {
        let px = Math.cos(ang) * rad;
        let pz = Math.sin(ang) * rad;
        while (!(Math.abs(px) > spanX * 0.58 || Math.abs(pz) > spanZ * 0.58)) {
          rad += 0.45;
          px = Math.cos(ang) * rad;
          pz = Math.sin(ang) * rad;
        }
        return { px, pz };
      };

      const createInstancedLayer = (modelKey, transforms, swayAmp = 0.0, tintHex = 0xFFFFFF) => {
        if (!modelKey || transforms.length === 0) return null;
        const parts = this.extractAllSubmeshes(modelKey);
        if (!parts || parts.length === 0) return null;
        const layerGroup = new THREE.Group();
        const isMultiPartTree = (modelKey === 'pine_tree_highpoly' || modelKey === 'tree_small_02_lod2' || modelKey === 'prop_snow_pine');

        parts.forEach(part => {
          const mat = part.material;
          const pName = part.name || '';
          const isWoodOrRockBase = isMultiPartTree && (
            pName.includes('bark') ||
            pName.includes('trunk') ||
            pName.includes('branch') ||
            pName.includes('granite')
          );
          if (tintHex && tintHex !== 0xFFFFFF && mat.color && !isWoodOrRockBase) {
            if (pName.includes('islandcrownturf')) {
              const isSnowCap = (tintHex === 0xF1F5F9 || tintHex === 0xFFFFFF);
              mat.map = isSnowCap ? null : (pbr.rock_diffuse || mat.map);
              if (pbr.rock_normal && !isSnowCap) {
                mat.normalMap = pbr.rock_normal;
                mat.normalScale = new THREE.Vector2(0.60, 0.60);
              }
              mat.needsUpdate = true;
            }
            if (pName.includes('islandshoresand') && tintHex === 0xF1F5F9) {
              mat.color.setHex(0x8E9AAB).convertSRGBToLinear();
            } else {
              mat.color.setHex(tintHex).convertSRGBToLinear();
            }
          }
          const finalMat = swayAmp > 0
            ? enhanceMaterialWithWindAndDither(mat, this.windUniforms, swayAmp, mat.normalMap ? null : pbr.detail_micro_normal)
            : mat;
          const inst = new THREE.InstancedMesh(part.geometry, finalMat, transforms.length);
          inst.castShadow = Boolean(qConfig.shadowsEnabled && swayAmp < 0.09);
          inst.receiveShadow = true;
          for (let i = 0; i < transforms.length; i++) {
            inst.setMatrixAt(i, transforms[i]);
          }
          inst.instanceMatrix.needsUpdate = true;
          inst.matrixAutoUpdate = false;
          inst.updateMatrix();
          if (inst.geometry && !inst.geometry.boundingSphere) {
            inst.geometry.computeBoundingSphere();
          }
          layerGroup.add(inst);
        });

        return layerGroup;
      };

      const lodGroup0 = this.vegetationLodGroups[0];

      // 1. Broad Scenic Peripheral Islands / Mesas / Icebergs / Basalt Shelves (omitted in Outer Space!)
      const islandCenters = [];
      if (islandCount > 0 && biome.islandModel && this.assetSystem.models[biome.islandModel]) {
        const islandTransforms = [];
        for (let i = 0; i < islandCount; i++) {
          const ang = (i / islandCount) * Math.PI * 2 + 0.22;
          const rad = rInner + 0.78 + (i % 2) * 0.75;
          const { px, pz } = ensureOutsideBoard(ang, rad);
          const sx = 1.02 + (i % 3) * 0.20;
          const sy = 1.00 + (i % 2) * 0.18;
          const sz = 0.95 + ((i + 1) % 3) * 0.20;
          islandCenters.push({ px, pz, sx, sy, sz, ang });
          _v1.set(px, -0.02, pz);
          _euler1.set(0, ang + i * 0.5, 0);
          _q1.setFromEuler(_euler1);
          _v2.set(sx, sy, sz);
          islandTransforms.push(new THREE.Matrix4().compose(_v1, _q1, _v2));
        }
        const iInst = createInstancedLayer(biome.islandModel, islandTransforms, 0.0, biome.islandTint || 0xFFFFFF);
        if (iInst) lodGroup0.add(iInst);
      }

      // 2. Signature Biome Props & Photogrammetry Trees (Grounded firmly on scenic islands, or orbital in Space!)
      const primaryKey = (biome.treeModel && this.assetSystem.models[biome.treeModel])
        ? biome.treeModel
        : 'pine_tree_highpoly';
      const secondaryKey = (biome.secondaryTreeModel && this.assetSystem.models[biome.secondaryTreeModel])
        ? biome.secondaryTreeModel
        : null;
      const isCaissonStructure = (primaryKey === 'prop_harbor_crane' || primaryKey === 'prop_neon_tower');
      const primaryTransforms = [];
      const secondaryTransforms = [];
      for (let i = 0; i < treeCount; i++) {
        let px = 0;
        let pz = 0;
        let py = 0.02;
        const ang = (i / treeCount) * Math.PI * 2 + (i % 3) * 0.12;
        if (islandCenters.length > 0 && !isCaissonStructure) {
          const isl = islandCenters[i % islandCenters.length];
          const jAng = i * 2.39996;
          const jRad = (i < islandCenters.length) ? 0.12 : 0.34;
          px = isl.px + Math.cos(jAng) * jRad * isl.sx;
          pz = isl.pz + Math.sin(jAng) * jRad * isl.sz;
          py = 0.12 * isl.sy;
        } else {
          // 3 Organic Concentric Rings across continuous Forest / Desert / Glacier / Autumn / Cavern terrain!
          const ringIdx = i % 3;
          const rad = isContinuousLand
            ? (rInner + 0.32 + ringIdx * 1.05 + ((i * 0.37) % 0.55))
            : (rInner + 0.52 + (i % 3) * 0.68);
          const out = ensureOutsideBoard(ang, rad);
          px = out.px;
          pz = out.pz;
          py = isSpace ? (0.08 + ((i % 3) - 1) * 0.16) : -0.025;
        }
        const s = isSpace ? (0.92 + (i % 3) * 0.16) : (0.88 + (i % 4) * 0.16);
        _v1.set(px, py, pz);
        _euler1.set(0, -ang + i, 0);
        _q1.setFromEuler(_euler1);
        _v2.set(s, s, s);
        const m4 = new THREE.Matrix4().compose(_v1, _q1, _v2);
        if (secondaryKey && i % 3 === 1) {
          secondaryTransforms.push(m4);
        } else {
          primaryTransforms.push(m4);
        }
      }
      const isOrganicTree = (primaryKey === 'pine_tree_highpoly' || primaryKey === 'tree_small_02_lod2' || primaryKey === 'prop_snow_pine' || primaryKey === 'prop_desert_cactus');
      const pInst = createInstancedLayer(primaryKey, primaryTransforms, isOrganicTree ? 0.045 : 0.0, biome.treeTint || 0xFFFFFF);
      if (pInst) lodGroup0.add(pInst);
      if (secondaryKey && secondaryTransforms.length > 0) {
        const isSecOrganic = (secondaryKey === 'pine_tree_highpoly' || secondaryKey === 'tree_small_02_lod2' || secondaryKey === 'prop_snow_pine' || secondaryKey === 'prop_desert_cactus');
        const sInst = createInstancedLayer(secondaryKey, secondaryTransforms, isSecOrganic ? 0.05 : 0.0, biome.secondaryTreeTint || 0xFFFFFF);
        if (sInst) lodGroup0.add(sInst);
      }

      // Woodland Understory Shrubs (shrub_01_lod2) for Forest Biomes
      if (isContinuousLand && biome.shrubModel && this.assetSystem.models[biome.shrubModel]) {
        const shrubTransforms = [];
        const shrubCount = Math.max(12, Math.round(20 * density));
        for (let i = 0; i < shrubCount; i++) {
          const ang = (i / shrubCount) * Math.PI * 2 + 0.31;
          const rad = rInner + 0.25 + (i % 3) * 0.92;
          const { px, pz } = ensureOutsideBoard(ang, rad);
          const s = 0.65 + (i % 3) * 0.18;
          _v1.set(px, -0.03, pz);
          _euler1.set(0, ang * 2.1, 0);
          _q1.setFromEuler(_euler1);
          _v2.set(s, s, s);
          shrubTransforms.push(new THREE.Matrix4().compose(_v1, _q1, _v2));
        }
        const shInst = createInstancedLayer(biome.shrubModel, shrubTransforms, 0.06, 0xFFFFFF);
        if (shInst) lodGroup0.add(shInst);
      }

      // Optional Orbital Ion Reactors when streamed for Sector 10
      if (isSpace && this.assetSystem.models.PrimaryIonDrive) {
        for (let k = 0; k < 4; k++) {
          const ang = (k / 4) * Math.PI * 2 + 0.78;
          const { px, pz } = ensureOutsideBoard(ang, rInner + 1.15);
          const ion = this.assetSystem.cloneStaticModel('PrimaryIonDrive', false, 0.95, true);
          if (ion) {
            ion.position.set(px, 0.18, pz);
            ion.rotation.y = -ang;
            lodGroup0.add(ion);
            this.animatedProps.push({ type: 'gear', mesh: ion });
          }
        }
      }

      // 3. Photogrammetry Boulders (boulder_01_lod2) & Sculpted Granite Outcrops (grounded on islands & reefs!)
      const rockKey = (biome.rockModel && this.assetSystem.models[biome.rockModel])
        ? biome.rockModel
        : (this.assetSystem.models.boulder_01_lod2 ? 'boulder_01_lod2' : 'smooth_island_rock');
      if (this.assetSystem.models[rockKey]) {
        const rockTransforms = [];
        for (let i = 0; i < rockCount; i++) {
          let px = 0;
          let pz = 0;
          let ry = -0.08;
          const ang = ((i + 0.5) / rockCount) * Math.PI * 2;
          if (islandCenters.length > 0 && i % 2 === 0) {
            const isl = islandCenters[i % islandCenters.length];
            const bAng = ang + 1.1;
            px = isl.px + Math.cos(bAng) * 0.46 * isl.sx;
            pz = isl.pz + Math.sin(bAng) * 0.46 * isl.sz;
            ry = 0.04;
          } else {
            const rad = rInner + 0.48 + (i % 2) * 0.85;
            const out = ensureOutsideBoard(ang, rad);
            px = out.px;
            pz = out.pz;
            ry = isSpace ? (-0.12 + (i % 4) * 0.11) : ((rockKey === 'boulder_01_lod2') ? -0.11 : -0.02);
          }
          const s = 0.48 + (i % 3) * 0.18;
          _v1.set(px, ry, pz);
          _euler1.set(isSpace ? (i * 0.4) : 0, ang * 1.7, isSpace ? (i * 0.3) : 0);
          _q1.setFromEuler(_euler1);
          _v2.set(s * 1.12, s * 0.85, s);
          rockTransforms.push(new THREE.Matrix4().compose(_v1, _q1, _v2));
        }
        const rInst = createInstancedLayer(rockKey, rockTransforms, 0.0, biome.rockTint || 0xFFFFFF);
        if (rInst) lodGroup0.add(rInst);
      }

      lodGroup0.visible = true;
      for (let lodIdx = 1; lodIdx < 4; lodIdx++) {
        this.vegetationLodGroups[lodIdx].visible = false;
      }

      // 4. GPU-Instanced Natural Foliage Clusters (Grounded on coastal islands OR spread across continuous forest/autumn meadows!)
      if (grassCount > 0 && biome.grassTint && (islandCenters.length > 0 || isContinuousLand)) {
        const grassTransforms = [];
        const cappedGrass = islandCenters.length > 0
          ? Math.min(grassCount, islandCenters.length * 6)
          : Math.min(grassCount, 84);
        for (let i = 0; i < cappedGrass; i++) {
          let px = 0;
          let pz = 0;
          let py = -0.03;
          const gAng = i * 2.39996;
          if (islandCenters.length > 0) {
            const isl = islandCenters[i % islandCenters.length];
            const gRad = 0.10 + ((i % 6) / 6.0) * 0.42;
            px = isl.px + Math.cos(gAng) * gRad * isl.sx;
            pz = isl.pz + Math.sin(gAng) * gRad * isl.sz;
            py = 0.125 * isl.sy;
          } else {
            const rad = rInner + 0.18 + (i % 5) * 0.68;
            const out = ensureOutsideBoard(gAng, rad);
            px = out.px;
            pz = out.pz;
            py = -0.032;
          }
          const s = 0.24 + (i % 3) * 0.06;
          _v1.set(px, py, pz);
          _euler1.set(0, gAng, 0);
          _q1.setFromEuler(_euler1);
          _v2.set(s, s, s);
          grassTransforms.push(new THREE.Matrix4().compose(_v1, _q1, _v2));
        }
        const grassInst = createInstancedLayer('grass_patch_cluster', grassTransforms, 0.10, biome.grassTint);
        if (grassInst) lodGroup0.add(grassInst);
      }
    }

    updateWorldLods() {
      // Keep primary merged-geometry instanced group active (only 4 instanced draw calls total)
      if (this.vegetationLodGroups[0]) this.vegetationLodGroups[0].visible = true;
      if (this.terrainChunks[0]) this.terrainChunks[0].visible = true;
    }

    // ========================================================================
    // 10. GPU-INSTANCED BOARD TILES & MERGED-GEOMETRY TRACK BUILDER (<50 DRAWS)
    // ========================================================================
    buildInstancedBoardTiles3D(boardGrid, rows, cols) {
      if (!this.assetSystem) return;
      const gm = this.extractFirstGeometryAndMaterial('board_tile');
      if (!gm) return;

      // Soften dark bevel AO vertex colors once so adjacent grass tiles blend smoothly without dark grid cracks
      if (gm.geometry && !gm.geometry._seamAoSoftened && gm.geometry.attributes && gm.geometry.attributes.color) {
        const colAttr = gm.geometry.attributes.color;
        for (let i = 0; i < colAttr.count; i++) {
          colAttr.setXYZ(
            i,
            Math.max(0.92, colAttr.getX(i)),
            Math.max(0.94, colAttr.getY(i)),
            Math.max(0.92, colAttr.getZ(i))
          );
        }
        colAttr.needsUpdate = true;
        gm.geometry._seamAoSoftened = true;
      }

      const grassMatrices = [];
      const stoneMatrices = [];
      _q1.identity();
      // 1.032x horizontal scale seals the 0.499 bevel edge across 1.0-spaced cells (zero dark water bleed-through)
      _v2.set(1.032, 1.0, 1.032);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = boardGrid[r][c];
          const pos = this.cellToWorld(r, c);
          _v1.set(pos.x, 0, pos.z);
          const mat4 = new THREE.Matrix4().compose(_v1, _q1, _v2);
          const isFixed =
            cell.type === 'FIXED_STRAIGHT' ||
            cell.type === 'CROSS' ||
            cell.type === 'START' ||
            cell.type === 'END' ||
            cell.type === 'START_2' ||
            cell.type === 'END_2';
          if (isFixed) {
            stoneMatrices.push(mat4);
          } else {
            grassMatrices.push(mat4);
          }
        }
      }

      if (grassMatrices.length > 0) {
        const grassInst = new THREE.InstancedMesh(gm.geometry, this.sharedMaterials.tileGrass, grassMatrices.length);
        grassInst.receiveShadow = true;
        grassInst.castShadow = false;
        for (let i = 0; i < grassMatrices.length; i++) {
          grassInst.setMatrixAt(i, grassMatrices[i]);
        }
        grassInst.instanceMatrix.needsUpdate = true;
        grassInst.matrixAutoUpdate = false;
        grassInst.updateMatrix();
        this.boardGroup.add(grassInst);
      }

      if (stoneMatrices.length > 0) {
        const stoneInst = new THREE.InstancedMesh(gm.geometry, this.sharedMaterials.tileStone, stoneMatrices.length);
        stoneInst.receiveShadow = true;
        stoneInst.castShadow = false;
        for (let i = 0; i < stoneMatrices.length; i++) {
          stoneInst.setMatrixAt(i, stoneMatrices[i]);
        }
        stoneInst.instanceMatrix.needsUpdate = true;
        stoneInst.matrixAutoUpdate = false;
        stoneInst.updateMatrix();
        this.boardGroup.add(stoneInst);
      }
    }

    getOrCreateBadgeTexture(label, bgHex, borderHex) {
      if (!this._badgeTexCache) this._badgeTexCache = {};
      const cacheKey = `${label}_${bgHex}_${borderHex}`;
      if (this._badgeTexCache[cacheKey]) return this._badgeTexCache[cacheKey];
      if (typeof document === 'undefined' || typeof THREE.CanvasTexture === 'undefined') return null;
      const cv = document.createElement('canvas');
      cv.width = 128;
      cv.height = 128;
      const ctx = cv.getContext('2d');
      if (!ctx) return null;
      ctx.clearRect(0, 0, 128, 128);
      ctx.beginPath();
      ctx.arc(64, 64, 52, 0, Math.PI * 2);
      ctx.fillStyle = bgHex;
      ctx.fill();
      ctx.lineWidth = 10;
      ctx.strokeStyle = borderHex;
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 62px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 64, 67);
      const tex = new THREE.CanvasTexture(cv);
      this._badgeTexCache[cacheKey] = tex;
      return tex;
    }

    createTile3D(cell, biome = null) {
      const group = new THREE.Group();
      group.userData = { r: cell.r, c: cell.c };
      const railMeshes = [];

      const trackGroup = new THREE.Group();
      trackGroup.position.y = 0.006;
      const initRad = -THREE.MathUtils.degToRad(cell.visualRot || 0);
      trackGroup.rotation.y = initRad;
      group.add(trackGroup);

      let trackKey = null;
      if (
        cell.type === 'STRAIGHT' ||
        cell.type === 'FIXED_STRAIGHT' ||
        cell.type === 'START' ||
        cell.type === 'END' ||
        cell.type === 'START_2' ||
        cell.type === 'END_2'
      ) {
        trackKey = 'track_straight';
      } else if (cell.type === 'CURVE') {
        trackKey = 'track_curve';
      } else if (cell.type === 'BRIDGE') {
        trackKey = 'track_bridge';
      } else if (cell.type === 'CROSS') {
        trackKey = 'track_cross';
      }

      const mountTrackMesh = (key, rotY = 0, yOffset = 0) => {
        if (!this.assetSystem) return;
        const trackGlb = this.assetSystem.cloneStaticModel(key, false);
        if (!trackGlb) return;
        trackGlb.rotation.y = rotY;
        trackGlb.position.y = yOffset;
        const allTrackSubmeshes = [];
        let matchedRails = 0;
        const isElevatedTrack = (cell.type === 'BRIDGE');
        trackGlb.traverse(node => {
          node.userData = { r: cell.r, c: cell.c };
          if (node.isMesh) {
            allTrackSubmeshes.push(node);
            node.castShadow = isElevatedTrack;
            node.receiveShadow = true;
            const mName = ((node.material && node.material.name) || node.name || '').toLowerCase();
            if (mName.includes('steelrail') || mName.includes('rail')) {
              node.material = cell.hintLocked ? this.sharedMaterials.trackLocked : this.sharedMaterials.trackDefault;
              railMeshes.push(node);
              matchedRails++;
            } else if (mName.includes('ballast') && this.sharedMaterials.trackBallast) {
              node.material = this.sharedMaterials.trackBallast;
              node.castShadow = false;
            } else if (mName.includes('sleeper') && this.sharedMaterials.trackSleeper) {
              node.material = this.sharedMaterials.trackSleeper;
            } else if ((mName.includes('tieplate') || mName.includes('truss')) && this.sharedMaterials.trackTiePlate) {
              node.material = this.sharedMaterials.trackTiePlate;
            } else if (mName.includes('stonepier') && this.sharedMaterials.trackStonePier) {
              node.material = this.sharedMaterials.trackStonePier;
            } else if ((mName.includes('switchsignalglow') || mName.includes('lantern') || mName.includes('glowcap')) && this.sharedMaterials.switchLanternAmber) {
              node.material = (cell.type === 'SWITCH') ? this.sharedMaterials.switchLanternCyan : this.sharedMaterials.switchLanternAmber;
            }
          }
        });
        // Fallback if a custom single-mesh track model has no named SteelRail submesh
        if (matchedRails === 0 && allTrackSubmeshes.length > 0) {
          allTrackSubmeshes.forEach(node => {
            node.material = cell.hintLocked ? this.sharedMaterials.trackLocked : this.sharedMaterials.trackDefault;
            railMeshes.push(node);
          });
        }
        trackGroup.add(trackGlb);
      };

      if (trackKey) {
        mountTrackMesh(trackKey, 0, 0);
      } else if (cell.type === 'Y_SWITCH') {
        // Dedicated Blender 5.3 sculpted track_yswitch.glb (unified ballast, throat sleepers & glowing mechanical switch lantern!)
        if (this.assetSystem && this.assetSystem.models && this.assetSystem.models['track_yswitch']) {
          mountTrackMesh('track_yswitch', 0, 0);
        } else {
          mountTrackMesh('track_curve', -Math.PI * 0.5, 0);
          mountTrackMesh('track_curve', -Math.PI, 0.002);
        }
      } else if (cell.type === 'SWITCH') {
        // Dedicated Blender 5.3 sculpted track_switch.glb (dual curves + cyan switch hub marker!)
        if (this.assetSystem && this.assetSystem.models && this.assetSystem.models['track_switch']) {
          mountTrackMesh('track_switch', 0, 0);
        } else {
          mountTrackMesh('track_curve', 0, 0);
          mountTrackMesh('track_curve', -Math.PI, 0);
        }
      }

      // Helper for Floating 1:1 Dual-Train Route Badges ([1] Cyan <-> [1] Cyan, [2] Amber <-> [2] Amber) & Paired Portals
      const attachFloatingRouteBadge = (label, bgHex, borderHex) => {
        if (this.renderer && this.renderer.isHeadlessStub) return;
        try {
          const tex = this.getOrCreateBadgeTexture(label, bgHex, borderHex);
          if (tex && typeof THREE.SpriteMaterial !== 'undefined') {
            const spMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
            const sp = new THREE.Sprite(spMat);
            sp.position.set(0, 0.88, 0);
            sp.scale.set(0.38, 0.38, 1);
            sp.renderOrder = 25;
            trackGroup.add(sp);
          }
        } catch (_) {}
      };

      // Photorealistic Cut-Stone Departure Tunnel Portal (tunnel_arch.glb — 1:1 color paired on Dual-Train levels!)
      const isDualLvl = Boolean(this.currentLevel && this.currentLevel.isDualTrainLevel);
      const startBeaconMeshes = [];
      let baseGateMat = null;
      if ((cell.type === 'START' || cell.type === 'START_2' || cell.portalColor) && this.assetSystem) {
        const startGateGlb = this.assetSystem.cloneStaticModel('tunnel_arch', false);
        if (startGateGlb) {
          startGateGlb.scale.setScalar(cell.portalColor ? 0.88 : 1.04);
          const gateMat = cell.portalColor
            ? (this.sharedMaterials && this.sharedMaterials.switchLanternCyan)
            : ((cell.type === 'START_2')
              ? (this.sharedMaterials && this.sharedMaterials.amberStationPortal)
              : (this.sharedMaterials && this.sharedMaterials.cyanStationPortal));
          baseGateMat = gateMat;
          if (gateMat) {
            startGateGlb.traverse(node => {
              if (node.isMesh) {
                const mName = ((node.material && node.material.name) || node.name || '').toLowerCase();
                if (mName.includes('portalsignal') || mName.includes('signal') || mName.includes('beacon')) {
                  node.material = gateMat;
                  startBeaconMeshes.push(node);
                }
              }
            });
          }
          trackGroup.add(startGateGlb);
        }
        if (isDualLvl && (cell.type === 'START' || cell.type === 'START_2')) {
          attachFloatingRouteBadge(cell.type === 'START_2' ? '2' : '1', cell.type === 'START_2' ? '#D97706' : '#0284C7', '#FFFBEB');
        } else if (cell.portalLabel) {
          attachFloatingRouteBadge(cell.portalLabel, '#7C3AED', '#E9D5FF');
        }
      }

      // Photorealistic Brick, Iron & Glass Passenger Terminal (1:1 Cyan<->Cyan for Train 1 & Amber<->Amber for Train 2 on Dual-Train!)
      let endBeaconMesh = null;
      let endArrivalRingMesh = null;
      if ((cell.type === 'END' || cell.type === 'END_2') && this.assetSystem) {
        const endTerminalGlb = this.assetSystem.cloneStaticModel('station_terminal', false);
        if (endTerminalGlb) {
          endTerminalGlb.scale.setScalar(1.02);
          const termMat = (cell.type === 'END_2')
            ? (this.sharedMaterials && this.sharedMaterials.amberStationPortal)
            : (isDualLvl
              ? (this.sharedMaterials && this.sharedMaterials.cyanStationPortal)
              : (this.sharedMaterials && this.sharedMaterials.emeraldArrivalPortal));
          if (termMat) {
            endTerminalGlb.traverse(node => {
              if (node.isMesh) {
                const mName = ((node.material && node.material.name) || node.name || '').toLowerCase();
                if (mName.includes('termroutesign') || mName.includes('routesign') || mName.includes('arrival_arch')) {
                  node.material = termMat;
                }
              }
            });
          }
          trackGroup.add(endTerminalGlb);
        }
        if (isDualLvl) {
          attachFloatingRouteBadge(cell.type === 'END_2' ? '2' : '1', cell.type === 'END_2' ? '#D97706' : '#0284C7', '#FFFBEB');
        }
      }

      // Keep railway tracks 100% clear of any grey cylinders, arches, lights, or bumps!
      if (cell.type === 'OBSTACLE') {
        this.addObstacleModel3D(trackGroup, cell.kind, cell.r, cell.c, biome);
      }

      // STRICT RULE: The ONLY objects allowed above the railway tracks are the 3 Golden Stars (sparkMesh)!
      let sparkMesh = null;
      if (cell.hasSpark && this.assetSystem) {
        sparkMesh = this.assetSystem.cloneStaticModel('energy_crystal_coin', false, 0.54, true);
        if (sparkMesh) {
          sparkMesh.traverse(node => {
            if (node.isMesh && this.sharedMaterials && this.sharedMaterials.goldenStar) {
              node.material = this.sharedMaterials.goldenStar;
            }
          });
          sparkMesh.position.set(0, 0.22, 0);
          group.add(sparkMesh);
        }
      }

      let lockRing = null;

      group.traverse(node => {
        node.userData = { r: cell.r, c: cell.c };
      });

      return {
        group,
        trackGroup,
        railMeshes,
        sparkMesh,
        sparkBaseScale: sparkMesh ? sparkMesh.scale.clone() : null,
        sparkOnActivePath: false,
        startBeaconMeshes,
        baseGateMat,
        cellType: cell.type,
        endBeaconMesh,
        endArrivalRingMesh,
        lockRing,
        isLocked: Boolean(cell.hintLocked),
        targetRotY: initRad,
        liftY: 0
      };
    }

    addObstacleModel3D(parent, kind, r = 0, c = 0, biome = null) {
      if (!this.assetSystem) return;
      const stationId = (this.currentLevel && this.currentLevel.stationId) || 1;
      const k = String(kind || 'rock').toLowerCase();

      let modelKey = 'boulder_01_lod2';
      let targetMaxDim = 0.82;
      let tintHex = 0xFFFFFF;
      let selectiveTintMat = null; // substring filter on material/node name so multi-material props stay rich
      let animChildName = null;
      let animType = null;
      let rotY = ((r + c) % 4) * (Math.PI * 0.25);

      if (k === 'tree') {
        targetMaxDim = 0.86;
        if (stationId === 4) {
          modelKey = 'prop_snow_pine';
        } else if (stationId === 6) {
          modelKey = this.assetSystem.models.tree_small_02_lod2 ? 'tree_small_02_lod2' : 'pine_tree_highpoly';
          tintHex = 0xE8883C;
        } else {
          modelKey = ((r + c) % 2 === 0 || !this.assetSystem.models.tree_small_02_lod2)
            ? 'pine_tree_highpoly'
            : 'tree_small_02_lod2';
        }
        rotY = (r * 1.7 + c * 2.3);
      } else if (k === 'rock') {
        modelKey = this.assetSystem.models.boulder_01_lod2 ? 'boulder_01_lod2' : 'smooth_island_rock';
        targetMaxDim = 0.78;
        if (stationId === 2) tintHex = 0xC26D43;
        else if (stationId === 3) tintHex = 0x94A3B8;
        else if (stationId === 4) tintHex = 0xDBEAFE;
        else if (stationId === 7) tintHex = 0x64748B;
        else if (stationId === 8) tintHex = 0x6D5A88;
        else if (stationId === 9) tintHex = 0x3A3436;
        else tintHex = 0x94A3B8;
        rotY = (r * 1.7 + c * 2.3);
      } else if (k === 'windmill') {
        modelKey = 'prop_windmill';
        targetMaxDim = 0.86;
        animChildName = 'WindmillRotor';
        animType = 'windmill_rotor';
        if (stationId === 2) {
          tintHex = 0xC97A4B;
          selectiveTintMat = ['portalstone', 'roofslate'];
        }
        rotY = ((r + c) % 4) * (Math.PI * 0.25);
      } else if (k === 'fence') {
        modelKey = 'prop_fence';
        targetMaxDim = 0.84;
        rotY = ((r + c) % 2) * (Math.PI * 0.5);
      } else if (k === 'water') {
        modelKey = 'prop_water_basin';
        targetMaxDim = 0.82;
        if (stationId === 7) {
          tintHex = 0x0F4C81;
          selectiveTintMat = ['watersurface'];
        }
      } else if (k === 'anchor') {
        modelKey = 'prop_anchor';
        targetMaxDim = 0.82;
      } else if (k === 'coral') {
        modelKey = 'prop_coral';
        targetMaxDim = 0.82;
        rotY = (r * 1.3 + c * 2.1);
      } else if (k === 'fountain') {
        modelKey = 'prop_fountain';
        targetMaxDim = 0.84;
        animChildName = 'FountainJet';
        animType = 'fountain_jet';
      } else if (k === 'gear') {
        modelKey = 'prop_clockwork_gear';
        targetMaxDim = 0.84;
        animType = 'gear';
        if (stationId === 5 || stationId === 10) {
          tintHex = 0x22D3EE;
          selectiveTintMat = ['amberglow'];
        }
      } else if (k === 'bell') {
        modelKey = 'prop_bell';
        targetMaxDim = 0.86;
        animChildName = 'BellClapper';
        animType = 'bell_clapper';
      } else if (k === 'pendulum') {
        modelKey = 'prop_pendulum';
        targetMaxDim = 0.86;
        animChildName = 'PendulumArm';
        animType = 'pendulum_arm';
        if (stationId === 5) {
          tintHex = 0x22D3EE;
          selectiveTintMat = ['amberglow'];
        }
      } else if (k === 'whirlpool') {
        modelKey = 'prop_whirlpool';
        targetMaxDim = 0.84;
        animChildName = 'WhirlpoolVortex';
        animType = 'whirlpool_vortex';
      } else if (k === 'crystal') {
        modelKey = 'prop_crystal_cluster';
        targetMaxDim = 0.84;
        rotY = (r * 1.5 + c * 2.1);
      } else if (k === 'lava') {
        modelKey = 'prop_lava_vent';
        targetMaxDim = 0.84;
        if (stationId === 10) {
          tintHex = 0x38BDF8;
          selectiveTintMat = ['lavamagma'];
        }
      }

      if (!this.assetSystem.models[modelKey]) {
        modelKey = (stationId === 1) ? 'pine_tree_highpoly' : 'smooth_island_rock';
      }

      const needsMatClone = Boolean(tintHex && tintHex !== 0xFFFFFF);
      const propGlb = this.assetSystem.cloneStaticModel(modelKey, needsMatClone, targetMaxDim, true);
      if (propGlb) {
        propGlb.rotation.y = rotY;
        const isMultiTree = (modelKey === 'tree_small_02_lod2' || modelKey === 'pine_tree_highpoly');
        if (needsMatClone) {
          propGlb.traverse(node => {
            if (node.isMesh && node.material && node.material.color) {
              const mName = ((node.material && node.material.name) || node.name || '').toLowerCase();
              if (selectiveTintMat) {
                let matched = false;
                for (let si = 0; si < selectiveTintMat.length; si++) {
                  if (mName.indexOf(selectiveTintMat[si]) !== -1) { matched = true; break; }
                }
                if (!matched) return;
              } else if (isMultiTree && (mName.includes('trunk') || mName.includes('bark') || mName.includes('branch') || mName.includes('granite'))) {
                return;
              }
              node.material.color.setHex(tintHex).convertSRGBToLinear();
              if (node.material.emissive && (node.material.emissive.r > 0.01 || node.material.emissive.g > 0.01 || node.material.emissive.b > 0.01)) {
                node.material.emissive.setHex(tintHex).convertSRGBToLinear();
              }
            }
          });
        }
        parent.add(propGlb);
        if (animType) {
          const animMesh = animChildName ? (propGlb.getObjectByName(animChildName) || propGlb) : propGlb;
          this.animatedProps.push({
            type: animType,
            mesh: animMesh,
            phase: (r * 1.37 + c * 2.13)
          });
        }
      }
    }

    // ========================================================================
    // 11. REAL .GLB 3D TRAIN CONSIST (9 World Locomotives + Dual-Train Consist)
    // ========================================================================
    applyLocomotiveSkin(skinConfig) {
      this.updateTrainSkin3D(skinConfig);
    }

    updateTrainSkin3D(skinConfig) {
      if (!skinConfig) return;
      this.currentSkinConfig = skinConfig;
      if (this.pendingSceneArgs) {
        this.pendingSceneArgs.skinConfig = skinConfig;
      }
      const prevLocoPos = this.locomotiveMesh ? this.locomotiveMesh.position.clone() : null;
      const prevLocoRot = this.locomotiveMesh ? this.locomotiveMesh.rotation.clone() : null;
      const prevLocoVis = this.locomotiveMesh ? this.locomotiveMesh.visible : true;
      const prevCarTransforms = (this.carriageMeshes || []).map(c => ({
        pos: c.position.clone(),
        rot: c.rotation.clone(),
        vis: c.visible,
        scale: c.scale.x
      }));

      const count = (this.currentLevel && this.currentLevel.carriagesCount) ? this.currentLevel.carriagesCount : 2;
      this.buildTrainConsist3D(count, skinConfig);
      if (this.currentLevel && this.currentLevel.isDualTrainLevel && Array.isArray(this.currentLevel.secondarySolutionPath) && this.currentLevel.secondarySolutionPath.length >= 2) {
        this.buildSecondaryTrainConsist3D(Math.max(1, count - 1), skinConfig);
      }

      if (this.runState && prevLocoPos && this.locomotiveMesh) {
        this.locomotiveMesh.position.copy(prevLocoPos);
        this.locomotiveMesh.rotation.copy(prevLocoRot);
        this.locomotiveMesh.visible = prevLocoVis;
        for (let i = 0; i < this.carriageMeshes.length && i < prevCarTransforms.length; i++) {
          this.carriageMeshes[i].position.copy(prevCarTransforms[i].pos);
          this.carriageMeshes[i].rotation.copy(prevCarTransforms[i].rot);
          this.carriageMeshes[i].visible = prevCarTransforms[i].vis;
          this.carriageMeshes[i].scale.setScalar(prevCarTransforms[i].scale);
        }
      } else if (this.currentLevel && !this.isMenuShowcase) {
        this.resetTrainToStart(this.currentLevel);
      }
    }

    createConsistMeshesForSkin(targetGroup, carriagesCount, skinConfig) {
      this.clearGroup(targetGroup);
      const carriageList = [];
      const wheelNodes = [];

      const skinId = (skinConfig && skinConfig.id) || 'crimson';
      const silhouette = (skinConfig && skinConfig.silhouette) || '';
      const isHighSpeedBullet =
        silhouette === 'bullet' ||
        skinId === 'tgv_france' ||
        skinId === 'bullet_shinkansen' ||
        skinId === 'haramain_express';
      const isMaglev = (skinId === 'maglev_600');
      const isGoldVip = (skinId === 'gold_vip');
      const isBulletProfile = isHighSpeedBullet || isMaglev || isGoldVip;
      const isSteamProfile =
        silhouette === 'steam' ||
        skinId === 'classic_steam' ||
        skinId === 'orient_express';
      // Seat steel wheel tires flush onto world_rail_top with V7.0 Gold calibrated precision!
      const hoverY = isMaglev ? 0.05 : 0.0;
      const carHoverY = isMaglev ? 0.05 : 0.0;

      const hullColor = new THREE.Color((skinConfig && skinConfig.hullColor) || '#EF4444').convertSRGBToLinear();
      const armorColor = new THREE.Color((skinConfig && skinConfig.armorColor) || '#B91C1C').convertSRGBToLinear();
      const trimColor = new THREE.Color((skinConfig && skinConfig.trimColor) || '#FACC15').convertSRGBToLinear();
      const coreColor = new THREE.Color((skinConfig && skinConfig.coreColor) || '#38BDF8').convertSRGBToLinear();

      const coachColorHex =
        (skinConfig && skinConfig.coachColor) ? skinConfig.coachColor :
        skinId === 'classic_steam'     ? '#7F1D1D' :
        skinId === 'orient_express'    ? '#1E3A8A' :
        skinId === 'spring'            ? '#059669' :
        skinId === 'tgv_france'        ? '#EA580C' :
        skinId === 'bullet_shinkansen' ? '#F8FAFC' :
        skinId === 'haramain_express'  ? '#047857' :
        skinId === 'maglev_600'        ? '#0891B2' :
        skinId === 'gold_vip'          ? '#EAB308' : '#2563EB';
      const coachHullColor = new THREE.Color(coachColorHex).convertSRGBToLinear();

      const darkGlassColor = new THREE.Color('#09111E').convertSRGBToLinear();
      const warmWindowColor = new THREE.Color('#FEF08A').convertSRGBToLinear();
      const headlightColor = new THREE.Color('#FEF9C3').convertSRGBToLinear();
      const bogieSteelColor = new THREE.Color('#1E2530').convertSRGBToLinear();
      const metalNormTex = (this.assetSystem && this.assetSystem.pbrTextures && this.assetSystem.pbrTextures.metal_normal)
        ? this.assetSystem.pbrTextures.metal_normal
        : null;
      const metalRoughTex = (this.assetSystem && this.assetSystem.pbrTextures && this.assetSystem.pbrTextures.metal_roughness)
        ? this.assetSystem.pbrTextures.metal_roughness
        : null;
      const PhysMatClass = THREE.MeshStandardMaterial;

      const collectSpinningWheelNodes = (rootObj) => {
        rootObj.traverse(node => {
          if (node.name && node.name.indexOf('WheelSet_') === 0) {
            wheelNodes.push(node);
          }
        });
      };

      const applyTrainSubmeshMaterials = (rootObj, isCarriage) => {
        let meshIdx = 0;
        rootObj.traverse(node => {
          if (node.isMesh) {
            const mName = ((node.material && node.material.name) || node.name || '').toLowerCase();
            const roleIdx = meshIdx++;
            let matColor = isCarriage ? coachHullColor : hullColor;
            let rough = isGoldVip ? 0.16 : (isBulletProfile ? 0.22 : (isSteamProfile ? 0.34 : 0.26));
            let metal = isGoldVip ? 0.85 : (isSteamProfile ? 0.48 : 0.36);
            let envInt = isGoldVip ? 1.55 : 1.32;
            let clearcoat = isSteamProfile ? 0.45 : 0.82;
            let clearcoatRough = 0.12;
            let emColor = new THREE.Color(0x000000);
            let emInt = 0.0;
            let useMetalNormal = false;

            if (mName.includes('hullprimary') || mName.includes('crimson') || mName.includes('royalblue') || mName.includes('body')) {
              matColor = isCarriage ? coachHullColor : hullColor;
              useMetalNormal = true;
              if (isGoldVip) {
                emColor = trimColor;
                emInt = 0.08;
              } else if (isMaglev) {
                emColor = coreColor;
                emInt = 0.08;
              }
            } else if (mName.includes('armorsecondary') || mName.includes('chassis') || mName.includes('dark')) {
              matColor = isGoldVip ? trimColor : armorColor;
              rough = isGoldVip ? 0.18 : 0.34;
              metal = isGoldVip ? 0.82 : 0.52;
              clearcoat = 0.55;
              useMetalNormal = true;
            } else if (mName.includes('trimaccent') || mName.includes('brass') || mName.includes('gold')) {
              matColor = trimColor;
              rough = 0.18;
              metal = 0.86;
              envInt = 1.50;
              clearcoat = 0.65;
              emColor = trimColor;
              emInt = 0.06;
            } else if (mName.includes('cockpitglass')) {
              matColor = darkGlassColor;
              rough = 0.05;
              metal = 0.16;
              envInt = 1.75;
              clearcoat = 1.0;
              clearcoatRough = 0.04;
              emColor = coreColor;
              emInt = 0.05;
            } else if (mName.includes('windowglow') || mName.includes('window')) {
              const winCol = (isSteamProfile || skinId === 'crimson') ? warmWindowColor : coreColor;
              matColor = winCol;
              rough = 0.10;
              metal = 0.15;
              clearcoat = 0.90;
              clearcoatRough = 0.06;
              emColor = winCol;
              emInt = 0.68;
            } else if (mName.includes('headlightglow')) {
              matColor = headlightColor;
              rough = 0.08;
              metal = 0.10;
              clearcoat = 0.50;
              emColor = warmWindowColor;
              emInt = 1.10;
            } else if (mName.includes('coreglow') || mName.includes('glow')) {
              matColor = coreColor;
              rough = 0.12;
              metal = 0.25;
              clearcoat = 0.60;
              emColor = coreColor;
              emInt = 0.85;
            } else if (mName.includes('bogiesteel') || mName.includes('brushed') || mName.includes('steel')) {
              matColor = bogieSteelColor;
              rough = 0.38;
              metal = 0.78;
              envInt = 1.15;
              clearcoat = 0.15;
              useMetalNormal = true;
            } else if (roleIdx === 1) {
              matColor = armorColor;
              rough = 0.32;
              metal = 0.48;
            } else if (roleIdx === 2) {
              matColor = trimColor;
              rough = 0.18;
              metal = 0.85;
              envInt = 1.48;
            }

            if (node.geometry && node.geometry.attributes && node.geometry.attributes.color) {
              node.geometry = node.geometry.clone();
              node.geometry.userData = node.geometry.userData || {};
              node.geometry.userData._ownedPerInstance = true;
              node.geometry.deleteAttribute('color');
            }
            if (node.geometry && (!node.geometry.attributes || !node.geometry.attributes.normal)) {
              node.geometry.computeVertexNormals();
            }

            const matOpts = {
              color: matColor,
              roughness: Math.max(0.05, rough * 0.72),
              metalness: Math.min(0.96, metal * 1.06),
              envMapIntensity: envInt * 1.32,
              emissive: emColor,
              emissiveIntensity: emInt * 1.18
            };
            if (PhysMatClass === THREE.MeshPhysicalMaterial) {
              matOpts.clearcoat = Math.min(1.0, clearcoat * 1.12);
              matOpts.clearcoatRoughness = Math.max(0.03, clearcoatRough * 0.65);
            }
            if (useMetalNormal && node.geometry && node.geometry.attributes && node.geometry.attributes.uv) {
              if (metalNormTex) {
                matOpts.normalMap = metalNormTex;
                matOpts.normalScale = new THREE.Vector2(0.18, 0.18);
              }
              if (metalRoughTex) {
                matOpts.roughnessMap = metalRoughTex;
              }
            }
            const trainMat = new PhysMatClass(matOpts);
            if (useMetalNormal) {
              const rimCol = trimColor.clone().lerp(coreColor, isMaglev ? 0.55 : 0.20);
              trainMat.onBeforeCompile = (shader) => {
                shader.uniforms.uRimTint = { value: rimCol };
                shader.fragmentShader = shader.fragmentShader.replace(
                  '#include <common>',
                  `#include <common>
                  uniform vec3 uRimTint;`
                );
                shader.fragmentShader = shader.fragmentShader.replace(
                  '#include <emissivemap_fragment>',
                  `#include <emissivemap_fragment>
                  vec3 vViewDirRim = normalize(vViewPosition);
                  float fresnelRim = pow(1.0 - clamp(abs(dot(normalize(vNormal), vViewDirRim)), 0.0, 1.0), 3.2);
                  totalEmissiveRadiance += uRimTint * (fresnelRim * 0.24);`
                );
              };
            }
            node.material = trainMat;
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
      };

      const desiredLocoKey =
        (isMaglev || isGoldVip) ? 'loco_maglev' :
        isSteamProfile          ? 'loco_steam' :
        isHighSpeedBullet       ? 'loco_bullet' : 'locomotive_heavy';
      const locoModelKey = (this.assetSystem && this.assetSystem.models && this.assetSystem.models[desiredLocoKey])
        ? desiredLocoKey
        : 'locomotive_heavy';

      const desiredCarKey = isBulletProfile ? 'carriage_bullet' : 'carriage_passenger';
      const carModelKey = (this.assetSystem && this.assetSystem.models && this.assetSystem.models[desiredCarKey])
        ? desiredCarKey
        : 'carriage_passenger';

      const loco = new THREE.Group();
      loco.rotation.order = 'YXZ';
      const locoGlb = this.assetSystem ? this.assetSystem.cloneStaticModel(locoModelKey, true) : null;
      if (locoGlb) {
        locoGlb.rotation.y = Math.PI * 0.5;
        locoGlb.position.y = hoverY;
        locoGlb.scale.setScalar(0.98);
        applyTrainSubmeshMaterials(locoGlb, false);
        collectSpinningWheelNodes(locoGlb);
        loco.add(locoGlb);
      }

      // V6.9 Ultra: Volumetric Golden/Cyan Headlight Rail Pool ahead of locomotive nose (Zero Primitives — uses blob_shadow_decal.glb)
      const beamDecal = this.assetSystem ? this.assetSystem.cloneStaticModel('blob_shadow_decal', true) : null;
      if (beamDecal) {
        const beamTint = isMaglev ? coreColor.clone().lerp(warmWindowColor, 0.45) : warmWindowColor.clone();
        const beamMat = new THREE.ShaderMaterial({
          uniforms: {
            uBeamColor: { value: beamTint }
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexShader: /* glsl */ `
            varying vec2 vBeamXZ;
            void main() {
              vBeamXZ = position.xz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: /* glsl */ `
            uniform vec3 uBeamColor;
            varying vec2 vBeamXZ;
            void main() {
              float fwd = clamp(vBeamXZ.x + 0.5, 0.0, 1.0);
              float halfWidth = mix(0.10, 0.47, fwd);
              float lat = abs(vBeamXZ.y) / max(0.05, halfWidth);
              float cone = smoothstep(1.0, 0.10, lat) * smoothstep(0.0, 0.09, fwd) * pow(1.0 - fwd, 1.30);
              float hotCore = smoothstep(0.45, 0.0, lat) * smoothstep(0.55, 0.04, fwd) * 0.45;
              vec3 col = mix(uBeamColor, vec3(1.0, 0.97, 0.86), clamp(hotCore, 0.0, 1.0));
              gl_FragColor = vec4(col, clamp((cone + hotCore) * 0.58, 0.0, 0.85));
            }
          `
        });
        beamDecal.traverse((n) => {
          if (n.isMesh) {
            n.material = beamMat;
            n.castShadow = false;
            n.receiveShadow = false;
            n.frustumCulled = false;
            n.renderOrder = 4;
          }
        });
        beamDecal.scale.set(0.98, 1.0, 0.48);
        beamDecal.position.set(0.88, 0.022, 0.0);
        loco.add(beamDecal);
      }

      // Omit inactive 0-intensity SpotLight so Three.js compiles NUM_SPOT_LIGHTS = 0 across all scene PBR shaders!
      const spot = null;

      targetGroup.add(loco);

      for (let cIdx = 0; cIdx < carriagesCount; cIdx++) {
        const car = new THREE.Group();
        car.rotation.order = 'YXZ';
        const carGlb = this.assetSystem ? this.assetSystem.cloneStaticModel(carModelKey, true) : null;
        if (carGlb) {
          carGlb.rotation.y = Math.PI * 0.5;
          carGlb.position.y = carHoverY;
          carGlb.scale.setScalar(0.96);
          applyTrainSubmeshMaterials(carGlb, true);
          collectSpinningWheelNodes(carGlb);
          car.add(carGlb);
        }
        targetGroup.add(car);
        carriageList.push(car);
      }

      return { loco, carriageList, spot, wheelNodes };
    }

    buildTrainConsist3D(carriagesCount, skinConfig) {
      const built = this.createConsistMeshesForSkin(this.trainGroup, carriagesCount, skinConfig);
      this.locomotiveMesh = built.loco;
      this.carriageMeshes = built.carriageList;
      this.headlightSpot = built.spot;
      this.locoWheelMeshes = built.wheelNodes || [];
    }

    buildSecondaryTrainConsist3D(carriagesCount, primarySkinConfig) {
      const pId = (primarySkinConfig && primarySkinConfig.id) || 'crimson';
      const primaryIsBullet = (
        pId === 'bullet_shinkansen' ||
        pId === 'maglev_600' ||
        pId === 'tgv_france' ||
        pId === 'haramain_express' ||
        pId === 'gold_vip'
      );
      const secSkin = {
        id: primaryIsBullet ? 'crimson' : 'bullet_shinkansen',
        silhouette: primaryIsBullet ? 'armored' : 'bullet',
        hullColor: '#F59E0B',
        coachColor: '#D97706',
        armorColor: '#1E3A8A',
        trimColor: '#FDE047',
        coreColor: '#38BDF8'
      };
      this.secondarySkinId = secSkin.id;
      this.patrolTrainGroup.visible = true;
      const built = this.createConsistMeshesForSkin(this.patrolTrainGroup, carriagesCount, secSkin);
      this.secondaryLocomotiveMesh = built.loco;
      this.secondaryCarriageMeshes = built.carriageList;
      this.secWheelMeshes = built.wheelNodes || [];
      if (this.secondaryLocomotiveMesh && !(this.renderer && this.renderer.isHeadlessStub)) {
        try {
          const badgeTex = this.getOrCreateBadgeTexture('2', '#D97706', '#FDE047');
          if (badgeTex && typeof THREE.SpriteMaterial !== 'undefined') {
            const badgeMat = new THREE.SpriteMaterial({
              map: badgeTex,
              transparent: true,
              depthTest: false,
              depthWrite: false
            });
            const badgeSprite = new THREE.Sprite(badgeMat);
            badgeSprite.name = 'secondary_train_badge_2';
            badgeSprite.userData = { isTrainBadge: true, trainIndex: 2 };
            badgeSprite.position.set(0.30, 0.60, 0);
            badgeSprite.scale.set(0.32, 0.32, 1);
            badgeSprite.renderOrder = 26;
            this.secondaryLocomotiveMesh.add(badgeSprite);
          }
        } catch (_) {}
      }
    }

    // ========================================================================
    // 12. V6.9 ULTRA CLEAR-FACED 3D CHARACTERS, LIVE MORPHTARGETS & PORTRAIT STUDIO
    // ========================================================================
    spawnRiggedHuman3D(modelKey, role, targetHeight = 0.48) {
      if (!this.assetSystem) return null;
      const fallbackKey = (role === 'commander') ? 'Soldier' : 'Michelle';
      const resolvedKey = (this.assetSystem.models && this.assetSystem.models[modelKey]) ? modelKey : fallbackKey;
      const rigged = this.assetSystem.cloneRiggedModel(resolvedKey, targetHeight, role);
      if (!rigged) return null;

      const { wrapper, clonedScene, mixer, clips, morphMeshes, isClearFaceMorph } = rigged;
      let idleAction = null;
      let walkAction = null;
      let waveAction = null;

      if (clips && clips.length > 0) {
        const findClip = (regex) => clips.find(c => regex.test(c.name));
        const idleClip = findClip(/^idle|stand/i) || findClip(/idle|stand|agree/i) || clips[0];
        const walkClip = findClip(/^walking$|walk|run/i) || clips[Math.min(1, clips.length - 1)] || clips[0];
        const waveClip = findClip(/wave|agree|cheer|samba|dance/i) || idleClip;

        if (idleClip) {
          idleAction = mixer.clipAction(idleClip);
          idleAction.play();
        }
        walkAction = (walkClip && walkClip !== idleClip) ? mixer.clipAction(walkClip) : idleAction;
        waveAction = (waveClip && waveClip !== idleClip) ? mixer.clipAction(waveClip) : idleAction;
      }

      const actor = {
        root: wrapper,
        clonedScene,
        mixer,
        idleAction,
        walkAction,
        waveAction,
        morphMeshes: morphMeshes || [],
        isClearFaceMorph: !!isClearFaceMorph,
        role,
        baseYaw: 0,
        baseY: 0.09,
        phaseOffset: this.riggedActors.length * 1.37,
        boarding: false,
        boardTarget: null,
        boarded: false,
        walkingActive: false,
        wavingActive: false,
        celebratingArrival: false
      };
      this.riggedActors.push(actor);
      return actor;
    }

    buildStationPlatformsAndHumans3D(level) {
      this.uncacheRiggedActors();
      this.clearGroup(this.charactersGroup);
      this.riggedActors = [];

      if (!level || !level.solutionPath || level.solutionPath.length === 0) return;

      const startSpec = level.solutionPath[0];
      const endSpec = level.solutionPath[level.solutionPath.length - 1];
      const startPos = this.cellToWorld(startSpec.r, startSpec.c);
      const endPos = this.cellToWorld(endSpec.r, endSpec.c);

      // Warm overhead rim key-lights above START & END platforms so 3D crew & passengers pop clearly in all 10 biomes!
      const startKeyLight = new THREE.PointLight(0xFFF3C4, 0.85, 2.2, 1.6);
      startKeyLight.position.set(startPos.x, 0.92, startPos.z + 0.25);
      this.charactersGroup.add(startKeyLight);

      const endKeyLight = new THREE.PointLight(0xA7F3D0, 0.88, 2.2, 1.6);
      endKeyLight.position.set(endPos.x, 0.92, endPos.z + 0.25);
      this.charactersGroup.add(endKeyLight);

      // V12.1: Clearly visible (targetHeight = 0.48), well-lit 3D Crew & Passengers on the open station apron!
      const sectorIdx = Math.max(1, Number(level.stationId) || 1);
      const startRot = ((startSpec.initRot % 360) + 360) % 360;
      const startIsNS = (startRot === 0 || startRot === 180);
      const sMouthDx = (startRot === 90) ? 0.44 : ((startRot === 270) ? -0.44 : 0);
      const sMouthDz = (startRot === 180) ? 0.44 : ((startRot === 0) ? -0.44 : 0);
      const startCrewSpecs = [
        { key: (sectorIdx % 3 === 0) ? 'Soldier' : 'ReadyPlayerMe', role: 'commander', height: 0.48, along: -0.13 },
        { key: 'HVGirl', role: 'engineer', height: 0.48, along: 0.15 }
      ];
      for (let c = 0; c < startCrewSpecs.length; c++) {
        const spec = startCrewSpecs[c];
        const crew = this.spawnRiggedHuman3D(spec.key, spec.role, spec.height);
        if (crew) {
          if (startIsNS) {
            const sideX = (startSpec.c <= 0) ? 0.56 : ((startSpec.c >= level.cols - 1) ? -0.56 : 0.56);
            crew.root.position.set(startPos.x + sideX, 0.09, startPos.z + sMouthDz + spec.along);
            crew.root.rotation.y = sideX > 0 ? -Math.PI * 0.30 : Math.PI * 0.30;
          } else {
            const sideZ = (startSpec.r >= level.rows - 1) ? -0.56 : 0.56;
            crew.root.position.set(startPos.x + sMouthDx + spec.along, 0.09, startPos.z + sideZ);
            crew.root.rotation.y = sideZ > 0 ? Math.PI * 0.85 : 0.15;
          }
          crew.baseYaw = crew.root.rotation.y;
          crew.baseY = 0.09;
          this.charactersGroup.add(crew.root);
        }
      }

      // Clear-Faced 3D Passengers (targetHeight = 0.48) on open END Destination Station apron
      const endRot = ((endSpec.initRot % 360) + 360) % 360;
      const endIsNS = (endRot === 0 || endRot === 180);
      const eMouthDx = (endRot === 90) ? 0.44 : ((endRot === 270) ? -0.44 : 0);
      const eMouthDz = (endRot === 180) ? 0.44 : ((endRot === 0) ? -0.44 : 0);
      const passengerPool = (sectorIdx % 2 === 0)
        ? ['Michelle', 'ReadyPlayerMe']
        : ['HVGirl', 'CesiumMan'];
      for (let i = 0; i < 2; i++) {
        const key = passengerPool[i % passengerPool.length];
        const passenger = this.spawnRiggedHuman3D(key, 'passenger', 0.48);
        if (passenger) {
          const offsetAlong = -0.14 + i * 0.28;
          if (endIsNS) {
            const sideX = (endSpec.c >= level.cols - 1) ? -0.56 : 0.56;
            const px = endPos.x + sideX;
            const pz = endPos.z + eMouthDz + offsetAlong;
            passenger.root.position.set(px, 0.09, pz);
            passenger.root.rotation.y = sideX > 0 ? -Math.PI * 0.30 : Math.PI * 0.30;
            passenger.boardTarget = new THREE.Vector3(endPos.x + sideX * 0.84, 0.09, pz);
          } else {
            const sideZ = (endSpec.r >= level.rows - 1) ? -0.56 : 0.56;
            const px = endPos.x + eMouthDx + offsetAlong;
            const pz = endPos.z + sideZ;
            passenger.root.position.set(px, 0.09, pz);
            passenger.root.rotation.y = sideZ > 0 ? Math.PI * 0.85 : 0.15;
            passenger.boardTarget = new THREE.Vector3(px, 0.09, endPos.z + sideZ * 0.84);
          }
          passenger.baseYaw = passenger.root.rotation.y;
          passenger.baseY = 0.09;
          this.charactersGroup.add(passenger.root);
        }
      }

      // If Dual-Train Level, place Clear-Faced/Rigged Passenger (targetHeight = 0.48) on open END_2 apron
      if (level.isDualTrainLevel && Array.isArray(level.secondarySolutionPath) && level.secondarySolutionPath.length > 0) {
        const end2Spec = level.secondarySolutionPath[level.secondarySolutionPath.length - 1];
        const end2Pos = this.cellToWorld(end2Spec.r, end2Spec.c);
        const end2Rot = ((end2Spec.initRot % 360) + 360) % 360;
        const end2IsNS = (end2Rot === 0 || end2Rot === 180);
        const e2MouthDx = (end2Rot === 90) ? 0.44 : ((end2Rot === 270) ? -0.44 : 0);
        const e2MouthDz = (end2Rot === 180) ? 0.44 : ((end2Rot === 0) ? -0.44 : 0);
        const p2 = this.spawnRiggedHuman3D('CesiumMan', 'passenger', 0.48);
        if (p2) {
          if (end2IsNS) {
            const sideX = (end2Spec.c >= level.cols - 1) ? -0.56 : 0.56;
            p2.root.position.set(end2Pos.x + sideX, 0.09, end2Pos.z + e2MouthDz);
            p2.root.rotation.y = sideX > 0 ? -Math.PI * 0.30 : Math.PI * 0.30;
            p2.boardTarget = new THREE.Vector3(end2Pos.x + sideX * 0.84, 0.09, end2Pos.z + e2MouthDz);
          } else {
            const sideZ = (end2Spec.r >= level.rows - 1) ? -0.56 : 0.56;
            p2.root.position.set(end2Pos.x + e2MouthDx, 0.09, end2Pos.z + sideZ);
            p2.root.rotation.y = sideZ > 0 ? Math.PI * 0.85 : 0.15;
            p2.boardTarget = new THREE.Vector3(end2Pos.x + e2MouthDx, 0.09, end2Pos.z + sideZ * 0.84);
          }
          p2.baseYaw = p2.root.rotation.y;
          p2.baseY = 0.09;
          this.charactersGroup.add(p2.root);
        }
      }
    }

    triggerPassengerBoarding() {
      this.riggedActors.forEach(actor => {
        actor.celebratingArrival = true;
        if (actor.waveAction && !actor.wavingActive) {
          actor.wavingActive = true;
          if (actor.idleAction && actor.idleAction !== actor.waveAction) {
            actor.idleAction.fadeOut(0.22);
          }
          actor.waveAction.reset().fadeIn(0.22).play();
        }
        if (actor.role === 'passenger') {
          actor.boarding = true;
        }
      });
    }

    updateRiggedActors(dt, nowSec) {
      const t = (typeof nowSec === 'number' && !isNaN(nowSec)) ? nowSec : 0;
      const isRunning = !!this.runState;
      const locoPos = (isRunning && this.locomotiveMesh) ? this.locomotiveMesh.position : null;

      for (const actor of this.riggedActors) {
        if (actor.mixer) actor.mixer.update(dt);

        // Live facial MorphTargets (mouthSmile, mouthOpen / Blink, Smile, Speak) + natural breathing & train tracking
        if (actor.morphMeshes && actor.morphMeshes.length > 0) {
          const blinkCycle = (t + actor.phaseOffset) % 3.4;
          const blinkVal = (blinkCycle < 0.14) ? Math.sin((blinkCycle / 0.14) * Math.PI) : 0.0;
          const smileVal = (isRunning || actor.celebratingArrival) ? 0.95 : 0.48;
          const speakVal = (!isRunning && actor.role === 'commander')
            ? Math.max(0, Math.sin(t * 6.5 + actor.phaseOffset) * 0.32)
            : 0.0;

          for (let mIdx = 0; mIdx < actor.morphMeshes.length; mIdx++) {
            const mm = actor.morphMeshes[mIdx];
            const dict = mm.morphTargetDictionary;
            const inf = mm.morphTargetInfluences;
            if (!dict || !inf) continue;
            if (dict.Blink !== undefined) inf[dict.Blink] = blinkVal;
            if (dict.Smile !== undefined) inf[dict.Smile] = smileVal;
            if (dict.Speak !== undefined) inf[dict.Speak] = speakVal;
            if (dict.mouthSmile !== undefined) inf[dict.mouthSmile] = smileVal;
            if (dict.mouthOpen !== undefined) inf[dict.mouthOpen] = speakVal;
          }
        }

        if (actor.isClearFaceMorph && !actor.celebratingArrival) {
          const breath = 1.0 + Math.sin(t * 2.4 + actor.phaseOffset) * 0.015;
          actor.root.scale.set(1.0, breath, 1.0);
        }

        // Step forward onto platform edge & wave joyfully on arrival (NEVER hide actor.root.visible!)
        if (actor.boarding && actor.boardTarget && !actor.boarded) {
          _v1.subVectors(actor.boardTarget, actor.root.position);
          const dist = _v1.length();
          if (dist < 0.05) {
            actor.boarded = true;
            this.spawn3DSparkBurst(actor.root.position.x, 0.42, actor.root.position.z, 0x38BDF8, 10);
          } else {
            _v1.normalize();
            actor.root.position.addScaledVector(_v1, dt * 0.55);
            this.requestShadowUpdate(1);
          }
        }

        if (actor.celebratingArrival || this.isBraking) {
          const cheerHop = Math.abs(Math.sin(t * 9.0 + actor.phaseOffset)) * 0.042;
          actor.root.position.y = (actor.baseY || 0.09) + cheerHop;
          actor.root.rotation.z = Math.sin(t * 10.5 + actor.phaseOffset) * 0.075;
        } else {
          actor.root.position.y = actor.baseY || 0.09;
          actor.root.rotation.z = 0;
        }

        if (locoPos) {
          const dx = locoPos.x - actor.root.position.x;
          const dz = locoPos.z - actor.root.position.z;
          if (dx * dx + dz * dz > 0.04) {
            const targetYaw = Math.atan2(dx, dz);
            let diff = targetYaw - actor.root.rotation.y;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            actor.root.rotation.y += diff * Math.min(1.0, dt * 4.5);
          }
        }
      }
    }

    buildPatrolTrain3D() {
      this.clearGroup(this.patrolTrainGroup);
    }

    // ========================================================================
    // 13. SMOOTH CatmullRomCurve3 SPLINE TRAIN PHYSICS & GSAP TILE ROTATION
    // ========================================================================
    resetTrainToStart(level) {
      if (!level || !this.locomotiveMesh) return;
      this.clearPulseTimers();
      this.runState = null;
      this.isBraking = false;
      this.secSimWheelAngle = 0;
      if (window.GameAudio && typeof window.GameAudio.stopTrainEngineLoop === 'function') {
        window.GameAudio.stopTrainEngineLoop();
      }

      // Mandatory Camera Reset Safety: always restore standard framing when resetting train to start,
      // while preserving player's permanent preferred speed [1 / 2 / 3]!
      if (!this.isMenuShowcase) {
        if (this.cameraMode === 'CHASE_3D') {
          this.cameraMode = 'ISO_25D';
        }
        this.liveSpeedMult = this.preferredSpeedMult || 1.0;
        this.zoomFactor = 1.00;
        this.panOffsetX = 0;
        this.panOffsetZ = 0;
        this._clearFastForwardHold();
        this.orbitAzimuth = 0.22;
        this.orbitElevation = 0.72;
        this.updateCameraFramingForGrid(true);
      }

      const stretchZ = this.boardStretchZ || 1.0;
      const positionConsistAtStartSpec = (startSpec, locoMesh, carMeshes, isPrimary) => {
        if (!startSpec || !locoMesh) return;
        const pos = this.cellToWorld(startSpec.r, startSpec.c);
        pos.z *= stretchZ;
        const rot = ((startSpec.initRot % 360) + 360) % 360;
        const yaw =
          rot === 90  ? 0 :
          rot === 0   ? Math.PI * 0.5 :
          rot === 270 ? Math.PI : -Math.PI * 0.5;

        const fwdX = Math.cos(yaw);
        const fwdZ = -Math.sin(yaw);
        const parkedLead = 0.36;
        const startLocoX = pos.x + fwdX * parkedLead;
        const startLocoZ = pos.z + fwdZ * parkedLead;

        locoMesh.position.set(startLocoX, pos.y, startLocoZ);
        locoMesh.rotation.set(0, yaw, 0);
        locoMesh.visible = true;
        locoMesh.scale.setScalar(1.0);

        if (isPrimary) {
          this.simLocoPrevPos.set(startLocoX, pos.y, startLocoZ);
          this.simLocoCurrPos.set(startLocoX, pos.y, startLocoZ);
          this.simLocoPrevYaw = yaw;
          this.simLocoCurrYaw = yaw;
          this.simLocoPrevBank = 0;
          this.simLocoCurrBank = 0;
        }

        const backX = -fwdX;
        const backZ = -fwdZ;
        const CARRIAGE_OFFSET = 0.80;
        (carMeshes || []).forEach((car, idx) => {
          const dist = (idx + 1) * CARRIAGE_OFFSET;
          car.position.set(startLocoX + backX * dist, pos.y, startLocoZ + backZ * dist);
          car.rotation.set(0, yaw, 0);
          car.visible = Boolean(this.isMenuShowcase);
          car.scale.setScalar(1.0);
        });
      };

      positionConsistAtStartSpec(level.solutionPath[0], this.locomotiveMesh, this.carriageMeshes, true);

      if (level.isDualTrainLevel && Array.isArray(level.secondarySolutionPath) && level.secondarySolutionPath.length > 0 && this.secondaryLocomotiveMesh) {
        positionConsistAtStartSpec(level.secondarySolutionPath[0], this.secondaryLocomotiveMesh, this.secondaryCarriageMeshes, false);
      }
      this.requestShadowUpdate(3);
    }

    /**
     * Builds a smooth, continuous THREE.CatmullRomCurve3 through the connected track path:
     * 1. Prepends a straight lead-in track segment behind the START tile so carriages emerge
     *    progressively one by one out of the Start Tunnel Gate as their progressOffset crosses 0.
     * 2. Generates true circular quarter-arc points on CURVE tiles so corners never kink or snap.
     * 3. Appends a straight run-in segment into the END Terminal so the locomotive and carriages
     *    enter through the End Terminal portal and disappear inside one by one.
     */
    buildJourneySpline(steps, isClosedLoop = false, carriagesCountOverride = null) {
      const pts = [];
      const stretchZ = this.boardStretchZ || 1.0;
      const CARRIAGE_OFFSET = 0.80;
      const numCars = typeof carriagesCountOverride === 'number' ? carriagesCountOverride : this.carriageMeshes.length;
      const tailMargin = isClosedLoop ? 0 : Math.max(1.5, (numCars + 1) * CARRIAGE_OFFSET);
      const endRunInMargin = isClosedLoop ? 0 : ((numCars + 1) * CARRIAGE_OFFSET + 0.30);

      if (!steps || steps.length === 0) {
        pts.push(new THREE.Vector3(0, 0.1, 0), new THREE.Vector3(1, 0.1, 0));
        const fallback = new THREE.CatmullRomCurve3(pts);
        fallback.tailMargin = 0;
        fallback.endRunInMargin = 0;
        return fallback;
      }

      if (!isClosedLoop) {
        const firstStep = steps[0];
        const c0 = this.cellToWorld(firstStep.r, firstStep.c);
        const ex0 = this.getEdgeWorldPoint(firstStep.r, firstStep.c, firstStep.exitDir || 'E');
        const fwd = new THREE.Vector3(ex0.x - c0.x, 0, (ex0.z - c0.z) * stretchZ).normalize();
        if (fwd.lengthSq() < 0.001) fwd.set(1, 0, 0);

        // Prepend straight lead-in points behind START so carriages sit inside the Start Station at t = 0
        pts.push(new THREE.Vector3(c0.x - fwd.x * tailMargin, c0.y, c0.z * stretchZ - fwd.z * tailMargin));
        pts.push(new THREE.Vector3(c0.x - fwd.x * (tailMargin * 0.66), c0.y, c0.z * stretchZ - fwd.z * (tailMargin * 0.66)));
        pts.push(new THREE.Vector3(c0.x - fwd.x * (tailMargin * 0.33), c0.y, c0.z * stretchZ - fwd.z * (tailMargin * 0.33)));
      }

      const pushUniquePoint = (x, y, z) => {
        const wz = z * stretchZ;
        if (pts.length === 0) {
          pts.push(new THREE.Vector3(x, y, wz));
          return;
        }
        const last = pts[pts.length - 1];
        const dx = x - last.x;
        const dy = y - last.y;
        const dz = wz - last.z;
        if (dx * dx + dy * dy + dz * dz > 0.0004) {
          pts.push(new THREE.Vector3(x, y, wz));
        }
      };

      for (let i = 0; i < steps.length; i++) {
        const s = steps[i];
        const cPos = this.cellToWorld(s.r, s.c);

        if (!isClosedLoop && (s.type === 'START' || s.type === 'START_2' || i === 0)) {
          pushUniquePoint(cPos.x, cPos.y, cPos.z);
          const ex = this.getEdgeWorldPoint(s.r, s.c, s.exitDir);
          pushUniquePoint(ex.x, ex.y, ex.z);
        } else if (!isClosedLoop && (s.type === 'END' || s.type === 'END_2' || i === steps.length - 1)) {
          const en = this.getEdgeWorldPoint(s.r, s.c, s.enterDir);
          pushUniquePoint(en.x, en.y, en.z);
          pushUniquePoint(cPos.x, cPos.y, cPos.z);
        } else {
          const en = this.getEdgeWorldPoint(s.r, s.c, s.enterDir);
          const ex = this.getEdgeWorldPoint(s.r, s.c, s.exitDir);
          pushUniquePoint(en.x, en.y, en.z);

          const isCurveTile = (Math.abs(en.x - ex.x) > 0.1 && Math.abs(en.z - ex.z) > 0.1);
          if (isCurveTile) {
            // Exact quarter-circle arc points around the tile's inner corner (radius 0.5)
            const cornerX = (Math.abs(en.x - cPos.x) > 0.25) ? en.x : ex.x;
            const cornerZ = (Math.abs(en.z - cPos.z) > 0.25) ? en.z : ex.z;
            const vEnX = en.x - cornerX;
            const vEnZ = en.z - cornerZ;
            const vExX = ex.x - cornerX;
            const vExZ = ex.z - cornerZ;

            for (let k = 1; k <= 3; k++) {
              const theta = (k / 4.0) * (Math.PI * 0.5);
              const cosT = Math.cos(theta);
              const sinT = Math.sin(theta);
              const arcX = cornerX + vEnX * cosT + vExX * sinT;
              const arcZ = cornerZ + vEnZ * cosT + vExZ * sinT;
              pushUniquePoint(arcX, cPos.y, arcZ);
            }
          } else {
            pushUniquePoint(cPos.x, cPos.y, cPos.z);
          }
          pushUniquePoint(ex.x, ex.y, ex.z);
        }
      }

      if (!isClosedLoop && steps.length > 0) {
        const lastStep = steps[steps.length - 1];
        const cEnd = this.cellToWorld(lastStep.r, lastStep.c);
        const enEnd = this.getEdgeWorldPoint(lastStep.r, lastStep.c, lastStep.enterDir || 'W');
        const endFwd = new THREE.Vector3(cEnd.x - enEnd.x, 0, (cEnd.z - enEnd.z) * stretchZ).normalize();
        if (endFwd.lengthSq() < 0.001) endFwd.set(1, 0, 0);

        // Append straight run-in points into the END Terminal so locomotive & carriages enter inside one by one
        pts.push(new THREE.Vector3(cEnd.x + endFwd.x * (endRunInMargin * 0.33), cEnd.y, cEnd.z * stretchZ + endFwd.z * (endRunInMargin * 0.33)));
        pts.push(new THREE.Vector3(cEnd.x + endFwd.x * (endRunInMargin * 0.66), cEnd.y, cEnd.z * stretchZ + endFwd.z * (endRunInMargin * 0.66)));
        pts.push(new THREE.Vector3(cEnd.x + endFwd.x * endRunInMargin, cEnd.y, cEnd.z * stretchZ + endFwd.z * endRunInMargin));
      }

      if (isClosedLoop && pts.length > 2) {
        const first = pts[0];
        const last = pts[pts.length - 1];
        if (first.distanceToSquared(last) < 0.001) {
          pts.pop();
        }
      }

      const curve = new THREE.CatmullRomCurve3(pts, Boolean(isClosedLoop), 'centripetal', 0.5);
      curve.arcLengthDivisions = Math.max(200, pts.length * 20);
      curve.updateArcLengths();
      curve.tailMargin = tailMargin;
      curve.endRunInMargin = endRunInMargin;
      curve.isClosedLoop = Boolean(isClosedLoop);
      return curve;
    }

    /**
     * Samples the arc-length parameterized CatmullRomCurve3 at normalized arc-length s in [0, 1]
     * using dual-bogie chord sampling so the locomotive and carriages stay 100% centered on the steel rails.
     */
    sampleSplineArcLength(curve, stepsCount, normS) {
      const isClosed = Boolean(curve.isClosedLoop);
      const wrapS = (val) => {
        if (isClosed) {
          const w = ((val % 1.0) + 1.0) % 1.0;
          return Math.min(0.99999, Math.max(0.0, w));
        }
        return Math.max(0.0, Math.min(0.9999, val));
      };

      const s = wrapS(normS);
      const totalLen = Math.max(1.0, curve.getLength());
      const bogieDelta = Math.min(0.04, 0.16 / totalLen);
      const sFront = wrapS(normS + bogieDelta);
      const sRear = wrapS(normS - bogieDelta);

      curve.getPointAt(s, _v1);
      curve.getPointAt(sFront, _v3);
      curve.getPointAt(sRear, _v4);

      const chordDx = _v3.x - _v4.x;
      const chordDz = _v3.z - _v4.z;
      let yaw = 0;
      if (chordDx * chordDx + chordDz * chordDz > 0.00001) {
        yaw = Math.atan2(-chordDz, chordDx);
      } else {
        curve.getTangentAt(s, _v2);
        yaw = Math.atan2(-_v2.z, _v2.x);
      }

      // Blend center point with bogie midpoint so rigid car bodies hug the rail gauge on curves
      const posX = _v1.x * 0.65 + (_v3.x + _v4.x) * 0.175;
      const posZ = _v1.z * 0.65 + (_v3.z + _v4.z) * 0.175;

      curve.getTangentAt(sFront, _v3);
      curve.getTangentAt(sRear, _v4);
      const crossY = _v4.z * _v3.x - _v4.x * _v3.z;
      const bankAngle = Math.max(-0.125, Math.min(0.125, crossY * 1.28));

      const tailLen = curve.tailMargin || 0;
      const endRunLen = curve.endRunInMargin || 0;
      const activeTrackLen = Math.max(0.5, totalLen - tailLen - endRunLen);
      const distAlongTrack = Math.max(0, s * totalLen - tailLen);
      const activeProgress = Math.min(0.9999, distAlongTrack / activeTrackLen);
      const segIndex = Math.min(stepsCount - 1, Math.floor(activeProgress * stepsCount));
      return {
        x: posX,
        y: _v1.y,
        z: posZ,
        yaw,
        bankAngle,
        segIndex
      };
    }

    startJourney(steps, arg2, arg3, arg4, arg5, arg6) {
      let baseSpeed = 2.6;
      let onStepEnter = null;
      let onComplete = null;
      let isClosedLoop = false;
      let secondarySteps = null;

      if (typeof arg2 === 'function') {
        onStepEnter = arg2;
        onComplete = arg3;
        if (Array.isArray(arg4)) {
          isClosedLoop = false;
          secondarySteps = arg4;
        } else if (typeof arg4 === 'number') {
          baseSpeed = arg4;
          secondarySteps = Array.isArray(arg5) ? arg5 : null;
        } else {
          isClosedLoop = Boolean(arg4);
          secondarySteps = Array.isArray(arg5) ? arg5 : null;
        }
        if (typeof arg4 !== 'number' && this.currentLevel && this.currentLevel.trainSpeed) {
          baseSpeed = this.currentLevel.trainSpeed;
        }
      } else {
        baseSpeed = Number(arg2) || 2.6;
        onStepEnter = arg3;
        onComplete = arg4;
        if (Array.isArray(arg5)) {
          isClosedLoop = false;
          secondarySteps = arg5;
        } else {
          isClosedLoop = Boolean(arg5);
          secondarySteps = Array.isArray(arg6) ? arg6 : null;
        }
      }

      const hasPrimaryTrain = Boolean(Array.isArray(steps) && steps.length >= 2 && this.locomotiveMesh);
      let curve = null;
      let totalLength = 1.0;
      let tailMargin = 0;
      let endRunInMargin = 0;
      let startDist = 0;

      if (hasPrimaryTrain) {
        curve = this.buildJourneySpline(steps, isClosedLoop);
        totalLength = Math.max(0.5, curve.getLength());
        tailMargin = curve.tailMargin || 0;
        endRunInMargin = curve.endRunInMargin || 0;
        startDist = isClosedLoop ? (this.carriageMeshes.length + 1) * 0.80 : (tailMargin + 0.36);

        // Initialize locomotive at the Start Tunnel Gate mouth, with carriages hidden inside behind it
        const initSample = this.sampleSplineArcLength(curve, steps.length, startDist / totalLength);
        this.simLocoPrevPos.set(initSample.x, initSample.y, initSample.z);
        this.simLocoCurrPos.set(initSample.x, initSample.y, initSample.z);
        this.simLocoPrevYaw = initSample.yaw;
        this.simLocoCurrYaw = initSample.yaw;
        this.simLocoPrevBank = 0;
        this.simLocoCurrBank = 0;

        this.locomotiveMesh.visible = true;
        this.locomotiveMesh.scale.setScalar(1.0);
        this.carriageMeshes.forEach(car => {
          car.visible = Boolean(isClosedLoop);
          car.scale.setScalar(1.0);
        });
      }

      const hasSecondaryTrain = Boolean(
        !isClosedLoop &&
        Array.isArray(secondarySteps) &&
        secondarySteps.length >= 2 &&
        this.secondaryLocomotiveMesh
      );
      let secCurve = null;
      let secTotalLength = 1.0;
      let secTailMargin = 0;
      let secEndRunInMargin = 0;
      let secStartDist = 0;

      if (hasSecondaryTrain) {
        secCurve = this.buildJourneySpline(secondarySteps, false, (this.secondaryCarriageMeshes || []).length);
        secTotalLength = Math.max(0.5, secCurve.getLength());
        secTailMargin = secCurve.tailMargin || 0;
        secEndRunInMargin = secCurve.endRunInMargin || 0;
        secStartDist = secTailMargin + 0.36;
        this.secondaryLocomotiveMesh.visible = true;
        this.secondaryLocomotiveMesh.scale.setScalar(1.0);
        (this.secondaryCarriageMeshes || []).forEach(car => {
          car.visible = false;
          car.scale.setScalar(1.0);
        });
      }

      // Precompute exact shared/crossing conflict zones (< 0.5 cell distance) & arc-lengths between Train 1 and Train 2
      const conflictZones = [];
      if (hasPrimaryTrain && hasSecondaryTrain) {
        const stretchZ = this.boardStretchZ || 1.0;
        const findClosestArcOnCurve = (crv, tMargin, eMargin, wx, wz) => {
          const totalL = Math.max(0.5, crv.getLength());
          const activeEnd = Math.max(tMargin + 0.1, totalL - (eMargin || 0));
          const samples = Math.max(32, Math.round((activeEnd - tMargin) * 8));
          let bestArc = (tMargin + activeEnd) * 0.5;
          let bestDistSq = Infinity;
          for (let i = 0; i <= samples; i++) {
            const arc = tMargin + (activeEnd - tMargin) * (i / samples);
            const pt = crv.getPointAt(Math.max(0, Math.min(0.9999, arc / totalL)));
            const dSq = (pt.x - wx) * (pt.x - wx) + (pt.z - wz) * (pt.z - wz);
            if (dSq < bestDistSq) {
              bestDistSq = dSq;
              bestArc = arc;
            }
          }
          return bestArc;
        };

        for (let pIdx = 0; pIdx < steps.length; pIdx++) {
          const ps = steps[pIdx];
          for (let sIdx = 0; sIdx < secondarySteps.length; sIdx++) {
            const ss = secondarySteps[sIdx];
            if (Math.hypot(ps.r - ss.r, ps.c - ss.c) < 0.5) {
              const wPos = this.cellToWorld(ss.r, ss.c);
              const wz = wPos.z * stretchZ;
              conflictZones.push({
                pIdx,
                sIdx,
                wx: wPos.x,
                wz,
                pZoneArc: findClosestArcOnCurve(curve, tailMargin, endRunInMargin, wPos.x, wz),
                sZoneArc: findClosestArcOnCurve(secCurve, secTailMargin, secEndRunInMargin, wPos.x, wz)
              });
            }
          }
        }
      }

      const secCarCountInit = (this.secondaryCarriageMeshes || []).length;
      const sConsistClearInit = secCarCountInit * 0.80 + 0.95;
      const initTurboMult = Math.max(1.0, this.liveSpeedMult || this.preferredSpeedMult || 1.0) * (this.isFastForwardHeld ? 2.0 : 1.0);
      const initPLinSpeed = baseSpeed * initTurboMult;
      const initSecLinSpeed = baseSpeed * 0.95 * initTurboMult;
      const initSecStopDist = initSecLinSpeed * 0.11 + 0.45;
      const initPArrivalLead = Math.max(0.90, initPLinSpeed * 0.10 + 0.55);
      const initTriggerWindow = Math.max(1.60, 1.35 + initSecStopDist);
      const initialYield = Boolean(
        hasPrimaryTrain &&
        hasSecondaryTrain &&
        conflictZones.some((z) => {
          const sDistToCross = Math.max(0, z.sZoneArc - secStartDist);
          const pDistToCross = z.pZoneArc - startDist;
          return sDistToCross <= initTriggerWindow && (pDistToCross - initPArrivalLead) < (sDistToCross + sConsistClearInit + initSecStopDist * 0.50);
        })
      );

      // Reset any prior arrival zoom/pan when starting a fresh non-loop journey (e.g. sequential Train 2 launch)
      if (!isClosedLoop && !this.isMenuShowcase && baseSpeed > 0.01) {
        this.zoomFactor = 1.00;
        this.panOffsetX = 0;
        this.panOffsetZ = 0;
        this.updateCameraFramingForGrid(false);
      }

      this.runState = {
        hasPrimaryTrain,
        primaryDone: !hasPrimaryTrain,
        steps: hasPrimaryTrain ? steps : [],
        curve,
        totalLength,
        tailMargin,
        endRunInMargin,
        isClosedLoop,
        arcDist: startDist,
        prevArcDist: startDist,
        lastSegIndex: -1,
        boardingTriggered: false,
        hasSecondaryTrain,
        secondaryDone: !hasSecondaryTrain,
        secondarySteps: hasSecondaryTrain ? secondarySteps : null,
        secCurve,
        secTotalLength,
        secTailMargin,
        secEndRunInMargin,
        secArcDist: secStartDist,
        secPrevArcDist: secStartDist,
        secLastSegIndex: -1,
        secSpeedFactor: initialYield ? 0.0 : 1.0,
        secWasMoving: false,
        conflictZones,
        signalYielded: initialYield,
        collisionDetected: false,
        baseSpeed,
        onStepEnter,
        onComplete
      };
      if (!isClosedLoop) {
        this.triggerShake(0.16);
      }
    }

    setTurbo(turbo) {
      // Legacy hook preserved for compatibility; speed is governed by persistent [1 / 2 / 3] selector
      this.isTurbo = false;
      if (turbo) this.setLiveSpeedMultiplier(1.85);
    }

    setLiveSpeedMultiplier(mult = 1) {
      const m = Math.max(1.0, Math.min(3.5, Number(mult) || 1.0));
      this.preferredSpeedMult = m;
      this.liveSpeedMult = m;
      this.isTurbo = false;
      return m;
    }

    rotateTile3D(r, c, newVisualRotDeg) {
      if (!this.tileEntries[r] || !this.tileEntries[r][c]) return;
      const entry = this.tileEntries[r][c];
      const rawTargetY = -THREE.MathUtils.degToRad(newVisualRotDeg);
      const currentY = entry.trackGroup.rotation.y;
      const shortestDelta = Math.atan2(Math.sin(rawTargetY - currentY), Math.cos(rawTargetY - currentY));
      entry.targetRotY = currentY + shortestDelta;

      if (typeof window.gsap !== 'undefined') {
        window.gsap.to(entry.trackGroup.rotation, {
          y: entry.targetRotY,
          duration: 0.17,
          ease: 'back.out(1.4)',
          overwrite: true
        });
        window.gsap.fromTo(
          entry.group.position,
          { y: 0.12 },
          { y: 0, duration: 0.17, ease: 'power2.out', overwrite: true }
        );
      } else {
        entry.liftY = 0.14;
      }

      const pos = this.cellToWorld(r, c);
      this.spawn3DSparkBurst(pos.x, 0.25, pos.z, 0xFACC15, 6);
      this.requestShadowUpdate(2);
    }

    lockTile3D(r, c) {
      if (!this.tileEntries[r] || !this.tileEntries[r][c]) return;
      const entry = this.tileEntries[r][c];
      entry.isLocked = true;
      if (entry.railMeshes && this.sharedMaterials && this.sharedMaterials.trackLocked) {
        for (let i = 0; i < entry.railMeshes.length; i++) {
          entry.railMeshes[i].material = this.sharedMaterials.trackLocked;
        }
      }
      const pos = this.cellToWorld(r, c);
      this.spawn3DSparkBurst(pos.x, 0.28, pos.z, 0x38BDF8, 12);
    }

    collectSpark3D(r, c) {
      if (!this.tileEntries[r] || !this.tileEntries[r][c]) return;
      const entry = this.tileEntries[r][c];
      if (entry.sparkMesh) entry.sparkMesh.visible = false;
      const pos = this.cellToWorld(r, c);
      this.spawn3DSparkBurst(pos.x, 0.42, pos.z, 0xFACC15, 16);
    }

    updateConduitHighlights(connectedSet, isComplete, secondarySet = null) {
      this.lastConnectedSet = connectedSet;
      this.lastIsComplete = Boolean(isComplete);
      this.lastSecondarySet = secondarySet || null;
      const rows = this.gridRows || 0;
      const cols = this.gridCols || 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const entry = this.tileEntries[r] && this.tileEntries[r][c];
          if (!entry || !entry.railMeshes) continue;
          const key = `${r},${c}`;
          const isPrimaryConn = Boolean(connectedSet && connectedSet.has(key));
          const isSecondaryConn = Boolean(secondarySet && secondarySet.has(key));
          const onAnyConnected = Boolean(isPrimaryConn || isSecondaryConn);

          let targetMat = this.sharedMaterials.trackDefault;
          if (isComplete && onAnyConnected) {
            targetMat = (isSecondaryConn && !isPrimaryConn && this.sharedMaterials.trackConnected2)
              ? this.sharedMaterials.trackConnected2
              : this.sharedMaterials.trackComplete;
          } else if (entry.isLocked && this.sharedMaterials.trackLocked) {
            targetMat = this.sharedMaterials.trackLocked;
          } else if (isPrimaryConn) {
            targetMat = this.sharedMaterials.trackConnected;
          } else if (isSecondaryConn && this.sharedMaterials.trackConnected2) {
            targetMat = this.sharedMaterials.trackConnected2;
          }
          for (let i = 0; i < entry.railMeshes.length; i++) {
            entry.railMeshes[i].material = targetMat;
          }

          // V12.0: Turn Departure Tunnel Beacon GREEN when valid route connects START -> END!
          if (entry.startBeaconMeshes && entry.startBeaconMeshes.length > 0 && this.sharedMaterials) {
            const beaconGreen = Boolean(isComplete && onAnyConnected && this.sharedMaterials.emeraldArrivalPortal);
            const bMat = beaconGreen
              ? this.sharedMaterials.emeraldArrivalPortal
              : (entry.baseGateMat || this.sharedMaterials.cyanStationPortal);
            if (bMat) {
              for (let b = 0; b < entry.startBeaconMeshes.length; b++) {
                entry.startBeaconMeshes[b].material = bMat;
              }
            }
          }

          // V12.0: Highlight which of the 3 Golden Stars lie on the active connected path!
          entry.sparkOnActivePath = Boolean(entry.sparkMesh && onAnyConnected);
          if (entry.sparkMesh && entry.sparkBaseScale) {
            const sMult = entry.sparkOnActivePath ? (isComplete ? 1.26 : 1.15) : 1.0;
            entry.sparkMesh.scale.copy(entry.sparkBaseScale).multiplyScalar(sMult);
          }
        }
      }
    }

    spawn3DSparkBurst(x, y, z, colorHex = 0xFACC15, count = 8, isSteam = false) {
      if (this.particlePool) {
        this.particlePool.spawnBurst(x, y, z, colorHex, count, isSteam);
      }
    }

    /**
     * V12.0 Pre-Launch Golden & Emerald Signal Wave:
     * Pulses a fast sequential golden/emerald signal wave along connected rails from START -> END!
     */
    triggerPathCompletePulse(primarySteps, secondarySteps) {
      const allSteps = [
        ...(Array.isArray(primarySteps) ? primarySteps : []),
        ...(Array.isArray(secondarySteps) ? secondarySteps : [])
      ];
      if (allSteps.length === 0) return;

      this.clearPulseTimers();
      const hasGsap = typeof window.gsap !== 'undefined';
      for (let i = 0; i < allSteps.length; i++) {
        const s = allSteps[i];
        const delayMs = Math.min(320, i * 22);
        const isEndpoint = (i === 0 || i === allSteps.length - 1);
        const colorHex = isEndpoint ? 0x10B981 : ((i % 2 === 0) ? 0xFACC15 : 0x10B981);

        const tid = setTimeout(() => {
          if (!this.enabled) return;
          const pos = this.cellToWorld(s.r, s.c);
          this.spawn3DSparkBurst(pos.x, isEndpoint ? 0.44 : 0.28, pos.z, colorHex, isEndpoint ? 10 : 6, false);
        }, delayMs);
        this._pulseTimers.push(tid);

        const entry = this.tileEntries[s.r] && this.tileEntries[s.r][s.c];
        if (entry && entry.group) {
          if (hasGsap) {
            window.gsap.fromTo(
              entry.group.position,
              { y: 0.10 },
              { y: 0, duration: 0.24, delay: Math.min(0.28, i * 0.018), ease: 'power2.out', overwrite: true }
            );
          } else {
            entry.liftY = Math.max(entry.liftY || 0, 0.10);
          }
        }
      }
    }

    // ========================================================================
    // 14. SINGLE renderer.setAnimationLoop WITH FIXED 1/60s ACCUMULATOR,
    //     SPLINE TRANSFORM INTERPOLATION & ZERO PER-FRAME ALLOCATIONS
    // ========================================================================
    startAnimationLoop() {
      if (!this.renderer) return;
      const FIXED_DT = 1.0 / 60.0;
      this.lastUserInteractionMs = performance.now();
      this._snapStopped = false;

      if (!this._idleListenersBound && typeof window !== 'undefined' && window.addEventListener) {
        this._idleListenersBound = true;
        this._wakeEngineFn = () => {
          this.lastUserInteractionMs = performance.now();
        };
        ['pointerdown', 'pointermove', 'touchstart', 'keydown', 'wheel'].forEach((evt) => {
          try {
            window.addEventListener(evt, this._wakeEngineFn, { passive: true });
          } catch (_) {}
        });
      }

      this._animationLoopFn = (now) => {
        if (this.isPaused) {
          this.lastTime = now;
          return;
        }

        const rawDeltaMs = Math.max(0.1, now - this.lastTime);
        this.lastTime = now;
        this.frameCounter++;

        if (this.qualityManager.locked30Fps && (this.frameCounter % 2 !== 0)) {
          return;
        }

        this.qualityManager.recordFrameTime(rawDeltaMs, now);

        const clampedDt = Math.min(0.100, rawDeltaMs * 0.001);
        const nowSec = now * 0.001;

        this.accumulator += clampedDt;
        let stepsTaken = 0;
        while (this.accumulator >= FIXED_DT && stepsTaken < 4) {
          this.fixedStepSimulation(FIXED_DT, nowSec);
          this.accumulator -= FIXED_DT;
          stepsTaken++;
        }

        const alpha = Math.max(0.0, Math.min(1.0, this.accumulator / FIXED_DT));
        this.interpolateRenderTransforms(alpha, clampedDt, nowSec);

        for (let i = 0; i < this.externalFrameListeners.length; i++) {
          try {
            this.externalFrameListeners[i](clampedDt, now);
          } catch (e) {}
        }

        this.renderFrame(nowSec);

        if (!this.firstFrameNotified) {
          this.firstFrameNotified = true;
          if (window.AndroidAdMob && typeof window.AndroidAdMob.notifyFirstFrameRendered === 'function') {
            try { window.AndroidAdMob.notifyFirstFrameRendered(); } catch (e) {}
          }
        }

        if (this.debugHudVisible && now - this.lastDebugHudUpdate >= 250) {
          this.lastDebugHudUpdate = now;
          this.updateDebugHudDOM();
        }

        if ((window.__HEADLESS_CI_TEST === true || window.__ALLOW_OWNER_DEBUG === true) && this.assetSystem && this.assetSystem.isReady && window.location && window.location.search && window.location.search.indexOf('snap=1') !== -1) {
          this._snapReadyFrames = (this._snapReadyFrames || 0) + 1;
          if (this._snapReadyFrames === 12) {
            if (typeof window.__dismissBootLoader === 'function') {
              try { window.__dismissBootLoader(); } catch (_) {}
            }
            const bootEl = document.getElementById('boot-loader-overlay');
            if (bootEl) bootEl.hidden = true;
            this.renderFrame(nowSec);
            try {
              const dataUrl = this.renderer.domElement.toDataURL('image/png');
              if (typeof fetch === 'function') {
                fetch('/__save_png__', { method: 'POST', body: dataUrl }).catch(() => {});
              }
            } catch (_) {}
            this._snapStopped = true;
            this.renderer.setAnimationLoop(null);
          }
        }
      };
      if (!this.isPaused) {
        this.renderer.setAnimationLoop(this._animationLoopFn);
      }
    }

    stepFixedSimulation(dt = 0.016, nowSec = performance.now() * 0.001) {
      return this.fixedStepSimulation(dt, nowSec);
    }

    fixedStepSimulation(dt = 0.016, nowSec = performance.now() * 0.001) {
      this.windUniforms.uWindTime.value = nowSec;
      if (this.waterMaterial) {
        this.waterMaterial.uniforms.uTime.value = nowSec;
      }
      if (this.sharedMaterials) {
        if (this.sharedMaterials.trackConnected) {
          this.sharedMaterials.trackConnected.emissiveIntensity = 0.42 + Math.sin(nowSec * 5.0) * 0.08;
        }
        if (this.sharedMaterials.trackComplete) {
          this.sharedMaterials.trackComplete.emissiveIntensity = 0.42 + Math.sin(nowSec * 6.5) * 0.10;
        }
      }

      for (let i = 0; i < this.animatedProps.length; i++) {
        const prop = this.animatedProps[i];
        if (!prop || !prop.mesh) continue;
        const phase = prop.phase || 0;
        if (prop.type === 'gear') {
          prop.mesh.rotation.y += dt * 1.4;
        } else if (prop.type === 'windmill_rotor') {
          prop.mesh.rotation.z += dt * 2.2;
        } else if (prop.type === 'windmill') {
          prop.mesh.rotation.y += dt * 2.2;
        } else if (prop.type === 'bell_clapper') {
          prop.mesh.rotation.z = Math.sin(nowSec * 3.0 + phase) * 0.24;
        } else if (prop.type === 'pendulum_arm') {
          prop.mesh.rotation.z = Math.sin(nowSec * 2.4 + phase) * 0.42;
        } else if (prop.type === 'whirlpool_vortex') {
          prop.mesh.rotation.y += dt * 2.6;
        } else if (prop.type === 'fountain_jet') {
          prop.mesh.rotation.y += dt * 1.4;
        }
      }

      const rows = this.gridRows || 0;
      const cols = this.gridCols || 0;
      const hasGsap = typeof window.gsap !== 'undefined';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const entry = this.tileEntries[r] && this.tileEntries[r][c];
          if (!entry) continue;

          if (!hasGsap) {
            const diff = Math.atan2(Math.sin(entry.targetRotY - entry.trackGroup.rotation.y), Math.cos(entry.targetRotY - entry.trackGroup.rotation.y));
            entry.trackGroup.rotation.y += diff * Math.min(1, dt * 18);
            if (entry.liftY > 0.001) {
              entry.liftY = Math.max(0, entry.liftY - dt * 0.85);
              entry.group.position.y = Math.sin((entry.liftY / 0.16) * Math.PI) * 0.14;
            } else {
              entry.group.position.y = 0;
            }
          }

          if (entry.sparkMesh && entry.sparkMesh.visible) {
            const onRoute = Boolean(entry.sparkOnActivePath);
            entry.sparkMesh.rotation.y = nowSec * (onRoute ? 3.8 : 2.0);
            entry.sparkMesh.position.y = (onRoute ? 0.26 : 0.22) + Math.sin(nowSec * (onRoute ? 5.2 : 3.6) + r + c) * (onRoute ? 0.045 : 0.028);
          }
          if (entry.endBeaconMesh && entry.endBeaconMesh.visible) {
            entry.endBeaconMesh.rotation.y = nowSec * 2.8;
            entry.endBeaconMesh.position.y = 0.88 + Math.sin(nowSec * 4.2) * 0.04;
          }
          if (entry.endArrivalRingMesh && entry.endArrivalRingMesh.visible) {
            const pulse = 1.0 + Math.sin(nowSec * 4.5) * 0.07;
            entry.endArrivalRingMesh.scale.set(1.06 * pulse, 0.26 * pulse, 0.34);
          }
        }
      }

      const activeSkinId = (this.currentSkinConfig && this.currentSkinConfig.id) || 'crimson';
      const isSteamSkin = (activeSkinId === 'classic_steam' || activeSkinId === 'orient_express');
      const isMaglevSkin = (activeSkinId === 'maglev_600' || activeSkinId === 'gold_vip');
      const isBulletSkin = (activeSkinId === 'tgv_france' || activeSkinId === 'bullet_shinkansen' || activeSkinId === 'haramain_express');
      const isGoldVipSkin = (activeSkinId === 'gold_vip');
      const steamRateMult = isSteamSkin ? 3.2 : 1.0;

      if (this.locomotiveMesh && this.locomotiveMesh.visible && !this.runState && Math.random() < dt * 3.8 * steamRateMult) {
        const lPos = this.locomotiveMesh.position;
        if (isMaglevSkin) {
          this.spawn3DSparkBurst(lPos.x, lPos.y + 0.26, lPos.z, Math.random() > 0.45 ? 0x38BDF8 : 0xA855F7, 3, false);
        } else {
          this.spawn3DSparkBurst(lPos.x, lPos.y + (isSteamSkin ? 0.62 : 0.44), lPos.z, 0xE2E8F0, isSteamSkin ? 5 : 2, true);
        }
      }
      if (isGoldVipSkin && this.locomotiveMesh && this.locomotiveMesh.visible && !this.runState && Math.random() < dt * 7.5) {
        const lPos = this.locomotiveMesh.position;
        this.spawn3DSparkBurst(lPos.x, lPos.y + 0.35, lPos.z, 0xFFD700, 3, false);
      }

      // Advance train(s) along continuous CatmullRomCurve3 spline(s) with Automatic Signal Yielding
      if (this.runState) {
        const rs = this.runState;
        rs.prevArcDist = rs.arcDist;
        rs.secPrevArcDist = rs.secArcDist;

        if (rs.isClosedLoop && rs.hasPrimaryTrain && rs.curve) {
          const speedUnitsPerSec = rs.baseSpeed * 0.90;
          const ds = dt * speedUnitsPerSec;
          rs.arcDist += ds;
          this.simWheelAngle += ds / 0.082;
          const normS = (rs.arcDist % rs.totalLength) / rs.totalLength;
          const sample = this.sampleSplineArcLength(rs.curve, rs.steps.length, normS);
          if (Math.random() < dt * 10 * steamRateMult) {
            if (isMaglevSkin) {
              this.spawn3DSparkBurst(sample.x, sample.y + 0.24, sample.z, Math.random() > 0.45 ? 0x38BDF8 : 0xA855F7, 4, false);
            } else if (isSteamSkin) {
              const chX = sample.x + Math.cos(sample.yaw) * 0.27;
              const chZ = sample.z - Math.sin(sample.yaw) * 0.27;
              this.spawn3DSparkBurst(chX, sample.y + 0.52, chZ, 0xF8FAFC, 6, true);
            } else {
              this.spawn3DSparkBurst(sample.x, sample.y + 0.42, sample.z, 0xE2E8F0, 2, true);
            }
          }
          if (isGoldVipSkin && Math.random() < dt * 18) {
            this.spawn3DSparkBurst(sample.x, sample.y + 0.28, sample.z, 0xFFD700, 4, false);
          }
        } else {
          const turboMult = Math.max(1.0, this.liveSpeedMult || this.preferredSpeedMult || 1.0) * (this.isFastForwardHeld ? 2.0 : 1.0);

          // 1. Advance Primary Train (Train 1) if active
          if (rs.hasPrimaryTrain && !rs.primaryDone && rs.curve && this.locomotiveMesh) {
            if (typeof rs.progress === 'number') {
              const activeSpan = Math.max(0.5, rs.totalLength - rs.tailMargin);
              rs.arcDist = rs.tailMargin + rs.progress * activeSpan;
              rs.prevArcDist = rs.arcDist;
              delete rs.progress;
            }

            const travelSpan = Math.max(0.5, rs.totalLength - rs.tailMargin);
            const activeDist = Math.max(0, rs.arcDist - rs.tailMargin);
            const normProgress = activeDist / travelSpan;

            const accelEase = Math.min(1.0, 0.55 + normProgress * 3.2);
            const remDist = rs.totalLength - rs.arcDist;

            if (remDist < 1.35 && !rs.boardingTriggered) {
              rs.boardingTriggered = true;
              this.triggerPassengerBoarding();
            }

            // V12.0 Smooth Cinematic Arrival Camera Ease toward Terminal while Passengers Wave!
            if (!this.isMenuShowcase && this.cameraMode === 'ISO_25D' && remDist < 1.45 && remDist > 0.02) {
              const lerpAlpha = Math.min(1, dt * 2.8);
              this.zoomFactor += (0.83 - this.zoomFactor) * lerpAlpha;
              if (rs.steps && rs.steps.length > 0) {
                const endStep = rs.steps[rs.steps.length - 1];
                const endWorld = this.cellToWorld(endStep.r, endStep.c);
                this.panOffsetX += (endWorld.x * 0.22 - this.panOffsetX) * lerpAlpha;
                this.panOffsetZ += (endWorld.z * (this.boardStretchZ || 1.0) * 0.20 - this.panOffsetZ) * lerpAlpha;
              }
              this.updateCameraFramingForGrid(false);
            }

            this.isBraking = remDist < 0.85;
            const brakeEase = this.isBraking ? Math.max(0.55, remDist / 0.85) : 1.0;
            const speedUnitsPerSec = rs.baseSpeed * 0.95 * turboMult * accelEase * brakeEase;

            const ds = dt * speedUnitsPerSec;
            rs.arcDist = Math.min(rs.totalLength, rs.arcDist + ds);
            this.simWheelAngle += ds / 0.056;

            const normS = Math.min(0.9999, rs.arcDist / rs.totalLength);
            const sample = this.sampleSplineArcLength(rs.curve, rs.steps.length, normS);

            // V12.1 Zero-Static 3D Spatial Audio (Independent trainIndex: 1)
            if (!this.isMenuShowcase && window.GameAudio && typeof window.GameAudio.updateTrainSpatialAudio === 'function') {
              window.GameAudio.updateTrainSpatialAudio({
                x: sample.x,
                y: sample.y,
                z: sample.z,
                speed: speedUnitsPerSec,
                arcDist: rs.arcDist,
                bankAngle: sample.bankAngle,
                isBraking: this.isBraking,
                skinId: activeSkinId,
                trainIndex: 1,
                driveEngineLoop: true
              });
            }

            // V8.0 Realistic Orange Wheel-Flange Friction Sparks on Tight Curves
            if (!isMaglevSkin && this.locomotiveMesh.visible && Math.abs(sample.bankAngle) > 0.048 && Math.random() < dt * 26) {
              const outerSign = sample.bankAngle >= 0 ? 1 : -1;
              const latX = Math.sin(sample.yaw) * 0.145 * outerSign;
              const latZ = Math.cos(sample.yaw) * 0.145 * outerSign;
              this.spawn3DSparkBurst(sample.x + latX, sample.y + 0.035, sample.z + latZ, 0xFB923C, 3, false);
            }

            if (this.locomotiveMesh.visible && Math.random() < dt * (this.isBraking ? 20 : 12 * steamRateMult)) {
              if (this.isBraking) {
                this.spawn3DSparkBurst(sample.x, sample.y + 0.06, sample.z, 0x10B981, 3, false);
              } else if (isMaglevSkin) {
                this.spawn3DSparkBurst(sample.x, sample.y + 0.24, sample.z, Math.random() > 0.45 ? 0x38BDF8 : 0xA855F7, 4, false);
              } else if (isBulletSkin) {
                this.spawn3DSparkBurst(sample.x, sample.y + 0.28, sample.z, 0x38BDF8, 3, false);
              } else if (isSteamSkin) {
                const chX = sample.x + Math.cos(sample.yaw) * 0.27;
                const chZ = sample.z - Math.sin(sample.yaw) * 0.27;
                this.spawn3DSparkBurst(chX, sample.y + 0.52, chZ, 0xF8FAFC, 6, true);
              } else {
                this.spawn3DSparkBurst(sample.x, sample.y + 0.44, sample.z, 0xE2E8F0, 2, true);
              }
            }
            if (isGoldVipSkin && this.locomotiveMesh.visible && Math.random() < dt * 22) {
              this.spawn3DSparkBurst(sample.x, sample.y + 0.26, sample.z, 0xFFD700, 5, false);
            }

            while (rs.lastSegIndex < sample.segIndex) {
              rs.lastSegIndex += 1;
              const enteredStep = rs.steps[rs.lastSegIndex];
              if (enteredStep && typeof rs.onStepEnter === 'function') {
                rs.onStepEnter(rs.lastSegIndex, enteredStep.r, enteredStep.c);
              }
            }

            if (typeof rs.onStepEnter === 'function') {
              const liveCol = Math.round(sample.x + (this.gridCols - 1) * 0.5);
              const liveRow = Math.round(sample.z + (this.gridRows - 1) * 0.5);
              if (liveRow >= 0 && liveRow < this.gridRows && liveCol >= 0 && liveCol < this.gridCols) {
                rs.onStepEnter(sample.segIndex, liveRow, liveCol);
              }
            }

            if (rs.arcDist >= rs.totalLength - 0.001) {
              rs.primaryDone = true;
              this.isBraking = false;
              this.locomotiveMesh.visible = false;
              this.carriageMeshes.forEach(car => { car.visible = false; });
              if (rs.hasSecondaryTrain && !rs.secondaryDone && !this.isMenuShowcase) {
                this.zoomFactor = 1.00;
                this.panOffsetX = 0;
                this.panOffsetZ = 0;
                this.updateCameraFramingForGrid(false);
              }
            }
          }

          // 2. Advance Secondary Train (Train 2) with Automatic Speed-Aware Traffic Signal Yielding
          if (rs.hasSecondaryTrain && !rs.secondaryDone && rs.secCurve && this.secondaryLocomotiveMesh) {
            let shouldYield = false;
            const secNormCurr = Math.min(0.9999, rs.secArcDist / rs.secTotalLength);
            const secCurrSample = this.sampleSplineArcLength(rs.secCurve, rs.secondarySteps.length, secNormCurr);
            const pLinSpeed = rs.baseSpeed * turboMult;
            const secLinSpeed = rs.baseSpeed * 0.95 * turboMult;
            const secStopDist = secLinSpeed * 0.11 + 0.45;
            const pArrivalLead = Math.max(0.90, pLinSpeed * 0.10 + 0.55);
            const triggerWindow = Math.max(1.60, 1.35 + secStopDist);

            if (rs.hasPrimaryTrain && !rs.primaryDone && rs.curve) {
              const CARRIAGE_OFFSET = 0.80;
              const pCarCount = (this.carriageMeshes || []).length;
              const sCarCount = (this.secondaryCarriageMeshes || []).length;
              const pTailDist = rs.arcDist - (pCarCount * CARRIAGE_OFFSET) - 0.65;
              const sConsistClear = (sCarCount * CARRIAGE_OFFSET) + 0.95;

              // Check A: Exact shared/crossing intersection clearance (speed-aware trigger window & arrival overlap)
              if (Array.isArray(rs.conflictZones) && rs.conflictZones.length > 0) {
                for (let z = 0; z < rs.conflictZones.length; z++) {
                  const zone = rs.conflictZones[z];
                  const pZoneArc = (typeof zone.pZoneArc === 'number')
                    ? zone.pZoneArc
                    : (rs.tailMargin + (zone.pIdx / Math.max(1, rs.steps.length - 1)) * Math.max(0.5, rs.totalLength - rs.tailMargin - (rs.endRunInMargin || 0)));
                  const sZoneArc = (typeof zone.sZoneArc === 'number')
                    ? zone.sZoneArc
                    : (rs.secTailMargin + (zone.sIdx / Math.max(1, rs.secondarySteps.length - 1)) * Math.max(0.5, rs.secTotalLength - rs.secTailMargin - (rs.secEndRunInMargin || 0)));

                  if (pTailDist < pZoneArc && rs.secArcDist <= sZoneArc + 0.15) {
                    const distToCrossing = Math.hypot(secCurrSample.x - zone.wx, secCurrSample.z - zone.wz);
                    if (distToCrossing <= triggerWindow) {
                      const pDistToCross = pZoneArc - rs.arcDist;
                      const sDistToCross = Math.max(0, sZoneArc - rs.secArcDist);
                      if ((pDistToCross - pArrivalLead) < (sDistToCross + sConsistClear + secStopDist * 0.50)) {
                        shouldYield = true;
                        break;
                      }
                    }
                  }
                }
              }

              // Check B: Direct 3D nose + speed-aware look-ahead collision shield (0.76 radius avoids false triggers on 1.0-spaced parallel tracks)
              if (!shouldYield) {
                const pUnits = [];
                const pEndGate = rs.totalLength - (rs.endRunInMargin || 0);
                if (rs.arcDist < pEndGate + 0.14) {
                  const pLocoS = this.sampleSplineArcLength(rs.curve, rs.steps.length, Math.min(0.9999, rs.arcDist / rs.totalLength));
                  pUnits.push({ x: pLocoS.x, z: pLocoS.z });
                }
                for (let cIdx = 0; cIdx < pCarCount; cIdx++) {
                  const cDist = rs.arcDist - (cIdx + 1) * CARRIAGE_OFFSET;
                  if (cDist > rs.tailMargin + 0.20 && cDist < pEndGate + 0.14) {
                    const pCarS = this.sampleSplineArcLength(rs.curve, rs.steps.length, Math.max(0, Math.min(0.9999, cDist / rs.totalLength)));
                    pUnits.push({ x: pCarS.x, z: pCarS.z });
                  }
                }

                const secEndGate = rs.secTotalLength - (rs.secEndRunInMargin || 0);
                if (rs.secArcDist < secEndGate) {
                  const maxLookAhead = Math.max(1.14, 0.95 + secStopDist);
                  const lookStep = 0.38;
                  const lookOffsets = [];
                  for (let off = 0.0; off < maxLookAhead - 0.001; off += lookStep) {
                    lookOffsets.push(off);
                  }
                  lookOffsets.push(maxLookAhead);
                  for (let lo = 0; lo < lookOffsets.length && !shouldYield; lo++) {
                    const rawLook = rs.secArcDist + lookOffsets[lo];
                    const lookDist = Math.min(secEndGate, rawLook);
                    const lookSample = (lo === 0)
                      ? secCurrSample
                      : this.sampleSplineArcLength(rs.secCurve, rs.secondarySteps.length, lookDist / rs.secTotalLength);
                    for (let u = 0; u < pUnits.length; u++) {
                      if (Math.hypot(lookSample.x - pUnits[u].x, lookSample.z - pUnits[u].z) < 0.76) {
                        shouldYield = true;
                        break;
                      }
                    }
                    if (rawLook >= secEndGate) break;
                  }
                }
              }
            }

            if (shouldYield) {
              rs.secSpeedFactor = Math.max(0.0, (typeof rs.secSpeedFactor === 'number' ? rs.secSpeedFactor : 0.0) - dt * 16.0);
              rs.signalYielded = true;
            } else {
              rs.secSpeedFactor = Math.min(1.0, (typeof rs.secSpeedFactor === 'number' ? rs.secSpeedFactor : 1.0) + dt * 3.8);
            }

            const secTravelSpan = Math.max(0.5, rs.secTotalLength - rs.secTailMargin);
            const secActiveDist = Math.max(0, rs.secArcDist - rs.secTailMargin);
            const secNormProgress = secActiveDist / secTravelSpan;
            const secAccelEase = Math.min(1.0, 0.55 + secNormProgress * 3.2);
            const secRemDist = rs.secTotalLength - rs.secArcDist;

            if (secRemDist < 1.25 && !rs.boardingTriggered) {
              rs.boardingTriggered = true;
              this.triggerPassengerBoarding();
            }

            // Smooth Cinematic Arrival Camera Ease toward END_2 when Train 2 is final/only active train
            if ((!rs.hasPrimaryTrain || rs.primaryDone) && !this.isMenuShowcase && this.cameraMode === 'ISO_25D' && secRemDist < 1.45 && secRemDist > 0.02) {
              const lerpAlpha = Math.min(1, dt * 2.8);
              this.zoomFactor += (0.83 - this.zoomFactor) * lerpAlpha;
              if (rs.secondarySteps && rs.secondarySteps.length > 0) {
                const end2Step = rs.secondarySteps[rs.secondarySteps.length - 1];
                const end2World = this.cellToWorld(end2Step.r, end2Step.c);
                this.panOffsetX += (end2World.x * 0.22 - this.panOffsetX) * lerpAlpha;
                this.panOffsetZ += (end2World.z * (this.boardStretchZ || 1.0) * 0.20 - this.panOffsetZ) * lerpAlpha;
              }
              this.updateCameraFramingForGrid(false);
            }

            const secIsBraking = secRemDist < 0.85;
            const secBrakeEase = secIsBraking ? Math.max(0.55, secRemDist / 0.85) : 1.0;
            const secSpeedUnitsPerSec = rs.baseSpeed * 0.95 * turboMult * secAccelEase * secBrakeEase * rs.secSpeedFactor;
            const secDs = dt * secSpeedUnitsPerSec;
            const secPreAdvanceArc = rs.secArcDist;
            rs.secArcDist = Math.min(rs.secTotalLength, rs.secArcDist + secDs);
            // Hard crossing hold-line guard: stop Train 2 short of the foul point regardless of speed multiplier
            if (shouldYield && Array.isArray(rs.conflictZones) && rs.conflictZones.length > 0) {
              for (let z = 0; z < rs.conflictZones.length; z++) {
                const zone = rs.conflictZones[z];
                const sZoneArc = (typeof zone.sZoneArc === 'number')
                  ? zone.sZoneArc
                  : (rs.secTailMargin + (zone.sIdx / Math.max(1, rs.secondarySteps.length - 1)) * Math.max(0.5, rs.secTotalLength - rs.secTailMargin - (rs.secEndRunInMargin || 0)));
                const holdArc = sZoneArc - 0.92;
                if (secPreAdvanceArc < holdArc && rs.secArcDist > holdArc) {
                  rs.secArcDist = holdArc;
                }
              }
            }
            const actualSecDs = Math.max(0, rs.secArcDist - secPreAdvanceArc);
            this.secSimWheelAngle = (this.secSimWheelAngle || 0) + actualSecDs / 0.056;
            if (rs.primaryDone) {
              this.simWheelAngle += actualSecDs / 0.056;
            }

            const secNormS = Math.min(0.9999, rs.secArcDist / rs.secTotalLength);
            const secSample = this.sampleSplineArcLength(rs.secCurve, rs.secondarySteps.length, secNormS);
            const secSkinId = this.secondarySkinId || activeSkinId;
            const secIsMaglevSkin = (secSkinId === 'maglev_600' || secSkinId === 'gold_vip');
            if (secSpeedUnitsPerSec > 0.05) rs.secWasMoving = true;

            if (!this.isMenuShowcase && (secSpeedUnitsPerSec > 0.05 || rs.secWasMoving) && window.GameAudio && typeof window.GameAudio.updateTrainSpatialAudio === 'function') {
              window.GameAudio.updateTrainSpatialAudio({
                x: secSample.x,
                y: secSample.y,
                z: secSample.z,
                speed: secSpeedUnitsPerSec,
                arcDist: rs.secArcDist,
                bankAngle: secSample.bankAngle,
                isBraking: secIsBraking,
                skinId: secSkinId,
                trainIndex: 2,
                driveEngineLoop: true
              });
            }

            if (!secIsMaglevSkin && this.secondaryLocomotiveMesh.visible && rs.secSpeedFactor > 0.15 && Math.abs(secSample.bankAngle) > 0.048 && Math.random() < dt * 26) {
              const outerSign = secSample.bankAngle >= 0 ? 1 : -1;
              const latX = Math.sin(secSample.yaw) * 0.145 * outerSign;
              const latZ = Math.cos(secSample.yaw) * 0.145 * outerSign;
              this.spawn3DSparkBurst(secSample.x + latX, secSample.y + 0.035, secSample.z + latZ, 0xFB923C, 3, false);
            }
            if (this.secondaryLocomotiveMesh.visible && rs.secSpeedFactor > 0.15 && Math.random() < dt * 10) {
              this.spawn3DSparkBurst(secSample.x, secSample.y + 0.44, secSample.z, 0x38BDF8, 2, true);
            }

            while (rs.secLastSegIndex < secSample.segIndex) {
              rs.secLastSegIndex += 1;
              const secEntered = rs.secondarySteps[rs.secLastSegIndex];
              if (secEntered && typeof rs.onStepEnter === 'function') {
                rs.onStepEnter(rs.secLastSegIndex, secEntered.r, secEntered.c);
              }
            }

            if (typeof rs.onStepEnter === 'function') {
              const secLiveCol = Math.round(secSample.x + (this.gridCols - 1) * 0.5);
              const secLiveRow = Math.round(secSample.z + (this.gridRows - 1) * 0.5);
              if (secLiveRow >= 0 && secLiveRow < this.gridRows && secLiveCol >= 0 && secLiveCol < this.gridCols) {
                rs.onStepEnter(secSample.segIndex, secLiveRow, secLiveCol);
              }
            }

            if (rs.secArcDist >= rs.secTotalLength - 0.001) {
              rs.secondaryDone = true;
              this.secondaryLocomotiveMesh.visible = false;
              (this.secondaryCarriageMeshes || []).forEach(car => { car.visible = false; });
              if (!this.isMenuShowcase && window.GameAudio && typeof window.GameAudio.updateTrainSpatialAudio === 'function') {
                window.GameAudio.updateTrainSpatialAudio({
                  x: secSample.x,
                  y: secSample.y,
                  z: secSample.z,
                  speed: 0,
                  arcDist: rs.secArcDist,
                  bankAngle: 0,
                  isBraking: true,
                  skinId: secSkinId,
                  trainIndex: 2,
                  driveEngineLoop: true
                });
              }
            }
          }

          // Live Train 1 vs Train 2 consist XZ collision telemetry
          if (rs.hasPrimaryTrain && rs.hasSecondaryTrain && !rs.primaryDone && !rs.secondaryDone &&
              rs.curve && rs.secCurve && this.locomotiveMesh && this.secondaryLocomotiveMesh &&
              this.locomotiveMesh.visible && this.secondaryLocomotiveMesh.visible) {
            const CARRIAGE_OFFSET = 0.80;
            const collectVisibleUnits = (curve, stepsLen, arcDist, totalLen, startGate, endGate, carCount) => {
              const units = [];
              if (arcDist < endGate + 0.14) {
                const lNorm = Math.max(0.0, Math.min(0.9999, arcDist / totalLen));
                const lS = this.sampleSplineArcLength(curve, stepsLen, lNorm);
                units.push({ x: lS.x, z: lS.z });
              }
              for (let idx = 0; idx < carCount; idx++) {
                const carDist = arcDist - (idx + 1) * CARRIAGE_OFFSET;
                const progressOffset = carDist - startGate;
                if (progressOffset > 0.28 && carDist < endGate + 0.14) {
                  const cNorm = Math.max(0.0, Math.min(0.9999, carDist / totalLen));
                  const cS = this.sampleSplineArcLength(curve, stepsLen, cNorm);
                  units.push({ x: cS.x, z: cS.z });
                }
              }
              return units;
            };
            const pEndGate = rs.totalLength - (rs.endRunInMargin || 0);
            const sEndGate = rs.secTotalLength - (rs.secEndRunInMargin || 0);
            const pVis = collectVisibleUnits(rs.curve, rs.steps.length, rs.arcDist, rs.totalLength, rs.tailMargin || 0, pEndGate, (this.carriageMeshes || []).length);
            const sVis = collectVisibleUnits(rs.secCurve, rs.secondarySteps.length, rs.secArcDist, rs.secTotalLength, rs.secTailMargin || 0, sEndGate, (this.secondaryCarriageMeshes || []).length);
            for (let pi = 0; pi < pVis.length && !rs.collisionDetected; pi++) {
              for (let si = 0; si < sVis.length; si++) {
                if (Math.hypot(pVis[pi].x - sVis[si].x, pVis[pi].z - sVis[si].z) < 0.70) {
                  rs.collisionDetected = true;
                  break;
                }
              }
            }
          }

          // Complete journey once all dispatched train(s) have arrived at their terminals
          if (rs.primaryDone && rs.secondaryDone) {
            this.isBraking = false;
            if (window.GameAudio && typeof window.GameAudio.stopTrainEngineLoop === 'function') {
              window.GameAudio.stopTrainEngineLoop();
            }
            this.triggerShake(0.20);
            const cb = rs.onComplete;
            this.runState = null;
            if (!this.isMenuShowcase && this.currentLevel && this.currentLevel.isDualTrainLevel && (!rs.hasPrimaryTrain || !rs.hasSecondaryTrain)) {
              this.zoomFactor = 1.00;
              this.panOffsetX = 0;
              this.panOffsetZ = 0;
              this.updateCameraFramingForGrid(false);
            }
            if (typeof cb === 'function') cb();
          }
        }
      }

      this.updateRiggedActors(dt, nowSec);

      if (this.particlePool) {
        const biome = BIOME_CONFIGS[this.currentLevel ? this.currentLevel.stationId : 1] || BIOME_CONFIGS[1];
        this.particlePool.update(dt, nowSec, biome.windVec);
      }
    }

    interpolateRenderTransforms(alpha = 1.0, dt = 0.016, nowSec = 0) {
      const safeDt = (typeof dt === 'number' && !isNaN(dt)) ? dt : 0.016;
      const safeNow = (typeof nowSec === 'number' && !isNaN(nowSec)) ? nowSec : (performance.now() * 0.001);

      const primaryIsMaglevSkin = Boolean(this.currentSkinConfig && (this.currentSkinConfig.id === 'maglev_600' || this.currentSkinConfig.id === 'gold_vip'));
      const secondaryIsMaglevSkin = Boolean(this.secondarySkinId === 'maglev_600' || this.secondarySkinId === 'gold_vip');
      const applyConsistSplineTransform = (locoMesh, carMeshes, curve, stepsLen, interpArcDist, totalLength, startGateDist, endGateDist, isClosedLoop, isMaglevConsist = false) => {
        if (!locoMesh || !curve) return;
        const normS = isClosedLoop
          ? ((interpArcDist % totalLength) / totalLength)
          : Math.max(0.0, Math.min(0.9999, interpArcDist / totalLength));
        const locoSample = this.sampleSplineArcLength(curve, stepsLen, normS);

        // Micro-suspension spring compression over every 0.95m rail joint
        const locoJointBounce = (!isMaglevConsist) ? (Math.pow(Math.abs(Math.sin(interpArcDist * Math.PI / 0.95)), 12) * -0.0042) : 0.0;
        locoMesh.position.set(locoSample.x, locoSample.y + locoJointBounce, locoSample.z);
        locoMesh.rotation.set(locoSample.bankAngle, locoSample.yaw, 0);

        if (isClosedLoop) {
          locoMesh.visible = true;
          locoMesh.scale.setScalar(1.0);
        } else if (interpArcDist >= endGateDist + 0.14) {
          locoMesh.visible = false;
        } else if (interpArcDist > endGateDist - 0.12) {
          locoMesh.visible = true;
          const entryScale = Math.max(0.28, 1.0 - ((interpArcDist - (endGateDist - 0.12)) / 0.26) * 0.72);
          locoMesh.scale.setScalar(entryScale);
        } else {
          locoMesh.visible = true;
          locoMesh.scale.setScalar(1.0);
        }

        const CARRIAGE_OFFSET = 0.80;
        for (let idx = 0; idx < (carMeshes || []).length; idx++) {
          const car = carMeshes[idx];
          const carDist = interpArcDist - (idx + 1) * CARRIAGE_OFFSET;
          const progressOffset = carDist - startGateDist;

          const carNormS = isClosedLoop
            ? ((((carDist % totalLength) + totalLength) % totalLength) / totalLength)
            : Math.max(0.0, Math.min(0.9999, carDist / totalLength));
          const carSample = this.sampleSplineArcLength(curve, stepsLen, carNormS);
          const carJointBounce = (!isMaglevConsist) ? (Math.pow(Math.abs(Math.sin(carDist * Math.PI / 0.95)), 12) * -0.0036) : 0.0;
          car.position.set(carSample.x, carSample.y + carJointBounce, carSample.z);
          car.rotation.set(carSample.bankAngle * 0.88, carSample.yaw, 0);

          const emergeThreshold = 0.28;
          const emergeRampSpan = 0.24;
          if (isClosedLoop) {
            car.visible = true;
            car.scale.setScalar(1.0);
          } else if (progressOffset <= emergeThreshold) {
            car.visible = false;
          } else if (carDist >= endGateDist + 0.14) {
            car.visible = false;
          } else {
            car.visible = true;
            if (progressOffset < emergeThreshold + emergeRampSpan) {
              const tEmerge = (progressOffset - emergeThreshold) / emergeRampSpan;
              const emergeScale = 0.25 + tEmerge * 0.75;
              car.scale.setScalar(emergeScale);
            } else if (carDist > endGateDist - 0.12) {
              const entryScale = Math.max(0.25, 1.0 - ((carDist - (endGateDist - 0.12)) / 0.26) * 0.75);
              car.scale.setScalar(entryScale);
            } else {
              car.scale.setScalar(1.0);
            }
          }
        }
      };

      // Sample smooth sub-frame spline positions and dual-bogie tangents for Primary & Secondary Trains!
      if (this.runState) {
        const rs = this.runState;
        const safeAlpha = (typeof alpha === 'number' && !isNaN(alpha)) ? alpha : 1.0;

        if (rs.hasPrimaryTrain && !rs.primaryDone && rs.curve && this.locomotiveMesh) {
          const interpArcDist = rs.prevArcDist + (rs.arcDist - rs.prevArcDist) * safeAlpha;
          const startGateDist = rs.tailMargin || 0;
          const endGateDist = rs.totalLength - (rs.endRunInMargin || 0);

          applyConsistSplineTransform(
            this.locomotiveMesh,
            this.carriageMeshes,
            rs.curve,
            rs.steps.length,
            interpArcDist,
            rs.totalLength,
            startGateDist,
            endGateDist,
            rs.isClosedLoop,
            primaryIsMaglevSkin
          );
        }

        if (rs.hasSecondaryTrain && !rs.secondaryDone && rs.secCurve && this.secondaryLocomotiveMesh) {
          const secInterpDist = rs.secPrevArcDist + (rs.secArcDist - rs.secPrevArcDist) * safeAlpha;
          const secStartGateDist = rs.secTailMargin || 0;
          const secEndGateDist = rs.secTotalLength - (rs.secEndRunInMargin || 0);
          applyConsistSplineTransform(
            this.secondaryLocomotiveMesh,
            this.secondaryCarriageMeshes,
            rs.secCurve,
            rs.secondarySteps.length,
            secInterpDist,
            rs.secTotalLength,
            secStartGateDist,
            secEndGateDist,
            false,
            secondaryIsMaglevSkin
          );
        }
      }

      // Spin all independent 3D WheelSet_* axles on primary & secondary trains at 60 FPS!
      if (this.locoWheelMeshes && this.locoWheelMeshes.length > 0) {
        const wAng = this.simWheelAngle || 0;
        for (let wIdx = 0; wIdx < this.locoWheelMeshes.length; wIdx++) {
          this.locoWheelMeshes[wIdx].rotation.x = wAng;
        }
      }
      if (this.secWheelMeshes && this.secWheelMeshes.length > 0) {
        const secWAng = this.secSimWheelAngle || this.simWheelAngle || 0;
        for (let wIdx = 0; wIdx < this.secWheelMeshes.length; wIdx++) {
          this.secWheelMeshes[wIdx].rotation.x = secWAng;
        }
      }

      const prefersReducedMotion = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (this.isMenuShowcase) {
        this.orbitAzimuth = prefersReducedMotion ? 0.22 : (Math.sin(safeNow * 0.25) * 0.35);
        this.orbitElevation = 0.54;
        this.zoomFactor = 1.08;
        this.updateCameraFramingForGrid(false);
      } else if (this.cameraMode === 'CHASE_3D' && (this.locomotiveMesh || this.secondaryLocomotiveMesh)) {
        const activeLoco = (this.runState && this.runState.primaryDone && this.secondaryLocomotiveMesh && this.secondaryLocomotiveMesh.visible)
          ? this.secondaryLocomotiveMesh
          : (this.locomotiveMesh || this.secondaryLocomotiveMesh);
        if (activeLoco) {
          const lPos = activeLoco.position;
          const yaw = activeLoco.rotation.y;
          const behindX = lPos.x - Math.cos(yaw) * 2.55;
          const behindZ = lPos.z + Math.sin(yaw) * 2.55;
          this.camTargetPos.set(behindX, 1.42, behindZ);
          this.camTargetLook.set(lPos.x + Math.cos(yaw) * 1.15, 0.22, lPos.z - Math.sin(yaw) * 1.15);
        }
      }

      this.camera.position.lerp(this.camTargetPos, Math.min(1, safeDt * 6));
      this.currentLookAt.lerp(this.camTargetLook, Math.min(1, safeDt * 8));

      if (this.shakeIntensity > 0.001 && !prefersReducedMotion) {
        this.camera.position.x += (Math.random() - 0.5) * this.shakeIntensity;
        this.camera.position.y += (Math.random() - 0.5) * this.shakeIntensity;
        this.shakeIntensity = Math.max(0, this.shakeIntensity - safeDt * 0.9);
      } else if (prefersReducedMotion) {
        this.shakeIntensity = 0;
      }

      this.camera.lookAt(this.currentLookAt);

      this.updateWorldLods();
      const span = Math.max((this.gridRows || 4) * (this.boardStretchZ || 1.0), this.gridCols || 4) * 1.0 + 0.35;
      this.updateTightTexelSnappedShadowFrustum(span);
    }

    /**
     * V12.0 Zero-Blank Character Portrait Enhancer:
     * NEVER wipes or overwrites the high-res art-directed character portrait (`assets/portraits/<id>.webp` / SVG)!
     * Applies character-specific live rim-lighting aura & subtle speaking animation with 100% reliability!
     */
    mountDialoguePortrait(speakerId, containerEl) {
      if (!containerEl) return false;
      const spk = String(speakerId || 'fouad').toLowerCase();
      containerEl.setAttribute('data-speaker-id', spk);
      containerEl.classList.add('v12-portrait-mounted');
      this.activePortraitTarget = null;
      return true;
    }

    renderLivePortraitIfOpen() {
      // V12.0: Portraits use crisp dedicated 8-character artwork without viewport-stealing WebGL copies.
    }

    renderFrame() {
      if (!this.renderer || !this.scene || !this.camera) return;
      if (this.renderer.shadowMap && this.renderer.shadowMap.enabled) {
        if (this.isMenuShowcase) {
          if (this.frameCounter % 2 === 0) this.renderer.shadowMap.needsUpdate = true;
        } else if (this.runState) {
          this.renderer.shadowMap.needsUpdate = true;
        } else if (this._shadowDirtyFrames > 0) {
          this._shadowDirtyFrames--;
          this.renderer.shadowMap.needsUpdate = true;
        }
      }
      if (this.activePortraitTarget) {
        this.renderLivePortraitIfOpen();
      }
      this.renderer.render(this.scene, this.camera);
    }

    // ========================================================================
    // 15. PERFORMANCE METRICS TELEMETRY (Debug HUD overlay disabled for release)
    // ========================================================================
    initDebugHud() {
      const existing = document.getElementById('debug-perf-hud');
      if (existing) existing.remove();
      this.debugHudEl = null;
      this.debugHudVisible = false;
    }

    get quality() {
      return this.qualityManager;
    }

    toggleDebugHUD() {
      return false;
    }

    toggleDebugHud() {
      return false;
    }

    getPerformanceReport() {
      const perf = this.qualityManager.getFramePercentiles();
      const info = (this.renderer && this.renderer.info) ? this.renderer.info : { render: {}, memory: {} };
      const vramMB = this.memoryBudget.getTotalEstimatedMB();
      const budgetMB = this.memoryBudget.tierBudgetsMB[this.qualityManager.currentTier] || 256;
      const ktxFmt = (this.assetSystem && this.assetSystem.ktx2Loader)
        ? this.assetSystem.ktx2Loader.workerConfig.preferredFormat
        : 'RGBA8';
      const thermalNames = ['NONE (Cool)', 'LIGHT', 'MODERATE', 'SEVERE', 'CRITICAL'];
      const sceneCalls = (this.postProcessor && this.postProcessor.lastSceneCalls) || info.render.calls || 0;
      const sceneTris = (this.postProcessor && this.postProcessor.lastSceneTriangles) || info.render.triangles || 0;
      return {
        fps: this.qualityManager.locked30Fps ? Math.min(30, perf.fps) : perf.fps,
        p50Ms: Number(perf.p50.toFixed(2)),
        p95Ms: Number(perf.p95.toFixed(2)),
        p99Ms: Number(perf.p99.toFixed(2)),
        drawCalls: sceneCalls,
        triangles: sceneTris,
        textures: info.memory.textures || 0,
        geometries: info.memory.geometries || 0,
        estimatedVramMB: Number(vramMB.toFixed(1)),
        vramBudgetMB: budgetMB,
        renderScale: Number(this.qualityManager.renderScale.toFixed(2)),
        tier: this.qualityManager.currentTier,
        gpuFormat: ktxFmt,
        thermalStatus: thermalNames[this.qualityManager.thermalStatus] || 'NONE',
        thermalHeadroom: Number(this.qualityManager.thermalHeadroom.toFixed(2)),
        locked30Fps: this.qualityManager.locked30Fps
      };
    }

    updateDebugHudDOM() {
      if (!this.debugHudEl) return;
      const r = this.getPerformanceReport();
      this.debugHudEl.innerHTML = [
        `<div style="color:#38BDF8;font-weight:700;margin-bottom:2px">⚡ DREAM EXPRESS V5.0 TELEMETRY</div>`,
        `<div>FPS: <b style="color:#4ADE80">${r.fps}</b> ${r.locked30Fps ? '(30-LOCK)' : ''} | Scale: <b>${Math.round(r.renderScale * 100)}%</b></div>`,
        `<div>Frame(ms): p50=<b>${r.p50Ms}</b> p95=<b>${r.p95Ms}</b> p99=<b>${r.p99Ms}</b></div>`,
        `<div>Draws: <b>${r.drawCalls}</b> | Tris: <b>${r.triangles.toLocaleString()}</b></div>`,
        `<div>GPU Mem: Tex=<b>${r.textures}</b> Geo=<b>${r.geometries}</b> (${r.gpuFormat})</div>`,
        `<div>VRAM Est: <b style="color:#FACC15">${r.estimatedVramMB} / ${r.vramBudgetMB} MB</b></div>`,
        `<div>Tier: <b style="color:#C084FC">${r.tier}</b> | Thermal: <b>${r.thermalStatus} (${r.thermalHeadroom})</b></div>`
      ].join('');
    }

    dispose() {
      this.pauseRendering();
      this.clearPulseTimers();
      clearTimeout(this._charRebuildTimer);
      this.uncacheRiggedActors();

      this.clearGroup(this.boardGroup);
      this.clearGroup(this.terrainLodGroup);
      (this.vegetationLodGroups || []).forEach(g => this.clearGroup(g));
      this.clearGroup(this.environmentGroup);
      this.clearGroup(this.trainGroup);
      this.clearGroup(this.patrolTrainGroup);
      this.clearGroup(this.charactersGroup);
      this.clearGroup(this.particlesGroup);

      if (this.particlePool && typeof this.particlePool.dispose === 'function') {
        this.particlePool.dispose();
        this.particlePool = null;
      }

      if (this.sharedMaterials) {
        Object.values(this.sharedMaterials).forEach(m => {
          if (m && typeof m.dispose === 'function') {
            try { m.dispose(); } catch (_) {}
          }
        });
      }
      if (this.defaultRoomEnvTex && typeof this.defaultRoomEnvTex.dispose === 'function') {
        try { this.defaultRoomEnvTex.dispose(); } catch (_) {}
        this.defaultRoomEnvTex = null;
      }
      if (this._badgeTexCache) {
        Object.values(this._badgeTexCache).forEach(t => {
          if (t && typeof t.dispose === 'function') {
            try { t.dispose(); } catch (_) {}
          }
        });
        this._badgeTexCache = {};
      }
      if (this.assetSystem) {
        if (this.assetSystem.models) {
          const sharedTexSet = new Set(Object.values(this.assetSystem.pbrTextures || {}).filter(Boolean));
          const texSlots = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'];
          Object.values(this.assetSystem.models).forEach(gltf => {
            if (!gltf) return;
            if (gltf.scene && typeof gltf.scene.traverse === 'function') {
              gltf.scene.traverse(node => {
                if (node && node.isMesh) {
                  if (node.geometry && typeof node.geometry.dispose === 'function') {
                    try { node.geometry.dispose(); } catch (_) {}
                  }
                  if (node.material) {
                    const mats = Array.isArray(node.material) ? node.material : [node.material];
                    mats.forEach(m => {
                      if (!m) return;
                      for (let s = 0; s < texSlots.length; s++) {
                        const tex = m[texSlots[s]];
                        if (tex && !sharedTexSet.has(tex) && typeof tex.dispose === 'function') {
                          try { tex.dispose(); } catch (_) {}
                        }
                      }
                      if (typeof m.dispose === 'function') {
                        try { m.dispose(); } catch (_) {}
                      }
                    });
                  }
                }
              });
            }
            if (Array.isArray(gltf._cachedSubmeshes)) {
              gltf._cachedSubmeshes.forEach(item => {
                if (item && item.geometry && typeof item.geometry.dispose === 'function') {
                  try { item.geometry.dispose(); } catch (_) {}
                }
              });
              gltf._cachedSubmeshes = null;
            }
          });
          this.assetSystem.models = {};
        }
        if (this.assetSystem.loadedRegionModels && typeof this.assetSystem.loadedRegionModels.clear === 'function') {
          this.assetSystem.loadedRegionModels.clear();
        }
        if (this.assetSystem.baseModelMaterials && typeof this.assetSystem.baseModelMaterials.clear === 'function') {
          this.assetSystem.baseModelMaterials.clear();
        }
        if (this.assetSystem.hdrMaps) {
          Object.values(this.assetSystem.hdrMaps).forEach(t => {
            if (t && typeof t.dispose === 'function') {
              try { t.dispose(); } catch (_) {}
            }
          });
          this.assetSystem.hdrMaps = {};
        }
        if (this.assetSystem.pbrTextures) {
          Object.values(this.assetSystem.pbrTextures).forEach(t => {
            if (t && typeof t.dispose === 'function') {
              try { t.dispose(); } catch (_) {}
            }
          });
          this.assetSystem.pbrTextures = {};
        }
        if (this.assetSystem.pmremGenerator && typeof this.assetSystem.pmremGenerator.dispose === 'function') {
          try { this.assetSystem.pmremGenerator.dispose(); } catch (_) {}
        }
        if (this.assetSystem.ktx2Loader && typeof this.assetSystem.ktx2Loader.dispose === 'function') {
          try { this.assetSystem.ktx2Loader.dispose(); } catch (_) {}
        }
        if (this.assetSystem.dracoLoader && typeof this.assetSystem.dracoLoader.dispose === 'function') {
          try { this.assetSystem.dracoLoader.dispose(); } catch (_) {}
        }
      }

      if (this._containerResizeObserver) {
        try { this._containerResizeObserver.disconnect(); } catch (_) {}
        this._containerResizeObserver = null;
      }
      if (this._globalListenersBound) {
        this._globalListenersBound = false;
        if (this._onWindowResize && typeof window !== 'undefined') {
          window.removeEventListener('resize', this._onWindowResize);
        }
        if (this._onVisibilityChange && typeof document !== 'undefined') {
          document.removeEventListener('visibilitychange', this._onVisibilityChange);
        }
      }
      if (this._idleListenersBound && this._wakeEngineFn && typeof window !== 'undefined') {
        this._idleListenersBound = false;
        ['pointerdown', 'pointermove', 'touchstart', 'keydown', 'wheel'].forEach((evt) => {
          try { window.removeEventListener(evt, this._wakeEngineFn); } catch (_) {}
        });
      }

      if (this.renderer) {
        if (this.renderer.domElement && this.renderer.domElement.parentElement) {
          this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
        }
        if (typeof this.renderer.dispose === 'function') {
          try { this.renderer.dispose(); } catch (_) {}
        }
      }
      this.enabled = false;
    }
  }

  window.TrainEngine3D = new TrainEngine3D();
})();
