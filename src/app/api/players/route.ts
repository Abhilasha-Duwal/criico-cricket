import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import {
  createPlayer,
  listPlayers,
  serializePlayer,
  TeamNotFoundError,
} from "@/lib/players";
import {
  playerFilterSchema,
  playerInputSchema,
} from "@/lib/validations/player";
import { toFieldErrors } from "@/lib/validations/shared";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await getCurrentUser())) {
    return apiError("Authentication required.", 401);
  }

  const { searchParams } = new URL(request.url);
  const parsed = playerFilterSchema.safeParse({
    teamId: searchParams.get("teamId") ?? undefined,
    role: searchParams.get("role") ?? undefined,
  });

  if (!parsed.success) {
    return apiError(
      "Invalid player filters.",
      400,
      toFieldErrors(parsed.error),
    );
  }

  try {
    const players = await listPlayers(parsed.data);

    return NextResponse.json({
      players: players.map(serializePlayer),
    });
  } catch (error) {
    console.error("List players failed:", error);

    return apiError("Unable to load players. Please try again.", 500);
  }
}

export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return apiError("Authentication required.", 401);
  }

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
    const player = await createPlayer(parsed.data);
    revalidatePath("/dashboard");

    return NextResponse.json(
      { player: serializePlayer(player) },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof TeamNotFoundError) {
      return apiError("Selected team does not exist.", 400, {
        teamId: ["Select an existing team."],
      });
    }

    console.error("Create player failed:", error);

    return apiError("Unable to create player. Please try again.", 500);
  }
}
