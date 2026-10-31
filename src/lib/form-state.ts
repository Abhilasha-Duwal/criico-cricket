import type { FieldErrors } from "@/lib/validations/shared";

export type FormActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
  values?: Record<string, string>;
  submittedAt?: number;
};
