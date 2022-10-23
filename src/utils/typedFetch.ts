export function typedFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  return fetch(url, options).then((r) => r.json());
}
