/* ==========================================================================
   ACE PRO 2 — STRUCTURE LAB
   Interactive Three.js teardown / product visualisation
   --------------------------------------------------------------------------
   Everything is generated in code: geometry, materials, textures, labels.
   No external 3D model assets are used.
   ========================================================================== */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// --------------------------------------------------------------------------
// 0. Constants & component data
// --------------------------------------------------------------------------

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const MODEL_ROOT_Y = 0.4;
const IS_COARSE = window.matchMedia('(pointer: coarse)').matches;
const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = new URLSearchParams(window.location.search);

const PART_DEFS = [
  {
    id: 'lens',
    index: '01',
    name: '徕卡光学镜头',
    en: 'LEICA SUMMARIT-A OPTICS',
    category: 'OPTICS / 光学模组',
    param: '13mm · F2.6',
    internal: false,
    accent: '#ff5c40',
    base: [1.42, 0.42, 1.92],
    baseRot: [0, 0, 0],
    explode: [0.55, 0.95, 3.7],
    explodeRot: [0.1, -0.15, 0.045],
    anchor: [0, 0, 0.5],
    labelOffset: [286, -120],
    description:
      '与徕卡联合调校的 SUMMARIT-A 超广角光学模组。13mm 等效焦距、F2.6 大光圈与 157° 视场角，在运动场景中同时容纳环境与主体。',
    specs: [
      ['等效焦距', '13 mm'],
      ['最大光圈', 'F2.6'],
      ['视场角', '157°'],
      ['光学结构', 'LEICA SUMMARIT-A'],
    ],
  },
  {
    id: 'sensor',
    index: '02',
    name: '1/1.3″ 8K 传感器',
    en: '1/1.3″ CMOS · 50MP',
    category: 'SENSOR / 感光元件',
    param: '50MP · 8K',
    internal: true,
    accent: '#72e9ff',
    base: [1.42, 0.42, 1.99],
    baseRot: [0, 0, 0],
    explode: [2.15, 1.38, 2.16],
    explodeRot: [-0.12, 0.22, 0.035],
    anchor: [0, 0, 0.08],
    labelOffset: [228, 48],
    description:
      '1/1.3 英寸大底 CMOS 与 5000 万像素解析力，为 8K/30fps 视频与高动态照片提供更大的感光面积。',
    specs: [
      ['传感器', '1/1.3″ CMOS'],
      ['最高视频', '8K / 30FPS'],
      ['静态照片', '50MP'],
      ['视频编码', 'H.264 / H.265'],
    ],
  },
  {
    id: 'mainboard',
    index: '03',
    name: '双芯影像主板',
    en: 'DUAL-CHIP IMAGE PLATFORM',
    category: 'COMPUTE / 计算平台',
    param: '5nm AI',
    internal: true,
    accent: '#b7ff71',
    base: [-0.15, 0.05, 0.34],
    baseRot: [0, 0, 0],
    explode: [-2.36, 1.82, 1.58],
    explodeRot: [-0.1, 0.33, -0.06],
    anchor: [0, 0, 0.12],
    labelOffset: [-222, -104],
    description:
      '专业影像芯片与 5nm AI 芯片组成双芯平台，实时完成降噪、HDR 合成、稳定与 8K 编码。',
    specs: [
      ['架构', '双芯影像平台'],
      ['AI 制程', '5nm'],
      ['最高码率', '180 Mbps'],
      ['存储', 'microSD ≤ 1TB'],
    ],
  },
  {
    id: 'screen',
    index: '04',
    name: '2.5″ 翻转触控屏',
    en: '2.5″ FLIP TOUCHSCREEN',
    category: 'DISPLAY / 显示总成',
    param: '329PPI · 900nit',
    internal: false,
    accent: '#ffb26b',
    base: [0, 4.58, -0.86],
    baseRot: [-0.055, 0, 0],
    explode: [0.18, 1.35, -1.4],
    explodeRot: [0.018, 0.045, 0.008],
    anchor: [0, 0, 0.15],
    labelOffset: [-272, -48],
    description:
      '可上翻 180° 的 2.5 英寸触控屏，329 PPI 与 900 nit 峰值亮度，让自拍取景与户外监看同样清晰。',
    specs: [
      ['屏幕尺寸', '2.5″ 触控'],
      ['像素密度', '329 PPI'],
      ['峰值亮度', '900 nit'],
      ['结构', '上翻式铰链'],
    ],
  },
  {
    id: 'battery',
    index: '05',
    name: '1800mAh 高密度电池',
    en: '1800mAh SWAPPABLE CELL',
    category: 'POWER / 能源系统',
    param: '1800mAh',
    internal: true,
    accent: '#ff5c40',
    base: [2.86, -0.1, -0.36],
    baseRot: [0, 0, 0],
    explode: [3.08, -0.06, 0.38],
    explodeRot: [0.05, 0.19, 0.06],
    anchor: [0, 0, 0.15],
    labelOffset: [162, 92],
    description:
      '1800mAh 可换电池，最长 180 分钟 1080p 录制。支持 USB-C 快充与反向应急充电，随时补能。',
    specs: [
      ['容量', '1800 mAh'],
      ['最长续航', '180 min'],
      ['充电', 'USB-C 快充'],
      ['结构', '侧向可换电'],
    ],
  },
  {
    id: 'acoustic',
    index: '06',
    name: '麦克风防风阵列',
    en: 'MIC ARRAY + WIND GUARD',
    category: 'AUDIO / 声学系统',
    param: 'WIND GUARD',
    internal: false,
    accent: '#d9f4ff',
    base: [0, 2.64, 0.54],
    baseRot: [0, 0, 0],
    explode: [-2.06, 2.16, 1.28],
    explodeRot: [0.2, 0.35, -0.15],
    anchor: [0, 0, 0.12],
    labelOffset: [-214, -116],
    description:
      '高信噪比麦克风阵列搭配可拆卸防风罩，在高速运动与强风环境中保留更干净的人声与环境声。',
    specs: [
      ['收音', '麦克风阵列'],
      ['配件', '可拆卸防风罩'],
      ['降噪', '智能风噪抑制'],
      ['声场', '立体声'],
    ],
  },
  {
    id: 'io',
    index: '07',
    name: '侧边 I/O 控制模块',
    en: 'USB-C / microSD / Q-BUTTON',
    category: 'I/O / 接口控制',
    param: 'USB 3.0',
    internal: false,
    accent: '#9adfff',
    base: [-3.58, 0, -0.1],
    baseRot: [0, 0, 0],
    explode: [-2.58, 0.38, 1.62],
    explodeRot: [0.02, 1.16, 0.04],
    anchor: [0, 0, 0],
    labelOffset: [-194, 94],
    description:
      '集成 USB 3.0 Type-C、microSD 卡槽、电源键与 Q 快捷键的侧边模块，兼顾高速传输与单手操控。',
    specs: [
      ['接口', 'USB-C 3.0'],
      ['存储卡', 'microSD ≤ 1TB'],
      ['按键', '电源 + Q'],
      ['功能', '反向充电'],
    ],
  },
  {
    id: 'mount',
    index: '08',
    name: '磁吸快拆底座',
    en: 'MAGNETIC QUICK-RELEASE',
    category: 'MOUNT / 固定结构',
    param: 'DUAL PRONG',
    internal: false,
    accent: '#b6c7cc',
    base: [0, -2.68, 0],
    baseRot: [0, 0, 0],
    explode: [0.68, 0.17, 2.95],
    explodeRot: [0.42, 0.12, 0.05],
    anchor: [0, 0, 0.12],
    labelOffset: [132, 110],
    description:
      '磁吸对齐与双爪锁止相结合的快拆底座，兼容 Ace Pro 2 配件生态，在机位之间快速切换。',
    specs: [
      ['结构', '磁吸快拆'],
      ['锁止', '双爪卡扣'],
      ['兼容', '运动相机配件'],
      ['材质', '金属复合'],
    ],
  },
  {
    id: 'cooling',
    index: '09',
    name: '全域散热中框',
    en: 'COPPER THERMAL FRAME',
    category: 'THERMAL / 热管理',
    param: 'COPPER + GRAPHITE',
    internal: true,
    accent: '#e7a06f',
    base: [0, 0.15, -1.25],
    baseRot: [0, 0, 0],
    explode: [-2.95, -2.05, 2.55],
    explodeRot: [0.32, Math.PI + 0.22, 0.06],
    anchor: [0, 0, 0.12],
    labelOffset: [-204, 138],
    description:
      '覆盖主板与传感器背部的铜质均热结构中框，快速导出 8K 录制热量，帮助相机维持长时间稳定输出。',
    specs: [
      ['结构', '全金属散热中框'],
      ['导热', '铜 / 石墨复合'],
      ['目标', '8K 持续录制'],
      ['位置', '主板背侧'],
    ],
  },
];

const PART_BY_ID = Object.fromEntries(PART_DEFS.map((p) => [p.id, p]));

// --------------------------------------------------------------------------
// 1. DOM references, state, boot
// --------------------------------------------------------------------------

const el = {
  app: document.getElementById('app'),
  scene: document.getElementById('scene'),
  loader: document.getElementById('loader'),
  loaderBar: document.getElementById('loaderBar'),
  loaderStatus: document.getElementById('loaderStatus'),
  loaderPct: document.getElementById('loaderPct'),
  partsPanel: document.getElementById('partsPanel'),
  partsList: document.getElementById('partsList'),
  detailPanel: document.getElementById('detailPanel'),
  panelClose: document.getElementById('panelClose'),
  panelHandle: document.getElementById('panelHandle'),
  assemblyState: document.getElementById('assemblyState'),
  assemblyBar: document.getElementById('assemblyBar'),
  assemblyCount: document.getElementById('assemblyCount'),
  assemblyMode: document.getElementById('assemblyMode'),
  explodeBtn: document.getElementById('explodeBtn'),
  xrayBtn: document.getElementById('xrayBtn'),
  autoBtn: document.getElementById('autoBtn'),
  helpBtn: document.getElementById('helpBtn'),
  helpModal: document.getElementById('helpModal'),
  modalClose: document.getElementById('modalClose'),
  labelsLayer: document.getElementById('labelsLayer'),
  leaderSvg: document.getElementById('leaderSvg'),
  labelNodes: document.getElementById('labelNodes'),
  selectionCaption: document.getElementById('selectionCaption'),
  selectionCaptionText: document.getElementById('selectionCaptionText'),
  toast: document.getElementById('toast'),
  firstHint: document.getElementById('firstHint'),
  guideChip: document.getElementById('guideChip'),
  guideDismiss: document.getElementById('guideDismiss'),
};

const state = {
  ready: false,
  selectedId: null,
  hoveredId: null,
  lastPointerInside: false,
  xray: false,
  xrayMix: 0,
  autoRotate: !PREFERS_REDUCED_MOTION,
  autoRotatePausedUntil: 0,
  modalOpen: false,
  allExploded: false,
  userHasZoomed: false,
  isDragging: false,
  mobileDrawerOpen: false,
  clock: 0,
  frame: 0,
  lastAssemblyCount: -1,
  lastAssemblyMode: '',
  toastTimer: 0,
  hintTimer: 0,
  firstInteractionDone: false,
  introFinished: false,
  initialCameraTween: false,
};

const parts = [];
let partById = {};
const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2(-10, -10);
const stageSafe = { left: 0, right: 0, top: 0, bottom: 0 };

const ui = {
  labels: {},
  layoutRects: [],
  hoverSource: null,
};

let renderer;
let scene;
let camera;
let controls;
let composer;
let renderPass;
let outlinePass;
let bloomPass;
let outputPass;
let clock;
let modelRoot;
let bodyRoot;
let environmentTexture;
let selectedAura;
let selectionAuraMat;
let selectionAuraTexture;
let particleCloud;
let particleCloud2;
let stageGroup;
let stageRings = [];
let pulseRings = [];
let gridUniforms;
let gridPlane;
let tickGroup;
let modelCenter = new THREE.Vector3(0, 1.8, 0);
let cameraTween = null;
let tempVec = new THREE.Vector3();
let tempVec2 = new THREE.Vector3();
let tempBox = new THREE.Box3();
let tempSphere = new THREE.Sphere();
let activeSectionStart = 0;
let resizeTimer = 0;
let firstFrame = true;

const interactiveMeshes = [];
const blockerMeshes = [];
const bodyMaterialRecords = [];
const clickableObjects = [];

let M = {};
let TEX = {};

// --------------------------------------------------------------------------
// 2. Math / DOM / texture helpers
// --------------------------------------------------------------------------

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function seededRandom(seed = 2024) {
  let a = seed >>> 0;
  return function random() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function setLoader(progress, text) {
  const p = Math.round(clamp(progress, 0, 100));
  el.loaderBar.style.transform = `scaleX(${p / 100})`;
  el.loaderPct.textContent = String(p).padStart(2, '0');
  if (text) el.loaderStatus.textContent = text;
}

function fatalError(message, err) {
  console.error('[ACE PRO 2 / STRUCTURE LAB]', err || message);
  if (el.loaderStatus) {
    el.loaderStatus.textContent = message;
    el.loaderStatus.style.color = '#ff745c';
  }
  if (el.loaderPct) el.loaderPct.textContent = '!!';
  if (el.loaderBar) el.loaderBar.style.background = 'linear-gradient(90deg, #7d1b10, #ff4332)';
  if (el.loaderBar) el.loaderBar.style.transform = 'scaleX(1)';
}

function makeRNG(seed) {
  return seededRandom(seed);
}

function roundedRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function fillSpacedText(ctx, text, x, y, spacing, align = 'left') {
  const chars = Array.from(text);
  let width = 0;
  for (let i = 0; i < chars.length; i++) {
    width += ctx.measureText(chars[i]).width;
    if (i < chars.length - 1) width += spacing;
  }
  let cursor = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], cursor, y);
    cursor += ctx.measureText(chars[i]).width + spacing;
  }
  return width;
}

function canvasToTexture(canvas, { srgb = true, repeat = null, anisotropy = 8 } = {}) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.anisotropy = Math.min(anisotropy, renderer?.capabilities?.getMaxAnisotropy?.() || 8);
  if (repeat) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat[0], repeat[1]);
  }
  texture.needsUpdate = true;
  return texture;
}

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function makeGlowTexture(size = 160, stops = null) {
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  const colors =
    stops ||
    [
      [0, 'rgba(255,255,255,1)'],
      [0.12, 'rgba(255,255,255,.75)'],
      [0.38, 'rgba(255,255,255,.22)'],
      [0.72, 'rgba(255,255,255,.035)'],
      [1, 'rgba(255,255,255,0)'],
    ];
  colors.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvasToTexture(canvas, { srgb: true });
}

function makeStreakTexture() {
  const canvas = makeCanvas(512, 256);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 256);
  const g = ctx.createRadialGradient(260, 128, 0, 260, 128, 210);
  g.addColorStop(0, 'rgba(255,255,255,.95)');
  g.addColorStop(0.08, 'rgba(207,255,252,.8)');
  g.addColorStop(0.24, 'rgba(127,240,255,.32)');
  g.addColorStop(0.62, 'rgba(70,194,255,.06)');
  g.addColorStop(1, 'rgba(70,194,255,0)');
  ctx.save();
  ctx.translate(256, 128);
  ctx.scale(1, 0.28);
  ctx.translate(-256, -128);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);
  ctx.restore();
  // sharp curved mini-glint
  ctx.save();
  ctx.translate(250, 128);
  ctx.rotate(-0.18);
  const lg = ctx.createLinearGradient(-130, 0, 160, 0);
  lg.addColorStop(0, 'rgba(255,255,255,0)');
  lg.addColorStop(0.35, 'rgba(255,255,255,.8)');
  lg.addColorStop(0.7, 'rgba(206,255,254,.7)');
  lg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.strokeStyle = lg;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, 143, 18, 0, 0.22 * Math.PI, 0.78 * Math.PI);
  ctx.stroke();
  ctx.restore();
  return canvasToTexture(canvas, { srgb: true });
}

function roundedRectShape(w, h, r, clockwise = false) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  const radius = Math.min(r, w / 2, h / 2);
  if (!clockwise) {
    s.moveTo(x + radius, y);
    s.lineTo(x + w - radius, y);
    s.quadraticCurveTo(x + w, y, x + w, y + radius);
    s.lineTo(x + w, y + h - radius);
    s.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    s.lineTo(x + radius, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - radius);
    s.lineTo(x, y + radius);
    s.quadraticCurveTo(x, y, x + radius, y);
  } else {
    s.moveTo(x + radius, y);
    s.quadraticCurveTo(x, y, x, y + radius);
    s.lineTo(x, y + h - radius);
    s.quadraticCurveTo(x, y + h, x + radius, y + h);
    s.lineTo(x + w - radius, y + h);
    s.quadraticCurveTo(x + w, y + h, x + w, y + h - radius);
    s.lineTo(x + w, y + radius);
    s.quadraticCurveTo(x + w, y, x + w - radius, y);
  }
  s.closePath();
  return s;
}

function roundedRectHole(w, h, r) {
  return roundedRectShape(w, h, r, true);
}

function makeRoundedFrameGeometry(w, h, thickness, radius, depth = 0.06, bevel = 0.012) {
  const shape = roundedRectShape(w, h, radius, false);
  shape.holes.push(roundedRectHole(w - thickness * 2, h - thickness * 2, Math.max(0.01, radius - thickness)));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 12,
  });
  geo.center();
  return geo;
}

function roundedBox(w, h, d, r = 0.1, segments = 4) {
  return new RoundedBoxGeometry(w, h, d, segments, Math.min(r, Math.min(w, h, d) * 0.49));
}

function addMesh(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], options = {}) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  if (!options.noShadow) {
    mesh.castShadow = options.castShadow !== false;
    mesh.receiveShadow = options.receiveShadow !== false;
  }
  if (options.name) mesh.name = options.name;
  if (options.renderOrder !== undefined) mesh.renderOrder = options.renderOrder;
  parent.add(mesh);
  return mesh;
}

function addPlane(parent, w, h, material, pos, rot = [0, 0, 0], opts = {}) {
  return addMesh(parent, new THREE.PlaneGeometry(w, h), material, pos, rot, opts);
}

function addScrew(parent, x, y, z, radius = 0.045, rotation = [0, 0, 0], material = null) {
  const mat = material || M.screw;
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.set(rotation[0], rotation[1], rotation[2]);
  const head = addMesh(group, new THREE.CylinderGeometry(radius, radius, 0.022, 16), mat, [0, 0, 0], [0, 0, 0]);
  head.castShadow = false;
  const slot = addMesh(group, new THREE.BoxGeometry(radius * 1.2, radius * 0.16, 0.006), M.screwSlot, [0, 0, 0.012], [0, 0, Math.PI * 0.22]);
  slot.castShadow = false;
  parent.add(group);
  return group;
}

function addVerticalTextPlane(parent, texture, width, height, position, rotation, opts = {}) {
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    opacity: opts.opacity ?? 0.8,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  return addPlane(parent, width, height, mat, position, rotation, { castShadow: false, receiveShadow: false, renderOrder: opts.renderOrder ?? 2 });
}

// --------------------------------------------------------------------------
// 3. Procedural textures
// --------------------------------------------------------------------------

function createGrainTexture() {
  const size = 512;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(size, size);
  const rand = makeRNG(7719);
  for (let i = 0; i < image.data.length; i += 4) {
    const v = 105 + rand() * 80;
    image.data[i] = v;
    image.data[i + 1] = v;
    image.data[i + 2] = v;
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = rand() > 0.5 ? '#e0e0e0' : '#303030';
    ctx.lineWidth = rand() * 1.2;
    ctx.beginPath();
    ctx.moveTo(rand() * size, rand() * size);
    ctx.lineTo(rand() * size, rand() * size);
    ctx.stroke();
  }
  const texture = canvasToTexture(canvas, { srgb: false, repeat: [4, 3] });
  return texture;
}

function createBrushedTexture() {
  const w = 512;
  const h = 256;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#777';
  ctx.fillRect(0, 0, w, h);
  const rand = makeRNG(9282);
  for (let i = 0; i < 2600; i++) {
    const y = rand() * h;
    const alpha = 0.02 + rand() * 0.1;
    ctx.strokeStyle = rand() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.lineWidth = 0.5 + rand();
    ctx.beginPath();
    ctx.moveTo(-20, y);
    ctx.lineTo(w + 20, y + (rand() - 0.5) * 1.6);
    ctx.stroke();
  }
  return canvasToTexture(canvas, { srgb: false, repeat: [2, 2] });
}

function createLensTextTexture() {
  const S = 1024;
  const canvas = makeCanvas(S, S);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, S, S);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(211,216,207,.9)';
  ctx.font = '500 48px Bahnschrift, "Segoe UI", Arial, sans-serif';
  fillSpacedText(ctx, 'LEICA', S / 2, 84, 15, 'center');

  ctx.fillStyle = 'rgba(230,232,222,.84)';
  ctx.font = '500 22px "Cascadia Mono", Consolas, monospace';
  const arcText = 'SUPER-SUMMARIT-A  13  2.6  1/1.3 ASPH.';
  const chars = [...arcText];
  const R = 407;
  const startAngle = 2.24;
  const endAngle = 0.902;
  const cx = S / 2;
  const cy = S / 2;
  const step = (endAngle - startAngle) / (chars.length - 1);
  for (let i = 0; i < chars.length; i++) {
    const a = startAngle + step * i;
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a - Math.PI / 2);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
  }

  ctx.fillStyle = 'rgba(226,229,217,.65)';
  ctx.font = '500 17px "Cascadia Mono", Consolas, monospace';
  fillSpacedText(ctx, 'CO-ENGINEERED WITH LEICA', S / 2, S - 83, 3.8, 'center');

  // tiny red Leica mark
  ctx.fillStyle = 'rgba(225,50,34,.92)';
  ctx.beginPath();
  ctx.arc(S / 2, 145, 6, 0, TAU);
  ctx.fill();
  return canvasToTexture(canvas, { srgb: true });
}

function createLensCoatingTexture() {
  const S = 512;
  const canvas = makeCanvas(S, S);
  const ctx = canvas.getContext('2d');
  const c = S / 2;
  ctx.clearRect(0, 0, S, S);
  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, S * 0.49, 0, TAU);
  ctx.clip();

  const base = ctx.createRadialGradient(c - 24, c - 30, 16, c, c, S * 0.5);
  base.addColorStop(0, 'rgba(14,54,49,.35)');
  base.addColorStop(0.44, 'rgba(8,37,35,.22)');
  base.addColorStop(0.72, 'rgba(24,82,74,.18)');
  base.addColorStop(0.9, 'rgba(98,89,131,.2)');
  base.addColorStop(1, 'rgba(1,6,6,.5)');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);

  // teal and magenta optical coating crescents
  ctx.strokeStyle = 'rgba(87,225,206,.28)';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(c, c, S * 0.405, Math.PI * 0.66, Math.PI * 1.45);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(158,88,164,.15)';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(c, c, S * 0.46, Math.PI * 1.55, Math.PI * 2.36);
  ctx.stroke();

  // concentric optical steps
  for (let i = 0; i < 7; i++) {
    ctx.strokeStyle = `rgba(158,222,205,${0.028 + i * 0.007})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(c, c, 34 + i * 24, 0, TAU);
    ctx.stroke();
  }

  // dark pupil, slightly offset like a real optical stack
  const pupil = ctx.createRadialGradient(c + 14, c + 8, 2, c + 14, c + 8, 56);
  pupil.addColorStop(0, 'rgba(1,7,8,.92)');
  pupil.addColorStop(0.58, 'rgba(4,17,17,.75)');
  pupil.addColorStop(1, 'rgba(5,22,20,0)');
  ctx.fillStyle = pupil;
  ctx.beginPath();
  ctx.arc(c + 14, c + 8, 64, 0, TAU);
  ctx.fill();

  // faint anti-reflective flare
  const flare = ctx.createLinearGradient(c - 145, c - 120, c + 120, c + 130);
  flare.addColorStop(0, 'rgba(175,240,231,0)');
  flare.addColorStop(0.4, 'rgba(175,240,231,.085)');
  flare.addColorStop(0.58, 'rgba(238,205,239,.045)');
  flare.addColorStop(1, 'rgba(175,240,231,0)');
  ctx.fillStyle = flare;
  ctx.fillRect(0, 0, S, S);

  // edge falloff
  const edge = ctx.createRadialGradient(c, c, S * 0.35, c, c, S * 0.5);
  edge.addColorStop(0, 'rgba(0,0,0,0)');
  edge.addColorStop(0.75, 'rgba(0,0,0,.16)');
  edge.addColorStop(1, 'rgba(0,0,0,.65)');
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, S, S);
  ctx.restore();
  return canvasToTexture(canvas, { srgb: true });
}

function createFrontDisplayTexture() {
  const S = 768;
  const canvas = makeCanvas(S, S);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, S, S);
  // dark camera screen
  const bg = ctx.createLinearGradient(0, 0, 0, S);
  bg.addColorStop(0, '#06090a');
  bg.addColorStop(0.6, '#08100f');
  bg.addColorStop(1, '#030606');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  ctx.save();
  roundedRectPath(ctx, 18, 18, S - 36, S - 36, 54);
  ctx.clip();

  // faint tech glow
  const glow = ctx.createRadialGradient(S * 0.55, S * 0.45, 0, S * 0.55, S * 0.45, S * 0.6);
  glow.addColorStop(0, 'rgba(56,199,197,.085)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, S, S);

  ctx.fillStyle = 'rgba(235,241,235,.8)';
  ctx.font = '500 24px "Cascadia Mono", Consolas, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('REC', 66, 92);
  ctx.fillStyle = '#ff4936';
  ctx.beginPath();
  ctx.arc(46, 84, 7, 0, TAU);
  ctx.fill();

  // battery
  ctx.strokeStyle = 'rgba(224,235,228,.58)';
  ctx.lineWidth = 2;
  roundedRectPath(ctx, S - 130, 67, 50, 26, 5);
  ctx.stroke();
  ctx.fillStyle = 'rgba(224,235,228,.7)';
  ctx.fillRect(S - 76, 75, 4, 10);
  ctx.fillRect(S - 121, 74, 34, 12);

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(210,224,216,.58)';
  ctx.font = '400 21px "Cascadia Mono", Consolas, monospace';
  ctx.fillText('2h59m', S - 207, 89);

  // main readout
  ctx.fillStyle = 'rgba(244,247,240,.96)';
  ctx.font = '300 168px Bahnschrift, "Segoe UI", Arial, sans-serif';
  ctx.fillText('8K', 62, S * 0.56);
  ctx.fillStyle = 'rgba(222,232,225,.62)';
  ctx.font = '400 35px "Cascadia Mono", Consolas, monospace';
  ctx.fillText('30 / 16:9', 70, S * 0.64);
  ctx.font = '400 24px "Cascadia Mono", Consolas, monospace';
  ctx.fillStyle = 'rgba(148,171,167,.55)';
  ctx.fillText('157°  ·  HDR', 70, S * 0.71);

  // timer line
  ctx.strokeStyle = 'rgba(210,226,219,.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(68, S - 156);
  ctx.lineTo(S - 68, S - 156);
  ctx.stroke();

  ctx.fillStyle = 'rgba(216,230,223,.55)';
  ctx.font = '400 18px "Cascadia Mono", Consolas, monospace';
  ctx.fillText('00:05:12', 68, S - 112);
  ctx.fillStyle = 'rgba(255,75,55,.75)';
  ctx.fillText('●', 257, S - 112);

  // bottom red energy line
  const bar = ctx.createLinearGradient(0, 0, S, 0);
  bar.addColorStop(0, 'rgba(255,63,42,.85)');
  bar.addColorStop(0.45, 'rgba(255,63,42,.2)');
  bar.addColorStop(1, 'rgba(255,63,42,0)');
  ctx.fillStyle = bar;
  ctx.fillRect(64, S - 68, S - 128, 3);

  // grid corners
  ctx.strokeStyle = 'rgba(210,231,222,.08)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo((S / 4) * i, 120);
    ctx.lineTo((S / 4) * i, S - 150);
    ctx.stroke();
  }

  ctx.restore();

  // bezel line
  ctx.strokeStyle = 'rgba(202,218,213,.12)';
  ctx.lineWidth = 2;
  roundedRectPath(ctx, 17, 17, S - 34, S - 34, 54);
  ctx.stroke();

  return canvasToTexture(canvas, { srgb: true });
}

function drawScreenLandscape(ctx, w, h) {
  const rand = makeRNG(8129);
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, '#171412');
  sky.addColorStop(0.2, '#39211b');
  sky.addColorStop(0.48, '#a14d32');
  sky.addColorStop(0.72, '#d98052');
  sky.addColorStop(1, '#1e1815');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // sun
  const sunX = w * 0.75;
  const sunY = h * 0.37;
  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, w * 0.26);
  sun.addColorStop(0, 'rgba(255,215,155,.72)');
  sun.addColorStop(0.08, 'rgba(255,161,92,.55)');
  sun.addColorStop(0.36, 'rgba(194,92,49,.15)');
  sun.addColorStop(1, 'rgba(194,92,49,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255,224,171,.85)';
  ctx.beginPath();
  ctx.arc(sunX, sunY, w * 0.038, 0, TAU);
  ctx.fill();

  // thin dust clouds
  for (let i = 0; i < 14; i++) {
    const y = h * (0.24 + rand() * 0.25);
    const x = rand() * w;
    const grad = ctx.createLinearGradient(x, 0, x + 280, 0);
    grad.addColorStop(0, 'rgba(255,191,132,0)');
    grad.addColorStop(0.5, `rgba(255,183,123,${0.015 + rand() * 0.06})`);
    grad.addColorStop(1, 'rgba(255,191,132,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, 280 + rand() * 420, 1 + rand() * 4);
  }

  // far mountains
  ctx.fillStyle = '#37251f';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.59);
  for (let x = 0; x <= w; x += w / 18) {
    const y = h * (0.47 + Math.sin(x * 0.005 + 1.4) * 0.035 + rand() * 0.07);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h * 0.72);
  ctx.lineTo(0, h * 0.72);
  ctx.closePath();
  ctx.fill();

  // mid mountains
  ctx.fillStyle = '#251b17';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.68);
  for (let x = 0; x <= w; x += w / 20) {
    const y = h * (0.56 + Math.sin(x * 0.006 + 2.5) * 0.05 + rand() * 0.05);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h * 0.78);
  ctx.lineTo(0, h * 0.78);
  ctx.closePath();
  ctx.fill();

  // near ridge
  ctx.fillStyle = '#120f0d';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.77);
  for (let x = 0; x <= w; x += w / 22) {
    const y = h * (0.68 + Math.sin(x * 0.008 + 0.8) * 0.035 + rand() * 0.025);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // ground light
  const ground = ctx.createLinearGradient(0, h * 0.72, 0, h);
  ground.addColorStop(0, 'rgba(134,78,48,.22)');
  ground.addColorStop(1, 'rgba(8,8,7,0)');
  ctx.fillStyle = ground;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);

  // distant trail
  ctx.strokeStyle = 'rgba(226,154,100,.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.22, h * 0.77);
  ctx.bezierCurveTo(w * 0.4, h * 0.73, w * 0.58, h * 0.7, w * 0.86, h * 0.73);
  ctx.stroke();

  // rider silhouette
  drawRiderSilhouette(ctx, w * 0.47, h * 0.62, h * 0.24);

  // dust particles
  for (let i = 0; i < 90; i++) {
    const x = w * 0.3 + rand() * w * 0.48;
    const y = h * 0.67 + rand() * h * 0.25;
    const r = rand() * 2.6 + 0.3;
    ctx.fillStyle = `rgba(237,176,123,${0.03 + rand() * 0.15})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  // warm haze from bottom
  const haze = ctx.createLinearGradient(0, h * 0.72, 0, h);
  haze.addColorStop(0, 'rgba(189,95,54,.04)');
  haze.addColorStop(1, 'rgba(30,15,10,.56)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);

  // vignette
  const vignette = ctx.createRadialGradient(w * 0.52, h * 0.48, h * 0.2, w * 0.52, h * 0.48, w * 0.72);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(0.72, 'rgba(0,0,0,.16)');
  vignette.addColorStop(1, 'rgba(0,0,0,.68)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // grain
  for (let i = 0; i < 2200; i++) {
    ctx.fillStyle = `rgba(255,255,255,${rand() * 0.035})`;
    ctx.fillRect(rand() * w, rand() * h, 1, 1);
  }
}

function drawRiderSilhouette(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = '#0b0908';
  ctx.fillStyle = '#0b0908';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // wheels
  ctx.lineWidth = 0.075;
  ctx.beginPath();
  ctx.arc(-0.72, 0.38, 0.36, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0.8, 0.38, 0.36, 0, TAU);
  ctx.stroke();
  // wheel inner accent
  ctx.lineWidth = 0.018;
  ctx.strokeStyle = 'rgba(255,172,115,.2)';
  ctx.beginPath();
  ctx.arc(-0.72, 0.38, 0.27, 0.2, 1.9 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0.8, 0.38, 0.27, 0.25, 1.8 * Math.PI);
  ctx.stroke();

  // frame
  ctx.strokeStyle = '#0b0908';
  ctx.lineWidth = 0.055;
  ctx.beginPath();
  ctx.moveTo(-0.72, 0.38);
  ctx.lineTo(-0.24, 0.03);
  ctx.lineTo(0.32, 0.06);
  ctx.lineTo(0.78, 0.38);
  ctx.moveTo(-0.24, 0.03);
  ctx.lineTo(-0.42, 0.35);
  ctx.moveTo(0.32, 0.06);
  ctx.lineTo(0.18, -0.08);
  ctx.lineTo(0.7, -0.2);
  ctx.stroke();

  // seat/body
  ctx.beginPath();
  ctx.moveTo(-0.2, -0.06);
  ctx.lineTo(0.3, -0.12);
  ctx.lineTo(0.54, 0.01);
  ctx.lineTo(0.02, 0.07);
  ctx.closePath();
  ctx.fill();

  // rider legs
  ctx.lineWidth = 0.1;
  ctx.beginPath();
  ctx.moveTo(0.08, -0.38);
  ctx.lineTo(0.25, -0.13);
  ctx.lineTo(0.05, 0.13);
  ctx.lineTo(-0.11, 0.03);
  ctx.stroke();
  ctx.lineWidth = 0.07;
  ctx.beginPath();
  ctx.moveTo(0.25, -0.13);
  ctx.lineTo(0.49, 0.02);
  ctx.stroke();

  // torso + arms
  ctx.lineWidth = 0.14;
  ctx.beginPath();
  ctx.moveTo(0.02, -0.74);
  ctx.lineTo(0.15, -0.3);
  ctx.lineTo(0.47, -0.08);
  ctx.lineTo(0.7, -0.2);
  ctx.stroke();
  ctx.lineWidth = 0.08;
  ctx.beginPath();
  ctx.moveTo(0.08, -0.56);
  ctx.lineTo(0.42, -0.33);
  ctx.lineTo(0.65, -0.16);
  ctx.stroke();

  // helmet
  ctx.beginPath();
  ctx.ellipse(0.0, -0.84, 0.12, 0.13, -0.2, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-0.03, -0.9);
  ctx.lineTo(0.17, -0.86);
  ctx.lineTo(0.11, -0.75);
  ctx.lineTo(-0.08, -0.76);
  ctx.closePath();
  ctx.fill();

  // trailing dust strokes
  ctx.strokeStyle = 'rgba(238,182,128,.12)';
  ctx.lineWidth = 0.012;
  for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    ctx.moveTo(-0.9 - i * 0.055, 0.68 + (i % 3) * 0.04);
    ctx.lineTo(-1.3 - i * 0.1, 0.7 + (i % 4) * 0.06);
    ctx.stroke();
  }
  ctx.restore();
}

function createScreenTexture() {
  const w = 1536;
  const h = 864;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, w, h);
  ctx.save();
  roundedRectPath(ctx, 8, 8, w - 16, h - 16, 40);
  ctx.clip();

  drawScreenLandscape(ctx, w, h);

  // HUD
  ctx.textBaseline = 'middle';
  const uiAlpha = 0.82;
  ctx.fillStyle = `rgba(245,247,240,${uiAlpha})`;
  ctx.textAlign = 'left';
  ctx.font = '500 30px "Cascadia Mono", Consolas, monospace';
  ctx.fillStyle = '#ff4a36';
  ctx.beginPath();
  ctx.arc(66, 62, 9, 0, TAU);
  ctx.fill();
  ctx.fillStyle = `rgba(246,248,241,${uiAlpha})`;
  ctx.fillText('REC', 87, 62);
  ctx.font = '400 22px "Cascadia Mono", Consolas, monospace';
  ctx.fillStyle = 'rgba(244,246,237,.55)';
  ctx.fillText('00:05:12', 186, 62);

  ctx.font = '500 28px Bahnschrift, "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = `rgba(247,249,243,${uiAlpha})`;
  ctx.fillText('8K', 66, 115);
  ctx.font = '400 17px "Cascadia Mono", Consolas, monospace';
  ctx.fillStyle = 'rgba(245,247,240,.55)';
  ctx.fillText('30  ·  16:9', 120, 117);

  // top right info
  ctx.textAlign = 'right';
  ctx.font = '500 17px "Cascadia Mono", Consolas, monospace';
  ctx.fillStyle = 'rgba(246,248,240,.55)';
  ctx.fillText('LEICA', w - 68, 58);
  ctx.fillText('HDR', w - 68, 91);
  ctx.strokeStyle = 'rgba(245,248,241,.6)';
  ctx.lineWidth = 2;
  roundedRectPath(ctx, w - 212, 108, 41, 21, 4);
  ctx.stroke();
  ctx.fillStyle = 'rgba(245,248,241,.7)';
  ctx.fillRect(w - 167, 114, 3, 9);
  ctx.fillRect(w - 205, 114, 26, 9);

  // focus brackets
  ctx.strokeStyle = 'rgba(255,255,255,.26)';
  ctx.lineWidth = 1.5;
  const cx = w / 2;
  const cy = h / 2;
  const bw = 68;
  const bh = 46;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(cx + sx * bw, cy + sy * (bh - 16));
    ctx.lineTo(cx + sx * bw, cy + sy * bh);
    ctx.lineTo(cx + sx * (bw - 18), cy + sy * bh);
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, TAU);
  ctx.fillStyle = 'rgba(255,255,255,.28)';
  ctx.fill();

  // bottom timing + status
  ctx.textAlign = 'left';
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.beginPath();
  ctx.moveTo(66, h - 86);
  ctx.lineTo(w - 66, h - 86);
  ctx.stroke();
  ctx.font = '400 16px "Cascadia Mono", Consolas, monospace';
  ctx.fillStyle = 'rgba(244,247,240,.48)';
  ctx.fillText('00:00:00:00', 66, h - 55);
  ctx.fillText('MOV', 222, h - 55);
  ctx.textAlign = 'right';
  ctx.fillText('157°  ·  F2.6  ·  13MM', w - 66, h - 55);

  // exposure scale
  ctx.strokeStyle = 'rgba(255,255,255,.2)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i++) {
    const x = w / 2 - 80 + i * 20;
    ctx.beginPath();
    ctx.moveTo(x, h - 64);
    ctx.lineTo(x, h - 56 - (i === 4 ? 6 : 2));
    ctx.stroke();
  }

  // edge scan lines
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#fff';
  for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
  ctx.globalAlpha = 1;

  ctx.restore();

  // crisp black bezel edge
  ctx.strokeStyle = 'rgba(0,0,0,.8)';
  ctx.lineWidth = 6;
  roundedRectPath(ctx, 8, 8, w - 16, h - 16, 40);
  ctx.stroke();

  return canvasToTexture(canvas, { srgb: true });
}

function createFrontLogoTexture() {
  const w = 1024;
  const h = 256;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(237,240,235,.92)';
  ctx.font = '600 80px Bahnschrift, "Segoe UI", Arial, sans-serif';
  fillSpacedText(ctx, 'Insta360', 28, h / 2, 0.6, 'left');

  ctx.font = '500 54px Bahnschrift, "Segoe UI", Arial, sans-serif';
  const measure = ctx.measureText('Ace Pro 2').width;
  ctx.fillStyle = '#dd2e1d';
  roundedRectPath(ctx, 400, 73, measure + 32, 110, 10);
  ctx.fill();
  ctx.fillStyle = '#fff8f3';
  ctx.font = '500 54px Bahnschrift, "Segoe UI", Arial, sans-serif';
  ctx.fillText('Ace Pro 2', 416, h / 2 + 1);

  ctx.fillStyle = 'rgba(235,240,234,.45)';
  ctx.font = '400 16px "Cascadia Mono", Consolas, monospace';
  ctx.fillText('8K AI ACTION CAMERA', 31, 205);

  return canvasToTexture(canvas, { srgb: true });
}

function createBackLogoTexture() {
  const w = 768;
  const h = 256;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(226,234,228,.55)';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.font = '500 54px Bahnschrift, "Segoe UI", Arial, sans-serif';
  fillSpacedText(ctx, 'Insta360', w / 2, h / 2 - 8, 2.5, 'center');
  ctx.font = '400 16px "Cascadia Mono", Consolas, monospace';
  ctx.fillStyle = 'rgba(214,224,218,.3)';
  fillSpacedText(ctx, 'ACE PRO 2  /  STRUCTURE LAB', w / 2, h / 2 + 52, 3, 'center');
  return canvasToTexture(canvas, { srgb: true });
}

function createPcbTexture(seed = 1312, label = 'ACE PRO 2 / AI CORE') {
  const w = 1200;
  const h = 760;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  const rand = makeRNG(seed);
  ctx.fillStyle = '#081611';
  ctx.fillRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, 'rgba(20,58,42,.5)');
  bg.addColorStop(0.55, 'rgba(7,26,20,.3)');
  bg.addColorStop(1, 'rgba(10,18,16,.7)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // fine grid
  ctx.strokeStyle = 'rgba(114,170,130,.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // traces
  for (let i = 0; i < 130; i++) {
    const gold = rand() > 0.28;
    ctx.strokeStyle = gold
      ? `rgba(164,135,79,${0.18 + rand() * 0.35})`
      : `rgba(80,157,140,${0.08 + rand() * 0.22})`;
    ctx.lineWidth = 0.6 + rand() * 1.4;
    let x = Math.floor(rand() * w);
    let y = Math.floor(rand() * h);
    ctx.beginPath();
    ctx.moveTo(x, y);
    const steps = 2 + Math.floor(rand() * 5);
    let horizontal = rand() > 0.5;
    for (let s = 0; s < steps; s++) {
      const len = 18 + rand() * 120;
      if (horizontal) x += rand() > 0.5 ? len : -len;
      else y += rand() > 0.5 ? len : -len;
      ctx.lineTo(x, y);
      horizontal = !horizontal;
    }
    ctx.stroke();
    if (rand() > 0.45) {
      ctx.fillStyle = gold ? 'rgba(196,164,102,.55)' : 'rgba(101,195,172,.35)';
      ctx.beginPath();
      ctx.arc(x, y, 2 + rand() * 2.2, 0, TAU);
      ctx.fill();
    }
  }

  // component footprints
  for (let i = 0; i < 32; i++) {
    const x = 40 + rand() * (w - 110);
    const y = 40 + rand() * (h - 100);
    const cw = 18 + rand() * 68;
    const ch = 12 + rand() * 46;
    ctx.strokeStyle = 'rgba(204,190,145,.22)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, cw, ch);
    if (rand() > 0.6) {
      ctx.fillStyle = 'rgba(198,176,121,.12)';
      ctx.fillRect(x + 4, y + 4, cw - 8, ch - 8);
    }
  }

  // chip footprints
  ctx.strokeStyle = 'rgba(219,203,154,.32)';
  ctx.lineWidth = 2;
  ctx.strokeRect(300, 230, 184, 164);
  ctx.strokeStyle = 'rgba(100,210,189,.22)';
  ctx.strokeRect(748, 320, 132, 126);
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = 'rgba(213,193,139,.38)';
    ctx.fillRect(300 + i * 11, 218, 5, 10);
    ctx.fillRect(300 + i * 11, 396, 5, 10);
  }

  // through-hole vias
  for (let i = 0; i < 75; i++) {
    const x = 20 + rand() * (w - 40);
    const y = 20 + rand() * (h - 40);
    ctx.strokeStyle = 'rgba(190,170,114,.24)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 3 + rand() * 2, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = 'rgba(5,10,8,.75)';
    ctx.beginPath();
    ctx.arc(x, y, 1.6, 0, TAU);
    ctx.fill();
  }

  // silkscreen text
  ctx.fillStyle = 'rgba(201,220,206,.4)';
  ctx.font = '400 16px "Cascadia Mono", Consolas, monospace';
  ctx.fillText(label, 52, h - 40);
  ctx.font = '400 12px "Cascadia Mono", Consolas, monospace';
  ctx.fillStyle = 'rgba(191,210,198,.28)';
  const labels = ['R32', 'C118', 'U04', 'AI CORE', 'ISP', 'PWR', 'LDO', 'MIPI', 'VDD', 'CLK', 'I/O', 'A1'];
  for (let i = 0; i < 18; i++) {
    const x = 40 + rand() * (w - 100);
    const y = 50 + rand() * (h - 100);
    ctx.fillText(labels[i % labels.length], x, y);
  }

  // edge plating
  ctx.fillStyle = 'rgba(170,143,86,.25)';
  ctx.fillRect(0, 0, w, 3);
  ctx.fillRect(0, h - 3, w, 3);

  return canvasToTexture(canvas, { srgb: true });
}

function createChipTexture(title, subtitle = '') {
  const S = 512;
  const canvas = makeCanvas(S, S);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0d1010';
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = 'rgba(208,221,211,.14)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, S - 40, S - 40);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(230,237,229,.82)';
  ctx.font = '500 84px Bahnschrift, "Segoe UI", Arial, sans-serif';
  ctx.fillText(title, S / 2, S / 2 - 10);
  ctx.fillStyle = 'rgba(181,197,188,.42)';
  ctx.font = '400 22px "Cascadia Mono", Consolas, monospace';
  ctx.fillText(subtitle, S / 2, S / 2 + 66);
  // corner marker
  ctx.fillStyle = 'rgba(255,74,54,.7)';
  ctx.beginPath();
  ctx.arc(48, 48, 6, 0, TAU);
  ctx.fill();
  return canvasToTexture(canvas, { srgb: true });
}

function createBatteryLabelTexture() {
  const w = 600;
  const h = 1024;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#17191a';
  ctx.fillRect(0, 0, w, h);
  const rand = makeRNG(7781);
  // label face
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, 'rgba(56,59,56,.78)');
  g.addColorStop(1, 'rgba(22,25,24,.92)');
  ctx.fillStyle = g;
  ctx.fillRect(22, 22, w - 44, h - 44);
  ctx.strokeStyle = 'rgba(212,221,210,.17)';
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, w - 44, h - 44);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(241,242,235,.9)';
  ctx.font = '600 48px Bahnschrift, "Segoe UI", Arial, sans-serif';
  ctx.fillText('Insta360', 54, 92);
  ctx.fillStyle = 'rgba(255,75,56,.95)';
  ctx.beginPath();
  ctx.arc(w - 70, 90, 12, 0, TAU);
  ctx.fill();

  ctx.fillStyle = 'rgba(224,230,221,.62)';
  ctx.font = '500 20px "Cascadia Mono", Consolas, monospace';
  ctx.fillText('ACE PRO 2  /  RECHARGEABLE', 55, 142);

  ctx.fillStyle = 'rgba(242,244,237,.92)';
  ctx.font = '300 150px Bahnschrift, "Segoe UI", Arial, sans-serif';
  ctx.fillText('1800', 48, 310);
  ctx.font = '400 40px "Cascadia Mono", Consolas, monospace';
  ctx.fillStyle = 'rgba(232,236,227,.6)';
  ctx.fillText('mAh', 58, 392);

  ctx.fillStyle = 'rgba(222,230,221,.7)';
  ctx.font = '400 21px "Cascadia Mono", Consolas, monospace';
  ctx.fillText('Li-ion  /  3.85V  /  6.93Wh', 58, 460);

  // warning lines
  ctx.fillStyle = 'rgba(207,216,207,.33)';
  ctx.font = '400 16px "Cascadia Mono", Consolas, monospace';
  const caution = [
    'CAUTION: DO NOT PUNCTURE OR EXPOSE TO FIRE.',
    'USE ONLY WITH INSTA360 ACE PRO 2.',
    'DO NOT DISASSEMBLE. KEEP DRY.',
    'MADE IN CHINA  ·  LOT AC2-B1810',
  ];
  caution.forEach((line, i) => ctx.fillText(line, 58, 535 + i * 27));

  // barcode
  ctx.fillStyle = 'rgba(230,235,226,.7)';
  for (let x = 58; x < 340; x += 4 + rand() * 5) {
    if (rand() > 0.2) ctx.fillRect(x, 680, 1 + rand() * 2.2, 88);
  }
  ctx.font = '400 15px "Cascadia Mono", Consolas, monospace';
  ctx.fillStyle = 'rgba(211,222,212,.45)';
  ctx.fillText('8 971942 300218', 58, 800);

  // cert marks
  const marks = ['CE', 'UKCA', 'FC', 'PSE'];
  marks.forEach((m, i) => {
    const x = 60 + i * 92;
    ctx.strokeStyle = 'rgba(218,228,218,.28)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x + 20, 878, 21, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = 'rgba(211,224,214,.45)';
    ctx.font = '400 10px "Cascadia Mono", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(m, x + 20, 880);
    ctx.textAlign = 'left';
  });

  // bottom stripes
  ctx.fillStyle = 'rgba(255,74,55,.64)';
  ctx.fillRect(58, 947, 160, 2);
  ctx.fillStyle = 'rgba(232,238,229,.25)';
  ctx.fillRect(58, 958, w - 116, 1);

  return canvasToTexture(canvas, { srgb: true });
}

function createPerforationTextures({ cols = 34, rows = 12, seed = 49 } = {}) {
  const w = 1024;
  const h = 420;
  const rand = makeRNG(seed);
  const alphaCanvas = makeCanvas(w, h);
  const alphaCtx = alphaCanvas.getContext('2d');
  const mapCanvas = makeCanvas(w, h);
  const mapCtx = mapCanvas.getContext('2d');
  alphaCtx.fillStyle = '#000';
  alphaCtx.fillRect(0, 0, w, h);
  mapCtx.clearRect(0, 0, w, h);

  // a subtle wedge-shaped grille, echoing the front fascia
  const path = new Path2D();
  path.moveTo(40, h - 32);
  path.lineTo(40, 168);
  path.quadraticCurveTo(40, 68, 148, 68);
  path.lineTo(w - 56, 68);
  path.quadraticCurveTo(w - 20, 68, w - 20, 118);
  path.lineTo(w - 20, h - 32);
  path.quadraticCurveTo(w - 20, h - 10, w - 52, h - 10);
  path.lineTo(72, h - 10);
  path.quadraticCurveTo(40, h - 10, 40, h - 32);
  path.closePath();
  alphaCtx.fillStyle = '#fff';
  alphaCtx.fill(path);
  mapCtx.save();
  mapCtx.clip(path);
  const mg = mapCtx.createLinearGradient(0, 0, w, h);
  mg.addColorStop(0, '#3c4444');
  mg.addColorStop(0.46, '#56605f');
  mg.addColorStop(0.78, '#323a3a');
  mg.addColorStop(1, '#232a2a');
  mapCtx.fillStyle = mg;
  mapCtx.fillRect(0, 0, w, h);
  mapCtx.strokeStyle = 'rgba(255,255,255,.07)';
  mapCtx.lineWidth = 1;
  for (let x = 0; x < w; x += 8) {
    mapCtx.beginPath();
    mapCtx.moveTo(x, 0);
    mapCtx.lineTo(x + 80, h);
    mapCtx.stroke();
  }
  // bright machined edge gives this inset grille its silhouette.
  mapCtx.strokeStyle = 'rgba(222,238,234,.38)';
  mapCtx.lineWidth = 5;
  mapCtx.stroke(path);
  mapCtx.restore();

  const cellW = (w - 120) / cols;
  const cellH = (h - 112) / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 67 + col * cellW + (row % 2) * cellW * 0.5;
      const y = 90 + row * cellH;
      if (x > w - 55) continue;
      const radius = 4.2 + rand() * 1.8;
      alphaCtx.fillStyle = '#000';
      alphaCtx.beginPath();
      alphaCtx.arc(x, y, radius, 0, TAU);
      alphaCtx.fill();
      mapCtx.fillStyle = '#030404';
      mapCtx.beginPath();
      mapCtx.arc(x, y, radius, 0, TAU);
      mapCtx.fill();
    }
  }

  // accent slash, a small echo of the original fascia detail
  mapCtx.strokeStyle = 'rgba(234,242,235,.34)';
  mapCtx.lineWidth = 15;
  mapCtx.beginPath();
  mapCtx.moveTo(w * 0.6, h - 15);
  mapCtx.lineTo(w * 0.72, 70);
  mapCtx.stroke();

  return {
    alpha: canvasToTexture(alphaCanvas, { srgb: false, anisotropy: 4 }),
    map: canvasToTexture(mapCanvas, { srgb: true, anisotropy: 4 }),
  };
}

function createMicGrillTextures() {
  const w = 512;
  const h = 256;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0e1011';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#030404';
  for (let y = 20; y < h - 14; y += 17) {
    for (let x = 18; x < w - 14; x += 17) {
      ctx.beginPath();
      ctx.arc(x + (y % 2) * 4, y, 3.8, 0, TAU);
      ctx.fill();
    }
  }
  ctx.strokeStyle = 'rgba(224,235,228,.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 16);
    ctx.lineTo(w, i * 16 + 24);
    ctx.stroke();
  }
  const map = canvasToTexture(canvas, { srgb: true, anisotropy: 4 });
  const bumpCanvas = makeCanvas(w, h);
  const bctx = bumpCanvas.getContext('2d');
  bctx.fillStyle = '#fff';
  bctx.fillRect(0, 0, w, h);
  bctx.fillStyle = '#151515';
  for (let y = 20; y < h - 14; y += 17) {
    for (let x = 18; x < w - 14; x += 17) {
      bctx.beginPath();
      bctx.arc(x + (y % 2) * 4, y, 4.2, 0, TAU);
      bctx.fill();
    }
  }
  const bump = canvasToTexture(bumpCanvas, { srgb: false, anisotropy: 4 });
  return { map, bump };
}

function createSideTextTexture(lines) {
  const w = 512;
  const h = 256;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(225,235,228,.65)';
  ctx.font = '400 19px "Cascadia Mono", Consolas, monospace';
  lines.forEach((line, i) => {
    ctx.fillStyle = i === 0 ? 'rgba(239,243,235,.78)' : 'rgba(173,190,183,.5)';
    ctx.fillText(line, 18, 42 + i * 38);
  });
  return canvasToTexture(canvas, { srgb: true });
}

function createCableTexture() {
  const w = 256;
  const h = 256;
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#7b4b24';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(255,215,159,.14)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 30, h);
    ctx.stroke();
  }
  return canvasToTexture(canvas, { srgb: true, repeat: [2, 1] });
}

// --------------------------------------------------------------------------
// 4. Materials
// --------------------------------------------------------------------------

function createMaterials() {
  const grain = createGrainTexture();
  const brushed = createBrushedTexture();
  TEX = {
    grain,
    brushed,
    lensText: createLensTextTexture(),
    lensCoating: createLensCoatingTexture(),
    frontDisplay: createFrontDisplayTexture(),
    screen: createScreenTexture(),
    frontLogo: createFrontLogoTexture(),
    backLogo: createBackLogoTexture(),
    pcbFront: createPcbTexture(2391, 'ACE PRO 2 / AI CORE REV.B'),
    pcbBack: createPcbTexture(9173, 'ACE PRO 2 / POWER IO REV.B'),
    chipISP: createChipTexture('ISP', 'IMAGE PROCESSOR'),
    chipAI: createChipTexture('AI', '5NM AI ENGINE'),
    batteryLabel: createBatteryLabelTexture(),
    perforation: createPerforationTextures({ cols: 26, rows: 9, seed: 71 }),
    micGrill: createMicGrillTextures(),
    sideText: createSideTextTexture(['POWER', 'USB-C 3.0', 'microSD', 'Q / QUICK']),
    cable: createCableTexture(),
    glow: makeGlowTexture(180),
    streak: makeStreakTexture(),
  };

  const withEnv = (paramsObj) =>
    new THREE.MeshPhysicalMaterial({
      envMapIntensity: 1.15,
      ...paramsObj,
    });

  M = {
    bodyShell: withEnv({
      color: 0x1a1c1f,
      roughness: 0.57,
      metalness: 0.36,
      clearcoat: 0.12,
      clearcoatRoughness: 0.65,
      bumpMap: grain,
      bumpScale: 0.013,
    }),
    bodyFront: withEnv({
      color: 0x202226,
      roughness: 0.62,
      metalness: 0.24,
      clearcoat: 0.08,
      bumpMap: grain,
      bumpScale: 0.007,
    }),
    bodyBack: withEnv({
      color: 0x191b1e,
      roughness: 0.61,
      metalness: 0.27,
      bumpMap: grain,
      bumpScale: 0.006,
    }),
    bodyMetal: new THREE.MeshStandardMaterial({
      color: 0x3c4145,
      roughness: 0.38,
      metalness: 0.9,
      envMapIntensity: 1.25,
    }),
    topDeck: new THREE.MeshStandardMaterial({
      color: 0x262a2d,
      roughness: 0.63,
      metalness: 0.48,
      envMapIntensity: 0.8,
      bumpMap: grain,
      bumpScale: 0.004,
    }),
    darkMetal: new THREE.MeshStandardMaterial({
      color: 0x0e1114,
      roughness: 0.36,
      metalness: 0.86,
      envMapIntensity: 1.1,
    }),
    gunmetal: new THREE.MeshStandardMaterial({
      color: 0x2b3034,
      roughness: 0.3,
      metalness: 0.9,
      envMapIntensity: 1.35,
    }),
    blackPlastic: new THREE.MeshPhysicalMaterial({
      color: 0x090b0c,
      roughness: 0.42,
      metalness: 0.16,
      clearcoat: 0.45,
      clearcoatRoughness: 0.38,
      envMapIntensity: 0.85,
    }),
    glossBlack: new THREE.MeshPhysicalMaterial({
      color: 0x030405,
      roughness: 0.12,
      metalness: 0.35,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.5,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: 0x131517,
      roughness: 0.8,
      metalness: 0.04,
      bumpMap: grain,
      bumpScale: 0.02,
    }),
    screw: new THREE.MeshStandardMaterial({
      color: 0x70777b,
      metalness: 1,
      roughness: 0.31,
      envMapIntensity: 1.5,
    }),
    screwSlot: new THREE.MeshBasicMaterial({ color: 0x050607 }),
    redAccent: new THREE.MeshStandardMaterial({
      color: 0xce2a1a,
      emissive: 0xed240f,
      emissiveIntensity: 1.15,
      metalness: 0.54,
      roughness: 0.29,
      envMapIntensity: 1.2,
    }),
    redGlow: new THREE.MeshBasicMaterial({
      color: 0xff4633,
      toneMapped: false,
      transparent: true,
      opacity: 0.95,
    }),
    redLed: new THREE.MeshBasicMaterial({
      color: 0xff3824,
      toneMapped: false,
    }),
    cyanGlow: new THREE.MeshBasicMaterial({
      color: 0x8bf6ff,
      toneMapped: false,
      transparent: true,
      opacity: 0.75,
    }),
    lensMetal: new THREE.MeshStandardMaterial({
      color: 0x101215,
      metalness: 0.92,
      roughness: 0.27,
      envMapIntensity: 1.6,
    }),
    lensTexturePlane: new THREE.MeshBasicMaterial({
      map: TEX.lensText,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      opacity: 0.92,
      side: THREE.DoubleSide,
      alphaTest: 0.02,
    }),
    lensGlass: new THREE.MeshPhysicalMaterial({
      color: 0x0a201f,
      metalness: 0.16,
      roughness: 0.052,
      transmission: 0.1,
      thickness: 0.2,
      transparent: true,
      opacity: 0.82,
      clearcoat: 0.75,
      clearcoatRoughness: 0.075,
      ior: 1.5,
      envMapIntensity: 1.3,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    lensInnerGlass: new THREE.MeshBasicMaterial({
      color: 0x082522,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    }),
    lensIris: new THREE.MeshBasicMaterial({
      map: TEX.glow,
      color: 0x2a897f,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
    lensCoating: new THREE.MeshBasicMaterial({
      map: null,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
    }),
    lensStreak: new THREE.MeshBasicMaterial({
      map: TEX.streak,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
    sensorBoard: new THREE.MeshStandardMaterial({
      color: 0x0b1b16,
      metalness: 0.36,
      roughness: 0.54,
    }),
    sensorGold: new THREE.MeshStandardMaterial({
      color: 0xb78d4e,
      metalness: 1,
      roughness: 0.25,
      envMapIntensity: 1.65,
    }),
    sensorDie: new THREE.MeshPhysicalMaterial({
      color: 0x07100f,
      metalness: 0.48,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      emissive: 0x051010,
      emissiveIntensity: 0.4,
      envMapIntensity: 2.1,
    }),
    pcb: new THREE.MeshStandardMaterial({
      color: 0x2f4a36,
      roughness: 0.52,
      metalness: 0.28,
      map: TEX.pcbFront,
    }),
    pcbPlain: new THREE.MeshStandardMaterial({
      color: 0x0a1b14,
      roughness: 0.62,
      metalness: 0.25,
    }),
    pcbBack: new THREE.MeshStandardMaterial({
      color: 0x2d4a38,
      roughness: 0.55,
      metalness: 0.26,
      map: TEX.pcbBack,
    }),
    chip: new THREE.MeshPhysicalMaterial({
      color: 0x0e1111,
      roughness: 0.25,
      metalness: 0.5,
      clearcoat: 0.7,
      clearcoatRoughness: 0.18,
    }),
    chipCeramic: new THREE.MeshStandardMaterial({
      color: 0x252826,
      roughness: 0.5,
      metalness: 0.25,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: 0xcda15c,
      metalness: 1,
      roughness: 0.23,
      envMapIntensity: 1.65,
    }),
    copper: new THREE.MeshStandardMaterial({
      color: 0x985334,
      metalness: 1,
      roughness: 0.3,
      envMapIntensity: 1.6,
    }),
    copperBright: new THREE.MeshStandardMaterial({
      color: 0xc4774b,
      metalness: 1,
      roughness: 0.23,
      envMapIntensity: 1.9,
    }),
    graphite: new THREE.MeshStandardMaterial({
      color: 0x1c2221,
      roughness: 0.55,
      metalness: 0.5,
      map: null,
    }),
    displayFrame: new THREE.MeshPhysicalMaterial({
      color: 0x060708,
      roughness: 0.21,
      metalness: 0.45,
      clearcoat: 0.7,
    }),
    screenFrame: new THREE.MeshPhysicalMaterial({
      color: 0x1d2022,
      roughness: 0.42,
      metalness: 0.58,
      clearcoat: 0.12,
      envMapIntensity: 1.1,
    }),
    screenBezel: new THREE.MeshPhysicalMaterial({
      color: 0x030405,
      roughness: 0.18,
      metalness: 0.3,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05,
    }),
    screenBack: new THREE.MeshStandardMaterial({
      color: 0x1e2122,
      roughness: 0.58,
      metalness: 0.37,
      bumpMap: grain,
      bumpScale: 0.008,
    }),
    batteryShell: new THREE.MeshPhysicalMaterial({
      color: 0x17191a,
      roughness: 0.48,
      metalness: 0.32,
      clearcoat: 0.2,
      bumpMap: grain,
      bumpScale: 0.006,
    }),
    batteryLabel: new THREE.MeshBasicMaterial({
      map: TEX.batteryLabel,
      toneMapped: false,
      color: 0xb8bcaf,
    }),
    ioPlate: new THREE.MeshPhysicalMaterial({
      color: 0x191c1f,
      roughness: 0.46,
      metalness: 0.46,
      clearcoat: 0.12,
      bumpMap: grain,
      bumpScale: 0.006,
    }),
    mountMetal: new THREE.MeshStandardMaterial({
      color: 0x353a3d,
      roughness: 0.3,
      metalness: 0.92,
      envMapIntensity: 1.2,
    }),
    mountDark: new THREE.MeshStandardMaterial({
      color: 0x111416,
      roughness: 0.54,
      metalness: 0.68,
    }),
    acousticPlate: new THREE.MeshPhysicalMaterial({
      color: 0x181b1d,
      roughness: 0.46,
      metalness: 0.45,
      clearcoat: 0.13,
      bumpMap: TEX.micGrill.bump,
      bumpScale: 0.015,
    }),
    microphoneMesh: new THREE.MeshStandardMaterial({
      color: 0x373e3d,
      roughness: 0.52,
      metalness: 0.8,
      map: TEX.micGrill.map,
    }),
    whitePlastic: new THREE.MeshStandardMaterial({
      color: 0xc9cfca,
      roughness: 0.42,
      metalness: 0.05,
    }),
    ribbon: new THREE.MeshStandardMaterial({
      color: 0x8f5e2d,
      roughness: 0.46,
      metalness: 0.35,
      map: TEX.cable,
    }),
    wireBlack: new THREE.MeshStandardMaterial({
      color: 0x090b0c,
      roughness: 0.6,
      metalness: 0.2,
    }),
    bodyWire: new THREE.LineBasicMaterial({
      color: 0x62e5ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    innerWire: new THREE.LineBasicMaterial({
      color: 0x4ba8b8,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  };

  M.lensText = M.lensTexturePlane;
  M.frontDisplay = new THREE.MeshBasicMaterial({
    map: TEX.frontDisplay,
    toneMapped: false,
  });
  M.screenDisplay = new THREE.MeshBasicMaterial({
    map: TEX.screen,
    toneMapped: false,
  });
  M.frontLogo = new THREE.MeshBasicMaterial({
    map: TEX.frontLogo,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    opacity: 0.95,
  });
  M.backLogo = new THREE.MeshBasicMaterial({
    map: TEX.backLogo,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    opacity: 0.7,
  });
  M.perforation = new THREE.MeshBasicMaterial({
    color: 0x88918f,
    map: TEX.perforation.map,
    alphaMap: TEX.perforation.alpha,
    alphaTest: 0.28,
    side: THREE.DoubleSide,
  });
  M.displayGlass = new THREE.MeshPhysicalMaterial({
    color: 0x0b1619,
    metalness: 0.2,
    roughness: 0.06,
    transparent: true,
    opacity: 0.16,
    clearcoat: 1,
    envMapIntensity: 1.8,
    depthWrite: false,
  });
  M.lensCoating.map = TEX.lensCoating;
  M.screenGlass = new THREE.MeshPhysicalMaterial({
    color: 0x18201e,
    metalness: 0.1,
    roughness: 0.04,
    transparent: true,
    opacity: 0.12,
    clearcoat: 1,
    envMapIntensity: 2.4,
    depthWrite: false,
  });
  M.micMesh = new THREE.MeshStandardMaterial({
    color: 0x1f2425,
    roughness: 0.4,
    metalness: 0.7,
    map: TEX.micGrill.map,
  });
  M.sideLabels = new THREE.MeshBasicMaterial({
    map: TEX.sideText,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    opacity: 0.6,
  });

}

// --------------------------------------------------------------------------
// 5. Scene, renderer, lighting, stage
// --------------------------------------------------------------------------

function initCore() {
  renderer = new THREE.WebGLRenderer({
    canvas: el.scene,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, IS_COARSE ? 1.6 : 1.9));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x04070a, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04070a);
  scene.fog = new THREE.FogExp2(0x04070a, 0.0155);

  camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(12.2, 7.6, 16.2);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.85, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 10;
  controls.maxDistance = 60;
  controls.minPolarAngle = 0.18;
  controls.maxPolarAngle = Math.PI * 0.54;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.38;
  controls.rotateSpeed = 0.62;
  controls.zoomSpeed = 0.72;
  controls.update();

  clock = new THREE.Clock();

  // Environment for crisp lens / metal reflections.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  environmentTexture = pmrem.fromScene(room, 0.035).texture;
  scene.environment = environmentTexture;
  scene.environmentIntensity = 0.55;
  room.dispose?.();
  pmrem.dispose();

  // Lighting: warm key + cool fills, built around the small product stage.
  scene.add(new THREE.HemisphereLight(0x93c7d9, 0x040506, 0.65));

  const key = new THREE.DirectionalLight(0xffe7cf, 3.45);
  key.position.set(6.5, 10, 7.5);
  key.castShadow = true;
  key.shadow.mapSize.set(IS_COARSE ? 1024 : 2048, IS_COARSE ? 1024 : 2048);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  key.shadow.camera.left = -9;
  key.shadow.camera.right = 9;
  key.shadow.camera.top = 11;
  key.shadow.camera.bottom = -7;
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.025;
  scene.add(key);

  const coolFill = new THREE.DirectionalLight(0x58dfff, 2.35);
  coolFill.position.set(-8, 3.8, 6.2);
  scene.add(coolFill);

  const lowerFill = new THREE.DirectionalLight(0x9cc4c4, 0.85);
  lowerFill.position.set(-5.5, -2.5, 8);
  scene.add(lowerFill);

  const copperKick = new THREE.PointLight(0xffb07b, 10, 8, 2.0);
  copperKick.position.set(-4.5, -1.4, 3.5);
  scene.add(copperKick);

  const rimCool = new THREE.SpotLight(0x4cdfff, 72, 30, Math.PI * 0.27, 0.65, 1.7);
  rimCool.position.set(-7.4, 6.8, -7.4);
  rimCool.target.position.set(0, 1.5, 0);
  scene.add(rimCool);
  scene.add(rimCool.target);

  const rimWarm = new THREE.SpotLight(0xff5a37, 86, 27, Math.PI * 0.25, 0.72, 1.7);
  rimWarm.position.set(7.5, 4.7, -6.8);
  rimWarm.target.position.set(0.5, 1.9, 0);
  scene.add(rimWarm);
  scene.add(rimWarm.target);

  const frontPool = new THREE.PointLight(0xa4f1ff, 15, 12, 2.0);
  frontPool.position.set(-3.7, 3.3, 7.2);
  scene.add(frontPool);

  const lensWarm = new THREE.PointLight(0xffb37c, 14, 9, 2.0);
  lensWarm.position.set(4.4, 3.4, 6.7);
  scene.add(lensWarm);

  const redPool = new THREE.PointLight(0xff3a1e, 9, 7, 2.1);
  redPool.position.set(1.6, 1.1, 4.5);
  scene.add(redPool);

  // Very soft ambient bounce.
  const bounce = new THREE.PointLight(0x2f7d8e, 8, 16, 2);
  bounce.position.set(0, -1.8, 4.5);
  scene.add(bounce);


  modelRoot = new THREE.Group();
  modelRoot.position.y = MODEL_ROOT_Y;
  scene.add(modelRoot);

  // Radiance selection aura.
  selectionAuraTexture = makeGlowTexture(
    192,
    [
      [0, 'rgba(255,255,255,.9)'],
      [0.14, 'rgba(255,255,255,.32)'],
      [0.42, 'rgba(255,255,255,.1)'],
      [0.7, 'rgba(255,255,255,.025)'],
      [1, 'rgba(255,255,255,0)'],
    ]
  );
  selectionAuraMat = new THREE.SpriteMaterial({
    map: selectionAuraTexture,
    color: 0xff5c40,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  selectedAura = new THREE.Sprite(selectionAuraMat);
  selectedAura.scale.setScalar(3);
  selectedAura.renderOrder = 13;
  scene.add(selectedAura);

}

function buildStage() {
  stageGroup = new THREE.Group();
  stageGroup.position.y = -3.26;
  scene.add(stageGroup);

  const platform = addMesh(
    stageGroup,
    new THREE.CylinderGeometry(7.8, 8.05, 0.32, 128, 1, false),
    new THREE.MeshStandardMaterial({
      color: 0x080b0e,
      roughness: 0.3,
      metalness: 0.72,
      envMapIntensity: 0.9,
    }),
    [0, 0, 0],
    [0, 0, 0]
  );
  platform.receiveShadow = true;
  platform.castShadow = false;

  const platformRing = addMesh(
    stageGroup,
    new THREE.TorusGeometry(7.82, 0.018, 8, 128),
    new THREE.MeshBasicMaterial({
      color: 0x73ddeb,
      transparent: true,
      opacity: 0.32,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    [0, 0.17, 0],
    [Math.PI / 2, 0, 0]
  );
  platformRing.castShadow = false;

  const platformInner = addMesh(
    stageGroup,
    new THREE.TorusGeometry(6.32, 0.009, 6, 128),
    new THREE.MeshBasicMaterial({
      color: 0x94f7ff,
      transparent: true,
      opacity: 0.18,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    [0, 0.18, 0],
    [Math.PI / 2, 0, 0]
  );
  platformInner.castShadow = false;

  // radial overlay grid
  const gridMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uExplode: { value: 0 },
      uColor: { value: new THREE.Color(0x3bcfd9) },
      uAccent: { value: new THREE.Color(0xff5a3a) },
    },
    vertexShader: `
      varying vec3 vWorld;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uExplode;
      uniform vec3 uColor;
      uniform vec3 uAccent;
      varying vec3 vWorld;
      varying vec2 vUv;

      float lineGrid(vec2 p, float scale) {
        vec2 coord = p * scale;
        vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
        float line = min(grid.x, grid.y);
        return 1.0 - min(line, 1.0);
      }

      float ringLine(float radius, float width, float d) {
        return smoothstep(width, 0.0, abs(d - radius));
      }

      void main() {
        vec2 p = vWorld.xz;
        float d = length(p);
        float fade = smoothstep(13.0, 1.0, d) * smoothstep(0.4, 2.1, d);
        float gridFine = lineGrid(p, 2.3) * 0.055;
        float gridMajor = lineGrid(p, 0.42) * 0.13;
        float rings = ringLine(4.2, 0.012, d) * 0.12;
        rings += ringLine(5.55, 0.01, d) * 0.08;
        rings += ringLine(7.1, 0.018, d) * 0.13;
        float sweep = smoothstep(0.965, 1.0, sin(atan(p.y, p.x) * 2.0 + uTime * 0.3) * 0.5 + 0.5);
        sweep *= smoothstep(7.3, 3.6, d) * 0.07;
        float pulse = sin(d * 1.45 - uTime * 1.15) * 0.5 + 0.5;
        pulse = smoothstep(0.975, 1.0, pulse) * smoothstep(7.6, 2.6, d) * (0.035 + uExplode * 0.08);
        vec3 color = uColor * (gridFine + gridMajor + rings + sweep + pulse);
        color += uAccent * (ringLine(3.2, 0.01, d) * 0.05 + uExplode * 0.008);
        float alpha = fade * 0.88;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
  gridUniforms = gridMaterial.uniforms;
  gridPlane = addMesh(stageGroup, new THREE.PlaneGeometry(26, 26), gridMaterial, [0, 0.19, 0], [-Math.PI / 2, 0, 0], {
    noShadow: true,
    renderOrder: 3,
  });
  gridPlane.receiveShadow = false;

  // Outer technical tick ring.
  tickGroup = new THREE.Group();
  tickGroup.position.y = 0.2;
  stageGroup.add(tickGroup);
  const tickMat = new THREE.MeshBasicMaterial({
    color: 0x7ee9f2,
    transparent: true,
    opacity: 0.3,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const tickGeo = new THREE.BoxGeometry(0.012, 0.005, 0.15);
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * TAU;
    const r = 7.12;
    const tick = new THREE.Mesh(tickGeo, tickMat);
    tick.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    tick.rotation.y = -a;
    tick.scale.z = i % 9 === 0 ? 2.8 : i % 3 === 0 ? 1.5 : 1;
    tickGroup.add(tick);
  }

  // Broken orbital lines.
  const arcMat = new THREE.LineBasicMaterial({
    color: 0x7fe9f2,
    transparent: true,
    opacity: 0.24,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const arcMatRed = new THREE.LineBasicMaterial({
    color: 0xff5e3f,
    transparent: true,
    opacity: 0.25,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  for (let i = 0; i < 5; i++) {
    const pts = [];
    const start = (i / 5) * TAU + 0.3;
    const length = 0.18 + (i % 3) * 0.16;
    const radius = 4.3 + i * 0.9;
    for (let s = 0; s <= 40; s++) {
      const a = start + (s / 40) * length;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0.205 + i * 0.003, Math.sin(a) * radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, i === 2 ? arcMatRed : arcMat);
    stageGroup.add(line);
    stageRings.push(line);
  }

  // Contact shadow.
  const shadowCanvas = makeCanvas(256, 256);
  const sctx = shadowCanvas.getContext('2d');
  const sg = sctx.createRadialGradient(128, 128, 4, 128, 128, 128);
  sg.addColorStop(0, 'rgba(0,0,0,.82)');
  sg.addColorStop(0.38, 'rgba(0,0,0,.42)');
  sg.addColorStop(0.72, 'rgba(0,0,0,.1)');
  sg.addColorStop(1, 'rgba(0,0,0,0)');
  sctx.fillStyle = sg;
  sctx.fillRect(0, 0, 256, 256);
  const shadowTex = canvasToTexture(shadowCanvas, { srgb: false });
  const shadowMesh = addMesh(
    stageGroup,
    new THREE.PlaneGeometry(12.4, 9.2),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
      color: 0x000000,
    }),
    [0, 0.195, 0.4],
    [-Math.PI / 2, 0, 0],
    { noShadow: true, renderOrder: 2 }
  );
  shadowMesh.castShadow = false;
  shadowMesh.receiveShadow = false;

  // Floor halo glow.
  const halo = addMesh(
    stageGroup,
    new THREE.PlaneGeometry(17, 17),
    new THREE.MeshBasicMaterial({
      map: TEX.glow,
      color: 0x1a6671,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
    [0, 0.205, 0],
    [-Math.PI / 2, 0, 0],
    { noShadow: true, renderOrder: 1 }
  );
  halo.castShadow = false;
  halo.receiveShadow = false;

  // Expanding pulses used by interaction feedback.
  for (let i = 0; i < 2; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: i === 0 ? 0x6ce8f5 : 0xff5b3d,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.018, 128), mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.23 + i * 0.01;
    ring.visible = false;
    ring.userData.progress = 0;
    ring.userData.active = false;
    stageGroup.add(ring);
    pulseRings.push(ring);
  }
}

function buildParticles() {
  const rand = makeRNG(8851);
  const count = IS_COARSE ? 300 : 640;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color(0x8ee8ef),
    new THREE.Color(0xd4e5e4),
    new THREE.Color(0xff7e61),
    new THREE.Color(0x679eaa),
  ];
  for (let i = 0; i < count; i++) {
    const radius = 7 + rand() * 17;
    const angle = rand() * TAU;
    const y = -3 + rand() * 16;
    positions[i * 3] = Math.cos(angle) * radius * (0.55 + rand() * 0.65);
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(angle) * radius * (0.55 + rand() * 0.65);
    const color = palette[Math.floor(rand() * palette.length)];
    colors[i * 3] = color.r * (0.6 + rand() * 0.7);
    colors[i * 3 + 1] = color.g * (0.6 + rand() * 0.7);
    colors[i * 3 + 2] = color.b * (0.6 + rand() * 0.7);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.028,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  particleCloud = new THREE.Points(geometry, material);
  scene.add(particleCloud);

  // A few larger, softer motes.
  const count2 = IS_COARSE ? 60 : 130;
  const pos2 = new Float32Array(count2 * 3);
  const col2 = new Float32Array(count2 * 3);
  for (let i = 0; i < count2; i++) {
    pos2[i * 3] = (rand() - 0.5) * 26;
    pos2[i * 3 + 1] = -2 + rand() * 11;
    pos2[i * 3 + 2] = (rand() - 0.5) * 20 - 2;
    const warm = rand() > 0.58;
    col2[i * 3] = warm ? 1 : 0.42;
    col2[i * 3 + 1] = warm ? 0.44 : 0.9;
    col2[i * 3 + 2] = warm ? 0.22 : 0.96;
  }
  const geo2 = new THREE.BufferGeometry();
  geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
  geo2.setAttribute('color', new THREE.BufferAttribute(col2, 3));
  const mat2 = new THREE.PointsMaterial({
    size: 0.075,
    sizeAttenuation: true,
    map: TEX.glow,
    transparent: true,
    opacity: 0.24,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    alphaTest: 0.02,
  });
  particleCloud2 = new THREE.Points(geo2, mat2);
  scene.add(particleCloud2);
}

// --------------------------------------------------------------------------
// 6. Camera model — body, details and internals
// --------------------------------------------------------------------------

function tagPartGroup(group, id) {
  group.traverse((object) => {
    if (object.isMesh || object.isLine || object.isPoints) {
      object.userData.partId = id;
      if (object.isMesh) {
        const material = object.material;
        const transparent = material && (material.transparent || material.opacity < 1);
        object.castShadow = !transparent;
        object.receiveShadow = true;
        if (!transparent && object.geometry?.attributes?.position) interactiveMeshes.push(object);
      }
    }
  });
}

function tagBlockerMesh(mesh) {
  mesh.userData.isBlocker = true;
  blockerMeshes.push(mesh);
}

function collectBodyMaterials() {
  bodyRoot.traverse((object) => {
    if (!object.material) return;
    const mats = Array.isArray(object.material) ? object.material : [object.material];
    mats.forEach((material) => {
      if (!material || bodyMaterialRecords.some((r) => r.material === material)) return;
      bodyMaterialRecords.push({
        material,
        baseOpacity: material.opacity,
        baseTransparent: material.transparent,
        baseDepthWrite: material.depthWrite,
        baseColor: material.color ? material.color.clone() : null,
      });
    });
  });
}

function buildBody() {
  bodyRoot = new THREE.Group();
  bodyRoot.name = 'CameraBody';
  modelRoot.add(bodyRoot);

  const shellGeo = roundedBox(7.16, 5.22, 3.68, 0.52, 8);
  const shell = addMesh(bodyRoot, shellGeo, M.bodyShell, [0, 0, 0], [0, 0, 0], { name: 'main-shell' });
  tagBlockerMesh(shell);

  // X-ray silhouette edge.
  const edgesGeo = new THREE.EdgesGeometry(shellGeo, 34);
  const bodyEdges = new THREE.LineSegments(edgesGeo, M.bodyWire);
  bodyEdges.renderOrder = 4;
  bodyRoot.add(bodyEdges);

  // Front face plate.
  const frontPlate = addMesh(bodyRoot, roundedBox(6.96, 5.02, 0.16, 0.41, 6), M.bodyFront, [0, 0, 1.84]);
  tagBlockerMesh(frontPlate);
  const frontRim = addMesh(
    bodyRoot,
    makeRoundedFrameGeometry(7.02, 5.08, 0.045, 0.43, 0.035, 0.008),
    M.bodyMetal,
    [0, 0, 1.915]
  );
  tagBlockerMesh(frontRim);

  // Dark inlay around the lens.
  addMesh(bodyRoot, roundedBox(3.98, 3.82, 0.055, 0.46, 4), M.blackPlastic, [1.42, 0.42, 1.935], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(bodyRoot, new THREE.CylinderGeometry(1.83, 1.83, 0.085, 72), M.darkMetal, [1.42, 0.42, 1.958], [Math.PI / 2, 0, 0]);
  addMesh(bodyRoot, new THREE.TorusGeometry(1.83, 0.017, 8, 96), M.gunmetal, [1.42, 0.42, 1.995]);

  // Front mini display.
  const displayX = -1.79;
  const displayY = 0.52;
  addMesh(bodyRoot, roundedBox(2.29, 2.31, 0.12, 0.2, 5), M.displayFrame, [displayX, displayY, 1.915]);
  addPlane(bodyRoot, 2.02, 2.04, M.frontDisplay, [displayX, displayY, 1.978], [0, 0, 0], {
    castShadow: false,
    renderOrder: 1,
  });
  addPlane(bodyRoot, 2.04, 2.06, M.displayGlass, [displayX, displayY, 1.994], [0, 0, 0], {
    castShadow: false,
    renderOrder: 2,
  });
  addMesh(bodyRoot, roundedBox(2.08, 2.1, 0.012, 0.12, 3), M.screwSlot, [displayX, displayY, 1.909], [0, 0, 0], {
    castShadow: false,
  });

  // LED strip under the front display.
  addMesh(bodyRoot, roundedBox(1.2, 0.048, 0.03, 0.02, 3), M.redGlow, [displayX, -0.91, 1.993], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(bodyRoot, roundedBox(0.19, 0.05, 0.022, 0.02, 2), M.darkMetal, [displayX - 0.7, -0.91, 1.994], [0, 0, 0], {
    castShadow: false,
  });

  // Front logo.
  addPlane(bodyRoot, 2.85, 0.71, M.frontLogo, [-1.78, -2.0, 1.96], [0, 0, 0], {
    castShadow: false,
    renderOrder: 4,
  });

  // Perforated front grille.
  addMesh(bodyRoot, roundedBox(2.88, 1.24, 0.045, 0.25, 3), M.gunmetal, [1.52, -1.88, 1.945], [0, 0, 0], {
    castShadow: false,
  });
  const grill = addPlane(bodyRoot, 2.76, 1.15, M.perforation, [1.52, -1.88, 1.974], [0, 0, 0], {
    castShadow: false,
  });
  grill.renderOrder = 3;
  addMesh(bodyRoot, new THREE.BoxGeometry(0.42, 0.014, 0.012), new THREE.MeshBasicMaterial({ color: 0xd3dbd2, transparent: true, opacity: 0.26, toneMapped: false }), [2.6, -1.62, 1.982], [0, 0, -0.48], {
    castShadow: false,
    renderOrder: 4,
  });
  addMesh(bodyRoot, new THREE.SphereGeometry(0.025, 10, 8), M.redLed, [2.64, -2.3, 1.984], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(bodyRoot, roundedBox(2.55, 0.018, 0.025, 0.008, 2), M.bodyMetal, [1.42, -1.35, 1.974], [0, 0, -0.025], {
    castShadow: false,
  });
  addMesh(bodyRoot, new THREE.BoxGeometry(0.018, 0.9, 0.025), M.bodyMetal, [0.25, -1.84, 1.974], [0, 0, 0], {
    castShadow: false,
  });

  // Front corner screws.
  addScrew(bodyRoot, -3.22, -2.36, 1.99, 0.037);
  addScrew(bodyRoot, 3.22, -2.36, 1.99, 0.037);
  addScrew(bodyRoot, 3.22, 2.36, 1.99, 0.037);
  addScrew(bodyRoot, -3.22, 2.36, 1.99, 0.037);

  // Back plate.
  const backPlate = addMesh(bodyRoot, roundedBox(6.88, 4.86, 0.12, 0.39, 5), M.bodyBack, [0, 0.02, -1.86]);
  tagBlockerMesh(backPlate);
  addPlane(bodyRoot, 1.66, 1.66, M.backLogo, [0, 0.05, -1.928], [0, Math.PI, 0], {
    castShadow: false,
    renderOrder: 3,
  });

  // Back vent slots and detailing.
  for (let i = 0; i < 5; i++) {
    addMesh(bodyRoot, roundedBox(1.24, 0.026, 0.022, 0.012, 2), M.darkMetal, [-2.18, -1.53 + i * 0.11, -1.928], [0, 0, 0], {
      castShadow: false,
    });
  }
  addMesh(bodyRoot, roundedBox(0.36, 0.06, 0.03, 0.02, 2), M.redGlow, [2.4, -2.16, -1.931], [0, 0, 0], {
    castShadow: false,
  });
  addScrew(bodyRoot, -3.16, -2.28, -1.94, 0.037, [0, Math.PI, 0]);
  addScrew(bodyRoot, 3.16, -2.28, -1.94, 0.037, [0, Math.PI, 0]);
  addScrew(bodyRoot, 3.16, 2.27, -1.94, 0.037, [0, Math.PI, 0]);
  addScrew(bodyRoot, -3.16, 2.27, -1.94, 0.037, [0, Math.PI, 0]);

  // Top deck.
  addMesh(bodyRoot, roundedBox(6.88, 0.13, 3.38, 0.3, 5), M.topDeck, [0, 2.58, -0.16], [0, 0, 0], {
    castShadow: true,
  });
  addMesh(bodyRoot, roundedBox(6.6, 0.06, 3.12, 0.24, 4), M.bodyShell, [0, 2.64, -0.22], [0, 0, 0], {
    castShadow: false,
  });

  // Wind guard recess.
  addMesh(bodyRoot, roundedBox(4.32, 0.05, 1.42, 0.2, 4), M.blackPlastic, [0, 2.672, 0.56], [0, 0, 0], {
    castShadow: false,
  });
  const ventMat = new THREE.MeshBasicMaterial({ color: 0x020303 });
  for (let i = 0; i < 3; i++) {
    addMesh(bodyRoot, roundedBox(2.82, 0.015, 0.1, 0.02, 2), ventMat, [0, 2.69, 0.24 + i * 0.2], [0, 0, 0], {
      castShadow: false,
    });
  }

  // Shutter button.
  addMesh(bodyRoot, new THREE.CylinderGeometry(0.39, 0.42, 0.075, 40), M.darkMetal, [2.63, 2.67, 0.72]);
  addMesh(bodyRoot, new THREE.CylinderGeometry(0.3, 0.32, 0.13, 40), M.redAccent, [2.63, 2.73, 0.72]);
  addMesh(bodyRoot, new THREE.TorusGeometry(0.31, 0.012, 6, 40), M.gunmetal, [2.63, 2.79, 0.72], [Math.PI / 2, 0, 0]);
  addMesh(bodyRoot, roundedBox(0.06, 0.05, 0.025, 0.01, 2), M.blackPlastic, [2.63, 2.782, 0.72], [0, 0, 0], {
    castShadow: false,
  });

  // Status LED.
  addMesh(bodyRoot, new THREE.CylinderGeometry(0.055, 0.055, 0.025, 20), M.darkMetal, [-2.82, 2.665, 0.95]);
  addMesh(bodyRoot, new THREE.CylinderGeometry(0.028, 0.028, 0.033, 20), M.redLed, [-2.82, 2.673, 0.95], [0, 0, 0], {
    castShadow: false,
  });

  // Hinge bar across the top rear.
  addMesh(
    bodyRoot,
    new THREE.CylinderGeometry(0.105, 0.105, 3.5, 26),
    M.gunmetal,
    [0, 2.67, -1.06],
    [0, 0, Math.PI / 2]
  );
  addMesh(bodyRoot, new THREE.CylinderGeometry(0.155, 0.155, 0.18, 26), M.darkMetal, [-1.86, 2.67, -1.06], [0, 0, Math.PI / 2]);
  addMesh(bodyRoot, new THREE.CylinderGeometry(0.155, 0.155, 0.18, 26), M.darkMetal, [1.86, 2.67, -1.06], [0, 0, Math.PI / 2]);
  addMesh(bodyRoot, new THREE.CylinderGeometry(0.056, 0.056, 3.1, 20), M.blackPlastic, [0, 2.67, -1.06], [0, 0, Math.PI / 2], {
    castShadow: false,
  });

  // Bottom plate.
  addMesh(bodyRoot, roundedBox(6.58, 0.14, 3.12, 0.22, 4), M.bodyMetal, [0, -2.62, -0.12], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(bodyRoot, new THREE.CylinderGeometry(1.86, 1.86, 0.055, 64), M.darkMetal, [0, -2.68, 0], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(bodyRoot, new THREE.TorusGeometry(1.86, 0.012, 5, 64), M.gunmetal, [0, -2.695, 0], [Math.PI / 2, 0, 0], {
    castShadow: false,
  });

  // Side ribs / grip detailing.
  const ribMat = new THREE.MeshStandardMaterial({
    color: 0x111315,
    roughness: 0.72,
    metalness: 0.2,
    bumpMap: TEX.grain,
    bumpScale: 0.02,
  });
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 6; i++) {
      const z = -1.15 + i * 0.24;
      const rib = addMesh(bodyRoot, roundedBox(0.028, 2.45, 0.075, 0.014, 2), ribMat, [side * 3.585, -0.3, z], [0, 0, 0], {
        castShadow: false,
      });
      rib.rotation.z = side * 0.012;
    }
  }

  // Subtle side metallic strip / antenna line.
  addMesh(bodyRoot, roundedBox(0.02, 0.018, 2.68, 0.008, 2), M.gunmetal, [3.592, 1.58, 0.04], [0, 0, 0], {
    castShadow: false,
  });

  // Small red corner accents.
  addMesh(bodyRoot, roundedBox(0.02, 0.22, 0.018, 0.006, 2), M.redAccent, [-3.585, 1.95, 1.16], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(bodyRoot, roundedBox(0.02, 0.22, 0.018, 0.006, 2), M.redAccent, [3.585, 1.95, 1.16], [0, 0, 0], {
    castShadow: false,
  });

  // Inner chassis / battery bay (revealed by X-RAY).
  buildInnerRig();

  collectBodyMaterials();
}

function buildInnerRig() {
  const rig = new THREE.Group();
  rig.name = 'InnerChassis';
  modelRoot.add(rig);

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x3b4143,
    roughness: 0.42,
    metalness: 0.82,
    envMapIntensity: 1.1,
  });
  const frameDark = new THREE.MeshStandardMaterial({
    color: 0x141719,
    roughness: 0.58,
    metalness: 0.5,
  });
  const brass = new THREE.MeshStandardMaterial({
    color: 0xb58d55,
    roughness: 0.3,
    metalness: 1,
    envMapIntensity: 1.4,
  });

  // Vertical rails.
  [[-3.23, -2.06], [-3.23, 2.06], [3.23, -2.06], [3.23, 2.06]].forEach(([x, z]) => {
    addMesh(rig, roundedBox(0.16, 4.56, 0.16, 0.04, 2), frameMat, [x, 0, z]);
    addMesh(rig, new THREE.CylinderGeometry(0.07, 0.07, 4.36, 10), frameDark, [x, 0, z], [0, 0, 0], {
      castShadow: false,
    });
  });

  // Inner cross members.
  for (let i = 0; i < 3; i++) {
    addMesh(rig, roundedBox(6.16, 0.11, 0.13, 0.03, 2), frameMat, [0, -1.58 + i * 1.58, -1.6], [0, 0, 0], {
      castShadow: false,
    });
  }

  // Board backing plate.
  addMesh(rig, roundedBox(5.34, 3.46, 0.08, 0.06, 3), frameDark, [-0.14, 0.02, -0.28], [0, 0, 0], {
    castShadow: false,
  });

  // Battery cradle.
  addMesh(rig, roundedBox(1.22, 3.72, 2.74, 0.15, 4), new THREE.MeshStandardMaterial({
    color: 0x121617,
    roughness: 0.64,
    metalness: 0.35,
  }), [2.86, -0.08, -0.38], [0, 0, 0], {
    castShadow: false,
  });
  for (let i = 0; i < 3; i++) {
    addMesh(rig, roundedBox(0.05, 3.26, 0.04, 0.015, 2), brass, [2.19, -0.06, -1.0 + i * 0.62], [0, 0, 0], {
      castShadow: false,
    });
  }

  // Standoffs.
  [[-2.2, 1.65, 0.02], [2.0, 1.65, 0.02], [-2.2, -1.55, 0.02], [2.0, -1.55, 0.02]].forEach(([x, y, z]) => {
    addMesh(rig, new THREE.CylinderGeometry(0.075, 0.09, 0.23, 12), brass, [x, y, z + 0.12], [Math.PI / 2, 0, 0], {
      castShadow: false,
    });
  });

  // Screen flex cable, visible through the rear.
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.56, 2.45, -1.2),
    new THREE.Vector3(-1.44, 2.15, -1.03),
    new THREE.Vector3(-1.65, 1.3, -0.7),
    new THREE.Vector3(-1.75, 1.12, 0.06),
  ]);
  addMesh(rig, new THREE.TubeGeometry(curve, 30, 0.032, 6, false), M.ribbon, [0, 0, 0], [0, 0, 0], {
    castShadow: false,
  });

  // Board interconnect.
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.8, -1.4, 0.12),
    new THREE.Vector3(-0.9, -1.78, -0.16),
    new THREE.Vector3(1.5, -1.58, -0.2),
    new THREE.Vector3(2.55, -1.22, -0.53),
  ]);
  addMesh(rig, new THREE.TubeGeometry(cableCurve, 26, 0.023, 6, false), M.ribbon, [0, 0, 0], [0, 0, 0], {
    castShadow: false,
  });

  // Speaker chamber below the display side.
  addMesh(rig, roundedBox(1.62, 0.94, 0.82, 0.16, 3), new THREE.MeshStandardMaterial({
    color: 0x0d0f10,
    roughness: 0.8,
    metalness: 0.1,
  }), [-1.92, -1.95, 0.54], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(rig, new THREE.CylinderGeometry(0.26, 0.3, 0.1, 24), frameDark, [-1.92, -1.95, 0.98], [Math.PI / 2, 0, 0], {
    castShadow: false,
  });

  // Antenna strip.
  addMesh(rig, roundedBox(0.5, 0.06, 2.1, 0.02, 2), brass, [3.0, 1.85, -1.15], [0, 0, 0], {
    castShadow: false,
  });

  // Fine inner wire frame.
  addMesh(rig, new THREE.BoxGeometry(6.42, 4.68, 3.18), M.innerWire, [0.02, 0, -0.02], [0, 0, 0], {
    noShadow: true,
    castShadow: false,
  }).visible = false;
}

// --------------------------------------------------------------------------
// 7. Individual component builders
// --------------------------------------------------------------------------

function buildLens() {
  const g = new THREE.Group();
  g.name = 'LeicaLens';

  // Red outline frame.
  const frame = addMesh(g, makeRoundedFrameGeometry(3.63, 3.47, 0.07, 0.61, 0.062, 0.012), M.redAccent, [0, 0, 0.08]);
  frame.castShadow = false;

  // Rear collar / barrel.
  addMesh(g, new THREE.CylinderGeometry(1.88, 1.9, 0.13, 72, 1, true), M.lensMetal, [0, 0, 0.02], [Math.PI / 2, 0, 0]);
  addMesh(g, new THREE.RingGeometry(1.54, 1.89, 72), M.darkMetal, [0, 0, 0.09], [0, 0, 0], { castShadow: false });
  addMesh(g, new THREE.CylinderGeometry(1.78, 1.83, 0.32, 72, 1, true), M.lensMetal, [0, 0, 0.22], [Math.PI / 2, 0, 0]);

  // Knurled focus ring.
  const knurlGeo = new THREE.BoxGeometry(0.1, 0.035, 0.235);
  const knurlMat = new THREE.MeshStandardMaterial({
    color: 0x101315,
    metalness: 0.96,
    roughness: 0.24,
    envMapIntensity: 1.8,
  });
  const knurl = new THREE.InstancedMesh(knurlGeo, knurlMat, 84);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 84; i++) {
    const a = (i / 84) * TAU;
    dummy.position.set(Math.cos(a) * 1.79, Math.sin(a) * 1.79, 0.215);
    dummy.rotation.set(0, 0, a);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    knurl.setMatrixAt(i, dummy.matrix);
  }
  knurl.instanceMatrix.needsUpdate = true;
  knurl.castShadow = false;
  g.add(knurl);

  // Front metal ring.
  addMesh(g, new THREE.RingGeometry(1.31, 1.8, 72), M.lensMetal, [0, 0, 0.385], [0, 0, 0], { castShadow: false });
  addMesh(g, new THREE.TorusGeometry(1.8, 0.022, 8, 96), M.gunmetal, [0, 0, 0.392]);
  addMesh(g, new THREE.TorusGeometry(1.31, 0.012, 6, 96), M.gunmetal, [0, 0, 0.397], [0, 0, 0], { castShadow: false });

  // Ring text.
  addPlane(g, 3.37, 3.37, M.lensTexturePlane, [0, 0, 0.407], [0, 0, 0], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 5,
  });

  // Inner barrel and glass stack.
  addMesh(g, new THREE.CylinderGeometry(1.24, 1.36, 0.18, 64, 1, true), M.lensMetal, [0, 0, 0.43], [Math.PI / 2, 0, 0], {
    castShadow: false,
  });
  addMesh(g, new THREE.RingGeometry(1.05, 1.27, 64), M.blackPlastic, [0, 0, 0.48], [0, 0, 0], { castShadow: false });
  addMesh(g, new THREE.CylinderGeometry(0.98, 1.03, 0.055, 64), M.lensInnerGlass, [0, 0, 0.475], [Math.PI / 2, 0, 0], {
    castShadow: false,
    renderOrder: 2,
  });
  addMesh(g, new THREE.TorusGeometry(1.06, 0.012, 6, 72), M.redAccent, [0, 0, 0.501], [0, 0, 0], {
    castShadow: false,
  });

  // Solid optical backing / aperture depth. This also provides a reliable
  // pick surface across the centre of the glass stack.
  const backingMat = new THREE.MeshBasicMaterial({ color: 0x03100e });
  addMesh(g, new THREE.CircleGeometry(1.12, 64), backingMat, [0, 0, 0.452], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(g, new THREE.TorusGeometry(1.12, 0.012, 6, 84), M.gunmetal, [0, 0, 0.456], [0, 0, 0], { castShadow: false });

  // Soft optical coating / internal reflections.
  addPlane(g, 1.86, 1.86, M.lensCoating, [0, 0, 0.508], [0, 0, 0], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 3,
  });

  // Fine concentric lens rings.
  for (let i = 0; i < 3; i++) {
    addMesh(g, new THREE.TorusGeometry(0.38 + i * 0.24, 0.0065, 5, 80), new THREE.MeshBasicMaterial({
      color: 0x88d8ca,
      transparent: true,
      opacity: 0.07 + i * 0.025,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }), [0, 0, 0.512 + i * 0.001], [0, 0, 0], { castShadow: false, receiveShadow: false, renderOrder: 4 });
  }

  // Sensor glow visible in the lens depth.
  const iris = addPlane(g, 1.7, 1.7, M.lensIris, [0, 0, 0.505], [0, 0, 0], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 4,
  });
  iris.material.opacity = 0.3;

  // Dome glass.
  const domeGeo = new THREE.SphereGeometry(1.1, 64, 40, 0, TAU, 0, Math.PI / 2);
  domeGeo.rotateX(Math.PI / 2);
  const dome = addMesh(g, domeGeo, M.lensGlass, [0, 0, 0.53], [0, 0, 0], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 6,
  });
  dome.scale.z = 0.42;

  // Thin front rim over the dome.
  addMesh(g, new THREE.TorusGeometry(1.07, 0.018, 8, 96), M.gunmetal, [0, 0, 0.553], [0, 0, 0], {
    castShadow: false,
  });

  // Glints.
  const streak = addPlane(g, 1.48, 0.52, M.lensStreak, [-0.12, 0.06, 0.79], [0, 0, -0.3], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 8,
  });
  streak.material.opacity = 0.34;

  addPlane(g, 1.1, 1.1, M.lensIris, [0.08, -0.05, 0.735], [0, 0, 0], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 7,
  }).material.opacity = 0.1;

  // Tiny red index mark on the ring.
  addMesh(g, new THREE.CircleGeometry(0.026, 16), M.redGlow, [0, -1.55, 0.41], [0, 0, 0], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 6,
  });

  // Rear connector ring (visible if inspected from behind).
  addMesh(g, new THREE.CylinderGeometry(0.78, 0.78, 0.07, 48), M.darkMetal, [0, 0, -0.07], [Math.PI / 2, 0, 0], {
    castShadow: false,
  });

  return g;
}

function buildSensor() {
  const g = new THREE.Group();
  g.name = 'CMOS';

  addMesh(g, roundedBox(1.72, 1.72, 0.1, 0.07, 3), M.sensorBoard, [0, 0, 0]);
  addMesh(g, roundedBox(1.56, 1.56, 0.055, 0.04, 3), M.pcbPlain, [0, 0, 0.065]);

  // Gold pad frame.
  for (let i = 0; i < 4; i++) {
    const horizontal = i < 2;
    const sign = i % 2 === 0 ? -1 : 1;
    addMesh(
      g,
      horizontal
        ? new THREE.BoxGeometry(1.52, 0.048, 0.026)
        : new THREE.BoxGeometry(0.048, 1.52, 0.026),
      M.sensorGold,
      horizontal ? [0, sign * 0.69, 0.095] : [sign * 0.69, 0, 0.095],
      [0, 0, 0],
      { castShadow: false }
    );
  }

  // Sensor die.
  addMesh(g, roundedBox(1.06, 0.9, 0.043, 0.025, 2), M.sensorDie, [0, 0, 0.11]);
  addPlane(g, 0.88, 0.72, M.lensIris, [0, 0, 0.137], [0, 0, 0], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 3,
  }).material = new THREE.MeshBasicMaterial({
    map: TEX.lensText,
    transparent: true,
    opacity: 0.05,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  // Iridescent die coating wash.
  addPlane(g, 1.0, 0.84, new THREE.MeshBasicMaterial({
    map: TEX.streak,
    transparent: true,
    opacity: 0.16,
    color: 0x63e6d6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  }), [0, 0.02, 0.14], [0, 0, 0], { castShadow: false, receiveShadow: false, renderOrder: 4 });

  // Pins around die.
  for (let i = 0; i < 18; i++) {
    const x = -0.55 + i * 0.065;
    addMesh(g, new THREE.BoxGeometry(0.024, 0.045, 0.018), M.gold, [x, -0.51, 0.099], [0, 0, 0], { castShadow: false });
    addMesh(g, new THREE.BoxGeometry(0.024, 0.045, 0.018), M.gold, [x, 0.51, 0.099], [0, 0, 0], { castShadow: false });
  }

  // Tiny label.
  addPlane(g, 0.6, 0.15, new THREE.MeshBasicMaterial({
    map: createChipTexture('1/1.3"', '50MP CMOS'),
    transparent: true,
    opacity: 0.4,
    toneMapped: false,
    depthWrite: false,
  }), [-0.48, -0.62, 0.062], [0, 0, 0], { castShadow: false, renderOrder: 3 });

  // Ribbon connector.
  addMesh(g, roundedBox(0.68, 0.14, 0.035, 0.02, 2), M.ribbon, [0, -0.88, 0.077], [0, 0, 0], { castShadow: false });
  addMesh(g, roundedBox(0.42, 0.04, 0.08, 0.01, 2), M.gold, [0, -0.86, 0.102], [0, 0, 0], { castShadow: false });

  return g;
}

function buildMainboard() {
  const g = new THREE.Group();
  g.name = 'Mainboard';

  addMesh(g, roundedBox(5.24, 3.36, 0.075, 0.045, 3), M.pcb, [0, 0, 0]);
  addPlane(g, 5.0, 3.16, new THREE.MeshStandardMaterial({
    map: TEX.pcbFront,
    roughness: 0.56,
    metalness: 0.28,
  }), [0, 0, 0.039], [0, 0, 0], { castShadow: false, receiveShadow: false });
  addPlane(g, 4.94, 3.1, new THREE.MeshStandardMaterial({
    map: TEX.pcbBack,
    roughness: 0.6,
    metalness: 0.23,
  }), [0, 0, -0.039], [0, Math.PI, 0], { castShadow: false, receiveShadow: false });

  // Stiffener rails.
  addMesh(g, roundedBox(5.18, 0.07, 0.09, 0.03, 2), M.gunmetal, [0, 1.58, 0.02], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(g, roundedBox(5.18, 0.07, 0.09, 0.03, 2), M.gunmetal, [0, -1.58, 0.02], [0, 0, 0], {
    castShadow: false,
  });

  const addChip = (x, y, w, h, texture, label = '') => {
    addMesh(g, roundedBox(w, h, 0.11, 0.025, 2), M.chip, [x, y, 0.085]);
    addPlane(g, w * 0.82, h * 0.82, new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    }), [x, y, 0.143], [0, 0, 0], { castShadow: false, renderOrder: 2 });
    const pins = Math.max(6, Math.floor(w / 0.075));
    for (let i = 0; i < pins; i++) {
      const px = x - w / 2 + 0.05 + i * ((w - 0.1) / Math.max(1, pins - 1));
      addMesh(g, new THREE.BoxGeometry(0.024, 0.038, 0.018), M.gold, [px, y - h / 2 - 0.032, 0.082], [0, 0, 0], {
        castShadow: false,
      });
      addMesh(g, new THREE.BoxGeometry(0.024, 0.038, 0.018), M.gold, [px, y + h / 2 + 0.032, 0.082], [0, 0, 0], {
        castShadow: false,
      });
    }
    return label;
  };

  addChip(0.48, 0.28, 1.24, 1.08, TEX.chipISP, 'ISP');

  // AI chip.
  addMesh(g, roundedBox(0.0, 0, 0.0, 0.01, 1), M.chip, [0, 0, 0], [0, 0, 0], { noShadow: true }).visible = false;
  addChip(-1.02, -0.62, 0.94, 0.84, TEX.chipAI, 'AI');

  // RF shield.
  addMesh(g, roundedBox(1.18, 0.82, 0.13, 0.04, 3), M.gunmetal, [-1.75, 0.72, 0.095]);
  addPlane(g, 0.95, 0.61, new THREE.MeshStandardMaterial({
    color: 0x343b3b,
    roughness: 0.42,
    metalness: 0.9,
    map: TEX.micGrill.map,
  }), [-1.75, 0.72, 0.165], [0, 0, 0], { castShadow: false });
  addScrew(g, -2.16, 1.02, 0.175, 0.035);
  addScrew(g, -1.34, 0.42, 0.175, 0.035);

  // Connector blocks.
  addMesh(g, roundedBox(0.62, 0.24, 0.16, 0.02, 2), M.whitePlastic, [2.02, 0.95, 0.12]);
  addMesh(g, roundedBox(0.54, 0.06, 0.1, 0.01, 2), M.gold, [2.02, 0.98, 0.205], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(g, roundedBox(0.84, 0.32, 0.18, 0.025, 2), M.blackPlastic, [2.06, -0.42, 0.12]);
  addMesh(g, roundedBox(0.32, 0.4, 0.17, 0.02, 2), M.gunmetal, [-2.26, -0.76, 0.1]);

  // Passives.
  const capMaterials = [M.gold, M.chipCeramic, M.copperBright];
  const rand = makeRNG(627);
  for (let i = 0; i < 26; i++) {
    const x = -2.24 + rand() * 4.48;
    const y = -1.32 + rand() * 2.64;
    if (x > -1.4 && x < 1.2 && y > -1.24 && y < 1.0) continue;
    const size = 0.05 + rand() * 0.07;
    addMesh(g, new THREE.BoxGeometry(size, size * 0.55, 0.038), capMaterials[Math.floor(rand() * 3)], [x, y, 0.072], [0, 0, 0], {
      castShadow: false,
    });
  }

  // Copper inductors.
  for (let i = 0; i < 2; i++) {
    const x = 1.54 + i * 0.58;
    const y = -1.18;
    addMesh(g, roundedBox(0.4, 0.4, 0.08, 0.06, 3), M.chip, [x, y, 0.08]);
    addMesh(g, new THREE.TorusGeometry(0.12, 0.022, 6, 20), M.copperBright, [x, y, 0.13], [Math.PI / 2, 0, 0], {
      castShadow: false,
    });
  }

  // Status LEDs.
  addMesh(g, new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0x8cffff, toneMapped: false }), [1.4, 1.36, 0.1], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(g, new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff3d26, toneMapped: false }), [-2.2, 1.31, 0.1], [0, 0, 0], {
    castShadow: false,
  });

  // Gold board connector at the top.
  addMesh(g, roundedBox(1.42, 0.13, 0.05, 0.018, 2), M.gold, [0.2, 1.67, 0.04], [0, 0, 0], {
    castShadow: false,
  });
  for (let i = 0; i < 12; i++) {
    addMesh(g, new THREE.BoxGeometry(0.018, 0.025, 0.03), M.mountDark, [-0.46 + i * 0.12, 1.67, 0.075], [0, 0, 0], {
      castShadow: false,
    });
  }

  // Screws / mounting holes.
  [[-2.34, -1.48], [2.34, -1.48], [2.34, 1.48], [-2.34, 1.48]].forEach(([x, y]) => {
    addMesh(g, new THREE.RingGeometry(0.055, 0.082, 18), M.gold, [x, y, 0.055], [0, 0, 0], {
      castShadow: false,
    });
    addScrew(g, x, y, 0.085, 0.047);
  });

  // Flex cable into the camera.
  const flexCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.25, 1.64, 0.02),
    new THREE.Vector3(0.34, 1.95, -0.3),
    new THREE.Vector3(0.55, 2.08, -0.92),
    new THREE.Vector3(0.8, 2.02, -1.18),
  ]);
  const flex = addMesh(g, new THREE.TubeGeometry(flexCurve, 20, 0.035, 4, false), M.ribbon, [0, 0, 0], [0, 0, 0], {
    castShadow: false,
  });
  flex.scale.z = 1.1;

  return g;
}

function buildBattery() {
  const g = new THREE.Group();
  g.name = 'Battery';

  addMesh(g, roundedBox(0.86, 3.46, 2.55, 0.1, 4), M.batteryShell, [0, 0, 0]);
  addMesh(g, roundedBox(0.72, 3.32, 2.4, 0.05, 2), new THREE.MeshStandardMaterial({
    color: 0x222526,
    roughness: 0.55,
    metalness: 0.3,
  }), [0, 0, 0]);

  // Label faces the release direction.
  const label = addPlane(g, 2.3, 3.12, M.batteryLabel, [0.438, 0, 0], [0, Math.PI / 2, 0], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 2,
  });
  label.castShadow = false;

  // Gold edge contacts.
  for (let i = 0; i < 4; i++) {
    addMesh(g, roundedBox(0.16, 0.06, 0.055, 0.012, 2), M.gold, [-0.22 + i * 0.15, 1.75, 0.3], [0, 0, 0], {
      castShadow: false,
    });
  }
  // Alignment / latch.
  addMesh(g, roundedBox(0.1, 0.36, 0.42, 0.025, 2), M.darkMetal, [0.38, 1.12, 0.88], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(g, roundedBox(0.15, 0.26, 0.08, 0.02, 2), M.redAccent, [0.445, -1.34, 1.03], [0, 0, 0], {
    castShadow: false,
  });

  // Side ribs on pack.
  for (let i = 0; i < 4; i++) {
    addMesh(g, roundedBox(0.03, 2.5, 0.06, 0.012, 2), M.mountDark, [-0.456, -0.2, -0.78 + i * 0.45], [0, 0, 0], {
      castShadow: false,
    });
  }

  // External latch, visible on the camera flank.
  addMesh(g, roundedBox(0.14, 0.55, 0.32, 0.06, 3), M.mountMetal, [0.63, 0.82, 0.84], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(g, roundedBox(0.07, 0.22, 0.16, 0.03, 2), M.redAccent, [0.71, 0.82, 0.84], [0, 0, 0], {
    castShadow: false,
  });

  return g;
}

function buildScreen() {
  const g = new THREE.Group();
  g.name = 'FlipScreen';

  // Core screen enclosure.
  addMesh(g, roundedBox(6.64, 3.94, 0.3, 0.28, 5), M.screenFrame, [0, 0, 0]);

  // Back shell face.
  addMesh(g, roundedBox(6.31, 3.6, 0.08, 0.21, 4), M.screenBack, [0, 0, -0.18]);
  addPlane(g, 4.3, 1.43, new THREE.MeshStandardMaterial({
    color: 0x1e2123,
    roughness: 0.6,
    metalness: 0.35,
    map: TEX.micGrill.map,
    transparent: true,
    opacity: 0.5,
  }), [0, 0.83, -0.228], [0, Math.PI, 0], { castShadow: false });
  addPlane(g, 1.72, 0.56, M.backLogo, [0, -0.55, -0.229], [0, Math.PI, 0], {
    castShadow: false,
    renderOrder: 2,
  });
  addMesh(g, roundedBox(5.7, 0.03, 0.012, 0.01, 2), M.bodyMetal, [0, -1.27, -0.23], [0, 0, 0], {
    castShadow: false,
  });

  // Front frame / glass.
  addMesh(g, roundedBox(6.35, 3.63, 0.11, 0.22, 4), M.screenBezel, [0, 0, 0.19]);
  const bezelFrame = addMesh(g, makeRoundedFrameGeometry(6.44, 3.73, 0.05, 0.25, 0.035, 0.006), M.bodyMetal, [0, 0, 0.25], [0, 0, 0], {
    castShadow: false,
  });
  bezelFrame.material = M.gunmetal;

  addPlane(g, 5.72, 3.22, M.screenDisplay, [0, 0.01, 0.253], [0, 0, 0], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 2,
  });
  addPlane(g, 5.79, 3.29, M.screenGlass, [0, 0.01, 0.262], [0, 0, 0], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 3,
  });

  // Vertical brand on right bezel.
  const brand = addPlane(g, 1.02, 0.18, new THREE.MeshBasicMaterial({
    map: TEX.backLogo,
    transparent: true,
    opacity: 0.62,
    toneMapped: false,
    depthWrite: false,
  }), [2.9, 0.24, 0.258], [0, 0, -Math.PI / 2], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 3,
  });
  brand.scale.set(0.52, 1.2, 1);

  // Record LED.
  addMesh(g, new THREE.CircleGeometry(0.055, 20), M.redLed, [2.72, -1.54, 0.26], [0, 0, 0], {
    castShadow: false,
    receiveShadow: false,
    renderOrder: 4,
  });

  // Top notch / camera at bezel.
  addMesh(g, roundedBox(0.14, 0.07, 0.015, 0.02, 2), M.blackPlastic, [0, 1.84, 0.245], [0, 0, 0], {
    castShadow: false,
  });

  // Hinge arms, intentionally visible and mechanical.
  addMesh(g, new THREE.CylinderGeometry(0.087, 0.087, 3.7, 24), M.darkMetal, [0, -2.0, -0.055], [0, 0, Math.PI / 2]);
  addMesh(g, new THREE.CylinderGeometry(0.14, 0.14, 0.2, 24), M.gunmetal, [-1.92, -2.0, -0.055], [0, 0, Math.PI / 2]);
  addMesh(g, new THREE.CylinderGeometry(0.14, 0.14, 0.2, 24), M.gunmetal, [1.92, -2.0, -0.055], [0, 0, Math.PI / 2]);
  for (const side of [-1, 1]) {
    addMesh(g, roundedBox(0.34, 0.19, 0.58, 0.06, 3), M.darkMetal, [side * 1.78, -1.86, -0.15], [0, 0, side * 0.08]);
    addScrew(g, side * 1.78, -1.86, 0.15, 0.05);
  }

  // Screen flex fold visible behind.
  const flexCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.65, -1.82, 0.06),
    new THREE.Vector3(-1.6, -1.95, -0.1),
    new THREE.Vector3(-1.1, -2.02, -0.2),
    new THREE.Vector3(-0.3, -2.06, -0.23),
  ]);
  addMesh(g, new THREE.TubeGeometry(flexCurve, 18, 0.03, 4, false), M.ribbon, [0, 0, 0], [0, 0, 0], {
    castShadow: false,
  });

  return g;
}

function buildAcoustic() {
  const g = new THREE.Group();
  g.name = 'WindGuard';

  addMesh(g, roundedBox(4.15, 0.11, 1.34, 0.2, 4), M.acousticPlate, [0, 0, 0]);
  addMesh(g, roundedBox(3.4, 0.1, 0.98, 0.16, 4), M.acousticPlate, [0, 0.075, -0.02]);

  // Perforated wind guard cover.
  addPlane(g, 3.24, 0.94, new THREE.MeshStandardMaterial({
    color: 0x121617,
    roughness: 0.58,
    metalness: 0.5,
    map: TEX.micGrill.map,
    bumpMap: TEX.micGrill.bump,
    bumpScale: 0.03,
    side: THREE.DoubleSide,
  }), [0, 0.132, -0.02], [-Math.PI / 2, 0, 0], {
    castShadow: false,
    receiveShadow: false,
  });
  addMesh(g, roundedBox(3.46, 0.04, 1.02, 0.03, 2), M.gunmetal, [0, 0.143, -0.02], [0, 0, 0], {
    castShadow: false,
  });

  // Microphone cartridges underneath.
  for (let i = -1; i <= 1; i++) {
    addMesh(g, new THREE.CylinderGeometry(0.11, 0.12, 0.16, 20), M.microphoneMesh, [i * 1.02, -0.1, 0.02], [0, 0, 0], {
      castShadow: false,
    });
    addMesh(g, new THREE.CylinderGeometry(0.075, 0.08, 0.01, 20), M.gold, [i * 1.02, -0.183, 0.02], [0, 0, 0], {
      castShadow: false,
    });
  }

  // Red activity LED and tiny wind guard branding.
  addMesh(g, new THREE.BoxGeometry(0.18, 0.015, 0.04), M.redLed, [1.52, 0.15, 0.53], [0, 0, 0], {
    castShadow: false,
  });
  addPlane(g, 0.9, 0.22, new THREE.MeshBasicMaterial({
    map: createSideTextTexture(['WIND GUARD', 'ACOUSTIC MODULE']),
    transparent: true,
    opacity: 0.36,
    toneMapped: false,
    depthWrite: false,
  }), [-1.26, 0.154, 0.43], [-Math.PI / 2, 0, 0], { castShadow: false, renderOrder: 3 });

  // Side clips.
  addMesh(g, roundedBox(0.14, 0.14, 0.32, 0.03, 2), M.mountMetal, [-1.94, 0.02, 0.37], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(g, roundedBox(0.14, 0.14, 0.32, 0.03, 2), M.mountMetal, [1.94, 0.02, 0.37], [0, 0, 0], {
    castShadow: false,
  });

  return g;
}

function buildIOPort() {
  const g = new THREE.Group();
  g.name = 'SideIO';

  addMesh(g, roundedBox(0.16, 3.32, 2.82, 0.16, 4), M.ioPlate, [0, 0, 0]);

  // Panel outline.
  const outline = addMesh(g, makeRoundedFrameGeometry(2.65, 3.04, 0.028, 0.12, 0.02, 0.004), M.gunmetal, [-0.092, 0.02, 0], [0, -Math.PI / 2, 0], {
    castShadow: false,
  });
  outline.scale.set(1, 1, 1);

  const addSideDecal = (lines, w, h, y, z) => {
    const tex = createSideTextTexture(lines);
    const material = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.52,
      toneMapped: false,
      depthWrite: false,
    });
    return addPlane(g, w, h, material, [-0.094, y, z], [0, -Math.PI / 2, 0], {
      castShadow: false,
      renderOrder: 5,
    });
  };

  // USB-C port.
  addMesh(g, roundedBox(0.035, 0.27, 0.62, 0.11, 4), M.darkMetal, [-0.098, -0.72, -0.48], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(g, roundedBox(0.028, 0.17, 0.5, 0.08, 4), M.screwSlot, [-0.116, -0.72, -0.48], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(g, roundedBox(0.014, 0.05, 0.2, 0.01, 2), M.gold, [-0.135, -0.72, -0.48], [0, 0, 0], {
    castShadow: false,
  });
  addSideDecal(['USB-C 3.0', 'WATERPROOF CAP'], 1.3, 0.35, -1.17, -0.48);

  // microSD slot.
  addMesh(g, roundedBox(0.035, 0.075, 0.7, 0.02, 2), M.screwSlot, [-0.099, 0.16, -0.52], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(g, roundedBox(0.047, 0.23, 0.2, 0.015, 2), M.redAccent, [-0.105, 0.16, -0.13], [0, 0, 0], {
    castShadow: false,
  });
  addSideDecal(['microSD', 'UP TO 1TB'], 1.2, 0.35, 0.54, -0.52);

  // Power / Q button.
  addMesh(g, new THREE.CylinderGeometry(0.19, 0.2, 0.055, 28), M.darkMetal, [-0.11, 1.18, 0.62], [0, 0, Math.PI / 2], {
    castShadow: false,
  });
  addMesh(g, new THREE.CylinderGeometry(0.12, 0.13, 0.06, 24), M.mountDark, [-0.13, 1.18, 0.62], [0, 0, Math.PI / 2], {
    castShadow: false,
  });
  addMesh(g, new THREE.CircleGeometry(0.035, 16), M.redLed, [-0.163, 1.18, 0.62], [0, -Math.PI / 2, 0], {
    castShadow: false,
    renderOrder: 2,
  });
  addSideDecal(['POWER', 'Q / QUICK'], 0.95, 0.58, 1.18, 0.22);

  // Little status dots.
  addMesh(g, new THREE.SphereGeometry(0.033, 8, 6), M.cyanGlow, [-0.12, -1.83, -0.84], [0, 0, 0], {
    castShadow: false,
  });
  addMesh(g, roundedBox(0.018, 2.7, 0.035, 0.01, 2), new THREE.MeshBasicMaterial({
    color: 0x67e0e3,
    transparent: true,
    opacity: 0.42,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [-0.105, 0.12, 1.32], [0, 0, 0], {
    castShadow: false,
    renderOrder: 3,
  });

  // Latch ridge.
  addMesh(g, roundedBox(0.05, 2.42, 0.055, 0.018, 2), M.gunmetal, [-0.105, 0.01, 1.27], [0, 0, 0], {
    castShadow: false,
  });

  // Fine screws.
  addScrew(g, -0.105, -1.48, 1.16, 0.036, [0, -Math.PI / 2, 0]);
  addScrew(g, -0.105, 1.5, -1.14, 0.036, [0, -Math.PI / 2, 0]);

  return g;
}

function buildMount() {
  const g = new THREE.Group();
  g.name = 'MagneticMount';

  addMesh(g, roundedBox(3.72, 0.2, 2.28, 0.18, 4), M.mountMetal, [0, 0.02, 0]);
  addMesh(g, roundedBox(3.3, 0.07, 1.9, 0.15, 3), M.mountDark, [0, 0.13, 0]);
  addMesh(g, new THREE.CylinderGeometry(0.58, 0.58, 0.065, 48), M.darkMetal, [0, 0.17, 0], [Math.PI / 2, 0, 0], {
    castShadow: false,
  });
  addMesh(g, new THREE.TorusGeometry(0.58, 0.015, 6, 64), M.copperBright, [0, 0.199, 0], [Math.PI / 2, 0, 0], {
    castShadow: false,
  });
  addMesh(g, new THREE.TorusGeometry(0.44, 0.008, 6, 64), new THREE.MeshBasicMaterial({
    color: 0x72ecf0,
    transparent: true,
    opacity: 0.55,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [0, 0.203, 0], [Math.PI / 2, 0, 0], {
    castShadow: false,
    renderOrder: 3,
  });
  addMesh(g, roundedBox(2.9, 0.012, 0.018, 0.006, 2), new THREE.MeshBasicMaterial({
    color: 0x86e8e8,
    transparent: true,
    opacity: 0.28,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [0, 0.145, 1.02], [0, 0, 0], { castShadow: false, renderOrder: 3 });
  addMesh(g, new THREE.CylinderGeometry(0.19, 0.19, 0.07, 32), M.mountMetal, [0, 0.19, 0]);

  // Dual prong quick-release feet.
  for (const side of [-1, 1]) {
    addMesh(g, roundedBox(0.52, 0.5, 0.46, 0.1, 3), M.mountDark, [side * 1.24, -0.29, 0.26]);
    addMesh(g, new THREE.CylinderGeometry(0.18, 0.18, 0.64, 20), M.mountMetal, [side * 1.24, -0.55, 0.02], [Math.PI / 2, 0, 0], {
      castShadow: false,
    });
    addMesh(g, new THREE.CylinderGeometry(0.18, 0.18, 0.064, 20), M.mountMetal, [side * 1.24, -0.55, 0.02], [0, 0, Math.PI / 2], {
      castShadow: false,
    });
  }

  // Rear latch lever.
  addMesh(g, roundedBox(0.85, 0.16, 0.2, 0.05, 2), M.gunmetal, [0, -0.08, -1.12]);
  addMesh(g, roundedBox(0.28, 0.08, 0.1, 0.03, 2), M.redAccent, [0, -0.02, -1.25], [0, 0, 0], {
    castShadow: false,
  });

  // Screw holes.
  addScrew(g, -1.45, 0.14, 0.8, 0.04, [0, 0, 0]);
  addScrew(g, 1.45, 0.14, 0.8, 0.04, [0, 0, 0]);
  addScrew(g, -1.45, 0.14, -0.8, 0.04, [0, 0, 0]);
  addScrew(g, 1.45, 0.14, -0.8, 0.04, [0, 0, 0]);

  // Fine engraved graphic.
  addPlane(g, 1.35, 0.3, new THREE.MeshBasicMaterial({
    map: createSideTextTexture(['MAGNETIC QUICK MOUNT', 'ACE PRO 2 / 02']),
    transparent: true,
    opacity: 0.36,
    toneMapped: false,
    depthWrite: false,
  }), [0, 0.181, 0.98], [-Math.PI / 2, 0, 0], { castShadow: false, renderOrder: 2 });

  return g;
}

function buildCooling() {
  const g = new THREE.Group();
  g.name = 'VaporChamber';

  addMesh(g, roundedBox(5.16, 3.18, 0.14, 0.1, 3), M.graphite, [0, 0, 0]);
  addMesh(g, roundedBox(4.74, 2.8, 0.06, 0.08, 2), M.copper, [0, 0, 0.09]);
  addMesh(g, roundedBox(4.6, 2.64, 0.03, 0.07, 2), M.graphite, [0, 0, 0.125]);

  // Copper fin stack behind.
  const finCount = IS_COARSE ? 18 : 28;
  const finGeo = new THREE.BoxGeometry(0.045, 2.56, 0.5);
  const fins = new THREE.InstancedMesh(finGeo, M.copperBright, finCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < finCount; i++) {
    dummy.position.set(-2.28 + (4.56 * i) / (finCount - 1), 0.03, -0.34);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    fins.setMatrixAt(i, dummy.matrix);
  }
  fins.instanceMatrix.needsUpdate = true;
  fins.castShadow = true;
  fins.receiveShadow = true;
  g.add(fins);

  addMesh(g, roundedBox(4.8, 2.66, 0.08, 0.07, 2), M.copperBright, [0, 0.03, -0.16], [0, 0, 0], {
    castShadow: false,
  });

  // Heat pipes.
  for (let side = -1; side <= 1; side += 2) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 1.62, -1.15, 0.15),
      new THREE.Vector3(side * 1.39, -0.28, 0.2),
      new THREE.Vector3(side * 0.55, 0.92, 0.18),
      new THREE.Vector3(side * 0.33, 1.23, 0.14),
    ]);
    addMesh(g, new THREE.TubeGeometry(curve, 28, 0.055, 8, false), M.copperBright, [0, 0, 0], [0, 0, 0], {
      castShadow: false,
    });
  }

  // Thermal graphic.
  addPlane(g, 2.95, 0.47, new THREE.MeshBasicMaterial({
    map: createSideTextTexture(['VAPOR CHAMBER', 'COPPER + GRAPHITE / 8K READY']),
    transparent: true,
    opacity: 0.42,
    toneMapped: false,
    depthWrite: false,
  }), [-0.42, 0.35, 0.148], [0, 0, 0], { castShadow: false, renderOrder: 3 });

  // Mounting tabs.
  for (const side of [-1, 1]) {
    addMesh(g, roundedBox(0.12, 3.0, 0.12, 0.02, 2), M.gunmetal, [side * 2.62, 0, -0.06], [0, 0, 0], {
      castShadow: false,
    });
  }
  addScrew(g, -2.32, -1.4, 0.17, 0.04);
  addScrew(g, 2.32, 1.4, 0.17, 0.04);

  // Edge lines to catch the light.
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(roundedBox(4.72, 2.78, 0.13, 0.08, 2), 36),
    new THREE.LineBasicMaterial({
      color: 0xffad77,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
    })
  );
  edges.position.z = 0.12;
  g.add(edges);

  return g;
}

const PART_BUILDERS = {
  lens: buildLens,
  sensor: buildSensor,
  mainboard: buildMainboard,
  screen: buildScreen,
  battery: buildBattery,
  acoustic: buildAcoustic,
  io: buildIOPort,
  mount: buildMount,
  cooling: buildCooling,
};

function buildParts() {
  PART_DEFS.forEach((def) => {
    const group = PART_BUILDERS[def.id]();
    group.position.set(def.base[0], def.base[1], def.base[2]);
    group.rotation.set(def.baseRot[0], def.baseRot[1], def.baseRot[2]);
    group.name = def.id;
    modelRoot.add(group);

    const part = {
      ...def,
      group,
      display: 0,
      from: 0,
      to: 0,
      t: 0,
      duration: 0.9 + def.index * 0.006,
      delay: 0,
      animating: false,
      hovered: false,
      moving: false,
      basePosition: new THREE.Vector3(...def.base),
      baseRotation: new THREE.Euler(...def.baseRot),
      explodePosition: new THREE.Vector3(def.base[0] + def.explode[0], def.base[1] + def.explode[1], def.base[2] + def.explode[2]),
      explodeRotation: new THREE.Euler(
        def.baseRot[0] + def.explodeRot[0],
        def.baseRot[1] + def.explodeRot[1],
        def.baseRot[2] + def.explodeRot[2]
      ),
      anchorLocal: new THREE.Vector3(...def.anchor),
      worldAnchor: new THREE.Vector3(),
      localCenter: new THREE.Vector3(),
      radius: 1.4,
      phase: Math.random() * TAU,
    };

    group.traverse((object) => {
      if (object.isMesh) {
        const material = object.material;
        const transparent = material && (material.transparent || material.opacity < 1);
        object.castShadow = !transparent;
        object.receiveShadow = true;
        object.userData.partId = def.id;
        if (!transparent && object.geometry?.attributes?.position) interactiveMeshes.push(object);
        if (!transparent) clickableObjects.push(object);
      }
    });

    // Local bounding-box center / radius for aura.
    group.updateMatrixWorld(true);
    const localBox = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    localBox.getSize(size);
    part.radius = Math.max(1.0, size.length() * 0.55);
    localBox.getCenter(part.localCenter);
    // Convert because Box3 is in world space and the group is already parented.
    part.localCenter.sub(group.getWorldPosition(new THREE.Vector3()));

    // Thin technical leader that traces the component's exploded axis.
    const guideGeometry = new THREE.BufferGeometry().setFromPoints([
      part.basePosition.clone(),
      part.explodePosition.clone(),
    ]);
    const guideMaterial = new THREE.LineDashedMaterial({
      color: 0x78dfe8,
      transparent: true,
      opacity: 0,
      dashSize: 0.14,
      gapSize: 0.15,
      depthWrite: false,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
    });
    const guideLine = new THREE.Line(guideGeometry, guideMaterial);
    guideLine.computeLineDistances();
    guideLine.frustumCulled = false;
    guideLine.renderOrder = 4;
    modelRoot.add(guideLine);
    part.guideLine = guideLine;
    part.guideGeometry = guideGeometry;
    part.guideMaterial = guideMaterial;

    parts.push(part);
    partById[def.id] = part;
  });
}

function buildModel() {
  buildBody();
  buildParts();
  // Slight yaw to present the lens and screen in the opening frame.
  modelRoot.rotation.y = -0.055;
  modelCenter.set(0, 1.85, 0);
}

// --------------------------------------------------------------------------
// 8. Post-processing
// --------------------------------------------------------------------------

function initPostprocessing() {
  composer = new EffectComposer(renderer);
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.setSize(window.innerWidth, window.innerHeight);

  renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera, []);
  outlinePass.edgeStrength = 4.2;
  outlinePass.edgeGlow = 0.95;
  outlinePass.edgeThickness = 1.25;
  outlinePass.pulsePeriod = 2.8;
  outlinePass.visibleEdgeColor.set('#ff5d41');
  outlinePass.hiddenEdgeColor.set('#612115');
  composer.addPass(outlinePass);

  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    IS_COARSE ? 0.44 : 0.48,
    0.7,
    0.85
  );
  bloomPass.strength = window.innerWidth <= 880 ? 0.32 : bloomPass.strength;
  composer.addPass(bloomPass);

  outputPass = new OutputPass();
  composer.addPass(outputPass);
}

// --------------------------------------------------------------------------
// 9. UI construction
// --------------------------------------------------------------------------

const svgNS = 'http://www.w3.org/2000/svg';

function createUIPartsList() {
  const fragment = document.createDocumentFragment();
  PART_DEFS.forEach((def, i) => {
    const li = document.createElement('li');
    li.style.transitionDelay = `${0.02 + i * 0.035}s`;
    const btn = document.createElement('button');
    btn.className = 'part-row';
    btn.type = 'button';
    btn.dataset.part = def.id;
    btn.setAttribute('aria-label', `查看 ${def.name} 详情`);
    btn.innerHTML = `
      <span class="part-id">${def.index}</span>
      <span class="part-copy">
        <strong>${def.name}</strong>
        <small>${def.en}</small>
      </span>
      <span class="part-param">${def.param}</span>
      <span class="part-state" aria-hidden="true"></span>
    `;
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      handlePartSelected(def.id, 'list');
    });
    btn.addEventListener('mouseenter', () => setHovered(def.id, 'list'));
    btn.addEventListener('mouseleave', () => clearHovered('list'));
    btn.addEventListener('focus', () => setHovered(def.id, 'list'));
    btn.addEventListener('blur', () => clearHovered('list'));
    li.appendChild(btn);
    fragment.appendChild(li);
    partById[def.id].row = btn;
    partById[def.id].listItem = li;
  });
  el.partsList.appendChild(fragment);
}

function buildLabels() {
  const svg = el.leaderSvg;
  svg.innerHTML = '';
  const defs = document.createElementNS(svgNS, 'defs');
  const gradient = document.createElementNS(svgNS, 'linearGradient');
  gradient.setAttribute('id', 'leaderGradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '100%');
  gradient.setAttribute('y2', '0%');
  const stop1 = document.createElementNS(svgNS, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#ff6a4c');
  stop1.setAttribute('stop-opacity', '.55');
  const stop2 = document.createElementNS(svgNS, 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#aec6c8');
  stop2.setAttribute('stop-opacity', '.18');
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svg.appendChild(defs);

  PART_DEFS.forEach((def) => {
    const path = document.createElementNS(svgNS, 'path');
    path.classList.add('leader-path');
    path.dataset.part = def.id;
    const line = document.createElementNS(svgNS, 'line');
    line.classList.add('leader-path');
    line.dataset.leader = def.id;
    line.setAttribute('stroke', 'url(#leaderGradient)');
    const halo = document.createElementNS(svgNS, 'circle');
    halo.classList.add('leader-halo');
    halo.dataset.part = def.id;
    halo.setAttribute('r', '7');
    const dot = document.createElementNS(svgNS, 'circle');
    dot.classList.add('leader-dot');
    dot.dataset.part = def.id;
    dot.setAttribute('r', '1.8');
    svg.append(path, halo, dot);

    const label = document.createElement('button');
    label.type = 'button';
    label.className = 'part-label';
    label.dataset.part = def.id;
    label.setAttribute('aria-label', `定位 ${def.name}`);
    label.innerHTML = `
      <span class="part-label-index">${def.index}</span>
      <span class="part-label-copy">
        <b>${def.name}</b>
        <em>${def.param}</em>
      </span>
    `;
    label.addEventListener('click', (e) => {
      e.stopPropagation();
      handlePartSelected(def.id, 'label');
    });
    label.addEventListener('mouseenter', () => setHovered(def.id, 'label'));
    label.addEventListener('mouseleave', () => clearHovered('label'));
    el.labelNodes.appendChild(label);
    ui.labels[def.id] = { element: label, path, line, dot, halo };
  });
}

function renderEmptyDetail() {
  el.detailPanel.innerHTML = `
    <div class="detail-empty">
      <div class="detail-empty-head">
        <div>
          <div class="detail-empty-kicker">SYSTEM OVERVIEW / 整机概览</div>
          <h3>点击部件，解锁结构参数</h3>
          <p>从徕卡光学模组到双芯主板，逐层拆解 ACE PRO 2。拖动画面可环绕观察，开启动效后会同步高亮。</p>
        </div>
        <span class="radar-icon" aria-hidden="true"><i></i></span>
      </div>
      <div class="overall-specs">
        <div><span>尺寸</span><b>71.9 × 52.2 × 38 mm</b></div>
        <div><span>重量</span><b>177.2 g</b></div>
        <div><span>视频</span><b>8K / 30FPS</b></div>
        <div><span>结构</span><b>09 PARTS</b></div>
      </div>
      <div class="detail-empty-note"><i></i><span>内部结构为艺术化演绎，非官方拆机图</span></div>
    </div>
  `;
}

function renderDetail(part) {
  if (!part) {
    renderEmptyDetail();
    return;
  }
  const specs = part.specs
    .map(
      ([label, value]) => `
        <div class="detail-spec">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `
    )
    .join('');
  const exploded = part.display > 0.5;
  el.detailPanel.innerHTML = `
    <div class="detail-content">
      <div class="detail-kicker">
        <span>${part.category}</span>
        <b>${part.internal ? 'INTERNAL' : 'EXTERNAL'} / ${part.index}</b>
      </div>
      <div class="detail-name">
        <span class="detail-index">${part.index}</span>
        <div class="detail-name-text">
          <h3>${part.name}</h3>
          <em>${part.en}</em>
        </div>
      </div>
      <p class="detail-desc">${part.description}</p>
      <div class="detail-specs">${specs}</div>
      <div class="detail-actions">
        <button class="detail-action is-primary" type="button" data-detail-action="toggle">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M8 3v10"></path></svg>
          ${exploded ? '归位该部件' : '拆解该部件'}
        </button>
        <button class="detail-action" type="button" data-detail-action="focus">
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.1"></circle><path d="M8 1v2.2M8 12.8V15M1 8h2.2M12.8 8H15"></path></svg>
          聚焦
        </button>
      </div>
    </div>
  `;
}

function updateDetailToggleLabel(part) {
  if (!part || state.selectedId !== part.id) return;
  const btn = el.detailPanel.querySelector('[data-detail-action="toggle"]');
  if (!btn) return;
  const exploded = part.display > 0.5;
  btn.innerHTML = `
    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M8 3v10"></path></svg>
    ${exploded ? '归位该部件' : '拆解该部件'}
  `;
}

function updatePartsUI() {
  const selected = getSelected();
  parts.forEach((part) => {
    if (!part.row) return;
    part.row.classList.toggle('is-selected', state.selectedId === part.id);
    part.row.classList.toggle('is-exploded', part.display > 0.5);
    part.row.setAttribute('aria-current', state.selectedId === part.id ? 'true' : 'false');
  });

  const explodedCount = parts.filter((p) => p.display > 0.5).length;
  const targetCount = parts.filter((p) => p.to > 0.5).length;
  if (explodedCount !== state.lastAssemblyCount) {
    state.lastAssemblyCount = explodedCount;
    el.assemblyCount.textContent = String(explodedCount).padStart(2, '0');
    el.assemblyBar.style.transform = `scaleX(${explodedCount / parts.length})`;
    if (explodedCount === 0) {
      el.assemblyState.textContent = 'FULLY ASSEMBLED / 装配完成';
    } else if (explodedCount === parts.length) {
      el.assemblyState.textContent = 'FULLY EXPLODED / 拆解完成';
    } else {
      el.assemblyState.textContent = `PARTIAL VIEW / 已拆解 ${explodedCount}/${parts.length}`;
    }
  }

  const xrayLabel = state.xray ? 'X-RAY ON' : 'X-RAY OFF';
  if (state.lastAssemblyMode !== xrayLabel) {
    state.lastAssemblyMode = xrayLabel;
    el.assemblyMode.textContent = xrayLabel;
  }

  const allExploded = targetCount === parts.length;
  const anyExploded = targetCount > 0;
  state.allExploded = allExploded;
  el.explodeBtn.classList.toggle('is-exploded', allExploded);
  el.explodeBtn.setAttribute('aria-pressed', allExploded ? 'true' : 'false');
  el.explodeBtn.querySelector('.explode-text').textContent = allExploded ? '组装整机' : anyExploded ? '全部拆解' : '拆解整机';

  el.xrayBtn.classList.toggle('is-active', state.xray);
  el.xrayBtn.setAttribute('aria-pressed', state.xray ? 'true' : 'false');
  el.autoBtn.classList.toggle('is-active', state.autoRotate);

  if (!selected) {
    el.selectionCaption.classList.remove('is-visible');
    return;
  }
  el.selectionCaption.classList.add('is-visible');
  el.selectionCaptionText.textContent = `SELECTED / ${selected.index} · ${selected.en}`;
}

function updatePartSelectionUI(part, { animateDetail = true } = {}) {
  // rows
  parts.forEach((p) => {
    if (!p.row) return;
    const selected = p.id === part?.id;
    p.row.classList.toggle('is-selected', selected);
    p.row.setAttribute('aria-current', selected ? 'true' : 'false');
  });

  // labels
  parts.forEach((p) => {
    const label = ui.labels[p.id]?.element;
    if (!label) return;
    label.classList.toggle('is-active', p.id === part?.id);
  });

  if (part) {
    if (animateDetail) renderDetail(part);
    else renderDetail(part);
  } else {
    renderEmptyDetail();
  }
  updatePartsUI();
}

// --------------------------------------------------------------------------
// 10. Selection, explosion, camera
// --------------------------------------------------------------------------

function getSelected() {
  return state.selectedId ? partById[state.selectedId] : null;
}

function getPartHit(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNdc, camera);
  const objects = state.xray ? interactiveMeshes : [...interactiveMeshes, ...blockerMeshes];
  const intersections = raycaster.intersectObjects(objects, false);
  for (const hit of intersections) {
    const object = hit.object;
    if (!object.visible) continue;
    if (object.userData.isBlocker && !state.xray) return null;
    const id = object.userData.partId;
    if (id && partById[id]) return { part: partById[id], point: hit.point, object };
  }
  return null;
}

function setHovered(id, source = 'canvas') {
  if (!state.ready) return;
  if (id) {
    if (state.hoveredId !== id) {
      state.hoveredId = id;
      ui.hoverSource = source;
      updateHoverOutline();
    } else {
      ui.hoverSource = source;
    }
    if (renderer) renderer.domElement.classList.add('is-hovering');
  } else {
    clearHovered(source);
  }
}

function clearHovered(source = 'canvas') {
  if (state.hoveredId && ui.hoverSource && ui.hoverSource !== source) return;
  if (
    source === 'canvas' &&
    state.lastPointerInside &&
    (ui.hoverSource === 'list' || ui.hoverSource === 'label')
  ) {
    return;
  }
  state.hoveredId = null;
  ui.hoverSource = null;
  if (renderer) renderer.domElement.classList.remove('is-hovering');
  updateHoverOutline();
}

function updateHoverOutline() {
  if (!outlinePass) return;
  const hovered = state.hoveredId ? partById[state.hoveredId] : null;
  const selected = getSelected();
  const moving = parts.filter((p) => p.moving);
  let targetObjects = [];
  let color = '#ff5d41';
  if (hovered) {
    targetObjects = [hovered.group];
    color = state.selectedId === hovered.id ? '#ff5d41' : '#82efff';
    outlinePass.edgeStrength = 5.4;
  } else if (selected && selected.display > 0.02) {
    targetObjects = [selected.group];
    color = '#ff5d41';
    outlinePass.edgeStrength = 4.4;
  } else if (moving.length) {
    targetObjects = moving.map((p) => p.group);
    color = '#ff754f';
    outlinePass.edgeStrength = 3.4;
  } else {
    outlinePass.edgeStrength = 4.2;
  }
  outlinePass.selectedObjects = targetObjects;
  outlinePass.visibleEdgeColor.set(color);
}

function handlePartSelected(id, source = 'canvas') {
  const part = partById[id];
  if (!part) return;
  state.selectedId = id;
  state.firstInteractionDone = true;
  el.firstHint.classList.remove('is-visible');
  el.guideChip.classList.remove('is-dismissed');

  const wasInternalXrayOff = part.internal && !state.xray;
  if (wasInternalXrayOff) {
    setXray(true, { silent: true });
    showToast(`已开启 X-RAY 透视 · <b>${part.name}</b>`, 2100);
  }

  // A click on an assembled part detaches it. Already-deployed parts stay put.
  if (part.display < 0.96) {
    explodePart(part, { duration: 1.02, delay: 0, toast: false });
  }

  updatePartSelectionUI(part);
  if (part.row) {
    part.row.scrollIntoView({ block: 'nearest', behavior: PREFERS_REDUCED_MOTION ? 'auto' : 'smooth' });
  }
  if (IS_COARSE && source === 'list') {
    // Keep the inspection card accessible but give the stage room when possible.
    setTimeout(() => {
      el.partsPanel.scrollTop = 0;
    }, 50);
  }
  pulseStage(source === 'canvas' ? 1 : 0);
  pauseAutoRotateFor(2800);
  if (source !== 'list') showToast(`已定位部件 · <b>${part.name}</b>`, 1500);
}

function deselectPart() {
  state.selectedId = null;
  updatePartSelectionUI(null);
  updateHoverOutline();
}

function setPartTarget(part, target, { duration = 0.9, delay = 0 } = {}) {
  if (part.to === target && !part.animating && Math.abs(part.display - target) < 0.001) return;
  if (params.get('instant') === '1') {
    part.from = target;
    part.to = target;
    part.display = target;
    part.t = 1;
    part.delay = 0;
    part.duration = 0.1;
    part.animating = false;
    part.moving = false;
    return;
  }
  part.from = part.display;
  part.to = target;
  part.t = 0;
  part.delay = delay;
  part.duration = Math.max(0.15, duration);
  part.animating = true;
}

function explodePart(part, { duration = 0.92, delay = 0, toast = false } = {}) {
  setPartTarget(part, 1, { duration, delay });
  part.animating = true;
  if (toast) showToast(`拆解 · <b>${part.name}</b>`, 1400);
  updatePartsUI();
}

function retractPart(part, { duration = 0.82, delay = 0 } = {}) {
  setPartTarget(part, 0, { duration, delay });
  if (state.allExploded) state.allExploded = false;
  updatePartsUI();
}

function togglePartExplosion(part) {
  if (!part) return;
  if (part.display > 0.5) {
    retractPart(part);
    showToast(`归位 · <b>${part.name}</b>`, 1400);
  } else {
    explodePart(part, { toast: true });
  }
  updateDetailToggleLabel(part);
  updatePartsUI();
}

function setAllExplosion(explode) {
  state.firstInteractionDone = true;
  el.firstHint.classList.remove('is-visible');
  const ordered = [...parts].sort((a, b) => Number(a.index) - Number(b.index));
  ordered.forEach((part, i) => {
    const delay = explode ? i * 0.065 : (ordered.length - 1 - i) * 0.045;
    const duration = explode ? 0.98 : 0.82;
    setPartTarget(part, explode ? 1 : 0, { duration, delay });
  });
  updatePartsUI();
  if (explode) {
    flashExplosion();
    showToast('整机拆解 · <b>09 / 09 COMPONENTS</b>', 1800);
    frameExplodedView(true);
  } else {
    showToast('已恢复整机装配 · <b>FULLY ASSEMBLED</b>', 1600);
    frameExplodedView(false);
    deselectPart();
  }
  if (el.detailPanel && getSelected()) {
    const selected = getSelected();
    if (selected) updateDetailToggleLabel(selected);
  }
}

function updateParts(dt, time) {
  let anyMoving = false;
  parts.forEach((part) => {
    const target = part.to;
    if (part.animating) {
      if (part.delay > 0) {
        part.delay = Math.max(0, part.delay - dt);
      } else {
        part.t += dt / part.duration;
        if (part.t >= 1) {
          part.t = 1;
          part.display = target;
          part.animating = false;
        } else {
          const eased = easeInOutCubic(part.t);
          part.display = lerp(part.from, target, eased);
        }
      }
      part.moving = part.animating && part.delay <= 0.0001;
    } else {
      part.moving = false;
    }
    anyMoving = anyMoving || part.moving;

    const d = part.display;
    const float = d > 0.98 && !part.moving ? Math.sin(time * 0.85 + part.phase) * 0.014 : 0;
    part.group.position.lerpVectors(part.basePosition, part.explodePosition, d);
    part.group.position.y += float;
    part.group.rotation.set(
      lerp(part.baseRotation.x, part.explodeRotation.x, d),
      lerp(part.baseRotation.y, part.explodeRotation.y, d),
      lerp(part.baseRotation.z, part.explodeRotation.z, d)
    );

    if (part.guideLine) {
      const positions = part.guideGeometry.attributes.position;
      positions.setXYZ(0, part.basePosition.x, part.basePosition.y + 0.05, part.basePosition.z);
      positions.setXYZ(1, part.group.position.x, part.group.position.y + 0.05, part.group.position.z);
      positions.needsUpdate = true;
      part.guideGeometry.computeBoundingSphere();
      part.guideLine.computeLineDistances();
      part.guideMaterial.opacity = d * 0.24;
      part.guideLine.visible = d > 0.015;
    }

    // A very subtle extra presence when hovered.
    const hovered = state.hoveredId === part.id;
    const hoverStrength = hovered ? 0.018 : 0;
    part.group.position.y += hoverStrength * Math.sin(time * 2.2);
  });

  // Outline should follow moving parts, and selected edge state.
  const desiredOutlineKey = [
    state.hoveredId || '',
    state.selectedId || '',
    parts.filter((p) => p.moving).map((p) => p.id).join(','),
  ].join('|');
  if (!updateParts._lastOutlineKey || updateParts._lastOutlineKey !== desiredOutlineKey || anyMoving) {
    updateParts._lastOutlineKey = desiredOutlineKey;
    updateHoverOutline();
  }

  // Selected aura follows part / camera.
  const selected = getSelected();
  if (selected) {
    selected.group.updateMatrixWorld();
    const center = selected.localCenter.clone().applyMatrix4(selected.group.matrixWorld);
    // The local center calculation is relative to the group's assembled object; use group origin fallback.
    const groupWorld = selected.group.getWorldPosition(tempVec.clone());
    if (!Number.isFinite(center.x) || center.length() < 0.01) center.copy(groupWorld);
    selectedAura.position.copy(groupWorld);
    selectedAura.position.y += 0.08;
    const baseScale = Math.max(2.4, selected.radius * 2.2);
    const pulse = 1 + Math.sin(time * 2.4) * 0.045;
    selectedAura.scale.setScalar(baseScale * pulse);
    selectionAuraMat.opacity = 0.13 + Math.sin(time * 2.1) * 0.025;
    selectionAuraMat.color.set(state.hoveredId === selected.id ? 0x82efff : 0xff5c40);
    selectedAura.visible = true;
  } else {
    selectedAura.visible = false;
    selectionAuraMat.opacity = 0;
  }

  if (outlinePass) {
    outlinePass.selectedObjects = outlinePass.selectedObjects;
    if (selected) {
      outlinePass.edgeStrength = state.hoveredId ? 5.2 : 3.9 + Math.sin(time * 2.6) * 0.5;
    }
  }

  // Stage reacts to explosion state.
  const explodeAmount = parts.reduce((sum, p) => sum + p.display, 0) / parts.length;
  if (gridUniforms) gridUniforms.uExplode.value = THREE.MathUtils.damp(gridUniforms.uExplode.value, explodeAmount, 2.5, dt);
  tickGroup.rotation.y += dt * 0.018;
  stageRings.forEach((line, i) => {
    line.material.opacity = (i === 2 ? 0.18 : 0.2) + explodeAmount * 0.12 + Math.sin(time * 0.5 + i) * 0.035;
  });
  if (particleCloud) {
    particleCloud.rotation.y += dt * 0.005;
    particleCloud.rotation.x = Math.sin(time * 0.02) * 0.025;
    particleCloud2.rotation.y -= dt * 0.008;
    particleCloud.material.opacity = 0.45 + explodeAmount * 0.16;
  }

  // Update the assembly UI only on state edges.
  const countNow = parts.filter((p) => p.display > 0.5).length;
  if (countNow !== state.lastAssemblyCount) {
    updatePartsUI();
    updateHoverOutline();
    const selected = getSelected();
    if (selected) updateDetailToggleLabel(selected);
  }
}

// Camera helpers -----------------------------------------------------------

function getHomeDistance() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w <= 600) return 34;
  if (w <= 880) return 30;
  if (w <= 1100) return 22.4;
  if (w <= 1500) return 21.2;
  return 20.4;
}

function getExplodedDistance() {
  const w = window.innerWidth;
  if (w <= 600) return 46;
  if (w <= 880) return 40;
  if (w <= 1500) return 26.8;
  return 26.3;
}

function getCameraDirectionMobileBias() {
  const mobile = window.innerWidth <= 880;
  return new THREE.Vector3(mobile ? 0.54 : 0.69, mobile ? 0.22 : 0.35, 1).normalize();
}

function setInitialCamera() {
  const dir = getCameraDirectionMobileBias();
  const dist = getHomeDistance();
  controls.target.set(0, window.innerWidth <= 880 ? 2.08 : 1.9, 0);
  camera.position.copy(dir.multiplyScalar(dist)).add(controls.target);
  camera.lookAt(controls.target);
  controls.update();
}

function tweenCameraTo(position, target, duration = 1.15, ease = easeInOutCubic) {
  cameraTween = {
    startPos: camera.position.clone(),
    endPos: position.clone(),
    startTarget: controls.target.clone(),
    endTarget: target.clone(),
    t: 0,
    duration,
    ease,
  };
  controls.autoRotate = false;
  stopAutoRotateTimer();
}

function stopAutoRotateTimer() {
  if (state.autoRotateTimer) {
    clearTimeout(state.autoRotateTimer);
    state.autoRotateTimer = 0;
  }
}

function frameExplodedView(exploded) {
  if (!state.ready) return;
  const target = new THREE.Vector3(0, exploded ? 2.2 : 1.9, 0);
  const direction = camera.position.clone().sub(controls.target).normalize();
  const dist = exploded ? getExplodedDistance() : getHomeDistance();
  const endPos = target.clone().add(direction.multiplyScalar(dist));
  if (params.get('instant') === '1') {
    cameraTween = null;
    controls.target.copy(target);
    camera.position.copy(endPos);
    controls.update();
    return;
  }
  tweenCameraTo(endPos, target, 1.35, easeInOutCubic);
}

function focusPart(part) {
  if (!part) return;
  part.group.updateMatrixWorld();
  const center = new THREE.Vector3();
  part.group.getWorldPosition(center);
  center.y += 0.1;
  const direction = camera.position.clone().sub(controls.target).normalize();
  const dist = clamp(part.radius * 4.2 + 4.0, 8.0, 24.0);
  const endPos = center.clone().add(direction.multiplyScalar(dist));
  tweenCameraTo(endPos, center, 1.05, easeInOutCubic);
  markActiveView(null);
}

function cancelCameraTween() {
  if (!cameraTween) return;
  cameraTween = null;
  scheduleAutoRotateReturn();
}

function markActiveView(view) {
  document.querySelectorAll('.view-button[data-view]').forEach((button) => {
    button.classList.toggle('is-active', view !== null && button.dataset.view === view);
  });
}

function setView(view) {
  if (!state.ready) return;
  const target = new THREE.Vector3(0, 1.9, 0);
  let dist = state.allExploded ? getExplodedDistance() : getHomeDistance();
  let dir;
  if (view === 'front') {
    dir = new THREE.Vector3(0, 0.13, 1).normalize();
    target.set(0, 2.0, 0);
  } else if (view === 'side') {
    dir = new THREE.Vector3(-1, 0.18, 0.1).normalize();
    target.set(0, 1.9, 0);
  } else if (view === 'top') {
    dir = new THREE.Vector3(0.45, 1, 0.4).normalize();
    target.set(0, 1.7, 0);
  } else if (view === 'reset' || view === 'hero') {
    dir = getCameraDirectionMobileBias();
    target.set(0, window.innerWidth <= 880 ? 2.08 : 1.9, 0);
  } else {
    dir = getCameraDirectionMobileBias();
  }
  if (view === 'front' || view === 'top') dist *= 1.055;
  if (view === 'side') dist *= 1.08;
  if (window.innerWidth <= 880) target.y += 0.18;
  const endPos = target.clone().add(dir.multiplyScalar(dist));
  tweenCameraTo(endPos, target, 1.1, easeInOutCubic);
  markActiveView(view === 'reset' ? null : view);
  state.userHasZoomed = false;
  pauseAutoRotateFor(4500);
}

function pulseStage(index = 0) {
  const ring = pulseRings[index % pulseRings.length];
  if (!ring) return;
  ring.visible = true;
  ring.userData.active = true;
  ring.userData.progress = 0;
  ring.userData.index = index;
  ring.material.opacity = 0.35;
}

function flashExplosion() {
  pulseRings.forEach((ring, i) => {
    ring.visible = true;
    ring.userData.active = true;
    ring.userData.progress = -i * 0.11;
    ring.material.color.set(i === 0 ? 0x6ce8f5 : 0xff5b3d);
    ring.material.opacity = 0.44;
  });
}

function updateStagePulses(dt) {
  pulseRings.forEach((ring) => {
    if (!ring.userData.active) return;
    ring.userData.progress += dt;
    if (ring.userData.progress < 0) return;
    const p = clamp(ring.userData.progress / 1.4, 0, 1);
    const scale = 1.2 + p * 7.4;
    ring.scale.setScalar(scale);
    ring.material.opacity = (1 - p) * (p < 0.18 ? p / 0.18 : 1) * 0.34;
    if (p >= 1) {
      ring.visible = false;
      ring.userData.active = false;
    }
  });
}

// --------------------------------------------------------------------------
// 11. X-ray, auto rotate, labels, hover and input
// --------------------------------------------------------------------------

function setXray(enabled, { silent = false } = {}) {
  if (state.xray === enabled) {
    if (!silent && enabled) showToast('X-RAY 透视已启用', 1400);
    return;
  }
  state.xray = enabled;
  el.xrayBtn.classList.toggle('is-active', enabled);
  el.xrayBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  el.assemblyMode.textContent = enabled ? 'X-RAY ON' : 'X-RAY OFF';
  if (!silent) showToast(enabled ? 'X-RAY 透视已启用 · <b>内部结构可见</b>' : 'X-RAY 透视已关闭', 1600);
}

function updateXray(dt) {
  const targetMix = state.xray ? 1 : 0;
  state.xrayMix = THREE.MathUtils.damp(state.xrayMix, targetMix, 9, dt);
  if (Math.abs(state.xrayMix - targetMix) < 0.001) state.xrayMix = targetMix;
  const mix = state.xrayMix;
  bodyMaterialRecords.forEach((record) => {
    const material = record.material;
    if (!material) return;
    const targetOpacity = record.baseTransparent
      ? record.baseOpacity * (1 - mix * 0.84)
      : Math.max(0, 1 - mix * 0.86);
    if (mix > 0.002) {
      if (!material.transparent) {
        material.transparent = true;
        material.needsUpdate = true;
      }
      material.opacity = targetOpacity;
      material.depthWrite = mix < 0.12 ? record.baseDepthWrite : false;
    } else {
      material.opacity = record.baseOpacity;
      material.depthWrite = record.baseDepthWrite;
      if (!record.baseTransparent) {
        material.transparent = false;
        material.needsUpdate = true;
      } else {
        material.transparent = true;
      }
    }
  });
  M.bodyWire.opacity = mix * 0.33;
}

function pauseAutoRotateFor(ms) {
  state.autoRotatePausedUntil = performance.now() + ms;
  if (controls) controls.autoRotate = false;
  scheduleAutoRotateReturn();
}

function scheduleAutoRotateReturn() {
  stopAutoRotateTimer();
  if (!state.autoRotate || !state.ready) return;
  const delay = Math.max(0, state.autoRotatePausedUntil - performance.now());
  state.autoRotateTimer = window.setTimeout(() => {
    if (!state.autoRotate || state.modalOpen || state.isDragging || cameraTween) return;
    if (state.autoRotatePausedUntil > performance.now()) {
      scheduleAutoRotateReturn();
      return;
    }
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.38;
    }
  }, delay + 260);
}

function toggleAutoRotate(force) {
  const next = typeof force === 'boolean' ? force : !state.autoRotate;
  state.autoRotate = next;
  controls.autoRotate = next;
  el.autoBtn.classList.toggle('is-active', next);
  el.autoBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
  if (next) {
    pauseAutoRotateFor(200);
    showToast('自动旋转已启用 · <b>AUTO ORBIT</b>', 1300);
  } else {
    stopAutoRotateTimer();
    controls.autoRotate = false;
    showToast('自动旋转已暂停', 1300);
  }
  updatePartsUI();
}

function enterAutoRotateAfterIntro() {
  if (!state.autoRotate || state.modalOpen) return;
  state.autoRotatePausedUntil = performance.now() + 600;
  scheduleAutoRotateReturn();
}

function updateLabels() {
  if (!state.ready) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const mobile = w <= 880;
  let safeLeft = 18;
  let safeRight = w - 18;
  let safeTop = mobile ? 160 : 92;
  let safeBottom = mobile ? h - 150 : h - 104;
  if (!mobile) {
    safeLeft = w > 1260 ? 340 : w > 1060 ? 288 : 256;
    safeRight = w - (w > 1260 ? 374 : w > 1060 ? 318 : 306);
    safeBottom = h - (h < 690 ? 96 : 112);
  }
  stageSafe.left = safeLeft;
  stageSafe.right = safeRight;
  stageSafe.top = safeTop;
  stageSafe.bottom = safeBottom;

  const selected = getSelected();
  const hovered = state.hoveredId ? partById[state.hoveredId] : null;
  const compactLabels = !mobile && w < 1360;
  const showAll = !mobile && !compactLabels && parts.filter((p) => p.display > 0.22).length >= 3;
  const visible = [];

  parts.forEach((part) => {
    const label = ui.labels[part.id];
    if (!label) return;
    const isActive = state.selectedId === part.id;
    const isHover = state.hoveredId === part.id && !isActive;
    let show = false;
    if (mobile) {
      show = isActive || isHover;
    } else if (showAll) {
      show = part.display > 0.16 || isActive;
    } else if (compactLabels) {
      show =
        isActive ||
        isHover ||
        (!state.selectedId && (part.id === 'lens' || part.id === 'screen'));
    } else {
      show =
        isActive ||
        isHover ||
        (part.id === 'lens' && part.display < 0.25 && !state.selectedId) ||
        (part.id === 'screen' && part.display < 0.25 && !state.selectedId);
    }
    if (!show) {
      label.element.classList.remove('is-visible');
      label.element.style.pointerEvents = 'none';
      label.element.classList.toggle('is-active', isActive);
      return;
    }
    part.group.updateMatrixWorld();
    const anchor = part.worldAnchor.copy(part.anchorLocal).applyMatrix4(part.group.matrixWorld);
    const projected = anchor.clone().project(camera);
    if (projected.z < -1 || projected.z > 1.1) {
      label.element.classList.remove('is-visible');
      return;
    }
    const screenX = (projected.x * 0.5 + 0.5) * w;
    const screenY = (-projected.y * 0.5 + 0.5) * h;
    if (screenX < -160 || screenX > w + 160 || screenY < -100 || screenY > h + 100) {
      label.element.classList.remove('is-visible');
      return;
    }

    label.element.classList.add('is-visible');
    label.element.classList.toggle('is-active', isActive);
    label.element.style.pointerEvents = 'auto';

    const rect = label.element.getBoundingClientRect();
    const lw = rect.width || 105;
    const lh = rect.height || 30;
    const offsetScale = mobile ? 0.5 : 1;
    const offset = [part.labelOffset[0] * offsetScale, part.labelOffset[1] * offsetScale];
    let cx = screenX + offset[0];
    let cy = screenY + offset[1];

    // Keep labels inside the stage-safe region.
    cx = clamp(cx, safeLeft + lw / 2, safeRight - lw / 2);
    cy = clamp(cy, safeTop + lh / 2, safeBottom - lh / 2);

    if (showAll) {
      const placed = visible;
      for (let pass = 0; pass < 4; pass++) {
        for (let i = 0; i < placed.length; i++) {
          const other = placed[i];
          const dx = Math.abs(cx - other.cx);
          const dy = Math.abs(cy - other.cy);
          const overlapX = dx < (lw + other.w) / 2 + 5;
          const overlapY = dy < (lh + other.h) / 2 + 4;
          if (overlapX && overlapY) {
            let direction = part.labelOffset[1] < 0 ? -1 : 1;
            const shift = ((lh + other.h) / 2 + 4) - dy + 1;
            let nextY = cy + direction * shift;
            if (nextY - lh / 2 < safeTop || nextY + lh / 2 > safeBottom) {
              direction *= -1;
              nextY = cy + direction * shift;
            }
            cy = clamp(nextY, safeTop + lh / 2, safeBottom - lh / 2);
          }
        }
      }
    }

    visible.push({ id: part.id, cx, cy, w: lw, h: lh, sx: screenX, sy: screenY, active: isActive });

    label.element.style.left = `${cx}px`;
    label.element.style.top = `${cy}px`;
    label.element.classList.toggle('is-active', isActive);

    // Label wire / line endpoints.
    const endX = screenX < cx ? cx - lw / 2 : cx + lw / 2;
    const endY = clamp(screenY, cy - lh / 2 + 5, cy + lh / 2 - 5);
    const startX = screenX;
    const startY = screenY;
    const midX = startX + (endX - startX) * 0.56;
    const midY = startY + (endY - startY) * 0.56;
    const path = label.path;
    const simple = `M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
    path.setAttribute('d', simple);
    path.classList.add('is-visible');
    path.style.opacity = '1';
    path.classList.toggle('is-active', isActive);
    label.dot.setAttribute('cx', startX.toFixed(1));
    label.dot.setAttribute('cy', startY.toFixed(1));
    label.dot.style.opacity = '1';
    label.dot.classList.toggle('is-active', isActive);
    label.halo.setAttribute('cx', startX.toFixed(1));
    label.halo.setAttribute('cy', startY.toFixed(1));
    label.halo.classList.toggle('is-active', isActive);
    label.halo.style.opacity = isActive ? String(0.65 + Math.sin(state.clock * 3) * 0.25) : '';
  });

  Object.entries(ui.labels).forEach(([id, label]) => {
    if (!visible.find((v) => v.id === id)) {
      label.path.style.opacity = '0';
      label.dot.style.opacity = '0';
      label.halo.style.opacity = '0';
      label.element.classList.remove('is-visible');
      label.element.style.pointerEvents = 'none';
    }
  });
}

function setupInput() {
  const dom = renderer.domElement;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let moved = false;

  dom.addEventListener('pointerdown', (event) => {
    pointerDownX = event.clientX;
    pointerDownY = event.clientY;
    moved = false;
    state.isDragging = true;
    dom.classList.add('is-dragging');
    cancelCameraTween();
    hideFirstInteractions();
    if (event.pointerType === 'mouse') {
      // OrbitControls handles the actual drag.
      pauseAutoRotateFor(5200);
    }
  });

  dom.addEventListener('pointermove', (event) => {
    const dx = event.clientX - pointerDownX;
    const dy = event.clientY - pointerDownY;
    if (Math.hypot(dx, dy) > 6) moved = true;
    state.lastPointerInside = true;
    if (event.pointerType === 'mouse' && !state.isDragging) {
      const hit = getPartHit(event.clientX, event.clientY);
      setHovered(hit?.part?.id || null, 'canvas');
    }
  });

  dom.addEventListener('pointerleave', () => {
    state.lastPointerInside = false;
    clearHovered('canvas');
  });

  dom.addEventListener('pointerup', (event) => {
    state.isDragging = false;
    dom.classList.remove('is-dragging');
    if (moved) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    const hit = getPartHit(event.clientX, event.clientY);
    if (hit) {
      handlePartSelected(hit.part.id, 'canvas');
    } else {
      deselectPart();
    }
  });

  dom.addEventListener('dblclick', (event) => {
    const hit = getPartHit(event.clientX, event.clientY);
    if (!hit) {
      setView('reset');
    }
  });

  dom.addEventListener('wheel', () => {
    cancelCameraTween();
    state.userHasZoomed = true;
    hideFirstInteractions(false);
    pauseAutoRotateFor(5200);
  }, { passive: true });

  controls.addEventListener('start', () => {
    hideFirstInteractions();
    markActiveView(null);
    state.userHasZoomed = true;
    if (!cameraTween) pauseAutoRotateFor(5200);
  });

  controls.addEventListener('end', () => {
    state.isDragging = false;
    dom.classList.remove('is-dragging');
    pauseAutoRotateFor(3600);
  });
}

function hideFirstInteractions(hideChip = true) {
  state.firstInteractionDone = true;
  if (el.firstHint) el.firstHint.classList.remove('is-visible');
  if (hideChip && el.guideChip) el.guideChip.classList.add('is-dismissed');
}

// --------------------------------------------------------------------------
// 12. UI interactions, modal, toast, keyboard
// --------------------------------------------------------------------------

function setupUI() {
  createUIPartsList();
  buildLabels();
  renderEmptyDetail();
  updatePartsUI();

  el.explodeBtn.addEventListener('click', () => {
    hideFirstInteractions();
    const someAssembled = parts.some((p) => p.display < 0.5);
    const allExploded = !someAssembled;
    setAllExplosion(!allExploded);
    pauseAutoRotateFor(4800);
  });

  el.xrayBtn.addEventListener('click', () => {
    setXray(!state.xray);
    pauseAutoRotateFor(3800);
  });

  el.autoBtn.addEventListener('click', () => {
    toggleAutoRotate();
    pauseAutoRotateFor(2200);
  });

  el.detailPanel.addEventListener('click', (event) => {
    const button = event.target.closest('[data-detail-action]');
    if (!button) return;
    const selected = getSelected();
    if (!selected) return;
    if (button.dataset.detailAction === 'toggle') {
      togglePartExplosion(selected);
      updatePartSelectionUI(selected, { animateDetail: false });
      updateDetailToggleLabel(selected);
    } else if (button.dataset.detailAction === 'focus') {
      focusPart(selected);
      showToast(`聚焦 · <b>${selected.name}</b>`, 1200);
    }
  });

  document.querySelectorAll('.view-button[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      setView(button.dataset.view);
      hideFirstInteractions();
    });
  });

  el.helpBtn.addEventListener('click', openModal);
  el.modalClose.addEventListener('click', closeModal);
  el.helpModal.querySelector('[data-close-modal]').addEventListener('click', closeModal);

  el.guideDismiss.addEventListener('click', (e) => {
    e.stopPropagation();
    el.guideChip.classList.add('is-dismissed');
  });

  // Mobile drawer handle.
  el.panelHandle.addEventListener('click', () => {
    toggleMobileDrawer();
  });
  if (el.panelClose) {
    el.panelClose.addEventListener('click', () => {
      toggleMobileDrawer(false);
    });
  }

  window.addEventListener('keydown', (event) => {
    const tag = event.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === 'Escape') {
      if (state.modalOpen) closeModal();
      else {
        if (state.mobileDrawerOpen) toggleMobileDrawer(false);
        else deselectPart();
      }
      return;
    }
    if (state.modalOpen) return;
    if (event.key === 'e' || event.key === 'E') {
      el.explodeBtn.click();
    } else if (event.key === 'x' || event.key === 'X') {
      setXray(!state.xray);
    } else if (event.key === 'a' || event.key === 'A') {
      toggleAutoRotate();
    } else if (event.key === 'r' || event.key === 'R') {
      setView('reset');
    } else if (event.key === '1') {
      setView('hero');
    } else if (event.key === '2') {
      setView('front');
    } else if (event.key === '3') {
      setView('side');
    } else if (event.key === '4') {
      setView('top');
    }
  });

  window.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.guide-modal') || event.target.closest('.parts-panel') || event.target.closest('.bottom-dock')) return;
    if (state.modalOpen) return;
    hideFirstInteractions();
  }, { passive: true });

  // Show first-visit hint after the intro.
  setTimeout(() => {
    if (!state.firstInteractionDone) el.firstHint.classList.add('is-visible');
    setTimeout(() => el.firstHint.classList.remove('is-visible'), 8000);
  }, 3200);
}

function toggleMobileDrawer(force) {
  const next = typeof force === 'boolean' ? force : !state.mobileDrawerOpen;
  state.mobileDrawerOpen = next;
  el.partsPanel.classList.toggle('is-mobile-open', next);
  el.app.classList.toggle('mobile-drawer-open', next);
  el.panelHandle.setAttribute('aria-expanded', next ? 'true' : 'false');
  const hint = el.panelHandle.querySelector('span:last-child');
  if (hint) hint.textContent = next ? '点击收起' : '上滑展开';
  if (next) {
    state.autoRotatePausedUntil = performance.now() + 6000;
    controls.autoRotate = false;
  }
}

function showToast(message, duration = 1800) {
  if (!el.toast) return;
  el.toast.innerHTML = message;
  el.toast.classList.add('is-visible');
  clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => {
    el.toast.classList.remove('is-visible');
  }, duration);
}

function openModal() {
  if (state.modalOpen) return;
  state.modalOpen = true;
  controls.autoRotate = false;
  el.helpModal.hidden = false;
  requestAnimationFrame(() => el.helpModal.classList.add('is-open'));
  setTimeout(() => el.modalClose.focus(), 80);
}

function closeModal() {
  if (!state.modalOpen) return;
  state.modalOpen = false;
  el.helpModal.classList.remove('is-open');
  setTimeout(() => {
    el.helpModal.hidden = true;
  }, 380);
  scheduleAutoRotateReturn();
  el.helpBtn.focus({ preventScroll: true });
}

// --------------------------------------------------------------------------
// 13. Pointer-based title parallax
// --------------------------------------------------------------------------

function setupParallax() {
  const intro = document.querySelector('.intro');
  if (!intro) return;
  window.addEventListener('pointermove', (event) => {
    if (IS_COARSE || !state.ready) return;
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    intro.style.transform = `translate3d(${Math.round(x * -5)}px, ${Math.round(y * -4)}px, 0)`;
  }, { passive: true });
}

// --------------------------------------------------------------------------
// 14. Resize, initial framing, animation loop, boot
// --------------------------------------------------------------------------

function onResize() {
  if (!renderer) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, IS_COARSE ? 1.6 : 1.9));
  renderer.setSize(w, h, false);
  composer?.setPixelRatio(renderer.getPixelRatio());
  composer?.setSize(w, h);
  bloomPass?.setSize(w, h);
  if (bloomPass) {
    bloomPass.strength = w <= 880 ? 0.32 : (IS_COARSE ? 0.44 : 0.48);
  }
  outlinePass?.setSize(w, h);
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!state.ready) return;
    if (!cameraTween) {
      // Keep the object in frame across viewport changes.
      const target = controls.target.clone();
      const dir = camera.position.clone().sub(controls.target).normalize();
      const desired = state.allExploded ? getExplodedDistance() : getHomeDistance();
      const current = camera.position.distanceTo(controls.target);
      if (current < desired * 0.72 || current > desired * 1.42) {
        camera.position.copy(target.clone().add(dir.multiplyScalar(desired)));
        controls.target.copy(target);
      }
    }
    updateLabels();
  }, 180);
}

function animate() {
  state.frame = requestAnimationFrame(animate);
  if (!state.ready) return;
  const dt = Math.min(clock.getDelta(), 0.06);
  state.clock += dt;

  // camera tween
  if (cameraTween) {
    cameraTween.t += dt / cameraTween.duration;
    const t = clamp(cameraTween.t, 0, 1);
    const eased = cameraTween.ease(t);
    camera.position.lerpVectors(cameraTween.startPos, cameraTween.endPos, eased);
    controls.target.lerpVectors(cameraTween.startTarget, cameraTween.endTarget, eased);
    if (t >= 1) {
      cameraTween = null;
      controls.autoRotate = false;
      scheduleAutoRotateReturn();
    }
  } else {
    if (state.autoRotate && !state.isDragging && !state.modalOpen && !state.mobileDrawerOpen) {
      if (performance.now() > state.autoRotatePausedUntil) {
        controls.autoRotate = true;
      }
    } else {
      controls.autoRotate = false;
    }
  }
  controls.update();

  updateParts(dt, state.clock);
  updateXray(dt);
  updateStagePulses(dt);
  updateLabels();

  // Gentle lens glow / stage light motion.
  if (stageGroup) {
    stageGroup.rotation.y = Math.sin(state.clock * 0.045) * 0.012;
  }

  composer.render();
}

async function boot() {
  try {
    setLoader(5, '初始化 WebGL 渲染器');
    await nextFrame();
    initCore();

    setLoader(22, '生成机身与结构骨架');
    await nextFrame();
    createMaterials();
    buildParticles();
    buildStage();
    await nextFrame();

    setLoader(48, '装配光学、影像与显示模组');
    await nextFrame();
    buildModel();

    setLoader(69, '写入电路纹理与材质细节');
    await nextFrame();
    initPostprocessing();
    setupUI();
    setupInput();
    setupParallax();

    setLoader(86, '校准摄影机与交互标注');
    await nextFrame();
    setInitialCamera();
    onResize();
    updateLabels();
    await nextFrame();

    setLoader(94, '载入高光与交互引导');
    await wait(220);
    setLoader(100, '系统就绪');

    // Query overrides are useful for direct views and automated captures.
    if (params.get('autorotate') === '0') {
      state.autoRotate = false;
      controls.autoRotate = false;
      el.autoBtn.classList.remove('is-active');
      el.autoBtn.setAttribute('aria-pressed', 'false');
    }
    if (params.get('xray') === '1') {
      setXray(true, { silent: true });
    }

    await wait(560);
    state.ready = true;
    clock.start();
    el.app.classList.add('is-ready');
    el.loader.classList.add('is-done');
    setTimeout(() => {
      el.loader.style.display = 'none';
    }, 1100);

    // Cinematic camera entry.
    if (!PREFERS_REDUCED_MOTION && params.get('instant') !== '1') {
      const home = camera.position.clone();
      const dir = home.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target.clone().add(dir.multiplyScalar(getHomeDistance() * 1.18)));
      camera.position.y += 0.8;
      const end = controls.target.clone().add(dir.multiplyScalar(getHomeDistance()));
      tweenCameraTo(end, controls.target.clone(), 2.0, easeOutCubic);
    }

    setTimeout(() => {
      enterAutoRotateAfterIntro();
    }, 2400);

    if (params.get('view')) {
      setView(params.get('view'));
    }
    if (params.get('part')) {
      const part = partById[params.get('part')];
      if (part) setTimeout(() => handlePartSelected(part.id, 'query'), 400);
    }
    if (params.get('explode') === '1') {
      setTimeout(() => setAllExplosion(true), 250);
    }

    animate();
  } catch (error) {
    fatalError('初始化失败，请检查 WebGL 支持或刷新页面', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
