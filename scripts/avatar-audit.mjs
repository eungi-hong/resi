import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const characters = ["ree", "see"];
const cues = ["idle", "wave", "thinking", "explaining", "pointing", "reading", "quiz", "celebrate", "concerned", "listening", "writing", "resource", "safe_escalation"];

const required = characters.flatMap((character) => cues.map((cue) => `public/avatars/${character}/${character}_${cue}.png`));
const present = required.filter((file) => fs.existsSync(path.join(root, file)));
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));

console.log("resi avatar audit");
console.log(`Required: ${required.length}`);
console.log(`Present: ${present.length}`);
console.log(`Missing: ${missing.length}`);
console.log("\nPresent assets:");
present.forEach((file) => console.log(`- ${file}`));
console.log("\nMissing assets:");
missing.forEach((file) => console.log(`- ${file}`));
console.log("\nSuggested next uploads:");
missing.slice(0, 8).forEach((file) => {
  const [, , character, filename] = file.split("/");
  const pose = filename.replace(`${character}_`, "").replace(".png", "").replace("_", " ");
  console.log(`- ${character[0].toUpperCase()}${character.slice(1)} ${pose}: ${file}`);
});
