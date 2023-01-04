export function copyToClipboard(text: string) {
  if ("clipboard" in navigator) {
    navigator.clipboard.writeText(text);
    return;
  }
}
