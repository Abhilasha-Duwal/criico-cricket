import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth";

const validRegistration = {
  name: "  Test User  ",
  email: "  TEST@Example.COM  ",
  password: "strong-password",
};

describe("registerSchema", () => {
  it("trims the name and normalizes the email", () => {
    const result = registerSchema.safeParse(validRegistration);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Test User");
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("rejects an invalid email address", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: "short",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password longer than bcrypt's 72-byte limit", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: "a".repeat(73),
    });

    expect(result.success).toBe(false);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      name: "A",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("trims the email and requires a password", () => {
    const result = loginSchema.safeParse({
      email: "  USER@Example.com  ",
      password: "secret",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = loginSchema.safeParse({
      email: "invalid",
      password: "secret",
    });

    expect(result.success).toBe(false);
  });
});
