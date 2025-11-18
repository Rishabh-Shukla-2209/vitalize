import { WorkoutLogType } from "@/lib/types";
import Icons from "./icons/appIcons";
import { Button } from "./ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExerciseLog from "./ExerciseLog";
import { format } from "date-fns";
import Link from "next/link";

const WorkoutHistoryCard = ({
  workout,
  action,
}: {
  workout: WorkoutLogType;
  action: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <div className="flex justify-between p-5 bg-zinc-100 rounded-lg">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <div className="flex-center bg-zinc-200 h-15 w-15 rounded-lg">
            <Icons.calendar className="text-primary" size={40} />
          </div>
          <div>
            <h3>{workout.plan.name}</h3>
            <ul className="flex gap-2 text-zinc-600">
              <li>{workout.duration} minutes •</li>
              <li>{workout.exercises.length} exercises</li>
            </ul>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {action === "repeat" ? (
            <Link href={`/workouts/${workout.planid}`}>
              <Button variant="default" className="text-lg">
                <Icons.repeat />
                Repeat
              </Button>
            </Link>
          ) : (
            <Link href={`/workouts/log-workout/${workout.planid}`}>
              <Button variant="default" className="text-lg">
                <Icons.log />
                Log Workout
              </Button>
            </Link>
          )}
          <div
            className="flex-center cursor-pointer"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded && <Icons.collapse />}
            {!expanded && <Icons.expand />}
          </div>
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
            <div className="flex justify-between">
              <h2>
                Workout Details
              </h2>
              <p>{format(workout.createdAt, "MMM do, yyyy")}</p>
            </div>
            <p>Notes: {workout.notes}</p>
            <div className="flex flex-col gap-5">
              {workout.exercises.map((exercise) => (
                <ExerciseLog
                  key={exercise.id}
                  exercise={exercise}
                  name={exercise.exercise.name}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutHistoryCard;
