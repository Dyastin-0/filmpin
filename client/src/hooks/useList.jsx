import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "./useAuth";
import useAxios from "./useAxios";
import { io } from "socket.io-client";
import useSWR from "swr";
import { fetchUserList } from "../helpers/api";

const ListContext = createContext();

export const ListProvider = ({ children }) => {
  const { token, user } = useAuth();
  const { api, isAxiosReady } = useAxios();
  const toast = useToast();
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token && user && isAxiosReady) {
      const randomId = crypto.randomUUID();

      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
        query: {
          owner: user._id,
          accesor: user._id,
          randomId,
          targetStream: "list",
        },
      });

      const eventName = `stream/list/${user._id}/${user._id}/${randomId}`;
      newSocket.on(eventName, (change) => {
        const isOwner = user.username === user.username;

        if (change.type === "delete") {
          setList((prevList) =>
            prevList.filter((list) => list._id !== change.list)
          );

          if (!isOwner) {
            toast({
              title: `${user.username} deleted the list '${change.list.name}'.`,
              status: "info",
              duration: 5000,
              isClosable: true,
            });
          }
        } else if (change.type === "insert") {
          setList((prevList) => [...prevList, change.list]);

          if (!isOwner) {
            toast({
              title: `${user.username} added a new list '${change.list.name}'.`,
              status: "info",
              duration: 5000,
              isClosable: true,
            });
          }
        }
      });

      newSocket.on("error", (err) => {
        console.error("Socket error:", err);
      });

      return () => {
        newSocket.off(eventName);
        newSocket.disconnect();
      };
    }
  }, [token, user, isAxiosReady]);

  const { data } = useSWR(
    isAxiosReady && user && token ? `/lists?user_id=${user._id}` : null,
    () => fetchUserList(api, user._id),
    {
      onSuccess: (data) => {
        setList(data);
        setIsLoading(false);
      },
    }
  );

  return (
    <ListContext.Provider value={{ list, isLoading }}>
      {children}
    </ListContext.Provider>
  );
};

export const useList = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
};
