"use client";

import AllGoals from "@/components/goal/AllGoals";
import AllPRs from "@/components/personalRecords/AllPRs";
import About from "@/components/profile/About";
import Stats from "@/components/profile/Stats";
import UpdateAbout from "@/components/profile/UpdateAbout";
import UserAIWorkouts from "@/components/UserAIWorkouts";
import {
  getNoOfPRs,
  getNoOfWorkoutsDone,
  getPersonalRecords,
  getStreaks,
} from "@/lib/queries";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const ProfilePage = () => {
  const { user } = useUser();
  const [edit, setEdit] = useState(false);

  const { data } = useQuery({
  queryKey: ["dashboard-data", user?.id],
  queryFn: async () => {
    if(user){
    const [prCount, workoutCount, streaks] = await Promise.all([
      getNoOfPRs(user.id),
      getNoOfWorkoutsDone(user.id),
      getStreaks(user.id),
      getPersonalRecords(user.id, null, "next"),
    ]);
    return { prCount, workoutCount, streaks };
    }
  },
  enabled: !!user,
});

 

  return (
    <div className="w-full flex gap-10 px-10 py-7">
      <div className="flex-1">
        {edit ? <UpdateAbout setEdit={setEdit} /> : <About setEdit={setEdit} />}
      </div>
      <div className="flex-2">
        <div className="flex justify-between gap-5 w-full">
          <Stats value={data?.prCount || 0} title="PRs" />
          <Stats value={data?.workoutCount || 0} title="Workouts" />
          <Stats value={data?.streaks.longestStreakDays || 0} title="Streak" />
        </div>
        {user ? <AllPRs userId={user.id} /> : <p>Loading...</p>}
        {user ? <AllGoals userId={user.id} /> : <p>Loading...</p>}
        {user ? <UserAIWorkouts userId={user.id} /> : <p>Loading...</p>}

      </div>
    </div>
  );
};

export default ProfilePage;
