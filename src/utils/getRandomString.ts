import cryptoRandomString from "crypto-random-string";

export function getRandomString(length: number) {
  return cryptoRandomString({ length });
}
