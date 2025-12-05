import { auth } from "@clerk/nextjs/server";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/lib/errors";
import { getFollowingStatusQuery } from "./queries/user";
import { getPostPrivacy } from "./queries/community";

export const requireUser = async () => {
  const {userId} = await auth();
  if (!userId) throw new UnauthorizedError("You must be signed in");
  return userId;
};

export const ensureOwnership = (
  resourceOwnerId: string | null | undefined,
  currentUserId: string
) => {
  if (!resourceOwnerId) {
    throw new NotFoundError("Resource not found");
  }

  if (resourceOwnerId !== currentUserId) {
    throw new ForbiddenError("You do not have permission to modify this resource");
  }
}

export const ensurePostAccessibility = async (postId: string, userId: string) => {
  const {data: postInfo, error} = await getPostPrivacy(postId);
  if(error) throw error;

  if(postInfo?.privacy === "PUBLIC") return;

  const {data:followStatus, error: followError} = await getFollowingStatusQuery(userId, postInfo!.userid);
  if(followError) throw error;

  if(followStatus === "Accepted") return;

  throw new ForbiddenError("You do not have access to this post")
}


