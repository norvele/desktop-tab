import seedrandom from "seedrandom";

export function createSeededRand(seed: string) {
  return seedrandom(seed);
}
