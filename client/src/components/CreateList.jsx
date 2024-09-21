import { useEffect, useRef, useState } from "react";
import { Dropdown, DropdownItem } from "./ui/Dropdown";
import Selector from "./ui/Selector";
import Button from "./ui/Button";
import { movieGenres, tvShowGenres } from "../models/genres";
import useAxios from "../hooks/useAxios";
import { useToast } from "../components/hooks/useToast";
import { useModal } from "./hooks/useModal";
import listTypes from "../models/listTypes";
import DefaultInput from "./ui/DefaultInput";
import { fetchDiscovery } from "../helpers/api";

const CreateList = () => {
  const { setOpen } = useModal();
  const titleRef = useRef(null);
  const [type, setType] = useState("Movies");
  const [name, setName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [description, setDescription] = useState("");
  const [fetched, setFetched] = useState(null);
  const { toastError, toastSuccess } = useToast();
  const { api } = useAxios();

  const handleCreateList = async (e) => {
    e.preventDefault();

    if (!name) return toastError("Your list is missing a name.");
    if (!selectedGenres.length > 0)
      return toastError("Select at least one genre.");

    const randomIndex = Math.floor(Math.random() * fetched.length);
    try {
      await api.post("/list", {
        list: {
          type: type,
          list: [
            {
              id: fetched[randomIndex].id,
              title: fetched[randomIndex].title,
              backdrop_path: fetched[randomIndex].backdrop_path,
              poster_path: fetched[randomIndex].poster_path,
            },
          ],
          name: name,
          description: description,
        },
      });
      toastSuccess("List successfully created.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create list.", error);
      toastError("Failed to create list.");
    }
  };

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  useEffect(() => {
    if (type) setSelectedGenres([]);
  }, [type]);

  useEffect(() => {
    if (selectedGenres.length > 0) {
      fetchDiscovery(
        api,
        type.replace(" ", "").toLowerCase(),
        selectedGenres.join("_").toLowerCase()
      )
        .then((response) => {
          setFetched(response.results);
        })
        .catch(() =>
          toastError(
            `Failed to fetch ${type} with ${selectedGenres.join(", ")} genres.`
          )
        );
    }
  }, [selectedGenres]);

  return (
    <form
      className="flex flex-col w-[400px] max-w-full p-4 gap-4 bg-primary rounded-md overflow-hidden"
      onSubmit={handleCreateList}
    >
      <h1 className="text-center text-xs font-semibold">Create a List</h1>
      <DefaultInput
        ref={titleRef}
        onChange={(e) => setName(e.target.value)}
        value={name}
        placeholder="Name"
      />
      <DefaultInput
        onChange={(e) => setDescription(e.currentTarget.value)}
        value={description}
        placeholder="Description (Optional)"
      />
      <div className="flex justify-between">
        <DefaultInput
          disabled={true}
          readOnly={true}
          placeholder="Type"
          value={type}
        />
        <Dropdown name="Select type">
          <DropdownItem onClick={() => setType("TV Shows")}>
            TV shows
          </DropdownItem>
          <DropdownItem onClick={() => setType("Movies")}>Movies</DropdownItem>
        </Dropdown>
      </div>
      <h1 className="text-xs text-primary-foreground">
        Select genres you like to start with
      </h1>
      <Selector
        items={type === listTypes[122602] ? movieGenres : tvShowGenres}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />
      <Button text="Create" type="submit" />
    </form>
  );
};

export default CreateList;
