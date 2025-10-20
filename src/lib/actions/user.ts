"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


export async function completeOnboarding(firstName: string, lastName: string) {
  const { userId } = await auth();

  if (!userId) {
    return { status: "error", message: "User not found." };
  }

  const client = await clerkClient();

  try {
    await client.users.updateUser(userId, {
      firstName,
      lastName,
      publicMetadata: {
        hasOnboarded: true, 
      },
    });
    revalidatePath("/", "layout");
    return { status: "success" };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { status: "error", message: "Something went wrong." };
  }
}