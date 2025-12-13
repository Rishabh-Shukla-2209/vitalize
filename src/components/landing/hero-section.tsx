import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icons from "../icons/appIcons";
import Link from "next/link";
import { DemoUserButton } from "./demo-login";

export function HeroSection() {
  return (
    <section className="relative z-10 w-full max-w-[960px] px-6 py-10 md:py-30 flex flex-col items-center text-center gap-8">
      <Badge
        variant="secondary"
        className="px-3 py-1 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 gap-2"
      >
        <Icons.sparkle />
        Powered by Generative AI & Next.js 15
      </Badge>

      <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-zinc-700 dark:text-transparent bg-clip-text bg-linear-to-b dark:from-white dark:to-white/60">
        Beyond Tracking: <br />
        <span className="text-zinc-700 dark:text-white glow-text">
          An Intelligent Fitness Ecosystem.
        </span>
      </h1>

      <p className="text-lg md:text-xl text-zinc-600 dark:text-gray-400 max-w-2xl leading-relaxed">
        Stop logging. Start evolving. Experience AI-generated workout plans, be
        a part of a vibrant community and visualize your biomechanics. The next
        generation of fitness logic.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
        <DemoUserButton
          classes="w-full sm:w-auto px-8 font-bold shadow-[0_0_20px_rgba(54,226,123,0.3)] hover:scale-105 transition-transform gap-2"
          size="lg"
        />
        <Button
          size="lg"
          asChild
          className="w-full sm:w-auto px-8 font-bold shadow-[0_0_20px_rgba(54,226,123,0.3)] hover:scale-105 transition-transform gap-2"
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </section>
  );
}
