import { SiteHeader } from "@/components/landing/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { VideoShowcase } from "@/components/landing/video-showcase";
import { SiteFooter } from "@/components/landing/site-footer";
import { TechStack } from "@/components/landing/tech-stack";
import FeatureHighlights from "@/components/landing/feature-highlights";

export default function LandingPage() {
  return (
    <div className="bg-dot-white bg-zinc-100 dark:bg-transparent text-slate-900 dark:text-white font-display antialiased selection:bg-primary selection:text-black overflow-x-hidden min-h-screen w-full flex flex-col scroll-smooth">
      <SiteHeader />
      <main className="relative flex flex-col items-center w-full flex-1">
        <HeroSection />
        <FeatureHighlights />
        <TechStack />
        <VideoShowcase />
      </main>
      <SiteFooter />
    </div>
  );
}
