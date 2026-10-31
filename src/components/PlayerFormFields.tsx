import {
  PLAYER_ROLE_LABELS,
  PLAYER_ROLES,
} from "@/lib/player-constants";
import type { FieldErrors } from "@/lib/validations/shared";
import FieldError from "./FieldError";

export type TeamOption = {
  id: string;
  name: string;
};

export type PlayerFormValues = {
  name?: string;
  role?: string;
  basePrice?: string;
  matchesPlayed?: string;
  totalRuns?: string;
  totalWickets?: string;
  teamId?: string;
};

type PlayerFormFieldsProps = {
  teams: TeamOption[];
  values?: PlayerFormValues;
  fieldErrors?: FieldErrors;
  disabled?: boolean;
};

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60";

const labelClassName = "block space-y-2 text-sm font-medium";

export default function PlayerFormFields({
  teams,
  values = {},
  fieldErrors = {},
  disabled = false,
}: PlayerFormFieldsProps) {
  return (
    <>
      <label className={labelClassName}>
        <span>Player name</span>
        <input
          type="text"
          name="name"
          defaultValue={values.name ?? ""}
          placeholder="Player name"
          autoComplete="off"
          required
          minLength={2}
          maxLength={100}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.name)}
          className={inputClassName}
        />
        <FieldError messages={fieldErrors.name} />
      </label>

      <label className={labelClassName}>
        <span>Role</span>
        <select
          name="role"
          defaultValue={values.role ?? "BATTER"}
          required
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.role)}
          className={inputClassName}
        >
          {PLAYER_ROLES.map((role) => (
            <option key={role} value={role}>
              {PLAYER_ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        <FieldError messages={fieldErrors.role} />
      </label>

      <label className={labelClassName}>
        <span>Team</span>
        <select
          name="teamId"
          defaultValue={values.teamId ?? teams[0]?.id ?? ""}
          required
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.teamId)}
          className={inputClassName}
        >
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <FieldError messages={fieldErrors.teamId} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClassName}>
          <span>Base price</span>
          <input
            type="number"
            name="basePrice"
            defaultValue={values.basePrice ?? "0"}
            placeholder="0.00"
            min={0}
            max={9999999999.99}
            step="0.01"
            inputMode="decimal"
            required
            disabled={disabled}
            aria-invalid={Boolean(fieldErrors.basePrice)}
            className={inputClassName}
          />
          <FieldError messages={fieldErrors.basePrice} />
        </label>

        <label className={labelClassName}>
          <span>Matches played</span>
          <input
            type="number"
            name="matchesPlayed"
            defaultValue={values.matchesPlayed ?? "0"}
            min={0}
            max={2147483647}
            step="1"
            inputMode="numeric"
            required
            disabled={disabled}
            aria-invalid={Boolean(fieldErrors.matchesPlayed)}
            className={inputClassName}
          />
          <FieldError messages={fieldErrors.matchesPlayed} />
        </label>

        <label className={labelClassName}>
          <span>Total runs</span>
          <input
            type="number"
            name="totalRuns"
            defaultValue={values.totalRuns ?? "0"}
            min={0}
            max={2147483647}
            step="1"
            inputMode="numeric"
            required
            disabled={disabled}
            aria-invalid={Boolean(fieldErrors.totalRuns)}
            className={inputClassName}
          />
          <FieldError messages={fieldErrors.totalRuns} />
        </label>

        <label className={labelClassName}>
          <span>Total wickets</span>
          <input
            type="number"
            name="totalWickets"
            defaultValue={values.totalWickets ?? "0"}
            min={0}
            max={2147483647}
            step="1"
            inputMode="numeric"
            required
            disabled={disabled}
            aria-invalid={Boolean(fieldErrors.totalWickets)}
            className={inputClassName}
          />
          <FieldError messages={fieldErrors.totalWickets} />
        </label>
      </div>
    </>
  );
}
