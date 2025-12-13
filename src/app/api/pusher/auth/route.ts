import { pusherServer } from "@/lib/pusher-server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.text();
  const params = new URLSearchParams(body);

  const socketId = params.get("socket_id");
  const channelName = params.get("channel_name");

  if (!socketId || !channelName) {
    return new Response("Bad Request", { status: 400 });
  }

  if (channelName !== `private-user-${userId}`) {
    return new Response("Forbidden", { status: 403 });
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channelName);

  return new Response(JSON.stringify(authResponse), {
    headers: { "Content-Type": "application/json" },
  });
}
