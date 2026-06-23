import { NextRequest, NextResponse } from "next/server";
import { getDemoUserByUsername } from "@/src/lib/auth/demoAuth";

function homeForRole(role: string) {
  if (role === "YOUTH") return "/youth";
  if (role === "PARENT") return "/parent";
  return "/admin";
}

export function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") ?? "asha";
  const requestedNext = request.nextUrl.searchParams.get("next");
  const user = getDemoUserByUsername(username);

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.redirect(new URL(requestedNext || homeForRole(user.role), request.url));
  response.cookies.set("resi_demo_user", user.demoUsername, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return response;
}
