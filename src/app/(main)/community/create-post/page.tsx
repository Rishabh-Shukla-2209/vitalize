"use client";

import WorkoutSummary from "@/components/community/WorkoutSummary";
import ImageCropper from "@/components/ImageCropper";
import Selector from "@/components/Selector";
import { Button } from "@/components/ui/button";
import { uploadCroppedImage } from "@/lib/actions/uploadImage";
import { PrivacyType, WorkoutLogType } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { handleAppError, timeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Icons from "@/components/icons/appIcons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createPost } from "@/lib/actions/community";
import { getPastWorkouts } from "@/lib/actions/workout";
import { postSchema } from "@/validations/post";
import { mapZodErrors } from "@/validations/errorMapper";

const CreatePostPage = () => {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [body, setBody] = useState("");
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [workoutMap, setWorkoutMap] = useState<Map<string, WorkoutLogType>>();
  const [workoutLogId, setWorkoutLogId] = useState("");
  const [postPreview, setPostPreview] = useState(false);
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    body?: string;
    privacy?: string;
    imgUrl?: string;
    workoutLogid?: string;
  }>({});
  const queryClient = useQueryClient();
  const router = useRouter();

  const previewPost = () => {
    if (!title) {
      setTitleError("Required");
      return;
    }
    setPostPreview(true);
  };

  const upload = useCallback(async () => {
    if (!imgPreview) return;
    setError("");

    try {
      const blob = await fetch(imgPreview).then((r) => r.blob());
      const res = await uploadCroppedImage(blob, "profile_pics");
      return res;
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Upload failed. Please try again.");
    }
  }, [imgPreview]);

  const uploadPost = async () => {
    if (!user) return;

    setUploading(true);

    const uploadUrl = await upload();

    if (!error) {
      const postData: {
        title: string;
        privacy: PrivacyType;
        body?: string;
        imgUrl?: string;
        workoutLogid?: string;
      } = { title, privacy: privacy as PrivacyType };

      if (uploadUrl) postData.imgUrl = uploadUrl;
      if (workoutLogId) postData.workoutLogid = workoutLogId;
      if (body) postData.body = body;

      try {
        const parsed = postSchema.safeParse(postData);
        if (!parsed.success) {
          setFieldErrors(mapZodErrors(parsed.error));
          setUploading(false);
          setPostPreview(false);
          return;
        }
        await createPost(postData);
        queryClient.invalidateQueries({
          queryKey: ["activity", "posts"],
          exact: false,
        });
        router.push("/home");
      } catch (err) {
        handleAppError(err);
      }
    }
    setUploading(false);
  };

  const { data } = useQuery({
    queryKey: ["workoutHistory", user?.id],
    queryFn: async () => {
      const res = await getPastWorkouts();
      const logsMap = new Map(
        res?.data.map((workout) => [workout.id, workout])
      );
      setWorkoutMap(logsMap);
      return res?.data.map((workout) => ({
        label: `${workout.plan.name} - ${timeAgo(workout.createdAt)}`,
        val: workout.id,
      }));
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });

  useEffect(() => {
    if (title) setTitleError("");
  }, [title]);

  return (
    <div className="w-full flex flex-col items-center px-5">
      <h1 className="text-center my-5">Create Post</h1>
      {postPreview ? (
        <div className="flex flex-col gap-3 max-w-120 min-h-150 bg-zinc-100 dark:bg-sage-400 p-5 rounded-md mb-5">
          <div className="flex flex-col flex-1 gap-2 mt-5">
            <p className="font-semibold">{title}</p>
            <p>{body}</p>
            {workoutMap && workoutLogId && (
              <WorkoutSummary workout={workoutMap.get(workoutLogId)!} />
            )}
            {imgPreview && (
              <Image
                src={imgPreview}
                alt="Post Image"
                height={500}
                width={500}
                className="py-2 px-3 mt-3 rounded"
              />
            )}
          </div>
          <div className="flex justify-between gap-5">
            <Button
              variant="outline"
              onClick={() => setPostPreview(false)}
              disabled={uploading}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              variant="default"
              onClick={uploadPost}
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? <Spinner /> : "Post"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 min-w-80 md:min-w-150 mb-5">
          <p className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleError && <span className="error">{titleError}</span>}
            {fieldErrors.title && (
              <span className="error">{fieldErrors.title}</span>
            )}
          </p>
          <textarea
            placeholder="Content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border min-h-30 dark:bg-sage-400 dark:text-zinc-200 border-zinc-200 dark:border-sage-700 rounded p-2 text-zinc-600 outline-0 flex-5 bg-white resize-none"
          />
          {fieldErrors.body && (
            <span className="error">{fieldErrors.body}</span>
          )}
          <div className="border border-zinc-200 dark:border-sage-700 dark:bg-sage-400 text-zinc-600 rounded px-5 py-2  min-h-100">
            {!imgPreview && !workoutLogId ? (
              <>
                <p>Select one of these</p>
                <div className="flex gap-2 mt-2">
                  <ImageCropper
                    setPreview={setImgPreview}
                    updating={uploading}
                  />
                  {data && (
                    <Selector
                      choices={data}
                      setChoice={setWorkoutLogId}
                      placeholder="Select Workout"
                      selectedValue={
                        workoutMap && workoutMap.get(workoutLogId)
                          ? workoutMap.get(workoutLogId)!.plan.name
                          : ""
                      }
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                {imgPreview ? (
                  <div className="mt-4">
                    <Image
                      src={imgPreview}
                      alt="Cropped Preview"
                      height={500}
                      width={500}
                    />
                  </div>
                ) : (
                  <WorkoutSummary workout={workoutMap!.get(workoutLogId)!} />
                )}
                <div className="flex-center mt-3">
                  <Button
                    variant="outline"
                    className="dark:text-zinc-200"
                    onClick={() => {
                      setImgPreview(null);
                      setWorkoutLogId("");
                    }}
                  >
                    Choose something else
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center mt-2">
            <label
              htmlFor="privacy"
              className="flex-1 font-semibold flex gap-2 items-center"
            >
              Visibility
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icons.info size={20} className="cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-white">
                    The post visibility is different from your profile
                    visibility.
                  </p>
                </TooltipContent>
              </Tooltip>
            </label>
            <RadioGroup
              onValueChange={setPrivacy}
              defaultValue={privacy}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PUBLIC" id="public" />
                <Label htmlFor="public">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PRIVATE" id="private" />
                <Label htmlFor="private">Private</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Button
              variant="default"
              onClick={previewPost}
              className="w-full text-lg"
            >
              Preview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostPage;
