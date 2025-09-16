"use client";
import React, { FormEvent, useState } from "react";
import { SignUpResource, SetActive, ClerkAPIError } from "@clerk/types";
import { useRouter } from "next/navigation";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

const VerifyForm = ({
  isLoaded,
  signUp,
  setActive,
}: {
  isLoaded: boolean;
  signUp: SignUpResource | undefined;
  setActive: SetActive | undefined;
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<ClerkAPIError[]>();
  const router = useRouter();
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp!.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive!({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/custom-flows/overview#session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.push("/dashboard");
          },
        });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) setError(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="bg-zinc-50 p-10 shadow-xl rounded-2xl flex flex-col w-md">
        <h1 className="text-black text-3xl font-medium">Verify your email</h1>
        <form onSubmit={handleVerify}>
          <label id="code" className="text-zinc-500 my-2">Enter your verification code</label>
          <input
            value={code}
            id="code"
            name="code"
            onChange={(e) => setCode(e.target.value)}
          />
          {error && (
              <span className="error">{error[0].longMessage}</span>
            )}
          <button
              type="submit"
              className="w-full bg-primary-dark hover:bg-primary py-2.5 font-medium text-lg rounded-3xl mt-1.5"
            >
              Submit
            </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyForm;
