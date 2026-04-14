import { Spinner } from "@/components/ui/spinner";

const loading = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default loading;
