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
import { NotificationsList } from "../notifications/NotificationList";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";

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
  const [open, setOpen] = useState(false);

  const { user } = useUser();

  const { data: userData } = useQuery({
    queryKey: ["user", { userId: user?.id }],
    queryFn: () => getUser(user?.id),
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
    <div className="w-full" onClick={() => setProfileOptionsVisible(false)}>
      <div className="p-3.5 flex items-center justify-between">
        <Link href={"/home"}>
          <div className="flex-center gap-1.5 cursor-pointer">
            <Logo />
            <p className="font-bold text-lg">VitalAIze</p>
          </div>
        </Link>
        <div className="flex items-center gap-5 md:gap-7">
          <ul className="hidden md:flex gap-7 font-light text-gray-600">
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

          <div className="md:hidden relative flex flex-col gap-1">
            <Button variant="outline" onClick={() => setOpen((prev) => !prev)}>
              {open ? <Icons.uncheck /> : <Icons.menu />}
            </Button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="absolute top-5 right-1 z-1 bg-zinc-50 shadow-md rounded-lg mt-2"
                >
                  <ul className="flex flex-col gap-4 p-4 text-gray-700">
                    {links.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={clsx({
                          "text-gray-900 font-medium": pathname === link.href,
                        })}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NotificationsList />
          <div
            className={clsx(
              "relative flex-center rounded-4xl cursor-pointer",
              imageUrl && "p-1 bg-primary",
              !imageUrl && "p-2.75 bg-gray-300"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setProfileOptionsVisible((prev) => !prev);
            }}
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
            <AnimatePresence>
              {profileOptionsVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="absolute top-13 right-3.25 text-sm bg-white border border-gray-300 rounded-md p-3"
                >
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
                  <div className="h-0.5 bg-gray-300 my-2" />
                  <SignOutButton>
                    <div className="flex gap-1 mt-1">
                      <Icons.logout className="text-red-600" />
                      <p className="text-red-600">Logout</p>
                    </div>
                  </SignOutButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="h-0.5 bg-gray-300" />
    </div>
  );
};

export default Navbar;
