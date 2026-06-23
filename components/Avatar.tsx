import { resolveAvatarAsset } from "@/src/data/avatarManifest";
import type { AvatarCue } from "@/src/lib/types";

export function Avatar({ character = "See", cue = "wave", className = "avatar-img" }: { character?: "Ree" | "See"; cue?: AvatarCue; className?: string }) {
  const asset = resolveAvatarAsset(character, cue);
  return <img className={className} src={asset.filePath} alt={asset.altText} />;
}
