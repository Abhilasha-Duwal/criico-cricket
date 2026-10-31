import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import {
  createTeam,
  DuplicateTeamError,
  listTeams,
  serializeTeam,
} from "@/lib/teams";
import { teamInputSchema } from "@/lib/validations/team";
import { toFieldErrors } from "@/lib/validations/shared";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getCurrentUser())) {
    return apiError("Authentication required.", 401);
  }

  try {
    const teams = await listTeams();

    return NextResponse.json({
      teams: teams.map(serializeTeam),
    });
  } catch (error) {
    console.error("List teams failed:", error);

    return apiError("Unable to load teams. Please try again.", 500);
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

  const parsed = teamInputSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(
      "Please fix the highlighted fields.",
      400,
      toFieldErrors(parsed.error),
    );
  }

  try {
    const team = await createTeam(parsed.data.name);
    revalidatePath("/dashboard");

    return NextResponse.json(
      { team: serializeTeam(team) },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof DuplicateTeamError) {
      return apiError("A team with this name already exists.", 409, {
        name: ["A team with this name already exists."],
      });
    }

    console.error("Create team failed:", error);

    return apiError("Unable to create team. Please try again.", 500);
  }
}
