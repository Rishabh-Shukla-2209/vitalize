import PR from "./PR";
import { useQuery } from "@tanstack/react-query";
import { getRecentPersonalRecords } from "@/lib/actions/pr";
import PRSkeleton from "./PRSkeleton";
import Link from "next/link";

const PRs = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["PRs"],
    queryFn: () => getRecentPersonalRecords(),
    staleTime: Infinity,
  });

  if (isLoading) {
    return <PRSkeleton />;
  }

  return (
    <div className="boundary w-full px-5 py-3">
      <h3 className="mb-1.5">Personal Records</h3>
      <div className="flex flex-col gap-2">
        {data?.prs && data.prs.length > 0 ? (
          data.prs.map((pr) => <PR key={pr.id} pR={pr} />)
        ) : (
          <p>
            {isError
              ? "Error fetching your PRs"
              : "Your personal records will appear here."}
          </p>
        )}
        {(data?.countOfTotalPRs ?? 0) > 11 && (
          <Link href="/profile" className="text-primary text-center mt-2">
            See more...
          </Link>
        )}
      </div>
    </div>
  );
};

export default PRs;
