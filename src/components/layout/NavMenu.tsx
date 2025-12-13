import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icons from "../icons/appIcons";
import Link from "next/link";
import { links } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";
import { ModeToggle } from "../ThemeToggler";

const NavMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Icons.menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {links.map((link, index) => (
          <DropdownMenuItem asChild key={index}>
            <Link key={link.name} href={link.href}>
              <p>{link.name}</p>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          <Link href={"/profile"}>
            <p>Profile</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ModeToggle />
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
  );
};

export default NavMenu;
