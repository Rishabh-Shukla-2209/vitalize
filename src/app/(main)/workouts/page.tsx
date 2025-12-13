"use client";

import { Spinner } from "@/components/ui/spinner";
import WorkoutHistory from "@/components/workouts/WorkoutHistory";
import { useUser } from "@clerk/nextjs";

const WorkoutsPage = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (isLoaded && isSignedIn) {
    return <WorkoutHistory />;
  }

  return (
    <div className="w-full h-screen flex-center">
      <Spinner className="mb-50" />
    </div>
  );
};

export default WorkoutsPage;
