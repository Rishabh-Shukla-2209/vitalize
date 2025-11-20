import { GoalType } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Goal from "./Goal";
import { useQuery } from "@tanstack/react-query";
import { getActiveGoals } from "@/lib/queries";
import GoalSkeleton from "./GoalSkeleton";

const Goals = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["activeGoals"],
    queryFn: () => getActiveGoals(userId),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <GoalSkeleton />;
  }

  // pairing so that 2 items are visible at once in the carousel
  const goalPairs: Array<Array<GoalType>> = [];
  if (data) {    
    for (let i = 0; i < data.length; i += 2) {
      goalPairs.push(data.slice(i, i + 2));
    }
  }

  return (
    <div className="boundary w-full px-5 py-3">
      <h3 className="mb-1.5">Goals</h3>
      {data && data.length > 0 ? (
        <Carousel className="relative">
          <CarouselContent>
            {goalPairs.map((goalPair, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col gap-2">
                  <Goal goal={goalPair[0]} />
                  {goalPair[1] && <Goal goal={goalPair[1]} />}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-top-4 left-65 md:-top-5 md:left-80" />
          <CarouselNext className="-top-4 -right-2 md:-top-5 md:right-2" />
        </Carousel>
      ) : (
          <p>
            {isError
              ? "Error fetching your Goals"
              : "Your goals will appear here."}
          </p>
      )}
    </div>
  );
};

export default Goals;
