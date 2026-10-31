"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { FieldErrors } from "@/lib/validations/shared";
import PlayerFormFields, { type TeamOption } from "./PlayerFormFields";

type EditablePlayer = {
  id: string;
  name: string;
  role: string;
  basePrice: string;
  matchesPlayed: number;
  totalRuns: number;
  totalWickets: number;
  teamId: string;
};

type EditPlayerFormProps = {
  player: EditablePlayer;
  teams: TeamOption[];
};

type PlayerApiResponse = {
  error?: string;
  fieldErrors?: FieldErrors;
};

export default function EditPlayerForm({
  player,
  teams,
}: EditPlayerFormProps) {
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
      const response = await fetch(`/api/players/${player.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          role: String(formData.get("role") ?? ""),
          basePrice: String(formData.get("basePrice") ?? ""),
          matchesPlayed: String(formData.get("matchesPlayed") ?? ""),
          totalRuns: String(formData.get("totalRuns") ?? ""),
          totalWickets: String(formData.get("totalWickets") ?? ""),
          teamId: String(formData.get("teamId") ?? ""),
        }),
      });

      const data = (await response
        .json()
        .catch(() => ({}))) as PlayerApiResponse;

      if (!response.ok) {
        setError(data.error ?? "Unable to update player.");
        setFieldErrors(data.fieldErrors ?? {});
        return;
      }

      router.push(`/dashboard/players/${player.id}`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      ) : null}

      <PlayerFormFields
        teams={teams}
        values={{
          name: player.name,
          role: player.role,
          basePrice: player.basePrice,
          matchesPlayed: String(player.matchesPlayed),
          totalRuns: String(player.totalRuns),
          totalWickets: String(player.totalWickets),
          teamId: player.teamId,
        }}
        fieldErrors={fieldErrors}
        disabled={isSubmitting}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving changes..." : "Save changes"}
        </button>
        <Link
          href={`/dashboard/players/${player.id}`}
          className="rounded-lg border border-slate-700 px-5 py-2.5 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
