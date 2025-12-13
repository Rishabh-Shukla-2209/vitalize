import {
  useReducer,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { stackReducer } from "@/reducers/stackReducer";
import { WorkoutPlanDetailsType } from "@/lib/types";

export function useWorkoutFlow(workoutPlan: WorkoutPlanDetailsType | null) {
  const [stack, dispatch] = useReducer(stackReducer, []);
  const currExIndex = useRef(0);
  const [status, setStatus] = useState<"work" | "rest">("work");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const currWorkoutItem = useMemo(
    () => (stack.length > 0 ? stack[stack.length - 1] : null),
    [stack],
  );

  // --- Handle Next Workout Step ---
  const handleEndWorkout = useCallback(() => {
    setIsTimerRunning(false);
    setTimeRemaining(0);
    setStatus("work");
    setHasEnded(true);
  }, []);

  const nextWorkoutItem = useCallback(() => {
    if (!currWorkoutItem || !workoutPlan) return;
    setIsPaused(false);
    const { exercise, currValues, type } = currWorkoutItem;
    if (!exercise) return;

    const isLastSet = currValues.set >= exercise.sets;
    const isLastExercise =
      currExIndex.current >= workoutPlan.exercises.length - 1;

    // WORK → REST
    if (type === "work") {
      if (isLastSet && isLastExercise) {
        handleEndWorkout();
        return;
      }

      dispatch({
        type: "PUSH",
        payload: {
          exercise,
          currValues,
          type: "rest",
        },
      });
      setStatus("rest");
      setTimeRemaining(exercise.rest);
      setIsTimerRunning(true);
      return;
    }

    // REST → WORK
    if (type === "rest") {
      if (!isLastSet) {
        dispatch({
          type: "PUSH",
          payload: {
            exercise,
            currValues: { ...currValues, set: currValues.set + 1 },
            type: "work",
          },
        });
        setStatus("work");
        if (currValues.time) {
          setIsTimerRunning(true);
          setTimeRemaining(currValues.time);
        } else {
          setIsTimerRunning(false);
          setTimeRemaining(0);
        }

        setIsPaused(false);
        return;
      }

      if (!isLastExercise) {
        const nextIndex = currExIndex.current + 1;
        const nextExercise = workoutPlan.exercises[nextIndex];
        if (!nextExercise) {
          handleEndWorkout();
          return;
        }

        currExIndex.current = nextIndex;

        dispatch({
          type: "PUSH",
          payload: {
            exercise: nextExercise,
            type: "work",
            currValues: {
              set: 1,
              reps: nextExercise.reps,
              distance: nextExercise.distance,
              time: nextExercise.time,
            },
          },
        });

        setStatus("work");
        if (nextExercise.time) {
          setIsTimerRunning(true);
          setTimeRemaining(nextExercise.time);
        } else {
          setIsTimerRunning(false);
          setTimeRemaining(0);
        }

        setIsPaused(false);
        return;
      }

      handleEndWorkout();
    }
  }, [currWorkoutItem, workoutPlan, handleEndWorkout]);

  const prevWorkoutItem = useCallback(() => {
    if (stack.length <= 1) return;
    setIsPaused(false);
    const prevItem = stack[stack.length - 2];
    dispatch({ type: "POP" });

    if (!prevItem || !workoutPlan) return;

    const { exercise, currValues, type } = prevItem;
    if (!exercise) return;

    if (type === "rest" && currValues.set === exercise.sets) {
      currExIndex.current--;
    }

    if (type === "rest") {
      setStatus("rest");
      setTimeRemaining(exercise.rest);
      setIsTimerRunning(true);
      return;
    }

    if (type === "work") {
      setStatus("work");
      if (currValues.time) {
        setIsTimerRunning(true);
        setTimeRemaining(currValues.time);
      } else {
        setIsTimerRunning(false);
        setTimeRemaining(0);
      }

      setIsPaused(false);
      return;
    }
  }, [stack, workoutPlan]);

  // --- Timer logic ---
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (timerCompleted) {
      setIsTimerRunning(false);
      setTimerCompleted(false);
      nextWorkoutItem();
    }
  }, [timerCompleted, nextWorkoutItem]);

  const pauseWorkout = useCallback(() => {
    if (!isTimerRunning && !isPaused) return;

    if (isPaused) {
      setIsPaused(false);
      setIsTimerRunning(true);
    } else {
      setIsPaused(true);
      setIsTimerRunning(false);
    }
  }, [isTimerRunning, isPaused]);

  return {
    currWorkoutItem,
    nextWorkoutItem,
    prevWorkoutItem,
    pauseWorkout,
    timeRemaining,
    setTimeRemaining,
    setIsTimerRunning,
    isTimerRunning,
    isPaused,
    status,
    dispatch,
    hasEnded,
    handleEndWorkout,
  };
}
