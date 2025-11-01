"use client";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Logo from "../icons/Logo";
import Icons from "../icons/appIcons";
import Image from "next/image";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

const links = [
  { name: "Home", href: "/home" },
  { name: "Workouts", href: "/workouts" },
  { name: "Programs", href: "/programs" },
  { name: "Community", href: "/community" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [profileOptionsVisible, setProfileOptionsVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { user } = useUser();

  const { data: userData } = useQuery({
    queryKey: ["user", { userId: user?.id }],
    queryFn: () => getUser(user?.id),
    staleTime: Infinity,
    enabled: !!user
  });

  useEffect(() => {
    if (!user && !userData) return;

    if (userData?.imgUrl) {
      setImageUrl(userData.imgUrl);
    } else if (user?.hasImage) {
      setImageUrl(user.imageUrl);
    }
  }, [userData, user]);

  return (
    <div onClick={() => setProfileOptionsVisible(false)}>
      <div className="p-3.5 flex items-center justify-between">
        <Link href={"/home"}>
          <div className="flex-center gap-1.5 cursor-pointer">
            <Logo />
            <p className="font-bold text-gray-600 text-lg">VitalAIze</p>
          </div>
        </Link>
        <div className="flex items-center gap-7">
          <ul className="flex gap-7 font-light text-gray-600">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  {
                    "text-gray-900 font-medium pointer-events-none":
                      pathname === link.href,
                  },
                  "hover:text-gray-900"
                )}
              >
                <p>{link.name}</p>
              </Link>
            ))}
          </ul>
          <Icons.bell className="cursor-pointer text-gray-500 hover:text-gray-900" />

          <div
            className={clsx(
              "relative flex-center rounded-4xl cursor-pointer",
              imageUrl && "p-1 bg-amber-400",
              !imageUrl && "p-2.75 bg-gray-300"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setProfileOptionsVisible((prev) => !prev);
            }}
          >
            {!imageUrl && <Icons.user width={25} height={25} />}
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="user profile image"
                width={40}
                height={40}
                className="rounded-4xl"
              />
            )}
            {profileOptionsVisible && (
              <div className="absolute top-13 right-3.25 text-sm bg-white border border-gray-300 rounded-md p-3">
                <Link
                  href={"/profile"}
                  className={clsx({
                    "pointer-events-none": pathname === "/profile",
                  })}
                >
                  <div className="flex gap-1 text-gray-600">
                    <Icons.user />
                    <p>Profile</p>
                  </div>
                </Link>
                <div className="h-0.25 bg-gray-300 my-2" />
                <SignOutButton>
                  <div className="flex gap-1 text-red-600 mt-1">
                    <Icons.logout />
                    <p>Logout</p>
                  </div>
                </SignOutButton>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-0.25 bg-gray-300" />
    </div>
  );
};

export default Navbar;
