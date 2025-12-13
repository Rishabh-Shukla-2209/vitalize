import {
  Gender,
  Difficulty,
  ExerciseCategory,
  MuscleGroup,
  Equipment,
} from "@/generated/prisma/enums";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DIRECT_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetDatabase() {
  console.log("🗑️ Clearing existing data...");

  await prisma.notification.deleteMany();
  await prisma.postLike.deleteMany();
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
  const shreya = await prisma.user.create({
    data: {
      id: "user_33K1mMWNnwvEn6j4huA0jMmw2Du",
      gender: Gender.FEMALE,
      dateOfBirth: new Date("1995-06-15"),
    },
  });

  const zoya = await prisma.user.create({
    data: {
      id: "user_33K1hWoTa9eSsgAt2e7ehkTNkcB",
      gender: Gender.FEMALE,
      dateOfBirth: new Date("2005-01-10"),
    },
  });

  const aadya = await prisma.user.create({
    data: {
      id: "user_33K1bv1Zec8jmGIOYAoYSvO7BCo",
      gender: Gender.FEMALE,
      dateOfBirth: new Date("1998-09-07"),
    },
  });

  const aarav = await prisma.user.create({
    data: {
      id: "user_33K1B8jRT6b9Y6Xii3ocSH5ewbZ",
      gender: Gender.MALE,
      dateOfBirth: new Date("1998-05-06"),
    },
  });
  const riya = await prisma.user.create({
    data: {
      id: "user_33K1fQ6yTMdm71mvzCC0C1GZ39I",
      gender: Gender.FEMALE,
      dateOfBirth: new Date("1995-11-18"),
    },
  });

  const ananya = await prisma.user.create({
    data: {
      id: "user_33K1ZkyUJ6QFsybzrmL8c8XUuDt",
      gender: Gender.FEMALE,
      dateOfBirth: new Date("1997-03-10"),
    },
  });
  const vihaan = await prisma.user.create({
    data: {
      id: "user_33K1RThXJXucJt8wbrsffA15lGY",
      gender: Gender.MALE,
      dateOfBirth: new Date("1996-10-13"),
    },
  });

  const reyansh = await prisma.user.create({
    data: {
      id: "user_33K1VLGrfecrH1iH9GILVNlIuDC",
      gender: Gender.MALE,
      dateOfBirth: new Date("1999-12-17"),
    },
  });
  const ishan = await prisma.user.create({
    data: {
      id: "user_33K1OuhazSOcOeSltYwVAhG26GN",
      gender: Gender.MALE,
      dateOfBirth: new Date("1999-12-09"),
    },
  });

  const devansh = await prisma.user.create({
    data: {
      id: "user_33K1LILynATF0RvFTLOUpWPgeWg",
      gender: Gender.MALE,
      dateOfBirth: new Date("1992-02-20"),
    },
  });
  const arjun = await prisma.user.create({
    data: {
      id: "user_33K1Fk5zH2yY8tKw155FxtaPjoZ",
      gender: Gender.MALE,
      dateOfBirth: new Date("2005-05-29"),
    },
  });

  const rishabh = await prisma.user.create({
    data: {
      id: "user_32lmZQf16AOvb8sAJXL3YzgmcSz",
      gender: Gender.MALE,
      dateOfBirth: new Date("1997-08-04"),
    },
  });

  // --- EXERCISES ---
  //Cardio
  const jumpRope = await prisma.exerciseCatalog.create({
    data: {
      name: "Jump Rope",
      category: ExerciseCategory.CARDIO,
      instructions:
        "Jump continuously over the rope while rotating your wrists to maintain rhythm.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.JUMP_ROPE,
      createdByid: null,
    },
  });

  const cycling = await prisma.exerciseCatalog.create({
    data: {
      name: "Cycling (Stationary Bike)",
      category: ExerciseCategory.CARDIO,
      instructions:
        "Pedal continuously with resistance set to a comfortable but challenging level.",
      muscleGroup: MuscleGroup.QUADS,
      equipment: Equipment.BIKE,
      createdByid: null,
    },
  });

  const elliptical = await prisma.exerciseCatalog.create({
    data: {
      name: "Elliptical Trainer",
      category: ExerciseCategory.CARDIO,
      instructions:
        "Move legs and arms in sync, maintaining smooth and controlled motion.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.ELLIPTICAL,
      createdByid: null,
    },
  });

  // --- STRENGTH EXERCISES ---
  const benchPress = await prisma.exerciseCatalog.create({
    data: {
      name: "Bench Press",
      category: ExerciseCategory.STRENGTH,
      instructions:
        "Lie on a bench, lower the barbell to your chest, then press it back up.",
      muscleGroup: MuscleGroup.CHEST,
      equipment: Equipment.BARBELL,
      createdByid: null,
    },
  });

  const deadlift = await prisma.exerciseCatalog.create({
    data: {
      name: "Deadlift",
      category: ExerciseCategory.STRENGTH,
      instructions:
        "Stand with feet hip-width apart, grip the barbell, and lift it by driving through your legs and hips.",
      muscleGroup: MuscleGroup.HAMSTRINGS,
      equipment: Equipment.BARBELL,
      createdByid: null,
    },
  });

  const squat = await prisma.exerciseCatalog.create({
    data: {
      name: "Squat",
      category: ExerciseCategory.STRENGTH,
      instructions:
        "Lower your body by bending your knees and hips, keeping your chest upright, then stand back up.",
      muscleGroup: MuscleGroup.QUADS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const barbellSquats = await prisma.exerciseCatalog.create({
    data: {
      name: "Barbell Squat",
      category: ExerciseCategory.STRENGTH,
      instructions:
        "Lower your body by bending your knees and hips, keeping your chest upright, then stand back up.",
      muscleGroup: MuscleGroup.QUADS,
      equipment: Equipment.BARBELL,
      createdByid: null,
    },
  });

  const pullUp = await prisma.exerciseCatalog.create({
    data: {
      name: "Pull-Up",
      category: ExerciseCategory.STRENGTH,
      instructions:
        "Hang from a bar with palms facing away and pull yourself up until your chin clears the bar.",
      muscleGroup: MuscleGroup.BACK,
      equipment: Equipment.PULL_UP_BAR,
      createdByid: null,
    },
  });

  const bicepCurl = await prisma.exerciseCatalog.create({
    data: {
      name: "Bicep Curl",
      category: ExerciseCategory.STRENGTH,
      instructions:
        "Hold dumbbells at your sides and curl them upward, keeping elbows close to your torso.",
      muscleGroup: MuscleGroup.BICEPS,
      equipment: Equipment.DUMBBELL,
      createdByid: null,
    },
  });

  // --- FLEXIBILITY EXERCISES ---
  const forwardFold = await prisma.exerciseCatalog.create({
    data: {
      name: "Forward Fold Stretch",
      category: ExerciseCategory.FLEXIBILITY,
      instructions:
        "Stand tall, hinge at the hips, and fold forward to stretch your hamstrings.",
      muscleGroup: MuscleGroup.HAMSTRINGS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const pigeonPose = await prisma.exerciseCatalog.create({
    data: {
      name: "Pigeon Pose",
      category: ExerciseCategory.FLEXIBILITY,
      instructions:
        "From plank, bring one knee forward and place it in front of you while extending the other leg back.",
      muscleGroup: MuscleGroup.GLUTES,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const catCow = await prisma.exerciseCatalog.create({
    data: {
      name: "Cat-Cow Stretch",
      category: ExerciseCategory.FLEXIBILITY,
      instructions:
        "Alternate between arching your back (cow) and rounding it (cat) while on all fours.",
      muscleGroup: MuscleGroup.LOWER_BACK,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const childsPose = await prisma.exerciseCatalog.create({
    data: {
      name: "Child’s Pose",
      category: ExerciseCategory.FLEXIBILITY,
      instructions:
        "Sit back on your heels, stretch your arms forward, and relax your forehead to the ground.",
      muscleGroup: MuscleGroup.LATS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  // --- HIIT EXERCISES ---
  const burpeePushup = await prisma.exerciseCatalog.create({
    data: {
      name: "Burpee to Push-Up",
      category: ExerciseCategory.HIIT,
      instructions:
        "Drop into a squat, kick feet back into plank, do a push-up, return to squat, and jump up explosively.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const jumpSquats = await prisma.exerciseCatalog.create({
    data: {
      name: "Jump Squats",
      category: ExerciseCategory.HIIT,
      instructions:
        "Perform a squat, then explode upward into a jump and land softly into the next rep.",
      muscleGroup: MuscleGroup.QUADS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const mountainClimbers = await prisma.exerciseCatalog.create({
    data: {
      name: "Mountain Climbers",
      category: ExerciseCategory.HIIT,
      instructions:
        "From a plank position, drive your knees alternately toward your chest at a fast pace.",
      muscleGroup: MuscleGroup.ABS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  // --- CORE EXERCISES ---
  const plank = await prisma.exerciseCatalog.create({
    data: {
      name: "Plank",
      category: ExerciseCategory.CORE,
      instructions:
        "Hold a push-up position with your body straight from head to heels, engaging your abs.",
      muscleGroup: MuscleGroup.ABS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const russianTwist = await prisma.exerciseCatalog.create({
    data: {
      name: "Russian Twist",
      category: ExerciseCategory.CORE,
      instructions:
        "Sit with knees bent, lean back slightly, and rotate your torso side to side while holding a weight.",
      muscleGroup: MuscleGroup.OBLIQUES,
      equipment: Equipment.MEDICINE_BALL,
      createdByid: null,
    },
  });

  const hangingLegRaise = await prisma.exerciseCatalog.create({
    data: {
      name: "Hanging Leg Raise",
      category: ExerciseCategory.CORE,
      instructions:
        "Hang from a pull-up bar and raise your legs straight up until parallel with the floor.",
      muscleGroup: MuscleGroup.ABS,
      equipment: Equipment.PULL_UP_BAR,
      createdByid: null,
    },
  });

  // --- FLEXIBILITY (continued) ---
  const overheadShoulderStretch = await prisma.exerciseCatalog.create({
    data: {
      name: "Overhead Shoulder Stretch",
      category: ExerciseCategory.FLEXIBILITY,
      instructions:
        "Raise one arm overhead, bend at the elbow, and use the opposite hand to gently pull for a stretch.",
      muscleGroup: MuscleGroup.SHOULDERS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const chestOpener = await prisma.exerciseCatalog.create({
    data: {
      name: "Chest Opener Stretch",
      category: ExerciseCategory.FLEXIBILITY,
      instructions:
        "Stand in a doorway, place arms at shoulder height against the frame, and gently lean forward.",
      muscleGroup: MuscleGroup.CHEST,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  // --- HIIT (continued) ---
  const battleRopes = await prisma.exerciseCatalog.create({
    data: {
      name: "Battle Ropes",
      category: ExerciseCategory.HIIT,
      instructions:
        "Grip ropes in each hand and alternate slamming or waving them explosively.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.RESISTANCE_BAND, // proxy for ropes
      createdByid: null,
    },
  });

  const dumbbellThrusters = await prisma.exerciseCatalog.create({
    data: {
      name: "Dumbbell Thrusters",
      category: ExerciseCategory.HIIT,
      instructions:
        "Hold dumbbells at shoulders, perform a squat, then press overhead explosively as you stand.",
      muscleGroup: MuscleGroup.SHOULDERS,
      equipment: Equipment.DUMBBELL,
      createdByid: null,
    },
  });

  const sprintIntervals = await prisma.exerciseCatalog.create({
    data: {
      name: "Sprint Intervals",
      category: ExerciseCategory.HIIT,
      instructions:
        "Alternate between short sprints and recovery jogs for timed rounds.",
      muscleGroup: MuscleGroup.HAMSTRINGS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const jumpLunges = await prisma.exerciseCatalog.create({
    data: {
      name: "Jump Lunges",
      category: ExerciseCategory.HIIT,
      instructions:
        "Lunge down, then explode upward, switching legs midair before landing softly.",
      muscleGroup: MuscleGroup.GLUTES,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const skaterJumps = await prisma.exerciseCatalog.create({
    data: {
      name: "Skater Jumps",
      category: ExerciseCategory.HIIT,
      instructions:
        "Jump laterally side-to-side, landing on one foot with the opposite leg crossing behind.",
      muscleGroup: MuscleGroup.ABDUCTORS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  // --- CORE (continued) ---
  const sitUps = await prisma.exerciseCatalog.create({
    data: {
      name: "Sit-Ups",
      category: ExerciseCategory.CORE,
      instructions:
        "Lie on your back with knees bent, curl your torso up toward your thighs, then lower slowly.",
      muscleGroup: MuscleGroup.ABS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const flutterKicks = await prisma.exerciseCatalog.create({
    data: {
      name: "Flutter Kicks",
      category: ExerciseCategory.CORE,
      instructions:
        "Lie on your back, lift legs slightly, and alternate small up-and-down kicks.",
      muscleGroup: MuscleGroup.ABS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const vUps = await prisma.exerciseCatalog.create({
    data: {
      name: "V-Ups",
      category: ExerciseCategory.CORE,
      instructions:
        "Lie flat, then simultaneously raise your legs and torso, reaching hands toward toes.",
      muscleGroup: MuscleGroup.ABS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const cableWoodchoppers = await prisma.exerciseCatalog.create({
    data: {
      name: "Cable Woodchoppers",
      category: ExerciseCategory.CORE,
      instructions:
        "Pull a cable from high to low across your body in a chopping motion, engaging obliques.",
      muscleGroup: MuscleGroup.OBLIQUES,
      equipment: Equipment.CABLE,
      createdByid: null,
    },
  });

  const stabilityBallCrunches = await prisma.exerciseCatalog.create({
    data: {
      name: "Stability Ball Crunches",
      category: ExerciseCategory.CORE,
      instructions:
        "Lie back on a stability ball, curl your torso upward, then slowly lower back down.",
      muscleGroup: MuscleGroup.ABS,
      equipment: Equipment.STABILITY_BALL,
      createdByid: null,
    },
  });

  // --- BALANCE EXERCISES ---
  const singleLegDeadlift = await prisma.exerciseCatalog.create({
    data: {
      name: "Single-Leg Deadlift",
      category: ExerciseCategory.BALANCE,
      instructions:
        "Hold a dumbbell, hinge forward on one leg, keeping the back straight, then return upright.",
      muscleGroup: MuscleGroup.HAMSTRINGS,
      equipment: Equipment.DUMBBELL,
      createdByid: null,
    },
  });

  const warriorIII = await prisma.exerciseCatalog.create({
    data: {
      name: "Warrior III Pose",
      category: ExerciseCategory.BALANCE,
      instructions:
        "Stand on one leg, extend the other leg straight back, and reach arms forward, keeping balance.",
      muscleGroup: MuscleGroup.GLUTES,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const birdDog = await prisma.exerciseCatalog.create({
    data: {
      name: "Bird Dog",
      category: ExerciseCategory.BALANCE,
      instructions:
        "On hands and knees, extend opposite arm and leg, then return and switch sides.",
      muscleGroup: MuscleGroup.LOWER_BACK,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const stabilityBallPike = await prisma.exerciseCatalog.create({
    data: {
      name: "Stability Ball Pike",
      category: ExerciseCategory.BALANCE,
      instructions:
        "With feet on a stability ball, roll the ball forward by raising your hips into a pike position.",
      muscleGroup: MuscleGroup.ABS,
      equipment: Equipment.STABILITY_BALL,
      createdByid: null,
    },
  });

  // --- ENDURANCE EXERCISES ---
  const longRun = await prisma.exerciseCatalog.create({
    data: {
      name: "Long-Distance Running",
      category: ExerciseCategory.ENDURANCE,
      instructions:
        "Run at a steady pace for an extended period to build cardiovascular endurance.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const enduranceRow = await prisma.exerciseCatalog.create({
    data: {
      name: "Rowing (Endurance)",
      category: ExerciseCategory.ENDURANCE,
      instructions:
        "Row at a moderate pace continuously for a set time or distance.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.ROWING_MACHINE,
      createdByid: null,
    },
  });

  const stairClimb = await prisma.exerciseCatalog.create({
    data: {
      name: "Stair Climb",
      category: ExerciseCategory.ENDURANCE,
      instructions:
        "Climb stairs or use a stair machine continuously for an extended period.",
      muscleGroup: MuscleGroup.HAMSTRINGS,
      equipment: Equipment.MACHINE,
      createdByid: null,
    },
  });

  const enduranceSwim = await prisma.exerciseCatalog.create({
    data: {
      name: "Swimming (Endurance)",
      category: ExerciseCategory.ENDURANCE,
      instructions: "Swim continuous laps at a steady pace to build stamina.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.NONE, // proxy since pool isn't in enums
      createdByid: null,
    },
  });

  // --- RECOVERY EXERCISES ---

  const lightJog = await prisma.exerciseCatalog.create({
    data: {
      name: "Light Jog",
      category: ExerciseCategory.RECOVERY,
      instructions: "Jog at a relaxed pace to loosen muscles and aid recovery.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const hamstringStretchRecovery = await prisma.exerciseCatalog.create({
    data: {
      name: "Hamstring Stretch",
      category: ExerciseCategory.RECOVERY,
      instructions:
        "Lie on your back, raise one leg, and gently pull it toward you with hands or a strap.",
      muscleGroup: MuscleGroup.HAMSTRINGS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const gluteBridgeRecovery = await prisma.exerciseCatalog.create({
    data: {
      name: "Glute Bridge (Activation)",
      category: ExerciseCategory.RECOVERY,
      instructions:
        "Lie on your back with knees bent, lift hips upward, squeeze glutes, and lower.",
      muscleGroup: MuscleGroup.GLUTES,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  // --- MINDBODY EXERCISES ---
  const sunSalutation = await prisma.exerciseCatalog.create({
    data: {
      name: "Sun Salutation",
      category: ExerciseCategory.MINDBODY,
      instructions:
        "Flow through a series of yoga poses including forward fold, plank, and upward dog.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const warriorII = await prisma.exerciseCatalog.create({
    data: {
      name: "Warrior II",
      category: ExerciseCategory.MINDBODY,
      instructions:
        "Step into a wide stance, extend arms, bend front knee, and gaze over your hand.",
      muscleGroup: MuscleGroup.QUADS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const seatedMeditation = await prisma.exerciseCatalog.create({
    data: {
      name: "Seated Meditation",
      category: ExerciseCategory.MINDBODY,
      instructions:
        "Sit comfortably, close eyes, focus on breathing to relax mind and body.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const standingForwardBend = await prisma.exerciseCatalog.create({
    data: {
      name: "Standing Forward Bend",
      category: ExerciseCategory.MINDBODY,
      instructions:
        "Stand with feet together, hinge forward, and fold torso over legs, relaxing arms down.",
      muscleGroup: MuscleGroup.HAMSTRINGS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const lotusPose = await prisma.exerciseCatalog.create({
    data: {
      name: "Lotus Pose",
      category: ExerciseCategory.MINDBODY,
      instructions:
        "Sit cross-legged with each foot resting on the opposite thigh, keeping spine tall.",
      muscleGroup: MuscleGroup.HIP_FLEXORS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  const pushup = await prisma.exerciseCatalog.create({
    data: {
      name: "Push-Up",
      category: ExerciseCategory.STRENGTH,
      instructions:
        "Start in a plank position with hands slightly wider than shoulders. Lower your body until your chest nearly touches the floor, then push back up.",
      muscleGroup: MuscleGroup.CHEST,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.createMany({
    data: [
      {
        name: "Running (Treadmill)",
        category: ExerciseCategory.CARDIO,
        instructions:
          "Run at a steady pace on the treadmill, adjusting speed and incline as needed.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.TREADMILL,
        createdByid: null,
      },
      {
        name: "Rowing",
        category: ExerciseCategory.CARDIO,
        instructions:
          "Drive with your legs first, then pull the handle toward your chest, maintaining a straight back.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.ROWING_MACHINE,
        createdByid: null,
      },
      {
        name: "Seated Butterfly Stretch",
        category: ExerciseCategory.FLEXIBILITY,
        instructions:
          "Sit with the soles of your feet together and gently press your knees toward the floor.",
        muscleGroup: MuscleGroup.ADDUCTORS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Kettlebell Swing",
        category: ExerciseCategory.HIIT,
        instructions:
          "Swing the kettlebell between your legs, then thrust hips forward to swing it up to shoulder height.",
        muscleGroup: MuscleGroup.HAMSTRINGS,
        equipment: Equipment.KETTLEBELL,
        createdByid: null,
      },
      {
        name: "Box Jumps",
        category: ExerciseCategory.HIIT,
        instructions:
          "Jump explosively from the ground onto a sturdy box or platform, then step down and repeat.",
        muscleGroup: MuscleGroup.QUADS,
        equipment: Equipment.BOX,
        createdByid: null,
      },
      {
        name: "Side Plank",
        category: ExerciseCategory.CORE,
        instructions:
          "Lie on your side, prop yourself on one forearm, and hold your body straight, engaging obliques.",
        muscleGroup: MuscleGroup.OBLIQUES,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Ab Rollout",
        category: ExerciseCategory.CORE,
        instructions:
          "Kneel with hands on a barbell or ab wheel, roll forward keeping your abs tight, then return.",
        muscleGroup: MuscleGroup.ABS,
        equipment: Equipment.BARBELL,
        createdByid: null,
      },
      {
        name: "Standing Quad Stretch",
        category: ExerciseCategory.FLEXIBILITY,
        instructions:
          "Stand tall, grab one ankle behind you, and gently pull your heel toward your glutes.",
        muscleGroup: MuscleGroup.QUADS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Cobra Stretch",
        category: ExerciseCategory.FLEXIBILITY,
        instructions:
          "Lie on your stomach, place palms under shoulders, and press up, arching your back.",
        muscleGroup: MuscleGroup.ABS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Wrist Flexor Stretch",
        category: ExerciseCategory.FLEXIBILITY,
        instructions:
          "Extend one arm in front, palm up, and gently pull fingers downward with the opposite hand.",
        muscleGroup: MuscleGroup.FOREARMS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Stability Ball Squat",
        category: ExerciseCategory.BALANCE,
        instructions:
          "Squat while stabilizing against a ball or unstable surface to challenge balance.",
        muscleGroup: MuscleGroup.QUADS,
        equipment: Equipment.STABILITY_BALL,
        createdByid: null,
      },
      {
        name: "Single-Leg Calf Raise",
        category: ExerciseCategory.BALANCE,
        instructions:
          "Stand on one leg and rise onto the ball of your foot, then lower slowly.",
        muscleGroup: MuscleGroup.CALVES,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Lunge with Rotation",
        category: ExerciseCategory.BALANCE,
        instructions:
          "Step into a forward lunge while rotating your torso toward the lead leg.",
        muscleGroup: MuscleGroup.OBLIQUES,
        equipment: Equipment.MEDICINE_BALL,
        createdByid: null,
      },
      {
        name: "Side-Lying Leg Lift",
        category: ExerciseCategory.BALANCE,
        instructions:
          "Lie on your side and lift the top leg upward, keeping it straight, then lower slowly.",
        muscleGroup: MuscleGroup.ABDUCTORS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Standing Knee Raise Balance",
        category: ExerciseCategory.BALANCE,
        instructions:
          "Stand on one foot, raise the opposite knee to hip height, and hold position.",
        muscleGroup: MuscleGroup.HIP_FLEXORS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Cycling (Long Ride)",
        category: ExerciseCategory.ENDURANCE,
        instructions:
          "Maintain a steady pace on a stationary or road bike for long durations.",
        muscleGroup: MuscleGroup.QUADS,
        equipment: Equipment.BIKE,
        createdByid: null,
      },
      {
        name: "Elliptical (Steady Pace)",
        category: ExerciseCategory.ENDURANCE,
        instructions:
          "Use the elliptical at a consistent resistance and pace to sustain aerobic activity.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.ELLIPTICAL,
        createdByid: null,
      },
      {
        name: "Hiking",
        category: ExerciseCategory.ENDURANCE,
        instructions:
          "Walk or climb on natural trails or inclines to build stamina.",
        muscleGroup: MuscleGroup.CALVES,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Jump Rope (Extended)",
        category: ExerciseCategory.ENDURANCE,
        instructions:
          "Skip rope at a moderate pace for several minutes without rest.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.JUMP_ROPE,
        createdByid: null,
      },
      {
        name: "Circuit Training",
        category: ExerciseCategory.ENDURANCE,
        instructions:
          "Perform a series of exercises with light weights and minimal rest between sets.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.DUMBBELL,
        createdByid: null,
      },
      {
        name: "Tempo Run",
        category: ExerciseCategory.ENDURANCE,
        instructions:
          "Run at a comfortably hard pace just below your threshold for a set distance.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Foam Rolling Quads",
        category: ExerciseCategory.RECOVERY,
        instructions:
          "Lie face down with the roller under your thighs, slowly roll from hips to knees.",
        muscleGroup: MuscleGroup.QUADS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Foam Rolling Lats",
        category: ExerciseCategory.RECOVERY,
        instructions:
          "Lie on your side with the roller under your lats, move slowly to release tension.",
        muscleGroup: MuscleGroup.LATS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Cat-Cow",
        category: ExerciseCategory.RECOVERY,
        instructions:
          "Alternate arching and rounding your spine on all fours to mobilize your back.",
        muscleGroup: MuscleGroup.LOWER_BACK,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Neck Stretch",
        category: ExerciseCategory.RECOVERY,
        instructions:
          "Gently tilt your head to one side, holding with light pressure for a stretch.",
        muscleGroup: MuscleGroup.TRAPS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Arm Across Chest Stretch",
        category: ExerciseCategory.RECOVERY,
        instructions:
          "Bring one arm across your chest, hold it with the opposite arm for a shoulder stretch.",
        muscleGroup: MuscleGroup.SHOULDERS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Seated Forward Fold",
        category: ExerciseCategory.RECOVERY,
        instructions:
          "Sit with legs extended, hinge at the hips, and reach for your toes.",
        muscleGroup: MuscleGroup.HAMSTRINGS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Tree Pose",
        category: ExerciseCategory.MINDBODY,
        instructions:
          "Stand on one leg, place the other foot on your thigh, and bring palms together overhead.",
        muscleGroup: MuscleGroup.HIP_FLEXORS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Tai Chi Flow",
        category: ExerciseCategory.MINDBODY,
        instructions:
          "Perform slow, flowing movements that emphasize breathing and balance.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Bridge Pose",
        category: ExerciseCategory.MINDBODY,
        instructions:
          "Lie on your back, bend knees, press feet down, and lift hips toward the ceiling.",
        muscleGroup: MuscleGroup.GLUTES,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Boat Pose",
        category: ExerciseCategory.MINDBODY,
        instructions:
          "Balance on your sit bones with legs lifted and torso leaned back, forming a V shape.",
        muscleGroup: MuscleGroup.ABS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Shoulder Stand",
        category: ExerciseCategory.MINDBODY,
        instructions:
          "Lie flat, lift legs overhead, support hips with hands, and balance weight on shoulders.",
        muscleGroup: MuscleGroup.SHOULDERS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
    ],
  });
  await prisma.exerciseCatalog.createMany({
    data: [
      // --- CARDIO Exercises ---
      {
        name: "Stairmaster",
        category: ExerciseCategory.CARDIO,
        instructions: "Climb the moving stairs at a steady, challenging pace.",
        muscleGroup: MuscleGroup.QUADS,
        equipment: Equipment.MACHINE,
        createdByid: null,
      },
      {
        name: "Bear Crawl",
        category: ExerciseCategory.CARDIO, // Cardiorespiratory demand makes it fit here too
        instructions:
          "Crawl forward on hands and feet, keeping your hips low and back flat.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      {
        name: "Air Bike Sprint",
        category: ExerciseCategory.CARDIO,
        instructions:
          "Pedal and push/pull handles with maximum effort for short intervals.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.MACHINE,
        createdByid: null,
      },

      // --- STRENGTH Exercises ---
      // Muscle Group: CHEST (Bench Press, Push-Up used)
      {
        name: "Dumbbell Fly",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Lie on a bench, hold dumbbells, and lower them in an arc motion to stretch the chest, then bring them back up.",
        muscleGroup: MuscleGroup.CHEST,
        equipment: Equipment.DUMBBELL,
        createdByid: null,
      },
      // Muscle Group: BACK (Pull-Up used)
      {
        name: "Barbell Row",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Hinge at the hips, hold a barbell, and pull it toward your lower chest/abs, squeezing your back.",
        muscleGroup: MuscleGroup.BACK,
        equipment: Equipment.BARBELL,
        createdByid: null,
      },
      // Muscle Group: SHOULDERS (No dedicated Strength used yet)
      {
        name: "Overhead Press (Barbell)",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Press the barbell straight overhead from your shoulders until your arms are locked out.",
        muscleGroup: MuscleGroup.SHOULDERS,
        equipment: Equipment.BARBELL,
        createdByid: null,
      },
      // Muscle Group: TRICEPS (No dedicated Strength used yet)
      {
        name: "Tricep Pushdown (Cable)",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Stand at a cable machine, push the bar down until your arms are fully extended, isolating the triceps.",
        muscleGroup: MuscleGroup.TRICEPS,
        equipment: Equipment.CABLE,
        createdByid: null,
      },
      // Muscle Group: TRAPS (No dedicated Strength used yet)
      {
        name: "Dumbbell Shrug",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Hold heavy dumbbells and shrug your shoulders straight up towards your ears, then lower slowly.",
        muscleGroup: MuscleGroup.TRAPS,
        equipment: Equipment.DUMBBELL,
        createdByid: null,
      },
      // Muscle Group: ROTATOR_CUFF (No dedicated Strength used yet)
      {
        name: "External Rotation (Band)",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Hold a light resistance band, keep your elbow bent at 90 degrees, and rotate your hand outward.",
        muscleGroup: MuscleGroup.ROTATOR_CUFF,
        equipment: Equipment.RESISTANCE_BAND,
        createdByid: null,
      },
      // Muscle Group: LATS (No dedicated Strength used yet)
      {
        name: "Lat Pulldown (Machine)",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Sit at the machine, pull the bar down to your upper chest, squeezing your lats.",
        muscleGroup: MuscleGroup.LATS,
        equipment: Equipment.MACHINE,
        createdByid: null,
      },
      // Muscle Group: FOREARMS (No dedicated Strength used yet)
      {
        name: "Wrist Curl",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Rest your forearms on a bench with palms up, and curl the weight upward using only your wrists.",
        muscleGroup: MuscleGroup.FOREARMS,
        equipment: Equipment.DUMBBELL,
        createdByid: null,
      },
      // Muscle Group: QUADS (Squat, Barbell Squat used)
      {
        name: "Leg Press",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Sit in the machine and push the foot plate away from you using your legs.",
        muscleGroup: MuscleGroup.QUADS,
        equipment: Equipment.MACHINE,
        createdByid: null,
      },
      // Muscle Group: HAMSTRINGS (Deadlift used)
      {
        name: "Romanian Deadlift (Dumbbell)",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Stand holding dumbbells, hinge at the hips while keeping a slight bend in your knees and a straight back.",
        muscleGroup: MuscleGroup.HAMSTRINGS,
        equipment: Equipment.DUMBBELL,
        createdByid: null,
      },
      // Muscle Group: GLUTES (No dedicated Strength used yet)
      {
        name: "Hip Thrust (Barbell)",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Sit with your back against a bench, roll a barbell over your hips, and thrust your hips upward to full extension.",
        muscleGroup: MuscleGroup.GLUTES,
        equipment: Equipment.BARBELL,
        createdByid: null,
      },
      // Muscle Group: CALVES (No dedicated Strength used yet)
      {
        name: "Seated Calf Raise",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Sit on the machine, place the pads on your knees, and raise your heels by pushing on the balls of your feet.",
        muscleGroup: MuscleGroup.CALVES,
        equipment: Equipment.MACHINE,
        createdByid: null,
      },
      // Muscle Group: HIP_FLEXORS (No dedicated Strength used yet)
      {
        name: "Kneeling Hip Flexor March (Band)",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Anchor a band low, loop it around your foot, and march your knee upward while stabilizing your core.",
        muscleGroup: MuscleGroup.HIP_FLEXORS,
        equipment: Equipment.RESISTANCE_BAND,
        createdByid: null,
      },
      // Muscle Group: ADDUCTORS (No dedicated Strength used yet)
      {
        name: "Cable Adduction",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Stand at a cable machine with the cuff on your ankle, and pull your leg inward across your body.",
        muscleGroup: MuscleGroup.ADDUCTORS,
        equipment: Equipment.CABLE,
        createdByid: null,
      },
      // Muscle Group: ABDUCTORS (No dedicated Strength used yet)
      {
        name: "Band Side Walk",
        category: ExerciseCategory.STRENGTH,
        instructions:
          "Place a resistance band around your ankles and walk sideways, maintaining tension on the band.",
        muscleGroup: MuscleGroup.ABDUCTORS,
        equipment: Equipment.RESISTANCE_BAND,
        createdByid: null,
      },
    ],
  });

  await prisma.exerciseCatalog.createMany({
    data: [
      // --- HIIT Exercises (Mountain Climbers, Jump Squats, Burpee to Push-Up, etc. used) ---
      // Muscle Group: FULL_BODY
      {
        name: "Thrusters (Medicine Ball)",
        category: ExerciseCategory.HIIT,
        instructions:
          "Perform a full squat while holding a medicine ball, then explode upward and throw the ball overhead.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.MEDICINE_BALL,
        createdByid: null,
      },
      // Muscle Group: TRICEPS (Often neglected in HIIT, but used heavily in certain moves)
      {
        name: "Tuck Jumps",
        category: ExerciseCategory.HIIT,
        instructions:
          "Jump explosively off the ground, bringing your knees up toward your chest as high as possible.",
        muscleGroup: MuscleGroup.QUADS, // High Quads/Hip Flexor demand
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: GLUTES
      {
        name: "Glute Bridge March",
        category: ExerciseCategory.HIIT,
        instructions:
          "Hold a high plank with elbows on the ground, alternating bringing knees to chest rapidly.",
        muscleGroup: MuscleGroup.ABS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: BICEPS (Indirectly worked, but not primary for HIIT)

      // --- CORE Exercises (Plank, Russian Twist, Hanging Leg Raise, Sit-Ups, V-Ups, etc. used) ---
      // Muscle Group: ABS (Crunches, Leg Raises)
      {
        name: "Bicycle Crunch",
        category: ExerciseCategory.CORE,
        instructions:
          "Lie on your back, bring opposite elbow to opposite knee while extending the other leg.",
        muscleGroup: MuscleGroup.ABS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: OBLIQUES (Side Plank, Russian Twist used)
      {
        name: "Side Bends (Dumbbell)",
        category: ExerciseCategory.CORE,
        instructions:
          "Stand tall holding a dumbbell in one hand, slowly bend sideways towards the weighted side, then return.",
        muscleGroup: MuscleGroup.OBLIQUES,
        equipment: Equipment.DUMBBELL,
        createdByid: null,
      },
      // Muscle Group: LOWER_BACK (Not many pure CORE exercises, Bird Dog used for Balance)
      {
        name: "Superman",
        category: ExerciseCategory.CORE,
        instructions:
          "Lie face down, simultaneously lift your arms, chest, and legs off the floor.",
        muscleGroup: MuscleGroup.LOWER_BACK,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: TRICEPS (Indirectly worked in planks, not a primary target)
      // Muscle Group: SHOULDERS (Indirectly worked in planks, not a primary target)
      // Muscle Group: HIP_FLEXORS (Hanging Leg Raise primary mover, but also target via L-Sit)
      {
        name: "L-Sit",
        category: ExerciseCategory.CORE,
        instructions:
          "Sit on the floor or parallel bars and lift your body, holding your legs straight out in front of you.",
        muscleGroup: MuscleGroup.HIP_FLEXORS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
    ],
  });

  await prisma.exerciseCatalog.createMany({
    data: [
      // --- FLEXIBILITY Exercises (Forward Fold, Pigeon Pose, Cat-Cow, etc. used) ---
      // Muscle Group: QUADS (Standing Quad Stretch used)
      {
        name: "Supine Quad Stretch",
        category: ExerciseCategory.FLEXIBILITY,
        instructions:
          "Lie on your back, bend one knee, and pull your foot toward your glute to deepen the stretch.",
        muscleGroup: MuscleGroup.QUADS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: BICEPS (No dedicated Flexibility used yet)
      {
        name: "Wall Bicep Stretch",
        category: ExerciseCategory.FLEXIBILITY,
        instructions:
          "Stand next to a wall, place your palm on the wall behind you with your arm straight, and gently rotate your chest away.",
        muscleGroup: MuscleGroup.BICEPS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: TRICEPS (No dedicated Flexibility used yet)
      {
        name: "Tricep Overhead Reach",
        category: ExerciseCategory.FLEXIBILITY,
        instructions:
          "Raise one arm overhead, bend the elbow, and use the opposite hand to gently press the elbow down.",
        muscleGroup: MuscleGroup.TRICEPS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: ADDUCTORS (Seated Butterfly used)
      {
        name: "Frog Pose",
        category: ExerciseCategory.FLEXIBILITY,
        instructions:
          "Start on all fours, widen your knees, and lower your hips toward the floor for an inner thigh stretch.",
        muscleGroup: MuscleGroup.ADDUCTORS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: ABDUCTORS (No dedicated Flexibility used yet)
      {
        name: "Seated Figure-Four Stretch",
        category: ExerciseCategory.FLEXIBILITY,
        instructions:
          "Sit on a bench/chair, cross one ankle over the opposite knee, and gently lean forward.",
        muscleGroup: MuscleGroup.ABDUCTORS,
        equipment: Equipment.BENCH,
        createdByid: null,
      },
      // Muscle Group: CALVES (No dedicated Flexibility used yet)
      {
        name: "Calf Stretch Against Wall",
        category: ExerciseCategory.FLEXIBILITY,
        instructions:
          "Stand facing a wall, place the ball of your foot against the wall, and lean in gently.",
        muscleGroup: MuscleGroup.CALVES,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: ROTATOR_CUFF (No dedicated Flexibility used yet)
      {
        name: "Posterior Capsule Stretch",
        category: ExerciseCategory.FLEXIBILITY,
        instructions:
          "Bring one arm across your chest, grasping it above the elbow and pulling it gently into your chest.",
        muscleGroup: MuscleGroup.ROTATOR_CUFF,
        equipment: Equipment.NONE,
        createdByid: null,
      },

      // --- BALANCE Exercises (Single-Leg Deadlift, Bird Dog, etc. used) ---
      // Muscle Group: FULL_BODY (No dedicated Balance used yet)
      {
        name: "Bosu Ball Stand",
        category: ExerciseCategory.BALANCE,
        instructions:
          "Stand on the unstable side of a Bosu ball, maintaining a centered posture and balance.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.STABILITY_BALL, // Proxy for Bosu
        createdByid: null,
      },
      // Muscle Group: BACK (Used for stability, but let's target the back stabilizers)
      {
        name: "Single-Leg Superman",
        category: ExerciseCategory.BALANCE,
        instructions:
          "From hands and knees, lift one arm and the opposite leg simultaneously, holding for balance and core stability.",
        muscleGroup: MuscleGroup.LOWER_BACK,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: ABDUCTORS
      {
        name: "Curtsy Lunge (Bodyweight)",
        category: ExerciseCategory.BALANCE,
        instructions:
          "Step one leg diagonally behind the other, lowering hips until both knees are bent 90 degrees, focusing on balance.",
        muscleGroup: MuscleGroup.ABDUCTORS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: TRAPS (Indirectly used, but not primary focus)
    ],
  });

  await prisma.exerciseCatalog.createMany({
    data: [
      // --- ENDURANCE Exercises (Long Run, Rowing, Cycling, Stair Climb, etc. used) ---
      // Muscle Group: FULL_BODY
      {
        name: "Ruck Marching",
        category: ExerciseCategory.ENDURANCE,
        instructions:
          "Walk or hike for a long distance while carrying a weighted backpack (ruck).",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.NONE, // Requires a backpack/weight
        createdByid: null,
      },
      // Muscle Group: HAMSTRINGS
      {
        name: "High-Intensity Sled Push",
        category: ExerciseCategory.ENDURANCE,
        instructions:
          "Push a weighted sled for a long distance or duration, focusing on consistent effort.",
        muscleGroup: MuscleGroup.QUADS, // Primary mover, used heavily in endurance
        equipment: Equipment.MACHINE, // Proxy for sled
        createdByid: null,
      },
      // Muscle Group: TRICEPS (Indirectly targeted, adding a unique full-body endurance movement)
      {
        name: "Tire Flip",
        category: ExerciseCategory.ENDURANCE,
        instructions:
          "Flip a large, heavy tire repeatedly for time or distance, engaging the full body.",
        muscleGroup: MuscleGroup.FULL_BODY,
        equipment: Equipment.NONE, // Specialty equipment, using NONE
        createdByid: null,
      },

      // --- RECOVERY Exercises (Foam Rolling, Light Jog, Hamstring Stretch, etc. used) ---
      // Muscle Group: TRICEPS
      {
        name: "Triceps Foam Roll",
        category: ExerciseCategory.RECOVERY,
        instructions:
          "Lie on your side with the foam roller under your tricep, slowly moving back and forth to relieve tension.",
        muscleGroup: MuscleGroup.TRICEPS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: BICEPS
      {
        name: "Biceps/Forearm Self-Massage",
        category: ExerciseCategory.RECOVERY,
        instructions:
          "Use a hand or a massage tool to apply pressure and gently knead sore spots in the biceps and forearms.",
        muscleGroup: MuscleGroup.BICEPS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: CHEST
      {
        name: "Pectoral Doorway Stretch",
        category: ExerciseCategory.RECOVERY,
        instructions:
          "Place forearms on a doorway, step forward slightly, and hold to stretch the chest muscles.",
        muscleGroup: MuscleGroup.CHEST,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: ABDUCTORS
      {
        name: "Hip Abductor Trigger Point Release",
        category: ExerciseCategory.RECOVERY,
        instructions:
          "Sit on a foam roller/ball, position it under your hip/glute side, and roll slowly over the abductor muscle.",
        muscleGroup: MuscleGroup.ABDUCTORS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: ROTATOR_CUFF
      {
        name: "Pendulum Swing",
        category: ExerciseCategory.RECOVERY,
        instructions:
          "Lean over, letting one arm hang down, and gently swing it in small circles to promote blood flow and shoulder mobility.",
        muscleGroup: MuscleGroup.ROTATOR_CUFF,
        equipment: Equipment.NONE,
        createdByid: null,
      },

      // --- MINDBODY Exercises (Sun Salutation, Warrior II, Seated Meditation, etc. used) ---
      // Muscle Group: TRICEPS (Often included in movements like Chaturanga in yoga flow)
      {
        name: "Dolphin Pose",
        category: ExerciseCategory.MINDBODY,
        instructions:
          "Start on forearms and knees, lift hips up and back like downward dog, engaging shoulders and core.",
        muscleGroup: MuscleGroup.SHOULDERS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: ADDUCTORS
      {
        name: "Reclined Bound Angle Pose (Supta Baddha Konasana)",
        category: ExerciseCategory.MINDBODY,
        instructions:
          "Lie on your back, bring the soles of your feet together, and let your knees fall open to the sides.",
        muscleGroup: MuscleGroup.ADDUCTORS,
        equipment: Equipment.NONE,
        createdByid: null,
      },
      // Muscle Group: CALVES
      {
        name: "Downward-Facing Dog",
        category: ExerciseCategory.MINDBODY,
        instructions:
          "From plank, lift hips high, forming an inverted V shape, stretching the hamstrings and calves.",
        muscleGroup: MuscleGroup.CALVES,
        equipment: Equipment.NONE,
        createdByid: null,
      },
    ],
  });

  // --- WORKOUT PLAN ---

  // --- BEGINNER LEVEL WORKOUT ---
  const beginnerStrengthPlan = await prisma.workoutPlan.create({
    data: {
      name: "Beginner Strength Plan",
      description:
        "A simple full-body strength workout for beginners using bodyweight.",
      level: Difficulty.BEGINNER,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/flat-illustration-of-a-sporty-couple-a-man-and-a-woman-lift-dumbbells-on-their-both-hands-as-strength-training-workout-vector_nxpmyr.jpg",
      duration: 1500,
      userId: null,
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
          {
            position: 3,
            sets: 2,
            reps: 20,
            exercise: { connect: { id: pigeonPose.id } },
          },
          {
            position: 4,
            sets: 2,
            reps: 30,
            exercise: { connect: { id: plank.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- INTERMEDIATE LEVEL WORKOUT ---
  const intermediateCardioCorePlan = await prisma.workoutPlan.create({
    data: {
      name: "Intermediate Cardio & Core Blast",
      description:
        "A sweaty session combining cardio bursts with core stability work.",
      level: Difficulty.INTERMEDIATE,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/womens-cardio-exercise-icon-vector-4878396_o35ice.jpg",
      duration: 2400,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 4,
            reps: 60, // seconds
            exercise: { connect: { id: jumpRope.id } },
          },
          {
            position: 2,
            sets: 4,
            reps: 12,
            exercise: { connect: { id: burpeePushup.id } },
          },
          {
            position: 3,
            sets: 3,
            reps: 15,
            exercise: { connect: { id: russianTwist.id } },
          },
          {
            position: 4,
            sets: 3,
            reps: 12,
            exercise: { connect: { id: hangingLegRaise.id } },
          },
          {
            position: 5,
            sets: 2,
            reps: 60, // seconds
            exercise: { connect: { id: mountainClimbers.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- ADVANCED LEVEL WORKOUT ---
  const advancedHIITStrengthPlan = await prisma.workoutPlan.create({
    data: {
      name: "Advanced HIIT Strength Challenge",
      description:
        "High-intensity mix of strength and cardio intervals designed for advanced trainees.",
      level: Difficulty.ADVANCED,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/man-doing-pushups-gym-vector-illustration-flat-style_159885-3113_opx4lx.jpg",
      duration: 3300,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 5,
            reps: 12,
            exercise: { connect: { id: barbellSquats.id } },
          },
          {
            position: 2,
            sets: 5,
            reps: 10,
            exercise: { connect: { id: deadlift.id } },
          },
          {
            position: 3,
            sets: 5,
            reps: 15,
            exercise: { connect: { id: pullUp.id } },
          },
          {
            position: 4,
            sets: 5,
            reps: 12,
            exercise: { connect: { id: overheadShoulderStretch.id } },
          },
          {
            position: 5,
            sets: 4,
            reps: 20,
            exercise: { connect: { id: jumpSquats.id } },
          },
          {
            position: 6,
            sets: 3,
            rest: 60,
            time: 60, // seconds
            exercise: { connect: { id: battleRopes.id } },
          },
          {
            position: 7,
            sets: 3,
            reps: 12,
            exercise: { connect: { id: hangingLegRaise.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- PLAN 4: BEGINNER FLEXIBILITY & RECOVERY ---
  const beginnerFlexibilityPlan = await prisma.workoutPlan.create({
    data: {
      name: "Beginner Flexibility & Recovery",
      description:
        "Gentle stretching routine to improve mobility and aid recovery.",
      level: Difficulty.BEGINNER,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/woman-stretching-workout-semi-flat-color-character-editable-figure-full-body-people-on-white-flexibility-exercises-simple-cartoon-style-illustration-for-web-graphic-design-and-animation-vector_v9tr8n.jpg",
      duration: 1200,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 2,
            time: 30, // seconds
            rest: 15,
            exercise: { connect: { id: forwardFold.id } },
          },
          {
            position: 2,
            sets: 2,
            time: 30, // seconds
            rest: 15,
            exercise: { connect: { id: catCow.id } },
          },
          {
            position: 3,
            sets: 2,
            time: 30,
            rest: 15,
            exercise: { connect: { id: childsPose.id } },
          },
          {
            position: 4,
            sets: 2,
            time: 30,
            rest: 15,
            exercise: { connect: { id: chestOpener.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- PLAN 5: INTERMEDIATE BALANCE & STABILITY ---
  await prisma.workoutPlan.create({
    data: {
      name: "Intermediate Balance & Stability",
      description:
        "Improve stability and coordination with this balance-focused workout.",
      level: Difficulty.INTERMEDIATE,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/flat-vector-illustration-man-performing-600nw-2667949145_r2xpv6.jpg",
      duration: 1800,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 3,
            reps: 12,
            rest: 45,
            exercise: { connect: { id: singleLegDeadlift.id } },
          },
          {
            position: 2,
            sets: 3,
            reps: 15,
            rest: 45,
            exercise: { connect: { id: birdDog.id } },
          },
          {
            position: 3,
            sets: 3,
            reps: 10,
            rest: 45,
            exercise: { connect: { id: warriorIII.id } },
          },
          {
            position: 4,
            sets: 3,
            reps: 12,
            rest: 45,
            exercise: { connect: { id: stabilityBallPike.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- PLAN 6: ADVANCED ENDURANCE CHALLENGE ---
  await prisma.workoutPlan.create({
    data: {
      name: "Advanced Endurance Challenge",
      description:
        "A high-volume endurance workout designed to push cardiovascular capacity.",
      level: Difficulty.ADVANCED,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/vector-kettlebell-swing-exercise-clipart_1218867-3690_lv2fbj.jpg",
      duration: 3600,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 1,
            distance: 5000, // km run
            time: 1500, // minutes
            rest: 120,
            exercise: { connect: { id: longRun.id } },
          },
          {
            position: 2,
            sets: 1,
            time: 600, // minutes
            rest: 60,
            exercise: { connect: { id: enduranceRow.id } },
          },
          {
            position: 3,
            sets: 1,
            time: 600,
            rest: 60,
            exercise: { connect: { id: stairClimb.id } },
          },
          {
            position: 4,
            sets: 1,
            time: 900, // minutes
            rest: 0,
            exercise: { connect: { id: enduranceSwim.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- PLAN 7: BEGINNER MINDBODY FLOW ---
  const beginnerMindBodyPlan = await prisma.workoutPlan.create({
    data: {
      name: "Beginner Mind-Body Flow",
      description:
        "Gentle yoga-inspired flow to connect breath with movement and improve flexibility.",
      level: Difficulty.BEGINNER,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/self-care-1_01_mane2f.jpg",
      duration: 1500,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 2,
            reps: 30, // seconds
            rest: 15,
            exercise: { connect: { id: sunSalutation.id } },
          },
          {
            position: 2,
            sets: 2,
            reps: 30,
            rest: 15,
            exercise: { connect: { id: standingForwardBend.id } },
          },
          {
            position: 3,
            sets: 2,
            reps: 30,
            rest: 15,
            exercise: { connect: { id: lotusPose.id } },
          },
          {
            position: 4,
            sets: 2,
            reps: 60,
            rest: 15,
            exercise: { connect: { id: seatedMeditation.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- PLAN 8: INTERMEDIATE CORE BURNER ---
  const intermediateCorePlan = await prisma.workoutPlan.create({
    data: {
      name: "Intermediate Core Burner",
      description:
        "A challenging ab workout to build midsection strength and stability.",
      level: Difficulty.INTERMEDIATE,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/flat-vector-man-doing-sit-ups-towel-under-back-stopwatch-nearby-core-workout-isolated-white-generative-ai-404888182_xohmfp.jpg",
      duration: 2100,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 3,
            reps: 15,
            rest: 30,
            exercise: { connect: { id: sitUps.id } },
          },
          {
            position: 2,
            sets: 3,
            reps: 20,
            rest: 30,
            exercise: { connect: { id: flutterKicks.id } },
          },
          {
            position: 3,
            sets: 3,
            reps: 12,
            rest: 45,
            exercise: { connect: { id: vUps.id } },
          },
          {
            position: 4,
            sets: 3,
            reps: 12,
            rest: 45,
            exercise: { connect: { id: cableWoodchoppers.id } },
          },
          {
            position: 5,
            sets: 2,
            reps: 20,
            rest: 30,
            exercise: { connect: { id: stabilityBallCrunches.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- PLAN 9: ADVANCED UPPER BODY STRENGTH SPLIT ---
  await prisma.workoutPlan.create({
    data: {
      name: "Advanced Upper Body Strength Split",
      description:
        "High-volume upper body workout for advanced strength trainees.",
      level: Difficulty.ADVANCED,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/1000_F_386831633_M70T62G1gFwq6D1lf0Y3rOxNxQIBPqkc_bnb0gk.jpg",
      duration: 4200,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 5,
            reps: 8,
            rest: 90,
            exercise: { connect: { id: benchPress.id } },
          },
          {
            position: 2,
            sets: 5,
            reps: 10,
            rest: 90,
            exercise: { connect: { id: chestOpener.id } },
          },
          {
            position: 3,
            sets: 4,
            reps: 8,
            rest: 90,
            exercise: { connect: { id: overheadShoulderStretch.id } },
          },
          {
            position: 4,
            sets: 4,
            reps: 10,
            rest: 90,
            exercise: { connect: { id: pullUp.id } },
          },
          {
            position: 5,
            sets: 3,
            reps: 12,
            rest: 60,
            exercise: { connect: { id: bicepCurl.id } },
          },
          {
            position: 6,
            sets: 3,
            reps: 12,
            rest: 60,
            exercise: { connect: { id: warriorII.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- PLAN 10: BEGINNER CARDIO ENDURANCE ---
  const beginnerCardioEndurance = await prisma.workoutPlan.create({
    data: {
      name: "Beginner Cardio Endurance",
      description: "Low-impact cardio session to build basic aerobic fitness.",
      level: Difficulty.BEGINNER,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/man-running-on-treadmill-sportsman-jogging-on-fitness-equipment-endurance-cardio-run-training-flat-illustration-vector_apbkdy.jpg",
      duration: 1800,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 1,
            time: 600, // minutes
            rest: 60,
            exercise: { connect: { id: lightJog.id } },
          },
          {
            position: 2,
            sets: 1,
            time: 480,
            rest: 60,
            exercise: { connect: { id: cycling.id } },
          },
          {
            position: 3,
            sets: 1,
            time: 300,
            rest: 30,
            exercise: { connect: { id: elliptical.id } },
          },
          {
            position: 4,
            sets: 1,
            time: 300,
            rest: 0,
            exercise: { connect: { id: jumpRope.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- PLAN 11: INTERMEDIATE HIIT CIRCUIT ---
  await prisma.workoutPlan.create({
    data: {
      name: "Intermediate HIIT Circuit",
      description:
        "Circuit-style workout alternating strength and cardio intervals.",
      level: Difficulty.INTERMEDIATE,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/crossfit-workout-man-woman-doing-physical-exercise-engaged-competitive-fitness-sport-vector-set-young-male-female-271155617_nupmso.jpg",
      duration: 2100,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 4,
            time: 45, // seconds
            rest: 15,
            exercise: { connect: { id: burpeePushup.id } },
          },
          {
            position: 2,
            sets: 4,
            reps: 12,
            rest: 30,
            exercise: { connect: { id: dumbbellThrusters.id } },
          },
          {
            position: 3,
            sets: 4,
            time: 30,
            rest: 15,
            exercise: { connect: { id: mountainClimbers.id } },
          },
          {
            position: 4,
            sets: 4,
            reps: 20,
            rest: 30,
            exercise: { connect: { id: jumpLunges.id } },
          },
          {
            position: 5,
            sets: 3,
            time: 60,
            rest: 30,
            exercise: { connect: { id: skaterJumps.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  // --- PLAN 12: ADVANCED FULL-BODY HYBRID ---
  const advancedFullBodyHybrid = await prisma.workoutPlan.create({
    data: {
      name: "Advanced Full-Body Hybrid",
      description:
        "Combination of heavy lifts and conditioning for maximum performance.",
      level: Difficulty.ADVANCED,
      imgUrl:
        "https://res.cloudinary.com/dlyluxb9z/image/upload/man-workout-in-gym-for-healthy-llifestyle-free-vector_cwcolp.jpg",
      duration: 3900,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 4,
            reps: 8,
            rest: 120,
            exercise: { connect: { id: deadlift.id } },
          },
          {
            position: 2,
            sets: 4,
            reps: 10,
            rest: 90,
            exercise: { connect: { id: barbellSquats.id } },
          },
          {
            position: 3,
            sets: 4,
            reps: 12,
            rest: 90,
            exercise: { connect: { id: benchPress.id } },
          },
          {
            position: 4,
            sets: 3,
            reps: 10,
            rest: 60,
            exercise: { connect: { id: pullUp.id } },
          },
          {
            position: 5,
            sets: 4,
            time: 60,
            rest: 30,
            exercise: { connect: { id: battleRopes.id } },
          },
          {
            position: 6,
            sets: 3,
            time: 400, // meters
            rest: 90,
            exercise: { connect: { id: sprintIntervals.id } },
          },
        ],
      },
    },
    include: { exercises: true },
  });

  //WorkoutLogs
  // --- USER: SHREYA ---

  // WorkoutLog 1: Beginner Strength Plan
  const shreyaLog1 = await prisma.workoutLog.create({
    data: {
      user: { connect: { id: shreya.id } },
      plan: { connect: { id: beginnerStrengthPlan.id } },
      duration: 1680, // minutes
      notes: "Felt strong, form improved on push-ups.",
      createdAt: new Date("2025-11-20T08:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: pushup.id } },
            sets: 3,
            reps: 10,
            weightUsed: 0,
            rest: 60,
            createdAt: new Date("2025-11-20T08:02:00Z"),
          },
          {
            exercise: { connect: { id: squat.id } },
            sets: 3,
            reps: 15,
            weightUsed: 0,
            rest: 60,
            createdAt: new Date("2025-11-20T08:10:00Z"),
          },
          {
            exercise: { connect: { id: gluteBridgeRecovery.id } },
            sets: 2,
            reps: 20,
            rest: 45,
            createdAt: new Date("2025-11-20T08:20:00Z"),
          },
          {
            exercise: { connect: { id: plank.id } },
            sets: 2,
            plankHoldTime: 60, // seconds
            rest: 30,
            createdAt: new Date("2025-11-20T08:25:00Z"),
          },
        ],
      },
    },
  });

  // WorkoutLog 2: Beginner Cardio Endurance
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: shreya.id } },
      plan: { connect: { id: beginnerCardioEndurance.id } },
      duration: 1800,
      notes: "First 5k completed, breathing well.",
      createdAt: new Date("2025-11-21T07:30:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: lightJog.id } },
            duration: 600,
            distance: 1200, // km
            createdAt: new Date("2025-11-21T07:30:00Z"),
          },
          {
            exercise: { connect: { id: cycling.id } },
            duration: 480,
            distance: 3000,
            createdAt: new Date("2025-11-21T07:40:00Z"),
          },
          {
            exercise: { connect: { id: elliptical.id } },
            duration: 300,
            distance: 1000,
            createdAt: new Date("2025-11-21T07:50:00Z"),
          },
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 300,
            createdAt: new Date("2025-11-21T07:55:00Z"),
          },
        ],
      },
    },
  });

  // WorkoutLog 3: Beginner Flexibility & Recovery
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: shreya.id } },
      plan: { connect: { id: beginnerFlexibilityPlan.id } },
      duration: 1200,
      notes: "Felt relaxed after stretches, shoulder tension released.",
      createdAt: new Date("2025-11-22T09:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: hamstringStretchRecovery.id } },
            staticFlexibility: 30, // seconds
            createdAt: new Date("2025-11-22T09:00:00Z"),
          },
          {
            exercise: { connect: { id: catCow.id } },
            reps: 10,
            createdAt: new Date("2025-11-22T09:05:00Z"),
          },
          {
            exercise: { connect: { id: childsPose.id } },
            staticFlexibility: 30,
            createdAt: new Date("2025-11-22T09:10:00Z"),
          },
          {
            exercise: { connect: { id: chestOpener.id } },
            staticFlexibility: 30,
            createdAt: new Date("2025-11-22T09:15:00Z"),
          },
        ],
      },
    },
  });

  // WorkoutLog 4: Beginner Mind-Body Flow
  const shreyaLog4 = await prisma.workoutLog.create({
    data: {
      user: { connect: { id: shreya.id } },
      plan: { connect: { id: beginnerMindBodyPlan.id } },
      duration: 1500,
      notes: "Focused on breathing, felt calm and energized.",
      createdAt: new Date("2025-11-23T07:45:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: sunSalutation.id } },
            reps: 5,
            createdAt: new Date("2025-11-23T07:45:00Z"),
          },
          {
            exercise: { connect: { id: standingForwardBend.id } },
            staticFlexibility: 30,
            createdAt: new Date("2025-11-23T07:50:00Z"),
          },
          {
            exercise: { connect: { id: lotusPose.id } },
            staticFlexibility: 30,
            createdAt: new Date("2025-11-23T07:55:00Z"),
          },
          {
            exercise: { connect: { id: seatedMeditation.id } },
            duration: 300, // seconds
            createdAt: new Date("2025-11-23T08:00:00Z"),
          },
        ],
      },
    },
  });

  // WorkoutLog 5: Intermediate Cardio & Core
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: shreya.id } },
      plan: { connect: { id: intermediateCardioCorePlan.id } },
      duration: 2400,
      notes: "Core felt tight, cardio was challenging but doable.",
      createdAt: new Date("2025-11-24T08:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 60,
            reps: 1,
            createdAt: new Date("2025-11-24T08:00:00Z"),
          },
          {
            exercise: { connect: { id: burpeePushup.id } },
            reps: 12,
            sets: 4,
            rest: 45,
            createdAt: new Date("2025-11-24T08:10:00Z"),
          },
          {
            exercise: { connect: { id: russianTwist.id } },
            reps: 15,
            sets: 3,
            rest: 30,
            createdAt: new Date("2025-11-24T08:20:00Z"),
          },
          {
            exercise: { connect: { id: mountainClimbers.id } },
            duration: 60,
            sets: 2,
            rest: 30,
            createdAt: new Date("2025-11-24T08:30:00Z"),
          },
        ],
      },
    },
  });

  // --- USER: ZOYA ---

  // WorkoutLog 1: Beginner Strength Plan
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: zoya.id } },
      plan: { connect: { id: beginnerStrengthPlan.id } },
      duration: 1620,
      notes: "Good energy today, push-ups improved.",
      createdAt: new Date("2025-11-20T09:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: pushup.id } },
            sets: 3,
            reps: 10,
            rest: 60,
          },
          {
            exercise: { connect: { id: squat.id } },
            sets: 3,
            reps: 15,
            rest: 60,
          },
          {
            exercise: { connect: { id: gluteBridgeRecovery.id } },
            sets: 2,
            reps: 20,
            rest: 45,
          },
          {
            exercise: { connect: { id: plank.id } },
            sets: 2,
            plankHoldTime: 60,
            rest: 30,
          },
        ],
      },
    },
  });

  // WorkoutLog 2: Beginner Cardio Endurance
  const zoyaLog2 = await prisma.workoutLog.create({
    data: {
      user: { connect: { id: zoya.id } },
      plan: { connect: { id: beginnerCardioEndurance.id } },
      duration: 1800,
      notes: "Felt strong on the elliptical today.",
      createdAt: new Date("2025-11-21T08:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: lightJog.id } },
            duration: 600,
            distance: 1300,
          },
          {
            exercise: { connect: { id: cycling.id } },
            duration: 480,
            distance: 3200,
          },
          {
            exercise: { connect: { id: elliptical.id } },
            duration: 300,
            distance: 1100,
          },
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 300,
          },
        ],
      },
    },
  });

  // WorkoutLog 3: Intermediate Cardio & Core
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: zoya.id } },
      plan: { connect: { id: intermediateCardioCorePlan.id } },
      duration: 2520,
      notes: "Core was challenging but managed all sets.",
      createdAt: new Date("2025-11-22T07:30:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 60,
            sets: 4,
          },
          {
            exercise: { connect: { id: burpeePushup.id } },
            reps: 12,
            sets: 4,
            rest: 45,
          },
          {
            exercise: { connect: { id: russianTwist.id } },
            reps: 15,
            sets: 3,
            rest: 30,
          },
          {
            exercise: { connect: { id: mountainClimbers.id } },
            duration: 60,
            sets: 2,
            rest: 30,
          },
        ],
      },
    },
  });

  // WorkoutLog 4: Beginner Mind-Body Flow
  const zoyaLog4 = await prisma.workoutLog.create({
    data: {
      user: { connect: { id: zoya.id } },
      plan: { connect: { id: beginnerMindBodyPlan.id } },
      duration: 1500,
      notes: "Yoga session felt relaxing, breathing improved.",
      createdAt: new Date("2025-11-23T08:30:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: sunSalutation.id } },
            reps: 5,
          },
          {
            exercise: { connect: { id: standingForwardBend.id } },
            staticFlexibility: 30,
          },
          {
            exercise: { connect: { id: lotusPose.id } },
            staticFlexibility: 30,
          },
          {
            exercise: { connect: { id: seatedMeditation.id } },
            duration: 5 * 60,
          },
        ],
      },
    },
  });

  // WorkoutLog 5: Advanced HIIT Strength
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: zoya.id } },
      plan: { connect: { id: advancedHIITStrengthPlan.id } },
      duration: 3300,
      notes: "Intense HIIT, heart rate up throughout. Rest periods crucial.",
      createdAt: new Date("2025-11-24T09:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: barbellSquats.id } },
            sets: 5,
            reps: 12,
            weightUsed: 50,
            vol: 3000,
            rest: 120,
          },
          {
            exercise: { connect: { id: deadlift.id } },
            sets: 5,
            reps: 10,
            weightUsed: 60,
            vol: 3000,
            rest: 120,
          },
          {
            exercise: { connect: { id: pullUp.id } },
            sets: 5,
            reps: 15,
            rest: 90,
          },
          {
            exercise: { connect: { id: overheadShoulderStretch.id } },
            sets: 5,
            reps: 12,
            weightUsed: 25,
            vol: 1500,
            rest: 90,
          },
          {
            exercise: { connect: { id: jumpSquats.id } },
            sets: 4,
            reps: 20,
            rest: 60,
          },
          {
            exercise: { connect: { id: battleRopes.id } },
            duration: 60,
            sets: 3,
            rest: 30,
          },
          {
            exercise: { connect: { id: hangingLegRaise.id } },
            sets: 3,
            reps: 12,
            rest: 60,
          },
        ],
      },
    },
  });

  // --- USER: RISHABH ---

  // WorkoutLog 1: Beginner Strength Plan
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: rishabh.id } },
      plan: { connect: { id: beginnerStrengthPlan.id } },
      duration: 1680,
      notes: "Good session, push-ups and squats felt solid.",
      createdAt: new Date("2025-12-05T07:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: pushup.id } },
            sets: 3,
            reps: 12,
            rest: 60,
          },
          {
            exercise: { connect: { id: squat.id } },
            sets: 3,
            reps: 15,
            rest: 60,
          },
          {
            exercise: { connect: { id: gluteBridgeRecovery.id } },
            sets: 2,
            reps: 20,
            rest: 45,
          },
          {
            exercise: { connect: { id: plank.id } },
            sets: 2,
            plankHoldTime: 60,
            rest: 30,
          },
        ],
      },
    },
  });

  // WorkoutLog 2: Beginner Cardio Endurance
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: rishabh.id } },
      plan: { connect: { id: beginnerCardioEndurance.id } },
      duration: 1800,
      notes: "Smooth pace, felt energized throughout.",
      createdAt: new Date("2025-12-06T07:30:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: lightJog.id } },
            duration: 600,
            distance: 1300,
          },
          {
            exercise: { connect: { id: cycling.id } },
            duration: 480,
            distance: 3000,
          },
          {
            exercise: { connect: { id: elliptical.id } },
            duration: 300,
            distance: 1100,
          },
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 300,
          },
        ],
      },
    },
  });

  // WorkoutLog 3: Intermediate Core Burner
  const rishabhLog3 = await prisma.workoutLog.create({
    data: {
      user: { connect: { id: rishabh.id } },
      plan: { connect: { id: intermediateCorePlan.id } },
      duration: 2100,
      notes: "Challenging ab session, maintained form well.",
      createdAt: new Date("2025-12-07T08:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: sitUps.id } },
            sets: 3,
            reps: 15,
            rest: 30,
          },
          {
            exercise: { connect: { id: flutterKicks.id } },
            sets: 3,
            reps: 20,
            rest: 30,
          },
          {
            exercise: { connect: { id: vUps.id } },
            sets: 3,
            reps: 12,
            rest: 45,
          },
          {
            exercise: { connect: { id: cableWoodchoppers.id } },
            sets: 3,
            reps: 12,
            rest: 45,
          },
          {
            exercise: { connect: { id: stabilityBallCrunches.id } },
            sets: 2,
            reps: 20,
            rest: 30,
          },
        ],
      },
    },
  });

  // WorkoutLog 4: Beginner Mind-Body Flow
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: rishabh.id } },
      plan: { connect: { id: beginnerMindBodyPlan.id } },
      duration: 1500,
      notes: "Calm and focused, enjoyed the meditation segment.",
      createdAt: new Date("2025-12-08T07:45:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: sunSalutation.id } },
            reps: 5,
          },
          {
            exercise: { connect: { id: standingForwardBend.id } },
            staticFlexibility: 30,
          },
          {
            exercise: { connect: { id: lotusPose.id } },
            staticFlexibility: 30,
          },
          {
            exercise: { connect: { id: seatedMeditation.id } },
            duration: 5 * 60,
          },
        ],
      },
    },
  });

  // WorkoutLog 5: Advanced Full-Body Hybrid
  const rishabhLog5 = await prisma.workoutLog.create({
    data: {
      user: { connect: { id: rishabh.id } },
      plan: { connect: { id: advancedFullBodyHybrid.id } },
      duration: 3900,
      notes: "High-intensity hybrid, full-body workout completed.",
      createdAt: new Date("2025-12-09T08:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: deadlift.id } },
            sets: 4,
            reps: 8,
            weightUsed: 60,
            vol: 1920,
            rest: 120,
          },
          {
            exercise: { connect: { id: barbellSquats.id } },
            sets: 4,
            reps: 10,
            weightUsed: 50,
            vol: 2000,
            rest: 90,
          },
          {
            exercise: { connect: { id: benchPress.id } },
            sets: 4,
            reps: 12,
            weightUsed: 40,
            vol: 1920,
            rest: 90,
          },
          {
            exercise: { connect: { id: pullUp.id } },
            sets: 3,
            reps: 10,
            rest: 60,
          },
          {
            exercise: { connect: { id: battleRopes.id } },
            duration: 60,
            sets: 4,
            rest: 30,
          },
          {
            exercise: { connect: { id: sprintIntervals.id } },
            distance: 400,
            sets: 3,
            rest: 90,
          },
        ],
      },
    },
  });

  // --- USER: AADYA ---

  // WorkoutLog 1: Beginner Strength Plan
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: aadya.id } },
      plan: { connect: { id: beginnerStrengthPlan.id } },
      duration: 1680,
      notes: "Strong session, push-ups more stable.",
      createdAt: new Date("2025-11-20T10:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: pushup.id } },
            sets: 3,
            reps: 12,
            rest: 60,
          },
          {
            exercise: { connect: { id: squat.id } },
            sets: 3,
            reps: 15,
            rest: 60,
          },
          {
            exercise: { connect: { id: deadlift.id } },
            sets: 2,
            reps: 20,
            rest: 45,
          },
          {
            exercise: { connect: { id: plank.id } },
            sets: 2,
            plankHoldTime: 60,
            rest: 30,
          },
        ],
      },
    },
  });

  // WorkoutLog 2: Beginner Cardio Endurance
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: aadya.id } },
      plan: { connect: { id: beginnerCardioEndurance.id } },
      duration: 1800,
      notes: "Cycling felt smooth, pace consistent.",
      createdAt: new Date("2025-11-21T09:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: lightJog.id } },
            duration: 600,
            distance: 1200,
          },
          {
            exercise: { connect: { id: cycling.id } },
            duration: 480,
            distance: 3100,
          },
          {
            exercise: { connect: { id: elliptical.id } },
            duration: 300,
            distance: 1000,
          },
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 300,
          },
        ],
      },
    },
  });

  // WorkoutLog 3: Intermediate Cardio & Core
  const aadyaLog3 = await prisma.workoutLog.create({
    data: {
      user: { connect: { id: aadya.id } },
      plan: { connect: { id: intermediateCardioCorePlan.id } },
      duration: 2400,
      notes: "Core challenging but completed all sets.",
      createdAt: new Date("2025-11-22T08:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 60,
            sets: 4,
          },
          {
            exercise: { connect: { id: burpeePushup.id } },
            reps: 12,
            sets: 4,
            rest: 45,
          },
          {
            exercise: { connect: { id: russianTwist.id } },
            reps: 15,
            sets: 3,
            rest: 30,
          },
          {
            exercise: { connect: { id: mountainClimbers.id } },
            duration: 60,
            sets: 2,
            rest: 30,
          },
        ],
      },
    },
  });

  // WorkoutLog 4: Beginner Mind-Body Flow
  const aadyaLog4 = await prisma.workoutLog.create({
    data: {
      user: { connect: { id: aadya.id } },
      plan: { connect: { id: beginnerMindBodyPlan.id } },
      duration: 1500,
      notes: "Relaxing yoga, focused on breath and posture.",
      createdAt: new Date("2025-11-23T09:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: sunSalutation.id } },
            reps: 5,
          },
          {
            exercise: { connect: { id: standingForwardBend.id } },
            staticFlexibility: 30,
          },
          {
            exercise: { connect: { id: lotusPose.id } },
            staticFlexibility: 30,
          },
          {
            exercise: { connect: { id: seatedMeditation.id } },
            duration: 5 * 60,
          },
        ],
      },
    },
  });

  // WorkoutLog 5: Advanced HIIT Strength
  await prisma.workoutLog.create({
    data: {
      user: { connect: { id: aadya.id } },
      plan: { connect: { id: advancedHIITStrengthPlan.id } },
      duration: 3300,
      notes: "High-intensity, legs and core really taxed.",
      createdAt: new Date("2025-11-24T09:30:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: barbellSquats.id } },
            sets: 5,
            reps: 12,
            weightUsed: 50,
            vol: 3000,
            rest: 120,
          },
          {
            exercise: { connect: { id: deadlift.id } },
            sets: 5,
            reps: 10,
            weightUsed: 60,
            vol: 3000,
            rest: 120,
          },
          {
            exercise: { connect: { id: pullUp.id } },
            sets: 5,
            reps: 15,
            rest: 90,
          },
          {
            exercise: { connect: { id: overheadShoulderStretch.id } },
            sets: 5,
            reps: 12,
            weightUsed: 25,
            vol: 1500,
            rest: 90,
          },
          {
            exercise: { connect: { id: jumpSquats.id } },
            sets: 4,
            reps: 20,
            rest: 60,
          },
          {
            exercise: { connect: { id: battleRopes.id } },
            duration: 60,
            sets: 3,
            rest: 30,
          },
          {
            exercise: { connect: { id: hangingLegRaise.id } },
            sets: 3,
            reps: 12,
            rest: 60,
          },
        ],
      },
    },
  });

  // POSTS

  await prisma.post.createMany({
    data: [
      {
        userid: shreya.id,
        title: "Crushed my strength workout today!",
        body: "Completed Beginner Strength Plan 💪 Feeling energized.",
        workoutLogid: shreyaLog1.id,
      },
      {
        userid: shreya.id,
        title: "Morning yoga feels amazing",
        body: "Did a mind-body flow session today 🧘‍♀️ Feeling relaxed and focused.",
        workoutLogid: shreyaLog4.id,
      },
      {
        userid: zoya.id,
        title: "First 5k completed!",
        body: "Cardio endurance session done. Legs feel strong!",
        workoutLogid: zoyaLog2.id,
      },
      {
        userid: zoya.id,
        title: "Yoga morning session",
        body: "Mind-body flow really helps me focus and calm down.",
        workoutLogid: zoyaLog4.id,
      },
      {
        userid: aadya.id,
        title: "Core workout complete!",
        body: "Intermediate core plan done. Feeling strong 💪",
        workoutLogid: aadyaLog3.id,
      },
      {
        userid: aadya.id,
        title: "Morning mind-body session 🧘‍♀️",
        body: "Feeling calm after my yoga flow.",
        workoutLogid: aadyaLog4.id,
      },
      {
        userid: rishabh.id,
        title: "Advanced full-body session complete!",
        body: "Pushed through a hybrid HIIT + strength workout. Legs and core burning 🔥",
        workoutLogid: rishabhLog5.id,
      },
      {
        userid: rishabh.id,
        title: "Morning HIIT complete 🏃‍♂️",
        body: "Jump ropes, burpees, and mountain climbers today. Heart rate up!",
        workoutLogid: rishabhLog3.id,
      },
      {
        userid: aarav.id,
        title: "Leg day intensity 🔥",
        body: "Hit some squats and lunges today. Feeling pumped!",
      },
      {
        userid: riya.id,
        title: "Morning run done 🌞",
        body: "Quick 3k run before breakfast. Feeling energized!",
      },
      {
        userid: ananya.id,
        title: "Evening stretch routine 🧘‍♀️",
        body: "Relaxed my shoulders and hamstrings after work.",
      },
      {
        userid: vihaan.id,
        title: "HIIT burnout complete 💦",
        body: "30 minutes of burpees, mountain climbers, and jump squats.",
      },
      {
        userid: reyansh.id,
        title: "Chest & triceps session",
        body: "Focused on bench press, dips, and push-ups. Arms tired but satisfied.",
      },
      {
        userid: ishan.id,
        title: "Quick HIIT blast",
        body: "20 min HIIT session done, legs are smoked 🔥",
      },
      {
        userid: devansh.id,
        title: "Legs & cardio combo",
        body: "Completed squats, lunges, and 2k row. Feeling strong!",
      },
      {
        userid: arjun.id,
        title: "Core session completed",
        body: "Russian twists, planks, and crunches done. Feeling pumped!",
      },
    ],
  });

  // --- USER MEASUREMENTS ---

  await prisma.measurement.createMany({
    data: [
      { userid: shreya.id, height: 165, weight: 58, fatPct: 21.5 },
      { userid: zoya.id, height: 160, weight: 54, fatPct: 20.0 },
      { userid: aadya.id, height: 168, weight: 62, fatPct: 22.0 },
      { userid: aarav.id, height: 175, weight: 70, fatPct: 18.0 },
      { userid: riya.id, height: 162, weight: 56, fatPct: 19.5 },
      { userid: ananya.id, height: 166, weight: 59, fatPct: 21.0 },
      { userid: vihaan.id, height: 178, weight: 72, fatPct: 17.5 },
      { userid: reyansh.id, height: 180, weight: 75, fatPct: 18.5 },
      { userid: ishan.id, height: 172, weight: 68, fatPct: 19.0 },
      { userid: devansh.id, height: 176, weight: 73, fatPct: 18.0 },
      { userid: arjun.id, height: 174, weight: 69, fatPct: 18.8 },
      { userid: rishabh.id, height: 177, weight: 71, fatPct: 18.2 },
    ],
  });
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
