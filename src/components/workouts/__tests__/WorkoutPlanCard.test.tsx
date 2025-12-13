import { render, screen } from "@testing-library/react";
import WorkoutPlanCard from "../WorkoutPlanCard";
import { describe, it, expect } from "vitest";
import { WorkoutPlanType } from "@/lib/types";

// Mock appIcons since they are used in the component
vi.mock("../icons/appIcons", () => ({
  default: {
    clock: () => <div data-testid="clock-icon" />,
  },
}));

// Mock formatDuration
vi.mock("@/lib/utils", () => ({
  formatDuration: (duration: number) => `${duration} min`,
}));

describe("WorkoutPlanCard", () => {
  const mockWorkout: WorkoutPlanType = {
    id: "1",
    name: "Full Body Blast",
    description: "A comprehensive full body workout.",
    level: "INTERMEDIATE",
    duration: 45,
    imgUrl: "/test-image.jpg",
    // Add other required properties for WorkoutPlanType if any, or cast as necessary for the test context if the type is loose

    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1",
  };

  it("renders workout details correctly", () => {
    render(<WorkoutPlanCard workout={mockWorkout} />);

    expect(screen.getByText("Full Body Blast")).toBeInTheDocument();
    expect(
      screen.getByText("A comprehensive full body workout."),
    ).toBeInTheDocument();
    expect(screen.getByText("INTERMEDIATE")).toBeInTheDocument();
    expect(screen.getByText("45 min")).toBeInTheDocument();

    const image = screen.getByAltText("Workout image");
    expect(image).toBeInTheDocument();
    // Next/Image mock usually renders an img with src
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("test-image.jpg"),
    );
  });

  it("renders default image if no imgUrl provided", () => {
    const workoutNoImg = { ...mockWorkout, imgUrl: null };
    render(<WorkoutPlanCard workout={workoutNoImg} />);

    const image = screen.getByAltText("Workout image");
    // next/image transforms the src, so we just check if it contains the filename
    expect(image.getAttribute("src")).toContain("workoutPlanImg.png");
  });

  it("applies correct class for INTERMEDIATE level", () => {
    render(<WorkoutPlanCard workout={mockWorkout} />);
    const levelBadge = screen.getByText("INTERMEDIATE");
    expect(levelBadge).toHaveClass("bg-amber-400");
  });

  it("applies correct class for BEGINNER level", () => {
    const beginnerWorkout = { ...mockWorkout, level: "BEGINNER" as const };
    render(<WorkoutPlanCard workout={beginnerWorkout} />);
    const levelBadge = screen.getByText("BEGINNER");
    expect(levelBadge).toHaveClass("bg-green-500");
  });

  it("applies correct class for ADVANCED level", () => {
    const advancedWorkout = { ...mockWorkout, level: "ADVANCED" as const };
    render(<WorkoutPlanCard workout={advancedWorkout} />);
    const levelBadge = screen.getByText("ADVANCED");
    expect(levelBadge).toHaveClass("bg-red-600");
  });
});
