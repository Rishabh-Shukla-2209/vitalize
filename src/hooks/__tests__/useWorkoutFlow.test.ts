import { renderHook, act } from "@testing-library/react";
import { useWorkoutFlow } from "../useWorkoutFlow";
import {
  WorkoutPlanDetailsType,
  ExerciseCategoryType,
  MuscleGroupType,
  EquipmentType,
} from "@/lib/types";
import { vi } from "vitest";

describe("useWorkoutFlow Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockExercise1 = {
    name: "Exercise 1",
    imgUrl: null,
    category: "STRENGTH" as ExerciseCategoryType,
    instructions: "Do it",
    muscleGroup: "CHEST" as MuscleGroupType,
    equipment: "NONE" as EquipmentType,
  };

  const mockExercise2 = {
    name: "Exercise 2",
    imgUrl: null,
    category: "CARDIO" as ExerciseCategoryType,
    instructions: "Run",
    muscleGroup: "LEGS" as MuscleGroupType, // Assuming LEGS is valid or map to QUADS
    equipment: "NONE" as EquipmentType,
  };

  // Need to match exact MuscleGroupType if strict check, assuming QUADS for legs example
  const mockExercise2Strict = {
    ...mockExercise2,
    muscleGroup: "QUADS" as MuscleGroupType,
  };

  const mockPlan: WorkoutPlanDetailsType = {
    id: "plan1",
    name: "Test Plan",
    userId: "user1",
    level: "BEGINNER",
    imgUrl: null,
    description: "Test Description",
    duration: 60,
    createdAt: new Date(),
    updatedAt: new Date(),
    exercises: [
      {
        id: "ex1",
        position: 0,
        time: null,
        sets: 2,
        reps: 10,
        rest: 60,
        distance: null,
        exerciseid: "e1",
        WorkoutPlanid: "plan1",
        exercise: mockExercise1,
      },
      {
        id: "ex2",
        position: 1,
        time: 30, // timed exercise
        sets: 1,
        reps: 0,
        rest: 30,
        distance: null,
        exerciseid: "e2",
        WorkoutPlanid: "plan1",
        exercise: mockExercise2Strict,
      },
    ],
  };

  const initialPayload = {
    exercise: mockPlan.exercises[0], // Using the shape expected by WorkoutItem
    type: "work" as const,
    currValues: {
      set: 1,
      reps: mockPlan.exercises[0].reps,
      distance: mockPlan.exercises[0].distance,
      time: mockPlan.exercises[0].time,
    },
  };

  it("initializes correctly", () => {
    const { result } = renderHook(() => useWorkoutFlow(mockPlan));
    expect(result.current.currWorkoutItem).toBeNull();
  });

  it("starts the workout when initialized and nextWorkoutItem is called", () => {
    const { result } = renderHook(() => useWorkoutFlow(mockPlan));

    // Initialize stack manually as the component does
    act(() => {
      result.current.dispatch({
        type: "PUSH",
        payload: initialPayload,
      });
    });

    expect(result.current.currWorkoutItem).not.toBeNull();
    expect(result.current.currWorkoutItem?.exercise?.exercise.name).toBe(
      "Exercise 1",
    );

    // Note: nextWorkoutItem handles transition to NEXT item or rest.
    // If we just pushed the first item, we are "at" the first item.
    // So checking if it is Work state.

    // Status is managed by useState in hook, default 'work'
    expect(result.current.status).toBe("work");
  });

  it("transitions from work to rest", () => {
    const { result } = renderHook(() => useWorkoutFlow(mockPlan));

    act(() => {
      result.current.dispatch({
        type: "PUSH",
        payload: initialPayload,
      });
    });

    // Current: Ex 1, Set 1. Total Sets: 2.
    // nextWorkoutItem -> Rest
    act(() => {
      result.current.nextWorkoutItem();
    });

    expect(result.current.status).toBe("rest");
    expect(result.current.isTimerRunning).toBe(true);
    expect(result.current.timeRemaining).toBe(60);
  });

  it("transitions from rest to work (Set 2)", () => {
    const { result } = renderHook(() => useWorkoutFlow(mockPlan));

    act(() => {
      result.current.dispatch({ type: "PUSH", payload: initialPayload });
    });

    // Work (Set 1) -> Rest
    act(() => {
      result.current.nextWorkoutItem();
    });

    // Rest -> Work (Set 2)
    act(() => {
      result.current.nextWorkoutItem();
    });

    expect(result.current.status).toBe("work");
    expect(result.current.currWorkoutItem?.currValues.set).toBe(2);
  });

  it("handles timer completion manually", () => {
    const { result } = renderHook(() => useWorkoutFlow(mockPlan));

    // Initialize
    act(() => {
      result.current.dispatch({ type: "PUSH", payload: initialPayload });
    });

    // Work (Set 1) -> Rest
    act(() => {
      result.current.nextWorkoutItem();
    });

    expect(result.current.status).toBe("rest");
    expect(result.current.isTimerRunning).toBe(true);

    // Advance timer by 60s + 1s buffer
    act(() => {
      vi.advanceTimersByTime(61000);
    });

    // Hook effect: if timerCompleted -> nextWorkoutItem()
    // Rest -> Work (Set 2)
    expect(result.current.status).toBe("work");
    expect(result.current.currWorkoutItem?.currValues.set).toBe(2);
  });
});
