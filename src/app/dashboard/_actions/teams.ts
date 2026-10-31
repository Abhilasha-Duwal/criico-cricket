"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import type { FormActionState } from "@/lib/form-state";
import { createTeam, DuplicateTeamError } from "@/lib/teams";
import { teamInputSchema } from "@/lib/validations/team";
import { toFieldErrors } from "@/lib/validations/shared";

export async function createTeamAction(
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
  };

  const parsed = teamInputSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  try {
    await createTeam(parsed.data.name);
  } catch (error) {
    if (error instanceof DuplicateTeamError) {
      return {
        status: "error",
        message: "A team with this name already exists.",
        fieldErrors: { name: ["A team with this name already exists."] },
        values,
      };
    }

    console.error("Create team action failed:", error);

    return {
      status: "error",
      message: "Unable to create team. Please try again.",
      values,
    };
  }

  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Team created successfully.",
    submittedAt: Date.now(),
  };
}
