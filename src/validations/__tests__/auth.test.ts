import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema, onboardingSchema } from "../auth";

describe("Auth Validations", () => {
  describe("registerSchema", () => {
    it("should validate correct registration data", () => {
      const validData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      };
      expect(registerSchema.safeParse(validData).success).toBe(true);
    });

    it("should fail if passwords do not match", () => {
      const invalidData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password1234!",
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords do not match");
      }
    });

    it("should fail if password is weak", () => {
      const weakPasswordData = {
        email: "test@example.com",
        password: "weak",
        confirmPassword: "weak",
      };
      const result = registerSchema.safeParse(weakPasswordData);
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("should validate correct login data", () => {
      const validData = {
        email: "test@example.com",
        password: "Password123!",
      };
      expect(loginSchema.safeParse(validData).success).toBe(true);
    });

    it("should fail for invalid email", () => {
      const invalidData = {
        email: "not-an-email",
        password: "Password123!",
      };
      expect(loginSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe("onboardingSchema", () => {
    it("should validate correct onboarding data", () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        gender: "MALE",
        height: "180",
        weight: "75",
        dob: new Date("1990-01-01"),
      };
      const result = onboardingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail for invalid height range", () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        gender: "MALE",
        height: "300", // Too high
        weight: "75",
        dob: new Date(),
      };
      const result = onboardingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
