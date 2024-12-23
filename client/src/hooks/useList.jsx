import { useToast } from "@chakra-ui/react";
import { useAuth } from "./useAuth";
import useAxios from "./useAxios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchUserList } from "../helpers/api";

export const useList = ({ userData }) => {
  const { token, user } = useAuth();

  const { api } = useAxios();
  const { toastInfo } = useToast();
  const [list, setList] = useState([]);

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
          randomId,
          targetStream: "list",
        },
      });

      const eventName = `stream/list/${userData._id}/${user._id}/${randomId}`;
      newSocket.on(eventName, (change) => {
        const isOwner = userData.username === user.username;

        if (change.type === "delete") {
          setList((prevList) =>
            prevList.filter((list) => list._id !== change.list)
          );

          if (!isOwner) {
            toastInfo(
              `${userData.username} deleted the list '${change.list.name}'.`
            );
          }
        } else if (change.type === "insert") {
          setList((prevList) => [...prevList, change.list]);

          if (!isOwner) {
            toastInfo(
              `${userData.username} added a new list '${change.list.name}'.`
            );
          }
        } else if (change.type === "update") {
          setList((prevList) =>
            prevList.map((list) =>
              list._id === change._id ? { ...list, list: change.list } : list
            )
          );

          if (!isOwner) {
            toastInfo(
              `${userData.username} updated the list '${change.list.name}'.`
            );
          }
        }
      });

      fetchUserList(api, userData._id).then((response) => {
        setList(response);
      });

      newSocket.on("error", (err) => {
        console.error("Socket error:", err);
      });

      return () => {
        newSocket.off(eventName);
        newSocket.disconnect();
      };
    }
  }, [token, userData, user]);

  return { list, setList };
};
