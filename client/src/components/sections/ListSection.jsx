import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "../hooks/useModal";
import CreateList from "../CreateList";
import UserList from "../UserList";
import { io } from "socket.io-client";
import { useToast } from "../hooks/useToast";
import { fetchUserList } from "../../helpers/api";
import useSWR from "swr";

const ListSection = ({ userData }) => {
  const { token, user } = useAuth();
  const { api } = useAxios();
  const { toastInfo } = useToast();
  const [list, setList] = useState([]);
  const { setModal, setOpen } = useModal();

  useEffect(() => {
    if (token && user && userData) {
      const randomId = crypto.randomUUID();

      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
        query: {
          owner: userData._id,
          accesor: user._id,
          randomId: randomId,
          targetStream: "list",
        },
      });

      newSocket.on(
        `stream/list/${userData._id}/${user._id}/${randomId}`,
        (change) => {
          if (change.type === "delete")
            setList((prevList) =>
              prevList.filter((list) => list._id !== change.list)
            );
          if (change.type === "insert") {
            setList((prevList) => [...prevList, change.list]);
            const isOwner = userData.username === user.username;
            !isOwner &&
              toastInfo(
                `${userData.username} added a new list '${change.list.name}'.`
              );
          }
        }
      );
      return () => newSocket.disconnect();
    }
  }, [token, userData, user]);

  const { isLoading } = useSWR(
    userData ? `/lists?owner=${userData._id}` : null,
    () => fetchUserList(api, userData._id),
    {
      onSuccess: (data) => setList(data),
    }
  );

  const isOwner = userData?.username === user?.username;

  if (!token) {
    <motion.section
      initial={{ marginTop: -70 }}
      className="flex justify-center items-center gap-4 w-full bg-accent rounded-md"
    >
      <h1 className="text-xs text-primary-foreground font-semibold">{`Sign in to view ${userData?.username}'s lists.`}</h1>
    </motion.section>;
  }

  return (
    <motion.section
      initial={{ marginTop: -70 }}
      className="relative flex flex-col gap-4 w-full"
    >
      <div className="flex w-fit justify-center items-center gap-2">
        <h1 className="h-fit text-primary-foreground text-sm font-semibold">
          Lists
        </h1>
        {token && user?.username === userData?.username && (
          <Button
            className="w-fit"
            onClick={() => {
              setModal(<CreateList />);
              setOpen(true);
            }}
            icon={<FontAwesomeIcon icon={faPlus} />}
            text="Create"
          />
        )}
      </div>
      <div className="flex flex-wrap w-full gap-4">
        {!isLoading && list?.length > 0 ? (
          list.map((item) => <UserList key={item._id} list={item} />)
        ) : (
          <p className="text-xs text-secondary-foreground">No lists yet.</p>
        )}
      </div>
    </motion.section>
  );
};

export default ListSection;
