"use client";

import { createAiWorkout } from "@/lib/actions/ai";
import { useEffect } from "react";

const AICoachPage = () => {
  useEffect(() => {
    const fn = async () => {
      createAiWorkout(
        "user_32lmZQf16AOvb8sAJXL3YzgmcSz",
        "",
        "",
        "STRENGTH",
        "INTERMEDIATE"
      );
    };

    fn();
  }, []);

  return <div>AICoachPage</div>;
};

export default AICoachPage;
