"use server";

import { aiWorkoutSchema, AiWorkoutSchemaType } from "@/validations/ai";
import { openai } from "../openai";
import { getAvailableExercises, saveAiWorkout } from "../queries";
import {
  DifficultyType,
  EquipmentType,
  ExerciseCategoryType,
  MuscleGroupType,
} from "../types";

import type { ChatCompletion } from "openai/resources/chat/completions";

const getPrompt = async (
  muscleGroup: MuscleGroupType | "",
  equipment: EquipmentType | "",
  category: ExerciseCategoryType | "",
  difficulty: DifficultyType
) => {
  const availableExercises = await getAvailableExercises(
    muscleGroup,
    equipment,
    category
  );

  const prompt = `
You are a workout planner AI.

Your goal: generate a structured workout as JSON only (no extra text).

Rules:
1. Use ONLY exercises from the list below.
2. Reference them using their "id".
3. Always return valid JSON matching this structure:

{
    "name": string,
    "description": string,
    "level": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    "duration": number,
    "exercises": [
      {
        "position": number,
        "sets": number,
        "reps": number,
        "rest": number,
        "exerciseId": string,
        "distance"?: number (optional),
        "time"?: number (optional),
      }
    ]
    "imgUrl": string (optional),
}

Available exercises:
${JSON.stringify(availableExercises, null, 2)}

Now generate a ${difficulty} ${muscleGroup} ${category} workout.
Return JSON only — no markdown or prose.
`;

  return prompt;
};

const getResponseWithTimeout = async (
  prompt: string,
  timeoutMs = 15000
): Promise<ChatCompletion> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("OpenAI request timed out")), timeoutMs)
  );

  const openAiCall = openai.chat.completions.create({
    model: "gpt-5-mini",
    temperature: 0.3,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_completion_tokens: 2000,
  });

  return Promise.race([openAiCall, timeout]);
};

const transformForPrisma = (aiWorkout: AiWorkoutSchemaType, userId: string) => {
  const result = {
    ...aiWorkout,
    user: {connect: {id: userId}},
    exercises: {
      create: aiWorkout.exercises.map((e) => ({
        ...e,
        exercise: {
          connect: { id: e.exerciseId },
        },
      })),
    },
  };

  return result;
};

export const createAiWorkout = async (
  userId: string,
  muscleGroup: MuscleGroupType | "",
  equipment: EquipmentType | "",
  category: ExerciseCategoryType,
  difficulty: DifficultyType
) => {
  let prompt = await getPrompt(muscleGroup, equipment, category, difficulty);

  let attempt = 1;
  let result: AiWorkoutSchemaType | undefined;

  while (attempt <= 3) {
    try {
      const aiResponse = await getResponseWithTimeout(prompt);
      const messageContent = aiResponse.choices?.[0]?.message?.content;
      if (!messageContent) throw new Error("No AI response content received.");
      const aiOutput = JSON.parse(messageContent);
      const parsed = aiWorkoutSchema.safeParse(aiOutput);
      if (parsed.success) {
        result = parsed.data;
        break;
      }

      attempt++;

      const feedbackIssues = parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        problem: i.message,
      }));
      prompt = `${await getPrompt(
        muscleGroup,
        equipment,
        category,
        difficulty
      )} \n The previous response failed validation. Fix the following issues: \n ${JSON.stringify(
        feedbackIssues,
        null,
        2
      )}`;
      if (process.env.NODE_ENV === "development") {
        console.log(
          "Invalid workout. Retrying with feedback...",
          feedbackIssues
        );
      }
    } catch (error) {
      console.error("OpenAI API call failed:", error);
    }
  }

  if (!result) {
    throw new Error("AI could not create the Workout");
  }

  const workoutPlan = transformForPrisma(result, userId);
  console.log(workoutPlan);
  
//   await saveAiWorkout(workoutPlan);

//   return workoutPlan;
};
