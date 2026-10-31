import {
  NEGATIVE_TOTAL_RUNS_MESSAGE,
  playerInputSchema,
  type PlayerInput,
} from "@/lib/validations/player";
import { toFieldErrors, type FieldErrors } from "@/lib/validations/shared";

export type PlayerFormValues = {
  name: string;
  role: string;
  basePrice: string;
  matchesPlayed: string;
  totalRuns: string;
  totalWickets: string;
  teamId: string;
};

export type PlayerFormValidationResult =
  | {
      success: true;
      data: PlayerInput;
    }
  | {
      success: false;
      fieldErrors: FieldErrors;
      message: string;
    };

export function readPlayerFormValues(formData: FormData): PlayerFormValues {
  return {
    name: String(formData.get("name") ?? ""),
    role: String(formData.get("role") ?? ""),
    basePrice: String(formData.get("basePrice") ?? ""),
    matchesPlayed: String(formData.get("matchesPlayed") ?? ""),
    totalRuns: String(formData.get("totalRuns") ?? ""),
    totalWickets: String(formData.get("totalWickets") ?? ""),
    teamId: String(formData.get("teamId") ?? ""),
  };
}

export function getPlayerFormErrorMessage(
  fieldErrors: FieldErrors | undefined,
  fallback: string,
): string {
  if (fieldErrors?.totalRuns?.includes(NEGATIVE_TOTAL_RUNS_MESSAGE)) {
    return NEGATIVE_TOTAL_RUNS_MESSAGE;
  }

  return fallback;
}

export function validatePlayerFormValues(
  values: PlayerFormValues,
): PlayerFormValidationResult {
  const parsed = playerInputSchema.safeParse(values);

  if (parsed.success) {
    return {
      success: true,
      data: parsed.data,
    };
  }

  const fieldErrors = toFieldErrors(parsed.error);

  return {
    success: false,
    fieldErrors,
    message: getPlayerFormErrorMessage(
      fieldErrors,
      "Please fix the highlighted fields.",
    ),
  };
}
