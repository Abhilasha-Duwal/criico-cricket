import { NextResponse } from "next/server";
import type { FieldErrors } from "@/lib/validations/shared";

export function apiError(
  message: string,
  status: number,
  fieldErrors?: FieldErrors,
) {
  return NextResponse.json(
    {
      error: message,
      ...(fieldErrors ? { fieldErrors } : {}),
    },
    { status },
  );
}
