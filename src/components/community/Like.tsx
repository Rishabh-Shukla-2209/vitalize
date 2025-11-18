import Link from "next/link";
import Image from "next/image";
import Icons from "../icons/appIcons";
import { LikeType } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { Button } from "../ui/button";

const Like = ({ like }: { like: LikeType }) => {
  return (
    <div className="flex justify-between items-center w-full my-1 pb-1 border-b-zinc-300 border-b">
      <div
        className="flex gap-3 items-center text-sm"
      >
        {like.user.imgUrl ? (
          <Image
            src={like.user.imgUrl}
            alt="user profile image"
            width={40}
            height={40}
            className="rounded-4xl"
          />
        ) : (
          <Icons.user width={30} height={30} />
        )}
        <div className="flex flex-col">
          <p className="font-semibold">
            {like.user.firstName} {like.user.lastName}
          </p>
          <p>Liked {timeAgo(like.createdAt)}</p>
        </div>
      </div>
      <Button variant="outline" className="mr-1">
          <Link href={`/community/user/${like.userid}`}>Profile</Link>
      </Button>
    </div>
  );
};

export default Like;
