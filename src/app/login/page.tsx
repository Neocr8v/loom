import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { signIn } from "./actions";
import { siteConfig } from "@/config/site";

export const instant = false;

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;

  return (
    <main className="maker-login-page">
      <Link className="wordmark maker-login-brand" href="/">{siteConfig.name}</Link>
      <section className="maker-login-card">
        <span className="maker-login-icon"><LockKeyhole size={19} /></span>
        <div className="eyebrow muted-eyebrow">MAKER WORKSPACE</div>
        <h1>Preview the maker workspace</h1>
        <p>This is a demo sign-in. Enter any access key to explore the sample seller dashboard.</p>
        <form action={signIn} className="maker-login-form">
          <input type="hidden" name="next" value={typeof params.next === "string" ? params.next : "/dashboard"} />
          <label htmlFor="accessKey">Demo access key</label>
          <input id="accessKey" name="accessKey" type="password" autoComplete="off" maxLength={128} required />
          {params.error && <span className="form-error">Enter any non-empty demo key to continue.</span>}
          <button className="button button-dark" type="submit">Continue to workspace</button>
        </form>
      </section>
    </main>
  );
}
