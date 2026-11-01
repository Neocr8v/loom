import { NextResponse, type NextRequest } from "next/server";
import { dashboardCookieName } from "@/config/dashboard";

export function proxy(request: NextRequest) {
  if (request.cookies.has(dashboardCookieName)) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: "/dashboard/:path*",
};
