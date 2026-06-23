import type { AvatarCue } from "@/src/lib/types";

export type AvatarAsset = {
  id: string;
  characterName: "Ree" | "See" | "Custom";
  displayName: string;
  filePath: string;
  pose: string;
  emotion: string;
  action: string;
  genderPresentation: string;
  agePresentation: string;
  avatarCue: AvatarCue;
  recommendedContexts: string[];
  altText: string;
};

const cues: AvatarCue[] = ["idle", "wave", "thinking", "explaining", "celebrate", "concerned", "resource", "quiz"];

export const avatarManifest: AvatarAsset[] = [
  ...cues.map((cue) => ({
    id: `ree_${cue}`,
    characterName: "Ree" as const,
    displayName: "Ree",
    filePath: `/avatars/ree/ree_${cue}.svg`,
    pose: cue,
    emotion: cue === "concerned" ? "gentle concern" : cue === "celebrate" ? "proud" : "friendly",
    action: cue,
    genderPresentation: "masculine_or_neutral",
    agePresentation: "youthful",
    avatarCue: cue,
    recommendedContexts: cue === "wave" ? ["onboarding", "greeting"] : ["chat", "learning"],
    altText: `Ree, a friendly resi avatar, ${cue.replace("_", " ")}`
  })),
  ...cues.map((cue) => ({
    id: `see_${cue}`,
    characterName: "See" as const,
    displayName: "See",
    filePath: `/avatars/see/see_${cue}.svg`,
    pose: cue,
    emotion: cue === "concerned" ? "gentle concern" : cue === "celebrate" ? "proud" : "curious",
    action: cue,
    genderPresentation: "feminine_or_neutral",
    agePresentation: "youthful",
    avatarCue: cue,
    recommendedContexts: cue === "quiz" ? ["quiz", "teach-back"] : ["chat", "learning"],
    altText: `See, a friendly resi avatar, ${cue.replace("_", " ")}`
  })),
  {
    id: "avatar_placeholder",
    characterName: "Custom",
    displayName: "resi avatar",
    filePath: "/avatars/fallback/avatar_placeholder.svg",
    pose: "idle",
    emotion: "friendly",
    action: "fallback",
    genderPresentation: "neutral",
    agePresentation: "youthful",
    avatarCue: "idle",
    recommendedContexts: ["fallback"],
    altText: "A friendly resi avatar placeholder"
  }
];

export function resolveAvatarAsset(character: "Ree" | "See", cue: AvatarCue): AvatarAsset {
  return (
    avatarManifest.find((asset) => asset.characterName === character && asset.avatarCue === cue) ??
    avatarManifest.find((asset) => asset.characterName === character && asset.avatarCue === "idle") ??
    avatarManifest.find((asset) => asset.avatarCue === cue) ??
    avatarManifest.find((asset) => asset.id === "avatar_placeholder")!
  );
}
