export function getIconUrlFromUrl(url: string, size: number): string {
  try {
    const urlObject = new URL(url);
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${urlObject.origin}&size=${size}`;
  } catch (e) {
    return "";
  }
}
