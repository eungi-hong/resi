import type { AvatarAsset } from "@/src/data/avatarManifest";

export function AvatarAssetMissingNotice({ asset }: { asset: AvatarAsset }) {
  void asset;
  return null;
}
