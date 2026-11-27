// Use integer luma weights that sum to 256. The threshold gates the
// whole pixel before the three color channels are accumulated separately.
export function accumulate(target, frame, threshold, mode = 'luma') {
  if (mode === 'rgb') {
    for (let i = 0; i < target.length; i += 4) {
      for (let channel = i; channel < i + 3; channel++) {
        if (frame[channel] >= threshold) {
          target[channel] = Math.max(target[channel], frame[channel]);
        }
      }
    }
    return;
  }

  for (let i = 0; i < target.length; i += 4) {
    const red = frame[i];
    const green = frame[i + 1];
    const blue = frame[i + 2];
    if (54 * red + 183 * green + 19 * blue < threshold * 256) continue;
    target[i] = Math.max(target[i], red);
    target[i + 1] = Math.max(target[i + 1], green);
    target[i + 2] = Math.max(target[i + 2], blue);
  }
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
