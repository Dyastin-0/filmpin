import Button from "./ui/Button";
import Separator from "./ui/Separator";
import useConfirm from "../components/hooks/useConfirm";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "./hooks/useToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "./hooks/useModal";

const Settings = () => {
  const { setOpen } = useModal();
  const { user } = useAuth();
  const { toastInfo } = useToast();
  const confirm = useConfirm();

  return (
    <div
      className="relative flex flex-col w-[500px] max-w-full h-fit max-h-full
			rounded-md bg-primary text-primary-foreground p-4 gap-4"
    >
      <h1 className="text-xs text-center font-bold">Settings</h1>
      <Button
        onClick={() => setOpen(false)}
        variant="default_rounded"
        icon={<FontAwesomeIcon icon={faX} />}
        className="absolute top-4 right-4"
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold">Passowrd</h2>
        <Button
          text="Reset Password"
          className="w-fit"
          onClick={() =>
            confirm({
              message: "Send a reset password link to your email?",
              onConfirm: async () => {
                await axios.post("/reset/password/sendReset", {
                  email: user.email,
                });
                toastInfo("Password reset link sent.");
              },
            })
          }
        />
      </div>
      <Separator />
    </div>
  );
};

export default Settings;
