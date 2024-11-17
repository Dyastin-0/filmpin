import { useState } from "react";
import { useModal } from "../hooks/useModal";
import SelectProfile from "../SelectProfile";
import Button from "../ui/Button";
import Separator from "../ui/Separator";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useToast } from "../hooks/useToast";
import useConfirm from "../hooks/useConfirm";

const ProfilePhotoSection = () => {
  const { api } = useAxios();
  const { user, setUser } = useAuth();
  const { setModal, setOpen } = useModal();
  const { toastInfo } = useToast();
  const confirm = useConfirm();
  const [deleteting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user.profileImageURL)
      return toastInfo("You don't have a profile photo.");

    confirm({
      message: "Are you sure you want to delete your profile photo?",
      onConfirm: () => {
        setDeleting(true);
        api
          .delete("/account/profile-photo")
          .then(() => {
            toastInfo("Profile photo deleted.");
            setUser((prev) => ({
              ...prev,
              profileImageURL: null,
            }));
          })
          .catch((error) => console.error(error))
          .finally(() => setDeleting(false));
      },
    });
  };
  return (
    <div
      className="relative flex flex-col w-full h-fit
			rounded-md text-xs text-primary-foreground gap-2"
    >
      <p className="font-semibold">Change photo</p>
      <Separator />
      <p>
        Your profile photo is the first thing people see when they visit your
        profile. Make it count.
      </p>
      <div className="flex gap-2">
        <Button
          text="Change photo"
          className="w-fit"
          onClick={() => {
            setModal(<SelectProfile />);
            setOpen(true);
          }}
        />
        <Button
          text={deleteting ? "Deleting..." : "Delete photo"}
          variant="danger"
          className="w-fit"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
};

export default ProfilePhotoSection;
