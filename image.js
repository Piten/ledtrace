// Use integer luma weights that sum to 256. The threshold gates the
// whole pixel before the three color channels are accumulated separately.
export function accumulate(target, frame, threshold) {
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
