"use client";

import { DatePicker } from "@/components/DatePicker";
import Selector from "@/components/Selector";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Gender } from "@/generated/prisma/enums";
import { completeOnboarding } from "@/lib/actions/user";
import { saveOnboardingData } from "@/lib/actions/user";
import { GenderOptions, handleAppError } from "@/lib/utils";
import { useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingFormValues, onboardingSchema } from "@/validations/auth";

const OnboardingPage = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { session } = useSession();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      height: "",
      weight: "",
      dob: undefined,
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [isLoaded, isSignedIn, user, reset]);

  const onSubmit = async (values: OnboardingFormValues) => {
    if (!user) return;

    try {
      await Promise.all([
        saveOnboardingData({
          firstName: values.firstName,
          lastName: values.lastName,
          imgUrl: user.imageUrl,
          weight: Number(values.weight),
          height: Number(values.height),
          gender: values.gender as Gender,
          dob: values.dob,
        }),
        completeOnboarding(values.firstName, values.lastName),
      ]);
      await session?.reload();
      router.refresh();
    } catch (error) {
      handleAppError(error);
    }
  };

  return isLoaded && isSignedIn ? (
    <div className="w-full flex justify-center">
      <div className="flex flex-col w-xl rounded-3xl px-10 py-5">
        <h1 className="text-center">Tell Us About Yourself</h1>
        <p className=" my-2 text-center">
          Please fill below details so that your progress can be tracked more
          accurately.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <p className="flex flex-col gap-1">
            <label
              htmlFor="firstName"
              className="text-zinc-600 dark:text-zinc-200"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter first name..."
              {...register("firstName")}
              className="bg-zinc-50 dark:bg-sage-400"
            />
            {errors.firstName && (
              <span className="error">{errors.firstName.message}</span>
            )}
          </p>

          <p className="flex flex-col gap-1">
            <label
              htmlFor="lastName"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter last name..."
              {...register("lastName")}
              className="bg-zinc-50 dark:bg-sage-400"
            />
            {errors.lastName && (
              <span className="error">{errors.lastName.message}</span>
            )}
          </p>

          <p className="flex items-center gap-5">
            <label>Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Selector
                  choices={GenderOptions}
                  setChoice={field.onChange}
                  placeholder={"Select your gender..."}
                  selectedValue={field.value}
                />
              )}
            />
            {errors.gender && (
              <span className="error">{errors.gender.message}</span>
            )}
          </p>

          <p className="flex flex-col gap-1">
            <label
              htmlFor="height"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Height (cm)
            </label>
            <input
              id="height"
              type="text"
              placeholder="Enter your height..."
              {...register("height")}
              className="bg-zinc-50 dark:bg-sage-400"
            />
            {errors.height && (
              <span className="error">{errors.height.message}</span>
            )}
          </p>

          <p className="flex flex-col gap-1">
            <label
              htmlFor="weight"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Weight (kg)
            </label>
            <input
              id="weight"
              type="text"
              placeholder="Enter your weight..."
              {...register("weight")}
              className="bg-zinc-50 dark:bg-sage-400"
            />
            {errors.weight && (
              <span className="error">{errors.weight.message}</span>
            )}
          </p>

          <div className="flex items-center">
            <label className="text-zinc-600 dark:text-zinc-200 mr-5">
              Date of Birth
            </label>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label=""
                  date={field.value}
                  setDate={field.onChange}
                />
              )}
            />
            {errors.dob && (
              <span className="error ml-5">{errors.dob.message}</span>
            )}
          </div>

          <Button
            type="submit"
            variant="default"
            className="text-lg py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <div className="w-full h-screen flex-center">
      <Spinner className="mb-50" />
    </div>
  );
};

export default OnboardingPage;
