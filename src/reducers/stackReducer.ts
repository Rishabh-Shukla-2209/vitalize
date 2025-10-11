import { StackAction, WorkoutItem } from "@/lib/types";

export const stackReducer = (
  state: Array<WorkoutItem>,
  action: StackAction
) => {
  switch (action.type) {
    case "PUSH":
      return [...state, action.payload];
    case "POP":
      return state.slice(0, -1);
    case "CLEAR":
      return [];
  }
};
