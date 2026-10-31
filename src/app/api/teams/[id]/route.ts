import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { deleteTeam } from "@/lib/teams";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await getCurrentUser())) {
    return apiError("Authentication required.", 401);
  }

  const { id } = await params;

  try {
    const result = await deleteTeam(id);

    if (result.status === "not_found") {
      return apiError("Team not found.", 404);
    }

    if (result.status === "has_players") {
      return apiError(
        `Cannot delete this team because it has ${result.playerCount} player${
          result.playerCount === 1 ? "" : "s"
        }.`,
        409,
      );
    }

    if (result.status === "in_use") {
      return apiError(
        "Cannot delete a team that is used in existing matches.",
        409,
      );
    }

    revalidatePath("/dashboard");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete team failed:", error);

    return apiError("Unable to delete team. Please try again.", 500);
  }
}
