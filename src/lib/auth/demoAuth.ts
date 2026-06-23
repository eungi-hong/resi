import { demoUsers } from "@/src/data/demoData";
import type { DemoUser, Role } from "@/src/lib/types";

export function getDemoUserByRole(role: Role): DemoUser {
  return demoUsers.find((user) => user.role === role)!;
}

export function getDemoUserByUsername(username: string): DemoUser | undefined {
  return demoUsers.find((user) => user.demoUsername.toLowerCase() === username.toLowerCase());
}

export function canAccessYouth(user: DemoUser, youthId: string): boolean {
  if (user.role === "ADMIN") return false;
  if (user.role === "YOUTH") return user.id === youthId;
  return user.linkedYouthIds?.includes(youthId) ?? false;
}

export function canViewAdminAnalytics(user: DemoUser): boolean {
  return user.role === "ADMIN";
}
