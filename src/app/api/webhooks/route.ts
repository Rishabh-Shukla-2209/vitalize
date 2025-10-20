import { createUser } from "@/lib/db";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;
    if (eventType === "user.created" && evt.data.id) {
      await createUser(evt.data.id, evt.data.email_addresses[0].email_address);
    }

    return new Response("Webhook received", { status: 200 });
    
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
