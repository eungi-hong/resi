/* eslint-disable @next/next/no-img-element */
import { resolveAvatarAsset, type AvatarCharacter } from "@/src/data/avatarManifest";
import type { AvatarCue } from "@/src/lib/types";
import { AvatarAssetMissingNotice } from "@/components/avatar/AvatarAssetMissingNotice";

export function ResiAvatar({
  character = "See",
  cue = "wave",
  size = "md",
  showMissingNotice = false
}: {
  character?: Exclude<AvatarCharacter, "Custom">;
  cue?: AvatarCue;
  size?: "sm" | "md" | "lg" | "xl";
  showMissingNotice?: boolean;
}) {
  const asset = resolveAvatarAsset(character, cue);
  const isPrimaryAvatar = size === "lg" || size === "xl";
  return (
    <figure className={`resi-avatar resi-avatar-${size}`}>
      <img
        src={asset.filePath}
        alt={asset.altText}
        loading={isPrimaryAvatar ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={isPrimaryAvatar ? "high" : "low"}
      />
      {showMissingNotice ? <AvatarAssetMissingNotice asset={asset} /> : null}
    </figure>
  );
}
