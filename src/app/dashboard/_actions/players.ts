"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import type { FormActionState } from "@/lib/form-state";
import {
  readPlayerFormValues,
  validatePlayerFormValues,
} from "@/lib/player-form-validation";
import { createPlayer, TeamNotFoundError } from "@/lib/players";

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

  const values = readPlayerFormValues(formData);
  const parsed = validatePlayerFormValues(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.message,
      fieldErrors: parsed.fieldErrors,
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
