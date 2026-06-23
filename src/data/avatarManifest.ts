import type { AvatarCue } from "@/src/lib/types";

export type AvatarCharacter = "Ree" | "See" | "Custom";

export type AvatarAsset = {
  id: string;
  characterName: AvatarCharacter;
  displayName: string;
  filePath: string;
  fallbackPath: string;
  expectedPath: string;
  pose: string;
  emotion: string;
  action: string;
  genderPresentation: string;
  agePresentation: string;
  avatarCue: AvatarCue;
  recommendedContexts: string[];
  altText: string;
  missing: boolean;
  suggestedFilename?: string;
};

export const requiredAvatarCues: AvatarCue[] = [
  "idle",
  "wave",
  "thinking",
  "explaining",
  "pointing",
  "reading",
  "quiz",
  "celebrate",
  "concerned",
  "listening",
  "writing",
  "resource",
  "safe_escalation"
];

const presentRaster = new Set([
  "ree_explaining",
  "ree_reading",
  "ree_thinking",
  "ree_waving",
  "ree_welcoming",
  "see_explaining",
  "see_thinking",
  "see_waving",
  "see_welcoming",
  "see_writing"
]);

const svgFallback = new Set([
  "ree_idle",
  "ree_wave",
  "ree_thinking",
  "ree_explaining",
  "ree_quiz",
  "ree_celebrate",
  "ree_concerned",
  "ree_resource",
  "see_idle",
  "see_wave",
  "see_thinking",
  "see_explaining",
  "see_quiz",
  "see_celebrate",
  "see_concerned",
  "see_resource"
]);

const cueAliases: Partial<Record<AvatarCue, string>> = {
  wave: "waving",
  parent_guidance: "waving",
  dashboard_pointer: "explaining"
};

function emotionFor(cue: AvatarCue) {
  if (cue === "concerned" || cue === "safe_escalation") return "gentle concern";
  if (cue === "celebrate") return "proud";
  if (cue === "quiz") return "encouraging";
  if (cue === "listening") return "attentive";
  return "friendly";
}

function buildAsset(characterName: "Ree" | "See", cue: AvatarCue): AvatarAsset {
  const character = characterName.toLowerCase();
  const expectedKey = `${character}_${cue}`;
  const aliasKey = `${character}_${cueAliases[cue] ?? cue}`;
  const expectedPath = `/avatars/${character}/${expectedKey}.png`;
  const hasExpectedRaster = presentRaster.has(expectedKey);
  const hasAliasRaster = presentRaster.has(aliasKey);
  const hasSvg = svgFallback.has(expectedKey);
  const filePath = hasExpectedRaster
    ? expectedPath
    : hasAliasRaster
      ? `/avatars/${character}/${aliasKey}.png`
      : hasSvg
        ? `/avatars/${character}/${expectedKey}.svg`
        : "/avatars/fallback/avatar_placeholder.svg";

  return {
    id: `${character}_${cue}`,
    characterName,
    displayName: characterName,
    filePath,
    fallbackPath: filePath,
    expectedPath,
    pose: cue,
    emotion: emotionFor(cue),
    action: cue,
    genderPresentation: characterName === "Ree" ? "masculine_or_neutral" : "feminine_or_neutral",
    agePresentation: "youthful",
    avatarCue: cue,
    recommendedContexts: cue === "wave" ? ["onboarding", "greeting"] : ["chat", "learning", "dashboard"],
    altText: `${characterName}, a friendly resi avatar, ${cue.replace("_", " ")}`,
    missing: !hasExpectedRaster,
    suggestedFilename: `${character}_${cue}.png`
  };
}

export const avatarManifest: AvatarAsset[] = [
  ...requiredAvatarCues.flatMap((cue) => [buildAsset("Ree", cue), buildAsset("See", cue)]),
  {
    id: "avatar_placeholder",
    characterName: "Custom",
    displayName: "resi avatar",
    filePath: "/avatars/fallback/avatar_placeholder.svg",
    fallbackPath: "/avatars/fallback/avatar_placeholder.svg",
    expectedPath: "/avatars/fallback/avatar_placeholder.png",
    pose: "idle",
    emotion: "friendly",
    action: "fallback",
    genderPresentation: "neutral",
    agePresentation: "youthful",
    avatarCue: "idle",
    recommendedContexts: ["fallback"],
    altText: "A friendly resi avatar placeholder",
    missing: false
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

export function getMissingAvatarAssets() {
  return avatarManifest.filter((asset) => asset.characterName !== "Custom" && asset.missing);
}
