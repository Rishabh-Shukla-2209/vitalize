import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginSchemaType, loginSchema } from "@/validations/auth";
import Logo from "@/components/icons/Logo";
import Image from "next/image";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { OAuthStrategy } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import Link from "next/link";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const SignInForm = () => {
  const {
    register,
    setError,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();

  const SignInWith = (strategy: OAuthStrategy) => {
    if (!signIn) return null;
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/home",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err: unknown) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(err, null, 2);
      });
  };

  const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    try {
      if (!isLoaded) return;

      await signIn?.create({
        identifier: data.email,
        password: data.password,
      });

      if (signIn?.status === "complete") {
        await setActive({ session: signIn.createdSessionId });
        router.push("/home");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signIn, null, 2));
      }
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err))
        setError("root", {
          message: err.errors[0].message,
        });
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="h-full w-full mt-15 flex items-center justify-center">
      <div className="flex flex-col w-md lg:shadow-xl dark:shadow-zinc-900 rounded-3xl">
        <div className="flex-center my-3">
          <div className="h-15 w-15 bg-black flex-center rounded-4xl">
            <Logo />
          </div>
        </div>
        <div className="text-center">
          <h1>Welcome back</h1>
          <p className="my-2">
            Log in to continue your fitness journey.
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-50 dark:bg-sage-400 p-8 mt-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("email")} type="email" placeholder="Email"/>
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

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-right text-sm text-zinc-600 dark:text-zinc-100 cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-300"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              variant="default"
              type="submit"
              disabled={isSubmitting}
              className="text-lg rounded-3xl mt-1.5"
            >
              {isSubmitting ? <Spinner /> : "Login"}
            </Button>
            {errors.root && (
              <span className="error">{errors.root.message}</span>
            )}
          </form>
          <div>
            <div className="h-0.5 bg-zinc-500 mt-4.5" />
            <div className="flex-center my-1">
              <p>or</p>
            </div>
            <Button
              variant="outline"
              onClick={() => SignInWith("oauth_google")}
              className="w-full flex-center gap-2 py-5"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google logo"
                width={24}
                height={24}
              />
              <p>Login with Google</p>
            </Button>
            <p className="mt-10 text-center text-md">
              Don&apos;t have an account?{" "}
              <Link href={"/sign-up"} className="text-primary hover:font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
