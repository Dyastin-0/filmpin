import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import Checkbox from "./ui/Checkbox";
import Button from "./ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import listTypes from "../models/listTypes";
import { useToast } from "./hooks/useToast";
import { useModal } from "./hooks/useModal";
import CreateList from "../components/CreateList";
import { fetchList } from "../helpers/api";
import useSWR from "swr";

const AddToList = ({ selected, type }) => {
  const { user } = useAuth();
  const { api, isAxiosReady } = useAxios();
  const { toastError, toastInfo } = useToast();
  const { setOpen, setModal } = useModal();
  const [selectedList, setSelectedList] = useState([]);

  const { data: lists } = useSWR(
    isAxiosReady && user ? `/lists/${user._id}` : null,
    () => Promise.all(user.lists.map((list) => fetchList(api, list)))
  );

  const handleAddMovie = async () => {
    if (!selectedList?.length > 0) return toastError("No list selected.");
    selectedList.map((list, _) =>
      api
        .post("/lists/item", {
          list_id: list,
          list_item: {
            id: selected.id,
            title: selected.title || selected.name,
            poster_path: selected.poster_path,
            backdrop_path: selected.backdrop_path,
          },
        })
        .then((response) => {
          toastInfo(
            `${selected.title || selected.name} added to ${
              response.data.list_name
            }.`
          );
          setOpen(false);
        })
        .catch((error) => {
          console.error("Failed to add movie to list.", error);
          toastError(
            error.response.data.message ||
              `Failed to add ${selected.title || selected.name}`
          );
        })
    );
  };

  return (
    <div className="flex flex-col w-[400px] max-w-full p-4 gap-4 bg-primary rounded-md overflow-hidden">
      <h1 className="text-center text-xs font-semibold">{`Add ${
        selected?.title || selected?.name
      } to your list`}</h1>
      <h1 className="text-xs text-primary-foreground">
        {lists?.length > 0
          ? `Your ${type} Lists`
          : `You don't have a ${type} list yet.`}
      </h1>
      {lists?.length > 0 &&
        lists
          .filter((list) => listTypes[list?.type] === type)
          .map((list, index) => (
            <Checkbox
              key={index}
              name={list.name}
              value={selectedList.includes(list._id)}
              onChecked={() =>
                setSelectedList((prev) =>
                  prev.includes(list._id)
                    ? prev.filter((item) => item !== list._id)
                    : [...prev, list._id]
                )
              }
            />
          ))}
      <Button
        onClick={() => {
          setModal(<CreateList />);
          setOpen(true);
        }}
        text="Create a list"
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
      <Button
        onClick={handleAddMovie}
        text={`Add ${selected?.title || selected?.name}`}
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
    </div>
  );
};

export default AddToList;
