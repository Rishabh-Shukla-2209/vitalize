import { getGoals } from "@/lib/queries";
import { GoalType } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "react-use";
import Icons from "../icons/appIcons";
import Goal from "./Goal";
import { Button } from "../ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Status } from "@/generated/prisma";
import Selector from "../Selector";
import { GoalStatus } from "@/lib/utils";
import AddGoal from "./AddGoal";
import GoalEdit from "./GoalEdit";

const AllGoals = ({ userId }: { userId: string }) => {
  const [pageCursors, setPageCursors] = useState<
    Array<{ first: string | null; last: string | null }>
  >([{ first: null, last: null }]);
  const [currIndex, setCurrIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [addGoal, setAddGoal] = useState(false);
  const queryClient = useQueryClient();

  useDebounce(() => setDebouncedSearch(search), 500, [search]);

  const getData = useCallback(async () => {
    const cursor =
      direction === "prev"
        ? pageCursors[currIndex].first
        : pageCursors[currIndex].last;

    const data = await getGoals(
      userId,
      cursor,
      direction,
      debouncedSearch,
      status as Status | "All"
    );

    if (data.length > 0) {
      setPageCursors((prev) => {
        const next = [...prev];
        next[currIndex + 1] = {
          first: data[0].id,
          last: data[data.length - 1].id,
        };
        return next;
      });
    }

    return data as unknown as GoalType[];
  }, [direction, pageCursors, currIndex, userId, debouncedSearch, status]);

  const { data: goals } = useQuery({
    queryKey: ["Goals", userId, currIndex, debouncedSearch, status],
    queryFn: getData,
    staleTime: 5 * 60 * 1000,
  });

  const resetSearch = useCallback(() => {
    setCurrIndex(0);
    setPageCursors([{ first: null, last: null }]);
    setDirection("next");

    queryClient.invalidateQueries({
      queryKey: ["Goals", userId],
      exact: false,
    });
  }, [queryClient, userId]);

  const updateAbandonedGoal = (goalId: string) => {
    queryClient.setQueryData(
      ["Goals", userId, currIndex, debouncedSearch, status],
      (oldGoals: GoalType[]) => {
        if (!oldGoals) return;
        return oldGoals.map((goal) =>
          goal.id === goalId ? { ...goal, status: "ABANDONED" } : goal
        );
      }
    );
  };

  useEffect(() => {
    resetSearch();
  }, [debouncedSearch, resetSearch]);

  return (
    <div>
      <div className="flex justify-between mt-5">
        <h2 className="text-xl font-semibold text-zinc-700">Goals</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hover:bg-primary-dark hover:text-white"
            onClick={() => setAddGoal((prev) => !prev)}
          >
            <Icons.add />
            Add Goal
          </Button>
          <Selector
            choices={GoalStatus}
            setChoice={setStatus}
            placeholder="Filter by type"
            selectedValue={status}
          />
          <p className="flex items-center text-zinc-400 bg-zinc-100 px-2.5 rounded-lg w-85">
            <Icons.search />
            <input
              type="text"
              className="border-0 bg-zinc-100 text-zinc-600 flex-1"
              placeholder="Search by exercise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {addGoal && (
          <AddGoal
            userId={userId}
            setAddGoal={setAddGoal}
            resetSearch={resetSearch}
          />
        )}
        {goals && goals.length > 0 ? (
          goals.map((goal) => (
            <div
              key={goal.id}
              className="flex gap-2 bg-zinc-50 rounded-md pr-2 relative"
            >
              <Goal goal={goal} />
              {goal.status === "IN_PROGRESS" && (
                <div className="absolute top-2 right-2">
                  <GoalEdit goal={goal} goalUpdater={updateAbandonedGoal} />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-zinc-700">Your Goals will appear here.</p>
        )}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              className="text-red-500 text-center mt-2 cursor-pointer"
              disabled={currIndex < 1}
              onClick={() => {
                setCurrIndex((prev) => prev - 1);
                setDirection("prev");
              }}
            >
              <Icons.left /> Prev
            </Button>
            <Button
              variant="ghost"
              className="text-red-500 text-center mt-2 cursor-pointer"
              disabled={!goals || goals.length < 5}
              onClick={() => {
                setCurrIndex((prev) => prev + 1);
                setDirection("next");
              }}
            >
              Next <Icons.right />
            </Button>
          </div>
      </div>
    </div>
  );
};

export default AllGoals;
