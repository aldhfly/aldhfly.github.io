/**
 * Three.js Bright Daylight & Studio RoomEnvironment for PMREMGenerator
 * Produces vivid, balanced sky/sun/ground reflections on metallic & glossy PBR materials
 * without overexposing diffuse surfaces.
 */
(function () {
  'use strict';
  if (typeof THREE === 'undefined') return;

  function makeQuadBufferGeometry(w, h) {
    const hw = w * 0.5;
    const hh = h * 0.5;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([
      -hw, -hh, 0,
       hw, -hh, 0,
       hw,  hh, 0,
      -hw, -hh, 0,
       hw,  hh, 0,
      -hw,  hh, 0
    ]);
    const nor = new Float32Array([
      0, 0, 1,  0, 0, 1,  0, 0, 1,
      0, 0, 1,  0, 0, 1,  0, 0, 1
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    return geo;
  }

  class RoomEnvironment extends THREE.Scene {
    constructor() {
      super();
      this.name = 'BrightDaylightRoomEnvironment';
      this.background = new THREE.Color(0x386688);

      const panelGeo = makeQuadBufferGeometry(1, 1);

      const addPanel = (colorHex, intensity, x, y, z, rx, ry, rz, sx, sy) => {
        const mat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(colorHex).multiplyScalar(intensity),
          side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(panelGeo, mat);
        mesh.position.set(x, y, z);
        mesh.rotation.set(rx, ry, rz);
        mesh.scale.set(sx, sy, 1);
        this.add(mesh);
      };

      // Zenith Sky Soft Light
      addPanel(0xE0F2FE, 0.85, 0, 14, 0, Math.PI * 0.5, 0, 0, 20, 20);
      // Warm Sun Key Highlight Panel (creates crisp specular reflections on rails & trains)
      addPanel(0xFFFBEB, 2.40, 10, 11, 10, Math.PI * 0.25, -Math.PI * 0.25, 0, 6, 6);
      // Horizon Fill Panels (North, South, East, West)
      addPanel(0x7DD3FC, 0.55, 0, 4, -15, 0, 0, 0, 22, 10);
      addPanel(0x7DD3FC, 0.55, 0, 4,  15, 0, Math.PI, 0, 22, 10);
      addPanel(0xBAE6FD, 0.60, -15, 4, 0, 0, Math.PI * 0.5, 0, 22, 10);
      addPanel(0xFDE68A, 0.65,  15, 4, 0, 0, -Math.PI * 0.5, 0, 22, 10);
      // Warm Meadow & Sand Ground Bounce
      addPanel(0x4ADE80, 0.45, 0, -8, 0, -Math.PI * 0.5, 0, 0, 26, 26);
    }
  }

  THREE.RoomEnvironment = RoomEnvironment;
})();
