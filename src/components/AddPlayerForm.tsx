"use client";

import { useActionState, useEffect, useRef } from "react";
import { createPlayerAction } from "@/app/dashboard/_actions/players";
import type { FormActionState } from "@/lib/form-state";
import PlayerFormFields, { type TeamOption } from "./PlayerFormFields";

const initialState: FormActionState = { status: "idle" };

type AddPlayerFormProps = {
  teams: TeamOption[];
};

export default function AddPlayerForm({ teams }: AddPlayerFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState<
    FormActionState,
    FormData
  >(createPlayerAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  if (teams.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">
        Create a team first, then add players to it.{" "}
        <a
          href="#team-manager"
          className="font-semibold text-emerald-400 hover:text-emerald-300"
        >
          Go to teams
        </a>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300"
        >
          {state.message}
        </div>
      ) : null}

      {state.status === "success" && state.message ? (
        <div
          role="status"
          className="rounded-lg border border-emerald-900 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-300"
        >
          {state.message}
        </div>
      ) : null}

      <PlayerFormFields
        teams={teams}
        values={state.values}
        fieldErrors={state.fieldErrors}
        disabled={isPending}
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Adding player..." : "Add player"}
      </button>
    </form>
  );
}
