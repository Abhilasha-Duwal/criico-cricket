"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import FieldError from "@/components/FieldError";
import type { FieldErrors } from "@/lib/validations/shared";

type AuthResponse = {
  error?: string;
  fieldErrors?: FieldErrors;
};

type RegisterFormProps = {
  nextPath: string;
};

export default function RegisterForm({ nextPath }: RegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as AuthResponse;

      if (!response.ok) {
        setError(data.error ?? "Unable to create your account.");
        setFieldErrors(data.fieldErrors ?? {});
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      ) : null}

      <label className="block space-y-2 text-sm font-medium">
        <span>Name</span>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          autoComplete="name"
          required
          disabled={isSubmitting}
          aria-invalid={Boolean(fieldErrors.name)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <FieldError messages={fieldErrors.name} />
      </label>

      <label className="block space-y-2 text-sm font-medium">
        <span>Email</span>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={isSubmitting}
          aria-invalid={Boolean(fieldErrors.email)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <FieldError messages={fieldErrors.email} />
      </label>

      <label className="block space-y-2 text-sm font-medium">
        <span>Password</span>
        <input
          type="password"
          name="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          disabled={isSubmitting}
          aria-invalid={Boolean(fieldErrors.password)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <FieldError messages={fieldErrors.password} />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
