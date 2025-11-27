export const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL || "";

export function assetUrl(path: string) {
  if (!path) return assetBase;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${assetBase}${normalized}`;
}