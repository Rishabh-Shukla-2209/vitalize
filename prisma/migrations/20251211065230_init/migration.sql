-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('CARDIO', 'STRENGTH', 'FLEXIBILITY', 'HIIT', 'CORE', 'BALANCE', 'ENDURANCE', 'RECOVERY', 'MINDBODY');

-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'FOREARMS', 'TRAPS', 'ROTATOR_CUFF', 'ABS', 'OBLIQUES', 'LOWER_BACK', 'LATS', 'QUADS', 'HAMSTRINGS', 'GLUTES', 'CALVES', 'HIP_FLEXORS', 'ADDUCTORS', 'ABDUCTORS', 'FULL_BODY');

-- CreateEnum
CREATE TYPE "Equipment" AS ENUM ('NONE', 'DUMBBELL', 'BARBELL', 'KETTLEBELL', 'RESISTANCE_BAND', 'MACHINE', 'CABLE', 'SMITH_MACHINE', 'EZ_BAR', 'MEDICINE_BALL', 'STABILITY_BALL', 'BENCH', 'BOX', 'JUMP_ROPE', 'PULL_UP_BAR', 'TRX', 'TREADMILL', 'BIKE', 'ROWING_MACHINE', 'ELLIPTICAL');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FOLLOW', 'FOLLOW_REQUESTED', 'FOLLOW_ACCEPTED', 'LIKE_POST', 'LIKE_COMMENT', 'COMMENT_POST', 'COMMENT_COMMENT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ABANDONED', 'IN_PROGRESS', 'ACHIEVED', 'MISSED');

-- CreateEnum
CREATE TYPE "Privacy" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('REQUESTED', 'ACCEPTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "imgUrl" TEXT,
    "gender" "Gender",
    "dateOfBirth" TIMESTAMP(3),
    "currentStreakDays" INTEGER NOT NULL DEFAULT 0,
    "longestStreakDays" INTEGER NOT NULL DEFAULT 0,
    "lastActiveOn" TIMESTAMP(3),
    "about" TEXT,
    "bio" TEXT,
    "privacy" "Privacy" NOT NULL DEFAULT 'PUBLIC',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseCatalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ExerciseCategory" NOT NULL,
    "instructions" TEXT NOT NULL,
    "imgUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "muscleGroup" "MuscleGroup" NOT NULL,
    "equipment" "Equipment",
    "createdByid" TEXT,

    CONSTRAINT "ExerciseCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "level" "Difficulty" NOT NULL,
    "name" TEXT NOT NULL,
    "imgUrl" TEXT,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanExercise" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL DEFAULT 0,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "rest" INTEGER NOT NULL DEFAULT 0,
    "distance" DOUBLE PRECISION,
    "time" INTEGER,
    "exerciseid" TEXT NOT NULL,
    "WorkoutPlanid" TEXT NOT NULL,

    CONSTRAINT "PlanExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planid" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "WorkoutLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseLog" (
    "id" TEXT NOT NULL,
    "exerciseid" TEXT NOT NULL,
    "sets" INTEGER NOT NULL DEFAULT 0,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "vol" INTEGER NOT NULL DEFAULT 0,
    "weightUsed" INTEGER NOT NULL DEFAULT 0,
    "rest" INTEGER NOT NULL DEFAULT 0,
    "distance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "heartRate" INTEGER NOT NULL DEFAULT 0,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "caloriesBurned" INTEGER NOT NULL DEFAULT 0,
    "vo2Max" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rpe" INTEGER NOT NULL DEFAULT 0,
    "rangeOfMotion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "staticFlexibility" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dynamicFlexibility" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "workIntervalDuration" INTEGER NOT NULL DEFAULT 0,
    "restIntervalDuration" INTEGER NOT NULL DEFAULT 0,
    "workToRestRatio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "plankHoldTime" INTEGER NOT NULL DEFAULT 0,
    "tug" INTEGER NOT NULL DEFAULT 0,
    "timeToExhaustion" INTEGER NOT NULL DEFAULT 0,
    "heartRateVariability" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "WorkoutLogid" TEXT NOT NULL,

    CONSTRAINT "ExerciseLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "height" INTEGER,
    "weight" INTEGER NOT NULL,
    "fatPct" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'IN_PROGRESS',
    "targetExerciseid" TEXT NOT NULL,
    "targetField" TEXT NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "initialValue" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PR" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "exerciseid" TEXT NOT NULL,
    "prField" TEXT NOT NULL,
    "prValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "status" "FollowStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "imgUrl" TEXT,
    "workoutLogid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "privacy" "Privacy" NOT NULL DEFAULT 'PUBLIC',

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "postid" TEXT NOT NULL,
    "parentid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLike" (
    "id" TEXT NOT NULL,
    "postid" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "id" TEXT NOT NULL,
    "commentid" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "recipientid" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "actorId" TEXT NOT NULL,
    "postid" TEXT,
    "commentid" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInteraction" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "requestText" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "model" TEXT NOT NULL,
    "tokensInput" INTEGER NOT NULL,
    "tokensOutput" INTEGER NOT NULL,

    CONSTRAINT "AiInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExerciseLogToPlanExercise" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExerciseLogToPlanExercise_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseCatalog_name_key" ON "ExerciseCatalog"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutPlan_name_key" ON "WorkoutPlan"("name");

-- CreateIndex
CREATE INDEX "WorkoutPlan_userId_idx" ON "WorkoutPlan"("userId");

-- CreateIndex
CREATE INDEX "WorkoutLog_userId_createdAt_idx" ON "WorkoutLog"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ExerciseLog_WorkoutLogid_idx" ON "ExerciseLog"("WorkoutLogid");

-- CreateIndex
CREATE INDEX "ExerciseLog_exerciseid_idx" ON "ExerciseLog"("exerciseid");

-- CreateIndex
CREATE UNIQUE INDEX "Measurement_userid_measuredAt_key" ON "Measurement"("userid", "measuredAt");

-- CreateIndex
CREATE INDEX "Goal_userid_idx" ON "Goal"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "PR_userid_exerciseid_key" ON "PR"("userid", "exerciseid");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "Post_createdAt_id_idx" ON "Post"("createdAt" DESC, "id");

-- CreateIndex
CREATE INDEX "Post_userid_idx" ON "Post"("userid");

-- CreateIndex
CREATE INDEX "Comment_postid_idx" ON "Comment"("postid");

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_postid_userid_key" ON "PostLike"("postid", "userid");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_commentid_userid_key" ON "CommentLike"("commentid", "userid");

-- CreateIndex
CREATE INDEX "Notification_recipientid_createdAt_idx" ON "Notification"("recipientid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "_ExerciseLogToPlanExercise_B_index" ON "_ExerciseLogToPlanExercise"("B");

-- AddForeignKey
ALTER TABLE "ExerciseCatalog" ADD CONSTRAINT "ExerciseCatalog_createdByid_fkey" FOREIGN KEY ("createdByid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutPlan" ADD CONSTRAINT "WorkoutPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanExercise" ADD CONSTRAINT "PlanExercise_exerciseid_fkey" FOREIGN KEY ("exerciseid") REFERENCES "ExerciseCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanExercise" ADD CONSTRAINT "PlanExercise_WorkoutPlanid_fkey" FOREIGN KEY ("WorkoutPlanid") REFERENCES "WorkoutPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_planid_fkey" FOREIGN KEY ("planid") REFERENCES "WorkoutPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseLog" ADD CONSTRAINT "ExerciseLog_exerciseid_fkey" FOREIGN KEY ("exerciseid") REFERENCES "ExerciseCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseLog" ADD CONSTRAINT "ExerciseLog_WorkoutLogid_fkey" FOREIGN KEY ("WorkoutLogid") REFERENCES "WorkoutLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_targetExerciseid_fkey" FOREIGN KEY ("targetExerciseid") REFERENCES "ExerciseCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PR" ADD CONSTRAINT "PR_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PR" ADD CONSTRAINT "PR_exerciseid_fkey" FOREIGN KEY ("exerciseid") REFERENCES "ExerciseCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_workoutLogid_fkey" FOREIGN KEY ("workoutLogid") REFERENCES "WorkoutLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postid_fkey" FOREIGN KEY ("postid") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentid_fkey" FOREIGN KEY ("parentid") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_postid_fkey" FOREIGN KEY ("postid") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_commentid_fkey" FOREIGN KEY ("commentid") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientid_fkey" FOREIGN KEY ("recipientid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postid_fkey" FOREIGN KEY ("postid") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentid_fkey" FOREIGN KEY ("commentid") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiInteraction" ADD CONSTRAINT "AiInteraction_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseLogToPlanExercise" ADD CONSTRAINT "_ExerciseLogToPlanExercise_A_fkey" FOREIGN KEY ("A") REFERENCES "ExerciseLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseLogToPlanExercise" ADD CONSTRAINT "_ExerciseLogToPlanExercise_B_fkey" FOREIGN KEY ("B") REFERENCES "PlanExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
