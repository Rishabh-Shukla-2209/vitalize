"use client";

import { DatePicker } from "@/components/DatePicker";
import Selector from "@/components/Selector";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Gender } from "@/generated/prisma";
import { completeOnboarding } from "@/lib/actions/user";
import { saveOnboardingData } from "@/lib/queries";
import { GenderOptions } from "@/lib/utils";
import { useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const OnboardingPage = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const {session} = useSession();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState<Date>();
  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [dobError, setDobError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!submitAttempted) return;

    const validNames = /^[A-Za-z]+$/;
    if (!firstName) {
      setFirstNameError("Required");
      return;
    }
    if (firstName && !validNames.test(firstName)) {
      setFirstNameError("Invalid name. Name should only contain letters.");
      return;
    }

    setFirstNameError("");
  }, [firstName, submitAttempted]);

  useEffect(() => {
    if (!submitAttempted) return;

    const validNames = /^[A-Za-z]+$/;
    if (!lastName) {
      setLastNameError("Required");
      return;
    }
    if (lastName && !validNames.test(lastName)) {
      setLastNameError("Invalid name. Name should only contain letters.");
      return;
    }

    setLastNameError("");
  }, [lastName, submitAttempted]);

  useEffect(() => {
    if (!submitAttempted) return;

    const validValues = /^[1-9]\d*$/;

    if (!weight) {
      setWeightError("Required");
      return;
    }

    if (
      !validValues.test(weight) ||
      parseInt(weight) > 300 ||
      parseInt(weight) < 20
    ) {
      setWeightError("Enter a valid value between 20 and 300. No decimals.");
      return;
    }

    setWeightError("");
  }, [submitAttempted, weight]);

  useEffect(() => {
    if (!submitAttempted) return;

    const validValues = /^[1-9]\d*$/;

    if (!height) {
      setHeightError("Required");
      return;
    }

    if (
      !validValues.test(height) ||
      parseInt(height) > 250 ||
      parseInt(height) < 50
    ) {
      setHeightError("Enter a valid value between 50 and 250. No decimals.");
      return;
    }

    setHeightError("");
  }, [height, submitAttempted]);

  useEffect(() => {
    if (!submitAttempted) return;

    if (!dob) {
      setDobError("Required");
      return;
    }
    setDobError("");
  }, [dob, submitAttempted]);

  useEffect(() => {
    if (!submitAttempted) return;

    if (!gender) {
      setGenderError("Required");
      return;
    }

    setGenderError("");
  }, [gender, submitAttempted]);

  const areInputsValid = () => {
    let isValid = true;
    const validNames = /^[A-Za-z]+$/;
    const validValues = /^[1-9]\d*$/;

    // --- Validate First Name ---
    if (!firstName) {
      setFirstNameError("Required");
      isValid = false;
    } else if (!validNames.test(firstName)) {
      setFirstNameError("Invalid name. Name should only contain letters.");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    // --- Validate Last Name ---
    if (!lastName) {
      setLastNameError("Required");
      isValid = false;
    } else if (!validNames.test(lastName)) {
      setLastNameError("Invalid name. Name should only contain letters.");
      isValid = false;
    } else {
      setLastNameError("");
    }

    // --- Validate Weight ---
    if (!weight) {
      setWeightError("Required");
      isValid = false;
    } else if (
      !validValues.test(weight) ||
      parseInt(weight) > 300 ||
      parseInt(weight) < 20
    ) {
      setWeightError("Enter a valid value between 20 and 300. No decimals.");
      isValid = false;
    } else {
      setWeightError("");
    }

    // --- Validate Height ---
    if (!height) {
      setHeightError("Required");
      isValid = false;
    } else if (
      !validValues.test(height) ||
      parseInt(height) > 250 ||
      parseInt(height) < 50
    ) {
      setHeightError("Enter a valid value between 50 and 250. No decimals.");
      isValid = false;
    } else {
      setHeightError("");
    }

    // --- Validate DOB ---
    if (!dob) {
      setDobError("Required");
      isValid = false;
    } else {
      setDobError("");
    }

    // --- Validate Gender ---
    if (!gender) {
      setGenderError("Required");
      isValid = false;
    } else {
      setGenderError("");
    }

    return isValid;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!areInputsValid()) return;
    if (!user) return;
    setSubmitting(true);
    try {
      await Promise.all([
        saveOnboardingData(
          user.id,
          firstName,
          lastName,
          user.imageUrl,
          parseInt(weight),
          parseInt(height),
          gender as Gender,
          dob!
        ),
        completeOnboarding(firstName, lastName),
      ]);
      await session?.reload();
      router.refresh();
      
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };

  return isLoaded && isSignedIn ? (
    <div className="w-full flex justify-center">
      <div className="flex flex-col w-xl rounded-3xl px-10 py-5">
        <h1 className="text-center">
          Tell Us About Yourself
        </h1>
        <p className=" my-2 text-center">
          Please fill below details so that your progress can be tracked more
          accurately.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col">
          <p className="flex flex-col gap-1">
            <label htmlFor="firstName" className="text-zinc-600">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter first name..."
              defaultValue={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-zinc-50"
            />
            {firstNameError && <span className="error">{firstNameError}</span>}
          </p>
          <p className="flex flex-col gap-1">
            <label htmlFor="lastName" className="text-zinc-600">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter last name..."
              defaultValue={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-zinc-50"
            />
            {lastNameError && <span className="error">{lastNameError}</span>}
          </p>
          <p className="flex items-center gap-5">
            <label>Gender</label>
            <Selector
              choices={GenderOptions}
              setChoice={setGender}
              placeholder={"Select your gender..."}
              selectedValue={gender}
            />
            {genderError && <span className="error">{genderError}</span>}
          </p>
          <p className="flex flex-col gap-1">
            <label htmlFor="height" className="text-zinc-600">
              Height (cm)
            </label>
            <input
              id="height"
              type="text"
              placeholder="Enter your height..."
              defaultValue={height}
              onChange={(e) => setHeight(e.target.value)}
              className="bg-zinc-50"
            />
            {heightError && <span className="error">{heightError}</span>}
          </p>
          <p className="flex flex-col gap-1">
            <label htmlFor="weight" className="text-zinc-600">
              Weight (kg)
            </label>
            <input
              id="weight"
              type="text"
              placeholder="Enter your weight..."
              defaultValue={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-zinc-50"
            />
            {weightError && <span className="error">{weightError}</span>}
          </p>
          <div className="flex items-center">
            <label className="text-zinc-600 mr-5">Date of Birth</label>
            <DatePicker label="" date={dob} setDate={setDob} />
            {dobError && <span className="error ml-5">{dobError}</span>}
          </div>
          <Button
            type="submit"
            variant="default"
            className="text-lg py-2"
            disabled={submitting}
          >
            {submitting ? <Spinner /> : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <div className="w-full h-screen flex-center"><Spinner className="mb-50"/></div>
  );
};

export default OnboardingPage;
