import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dashboardCookieName } from "@/config/dashboard";

export { dashboardCookieName } from "@/config/dashboard";

export async function dashboardSessionIsValid() {
  const jar = await cookies();
  const token = jar.get(dashboardCookieName)?.value ?? "";
  return token.trim().length > 0;
}

export async function requireDashboardSession() {
  if (!(await dashboardSessionIsValid())) redirect("/login");
}
