import { useState } from "react";
import Separator from "./ui/Separator";
import Input from "./ui/Input";
import Button from "./ui/Button";
import useAxios from "../hooks/useAxios";
import { useToast } from "./hooks/useToast";
import { useModal } from "./hooks/useModal";

const ListSettings = ({ list }) => {
  const { api } = useAxios();
  const { toastInfo } = useToast();
  const { setOpen } = useModal();
  const [name, setName] = useState(list.name);
  const [description, setDescription] = useState(list.description);

  const handleSave = async () => {
    try {
      await api.patch(`/lists/${list._id}`, {
        name,
        description,
      });
      toastInfo("List have been updated.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to update list.", error);
      toastInfo("Failed to update list.");
    }
  };

  return (
    <div className="flex flex-col w-[400px] p-4 gap-4 max-w-full bg-primary rounded-md text-xs">
      <h1 className="text-center text-primary-foreground font-semibold">
        {list.name}
      </h1>
      <Separator />
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button text="Save" onClick={handleSave} />
    </div>
  );
};

export default ListSettings;
