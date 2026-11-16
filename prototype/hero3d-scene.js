class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { on: false, inside: false, webgl: true };
    this.el = null;
    this.setCanvas = (el) => { this.el = el; };
    this.t = { on: 0, inside: 0 };
    this.cur = { on: 0, inside: 0, fan: 0, mx: 0, my: 0 };
  }
  componentDidMount() { this.tryInit(0); }
  componentWillUnmount() { this.dead = true; if (this.raf) cancelAnimationFrame(this.raf); if (this.ro) this.ro.disconnect(); if (this.io) this.io.disconnect(); if (this.renderer) this.renderer.dispose(); }
  tryInit(n) {
    if (this.dead) return;
    if (!window.THREE || !this.el) { if (n < 60) setTimeout(() => this.tryInit(n + 1), 100); else this.setState({ webgl: false }); return; }
    try { this.init(); } catch (e) { this.setState({ webgl: false }); }
  }
  tex(draw, w, h) {
    const T = window.THREE; const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; return t;
  }
  rrect(w, h, r, d, bevel) {
    const T = window.THREE; const s = new T.Shape(); const x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const g = new T.ExtrudeGeometry(s, { depth: d, bevelEnabled: !!bevel, bevelThickness: bevel || 0, bevelSize: bevel || 0, bevelSegments: 3, curveSegments: 10 });
    g.translate(0, 0, -d / 2); return g;
  }
  init() {
    const T = window.THREE; const el = this.el;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; this.reduce = reduce;
    const r = new T.WebGLRenderer({ canvas: el, antialias: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75)); r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
    r.outputEncoding = T.sRGBEncoding; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.0;
    this.renderer = r;
    const scene = new T.Scene(); this.scene = scene; scene.background = new T.Color('#0B1220');
    const cam = new T.PerspectiveCamera(38, 16 / 9, 0.1, 60); this.cam = cam;
    const M = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85, metalness: 0 }, o || {}));
    const add = (geo, mat, x, y, z, parent) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; (parent || scene).add(m); return m; };
    // textures (procedural stand-ins for ambientCG plaster/tiles)
    const plaster = this.tex((g, w, h) => { g.fillStyle = '#EFE9DF'; g.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { const v = 200 + Math.random() * 40; g.fillStyle = 'rgba(' + v + ',' + (v - 6) + ',' + (v - 16) + ',0.18)'; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }, 512, 512);
    plaster.repeat.set(3, 2);
    const tiles = this.tex((g, w, h) => { g.fillStyle = '#D9D4CC'; g.fillRect(0, 0, w, h); for (let i = 0; i < 4000; i++) { g.fillStyle = 'rgba(120,110,100,0.06)'; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); } g.strokeStyle = 'rgba(150,140,128,0.55)'; g.lineWidth = 3; g.strokeRect(0, 0, w, h); }, 256, 256);
    tiles.repeat.set(10, 8); tiles.encoding = T.sRGBEncoding; plaster.encoding = T.sRGBEncoding;
    // room
    const floor = add(new T.PlaneGeometry(12, 10), M('#FFFFFF', { map: tiles, roughness: 0.6 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2;
    const wallMat = M('#FFFFFF', { map: plaster, roughness: 0.95 });
    add(new T.PlaneGeometry(12, 3.4), wallMat, 0, 1.7, -3);
    const lw = add(new T.PlaneGeometry(10, 3.4), M('#E6DED2', { map: plaster }), -3.4, 1.7, 1); lw.rotation.y = Math.PI / 2;
    const ceil = add(new T.PlaneGeometry(12, 10), M('#F4EFE7'), 0, 3.4, 0); ceil.rotation.x = Math.PI / 2;
    add(new T.BoxGeometry(12, 0.1, 0.03), M('#D8CFC2'), 0, 0.05, -2.98);
    // window (night)
    add(new T.BoxGeometry(1.5, 1.3, 0.06), M('#E9E4DB'), -1.9, 1.85, -2.97);
    const sky = add(new T.PlaneGeometry(1.32, 1.12), new T.MeshBasicMaterial({ color: '#16213A' }), -1.9, 1.85, -2.93); sky.castShadow = false;
    const starsG = new T.BufferGeometry(); const sp = []; for (let i = 0; i < 40; i++) sp.push(-1.9 + (Math.random() - 0.5) * 1.25, 1.85 + (Math.random() - 0.5) * 1.05, -2.92);
    starsG.setAttribute('position', new T.Float32BufferAttribute(sp, 3)); scene.add(new T.Points(starsG, new T.PointsMaterial({ color: '#DCEFFA', size: 0.018 })));
    add(new T.BoxGeometry(0.04, 1.12, 0.04), M('#E9E4DB'), -1.9, 1.85, -2.92); add(new T.BoxGeometry(1.32, 0.04, 0.04), M('#E9E4DB'), -1.9, 1.85, -2.92);
    // sofa
    const blue = M('#3A9ADB', { roughness: 0.9 }), navyF = M('#2A3A5C', { roughness: 0.95 });
    add(new T.BoxGeometry(2.2, 0.42, 0.9), navyF, 0, 0.32, -2.45); add(new T.BoxGeometry(2.2, 0.6, 0.22), navyF, 0, 0.78, -2.82);
    add(new T.BoxGeometry(0.22, 0.6, 0.9), navyF, -1.15, 0.42, -2.45); add(new T.BoxGeometry(0.22, 0.6, 0.9), navyF, 1.15, 0.42, -2.45);
    add(this.rrect(0.55, 0.45, 0.08, 0.14, 0.02), blue, -0.55, 0.78, -2.62); const c2 = add(this.rrect(0.55, 0.45, 0.08, 0.14, 0.02), M('#F9B445', { roughness: 0.9 }), 0.45, 0.78, -2.62); c2.rotation.z = 0.08;
    add(new T.BoxGeometry(0.22, 0.12, 0.9), navyF, 0, 0.12, -2.45);
    const rug = add(new T.BoxGeometry(3.2, 0.02, 2.0), M('#DCEFFA'), 0, 0.01, -1.1); rug.castShadow = false;
    // coffee table + plant
    add(new T.CylinderGeometry(0.42, 0.42, 0.05, 40), M('#C9A27A', { roughness: 0.6 }), 0.2, 0.42, -1.2);
    add(new T.CylinderGeometry(0.04, 0.04, 0.4, 12), M('#3A3F4A'), 0.2, 0.2, -1.2);
    add(new T.CylinderGeometry(0.16, 0.12, 0.34, 24), M('#FFFFFF'), 1.75, 0.17, -2.55);
    const leaf = M('#4E9A54', { roughness: 0.9 }); [[0, 0.55, 0, 0.22], [0.1, 0.72, 0.05, 0.16], [-0.1, 0.68, -0.04, 0.17], [0.02, 0.86, 0, 0.12]].forEach((p) => add(new T.SphereGeometry(p[3], 16, 12), leaf, 1.75 + p[0], p[1], -2.55 + p[2]));
    // geyser on wall (right)
    const gy = add(new T.CylinderGeometry(0.2, 0.2, 0.62, 32), M('#FAFAFA', { roughness: 0.35 }), 2.55, 2.35, -2.75); gy.rotation.z = Math.PI / 2;
    this.geyserLed = add(new T.SphereGeometry(0.03, 16, 12), M('#3A4766', { emissive: '#F9B445', emissiveIntensity: 0 }), 2.55, 2.35, -2.53);
    // switchboard (generic Indian modular board)
    const board = new T.Group(); board.position.set(1.2, 1.25, -2.985); scene.add(board); this.board = board;
    const box = add(new T.BoxGeometry(0.44, 0.28, 0.06), M('#2A2F3A'), 0, 0, -0.01, board); box.castShadow = false;
    const module = new T.Group(); board.add(module); this.module = module;
    add(this.rrect(0.32, 0.17, 0.025, 0.045, 0.004), M('#0B1220', { roughness: 0.5 }), 0, 0, 0.0, module);
    add(this.rrect(0.07, 0.07, 0.016, 0.01), M('#3A9ADB', { roughness: 0.4 }), -0.09, 0, 0.03, module);
    const ledM = M('#3A4766', { emissive: '#F9B445', emissiveIntensity: 0 }); this.moduleLed = add(new T.SphereGeometry(0.008, 12, 8), ledM, 0.11, 0.05, 0.03, module);
    const plate = new T.Group(); board.add(plate); this.plate = plate;
    add(this.rrect(0.46, 0.3, 0.035, 0.018, 0.006), M('#FBFBFA', { roughness: 0.4 }), 0, 0, 0.045, plate);
    this.rockers = [];
    for (let i = 0; i < 4; i++) {
      const hero = i === 3;
      const rk = add(this.rrect(0.07, 0.16, 0.014, 0.022, 0.004), M(hero ? '#FFFFFF' : '#F2F3F4', { roughness: 0.35, emissive: '#F9B445', emissiveIntensity: 0 }), -0.15 + i * 0.1, 0, 0.062, plate);
      rk.rotation.x = -0.12; if (hero) { this.hero = rk; rk.userData.hero = true; }
      this.rockers.push(rk);
    }
    // ceiling fan
    const fan = new T.Group(); fan.position.set(-0.4, 3.1, -0.6); scene.add(fan); this.fan = fan;
    add(new T.CylinderGeometry(0.02, 0.02, 0.3, 8), M('#C9CED6', { metalness: 0.6, roughness: 0.4 }), 0, 0.15, 0, fan);
    add(new T.CylinderGeometry(0.13, 0.1, 0.12, 32), M('#E9ECF1', { metalness: 0.4, roughness: 0.4 }), 0, 0, 0, fan);
    const blades = new T.Group(); fan.add(blades); this.blades = blades;
    for (let i = 0; i < 3; i++) { const b = add(new T.BoxGeometry(0.85, 0.015, 0.15), M('#F1F3F6', { roughness: 0.5 }), 0, -0.02, 0, blades); b.geometry.translate(0.52, 0, 0); b.rotation.y = i * Math.PI * 2 / 3; }
    // pendant lamp
    const lampX = 1.1, lampZ = -1.4;
    add(new T.CylinderGeometry(0.006, 0.006, 0.8, 6), M('#0B1220'), lampX, 3.0, lampZ);
    const shade = add(new T.ConeGeometry(0.26, 0.26, 40, 1, true), M('#0B1220', { side: T.DoubleSide, roughness: 0.6 }), lampX, 2.55, lampZ);
    this.bulbMat = new T.MeshStandardMaterial({ color: '#FFF4E0', emissive: '#F9B445', emissiveIntensity: 0 });
    add(new T.SphereGeometry(0.07, 24, 16), this.bulbMat, lampX, 2.43, lampZ);
    // lights
    this.amb = new T.AmbientLight('#8FA6C9', 0.18); scene.add(this.amb);
    this.hemi = new T.HemisphereLight('#3D5480', '#0B1220', 0.35); scene.add(this.hemi);
    this.moon = new T.DirectionalLight('#9FB8E8', 0.5); this.moon.position.set(-3, 3, 2); scene.add(this.moon);
    this.lamp = new T.PointLight('#FFB65C', 0, 9, 1.6); this.lamp.position.set(lampX, 2.38, lampZ); this.lamp.castShadow = true; this.lamp.shadow.mapSize.set(1024, 1024); this.lamp.shadow.bias = -0.002; scene.add(this.lamp);
    this.fill = new T.PointLight('#FFD9A0', 0, 12, 2); this.fill.position.set(-1.5, 2.6, 1.5); scene.add(this.fill);
    // interaction
    this.ray = new T.Raycaster(); this.ptr = new T.Vector2();
    el.addEventListener('pointermove', (e) => { const b = el.getBoundingClientRect(); this.cur.tx = ((e.clientX - b.left) / b.width) * 2 - 1; this.cur.ty = ((e.clientY - b.top) / b.height) * 2 - 1; this.pick(e, false); });
    el.addEventListener('click', (e) => { if (this.pick(e, true)) this.toggle(); });
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(el.parentNode); this.resize();
    this.visible = true;
    this.io = new IntersectionObserver((en) => { this.visible = en[0].isIntersecting; }); this.io.observe(el);
    this.clock = new T.Clock();
    const loop = () => { if (this.dead) return; this.raf = requestAnimationFrame(loop); if (this.visible && !document.hidden) this.frame(); };
    loop();
  }
  pick(e, click) {
    const b = this.el.getBoundingClientRect(); this.ptr.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
    this.ray.setFromCamera(this.ptr, this.cam); const hit = this.ray.intersectObject(this.hero, false).length > 0;
    this.el.style.cursor = hit ? 'pointer' : 'default'; return hit;
  }
  resize() {
    const p = this.el.parentNode; const w = p.clientWidth, h = p.clientHeight; if (!w || !h) return;
    this.renderer.setSize(w, h, false); this.cam.aspect = w / h; this.W = w; this.H = h; this.cam.updateProjectionMatrix();
  }
  toggle() { this.setState({ on: !this.state.on }); }
  frame() {
    const T = window.THREE; const dt = Math.min(this.clock.getDelta(), 0.05); const c = this.cur;
    const k = this.reduce ? 1 : 1 - Math.pow(0.002, dt);
    c.on += ((this.state.on ? 1 : 0) - c.on) * k; c.inside += ((this.state.inside ? 1 : 0) - c.inside) * (this.reduce ? 1 : 1 - Math.pow(0.02, dt));
    c.mx += ((this.reduce ? 0 : (c.tx || 0)) - c.mx) * 0.05; c.my += ((this.reduce ? 0 : (c.ty || 0)) - c.my) * 0.05;
    const on = c.on, ins = c.inside;
    // lights
    this.lamp.intensity = on * 7; this.fill.intensity = on * 1.2; this.amb.intensity = 0.18 + on * 0.32; this.hemi.intensity = 0.35 + on * 0.25; this.moon.intensity = 0.5 - on * 0.25;
    this.bulbMat.emissiveIntensity = on * 3; this.geyserLed.material.emissiveIntensity = on * 2.5; this.moduleLed.material.emissiveIntensity = on * 3;
    this.hero.material.emissiveIntensity = on * 0.9; this.hero.material.color.setStyle(on > 0.5 ? '#F9B445' : '#FFFFFF');
    this.hero.rotation.x = -0.12 + on * 0.24;
    this.scene.background.setStyle('#0B1220').lerp(new T.Color('#2A2F3D'), on * 0.6);
    this.renderer.toneMappingExposure = 0.9 + on * 0.35;
    // fan
    c.fan += (this.state.on && !this.reduce ? 7 : 0 - 0) * 0 + 0; const target = this.state.on ? 7 : 0; c.fs = (c.fs || 0) + (target - (c.fs || 0)) * (1 - Math.pow(0.3, dt)); this.blades.rotation.y += c.fs * dt;
    // explode switch
    this.plate.position.set(0, ins * 0.06, ins * 0.42); this.plate.rotation.x = -ins * 0.25; this.module.position.set(0, 0, ins * 0.2);
    // camera: wide -> close-up
    const wide = new T.Vector3(2.6 + c.mx * 0.25, 1.75 - c.my * 0.12, 3.6), close = new T.Vector3(1.55, 1.42, -1.45);
    const lookW = new T.Vector3(0.35, 1.35, -2.0), lookC = new T.Vector3(1.2, 1.28, -2.9);
    const e = ins * ins * (3 - 2 * ins);
    this.cam.position.copy(wide).lerp(close, e); const look = lookW.clone().lerp(lookC, e); this.cam.lookAt(look);
    if (this.W) { const off = (1 - e) * this.W * 0.2; this.cam.setViewOffset(this.W, this.H, -off, 0, this.W, this.H); }
    this.renderer.render(this.scene, this.cam);
  }
  renderVals() {
    const on = this.state.on, ins = this.state.inside;
    return {
      setCanvas: this.setCanvas,
      webgl: this.state.webgl, noWebgl: !this.state.webgl,
      toggle: () => this.toggle(),
      toggleInside: () => this.setState({ inside: !this.state.inside }),
      pressed: on ? 'true' : 'false', insidePressed: ins ? 'true' : 'false',
      markBg: on ? '#F9B445' : 'transparent', markText: on ? '#0B1220' : '#A3B1C6',
      switchLabel: on ? 'Switch off' : 'Flip the switch',
      insideLabel: ins ? 'Back to the room' : 'See inside the switch',
      showSteps: ins, hint: on ? 'Lights on. Same switch.' : 'Tap the amber-ready rocker on the wall — or the button'
    };
  }
}
