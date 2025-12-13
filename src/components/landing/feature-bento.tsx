import { SpotlightCard } from "@/components/landing/spotlight-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icons from "../icons/appIcons";
import Image from "next/image";

export function FeatureBento() {
  return (
    <section className="relative z-10 w-full p-12">
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h2 className="text-3xl font-bold text-zinc-700 dark:text-white tracking-tight">
          More than just a <span className="text-primary">Fitness App</span>
        </h2>
        <p className="text-zinc-600 dark:text-gray-400 mt-2">
          Built to handle complex data, real-time events, and sleek UI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto">
        <SpotlightCard className="md:col-span-2 bg-zinc-100 dark:bg-zinc-900/50 p-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-700 dark:text-white">
              <Icons.chart className="text-primary" />
              Data Visualization
            </CardTitle>
            <p className="text-sm text-zinc-600 dark:text-gray-400">
              Interactive charts built with Recharts.
            </p>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-end justify-center py-5 overflow-hidden">
            <Image
              src="/app-screens/chart-2-dark.png"
              alt="chart image"
              height={485}
              width={891}
              className="hidden dark:block"
            />
            <Image
              src="/app-screens/chart-2-light.png"
              alt="chart image"
              height={485}
              width={891}
              className="block dark:hidden"
            />
          </CardContent>
        </SpotlightCard>

        <SpotlightCard className="md:row-span-2 bg-zinc-100 dark:bg-zinc-900/50 flex flex-col p-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-700 dark:text-white">
              <Icons.users className="text-primary" />
              Community
            </CardTitle>
            <p className="text-sm text-zinc-600 dark:text-gray-400">
              Indulge with a vibrant community.
            </p>
          </CardHeader>
          <CardContent className="flex-1 py-5 flex justify-center items-start pt-6 overflow-hidden">
            <Image
              src="/app-screens/community-dark.png"
              alt="community screen"
              height={724}
              width={336}
              className="hidden dark:block"
            />
            <Image
              src="/app-screens/community-light.png"
              alt="community screen"
              height={724}
              width={336}
              className="block dark:hidden"
            />
          </CardContent>
        </SpotlightCard>

        <SpotlightCard className="bg-zinc-100 dark:bg-zinc-900/50">
          <CardContent className="flex flex-col justify-center h-full p-6">
            <Image
              src="/app-screens/chart-1-dark.png"
              alt="chart image"
              height={338}
              width={484}
              className="hidden dark:block"
            />
            <Image
              src="/app-screens/chart-1-light.png"
              alt="chart image"
              height={338}
              width={484}
              className="block dark:hidden"
            />
          </CardContent>
        </SpotlightCard>

        <SpotlightCard className="bg-zinc-100 dark:bg-zinc-900/50">
          <CardContent className="flex flex-col justify-center h-full p-6">
            <Image
              src="/app-screens/chart-3-dark.png"
              alt="chart image"
              height={382}
              width={452}
              className="hidden dark:block"
            />
            <Image
              src="/app-screens/chart-3-light.png"
              alt="chart image"
              height={382}
              width={452}
              className="block dark:hidden"
            />
          </CardContent>
        </SpotlightCard>
        <SpotlightCard className="md:col-span-3 bg-zinc-100 dark:bg-zinc-900/50 p-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-700 dark:text-white">
              <Icons.dumbell className="text-primary" />
              Workout Library
            </CardTitle>
            <p className="text-sm text-zinc-600 dark:text-gray-400">
              A place where workouts of all types can be found.
            </p>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-end justify-center py-5 overflow-hidden">
            <Image
              src="/app-screens/workout-library-dark.png"
              alt="workout library image"
              height={762}
              width={1472}
              className="hidden dark:block"
            />
            <Image
              src="/app-screens/workout-library-light.png"
              alt="workout library image"
              height={762}
              width={1472}
              className="block dark:hidden"
            />
          </CardContent>
        </SpotlightCard>
      </div>
    </section>
  );
}
