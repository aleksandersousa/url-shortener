export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string" || url.trim().length === 0) {
    return false;
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    return false;
  }

  try {
    const urlObject = new URL(trimmedUrl);

    if (urlObject.protocol !== "http:" && urlObject.protocol !== "https:") {
      return false;
    }

    if (!urlObject.hostname || urlObject.hostname.length === 0) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
