# Avatar Workflow

Avatar images are named assets selected through `src/data/avatarManifest.ts`.

## Folder Convention

- `public/avatars/ree/ree_idle.svg`
- `public/avatars/ree/ree_wave.svg`
- `public/avatars/see/see_thinking.svg`
- `public/avatars/fallback/avatar_placeholder.svg`

Use stable filenames: `{character}_{cue}.{ext}`. Current cues are `idle`, `wave`, `thinking`, `explaining`, `celebrate`, `concerned`, `resource`, `quiz`, and `safe_escalation`.

## Adding Assets

1. Place the image in the correct character folder.
2. Add or update metadata in `src/data/avatarManifest.ts`.
3. Include pose, emotion, action, recommended contexts, alt text, age presentation, gender presentation, and `avatarCue`.
4. The app will select by cue. If the exact image is missing it falls back to same-character idle, then same-cue other character, then placeholder.

Agents should ask for the exact missing filename, update the manifest, and avoid vague references like “the image from earlier.”
