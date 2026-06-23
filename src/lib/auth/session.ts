import { cookies } from "next/headers";
import { getDemoUserByRole, getDemoUserByUsername } from "@/src/lib/auth/demoAuth";
import { getDemoUser } from "@/src/lib/data/dbBacked";
import { hasDatabaseUrl } from "@/src/lib/db";
import type { DemoUser, Role } from "@/src/lib/types";

export async function getCurrentDemoUser(fallbackRole: Role = "YOUTH"): Promise<DemoUser> {
  const cookieStore = await cookies();
  const username = cookieStore.get("resi_demo_user")?.value;
  if (hasDatabaseUrl) {
    return getDemoUser(username ?? (fallbackRole === "YOUTH" ? "asha" : fallbackRole === "PARENT" ? "parent" : "admin"), fallbackRole);
  }
  return (username ? getDemoUserByUsername(username) : undefined) ?? getDemoUserByRole(fallbackRole);
}
