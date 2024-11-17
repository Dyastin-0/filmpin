import Button from "../ui/Button";
import Separator from "../ui/Separator";
import { useModal } from "../hooks/useModal";
import ChangeUsername from "../ChangeUsername";

const UsernameSection = () => {
  const { setModal, setOpen } = useModal();

  return (
    <div
      className="relative flex flex-col w-full h-fit
			rounded-md text-xs text-primary-foreground gap-2"
    >
      <p className="font-semibold">Change username</p>
      <Separator />
      <p>
        Your username is your unique identifier on the platform. You can change
        it here.
      </p>
      <Button
        text="Change username"
        className="w-fit"
        onClick={() => {
          setModal(<ChangeUsername />);
          setOpen(true);
        }}
      />
    </div>
  );
};

export default UsernameSection;
