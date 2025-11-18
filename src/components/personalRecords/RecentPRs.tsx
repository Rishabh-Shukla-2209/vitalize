import PR from "./PR";
import { useQuery } from "@tanstack/react-query";
import { getRecentPersonalRecords } from "@/lib/queries";
import PRSkeleton from "./PRSkeleton";
import Link from "next/link";

const PRs = ({ userId }: { userId: string }) => {
  const { data: { prs, countOfTotalPRs } = {}, isLoading, isError } = useQuery({
    queryKey: ["PRs"],
    queryFn: () => getRecentPersonalRecords(userId),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <PRSkeleton />;
  }

  return (
    <div className="boundary w-full h-255 px-5 py-3">
      <h3 className="mb-1.5">Personal Records</h3>
      <div className="flex flex-col gap-2">
        {prs && prs.length > 0 ? (
          prs.map((pr) => <PR key={pr.id} pR={pr} />)
        ) : (
          <p>
            {isError
              ? "Error fetching your PRs"
              : "Your personal records will appear here."}
          </p>
        )}
        {countOfTotalPRs && countOfTotalPRs > 11 && (
          <Link href="/profile" className="text-red-500 text-center mt-2">
            See more...
          </Link>
        )}
      </div>
    </div>
  );
};

export default PRs;
