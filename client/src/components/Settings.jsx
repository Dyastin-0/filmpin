import Button from "./ui/Button";
import Separator from "./ui/Separator";
import useConfirm from "../components/hooks/useConfirm";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "./hooks/useToast";

const Settings = () => {
  const { user } = useAuth();
  const { toastInfo } = useToast();
  const confirm = useConfirm();

  return (
    <div
      className="flex flex-col w-[500px] max-w-full h-fit max-h-full
			rounded-md bg-primary text-primary-foreground p-4 gap-4"
    >
      <h1 className="text-xs text-center font-bold">Settings</h1>
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
