import type { AvatarAsset } from "@/src/data/avatarManifest";

export function AvatarAssetMissingNotice({ asset }: { asset: AvatarAsset }) {
  if (process.env.NODE_ENV === "production" || !asset.missing) return null;
  return (
    <p className="avatar-missing" role="note">
      Missing avatar asset: {asset.characterName} / {asset.avatarCue}. Please upload {asset.expectedPath}.
    </p>
  );
}
