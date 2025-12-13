import Icons from "../icons/appIcons";
import { CardHeader, CardTitle, CardContent } from "../ui/card";
import { FeatureBento } from "./feature-bento";
import { SpotlightCard } from "./spotlight-card";

const FeatureHighlights = () => {
  return (
    <div
      id="features"
      className="w-full p-5 bg-zinc-200 dark:bg-black bg-dot-white flex flex-col items-center"
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold text-zinc-700 dark:text-white tracking-tight mb-3">
          Feature Highlights
        </h2>
        <p className="text-zinc-600 dark:text-gray-400">
          Explore the key features that make VitalAIze your ultimate fitness
          companion.{" "}
        </p>
      </div>
      <div className="w-full flex gap-15 justify-center flex-wrap mt-10">
        <SpotlightCard className="bg-zinc-100 dark:bg-zinc-900/50 max-w-50 py-3">
          <CardHeader>
            <CardTitle className="flex flex-col gap-2">
              <Icons.dumbell className="text-primary" />
              <h3>Workout Library</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600 dark:text-gray-400">
              Access a diverse range of workouts tailored to your fitness levels
              and goals.{" "}
            </p>
          </CardContent>
        </SpotlightCard>
        <SpotlightCard className="bg-zinc-100 dark:bg-zinc-900/50 max-w-50 py-3">
          <CardHeader>
            <CardTitle className="flex flex-col gap-2">
              <Icons.chart className="text-primary" />
              <h3>Analytics Dashboard</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600 dark:text-gray-400">
              Track your progress with detailed analytics and insights.
            </p>
          </CardContent>
        </SpotlightCard>
        <SpotlightCard className="bg-zinc-100 dark:bg-zinc-900/50 max-w-50 py-3">
          <CardHeader>
            <CardTitle className="flex flex-col gap-2">
              <Icons.ai className="text-primary" />
              <h3>AI Coach</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600 dark:text-gray-400">
              Receive personalised workout plans from your AI powered fitness
              coach.
            </p>
          </CardContent>
        </SpotlightCard>
        <SpotlightCard className="bg-zinc-100 dark:bg-zinc-900/50 max-w-50 py-3">
          <CardHeader>
            <CardTitle className="flex flex-col gap-2">
              <Icons.users className="text-primary" />
              <h3>Community & Social</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600 dark:text-gray-400">
              Connect with other fitness enthusiasts and share your journey.
            </p>
          </CardContent>
        </SpotlightCard>
      </div>
      <FeatureBento />
    </div>
  );
};

export default FeatureHighlights;
