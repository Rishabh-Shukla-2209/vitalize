import { useEffect, useState } from "react";

const AIWorkoutSkeletom = () => {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Dialing in the perfect mix of exercises for your goals…",
    "Balancing intensity and recovery to keep you progressing safely…",
    "Optimizing sets, reps, and volume for maximum results…",
    "Shaping your workout flow so every minute counts…",
    "Finalizing your personalized training plan… get ready to move.",
  ];
  
  useEffect(() => {
    const timer = setInterval(
      () => setTextIndex((prev: number) => prev > 4 ? prev : prev + 1),
      10000
    );

    return () => clearInterval(timer);
  }, []);

  return <div className="p-5 flex flex-col gap-5 w-full h-90 md:h-100 lg:120 boundary shimmer">
    {texts.map((text, index) => {
      return index <= textIndex ?  <p key={index}>{texts[index]}</p> : <></>
    })}
  </div>;
};

export default AIWorkoutSkeletom;
