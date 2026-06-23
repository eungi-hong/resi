import { demoAlerts, demoUsers, educationMaterials, initialMetrics, quizzes } from "../src/data/demoData";
import { avatarManifest } from "../src/data/avatarManifest";

console.log("resi demo seed preview");
console.log({
  users: demoUsers.length,
  materials: educationMaterials.length,
  quizzes: quizzes.length,
  metricYouth: Object.keys(initialMetrics).length,
  alerts: demoAlerts.length,
  avatars: avatarManifest.length
});
console.log("The MVP runs from in-memory seed data. Wire Prisma Client writes when moving to persistent demo storage.");
