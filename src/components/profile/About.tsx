import { memo, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { User } from "@/generated/prisma/client";
import { toProperCase } from "@/lib/utils";
import Icons from "../icons/appIcons";
import { getFollowers, getFollowing } from "@/lib/actions/user";
import FollowerFollowing from "../community/FollowerFollowing";
import { useQuery } from "@tanstack/react-query";

const About = ({
  userData,
  visitedByOther,
  commUserId,
}: {
  userData: User;
  visitedByOther?: boolean;
  commUserId?: string;
}) => {
  const [viewFollowers, setViewFollowers] = useState(false);
  const [viewFollowing, setViewFollowing] = useState(false);

  const { data: followers } = useQuery({
    queryKey: ["followers", userData.id, commUserId],
    queryFn: () => getFollowers(commUserId),
    staleTime: 10 * 60 * 1000,
  });

  const { data: following } = useQuery({
    queryKey: ["following", userData.id, commUserId],
    queryFn: () => getFollowing(commUserId),
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div>
      <>
        <div className="flex-center mb-5">
          <div className="flex-1 max-w-50 max-h-50 overflow-hidden rounded-full">
            {userData.imgUrl && (
              <Image
                src={userData.imgUrl}
                alt="Profile image"
                height={500}
                width={500}
              />
            )}
          </div>
        </div>
        <div className="flex-1 mb-5">
          <p className="text-2xl font-semibold">
            {userData.firstName ? userData.firstName : ""}{" "}
            {userData.lastName ? userData.lastName : ""}
          </p>
          {userData.about ? (
            <p>{userData.about}</p>
          ) : visitedByOther ? (
            <p />
          ) : (
            <p>Your about section will appear here.</p>
          )}
          <p>Joined {format(userData.createdAt, "MMM, yyyy")}</p>
        </div>
        <div className="flex-1">
          {userData.bio ? (
            <p>{userData.bio}</p>
          ) : visitedByOther ? (
            <p />
          ) : (
            <p>Your bio section will appear here.</p>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 mt-2 mb-5">
          <p className="font-semibold">{toProperCase(userData.privacy)}</p>
          <p
            className="hover:font-semibold cursor-pointer"
            onClick={() => setViewFollowers(true)}
          >
            Followers: {followers?.length || 0}
          </p>
          <p
            className="hover:font-semibold cursor-pointer"
            onClick={() => setViewFollowing(true)}
          >
            Following: {following?.length || 0}
          </p>
        </div>
        {viewFollowers && (
          <div
            className="fixed w-full h-full bg-black/70 top-0 left-0 flex-center"
            onClick={() => setViewFollowers(false)}
          >
            <div
              className="bg-zinc-200 dark:bg-sage-400 border border-zinc-400 dark:border-sage-700 w-80 md:w-120 max-h-100 overflow-scroll rounded-lg p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex border-b-2 border-b-zinc-400 dark:border-b-sage-700 pb-1">
                <Icons.uncheck
                  onClick={() => setViewFollowers(false)}
                  className="cursor-pointer dark:text-sage-200"
                />
                <h3 className="flex-1 text-center">Followers</h3>
              </div>
              <div className="flex flex-col w-full">
                {followers && followers.length > 0 ? (
                  followers.map((follower) => (
                    <FollowerFollowing
                      key={follower.follower.id}
                      entity={follower.follower}
                    />
                  ))
                ) : (
                  <p>No followers to show</p>
                )}
              </div>
            </div>
          </div>
        )}
        {viewFollowing && (
          <div
            className="fixed w-full h-full bg-black/70 top-0 left-0 flex-center"
            onClick={() => setViewFollowing(false)}
          >
            <div
              className="bg-zinc-200 dark:bg-sage-400 border border-zinc-400 dark:border-sage-700 w-80 md:w-120 max-h-100 overflow-scroll rounded-lg p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex border-b-2 border-b-zinc-400 dark:border-b-sage-700 pb-1">
                <Icons.uncheck
                  onClick={() => setViewFollowing(false)}
                  className="cursor-pointer dark:text-sage-200"
                />
                <h3 className="flex-1 text-center">Following</h3>
              </div>
              <div className="flex flex-col w-full">
                {following && following.length > 0 ? (
                  following.map((f) => (
                    <FollowerFollowing
                      key={f.following.id}
                      entity={f.following}
                    />
                  ))
                ) : (
                  <p>No Following to show</p>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default memo(About);
