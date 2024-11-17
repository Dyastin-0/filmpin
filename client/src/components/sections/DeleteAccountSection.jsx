import useConfirm from "../hooks/useConfirm";
import Button from "../ui/Button";
import Separator from "../ui/Separator";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";

const DeleteAccountSection = () => {
  const { setUser, setToken } = useAuth();
  const { api } = useAxios();
  const confirm = useConfirm();
  const { toastInfo } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    confirm({
      message: "Are you sure you want to delete your account?",
      onConfirm: async () => {
        api
          .delete("/account")
          .then(() => {
            toastInfo("Account deleted successfully.");
            navigate("/");
            setUser(null);
            setToken(null);
          })
          .catch((error) => {
            toastInfo("Failed to delete account.");
            console.error(error);
          });
      },
    });
  };

  return (
    <div className=" flex flex-col gap-2">
      <h2 className="text-xs font-semibold">Delete account</h2>
      <Separator />
      <p className="text-xs text-primary-foreground">
        Once you delete your account, there is no going back. Please be certain.
        All your data will be permanently deleted; your personal data, lists,
        and reviews.
      </p>
      <Button
        variant="danger"
        text="Delete your account"
        className="w-fit"
        onClick={handleDeleteAccount}
      />
    </div>
  );
};

export default DeleteAccountSection;
