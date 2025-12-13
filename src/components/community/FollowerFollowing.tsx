import Link from "next/link";
import Image from "next/image";
import Icons from "../icons/appIcons";
import { FollowerFollowingType } from "@/lib/types";
import { Button } from "../ui/button";

const Follower = ({ entity }: { entity: FollowerFollowingType }) => {
  return (
    <div className="flex justify-between items-center w-full my-1 pb-1 border-b-zinc-300 dark:border-b-sage-700 border-b">
      <div className="flex gap-3 items-center text-sm">
        {entity.imgUrl ? (
          <Image
            src={entity.imgUrl}
            alt="user profile image"
            width={40}
            height={40}
            className="rounded-4xl"
          />
        ) : (
          <Icons.user width={40} height={40} />
        )}
        <div className="flex flex-col">
          <p className="font-semibold">
            {entity.firstName} {entity.lastName}
          </p>
        </div>
      </div>
      <Link href={`/community/user/${entity.id}`}>
        <Button variant="outline" className="mr-1 dark:text-zinc-100">
          Profile
        </Button>
      </Link>
    </div>
  );
};

export default Follower;
