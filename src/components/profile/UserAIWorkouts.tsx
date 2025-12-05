import { getUserAIWorkouts } from "@/lib/actions/user";
import { useState, useCallback } from "react";
import Icons from "../icons/appIcons";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import AIWorkoutCard from "./AIWorkoutCard";
import AIWorkoutSkeleton from "./skeletons/WorkoutSkeleton";

const UserAIWorkouts = () => {
  const [pageCursors, setPageCursors] = useState<
    Array<{
      first: { createdAt: Date; id: string } | null;
      last: { createdAt: Date; id: string } | null;
    }>
  >([{ first: null, last: null }]);
  const [currIndex, setCurrIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const getData = useCallback(async () => {
    const cursor =
      direction === "prev"
        ? pageCursors[currIndex].first
        : pageCursors[currIndex].last;

    const data = await getUserAIWorkouts(cursor, direction);
    if (data) {
      if (data.length > 0) {
        setPageCursors((prev) => {
          const next = [...prev];
          next[currIndex + 1] = {
            first: { createdAt: data[0].createdAt, id: data[0].id },
            last: {
              createdAt: data[data.length - 1].createdAt,
              id: data[data.length - 1].id,
            },
          };
          return next;
        });
      }
    }

    return data;
  }, [currIndex, direction, pageCursors]);

  const { data, isLoading } = useQuery({
    queryKey: ["UserAIWorkouts", currIndex],
    queryFn: getData,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div>
      <h2 className="mt-5">AI Workouts</h2>
      <div className="flex flex-col gap-2 mt-2">
        {isLoading ? (
          <AIWorkoutSkeleton />
        ) : data && data.length > 0 ? (
          data.map((workout) => (
            <AIWorkoutCard key={workout.id} workout={workout} />
          ))
        ) : (
          <p>Your Generated AI workouts will appear here.</p>
        )}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            className="text-primary text-center mt-2 cursor-pointer"
            disabled={currIndex < 1}
            onClick={() => {
              setCurrIndex((prev) => prev - 1);
              setDirection("prev");
            }}
          >
            <Icons.left /> Prev
          </Button>
          <Button
            variant="ghost"
            className="text-primary text-center mt-2 cursor-pointer"
            disabled={!data || data.length < 5}
            onClick={() => {
              setCurrIndex((prev) => prev + 1);
              setDirection("next");
            }}
          >
            Next <Icons.right />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserAIWorkouts;
