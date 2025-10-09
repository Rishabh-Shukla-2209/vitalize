"use client";
import SignInForm from "@/components/auth/SignInForm";

const SignInPage = () => {
  return <SignInForm />
};

export default SignInPage;
export const WorkoutsPage = () => {

  const { user, isSignedIn, isLoaded } = useUser();



  return (
    <div>
      <h1>Workout History</h1>
      <p>View your past workouts and track your progress.</p>

      <div className="flex">
        <p>Filter by: </p>
        <DatePicker label="" date={date} setDate={setDate} />
        <Selector
          placeholder="Muscle Group"
          choices={MuscleGroups}
          setChoice={setMuscleGroup}
          selectedValue={muscleGroup} />
      </div>

      <div>

      </div>
    </div>
  );
};
