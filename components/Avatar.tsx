import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import type { AvatarCue } from "@/src/lib/types";

export function Avatar({ character = "See", cue = "wave", className = "avatar-img" }: { character?: "Ree" | "See"; cue?: AvatarCue; className?: string }) {
  return <ResiAvatar character={character} cue={cue} size={className.includes("small") ? "sm" : "xl"} />;
}
