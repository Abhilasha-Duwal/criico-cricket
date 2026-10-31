"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import {
  PLAYER_ROLE_BADGE_CLASSES,
  PLAYER_ROLE_LABELS,
  type PlayerRoleValue,
} from "@/lib/player-constants";
import type { FieldErrors } from "@/lib/validations/shared";

export type MatchTeamOption = {
  id: string;
  name: string;
};

export type MatchPlayerOption = {
  id: string;
  name: string;
  role: PlayerRoleValue;
  teamId: string;
};

type MatchRecorderProps = {
  teams: MatchTeamOption[];
  players: MatchPlayerOption[];
};

type SubmissionMessage = {
  type: "success" | "error";
  text: string;
};

type MatchResponse = {
  error?: string;
  fieldErrors?: FieldErrors;
  replayed?: boolean;
};

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50";

const labelClassName = "block space-y-2 text-sm font-medium";

function parseStat(value: string): number | null {
  const trimmed = value.trim();

  if (trimmed === "") {
    return 0;
  }

  const parsed = Number(trimmed);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

type TeamRosterProps = {
  team: MatchTeamOption;
  players: MatchPlayerOption[];
  selected: Record<string, boolean>;
  runs: Record<string, string>;
  wickets: Record<string, string>;
  disabled: boolean;
  onToggle: (playerId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onRunsChange: (playerId: string, value: string) => void;
  onWicketsChange: (playerId: string, value: string) => void;
};

function TeamRoster({
  team,
  players,
  selected,
  runs,
  wickets,
  disabled,
  onToggle,
  onSelectAll,
  onRunsChange,
  onWicketsChange,
}: TeamRosterProps) {
  const allSelected =
    players.length > 0 && players.every((player) => selected[player.id]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-100">{team.name}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {players.length} eligible player{players.length === 1 ? "" : "s"}
          </p>
        </div>
        {players.length > 0 ? (
          <button
            type="button"
            onClick={() => onSelectAll(!allSelected)}
            disabled={disabled}
            className="text-xs font-semibold text-emerald-400 transition hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
        ) : null}
      </div>

      {players.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-slate-700 px-3 py-4 text-sm text-slate-400">
          This team has no players yet.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {players.map((player) => {
            const isSelected = Boolean(selected[player.id]);

            return (
              <div
                key={player.id}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <label className="flex min-w-0 items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(event) =>
                        onToggle(player.id, event.target.checked)
                      }
                      disabled={disabled}
                      className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-100">
                        {player.name}
                      </span>
                      <span
                        className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${PLAYER_ROLE_BADGE_CLASSES[player.role]}`}
                      >
                        {PLAYER_ROLE_LABELS[player.role]}
                      </span>
                    </span>
                  </label>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <label className="block text-xs font-medium text-slate-400">
                    <span className="mb-1 block">Runs</span>
                    <input
                      type="number"
                      min={0}
                      max={2_147_483_647}
                      step={1}
                      inputMode="numeric"
                      value={runs[player.id] ?? "0"}
                      onChange={(event) =>
                        onRunsChange(player.id, event.target.value)
                      }
                      disabled={disabled || !isSelected}
                      aria-label={`${player.name} runs`}
                      className={inputClassName}
                    />
                  </label>

                  <label className="block text-xs font-medium text-slate-400">
                    <span className="mb-1 block">Wickets</span>
                    <input
                      type="number"
                      min={0}
                      max={2_147_483_647}
                      step={1}
                      inputMode="numeric"
                      value={wickets[player.id] ?? "0"}
                      onChange={(event) =>
                        onWicketsChange(player.id, event.target.value)
                      }
                      disabled={disabled || !isSelected}
                      aria-label={`${player.name} wickets`}
                      className={inputClassName}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function MatchRecorder({
  teams,
  players,
}: MatchRecorderProps) {
  const router = useRouter();
  const requestIdRef = useRef<string | null>(null);
  const [teamAId, setTeamAId] = useState(() => teams[0]?.id ?? "");
  const [teamBId, setTeamBId] = useState(() => teams[1]?.id ?? "");
  const [winnerId, setWinnerId] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [runs, setRuns] = useState<Record<string, string>>({});
  const [wickets, setWickets] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<SubmissionMessage | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const teamA = teams.find((team) => team.id === teamAId);
  const teamB = teams.find((team) => team.id === teamBId);
  const teamAPlayers = players.filter((player) => player.teamId === teamAId);
  const teamBPlayers = players.filter((player) => player.teamId === teamBId);
  const eligiblePlayers = [...teamAPlayers, ...teamBPlayers];
  const fieldErrorMessages = Object.values(fieldErrors).flat();

  function handleTeamChange(side: "A" | "B", value: string) {
    if (side === "A") {
      setTeamAId(value);

      if (value === teamBId) {
        setTeamBId("");
      }

      if (winnerId && winnerId !== value && winnerId !== teamBId) {
        setWinnerId("");
      }
    } else {
      setTeamBId(value);

      if (value === teamAId) {
        setTeamAId("");
      }

      if (winnerId && winnerId !== value && winnerId !== teamAId) {
        setWinnerId("");
      }
    }

    setMessage(null);
    setFieldErrors({});
  }

  function togglePlayer(playerId: string, checked: boolean) {
    setSelected((current) => ({ ...current, [playerId]: checked }));
  }

  function setTeamSelection(teamPlayers: MatchPlayerOption[], checked: boolean) {
    setSelected((current) => {
      const next = { ...current };

      for (const player of teamPlayers) {
        next[player.id] = checked;
      }

      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setMessage(null);
    setFieldErrors({});

    if (!teamAId || !teamBId) {
      setMessage({ type: "error", text: "Select both participating teams." });
      return;
    }

    if (teamAId === teamBId) {
      setMessage({
        type: "error",
        text: "A team cannot play against itself.",
      });
      return;
    }

    if (winnerId && winnerId !== teamAId && winnerId !== teamBId) {
      setMessage({
        type: "error",
        text: "The winner must be one of the participating teams.",
      });
      return;
    }

    const selectedPlayers = eligiblePlayers.filter(
      (player) => selected[player.id],
    );

    if (selectedPlayers.length === 0) {
      setMessage({
        type: "error",
        text: "Select at least one player and enter their performance.",
      });
      return;
    }

    const performances: Array<{
      playerId: string;
      runs: number;
      wickets: number;
    }> = [];

    for (const player of selectedPlayers) {
      const playerRuns = parseStat(runs[player.id] ?? "0");
      const playerWickets = parseStat(wickets[player.id] ?? "0");

      if (playerRuns === null || playerWickets === null) {
        setMessage({
          type: "error",
          text: `Enter non-negative whole numbers for ${player.name}.`,
        });
        return;
      }

      performances.push({
        playerId: player.id,
        runs: playerRuns,
        wickets: playerWickets,
      });
    }

    if (!requestIdRef.current) {
      requestIdRef.current = crypto.randomUUID();
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          clientRequestId: requestIdRef.current,
          teamAId,
          teamBId,
          winnerId: winnerId || null,
          performances,
        }),
      });
      const data = (await response
        .json()
        .catch(() => ({}))) as MatchResponse;

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.error ?? "Unable to record match. Please try again.",
        });
        setFieldErrors(data.fieldErrors ?? {});

        if (response.status === 409) {
          requestIdRef.current = null;
        }

        return;
      }

      setMessage({
        type: "success",
        text: data.replayed
          ? "This match was already recorded. Player statistics were not updated again."
          : "Match recorded and player statistics updated.",
      });
      requestIdRef.current = null;
      setSelected({});
      setRuns({});
      setWickets({});
      setWinnerId("");
      router.refresh();
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (teams.length < 2) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-10 text-center">
        <p className="font-semibold text-slate-200">
          Create at least two teams to record a match.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          A match needs two different participating teams.
        </p>
        <a
          href="/dashboard#team-manager"
          className="mt-5 inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Go to teams
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {message ? (
        <div
          role={message.type === "error" ? "alert" : "status"}
          className={
            message.type === "error"
              ? "rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300"
              : "rounded-lg border border-emerald-900 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-300"
          }
        >
          {message.text}
        </div>
      ) : null}

      {fieldErrorMessages.length > 0 ? (
        <ul className="space-y-1 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {fieldErrorMessages.map((error, index) => (
            <li key={`${error}-${index}`}>{error}</li>
          ))}
        </ul>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <label className={labelClassName}>
          <span>Team A</span>
          <select
            value={teamAId}
            onChange={(event) => handleTeamChange("A", event.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.teamAId)}
            className={inputClassName}
          >
            <option value="">Select team</option>
            {teams.map((team) => (
              <option
                key={team.id}
                value={team.id}
                disabled={team.id === teamBId}
              >
                {team.name}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClassName}>
          <span>Team B</span>
          <select
            value={teamBId}
            onChange={(event) => handleTeamChange("B", event.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.teamBId)}
            className={inputClassName}
          >
            <option value="">Select team</option>
            {teams.map((team) => (
              <option
                key={team.id}
                value={team.id}
                disabled={team.id === teamAId}
              >
                {team.name}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClassName}>
          <span>Winner</span>
          <select
            value={winnerId}
            onChange={(event) => setWinnerId(event.target.value)}
            disabled={isSubmitting || !teamA || !teamB}
            aria-invalid={Boolean(fieldErrors.winnerId)}
            className={inputClassName}
          >
            <option value="">No winner</option>
            {teamA ? <option value={teamA.id}>{teamA.name}</option> : null}
            {teamB ? <option value={teamB.id}>{teamB.name}</option> : null}
          </select>
        </label>
      </div>

      {teamA && teamB ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <TeamRoster
            team={teamA}
            players={teamAPlayers}
            selected={selected}
            runs={runs}
            wickets={wickets}
            disabled={isSubmitting}
            onToggle={togglePlayer}
            onSelectAll={(checked) =>
              setTeamSelection(teamAPlayers, checked)
            }
            onRunsChange={(playerId, value) =>
              setRuns((current) => ({ ...current, [playerId]: value }))
            }
            onWicketsChange={(playerId, value) =>
              setWickets((current) => ({ ...current, [playerId]: value }))
            }
          />

          <TeamRoster
            team={teamB}
            players={teamBPlayers}
            selected={selected}
            runs={runs}
            wickets={wickets}
            disabled={isSubmitting}
            onToggle={togglePlayer}
            onSelectAll={(checked) =>
              setTeamSelection(teamBPlayers, checked)
            }
            onRunsChange={(playerId, value) =>
              setRuns((current) => ({ ...current, [playerId]: value }))
            }
            onWicketsChange={(playerId, value) =>
              setWickets((current) => ({ ...current, [playerId]: value }))
            }
          />
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-700 px-4 py-6 text-sm text-slate-400">
          Select both teams to show their eligible players.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
        <p className="text-xs text-slate-500">
          Each selected player receives one match appearance. Runs and wickets
          are added to their totals.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Recording match..." : "Record match"}
        </button>
      </div>
    </form>
  );
}
