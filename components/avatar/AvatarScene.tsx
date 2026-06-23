import { ResiAvatar } from "@/components/avatar/ResiAvatar";
import type { AvatarCue } from "@/src/lib/types";

export function AvatarScene({
  character = "See",
  cue = "wave",
  title,
  children
}: {
  character?: "Ree" | "See";
  cue?: AvatarCue;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="avatar-scene">
      <div>
        {title ? <h2>{title}</h2> : null}
        {children}
      </div>
      <ResiAvatar character={character} cue={cue} size="lg" />
    </section>
  );
}
