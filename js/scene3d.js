/*
 * Hero 3D scene: a glossy glass Ponni Drops bottle with rising bubbles,
 * floating water droplets and a rippling water surface. It turns with the
 * mouse (or phone tilt) and with page scroll.
 *
 * If WebGL is missing or anything fails, the page keeps the flat bottle
 * line-up drawn by site.js.
 */
import * as THREE from './vendor/three-0.160.0.module.min.js';

const host = document.getElementById('hero-3d');
const hero = document.querySelector('.hero');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglOk() {
  try {
    const c = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) {
    return false;
  }
}

// Soft studio light as a reflection map, so the glass and caps shine.
function makeEnvironment(renderer) {
  const scene = new THREE.Scene();
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {},
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'varying vec3 vP; void main(){ float h = vP.y*0.5+0.5; vec3 c = mix(vec3(0.02,0.12,0.09), vec3(0.55,0.9,0.78), smoothstep(0.2,1.0,h)); gl_FragColor = vec4(c,1.0); }',
    }),
  );
  scene.add(sky);
  const panel = (w, h, x, y, z, intensity) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(intensity, intensity, intensity), side: THREE.DoubleSide }));
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };
  panel(6, 2.2, -5, 3, 4, 3.2);
  panel(3, 6, 6, 1, 1, 2.2);
  panel(5, 1.2, 0, 6, -2, 2.6);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(scene, 0.03).texture;
  pmrem.dispose();
  return env;
}

// Label wrapped round the bottle.
function makeLabelTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#22a46d');
  grad.addColorStop(0.5, '#0f5a3f');
  grad.addColorStop(1, '#073326');
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 256);
  g.fillStyle = 'rgba(255,255,255,.18)';
  g.fillRect(0, 18, 1024, 4);
  g.fillRect(0, 234, 1024, 4);
  for (const x of [256, 768]) {
    g.textAlign = 'center';
    g.fillStyle = '#ffffff';
    g.font = '800 74px Outfit, Arial, sans-serif';
    g.fillText('PONNI', x, 112);
    g.fillStyle = '#bff5dc';
    g.font = '700 46px Outfit, Arial, sans-serif';
    g.fillText('D R O P S', x, 166);
    g.fillStyle = 'rgba(255,255,255,.8)';
    g.font = '600 24px Manrope, Arial, sans-serif';
    g.fillText('PACKAGED DRINKING WATER', x, 210);
  }
  // Drop marks between the two brand names.
  for (const x of [0, 512, 1024]) {
    g.fillStyle = '#8fe3bd';
    g.beginPath();
    g.moveTo(x, 90);
    g.bezierCurveTo(x - 26, 130, x - 26, 162, x, 166);
    g.bezierCurveTo(x + 26, 162, x + 26, 130, x, 90);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Outline of a 1 litre PET bottle (radius, height), spun round to make it.
function bottleProfile(scale) {
  const pts = [
    [0, 0], [0.36, 0], [0.47, 0.04], [0.5, 0.14], [0.5, 0.42], [0.47, 0.47], [0.5, 0.52],
    [0.5, 1.28], [0.47, 1.33], [0.5, 1.38], [0.5, 1.52], [0.47, 1.66], [0.38, 1.82],
    [0.26, 1.96], [0.19, 2.06], [0.17, 2.14], [0.17, 2.2],
  ];
  return pts.map(([r, y]) => new THREE.Vector2(r * scale, y));
}

function build() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.environment = makeEnvironment(renderer);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 1.35, 6.2);
  camera.lookAt(0, 1.05, 0);

  scene.add(new THREE.HemisphereLight(0xd9fff0, 0x062b21, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0x6fe0cf, 18, 12);
  rim.position.set(2.5, 2.2, -2);
  scene.add(rim);

  /* Bottle */
  const bottle = new THREE.Group();
  scene.add(bottle);

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xe8fff6, metalness: 0, roughness: 0.04, transmission: 1, thickness: 0.35, ior: 1.46,
    clearcoat: 1, clearcoatRoughness: 0.03, transparent: true, opacity: 1, envMapIntensity: 1.4, side: THREE.DoubleSide,
  });
  bottle.add(new THREE.Mesh(new THREE.LatheGeometry(bottleProfile(1), 96), glass));

  const water = new THREE.MeshPhysicalMaterial({
    color: 0x9ee9cf, metalness: 0, roughness: 0.02, transmission: 0.92, thickness: 1.2, ior: 1.33,
    attenuationColor: new THREE.Color(0x2fb57a), attenuationDistance: 2.6, envMapIntensity: 1.1,
  });
  const waterPts = bottleProfile(0.93).filter((p) => p.y <= 1.74).map((p) => new THREE.Vector2(p.x, Math.max(0.03, p.y)));
  waterPts.push(new THREE.Vector2(0, 1.74));
  waterPts.unshift(new THREE.Vector2(0, 0.03));
  bottle.add(new THREE.Mesh(new THREE.LatheGeometry(waterPts, 72), water));

  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.507, 0.507, 0.7, 96, 1, true),
    new THREE.MeshPhysicalMaterial({ map: makeLabelTexture(), roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08, side: THREE.DoubleSide }),
  );
  label.position.y = 0.9;
  bottle.add(label);

  const capMat = new THREE.MeshPhysicalMaterial({ color: 0x14805a, metalness: 0.1, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 });
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.24, 48), capMat);
  cap.position.y = 2.3;
  bottle.add(cap);
  const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.205, 0.03, 48), capMat);
  capTop.position.y = 2.435;
  bottle.add(capTop);
  for (let i = 0; i < 36; i++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.2, 0.02), capMat);
    const a = (i / 36) * Math.PI * 2;
    rib.position.set(Math.cos(a) * 0.207, 2.3, Math.sin(a) * 0.207);
    rib.rotation.y = -a;
    bottle.add(rib);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 12, 48), capMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 2.15;
  bottle.add(ring);

  /* Bubbles rising inside the water */
  const BUBBLES = 70;
  const bubbleMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0, transmission: 0.6, transparent: true, opacity: 0.75, envMapIntensity: 2 });
  const bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), bubbleMat, BUBBLES);
  const bubbleState = Array.from({ length: BUBBLES }, () => ({
    a: Math.random() * Math.PI * 2, r: Math.random() * 0.36, y: Math.random() * 1.6 + 0.08,
    s: 0.008 + Math.random() * 0.022, v: 0.12 + Math.random() * 0.3, w: Math.random() * 6,
  }));
  bottle.add(bubbles);

  /* Droplets floating round the bottle */
  const DROPS = 26;
  const dropGeo = new THREE.SphereGeometry(1, 24, 16);
  dropGeo.translate(0, 1, 0);
  const pos = dropGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i); // 0..2
    const taper = y > 1 ? 1 - (y - 1) * 0.55 : 1;
    pos.setX(i, pos.getX(i) * taper);
    pos.setZ(i, pos.getZ(i) * taper);
    if (y > 1.6) pos.setY(i, y + (y - 1.6) * 0.9);
  }
  dropGeo.computeVertexNormals();
  const dropMat = new THREE.MeshPhysicalMaterial({ color: 0xbff5dc, roughness: 0, transmission: 0.85, thickness: 0.4, ior: 1.33, clearcoat: 1, envMapIntensity: 1.8 });
  const drops = new THREE.InstancedMesh(dropGeo, dropMat, DROPS);
  const dropState = Array.from({ length: DROPS }, (_, i) => ({
    a: (i / DROPS) * Math.PI * 2 + Math.random() * 0.3, r: 1.3 + Math.random() * 1.3, y: 0.2 + Math.random() * 2.4,
    s: 0.035 + Math.random() * 0.05, sp: 0.08 + Math.random() * 0.18, bob: Math.random() * 6,
  }));
  scene.add(drops);

  /* Water surface with ripples spreading from the bottle */
  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12, 160, 160),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uDeep: { value: new THREE.Color(0x062b21) }, uShallow: { value: new THREE.Color(0x3cc289) }, uFoam: { value: new THREE.Color(0xd9fff0) } },
      vertexShader: `
        uniform float uTime; varying float vH; varying float vR; varying vec3 vN;
        float h(vec2 p){ float r = length(p);
          return 0.05*sin(r*6.0 - uTime*2.2)*exp(-r*0.35) + 0.02*sin(p.x*2.3 + uTime*0.9) + 0.02*cos(p.y*2.9 - uTime*1.1); }
        void main(){ vec3 p = position; vec2 q = p.xy; float e = 0.02;
          float z = h(q); p.z = z; vH = z; vR = length(q);
          vN = normalize(vec3(-(h(q+vec2(e,0.0))-z)/e, -(h(q+vec2(0.0,e))-z)/e, 1.0));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`,
      fragmentShader: `
        uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uFoam; varying float vH; varying float vR; varying vec3 vN;
        void main(){ float light = clamp(dot(vN, normalize(vec3(-0.4,0.5,0.8))),0.0,1.0);
          vec3 c = mix(uDeep, uShallow, smoothstep(-0.04,0.06,vH)*0.7 + light*0.3);
          c = mix(c, uFoam, smoothstep(0.045,0.075,vH)*0.6);
          float a = (1.0 - smoothstep(1.2,5.5,vR)) * 0.85;
          gl_FragColor = vec4(c, a); }`,
    }),
  );
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = 0.0;
  scene.add(surface);

  /* Motion */
  const target = { x: 0, y: 0 };
  const now = { x: 0, y: 0 };
  let scrollP = 0;
  window.addEventListener('pointermove', (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    target.x = Math.max(-1, Math.min(1, e.gamma / 30));
    target.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  }, { passive: true });
  const onScroll = () => {
    const h = hero.offsetHeight || 1;
    scrollP = Math.max(0, Math.min(1, window.scrollY / h));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    baseZ = camera.aspect < 1.1 ? 7.6 : 6.2; // step back on tall, narrow screens
    camera.updateProjectionMatrix();
    if (ready) frame(); // resizing clears the canvas, so draw again
  }
  let ready = false;
  let baseZ = 6.2;
  new ResizeObserver(resize).observe(host);
  resize();

  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const v = new THREE.Vector3();
  const sc = new THREE.Vector3();
  const clock = new THREE.Clock();
  let t = 0;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;
    now.x += (target.x - now.x) * 0.05;
    now.y += (target.y - now.y) * 0.05;

    bottle.rotation.y = t * 0.35 + now.x * 0.6 + scrollP * Math.PI * 1.5;
    bottle.rotation.x = now.y * 0.08 + scrollP * 0.25;
    bottle.rotation.z = -now.x * 0.06;
    bottle.position.y = 0.12 + Math.sin(t * 1.2) * 0.06 + scrollP * 0.8;
    camera.position.x = now.x * 0.35;
    camera.position.z = baseZ + scrollP * 1.6;
    camera.lookAt(0, 1.05 + scrollP * 0.5, 0);

    bubbleState.forEach((b, i) => {
      b.y += b.v * dt;
      if (b.y > 1.7) { b.y = 0.08; b.r = Math.random() * 0.36; }
      const wob = Math.sin(t * 3 + b.w) * 0.02;
      v.set(Math.cos(b.a) * b.r + wob, b.y, Math.sin(b.a) * b.r);
      sc.setScalar(b.s);
      m4.compose(v, q.identity(), sc);
      bubbles.setMatrixAt(i, m4);
    });
    bubbles.instanceMatrix.needsUpdate = true;

    dropState.forEach((d, i) => {
      const a = d.a + t * d.sp;
      v.set(Math.cos(a) * d.r, d.y + Math.sin(t * 1.3 + d.bob) * 0.12 + scrollP * 0.6, Math.sin(a) * d.r * 0.7);
      q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI + Math.sin(t + d.bob) * 0.2);
      sc.setScalar(d.s);
      m4.compose(v, q, sc);
      drops.setMatrixAt(i, m4);
    });
    drops.instanceMatrix.needsUpdate = true;

    surface.material.uniforms.uTime.value = t;
    renderer.render(scene, camera);
  }

  // Draw only while the hero is on screen and the tab is visible.
  let visible = true;
  let running = false;
  function loop() {
    if (!visible || document.hidden) { running = false; return; }
    frame();
    requestAnimationFrame(loop);
  }
  function start() {
    if (reduceMotion) { frame(); return; }
    if (!running) { running = true; clock.getDelta(); requestAnimationFrame(loop); }
  }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(host);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });

  ready = true;
  frame();
  hero.classList.add('has-3d');
  start();
}

if (host && hero && webglOk()) {
  try {
    build();
  } catch (e) {
    console.warn('3D scene not shown:', e);
    host.innerHTML = '';
    hero.classList.remove('has-3d');
  }
}
