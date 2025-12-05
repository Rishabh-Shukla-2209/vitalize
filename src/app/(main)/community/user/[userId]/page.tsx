"use client";
import Feed from "@/components/community/Feed";
import About from "@/components/profile/About";
import { FollowStatus, ProfileDataType } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import Stats from "@/components/profile/Stats";
import { useParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { saveFollowing } from "@/lib/actions/community";
import { getNoOfPRs, getNoOfWorkoutsDone, getUser, getFollowingStatus } from "@/lib/actions/user";
import { handleAppError } from "@/lib/utils";

const SocialProfile = () => {
  const [followStatus, setFollowStatus] =
    useState<FollowStatus>("Not Following");
  const { userId: id } = useParams();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["profile-data", user?.id, id],
    queryFn: async () => {
      if (user && typeof id === "string") {
        const [prCount, workoutCount, profileUser, followStatus] =
          await Promise.all([
            getNoOfPRs(),
            getNoOfWorkoutsDone(),
            getUser(),
            getFollowingStatus(id),
          ]);
        setFollowStatus(followStatus!);
        return { prCount, workoutCount, profileUser, followStatus };
      }
    },
    staleTime: Infinity,
    enabled: !!user,
  });

  const updateFollowQueryData = useCallback(
    (newFollowStatus: FollowStatus) => {
      queryClient.setQueryData<ProfileDataType>(
        ["profile-data", user!.id, id],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            followStatus: newFollowStatus,
          };
        }
      );
    },
    [id, queryClient, user]
  );

  useEffect(() => {
    if (!data || followStatus === data.followStatus) return;

    const timer = setTimeout(() => {
      const action =
        data.followStatus === "Accepted" || data.followStatus === "Requested"
          ? "unFollow"
          : "follow";

      try{
        saveFollowing(id as string, data.profileUser!.privacy, action);
        updateFollowQueryData(followStatus);
      }catch(err){
        handleAppError(err);
        updateFollowQueryData(data.followStatus!);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [data, followStatus, id, updateFollowQueryData, user]);

  const changeFollowStatus = () => {
    if (followStatus === "Accepted" || followStatus === "Requested") {
      setFollowStatus("Not Following");
      return;
    }

    if (data?.profileUser?.privacy === "PRIVATE") {
      setFollowStatus("Requested");
    } else {
      setFollowStatus("Accepted");
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row lg:flex-wrap gap-10 px-10 py-7">
      {data ? (
        <>
          <div className="flex-1">
            <div className="border border-zinc-300 dark:border-sage-700 rounded-md bg-zinc-100 dark:bg-sage-400 p-5 text-center">
              {data.profileUser && (
                <>
                  <About userData={data.profileUser} visitedByOther={true} />
                  <Button
                    variant={
                      followStatus === "Accepted" ||
                      followStatus === "Requested"
                        ? "outline"
                        : "default"
                    }
                    className="w-full text-lg"
                    onClick={changeFollowStatus}
                  >
                    {followStatus === "Accepted"
                      ? "Following"
                      : followStatus === "Requested"
                      ? "Requested"
                      : "Follow"}
                  </Button>
                </>
              )}
            </div>
            <div className="lg:hidden flex flex-wrap justify-between gap-5 w-full mt-5">
              <Stats value={data?.prCount || 0} title="PRs" />
              <Stats value={data?.workoutCount || 0} title="Workouts" />
              <Stats
                value={data?.profileUser?.longestStreakDays || 0}
                title="Streak"
              />
            </div>
          </div>
          <div className="flex-2 flex flex-col">
            <div className="hidden lg:flex flex-wrap justify-between gap-5 w-full">
              <Stats value={data?.prCount || 0} title="PRs" />
              <Stats value={data?.workoutCount || 0} title="Workouts" />
              <Stats
                value={data?.profileUser?.longestStreakDays || 0}
                title="Streak"
              />
            </div>
            {user && typeof id === "string" && (
              <div className="w-full lg:mt-5">
                <Feed userId={user.id} type="specific" specificUserId={id} />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="w-full h-screen flex-center"><Spinner className="mb-50"/></div>
      )}
    </div>
  );
};

export default SocialProfile;
