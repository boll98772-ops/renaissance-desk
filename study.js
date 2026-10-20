import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 所有家具由简单几何体组成，不下载模型或大纹理。
export function createStudy(container, onSelect) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#231c17');
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 40);
  camera.position.set(6.5, 5.2, 9.5);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  // 限制高分屏像素数；不用实时阴影、后期处理或持续动画。
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', '三维书斋；拖动旋转，点击桌上浑天仪打开札记');
  renderer.domElement.tabIndex = 0;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.8, -0.8);
  controls.enablePan = false;
  controls.minDistance = 6;
  controls.maxDistance = 14;
  controls.minPolarAngle = Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 2 - 0.08;
  controls.minAzimuthAngle = -0.72;
  controls.maxAzimuthAngle = 0.72;
  controls.update();

  const material = (color, roughness = 0.85, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const walnut = material('#39251a');
  const edge = material('#765031');
  const plaster = material('#8b795c');
  const brass = material('#b69a58', 0.36, 0.65);
  const parchment = material('#d4bd8e');
  function box(parent, size, position, surface) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), surface);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }
  // 开放的正面如同舞台剖面；限制相机角度，避免穿墙。
  for (let i = 0; i < 20; i++) {
    box(scene, [0.49, 0.12, 8], [-4.75 + i * 0.5, -0.06, 0], material(i % 3 ? '#59402b' : '#674b31'));
  }
  box(scene, [10, 5.4, 0.18], [0, 2.7, -4], plaster);
  box(scene, [0.18, 5.4, 8], [-5, 2.7, 0], walnut);
  box(scene, [0.18, 5.4, 8], [5, 2.7, 0], plaster);
  for (const y of [0.2, 5.15]) {
    box(scene, [10, 0.22, 0.25], [0, y, -3.85], edge);
    for (const x of [-4.85, 4.85]) box(scene, [0.25, 0.22, 8], [x, y, 0], edge);
  }
  // 拱窗是真正的曲线轮廓，薄玻璃嵌在后墙内侧。
  const arch = new THREE.Shape();
  arch.moveTo(-0.85, 0); arch.lineTo(0.85, 0); arch.lineTo(0.85, 1.65);
  arch.absarc(0, 1.65, 0.85, 0, Math.PI, false); arch.lineTo(-0.85, 0);
  const windowGroup = new THREE.Group();
  windowGroup.position.set(2.6, 1.65, -3.84); scene.add(windowGroup);
  const glass = new THREE.Mesh(new THREE.ShapeGeometry(arch, 20), new THREE.MeshBasicMaterial({ color: '#c9c6a4' }));
  windowGroup.add(glass);
  const framePoints = arch.getPoints(32).map(p => new THREE.Vector3(p.x, p.y, 0.035));
  const frame = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(framePoints, true), 80, 0.075, 6, true), edge);
  windowGroup.add(frame);
  box(windowGroup, [0.075, 2.4, 0.12], [0, 1.2, 0.06], walnut);
  box(windowGroup, [1.7, 0.075, 0.12], [0, 1.4, 0.06], walnut);
  box(windowGroup, [1.95, 0.12, 0.4], [0, -0.05, 0.12], edge);

  const bookcase = new THREE.Group(); bookcase.position.set(-2.5, 0, -3.35); scene.add(bookcase);
  box(bookcase, [3.1, 4.3, 0.15], [0, 2.15, -0.35], walnut);
  for (const x of [-1.55, 1.55]) box(bookcase, [0.18, 4.5, 0.85], [x, 2.25, 0], edge);
  const bookColors = ['#63533b', '#6b382a', '#39443b', '#a58b5a'];
  const bookMaterials = bookColors.map(c => material(c));
  for (let row = 0; row < 4; row++) {
    const y = 0.35 + row * 1.05;
    box(bookcase, [3.25, 0.13, 0.9], [0, y, 0], edge);
    for (let n = 0; n < 12; n++) {
      const height = 0.58 + (n % 3) * 0.09;
      const x = -1.35 + n * 0.24;
      box(bookcase, [0.19, height, 0.48], [x, y + height / 2 + 0.07, 0.04], bookMaterials[(n + row) % 4]);
      box(bookcase, [0.19, 0.025, 0.012], [x, y + 0.2, 0.287], brass);
    }
  }
  box(bookcase, [3.4, 0.18, 1], [0, 4.5, 0], edge);

  const desk = new THREE.Group(); desk.position.set(0.5, 0, 0.6); scene.add(desk);
  for (const x of [-1.65, 1.65]) for (const z of [-0.7, 0.7]) {
    box(desk, [0.18, 1.65, 0.18], [x, 0.825, z], walnut);
  }
  box(desk, [3.65, 0.25, 1.85], [0, 1.6, 0], walnut);
  box(desk, [4, 0.18, 2.1], [0, 1.82, 0], edge);
  const paper = box(desk, [0.85, 0.015, 0.6], [0.7, 1.92, 0.35], parchment);
  paper.rotation.y = -0.2;

  // 浑天仪：黄铜圆环、中心球、立柱和底座共用一组变换。
  const globe = new THREE.Group(); globe.position.set(-0.5, 1.92, 0); globe.userData.research = true; desk.add(globe);
  function cylinder(radiusTop, radiusBottom, height, y) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 24), brass);
    mesh.position.y = y; globe.add(mesh);
  }
  cylinder(0.38, 0.44, 0.1, 0.05); cylinder(0.07, 0.14, 0.35, 0.25);
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.23, 20, 12), material('#53675a', 0.6));
  orb.position.y = 0.98; globe.add(orb);
  for (const [x, y, z] of [[0, 0, 0.35], [Math.PI / 2, 0, 0], [0, Math.PI / 2, -0.35], [0.6, 0.5, 0]]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.59, 0.025, 6, 56), brass);
    ring.position.y = 0.98; ring.rotation.set(x, y, z); globe.add(ring);
  }
  // 透明的球形命中区填补圆环空隙，让手指更容易点中。
  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 12), new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.y = 0.98; globe.add(hit);

  scene.add(new THREE.HemisphereLight('#eee1bd', '#3a2a20', 2.1));
  const sunlight = new THREE.DirectionalLight('#ffe2ac', 3.1);
  sunlight.position.set(3, 5, -2); scene.add(sunlight);
  const fill = new THREE.DirectionalLight('#dbc5a5', 0.7); fill.position.set(0, 3, 6); scene.add(fill);

  function render() { renderer.render(scene, camera); }
  controls.addEventListener('change', render);
  const resize = new ResizeObserver(() => {
    const { width, height } = container.getBoundingClientRect();
    camera.aspect = width / height;
    // 竖屏扩大视野，保留桌面和书架。
    camera.fov = width < height ? 58 : 44;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    render();
  });
  resize.observe(container);

  // 区分旋转手势与轻触；多指捏合期间不打开卡片。
  const pointers = new Set(); let start = null; let moved = false;
  const raycaster = new THREE.Raycaster();
  renderer.domElement.addEventListener('pointerdown', event => {
    pointers.add(event.pointerId);
    if (pointers.size === 1) { start = { x: event.clientX, y: event.clientY }; moved = false; }
    else moved = true;
  });
  renderer.domElement.addEventListener('pointermove', event => {
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) moved = true;
  });
  renderer.domElement.addEventListener('pointerup', event => {
    pointers.delete(event.pointerId);
    if (!start || moved || pointers.size) return;
    start = null;
    const rect = renderer.domElement.getBoundingClientRect();
    const point = new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(point, camera);
    const first = raycaster.intersectObjects(scene.children, true)[0];
    for (let object = first?.object; object; object = object.parent) {
      if (object.userData.research) { onSelect(); break; }
    }
  });
  renderer.domElement.addEventListener('pointercancel', event => {
    pointers.delete(event.pointerId); moved = true; start = null;
  });
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    const status = container.querySelector('#scene-status');
    status.hidden = false; status.textContent = '三维画面已暂停，请刷新恢复。札记仍可通过下方按钮打开。';
  });
  render();
}
