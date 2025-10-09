"use client";

import WorkoutHistory from "@/components/WorkoutHistory";
import { useUser } from "@clerk/nextjs";

const WorkoutsPage = () => {
  
  const {user, isSignedIn, isLoaded} = useUser();
  
  if(isLoaded && isSignedIn){
    return <WorkoutHistory userId={user.id} />
  }

  return <p>Loading...</p>
};

export default WorkoutsPage;
