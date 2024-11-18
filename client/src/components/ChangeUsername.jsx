import { useEffect, useRef, useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import useAxios from "../hooks/useAxios";
import useConfirm from "./hooks/useConfirm";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "./hooks/useToast";
import Separator from "./ui/Separator";

const ChangeUsername = () => {
  const { setUser } = useAuth();
  const { api } = useAxios();
  const confirm = useConfirm();
  const { toastInfo } = useToast();
  const [username, setUsername] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    confirm({
      message: "Are you sure you want to change your username?",
      onConfirm: () => {
        api
          .patch("/account/username", { username })
          .then((res) => {
            toastInfo("Username changed successfully.");
            setUser((prev) => ({ ...prev, username }));
          })
          .catch((error) => console.error(error));
      },
    });
  };
  return (
    <div className="flex flex-col items-center w-fit h-fit max-w-full p-4 gap-4 bg-primary rounded-md overflow-hidden">
      <h1 className="text-center text-xs font-semibold">Change Username</h1>
      <Separator />
      <form
        className="flex flex-col gap-4 text-xs text-primary-foreground"
        onSubmit={handleSubmit}
      >
        <Input
          ref={inputRef}
          placeholder="New username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit" text="Change username" />
      </form>
    </div>
  );
};

export default ChangeUsername;
