import Link from "next/link";
import { safeNextPath } from "@/lib/redirect";
import RegisterForm from "./RegisterForm";

type RegisterPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const loginHref =
    nextPath === "/dashboard"
      ? "/login"
      : `/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <div className="space-y-2">
          <Link href="/" className="text-sm font-medium text-emerald-400">
            Criico Cricket
          </Link>
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-sm text-slate-400">
            Register to manage teams, players, and matches.
          </p>
        </div>

        <RegisterForm nextPath={nextPath} />

        <p className="text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href={loginHref}
            className="font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
