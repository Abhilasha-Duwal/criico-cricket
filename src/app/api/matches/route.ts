import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import {
  createMatch,
  DuplicatePlayerPerformanceError,
  listMatches,
  MatchIdempotencyConflictError,
  MatchPlayerNotFoundError,
  MatchReferenceChangedError,
  MatchTeamNotFoundError,
  PlayerNotEligibleError,
  serializeMatch,
} from "@/lib/matches";
import { matchInputSchema } from "@/lib/validations/match";
import { toFieldErrors } from "@/lib/validations/shared";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getCurrentUser())) {
    return apiError("Authentication required.", 401);
  }

  try {
    const matches = await listMatches();

    return NextResponse.json({
      matches: matches.map(serializeMatch),
    });
  } catch (error) {
    console.error("List matches failed:", error);

    return apiError("Unable to load matches. Please try again.", 500);
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

  const parsed = matchInputSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(
      "Please fix the highlighted fields.",
      400,
      toFieldErrors(parsed.error),
    );
  }

  try {
    const result = await createMatch(parsed.data);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/matches");
    revalidatePath("/dashboard/leaderboard");

    return NextResponse.json(
      {
        match: serializeMatch(result.match),
        replayed: result.replayed,
      },
      { status: result.replayed ? 200 : 201 },
    );
  } catch (error) {
    if (error instanceof MatchTeamNotFoundError) {
      return apiError("One or both selected teams no longer exist.", 400, {
        teamAId: ["Select an existing team."],
        teamBId: ["Select an existing team."],
      });
    }

    if (error instanceof MatchPlayerNotFoundError) {
      return apiError("One or more selected players no longer exist.", 400, {
        performances: ["Refresh the page and try again."],
      });
    }

    if (error instanceof PlayerNotEligibleError) {
      return apiError(
        "Every player must belong to one of the participating teams.",
        400,
        {
          performances: ["Remove players who are not on either team."],
        },
      );
    }

    if (error instanceof DuplicatePlayerPerformanceError) {
      return apiError(
        "Each player can only have one performance in a match.",
        400,
        {
          performances: [
            "Remove the duplicate player performance and try again.",
          ],
        },
      );
    }

    if (error instanceof MatchIdempotencyConflictError) {
      return apiError(
        "This request ID was already used for a different match. Refresh and try again.",
        409,
      );
    }

    if (error instanceof MatchReferenceChangedError) {
      return apiError(
        "A selected team or player changed while the match was being saved. Refresh and try again.",
        409,
      );
    }

    console.error("Create match failed:", error);

    return apiError("Unable to record match. Please try again.", 500);
  }
}
