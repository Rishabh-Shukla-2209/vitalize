"use server";

import { aiWorkoutSchema, AiWorkoutSchemaType } from "@/validations/ai";
import { openai } from "../openai";
import { getAvailableExercises, saveAiWorkout } from "../queries";
import {
  DifficultyType,
  ExerciseCategoryType,
  MuscleGroupType,
} from "../types";

import type { ChatCompletion } from "openai/resources/chat/completions";

const getPrompt = async (
  muscleGroups: Array<MuscleGroupType>,
  category: ExerciseCategoryType,
  difficulty: DifficultyType
) => {
  const availableExercises = await getAvailableExercises(
    muscleGroups,
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
        "name": string,
        "benefit: string (max 50 characters)
        "sets": number,
        "reps": number,
        "rest": number,
        "exerciseId": string,
        "distance"?: number (optional),
        "time"?: number (optional),
      }
    ]
}

Available exercises:
${JSON.stringify(availableExercises, null, 2)}

Now generate a ${difficulty} ${category} workout for ${JSON.stringify(muscleGroups)} muscle groups.
Return JSON only — no markdown or prose.
`;

  return prompt;
};

async function getResponseWithTimeout(
  prompt: string,
  timeoutMs = 60000
): Promise<ChatCompletion> {
  let timeoutId: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error("OpenAI request timed out")),
      timeoutMs
    );
  });

  try {
    const response = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_completion_tokens: 5000,
      }),
      timeoutPromise,
    ]);
    if (timeoutId) clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    throw error;
  }
}

const transformForPrisma = (aiWorkout: AiWorkoutSchemaType, userId: string) => {
  const result = {
    ...aiWorkout,
    createdBy: { connect: { id: userId } },
    exercises: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      create: aiWorkout.exercises.map(({ exerciseId, name, benefit, ...rest }) => ({
        ...rest,
        exercise: {
          connect: { id: exerciseId },
        },
      })),
    },
  };

  return result;
};

export const createAiWorkout = async (
  muscleGroups: Array<MuscleGroupType>,
  category: ExerciseCategoryType,
  difficulty: DifficultyType
) => {
  
  let prompt = await getPrompt(muscleGroups, category, difficulty);  
  
  let attempt = 1;
  let result: AiWorkoutSchemaType | undefined;

  while (attempt <= 3) {
    try {
      const aiResponse = await getResponseWithTimeout(prompt);
      const messageContent = aiResponse.choices?.[0]?.message?.content;
      if (!messageContent) {
        throw new Error("No AI response content received.");
      }
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
        muscleGroups,
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

  return result;
};

export const saveToDB = async (userId: string, aiResult: AiWorkoutSchemaType) => {
  const workoutPlan = transformForPrisma(aiResult, userId);
  return await saveAiWorkout(workoutPlan);
}