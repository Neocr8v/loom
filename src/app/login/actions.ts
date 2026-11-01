"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dashboardCookieName } from "@/config/dashboard";

export async function signIn(formData: FormData) {
  const candidate = String(formData.get("accessKey") ?? "");
  if (!candidate.trim() || candidate.trim().length > 128) redirect("/login?error=1");

  const nextPath = String(formData.get("next") ?? "/dashboard");
  const safeNextPath = nextPath.startsWith("/dashboard") ? nextPath : "/dashboard";
  const jar = await cookies();
  jar.set(dashboardCookieName, candidate.trim(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/dashboard",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(safeNextPath);
}
