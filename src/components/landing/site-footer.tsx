import Link from "next/link";
import Logo from "../icons/Logo";

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
          {/* Add your footer links here */}
        </div>

        <div className="flex gap-4 text-zinc-600 dark:text-gray-400">
          {/* SVGs for GitHub/LinkedIn go here */}
        </div>
      </div>
    </footer>
  );
}
