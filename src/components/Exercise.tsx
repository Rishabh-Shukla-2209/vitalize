"use client";

import { ExerciseDetailsType } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import Icons from "./icons/appIcons";
import { toProperCase } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Exercise = ({ exercise }: { exercise: ExerciseDetailsType }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className="flex justify-between w-full p-5 cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex gap-3">
          <div className="relative h-15 w-15">
            <Image
              className="rounded-md"
              src={
                exercise.exercise.imgUrl
                  ? exercise.exercise.imgUrl
                  : "/workoutPlanImg.png"
              }
              alt="Exercise Image"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>
            <h3>{exercise.exercise.name}</h3>
            <ul className="flex gap-2 text-zinc-600">
              {exercise.sets > 0 && <li>{exercise.sets} sets • </li>}
              {exercise.reps > 0 && <li>{exercise.reps} reps • </li>}
              {exercise.distance && <li>{exercise.distance} km • </li>}
              {exercise.time && <li>{exercise.time} minutes • </li>}
              {exercise.rest > 0 && <li>{exercise.rest}s rest</li>}
            </ul>
          </div>
        </div>
        <div className="flex-center">
          {expanded && <Icons.collapse />}
          {!expanded && <Icons.expand />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-zinc-200 overflow-hidden p-5 flex flex-col gap-2 rounded-lg"
          >
            <h2>{exercise.exercise.name}</h2>
            <p>{exercise.exercise.instructions}</p>
            {exercise.exercise.category && (
              <div className="flex gap-2">
                <h3>Category: </h3>
                <p>
                  {toProperCase(exercise.exercise.category)}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <h3>Muscles Involved: </h3>
              <p>
                {toProperCase(exercise.exercise.muscleGroup)}
              </p>
            </div>
            {exercise.exercise.equipment && (
              <div className="flex gap-2">
                <h3>Equipment: </h3>
                <p>
                  {toProperCase(exercise.exercise.equipment)}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Exercise;
