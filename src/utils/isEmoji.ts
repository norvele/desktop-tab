// @ts-ignore
import ifEmoji from "if-emoji";

export function isEmoji(symbol: string) {
  return ifEmoji(symbol);
}
