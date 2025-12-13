import { describe, it, expect } from "vitest";
import {
  formatDuration,
  formatDistance,
  toProperCase,
  getAvailableCategoriesForMuscleGroup,
} from "../utils";

describe("Utility Functions", () => {
  describe("formatDuration", () => {
    it('returns "-" for undefined or null', () => {
      expect(formatDuration(undefined)).toBe("-");
      expect(formatDuration(null)).toBe("-");
    });

    it('returns "0 s" for 0', () => {
      expect(formatDuration(0)).toBe("0 s");
    });

    it("formats seconds correctly", () => {
      expect(formatDuration(45)).toBe("45s");
    });

    it("formats minutes correctly", () => {
      expect(formatDuration(120)).toBe("2 min");
    });

    it("formats minutes and seconds correctly", () => {
      expect(formatDuration(130)).toBe("2 min 10 s");
    });
  });

  describe("formatDistance", () => {
    it('returns "-" for undefined or null', () => {
      expect(formatDistance(undefined)).toBe("-");
      expect(formatDistance(null)).toBe("-");
    });

    it('returns "0 m" for 0', () => {
      expect(formatDistance(0)).toBe("0 m");
    });

    it("formats meters correctly", () => {
      expect(formatDistance(500)).toBe("500m");
    });

    it("formats kilometers correctly", () => {
      expect(formatDistance(2000)).toBe("2 km");
    });

    it("formats kilometers and meters correctly", () => {
      expect(formatDistance(2500)).toBe("2 km 500 m");
    });
  });

  describe("toProperCase", () => {
    it("converts underscore separated string to proper case", () => {
      expect(toProperCase("HELLO_WORLD")).toBe("Hello World");
    });

    it("handles single word", () => {
      expect(toProperCase("TEST")).toBe("Test");
    });

    it("handles lowercase input correctly", () => {
      expect(toProperCase("hello_world")).toBe("Hello World");
    });
  });

  describe("getAvailableCategoriesForMuscleGroup", () => {
    it("returns correct categories for CHEST", () => {
      const categories = getAvailableCategoriesForMuscleGroup("CHEST");
      expect(categories).toEqual([
        { label: "Strength", val: "STRENGTH" },
        { label: "Hiit", val: "HIIT" },
      ]);
    });

    it("returns empty array for empty muscle group", () => {
      expect(getAvailableCategoriesForMuscleGroup("")).toEqual([]);
    });
  });
});
