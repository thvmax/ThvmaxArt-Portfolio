export function drawGradientCanvas(
  canvas: HTMLCanvasElement,
  hue: number,
  style: 'dark' | 'light' = 'dark'
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, w, h);
  if (style === 'dark') {
    bg.addColorStop(0, `hsl(${hue}, 20%, 8%)`);
    bg.addColorStop(1, `hsl(${hue + 40}, 30%, 15%)`);
  } else {
    bg.addColorStop(0, `hsl(${hue}, 30%, 70%)`);
    bg.addColorStop(1, `hsl(${hue + 40}, 20%, 90%)`);
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Radial shapes
  for (let i = 0; i < 4; i++) {
    const x = (i * 0.33 + 0.1) * w;
    const y = (i % 2 === 0 ? 0.3 : 0.6) * h;
    const r = w * (0.15 + i * 0.06);
    const gc = ctx.createRadialGradient(x, y, 0, x, y, r);
    gc.addColorStop(0, `hsla(${hue + i * 25}, 70%, 60%, 0.25)`);
    gc.addColorStop(1, `hsla(${hue + i * 25}, 70%, 60%, 0)`);
    ctx.fillStyle = gc;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Grid lines
  ctx.strokeStyle = `rgba(255,255,255,0.06)`;
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += w / 6) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += h / 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // THVMAX watermark
  ctx.fillStyle = `rgba(255,255,255,0.12)`;
  ctx.font = `bold ${w * 0.18}px Syne, sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('THVMAX', w - 16, h - 12);
}

export function drawPortrait(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#1a1a1a');
  bg.addColorStop(1, '#2d2a24');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Abstract face shapes
  ctx.fillStyle = 'rgba(200,184,154,0.12)';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.38, w * 0.28, h * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(200,184,154,0.08)';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.7, w * 0.3, h * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 3; i++) {
    const grd = ctx.createRadialGradient(
      w * (0.3 + i * 0.2),
      h * (0.2 + i * 0.3),
      0,
      w * (0.3 + i * 0.2),
      h * (0.2 + i * 0.3),
      w * 0.3
    );
    grd.addColorStop(0, `hsla(35, 40%, 65%, 0.15)`);
    grd.addColorStop(1, `hsla(35, 40%, 65%, 0)`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.fillStyle = 'rgba(245,243,239,0.07)';
  ctx.font = `800 ${w * 0.55}px Syne, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('THVMAX', w * 0.5, h * 0.5);
}
