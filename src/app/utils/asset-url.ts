/**
 * Extracts the pathname from a Vendure asset preview URL and returns it as
 * a root-relative path. Vendure's generated host may not be browser-accessible
 * (e.g. internal Docker hostname). Using just the path lets nginx/dev-proxy
 * route the request correctly regardless of environment.
 *
 * e.g. "http://server:3000/assets/preview/40/img.jpg" → "/assets/preview/40/img.jpg"
 */
export function assetUrl(preview: string | null | undefined): string {
  if (!preview) return '';
  try {
    return new URL(preview).pathname;
  } catch {
    // Already a relative path or malformed — use as-is
    return preview;
  }
}
