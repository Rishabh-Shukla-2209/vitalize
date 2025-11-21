import { getUser, updateUser } from "@/lib/queries";
import { useUser } from "@clerk/nextjs";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import ImageCropper from "../ImageCropper";
import { Button } from "../ui/button";
import { uploadCroppedImage } from "@/lib/actions/uploadImage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { PrivacyType } from "@/lib/types";
import { Spinner } from "../ui/spinner";

const UpdateAbout = ({
  setEdit,
}: {
  setEdit: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useUser();
  const [about, setAbout] = useState("");
  const [bio, setBio] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState("");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const queryClient = useQueryClient();
  

  const { data: userData } = useQuery({
    queryKey: ["user", { userId: user?.id }],
    queryFn: () => getUser(user?.id),
    staleTime: Infinity,
    enabled: !!user,
  });

  useEffect(() => {
    if (!userData) return;

    if (userData.about) setAbout(userData.about);
    if (userData.bio) setBio(userData.bio);
    if (userData.imgUrl) setPreview(userData.imgUrl);
  }, [userData]);

  const upload = useCallback(async () => {
    if (!preview) return;
    setError("");

    try {
      const blob = await fetch(preview).then((r) => r.blob());
      const res = await uploadCroppedImage(blob, "profile_pics");
      return res;
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Upload failed. Please try again.");
    }
  }, [preview]);

  const updateData = async () => {
    if (!userData || !user) return;

    setUpdating(true);

    let uploadUrl: string | undefined = "";
    if (preview && preview !== userData.imgUrl) {
      uploadUrl = await upload();
    }

    if (!error) {
      const updatedData: { imgUrl?: string; about?: string; bio?: string; privacy?: PrivacyType } = {};

      if (uploadUrl) updatedData.imgUrl = uploadUrl;
      if (bio !== (userData.bio ?? "")) updatedData.bio = bio;
      if (about !== (userData.about ?? "")) updatedData.about = about;
      if (privacy && privacy !== userData.privacy) updatedData.privacy = privacy as PrivacyType

      if (Object.keys(updatedData).length !== 0) {
        await updateUser(userData.id, updatedData);
        queryClient.invalidateQueries({
          queryKey: ["user", { userId: user.id }],
          exact: true,
        });
      }
    }
    setEdit(false);
    setUpdating(false);
  };

  return (
    <div className="border border-zinc-300 dark:border-sage-700 rounded-md bg-zinc-100 dark:bg-sage-400 p-5">
      {userData ? (
        <>
          <div className="flex flex-col items-center gap-3 mb-5">
            {preview && (
              <div className="mt-4">
                <Image
                  src={preview}
                  alt="Cropped Preview"
                  height={500}
                  width={500}
                  className="rounded-full w-50 h-50"
                />
              </div>
            )}
            <ImageCropper setPreview={setPreview} updating={updating} />
          </div>
          <div className="flex-1 mb-5 flex flex-col gap-2">
            <p className="flex items-center">
              <label htmlFor="about" className="flex-1">
                About
              </label>
              <textarea
                name="about"
                id="about"
                placeholder="Enter your about here..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="border border-zinc-200 dark:border-sage-700 rounded p-2 text-zinc-600 dark:text-zinc-200 outline-0 flex-5 bg-white dark:bg-sage-500 resize-none"
              ></textarea>
            </p>
            <p className="flex items-center">
              <label htmlFor="bio" className="flex-1">
                Bio
              </label>
              <textarea
                name="bio"
                id="bio"
                placeholder="Enter your bio here..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="border border-zinc-200 dark:border-sage-700 bg-white dark:bg-sage-500 rounded p-2 text-zinc-600 dark:text-zinc-200 outline-0 flex-5 resize-none h-25 "
              ></textarea>
            </p>
            <div className="flex items-center mt-2">
              <label htmlFor="privacy" className="flex-1">
                Visibility
              </label>
              <RadioGroup onValueChange={setPrivacy} defaultValue={userData.privacy} className="flex">
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
          </div>
          <Button
            variant="default"
            className="w-full text-lg"
            onClick={updateData}
            disabled={updating}
          >
            {updating ? <Spinner /> : "Done"}
          </Button>
          {error && <span className="error">{error}</span>}
          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={() => setEdit(false)}
            disabled={updating}
          >
            Cancel
          </Button>
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default UpdateAbout;
