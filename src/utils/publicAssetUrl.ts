
export function publicAssetUrl(assetPath: string): string {
  if (
    /^(https?:)?\/\//i.test(assetPath) ||
    /^(data:|blob:)/i.test(assetPath)
  ) {
    return assetPath;
  }

  return `${import.meta.env.BASE_URL}${assetPath.replace(/^\/+/, '')}`;
}
