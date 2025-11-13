import { User } from "@/generated/prisma"
import Link from "next/link"
import Image from "next/image"
import Icons from "../icons/appIcons"

const UserInfo = ({user}: {user: User}) => {
  return (
    <Link
        href={`/community/user/${user.id}`}
        className="flex gap-3 py-2 items-center cursor-pointer text-sm border-b border-b-zinc-400"
      >
        {user.imgUrl ? (
          <Image
            src={user.imgUrl}
            alt="user profile image"
            width={35}
            height={35}
            className="rounded-4xl"
          />
        ) : (
          <div className="min-w-9"><Icons.user width={30} height={30}/></div>
        )}
        <div className="flex flex-col">
          <p className="text-zinc-600 font-semibold">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-zinc-600">{user.about}</p>
        </div>
      </Link>
  )
}

export default UserInfo