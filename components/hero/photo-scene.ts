/**
 * Photoreal hero viewer (desktop + phones).
 *
 * The room is rendered offline in Blender/Cycles (scripts/blender) as separate LIGHT PASSES:
 * ambient (dusk), tube light, table lamp and TV as full frames, plus small crops for the AC LED and the
 * four switch indicator LEDs, and a depth map. This shader adds the passes in linear light, so switching a
 * device on relights the photograph exactly as a real render would. The "3D" comes from depth-based
 * parallax (mouse on desktop, device tilt on phones, gentle idle drift). The running ceiling fan is a real
 * motion-blurred render (blades turning during the exposure), cross-faded in per light pass.
 */
import type { DeviceId, Devices } from "./devices";

export type PhotoScene = {
  setDevices(d: Devices): void;
  /** Must be called from a user gesture on iOS to enable tilt parallax */
  enableTilt(): void;
  dispose(): void;
};

type Rect = [number, number, number, number]; // x0, y0, x1, y1 — normalised, origin bottom-left
type Meta = {
  size: [number, number];
  passes: Record<"ambient" | "tube" | "lamp" | "tv", { file: string; gain: number }>;
  crops: Record<"ac" | "sw1" | "sw2" | "sw3" | "sw4", { file: string; rect: Rect }>;
  hotspots: Partial<Record<"tube" | "lamp" | "tv" | "ac" | "switch" | "fan", Rect>>;
  depth: string;
  fanspin: { rect: Rect; files: Record<"ambient" | "tube" | "lamp" | "tv", string> };
};

type Options = {
  canvas: HTMLCanvasElement;
  base: string; // e.g. "/hero/desktop/"
  label: HTMLElement;
  onToggle: (id: DeviceId) => void;
  /** Horizontal anchor for "cover" cropping: 0 = keep left, 0.5 = centre, 1 = keep right */
  anchorX?: number;
};

const NAMES: Record<string, string> = {
  tube: "Tube light",
  lamp: "Table lamp",
  tv: "TV",
  ac: "AC (IR remote)",
  fan: "Ceiling fan",
  switch: "Switchboard",
};
// switch indicator LEDs left → right map to these devices (same as the rocker order)
const SWITCH_DEVICES: DeviceId[] = ["fan", "lamp", "tv", "light"];

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
uniform vec4 uCover; // scale.xy, offset.xy (canvas uv -> image uv)
void main() {
  vec2 uv = aPos * 0.5 + 0.5;
  vUv = uv * uCover.xy + uCover.zw;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D tAmb, tTube, tLamp, tTv, tDepth, tAtlas;
uniform vec4 uRc[5]; // image-space rects of the small crops: ac, sw1..sw4
uniform vec4 uAc[5]; // where each crop sits in the atlas
uniform vec4 uFanR;  // image-space rect of the spinning-fan crops
uniform vec4 uAf[4]; // atlas rects of the fan crops: ambient, tube, lamp, tv
uniform vec4 w1;     // tube, lamp, tv, ac
uniform vec4 w2;     // sw1..sw4
uniform vec3 gain;   // tube, lamp, tv
uniform vec2 uPar;   // parallax offset
uniform float uZoom, uFan, uExposure, uAmbGain;

vec3 lin(vec3 c) { return pow(c, vec3(2.2)); }

vec3 atlas(vec4 a, vec4 r, vec2 uv) {
  vec2 q = clamp((uv - r.xy) / (r.zw - r.xy), 0.0, 1.0);
  return lin(texture2D(tAtlas, mix(a.xy, a.zw, q)).rgb);
}
float inside(vec4 r, vec2 uv) {
  return step(r.x, uv.x) * step(uv.x, r.z) * step(r.y, uv.y) * step(uv.y, r.w);
}

vec3 scene(vec2 uv) {
  vec3 a = lin(texture2D(tAmb, uv).rgb);
  vec3 t = lin(texture2D(tTube, uv).rgb);
  vec3 l = lin(texture2D(tLamp, uv).rgb);
  vec3 v = lin(texture2D(tTv, uv).rgb);

  // fan running: swap in the motion-blurred renders (one per light pass), feathered at the edges
  if (uFan > 0.001) {
    vec2 q = (uv - uFanR.xy) / (uFanR.zw - uFanR.xy);
    vec2 e = min(q, 1.0 - q);
    float f = uFan * smoothstep(0.0, 0.08, min(e.x, e.y));
    if (f > 0.0) {
      a = mix(a, atlas(uAf[0], uFanR, uv), f);
      t = mix(t, atlas(uAf[1], uFanR, uv), f);
      l = mix(l, atlas(uAf[2], uFanR, uv), f);
      v = mix(v, atlas(uAf[3], uFanR, uv), f);
    }
  }

  vec3 c = a * uAmbGain + t * gain.x * w1.x + l * gain.y * w1.y + v * gain.z * w1.z;
  c += atlas(uAc[0], uRc[0], uv) * inside(uRc[0], uv) * w1.w;
  c += atlas(uAc[1], uRc[1], uv) * inside(uRc[1], uv) * w2.x;
  c += atlas(uAc[2], uRc[2], uv) * inside(uRc[2], uv) * w2.y;
  c += atlas(uAc[3], uRc[3], uv) * inside(uRc[3], uv) * w2.z;
  c += atlas(uAc[4], uRc[4], uv) * inside(uRc[4], uv) * w2.w;
  return c;
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 uv = (vUv - 0.5) / uZoom + 0.5;
  float d = texture2D(tDepth, uv).r;
  uv += uPar * (d - 0.35);
  uv = clamp(uv, 0.001, 0.999);
  vec3 c = aces(scene(uv) * uExposure);
  gl_FragColor = vec4(pow(c, vec3(1.0 / 2.2)), 1.0);
}`;

/**
 * Loads a render as an ImageBitmap, which the browser decodes off the main thread (a plain <img> is decoded
 * on it when uploaded to WebGL, which freezes slow phones for a moment). `flip` turns it upside down at decode
 * time, because WebGL's UNPACK_FLIP_Y setting is ignored for ImageBitmaps. Falls back to <img> on old browsers.
 */
async function loadBitmap(src: string, flip: boolean): Promise<ImageBitmap | HTMLImageElement> {
  try {
    const blob = await (await fetch(src)).blob();
    return await createImageBitmap(blob, flip ? { imageOrientation: "flipY" } : undefined);
  } catch {
    return loadImage(src);
  }
}
const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function createPhotoScene({ canvas, base, label, onToggle, anchorX = 0.5 }: Options): Promise<PhotoScene> {
  const meta: Meta = await (await fetch(`${base}meta.json`)).json();
  const fullFiles: Record<string, string> = {
    tAmb: meta.passes.ambient.file,
    tTube: meta.passes.tube.file,
    tLamp: meta.passes.lamp.file,
    tTv: meta.passes.tv.file,
    tDepth: meta.depth,
  };
  // small images are packed into one atlas so the shader needs only 6 texture units (WebGL1 guarantees 8)
  const atlasFiles = [
    meta.crops.ac.file,
    meta.crops.sw1.file,
    meta.crops.sw2.file,
    meta.crops.sw3.file,
    meta.crops.sw4.file,
    meta.fanspin.files.ambient,
    meta.fanspin.files.tube,
    meta.fanspin.files.lamp,
    meta.fanspin.files.tv,
  ];
  const [fullImages, atlasImages] = await Promise.all([
    Promise.all(Object.entries(fullFiles).map(async ([k, f]) => [k, await loadBitmap(base + f, true)] as const)),
    Promise.all(atlasFiles.map((f) => loadBitmap(base + f, false))),
  ]);
  const PAD = 2;
  const atlasCanvas = document.createElement("canvas");
  atlasCanvas.width = Math.max(...atlasImages.map((i) => i.width)) + PAD * 2;
  atlasCanvas.height = atlasImages.reduce((h, i) => h + i.height + PAD * 2, 0);
  const actx = atlasCanvas.getContext("2d")!;
  const atlasRects: number[][] = [];
  let ay = 0;
  for (const img of atlasImages) {
    const w = img.width;
    const h = img.height;
    actx.drawImage(img, PAD, ay + PAD);
    // uv rect (origin bottom-left because textures are uploaded flipped), inset by half a texel
    atlasRects.push([
      (PAD + 0.5) / atlasCanvas.width,
      1 - (ay + PAD + h - 0.5) / atlasCanvas.height,
      (PAD + w - 0.5) / atlasCanvas.width,
      1 - (ay + PAD + 0.5) / atlasCanvas.height,
    ]);
    ay += h + PAD * 2;
  }

  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, powerPreference: "high-performance" });
  if (!gl) throw new Error("no webgl");

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const textures: WebGLTexture[] = [];
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const sources: (readonly [string, TexImageSource])[] = [...fullImages, ["tAtlas", atlasCanvas]];
  for (const [i, [name, img]] of sources.entries()) {
    if (i) await nextTask(); // one upload per task, so the page stays responsive while the scene loads
    const t = gl.createTexture()!;
    textures.push(t);
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(U(name), i);
  }
  const cropKeys = ["ac", "sw1", "sw2", "sw3", "sw4"] as const;
  gl.uniform4fv(U("uRc[0]"), new Float32Array(cropKeys.flatMap((k) => meta.crops[k].rect)));
  gl.uniform4fv(U("uAc[0]"), new Float32Array(atlasRects.slice(0, 5).flat()));
  gl.uniform4fv(U("uAf[0]"), new Float32Array(atlasRects.slice(5).flat()));
  gl.uniform4fv(U("uFanR"), meta.fanspin.rect);
  gl.uniform3f(U("gain"), meta.passes.tube.gain, meta.passes.lamp.gain, meta.passes.tv.gain);

  // ---------- sizing ("cover" crop of the render into the canvas) ----------
  const [IW, IH] = meta.size;
  const cover = { sx: 1, sy: 1, ox: 0, oy: 0 };
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    const ca = w / h;
    const ia = IW / IH;
    if (ca > ia) {
      cover.sx = 1;
      cover.sy = ia / ca;
    } else {
      cover.sx = ca / ia;
      cover.sy = 1;
    }
    cover.ox = (1 - cover.sx) * anchorX;
    cover.oy = (1 - cover.sy) * 0.5;
    gl!.uniform4f(U("uCover"), cover.sx, cover.sy, cover.ox, cover.oy);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // ---------- state & input ----------
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let devices: Devices = { light: false, fan: false, lamp: false, tv: false, ac: false };
  const cur = { tube: 0, lamp: 0, tv: 0, ac: 0, fan: 0, sw: [0, 0, 0, 0] };
  const par = { x: 0, y: 0, tx: 0, ty: 0 };
  const ZOOM = 1.06;

  function toImageUv(clientX: number, clientY: number) {
    const b = canvas.getBoundingClientRect();
    const u = (clientX - b.left) / b.width;
    const v = 1 - (clientY - b.top) / b.height;
    let x = u * cover.sx + cover.ox;
    let y = v * cover.sy + cover.oy;
    x = (x - 0.5) / ZOOM + 0.5;
    y = (y - 0.5) / ZOOM + 0.5;
    return { x, y };
  }
  function hit(clientX: number, clientY: number): { key: string; device: DeviceId } | null {
    const p = toImageUv(clientX, clientY);
    const inside = (r?: Rect) => !!r && p.x >= r[0] && p.x <= r[2] && p.y >= r[1] && p.y <= r[3];
    const hs = meta.hotspots;
    if (inside(hs.switch)) {
      const r = hs.switch!;
      const i = Math.min(3, Math.max(0, Math.floor(((p.x - r[0]) / (r[2] - r[0])) * 4)));
      return { key: "switch", device: SWITCH_DEVICES[i] };
    }
    if (inside(hs.tube)) return { key: "tube", device: "light" };
    if (inside(hs.lamp)) return { key: "lamp", device: "lamp" };
    if (inside(hs.tv)) return { key: "tv", device: "tv" };
    if (inside(hs.ac)) return { key: "ac", device: "ac" };
    if (inside(hs.fan)) return { key: "fan", device: "fan" };
    return null;
  }
  function showLabel(h: ReturnType<typeof hit>, x: number, y: number) {
    if (!h) {
      label.style.opacity = "0";
      return;
    }
    const on = devices[h.device];
    const name = h.key === "switch" ? `Switch → ${NAMES[h.device === "light" ? "tube" : h.device]}` : NAMES[h.key];
    label.textContent = `${name} · ${on ? "on — tap to switch off" : "off — tap to switch on"}`;
    label.style.opacity = "1";
    label.style.transform = `translate(${x + 14}px, ${y + 14}px)`;
  }

  let downAt: { x: number; y: number } | null = null;
  const onMove = (e: PointerEvent) => {
    const b = canvas.getBoundingClientRect();
    if (e.pointerType === "mouse") {
      par.tx = ((e.clientX - b.left) / b.width - 0.5) * 2;
      par.ty = ((e.clientY - b.top) / b.height - 0.5) * 2;
      const h = hit(e.clientX, e.clientY);
      canvas.style.cursor = h ? "pointer" : "default";
      showLabel(h, e.clientX - b.left, e.clientY - b.top);
    }
  };
  const onDown = (e: PointerEvent) => {
    downAt = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: PointerEvent) => {
    if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8) return;
    downAt = null;
    const h = hit(e.clientX, e.clientY);
    if (h) onToggle(h.device);
  };
  const onLeave = () => {
    par.tx = 0;
    par.ty = 0;
    showLabel(null, 0, 0);
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointerleave", onLeave);

  // phone tilt → parallax
  let tiltOn = false;
  const onTilt = (e: DeviceOrientationEvent) => {
    if (e.beta == null || e.gamma == null) return;
    par.tx = Math.max(-1, Math.min(1, e.gamma / 20));
    par.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 20));
  };
  function enableTilt() {
    if (tiltOn || reduce) return;
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    const start = () => {
      window.addEventListener("deviceorientation", onTilt);
      tiltOn = true;
    };
    if (DOE && typeof DOE.requestPermission === "function") {
      DOE.requestPermission().then((r) => r === "granted" && start()).catch(() => {});
    } else start();
  }
  if (!("ontouchstart" in window)) {
    /* desktop: mouse parallax only */
  } else {
    // Android etc. don't need permission
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (!(DOE && typeof DOE.requestPermission === "function")) enableTilt();
  }

  let visible = true;
  const io = new IntersectionObserver((en) => (visible = en[0]?.isIntersecting ?? true));
  io.observe(canvas);

  // ---------- render loop ----------
  let raf = 0;
  let last = performance.now();
  let disposed = false;
  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const k = reduce ? 1 : 1 - Math.pow(0.002, dt);
    cur.tube += ((devices.light ? 1 : 0) - cur.tube) * k;
    cur.lamp += ((devices.lamp ? 1 : 0) - cur.lamp) * k;
    cur.tv += ((devices.tv ? 1 : 0) - cur.tv) * k;
    cur.ac += ((devices.ac ? 1 : 0) - cur.ac) * k;
    cur.fan += ((devices.fan ? 1 : 0) - cur.fan) * (reduce ? 1 : 1 - Math.pow(0.12, dt));
    SWITCH_DEVICES.forEach((id, i) => (cur.sw[i] += ((devices[id] ? 1 : 0) - cur.sw[i]) * k));

    // idle drift keeps the room feeling three-dimensional even without input
    const drift = reduce ? 0 : 0.25;
    const ix = par.tx + Math.sin(now / 3100) * drift;
    const iy = par.ty + Math.cos(now / 3700) * drift * 0.6;
    par.x += (ix - par.x) * 0.06;
    par.y += (iy - par.y) * 0.06;
    const strength = reduce ? 0 : 0.018;

    gl!.uniform4f(U("w1"), cur.tube, cur.lamp, cur.tv, cur.ac);
    gl!.uniform4f(U("w2"), cur.sw[0], cur.sw[1], cur.sw[2], cur.sw[3]);
    gl!.uniform2f(U("uPar"), -par.x * strength, par.y * strength);
    gl!.uniform1f(U("uZoom"), ZOOM + cur.tube * 0.01);
    gl!.uniform1f(U("uFan"), cur.fan);
    gl!.uniform1f(U("uExposure"), 1.0);
    gl!.uniform1f(U("uAmbGain"), 0.72);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
  }
  const loop = (now: number) => {
    if (disposed) return;
    raf = requestAnimationFrame(loop);
    if (visible && !document.hidden) frame(now);
  };
  raf = requestAnimationFrame(loop);

  return {
    setDevices(d) {
      devices = { ...d };
    },
    enableTilt,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("deviceorientation", onTilt);
      textures.forEach((t) => gl!.deleteTexture(t));
      gl!.deleteProgram(prog);
      gl!.deleteBuffer(buf);
    },
  };
}
