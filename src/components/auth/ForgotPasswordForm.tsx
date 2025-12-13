import React, { useEffect, useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const ForgotPasswordForm: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/home");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then(() => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({
            session: result.createdSessionId,
            navigate: async ({ session }) => {
              if (session?.currentTask) {
                // Check for tasks and navigate to custom UI to help users resolve them
                // See https://clerk.com/docs/custom-flows/overview#session-tasks
                console.log(session?.currentTask);
                return;
              }

              router.push("/home");
            },
          });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <div className="h-full w-full mt-15 mx-4 flex items-center justify-center">
      <div className="bg-zinc-100 dark:bg-sage-400 p-10 lg:shadow-xl rounded-2xl flex flex-col w-100 md:w-md">
        <h2 className="mb-6">Forgot Password?</h2>
        <form onSubmit={!successfulCreation ? create : reset}>
          {!successfulCreation && (
            <>
              <label htmlFor="email">Provide your email address</label>
              <input
                type="email"
                placeholder="e.g john@doe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                variant="default"
                className="py-2.5 font-semibold rounded-3xl mt-1.5"
              >
                Send password reset code
              </Button>
              {error && <p className="error">{error}</p>}
            </>
          )}

          {successfulCreation && (
            <>
              <label htmlFor="password">Enter your new password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label htmlFor="code">
                Enter the password reset code that was sent to your email
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              <Button
                variant="default"
                className="font-semibold rounded-3xl mt-1.5"
              >
                Reset
              </Button>
              {error && <p className="error">{error}</p>}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
