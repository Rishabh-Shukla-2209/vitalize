"use client";

import Feed from "@/components/community/Feed";
import { useUser } from "@clerk/nextjs";

const CommunityPage = () => {
  const { user } = useUser();

  return (
    <div className="flex justify-center mt-5 w-full">
      {user && <Feed userId={user.id} />}
    </div>
  );
};

export default CommunityPage;
