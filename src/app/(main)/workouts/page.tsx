"use client";

import { Spinner } from "@/components/ui/spinner";
import WorkoutHistory from "@/components/WorkoutHistory";
import { useUser } from "@clerk/nextjs";

const WorkoutsPage = () => {
  
  const {user, isSignedIn, isLoaded} = useUser();
  
  if(isLoaded && isSignedIn){
    return <WorkoutHistory userId={user.id} />
  }

  return <div className="w-full h-screen flex-center"><Spinner className="mb-50"/></div>
};

export default WorkoutsPage;
