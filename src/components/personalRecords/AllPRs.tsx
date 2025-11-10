import { getPersonalRecords } from "@/lib/queries";
import { PRType } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "react-use";
import Icons from "../icons/appIcons";
import PR from "./PR";
import { Button } from "../ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PREdit from "./PREdit";

const AllPRs = ({ userId }: { userId: string }) => {
  const [pageCursors, setPageCursors] = useState<
    Array<{
      first: { createdAt: Date; id: string } | null;
      last: { createdAt: Date; id: string } | null;
    }>
  >([{ first: null, last: null }]);
  const [currIndex, setCurrIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useDebounce(() => setDebouncedSearch(search), 500, [search]);
  const queryClient = useQueryClient();

  const getData = useCallback(async () => {
    const cursor =
      direction === "prev"
        ? pageCursors[currIndex].first
        : pageCursors[currIndex].last;

    const data = await getPersonalRecords(
      userId,
      cursor,
      direction,
      debouncedSearch
    );

    if (data.length > 0) {
      setPageCursors((prev) => {
        const next = [...prev];
        next[currIndex + 1] = {
          first: { createdAt: data[0].createdAt, id: data[0].id },
          last: {
            createdAt: data[data.length - 1].createdAt,
            id: data[data.length - 1].id,
          },
        };
        return next;
      });
    }

    return data as unknown as PRType[];
  }, [userId, currIndex, direction, debouncedSearch, pageCursors]);

  const updateEditedValue = (
    prId: string,
    updatedField: string,
    updatedVal: number
  ) => {
    queryClient.setQueryData(
      ["PRs", userId, currIndex, debouncedSearch],
      (oldPRs: PRType[]) => {
        if (!oldPRs) return;
        return oldPRs.map((pr) =>
          pr.id === prId
            ? { ...pr, prField: updatedField, prValue: updatedVal }
            : pr
        );
      }
    );
  };

  const { data: prs } = useQuery({
    queryKey: ["PRs", userId, currIndex, debouncedSearch],
    queryFn: getData,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setCurrIndex(0);
    setPageCursors([{ first: null, last: null }]);
    setDirection("next");

    queryClient.invalidateQueries({
      queryKey: ["PRs", userId],
      exact: false,
    });
  }, [debouncedSearch, queryClient, userId]);

  return (
    <div>
      <div className="flex justify-between mt-5">
        <h2 className="text-xl font-semibold text-zinc-700">
          Personal Records
        </h2>
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
      <div className="flex flex-col gap-2 mt-2">
        {prs && prs.length > 0 ? (
          prs.map((pr) => (
            <div key={pr.id} className="flex gap-2 bg-zinc-50 rounded-md pr-2">
              <PR pR={pr} />
              <div className="flex-center">
                <PREdit pr={pr} userId={userId} prUpdater={updateEditedValue} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-zinc-700">
            Your personal records will appear here.
          </p>
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
            disabled={!prs || prs.length < 5}
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

export default AllPRs;
