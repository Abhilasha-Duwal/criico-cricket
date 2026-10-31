import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import {
  deletePlayer,
  PlayerHasPerformancesError,
  getPlayerById,
  serializePlayer,
  TeamNotFoundError,
  updatePlayer,
} from "@/lib/players";
import { playerInputSchema } from "@/lib/validations/player";
import { toFieldErrors } from "@/lib/validations/shared";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  if (!(await getCurrentUser())) {
    return apiError("Authentication required.", 401);
  }

  const { id } = await params;

  try {
    const player = await getPlayerById(id);

    if (!player) {
      return apiError("Player not found.", 404);
    }

    return NextResponse.json({ player: serializePlayer(player) });
  } catch (error) {
    console.error("Get player failed:", error);

    return apiError("Unable to load player. Please try again.", 500);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await getCurrentUser())) {
    return apiError("Authentication required.", 401);
  }

  const { id } = await params;
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body.", 400);
  }

  const parsed = playerInputSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(
      "Please fix the highlighted fields.",
      400,
      toFieldErrors(parsed.error),
    );
  }

  try {
    const player = await updatePlayer(id, parsed.data);

    if (!player) {
      return apiError("Player not found.", 404);
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/players/${player.id}`);

    return NextResponse.json({ player: serializePlayer(player) });
  } catch (error) {
    if (error instanceof TeamNotFoundError) {
      return apiError("Selected team does not exist.", 400, {
        teamId: ["Select an existing team."],
      });
    }

    console.error("Update player failed:", error);

    return apiError("Unable to update player. Please try again.", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  if (!(await getCurrentUser())) {
    return apiError("Authentication required.", 401);
  }

  const { id } = await params;

  try {
    const deleted = await deletePlayer(id);

    if (!deleted) {
      return apiError("Player not found.", 404);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/players");

    return NextResponse.json({
      message: "Player deleted successfully.",
    });
  } catch (error) {
    if (error instanceof PlayerHasPerformancesError) {
      return apiError(error.message, 409);
    }

    console.error("Delete player failed:", error);

    return apiError("Unable to delete player. Please try again.", 500);
  }
}
