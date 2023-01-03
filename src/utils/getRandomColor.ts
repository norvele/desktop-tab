export function getRandomRGB(generator: () => number) {
  const r = Math.floor(generator() * 256);
  const g = Math.floor(generator() * 256);
  const b = Math.floor(generator() * 256);
  return [r, g, b];
}

export function getRandomHEX(generator: () => number) {
  const [r, g, b] = getRandomRGB(generator);
  const hr = r.toString(16).padStart(2, "0");
  const hg = g.toString(16).padStart(2, "0");
  const hb = b.toString(16).padStart(2, "0");
  return `#${hr}${hg}${hb}`;
}
