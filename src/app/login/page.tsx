import Link from "next/link";
import { safeNextPath } from "@/lib/redirect";
import LoginForm from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const registerHref =
    nextPath === "/dashboard"
      ? "/register"
      : `/register?next=${encodeURIComponent(nextPath)}`;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <div className="space-y-2">
          <Link href="/" className="text-sm font-medium text-emerald-400">
            Criico Cricket
          </Link>
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-slate-400">
            Enter your account details to access the dashboard.
          </p>
        </div>

        <LoginForm nextPath={nextPath} />

        <p className="text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href={registerHref}
            className="font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
