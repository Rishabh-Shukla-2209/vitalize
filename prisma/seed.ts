import {
  PrismaClient,
  Gender,
  Difficulty,
  ExerciseCategory,
  MuscleGroup,
  Equipment,
  Status,
  NotificationType,
  NotificationTargetType,
  LikeTargetType,
} from "@/generated/prisma";

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🗑️ Clearing existing data...");

  // Order matters if you don’t use cascade deletes
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.exerciseLog.deleteMany();
  await prisma.workoutLog.deleteMany();
  await prisma.planExercise.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.measurement.deleteMany();
  await prisma.aiInteraction.deleteMany();
  await prisma.exerciseCatalog.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Database cleared.");
}

async function seed() {
  console.log("🌱 Seeding database...");

  // --- USERS ---
  const alice = await prisma.user.create({
    data: {
      id: "user_alice",
      gender: Gender.FEMALE,
      dateOfBirth: new Date("1995-06-15"),
    },
  });

  const bob = await prisma.user.create({
    data: {
      id: "user_bob",
      gender: Gender.MALE,
      dateOfBirth: new Date("1992-02-20"),
    },
  });

  // --- EXERCISES ---
  const pushup = await prisma.exerciseCatalog.create({
    data: {
      name: "Push-up",
      category: ExerciseCategory.STRENGTH,
      muscleGroup: MuscleGroup.CHEST,
      equipment: Equipment.NONE,
      instructions: "Keep your body straight and lower chest to the floor.",
      createdByid: alice.id,
    },
  });

  const squat = await prisma.exerciseCatalog.create({
    data: {
      name: "Squat",
      category: ExerciseCategory.STRENGTH,
      muscleGroup: MuscleGroup.QUADS,
      equipment: Equipment.NONE,
      instructions: "Stand with feet shoulder-width apart and bend knees.",
      createdByid: bob.id,
    },
  });

  // --- WORKOUT PLAN ---
  const plan = await prisma.workoutPlan.create({
    data: {
      name: "Beginner Strength Plan",
      description: "A simple strength workout for beginners.",
      level: Difficulty.EASY,
      duration: 30,
      createdBy: { connect: { id: alice.id } },
      exercises: {
        create: [
          {
            position: 1,
            sets: 3,
            reps: 10,
            exercise: { connect: { id: pushup.id } },
          },
          {
            position: 2,
            sets: 3,
            reps: 15,
            exercise: { connect: { id: squat.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- WORKOUT LOG ---
  const log = await prisma.workoutLog.create({
    data: {
      userId: alice.id,
      planid: plan.id,
      duration: 28,
      createdAt: new Date(),
      exercises: {
        create: [
          {
            exerciseid: pushup.id,
            sets: 3,
            reps: 10,
            weightUsed: 0,
          },
          {
            exerciseid: squat.id,
            sets: 3,
            reps: 15,
            weightUsed: 0,
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- POST + COMMENT + LIKE ---
  const post = await prisma.post.create({
    data: {
      user: { connect: { id: alice.id } },
      title: "Great workout today!",
      body: "Finished my first strength plan 💪",
      workoutLog: { connect: { id: log.id } },
    },
  });

  await prisma.comment.create({
    data: {
      user: { connect: { id: bob.id } },
      post: { connect: { id: post.id } },
      text: "Nice job Alice!",
    },
  });

  await prisma.like.create({
    data: {
      target: LikeTargetType.POST,
      targetId: post.id,
      user: { connect: { id: bob.id } },
    },
  });

  // --- GOAL ---
  await prisma.goal.create({
    data: {
      user: { connect: { id: alice.id } },
      title: "Do 20 push-ups in one set",
      description: "Increase upper body strength",
      status: Status.PLANNED,
      targetExercise: { connect: { id: pushup.id } },
      targetReps: 20,
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days later
    },
  });

  // --- MEASUREMENT ---
  await prisma.measurement.create({
    data: {
      user: { connect: { id: alice.id } },
      height: 165,
      weight: 60,
      fatPct: 22.5,
    },
  });

  // --- NOTIFICATION ---
  await prisma.notification.create({
    data: {
      recipient: { connect: { id: alice.id } },
      actor: { connect: { id: bob.id } },
      type: NotificationType.LIKE,
      target: NotificationTargetType.LIKE_POST,
      targetId: post.id,
      payload: { message: "Bob liked your post" },
    },
  });

  // --- AI INTERACTION ---
  await prisma.aiInteraction.create({
    data: {
      user: { connect: { id: alice.id } },
      requestText: "Generate a 30-minute workout for beginners",
      response: { plan: "Push-ups, Squats, Planks" },
      model: "gpt-4o-mini",
      tokensInput: 15,
      tokensOutput: 30,
    },
  });

  console.log("✅ Seeding complete.");
}

async function main() {
  await resetDatabase();
  await seed();
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
