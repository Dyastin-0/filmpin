import Button from "../ui/Button";
import useConfirm from "../hooks/useConfirm";
import { useToast } from "../hooks/useToast";
import Separator from "../ui/Separator";

const PasswordSection = () => {
  const confirm = useConfirm();
  const { toastInfo } = useToast();

  return (
    <div
      className="relative flex flex-col w-full h-fit
      rounded-md text-primary-foreground gap-2"
    >
      <div className="flex justify-between items-end gap-2">
        <h2 className="text-xs font-semibold">Password</h2>
      </div>
      <Separator />
      <p className="text-xs text-primary-foreground">
        strengthen your account, make sure you are using a strong password.
      </p>
      <Button
        text="Change password"
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
  );
};

export default PasswordSection;
