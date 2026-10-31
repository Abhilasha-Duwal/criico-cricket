"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import type { FormActionState } from "@/lib/form-state";
import { createPlayer, TeamNotFoundError } from "@/lib/players";
import { playerInputSchema } from "@/lib/validations/player";
import { toFieldErrors } from "@/lib/validations/shared";

export async function createPlayerAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  if (!(await getCurrentUser())) {
    return {
      status: "error",
      message: "Your session has expired. Please sign in again.",
    };
  }

  const values = {
    name: String(formData.get("name") ?? ""),
    role: String(formData.get("role") ?? ""),
    basePrice: String(formData.get("basePrice") ?? ""),
    matchesPlayed: String(formData.get("matchesPlayed") ?? ""),
    totalRuns: String(formData.get("totalRuns") ?? ""),
    totalWickets: String(formData.get("totalWickets") ?? ""),
    teamId: String(formData.get("teamId") ?? ""),
  };

  const parsed = playerInputSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  try {
    await createPlayer(parsed.data);
  } catch (error) {
    if (error instanceof TeamNotFoundError) {
      return {
        status: "error",
        message: "Selected team does not exist.",
        fieldErrors: { teamId: ["Select an existing team."] },
        values,
      };
    }

    console.error("Create player action failed:", error);

    return {
      status: "error",
      message: "Unable to create player. Please try again.",
      values,
    };
  }

  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Player created successfully.",
    submittedAt: Date.now(),
  };
}
