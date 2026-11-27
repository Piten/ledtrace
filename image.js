// Build the transfer curve once for each frame and apply it to the
// selected brightness measure. The transition starts at the threshold.
const weights = new Float32Array(256);

export function accumulate(target, frame, threshold, mode = 'luma', softness = 0) {
  for (let value = threshold; value < weights.length; value++) {
    const t = softness ? Math.min(1, (value - threshold + 1) / Math.min(softness, 256 - threshold)) : 1;
    weights[value] = t * t * (3 - 2 * t);
  }

  let changed = false;
  const perChannel = mode === 'rgb';
  for (let i = 0; i < target.length; i += 4) {
    const red = frame[i];
    const green = frame[i + 1];
    const blue = frame[i + 2];
    const level = perChannel ? Math.max(red, green, blue) : (54 * red + 183 * green + 19 * blue) >> 8;
    if (level < threshold) continue;

    for (let channel = i; channel < i + 3; channel++) {
      const value = frame[channel];
      if (perChannel && value < threshold) continue;
      const next = Math.round(value * weights[perChannel ? value : level]);
      if (next > target[channel]) {
        target[channel] = next;
        changed = true;
      }
    }
  }
  return changed;
}

export function squareCrop(width, height) {
  const size = Math.min(width, height);
  return [(width - size) / 2, (height - size) / 2, size, size];
}

// Two separable box blurs form a soft halo. Rolling sums keep processing
// time independent of the blur radius for each output pixel.
export function blurRGB(pixels, scratch, side, radius) {
  const windowSize = radius * 2 + 1;
  for (let pass = 0; pass < 4; pass++) {
    const horizontal = pass % 2 === 0;
    const source = horizontal ? pixels : scratch;
    const target = horizontal ? scratch : pixels;
    const step = horizontal ? 4 : side * 4;
    const lineStep = horizontal ? side * 4 : 4;

    for (let line = 0; line < side; line++) {
      const start = line * lineStep;
      for (let channel = 0; channel < 3; channel++) {
        const first = start + channel;
        let sum = source[first] * radius;
        for (let x = 0; x <= radius; x++) {
          sum += source[first + x * step];
        }
        for (let x = 0; x < side; x++) {
          target[first + x * step] = sum / windowSize;
          sum -= source[first + Math.max(0, x - radius) * step];
          sum += source[first + Math.min(side - 1, x + radius + 1) * step];
        }
      }
    }
  }
}
