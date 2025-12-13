"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateDemoToken } from "@/lib/actions/user";
import { toast } from "sonner";
import { handleAppError } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import Icons from "../icons/appIcons";

export function DemoUserButton({
  classes,
  size,
}: {
  classes?: string;
  size?: "default" | "sm" | "lg";
}) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDemoLogin = async () => {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const result = await generateDemoToken();

      if (!result?.ticket) {
        toast.error("Something went wrong.");
        return;
      }

      const signInAttempt = await signIn.create({
        strategy: "ticket",
        ticket: result.ticket,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        toast.success("Welcome! You are now logged in.");
        router.push("/home");
      } else {
        toast.error("Demo login failed. Please try again.");
      }
    } catch (err) {
      handleAppError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDemoLogin}
      disabled={isLoading}
      className={classes ?? ""}
      size={size ? size : "default"}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Icons.bolt fill="black" className="dark:inline hidden" />
          <Icons.bolt fill="white" className="dark:hidden" />
          <span>Try Demo User</span>
        </>
      )}
    </Button>
  );
}
