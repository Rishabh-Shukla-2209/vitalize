import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { registerSchema, RegisterSchemaType } from "@/validations/auth";
import Logo from "@/components/icons/Logo";
import Image from "next/image";
import { useSignUp } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import Link from "next/link";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useState } from "react";
import VerifyForm from "./VerifyForm";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const SignUpForm = () => {
  const {
    register,
    setError,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const { signUp, isLoaded, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);

  const signUpWith = (strategy: OAuthStrategy) => {
    if (!signUp) return null;
    return signUp
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/home",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err: unknown) => {
        if (isClerkAPIResponseError(err)) console.log(err);

        console.error(JSON.stringify(err, null, 2));
      });
  };

  const onSubmit: SubmitHandler<RegisterSchemaType> = async (data) => {
    try {
      if (!isLoaded) return;

      await signUp?.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err))
        setError("root", {
          message: err.errors[0].message,
        });
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (verifying)
    return (
      <VerifyForm isLoaded={isLoaded} setActive={setActive} signUp={signUp} />
    );

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col w-md shadow-xl rounded-3xl">
        <div className="flex-center my-3">
          <div className="h-15 w-15 bg-black flex-center rounded-4xl">
            <Logo />
          </div>
        </div>
        <div className="text-center">
          <h1>Create your account</h1>
          <p className="my-2">
            Start your journey to a healthier you.
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-50 p-8 mt-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("email")} type="email" placeholder="Email" />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword.message}</span>
            )}
            <Button
              variant="default"
              type="submit"
              disabled={isSubmitting}
              className="text-lg rounded-3xl mt-1.5"
            >
              {isSubmitting ? <Spinner /> : "Create Account"}
            </Button>
            {errors.root && (
              <span className="error">{errors.root.message}</span>
            )}
          </form>
          <div>
            <div className="h-0.5 bg-zinc-500 mt-2.5" />
            <div className="flex-center my-1">
              <p>or</p>
            </div>
            <Button
              variant="outline"
              onClick={() => signUpWith("oauth_google")}
              className="w-full flex-center gap-2"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google logo"
                width={24}
                height={24}
              />
              <p>Signup with Google</p>
            </Button>
            <p className="mt-10 text-center text-md">
              Already have an account?{" "}
              <Link href={"/sign-in"} className="text-primary hover:font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
