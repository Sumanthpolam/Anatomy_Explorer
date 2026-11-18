import * as THREE from 'three';

function createCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function createGyriTexture(
  baseHex: string,
  sulcusHex: string,
  maxAnisotropy: number,
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const [cCanvas, cCtx] = createCanvas(size);
  const [bCanvas, bCtx] = createCanvas(size);

  cCtx.fillStyle = baseHex;
  cCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#d4d4d4';
  bCtx.fillRect(0, 0, size, size);

  // Deterministic pseudo-random gyri folds
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 110; i++) {
    const startX = rand() * size;
    const startY = rand() * size;
    const steps = 8 + Math.floor(rand() * 8);
    let x = startX;
    let y = startY;
    let angle = rand() * Math.PI * 2;

    cCtx.beginPath();
    bCtx.beginPath();
    cCtx.moveTo(x, y);
    bCtx.moveTo(x, y);

    for (let s = 0; s < steps; s++) {
      angle += (rand() - 0.5) * 1.4;
      x += Math.cos(angle) * 24;
      y += Math.sin(angle) * 24;
      cCtx.lineTo(x, y);
      bCtx.lineTo(x, y);
    }

    cCtx.strokeStyle = sulcusHex;
    cCtx.lineWidth = 5 + rand() * 5;
    cCtx.lineCap = 'round';
    cCtx.lineJoin = 'round';
    cCtx.globalAlpha = 0.45;
    cCtx.stroke();

    bCtx.strokeStyle = '#333333';
    bCtx.lineWidth = cCtx.lineWidth + 2;
    bCtx.lineCap = 'round';
    bCtx.lineJoin = 'round';
    bCtx.globalAlpha = 0.65;
    bCtx.stroke();
  }

  const map = new THREE.CanvasTexture(cCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.anisotropy = maxAnisotropy;

  return { map, bumpMap };
}

export function createFoliaTexture(maxAnisotropy: number): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 256;
  const [cCanvas, cCtx] = createCanvas(size);
  const [bCanvas, bCtx] = createCanvas(size);

  cCtx.fillStyle = '#e07a8e';
  cCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#bbbbbb';
  bCtx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 8) {
    cCtx.fillStyle = y % 16 === 0 ? 'rgba(130, 35, 58, 0.38)' : 'rgba(255, 190, 200, 0.22)';
    cCtx.fillRect(0, y, size, 3);
    bCtx.fillStyle = y % 16 === 0 ? '#444444' : '#eeeeee';
    bCtx.fillRect(0, y, size, 3);
  }

  const map = new THREE.CanvasTexture(cCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.anisotropy = maxAnisotropy;

  return { map, bumpMap };
}

export function createMuscleFiberTexture(
  baseHex: string,
  stripeHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const size = 256;
  const [canvas, ctx] = createCanvas(size);
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = stripeHex;
  ctx.globalAlpha = 0.28;
  for (let i = -size; i < size * 2; i += 7) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.bezierCurveTo(i + 24, size * 0.35, i - 18, size * 0.7, i + 12, size);
    ctx.lineWidth = 2.2;
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createLungTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const [canvas, ctx] = createCanvas(size);
  ctx.fillStyle = '#e58c9b';
  ctx.fillRect(0, 0, size, size);

  let seed = 4242;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 180; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 6 + rand() * 14;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(136, 38, 62, 0.22)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const [canvas, ctx] = createCanvas(size);
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.06,
    size / 2,
    size / 2,
    size * 0.5,
  );
  grad.addColorStop(0, 'rgba(2, 6, 16, 0.75)');
  grad.addColorStop(0.55, 'rgba(2, 6, 16, 0.28)');
  grad.addColorStop(1, 'rgba(2, 6, 16, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPedestalRingTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const [canvas, ctx] = createCanvas(size);
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.34, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const r1 = size * 0.42;
    const r2 = i % 3 === 0 ? size * 0.46 : size * 0.44;
    ctx.strokeStyle = i % 3 === 0 ? 'rgba(34, 211, 238, 0.45)' : 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}
