"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { createPlayerAction } from "@/app/dashboard/_actions/players";
import type { FormActionState } from "@/lib/form-state";
import {
  getPlayerFormErrorMessage,
  readPlayerFormValues,
  validatePlayerFormValues,
} from "@/lib/player-form-validation";
import type { FieldErrors } from "@/lib/validations/shared";
import PlayerFormFields, { type TeamOption } from "./PlayerFormFields";

const initialState: FormActionState = { status: "idle" };

type AddPlayerFormProps = {
  teams: TeamOption[];
};

export default function AddPlayerForm({ teams }: AddPlayerFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [clientFieldErrors, setClientFieldErrors] = useState<FieldErrors>({});
  const [state, formAction, isPending] = useActionState<
    FormActionState,
    FormData
  >(createPlayerAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setClientFieldErrors({});
      toast.success(state.message ?? "Player created successfully.");
    }

    if (state.status === "error") {
      toast.error(
        getPlayerFormErrorMessage(
          state.fieldErrors,
          state.message ?? "Unable to create player. Please try again.",
        ),
      );
    }
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const validation = validatePlayerFormValues(
      readPlayerFormValues(new FormData(event.currentTarget)),
    );

    if (!validation.success) {
      event.preventDefault();
      setClientFieldErrors(validation.fieldErrors);
      toast.error(validation.message);
      return;
    }

    setClientFieldErrors({});
  }

  const fieldErrors = isPending
    ? {}
    : Object.keys(clientFieldErrors).length > 0
      ? clientFieldErrors
      : state.status === "error"
        ? (state.fieldErrors ?? {})
        : {};

  if (teams.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">
        <p className="font-semibold text-slate-200">
          Create a team before adding players.
        </p>
        <p className="mt-1">
          Every player must belong to a team. The Add player form will appear
          after your first team is created.
        </p>
        <a
          href="#team-manager"
          className="mt-3 inline-flex rounded-lg border border-emerald-700 px-3 py-2 font-semibold text-emerald-400 transition hover:border-emerald-500 hover:text-emerald-300"
        >
          Create your first team
        </a>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4"
    >
      {Object.keys(clientFieldErrors).length === 0 &&
      state.status === "error" &&
      state.message ? (
        <div
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300"
        >
          {state.message}
        </div>
      ) : null}

      {Object.keys(clientFieldErrors).length === 0 &&
      state.status === "success" &&
      state.message ? (
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
        fieldErrors={fieldErrors}
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
