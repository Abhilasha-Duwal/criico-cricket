"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTeamAction } from "@/app/dashboard/_actions/teams";
import type { FormActionState } from "@/lib/form-state";
import FieldError from "./FieldError";

const initialState: FormActionState = { status: "idle" };

export default function AddTeamForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState<
    FormActionState,
    FormData
  >(createTeamAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-300"
        >
          {state.message}
        </div>
      ) : null}

      {state.status === "success" && state.message ? (
        <div
          role="status"
          className="rounded-lg border border-emerald-900 bg-emerald-950/50 px-3 py-2 text-sm text-emerald-300"
        >
          {state.message}
        </div>
      ) : null}

      <label className="block space-y-2 text-sm font-medium">
        <span>Team name</span>
        <input
          type="text"
          name="name"
          defaultValue={state.values?.name ?? ""}
          placeholder="e.g. Kathmandu Kings"
          autoComplete="off"
          required
          minLength={2}
          maxLength={80}
          disabled={isPending}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <FieldError messages={state.fieldErrors?.name} />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg border border-slate-700 px-4 py-2.5 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating team..." : "Create team"}
      </button>
    </form>
  );
}
