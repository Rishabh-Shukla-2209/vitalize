"use client";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Logo from "../icons/Logo";
import Icons from "../icons/appIcons";
import Image from "next/image";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";
import { NotificationsList } from "../notifications/NotificationList";
import { ModeToggle } from "../ThemeToggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { links } from "@/lib/utils";
import NavMenu from "./NavMenu";

const Navbar = () => {
  const pathname = usePathname();
  const [imageUrl, setImageUrl] = useState("");
  const { user } = useUser();

  const { data: userData } = useQuery({
    queryKey: ["user", { userId: user?.id }],
    queryFn: () => getUser(),
    staleTime: Infinity,
    enabled: !!user,
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
    <div className="max-w-full">
      <div className="p-3.5 flex items-center justify-between">
        <Link href={"/home"}>
          <div className="flex-center gap-1.5 cursor-pointer">
            <Logo />
            <p className="font-bold text-lg">VitalAIze</p>
          </div>
        </Link>
        <div className="flex items-center gap-7">
          <ul className="hidden md:flex gap-7 font-light text-gray-600">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  {
                    "text-gray-900 dark:font-bold font-medium pointer-events-none":
                      pathname === link.href,
                  },
                  "hover:text-gray-900"
                )}
              >
                <p>{link.name}</p>
              </Link>
            ))}
          </ul>
          <NotificationsList />
          <div className="block md:hidden">
            <NavMenu />
          </div>
          <div className="hidden md:inline">
            <ModeToggle />
          </div>
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={clsx(
                    "relative flex-center rounded-4xl cursor-pointer",
                    imageUrl && "p-1 bg-primary",
                    !imageUrl && "p-2.75 bg-gray-300"
                  )}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="user profile image"
                      width={40}
                      height={40}
                      className="rounded-4xl"
                    />
                  ) : (
                    <Icons.user width={25} height={25} />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={"/profile"}
                  >
                    <div className="flex gap-1 text-gray-600">
                      <Icons.user className="dark:text-white" />
                      <p>Profile</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <SignOutButton>
                    <div className="flex gap-1 mt-1">
                      <Icons.logout className="text-red-600" />
                      <p className="text-red-600">Logout</p>
                    </div>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="h-0.5 bg-gray-300 dark:bg-sage-400" />
    </div>
  );
};

export default Navbar;
