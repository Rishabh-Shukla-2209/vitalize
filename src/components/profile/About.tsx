import { getUser } from "@/lib/queries";
import { useUser } from "@clerk/nextjs";
import { Dispatch, memo, SetStateAction } from "react";
import { Button } from "../ui/button";
import Icons from "../icons/appIcons";
import Image from "next/image";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

const About = ({
  setEdit,
  visitedByOtherUser,
}: {
  setEdit: Dispatch<SetStateAction<boolean>>;
  visitedByOtherUser?: boolean;
}) => {
  const { user } = useUser();

  const { data: userData } = useQuery({
    queryKey: ["user", { userId: user?.id }],
    queryFn: () => getUser(user?.id),
    staleTime: Infinity,
    enabled: !!user
  });

  return (
    <div className="border border-zinc-300 rounded-md bg-zinc-100 p-5 text-center">
      {userData ? (
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
            <p className="text-2xl text-zinc-700 font-semibold">
              {userData.firstName ? userData.firstName : ""}{" "}
              {userData.lastName ? userData.lastName : ""}
            </p>
            {userData.about ? (
              <p className="text-zinc-700">{userData.about}</p>
            ) : (
              <p className="text-zinc-500">
                Your about section will appear here.
              </p>
            )}
            <p className="text-zinc-600">
              Joined {format(userData.createdAt, "MMM, yyyy")}
            </p>
          </div>
          <div className="flex-1 mb-5">
            {userData.bio ? (
              <p className="text-zinc-600">{userData.bio}</p>
            ) : (
              <p className="text-zinc-500">
                Your bio section will appear here.
              </p>
            )}
          </div>
          {!visitedByOtherUser && (
            <Button
              variant="default"
              className="w-full text-lg"
              onClick={() => setEdit(true)}
            >
              <Icons.edit />
              Edit
            </Button>
          )}
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default memo(About);
