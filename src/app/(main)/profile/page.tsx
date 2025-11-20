"use client";

import AllGoals from "@/components/goal/AllGoals";
import Icons from "@/components/icons/appIcons";
import AllPRs from "@/components/personalRecords/AllPRs";
import About from "@/components/profile/About";
import CommentLikes from "@/components/profile/activity/CommentLikes";
import Comments from "@/components/profile/activity/Comments";
import PostLikes from "@/components/profile/activity/PostLikes";
import Posts from "@/components/profile/activity/Posts";
import ActivitySkeleton from "@/components/profile/skeletons/ActivitySkeleton";
import ProfileSkeleton from "@/components/profile/skeletons/ProfileSkeleton";
import Stats from "@/components/profile/Stats";
import UpdateAbout from "@/components/profile/UpdateAbout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import UserAIWorkouts from "@/components/UserAIWorkouts";
import { getNoOfPRs, getNoOfWorkoutsDone, getUser } from "@/lib/queries";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const ProfilePage = () => {
  const { user } = useUser();
  const [edit, setEdit] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["user", { userId: user?.id }],
    queryFn: () => getUser(user?.id),
    staleTime: Infinity,
    enabled: !!user,
  });

  const { data } = useQuery({
    queryKey: ["dashboard-data", user?.id],
    queryFn: async () => {
      if (user) {
        const [prCount, workoutCount] = await Promise.all([
          getNoOfPRs(user.id),
          getNoOfWorkoutsDone(user.id),
        ]);
        return { prCount, workoutCount };
      }
    },
    enabled: !!user,
    staleTime: Infinity,
  });

  return (
    <div className="w-full flex flex-col lg:flex-row lg:flex-wrap gap-10 px-10 py-7">
      <div className="flex-1 flex flex-col gap-5">
        {edit ? (
          <UpdateAbout setEdit={setEdit} />
        ) : (
          <div className="border border-zinc-300 rounded-md bg-zinc-100 p-5 text-center">
            {userData ? (
              <>
                <About userData={userData} />
                <Button
                  variant="default"
                  className="w-full text-lg"
                  onClick={() => setEdit(true)}
                >
                  <Icons.edit />
                  Edit
                </Button>
              </>
            ) : (
              <ProfileSkeleton />
            )}
          </div>
        )}
        <div className="lg:hidden flex flex-wrap justify-between gap-5 w-full">
          <Stats value={data?.prCount || 0} title="PRs" />
          <Stats value={data?.workoutCount || 0} title="Workouts" />
          <Stats value={userData?.longestStreakDays || 0} title="Streak" />
        </div>
        {user ? <Posts userId={user.id} /> : <ActivitySkeleton />}
        {user ? (
          <div className="flex flex-col gap-2 p-2">
            <h2>Likes</h2>
            <PostLikes userId={user.id} />
            <CommentLikes userId={user.id}/>
          </div>
        ) : (
          <ActivitySkeleton />
        )}
        {user ? <Comments userId={user.id} /> : <ActivitySkeleton />}
      </div>
      <div className="flex-2">
        <div className="hidden lg:flex flex-wrap justify-between gap-5 w-full">
          <Stats value={data?.prCount || 0} title="PRs" />
          <Stats value={data?.workoutCount || 0} title="Workouts" />
          <Stats value={userData?.longestStreakDays || 0} title="Streak" />
        </div>
        {user ? <AllPRs userId={user.id} /> : <div className="w-full h-20 flex-center">
          <Spinner />
        </div>}
        {user ? <AllGoals userId={user.id} /> : <div className="w-full h-20 flex-center"><Spinner /></div>}
        {user ? <UserAIWorkouts userId={user.id} /> : <div className="w-full h-20 flex-center"><Spinner /></div>}
      </div>
    </div>
  );
};

export default ProfilePage;
