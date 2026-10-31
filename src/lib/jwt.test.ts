import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  assertJwtSecret,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
} from "./jwt";

const JWT_SECRET = "test-jwt-secret-that-is-at-least-32-characters";
const OTHER_SECRET = "other-jwt-secret-that-is-at-least-32-characters";

const user = {
  userId: "user-123",
  name: "Test User",
  email: "test@example.com",
};

beforeEach(() => {
  vi.stubEnv("JWT_SECRET", JWT_SECRET);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("JWT session tokens", () => {
  it("round-trips a valid session token", async () => {
    const token = await createSessionToken(user);

    await expect(verifySessionToken(token)).resolves.toEqual(user);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createSessionToken(user);

    vi.stubEnv("JWT_SECRET", OTHER_SECRET);

    await expect(verifySessionToken(token)).resolves.toBeNull();
  });

  it("rejects a malformed token", async () => {
    await expect(verifySessionToken("not-a-jwt")).resolves.toBeNull();
  });

  it("requires a JWT secret of at least 32 characters", () => {
    vi.stubEnv("JWT_SECRET", "too-short");

    expect(() => assertJwtSecret()).toThrow(
      "JWT_SECRET must be set and at least 32 characters long.",
    );
  });

  it("rejects an empty JWT secret", () => {
    vi.stubEnv("JWT_SECRET", "");

    expect(() => assertJwtSecret()).toThrow(
      "JWT_SECRET must be set and at least 32 characters long.",
    );
  });

  it("uses a secure, HTTP-only, SameSite=Lax cookie in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    const options = sessionCookieOptions();

    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.secure).toBe(true);
  });

  it("does not mark the cookie Secure outside production", () => {
    vi.stubEnv("NODE_ENV", "test");

    expect(sessionCookieOptions().secure).toBe(false);
  });
});
