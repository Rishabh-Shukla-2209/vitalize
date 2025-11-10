import {
  PrismaClient,
  Gender,
  Difficulty,
  ExerciseCategory,
  MuscleGroup,
  Equipment,
} from "@/generated/prisma";

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🗑️ Clearing existing data...");

  // Order matters if you don’t use cascade deletes
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

//If seeding this big chunk of code fails, break it into multiple parts and then seed.

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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Running (Treadmill)",
      category: ExerciseCategory.CARDIO,
      instructions:
        "Run at a steady pace on the treadmill, adjusting speed and incline as needed.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.TREADMILL,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Rowing",
      category: ExerciseCategory.CARDIO,
      instructions:
        "Drive with your legs first, then pull the handle toward your chest, maintaining a straight back.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.ROWING_MACHINE,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Seated Butterfly Stretch",
      category: ExerciseCategory.FLEXIBILITY,
      instructions:
        "Sit with the soles of your feet together and gently press your knees toward the floor.",
      muscleGroup: MuscleGroup.ADDUCTORS,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Kettlebell Swing",
      category: ExerciseCategory.HIIT,
      instructions:
        "Swing the kettlebell between your legs, then thrust hips forward to swing it up to shoulder height.",
      muscleGroup: MuscleGroup.HAMSTRINGS,
      equipment: Equipment.KETTLEBELL,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Box Jumps",
      category: ExerciseCategory.HIIT,
      instructions:
        "Jump explosively from the ground onto a sturdy box or platform, then step down and repeat.",
      muscleGroup: MuscleGroup.QUADS,
      equipment: Equipment.BOX,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Side Plank",
      category: ExerciseCategory.CORE,
      instructions:
        "Lie on your side, prop yourself on one forearm, and hold your body straight, engaging obliques.",
      muscleGroup: MuscleGroup.OBLIQUES,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Ab Rollout",
      category: ExerciseCategory.CORE,
      instructions:
        "Kneel with hands on a barbell or ab wheel, roll forward keeping your abs tight, then return.",
      muscleGroup: MuscleGroup.ABS,
      equipment: Equipment.BARBELL,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Standing Quad Stretch",
      category: ExerciseCategory.FLEXIBILITY,
      instructions:
        "Stand tall, grab one ankle behind you, and gently pull your heel toward your glutes.",
      muscleGroup: MuscleGroup.QUADS,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Cobra Stretch",
      category: ExerciseCategory.FLEXIBILITY,
      instructions:
        "Lie on your stomach, place palms under shoulders, and press up, arching your back.",
      muscleGroup: MuscleGroup.ABS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.create({
    data: {
      name: "Wrist Flexor Stretch",
      category: ExerciseCategory.FLEXIBILITY,
      instructions:
        "Extend one arm in front, palm up, and gently pull fingers downward with the opposite hand.",
      muscleGroup: MuscleGroup.FOREARMS,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Stability Ball Squat",
      category: ExerciseCategory.BALANCE,
      instructions:
        "Squat while stabilizing against a ball or unstable surface to challenge balance.",
      muscleGroup: MuscleGroup.QUADS,
      equipment: Equipment.STABILITY_BALL,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.create({
    data: {
      name: "Single-Leg Calf Raise",
      category: ExerciseCategory.BALANCE,
      instructions:
        "Stand on one leg and rise onto the ball of your foot, then lower slowly.",
      muscleGroup: MuscleGroup.CALVES,
      equipment: Equipment.NONE,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Lunge with Rotation",
      category: ExerciseCategory.BALANCE,
      instructions:
        "Step into a forward lunge while rotating your torso toward the lead leg.",
      muscleGroup: MuscleGroup.OBLIQUES,
      equipment: Equipment.MEDICINE_BALL,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Side-Lying Leg Lift",
      category: ExerciseCategory.BALANCE,
      instructions:
        "Lie on your side and lift the top leg upward, keeping it straight, then lower slowly.",
      muscleGroup: MuscleGroup.ABDUCTORS,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Standing Knee Raise Balance",
      category: ExerciseCategory.BALANCE,
      instructions:
        "Stand on one foot, raise the opposite knee to hip height, and hold position.",
      muscleGroup: MuscleGroup.HIP_FLEXORS,
      equipment: Equipment.NONE,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Cycling (Long Ride)",
      category: ExerciseCategory.ENDURANCE,
      instructions:
        "Maintain a steady pace on a stationary or road bike for long durations.",
      muscleGroup: MuscleGroup.QUADS,
      equipment: Equipment.BIKE,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.create({
    data: {
      name: "Elliptical (Steady Pace)",
      category: ExerciseCategory.ENDURANCE,
      instructions:
        "Use the elliptical at a consistent resistance and pace to sustain aerobic activity.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.ELLIPTICAL,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.create({
    data: {
      name: "Hiking",
      category: ExerciseCategory.ENDURANCE,
      instructions:
        "Walk or climb on natural trails or inclines to build stamina.",
      muscleGroup: MuscleGroup.CALVES,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.create({
    data: {
      name: "Jump Rope (Extended)",
      category: ExerciseCategory.ENDURANCE,
      instructions:
        "Skip rope at a moderate pace for several minutes without rest.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.JUMP_ROPE,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Circuit Training",
      category: ExerciseCategory.ENDURANCE,
      instructions:
        "Perform a series of exercises with light weights and minimal rest between sets.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.DUMBBELL,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.create({
    data: {
      name: "Tempo Run",
      category: ExerciseCategory.ENDURANCE,
      instructions:
        "Run at a comfortably hard pace just below your threshold for a set distance.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.NONE,
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
  await prisma.exerciseCatalog.create({
    data: {
      name: "Foam Rolling Quads",
      category: ExerciseCategory.RECOVERY,
      instructions:
        "Lie face down with the roller under your thighs, slowly roll from hips to knees.",
      muscleGroup: MuscleGroup.QUADS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.create({
    data: {
      name: "Foam Rolling Lats",
      category: ExerciseCategory.RECOVERY,
      instructions:
        "Lie on your side with the roller under your lats, move slowly to release tension.",
      muscleGroup: MuscleGroup.LATS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.create({
    data: {
      name: "Cat-Cow",
      category: ExerciseCategory.RECOVERY,
      instructions:
        "Alternate arching and rounding your spine on all fours to mobilize your back.",
      muscleGroup: MuscleGroup.LOWER_BACK,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Neck Stretch",
      category: ExerciseCategory.RECOVERY,
      instructions:
        "Gently tilt your head to one side, holding with light pressure for a stretch.",
      muscleGroup: MuscleGroup.TRAPS,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Arm Across Chest Stretch",
      category: ExerciseCategory.RECOVERY,
      instructions:
        "Bring one arm across your chest, hold it with the opposite arm for a shoulder stretch.",
      muscleGroup: MuscleGroup.SHOULDERS,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.create({
    data: {
      name: "Seated Forward Fold",
      category: ExerciseCategory.RECOVERY,
      instructions:
        "Sit with legs extended, hinge at the hips, and reach for your toes.",
      muscleGroup: MuscleGroup.HAMSTRINGS,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Tree Pose",
      category: ExerciseCategory.MINDBODY,
      instructions:
        "Stand on one leg, place the other foot on your thigh, and bring palms together overhead.",
      muscleGroup: MuscleGroup.HIP_FLEXORS,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Tai Chi Flow",
      category: ExerciseCategory.MINDBODY,
      instructions:
        "Perform slow, flowing movements that emphasize breathing and balance.",
      muscleGroup: MuscleGroup.FULL_BODY,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.create({
    data: {
      name: "Bridge Pose",
      category: ExerciseCategory.MINDBODY,
      instructions:
        "Lie on your back, bend knees, press feet down, and lift hips toward the ceiling.",
      muscleGroup: MuscleGroup.GLUTES,
      equipment: Equipment.NONE,
      createdByid: null,
    },
  });

  await prisma.exerciseCatalog.create({
    data: {
      name: "Boat Pose",
      category: ExerciseCategory.MINDBODY,
      instructions:
        "Balance on your sit bones with legs lifted and torso leaned back, forming a V shape.",
      muscleGroup: MuscleGroup.ABS,
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

  await prisma.exerciseCatalog.create({
    data: {
      name: "Shoulder Stand",
      category: ExerciseCategory.MINDBODY,
      instructions:
        "Lie flat, lift legs overhead, support hips with hands, and balance weight on shoulders.",
      muscleGroup: MuscleGroup.SHOULDERS,
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
      duration: 25,
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
      duration: 40,
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
      imgUrl: "https://res.cloudinary.com/dlyluxb9z/image/upload/man-doing-pushups-gym-vector-illustration-flat-style_159885-3113_opx4lx.jpg",
      duration: 55,
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
            reps: 60, // seconds
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
      imgUrl: "https://res.cloudinary.com/dlyluxb9z/image/upload/woman-stretching-workout-semi-flat-color-character-editable-figure-full-body-people-on-white-flexibility-exercises-simple-cartoon-style-illustration-for-web-graphic-design-and-animation-vector_v9tr8n.jpg",
      duration: 20,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 2,
            reps: 30, // seconds
            rest: 15,
            exercise: { connect: { id: forwardFold.id } },
          },
          {
            position: 2,
            sets: 2,
            reps: 30, // seconds
            rest: 15,
            exercise: { connect: { id: catCow.id } },
          },
          {
            position: 3,
            sets: 2,
            reps: 30,
            rest: 15,
            exercise: { connect: { id: childsPose.id } },
          },
          {
            position: 4,
            sets: 2,
            reps: 30,
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
      imgUrl: "https://res.cloudinary.com/dlyluxb9z/image/upload/flat-vector-illustration-man-performing-600nw-2667949145_r2xpv6.jpg",
      duration: 30,
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
      imgUrl: "https://res.cloudinary.com/dlyluxb9z/image/upload/vector-kettlebell-swing-exercise-clipart_1218867-3690_lv2fbj.jpg",
      duration: 60,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 1,
            distance: 5, // km run
            time: 25, // minutes
            rest: 120,
            exercise: { connect: { id: longRun.id } },
          },
          {
            position: 2,
            sets: 1,
            time: 10, // minutes
            rest: 60,
            exercise: { connect: { id: enduranceRow.id } },
          },
          {
            position: 3,
            sets: 1,
            time: 10,
            rest: 60,
            exercise: { connect: { id: stairClimb.id } },
          },
          {
            position: 4,
            sets: 1,
            time: 15, // minutes
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
      imgUrl: "https://res.cloudinary.com/dlyluxb9z/image/upload/self-care-1_01_mane2f.jpg",
      duration: 25,
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
      imgUrl: "https://res.cloudinary.com/dlyluxb9z/image/upload/flat-vector-man-doing-sit-ups-towel-under-back-stopwatch-nearby-core-workout-isolated-white-generative-ai-404888182_xohmfp.jpg",
      duration: 35,
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
      imgUrl: "https://res.cloudinary.com/dlyluxb9z/image/upload/1000_F_386831633_M70T62G1gFwq6D1lf0Y3rOxNxQIBPqkc_bnb0gk.jpg",
      duration: 70,
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
      imgUrl: "https://res.cloudinary.com/dlyluxb9z/image/upload/man-running-on-treadmill-sportsman-jogging-on-fitness-equipment-endurance-cardio-run-training-flat-illustration-vector_apbkdy.jpg",
      duration: 30,
      userId: null,
      exercises: {
        create: [
          {
            position: 1,
            sets: 1,
            time: 10, // minutes
            rest: 60,
            exercise: { connect: { id: lightJog.id } },
          },
          {
            position: 2,
            sets: 1,
            time: 8,
            rest: 60,
            exercise: { connect: { id: cycling.id } },
          },
          {
            position: 3,
            sets: 1,
            time: 5,
            rest: 30,
            exercise: { connect: { id: elliptical.id } },
          },
          {
            position: 4,
            sets: 1,
            time: 5,
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
      imgUrl: "https://res.cloudinary.com/dlyluxb9z/image/upload/crossfit-workout-man-woman-doing-physical-exercise-engaged-competitive-fitness-sport-vector-set-young-male-female-271155617_nupmso.jpg",
      duration: 35,
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
      imgUrl: "https://res.cloudinary.com/dlyluxb9z/image/upload/man-workout-in-gym-for-healthy-llifestyle-free-vector_cwcolp.jpg",
      duration: 65,
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
      duration: 28, // minutes
      notes: "Felt strong, form improved on push-ups.",
      createdAt: new Date("2025-09-20T08:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: pushup.id } },
            sets: 3,
            reps: 10,
            weightUsed: 0,
            rest: 60,
            createdAt: new Date("2025-09-20T08:02:00Z"),
          },
          {
            exercise: { connect: { id: squat.id } },
            sets: 3,
            reps: 15,
            weightUsed: 0,
            rest: 60,
            createdAt: new Date("2025-09-20T08:10:00Z"),
          },
          {
            exercise: { connect: { id: gluteBridgeRecovery.id } },
            sets: 2,
            reps: 20,
            rest: 45,
            createdAt: new Date("2025-09-20T08:20:00Z"),
          },
          {
            exercise: { connect: { id: plank.id } },
            sets: 2,
            plankHoldTime: 60, // seconds
            rest: 30,
            createdAt: new Date("2025-09-20T08:25:00Z"),
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
      duration: 30,
      notes: "First 5k completed, breathing well.",
      createdAt: new Date("2025-09-21T07:30:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: lightJog.id } },
            duration: 10,
            distance: 1.2, // km
            createdAt: new Date("2025-09-21T07:30:00Z"),
          },
          {
            exercise: { connect: { id: cycling.id } },
            duration: 8,
            distance: 3.0,
            createdAt: new Date("2025-09-21T07:40:00Z"),
          },
          {
            exercise: { connect: { id: elliptical.id } },
            duration: 5,
            distance: 1.0,
            createdAt: new Date("2025-09-21T07:50:00Z"),
          },
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 5,
            createdAt: new Date("2025-09-21T07:55:00Z"),
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
      duration: 20,
      notes: "Felt relaxed after stretches, shoulder tension released.",
      createdAt: new Date("2025-09-22T09:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: hamstringStretchRecovery.id } },
            staticFlexibility: 30, // seconds
            createdAt: new Date("2025-09-22T09:00:00Z"),
          },
          {
            exercise: { connect: { id: catCow.id } },
            reps: 10,
            createdAt: new Date("2025-09-22T09:05:00Z"),
          },
          {
            exercise: { connect: { id: childsPose.id } },
            staticFlexibility: 30,
            createdAt: new Date("2025-09-22T09:10:00Z"),
          },
          {
            exercise: { connect: { id: chestOpener.id } },
            staticFlexibility: 30,
            createdAt: new Date("2025-09-22T09:15:00Z"),
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
      duration: 25,
      notes: "Focused on breathing, felt calm and energized.",
      createdAt: new Date("2025-09-23T07:45:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: sunSalutation.id } },
            reps: 5,
            createdAt: new Date("2025-09-23T07:45:00Z"),
          },
          {
            exercise: { connect: { id: standingForwardBend.id } },
            staticFlexibility: 30,
            createdAt: new Date("2025-09-23T07:50:00Z"),
          },
          {
            exercise: { connect: { id: lotusPose.id } },
            staticFlexibility: 30,
            createdAt: new Date("2025-09-23T07:55:00Z"),
          },
          {
            exercise: { connect: { id: seatedMeditation.id } },
            duration: 5 * 60, // seconds
            createdAt: new Date("2025-09-23T08:00:00Z"),
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
      duration: 40,
      notes: "Core felt tight, cardio was challenging but doable.",
      createdAt: new Date("2025-09-24T08:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 60,
            reps: 1,
            createdAt: new Date("2025-09-24T08:00:00Z"),
          },
          {
            exercise: { connect: { id: burpeePushup.id } },
            reps: 12,
            sets: 4,
            rest: 45,
            createdAt: new Date("2025-09-24T08:10:00Z"),
          },
          {
            exercise: { connect: { id: russianTwist.id } },
            reps: 15,
            sets: 3,
            rest: 30,
            createdAt: new Date("2025-09-24T08:20:00Z"),
          },
          {
            exercise: { connect: { id: mountainClimbers.id } },
            duration: 60,
            sets: 2,
            rest: 30,
            createdAt: new Date("2025-09-24T08:30:00Z"),
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
      duration: 27,
      notes: "Good energy today, push-ups improved.",
      createdAt: new Date("2025-09-20T09:00:00Z"),
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
      duration: 30,
      notes: "Felt strong on the elliptical today.",
      createdAt: new Date("2025-09-21T08:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: lightJog.id } },
            duration: 10,
            distance: 1.3,
          },
          {
            exercise: { connect: { id: cycling.id } },
            duration: 8,
            distance: 3.2,
          },
          {
            exercise: { connect: { id: elliptical.id } },
            duration: 5,
            distance: 1.1,
          },
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 5,
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
      duration: 42,
      notes: "Core was challenging but managed all sets.",
      createdAt: new Date("2025-09-22T07:30:00Z"),
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
      duration: 25,
      notes: "Yoga session felt relaxing, breathing improved.",
      createdAt: new Date("2025-09-23T08:30:00Z"),
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
      duration: 55,
      notes: "Intense HIIT, heart rate up throughout. Rest periods crucial.",
      createdAt: new Date("2025-09-24T09:00:00Z"),
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
      duration: 28,
      notes: "Good session, push-ups and squats felt solid.",
      createdAt: new Date("2025-09-20T07:00:00Z"),
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
      duration: 30,
      notes: "Smooth pace, felt energized throughout.",
      createdAt: new Date("2025-09-21T07:30:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: lightJog.id } },
            duration: 10,
            distance: 1.3,
          },
          {
            exercise: { connect: { id: cycling.id } },
            duration: 8,
            distance: 3.0,
          },
          {
            exercise: { connect: { id: elliptical.id } },
            duration: 5,
            distance: 1.1,
          },
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 5,
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
      duration: 35,
      notes: "Challenging ab session, maintained form well.",
      createdAt: new Date("2025-09-22T08:00:00Z"),
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
      duration: 25,
      notes: "Calm and focused, enjoyed the meditation segment.",
      createdAt: new Date("2025-09-23T07:45:00Z"),
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
      duration: 65,
      notes: "High-intensity hybrid, full-body workout completed.",
      createdAt: new Date("2025-09-24T08:00:00Z"),
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
      duration: 28,
      notes: "Strong session, push-ups more stable.",
      createdAt: new Date("2025-09-20T10:00:00Z"),
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
      duration: 30,
      notes: "Cycling felt smooth, pace consistent.",
      createdAt: new Date("2025-09-21T09:00:00Z"),
      exercises: {
        create: [
          {
            exercise: { connect: { id: lightJog.id } },
            duration: 10,
            distance: 1.2,
          },
          {
            exercise: { connect: { id: cycling.id } },
            duration: 8,
            distance: 3.1,
          },
          {
            exercise: { connect: { id: elliptical.id } },
            duration: 5,
            distance: 1.0,
          },
          {
            exercise: { connect: { id: jumpRope.id } },
            duration: 5,
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
      duration: 40,
      notes: "Core challenging but completed all sets.",
      createdAt: new Date("2025-09-22T08:00:00Z"),
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
      duration: 25,
      notes: "Relaxing yoga, focused on breath and posture.",
      createdAt: new Date("2025-09-23T09:00:00Z"),
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
      duration: 55,
      notes: "High-intensity, legs and core really taxed.",
      createdAt: new Date("2025-09-24T09:30:00Z"),
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

  const postShreya1 = await prisma.post.create({
    data: {
      user: { connect: { id: shreya.id } },
      title: "Crushed my strength workout today!",
      body: "Completed Beginner Strength Plan 💪 Feeling energized.",
      workoutLog: { connect: { id: shreyaLog1.id } },
    },
  });

  const postShreya2 = await prisma.post.create({
    data: {
      user: { connect: { id: shreya.id } },
      title: "Morning yoga feels amazing",
      body: "Did a mind-body flow session today 🧘‍♀️ Feeling relaxed and focused.",
      workoutLog: { connect: { id: shreyaLog4.id } },
    },
  });
  const postZoya1 = await prisma.post.create({
    data: {
      user: { connect: { id: zoya.id } },
      title: "First 5k completed!",
      body: "Cardio endurance session done. Legs feel strong!",
      workoutLog: { connect: { id: zoyaLog2.id } },
    },
  });

  const postZoya2 = await prisma.post.create({
    data: {
      user: { connect: { id: zoya.id } },
      title: "Yoga morning session",
      body: "Mind-body flow really helps me focus and calm down.",
      workoutLog: { connect: { id: zoyaLog4.id } },
    },
  });

  const postAadya1 = await prisma.post.create({
    data: {
      user: { connect: { id: aadya.id } },
      title: "Core workout complete!",
      body: "Intermediate core plan done. Feeling strong 💪",
      workoutLog: { connect: { id: aadyaLog3.id } },
    },
  });

  const postAadya2 = await prisma.post.create({
    data: {
      user: { connect: { id: aadya.id } },
      title: "Morning mind-body session 🧘‍♀️",
      body: "Feeling calm after my yoga flow.",
      workoutLog: { connect: { id: aadyaLog4.id } },
    },
  });

  const postRishabh1 = await prisma.post.create({
    data: {
      user: { connect: { id: rishabh.id } },
      title: "Advanced full-body session complete!",
      body: "Pushed through a hybrid HIIT + strength workout. Legs and core burning 🔥",
      workoutLog: { connect: { id: rishabhLog5.id } },
    },
  });

  const postRishabh2 = await prisma.post.create({
    data: {
      user: { connect: { id: rishabh.id } },
      title: "Morning HIIT complete 🏃‍♂️",
      body: "Jump ropes, burpees, and mountain climbers today. Heart rate up!",
      workoutLog: { connect: { id: rishabhLog3.id } },
    },
  });

  const postAarav1 = await prisma.post.create({
    data: {
      user: { connect: { id: aarav.id } },
      title: "Leg day intensity 🔥",
      body: "Hit some squats and lunges today. Feeling pumped!",
    },
  });

  const postRiya1 = await prisma.post.create({
    data: {
      user: { connect: { id: riya.id } },
      title: "Morning run done 🌞",
      body: "Quick 3k run before breakfast. Feeling energized!",
    },
  });

  const postAnanya1 = await prisma.post.create({
    data: {
      user: { connect: { id: ananya.id } },
      title: "Evening stretch routine 🧘‍♀️",
      body: "Relaxed my shoulders and hamstrings after work.",
    },
  });

  const postVihaan1 = await prisma.post.create({
    data: {
      user: { connect: { id: vihaan.id } },
      title: "HIIT burnout complete 💦",
      body: "30 minutes of burpees, mountain climbers, and jump squats.",
    },
  });

  const postReyansh1 = await prisma.post.create({
    data: {
      user: { connect: { id: reyansh.id } },
      title: "Chest & triceps session",
      body: "Focused on bench press, dips, and push-ups. Arms tired but satisfied.",
    },
  });

  const postIshan1 = await prisma.post.create({
    data: {
      user: { connect: { id: ishan.id } },
      title: "Quick HIIT blast",
      body: "20 min HIIT session done, legs are smoked 🔥",
    },
  });

  const postDevansh1 = await prisma.post.create({
    data: {
      user: { connect: { id: devansh.id } },
      title: "Legs & cardio combo",
      body: "Completed squats, lunges, and 2k row. Feeling strong!",
    },
  });

  const postArjun1 = await prisma.post.create({
    data: {
      user: { connect: { id: arjun.id } },
      title: "Core session completed",
      body: "Russian twists, planks, and crunches done. Feeling pumped!",
    },
  });

  // Comments

  await prisma.comment.createMany({
    data: [
      // --- PostShreya1 ---
      {
        userid: riya.id,
        postid: postShreya1.id,
        text: "Amazing effort, Shreya! Keep it up! 🙌",
      },
      { userid: aarav.id, postid: postShreya1.id, text: "Nice progress 💪" },
      { userid: vihaan.id, postid: postShreya1.id, text: "Killing it! 💪" },
      {
        userid: rishabh.id,
        postid: postShreya1.id,
        text: "Inspiring progress!",
      },

      // --- PostShreya2 ---
      {
        userid: devansh.id,
        postid: postShreya2.id,
        text: "Yoga vibes! So calming 🌞",
      },
      { userid: ananya.id, postid: postShreya2.id, text: "Yoga goals! 🌿" },

      // --- PostZoya1 ---
      {
        userid: ananya.id,
        postid: postZoya1.id,
        text: "Well done Zoya! Keep pushing! 🚀",
      },
      { userid: ishan.id, postid: postZoya1.id, text: "Impressive run! 👏" },
      { userid: shreya.id, postid: postZoya1.id, text: "Wow, great run!" },
      {
        userid: reyansh.id,
        postid: postZoya1.id,
        text: "Impressive pace! 👏",
      },

      // --- PostZoya2 ---
      {
        userid: devansh.id,
        postid: postZoya2.id,
        text: "Love it! Yoga is life 🌿",
      },
      {
        userid: vihaan.id,
        postid: postZoya2.id,
        text: "Meditation mode on! 🧘‍♂️",
      },

      // --- PostAadya1 ---
      {
        userid: aarav.id,
        postid: postAadya1.id,
        text: "Core goals achieved! Great job!",
      },
      {
        userid: vihaan.id,
        postid: postAadya1.id,
        text: "Keep crushing it! 🔥",
      },
      {
        userid: zoya.id,
        postid: postAadya1.id,
        text: "Crushing that core! 🔥",
      },
      { userid: riya.id, postid: postAadya1.id, text: "Inspiring!" },

      // --- PostAadya2 ---
      { userid: zoya.id, postid: postAadya2.id, text: "Yoga vibes! 🌿" },
      {
        userid: aarav.id,
        postid: postAadya2.id,
        text: "Looks so relaxing! 🌿",
      },

      // --- PostRishabh1 ---
      {
        userid: shreya.id,
        postid: postRishabh1.id,
        text: "Wow, Rishabh! That looks intense!",
      },
      { userid: aarav.id, postid: postRishabh1.id, text: "Respect! 💪" },
      {
        userid: zoya.id,
        postid: postRishabh1.id,
        text: "Insane session, respect! 😲",
      },
      {
        userid: shreya.id,
        postid: postRishabh1.id,
        text: "Absolute beast mode 💪",
      },

      // --- PostRishabh2 ---
      {
        userid: vihaan.id,
        postid: postRishabh2.id,
        text: "Killing it, Rishabh! 🔥",
      },
      {
        userid: ananya.id,
        postid: postRishabh2.id,
        text: "Heart rate up just reading this 😅",
      },

      // --- PostAarav1 ---
      {
        userid: rishabh.id,
        postid: postAarav1.id,
        text: "Legs on fire! Keep it up!",
      },
      {
        userid: rishabh.id,
        postid: postAarav1.id,
        text: "Leg day intensity! 💥",
      },
      { userid: vihaan.id, postid: postAarav1.id, text: "Squats on point!" },

      // --- PostRiya1 ---
      { userid: ananya.id, postid: postRiya1.id, text: "Nice pace, Riya!" },
      {
        userid: shreya.id,
        postid: postRiya1.id,
        text: "Great job keeping up the pace!",
      },
      {
        userid: aadya.id,
        postid: postRiya1.id,
        text: "3k is impressive! 🚀",
      },

      // --- PostAnanya1 ---
      {
        userid: vihaan.id,
        postid: postAnanya1.id,
        text: "Stretching is life! 💯",
      },
      {
        userid: riya.id,
        postid: postAnanya1.id,
        text: "Stretching goals! 🌿",
      },

      // --- PostVihaan1 ---
      {
        userid: devansh.id,
        postid: postVihaan1.id,
        text: "Beast mode activated! 🔥",
      },
      { userid: devansh.id, postid: postVihaan1.id, text: "Beast mode! 🔥" },
      { userid: arjun.id, postid: postVihaan1.id, text: "Crushing it!" },

      // --- PostReyansh1 ---
      {
        userid: arjun.id,
        postid: postReyansh1.id,
        text: "Strong session! 💪",
      },
      {
        userid: ishan.id,
        postid: postReyansh1.id,
        text: "Chest day champion!",
      },
      { userid: aarav.id, postid: postReyansh1.id, text: "Great focus!" },

      // --- PostIshan1 ---
      { userid: reyansh.id, postid: postIshan1.id, text: "You crushed it!" },
      {
        userid: reyansh.id,
        postid: postIshan1.id,
        text: "20 min HIIT? Respect! 🔥",
      },

      // --- PostDevansh1 ---
      {
        userid: shreya.id,
        postid: postDevansh1.id,
        text: "Great combo session! 💪",
      },
      {
        userid: shreya.id,
        postid: postDevansh1.id,
        text: "Legs & cardio combo goals!",
      },

      // --- PostArjun1 ---
      {
        userid: rishabh.id,
        postid: postArjun1.id,
        text: "Core game strong! 🔥",
      },
      {
        userid: vihaan.id,
        postid: postArjun1.id,
        text: "Core strong! Keep going 💪",
      },
    ],
  });


  // --- MEASUREMENT ---
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

  // --- NOTIFICATION ---
  // --- NOTIFICATIONS FOR SHREYA'S POSTS ---
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
