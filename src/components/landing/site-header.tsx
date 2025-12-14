import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "../icons/Logo";
import { DemoUserButton } from "./demo-login";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 dark:border-white/5 glass-panel backdrop-blur-md bg-white dark:bg-black/50">
      <div className="w-full p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex-center gap-1.5 cursor-pointer">
            <Logo />
            <p className="font-bold text-lg">VitalAIze</p>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2 md:flex-1 md:justify-center">
          <Button variant="ghost" asChild>
            <Link href="#features">Features</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#tech-stack">Tech Stack</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#demo">Demo</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link
              href="https://github.com/Rishabh-Shukla-2209/vitalize"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source Code
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button className="font-semibold hidden md:block" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>

          <DemoUserButton classes="font-semibold hidden md:flex" />
        </div>
      </div>
    </header>
  );
}
