import { NextRequest, NextResponse } from "next/server";
import { getDemoUserByUsername } from "@/src/lib/auth/demoAuth";

const protectedPortals = [
  { prefix: "/youth", role: "YOUTH" },
  { prefix: "/parent", role: "PARENT" },
  { prefix: "/admin", role: "ADMIN" }
] as const;

export function middleware(request: NextRequest) {
  const portal = protectedPortals.find((item) => request.nextUrl.pathname.startsWith(item.prefix));
  if (!portal) return NextResponse.next();

  const username = request.cookies.get("resi_demo_user")?.value;
  const user = username ? getDemoUserByUsername(username) : undefined;

  if (!user) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  }

  if (user.role !== portal.role) {
    return NextResponse.redirect(new URL(user.role === "YOUTH" ? "/youth" : user.role === "PARENT" ? "/parent" : "/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/youth/:path*", "/parent/:path*", "/admin/:path*"]
};
