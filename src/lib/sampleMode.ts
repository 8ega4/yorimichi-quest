export function isSampleMode(search = window.location.search) {
  return new URLSearchParams(search).get("sample") === "1";
}

export function withSampleMode(path: string, search = window.location.search) {
  return isSampleMode(search) ? `${path}${path.includes("?") ? "&" : "?"}sample=1` : path;
}
