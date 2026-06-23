import { cookies } from "next/headers";
import { getDemoUserByRole, getDemoUserByUsername } from "@/src/lib/auth/demoAuth";
import type { DemoUser, Role } from "@/src/lib/types";

export async function getCurrentDemoUser(fallbackRole: Role = "YOUTH"): Promise<DemoUser> {
  const cookieStore = await cookies();
  const username = cookieStore.get("resi_demo_user")?.value;
  return (username ? getDemoUserByUsername(username) : undefined) ?? getDemoUserByRole(fallbackRole);
}
