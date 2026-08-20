import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@prisma/client";

/** Consistent JSON error shape: { error: CODE, message } */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

export function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: code, message }, { status });
}

/** Throws 401 if not logged in. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new ApiError(401, "UNAUTHORIZED", "You must be logged in.");
  return user;
}

/**
 * Wraps a route handler: auth/validation/domain errors become consistent JSON;
 * raw DB errors are never exposed.
 */
export function handleApi<Args extends unknown[]>(
  handler: (...args: Args) => Promise<NextResponse | Response>
) {
  return async (...args: Args): Promise<NextResponse | Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof ApiError) return jsonError(err.status, err.code, err.message);
      if (err instanceof ZodError) {
        const first = err.issues[0];
        const path = first?.path.join(".") ?? "";
        return jsonError(
          400,
          "VALIDATION_ERROR",
          `${path ? path + ": " : ""}${first?.message ?? "Invalid input."}`
        );
      }
      console.error("Unhandled API error:", err);
      return jsonError(500, "INTERNAL_ERROR", "Something went wrong. Please try again.");
    }
  };
}
