import { memo } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { User } from "@/generated/prisma/client";
import { toProperCase } from "@/lib/utils";

const About = ({
  userData,
  visitedByOther,
}: {
  userData: User;
  visitedByOther?: boolean;
}) => {
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
            <p>
              Your about section will appear here.
            </p>
          )}
          <p>
            Joined {format(userData.createdAt, "MMM, yyyy")}
          </p>
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
        <div className="flex-1 flex-center mt-2 mb-5">
          <p className="font-semibold">{toProperCase(userData.privacy)}</p>
        </div>
      </>
    </div>
  );
};

export default memo(About);
