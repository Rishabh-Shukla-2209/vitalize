import Link from "next/link";
import Logo from "../icons/Logo";
import { Button } from "../ui/button";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-white dark:bg-[#050505] py-5 mt-10 relative z-10">
      <div className="w-full mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1.5 cursor-pointer">
            <Logo />
            <p>VitalAIze © 2025</p>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Button variant="ghost" asChild>
            <Link
              href="https://github.com/Rishabh-Shukla-2209/vitalize"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source Code
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
