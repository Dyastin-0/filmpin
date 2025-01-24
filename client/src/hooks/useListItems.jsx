import { useEffect, useCallback, useState } from "react";
import { io } from "socket.io-client";
import listTypes from "../models/listTypes";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/hooks/useToast";
import { fetchMovie, fetchShow } from "../helpers/api";
import useAxios from "../hooks/useAxios";
import useSWR from "swr";
import useConfirm from "../components/hooks/useConfirm";

export const useListItems = ({ listInfo, setListInfo, ownerInfo }) => {
  const { token, user } = useAuth();
  const { api, isAxiosReady } = useAxios();
  const { toastInfo } = useToast();
  const confirm = useConfirm();
  const [initialListItems, setInitialListItems] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: listItems, mutate } = useSWR(
    isAxiosReady && listInfo ? `/lists/${listInfo._id}/items` : null,
    async () => {
      const fetchItem =
        listTypes[listInfo.type] === "Movies" ? fetchMovie : fetchShow;
      const fetchedItems = await Promise.all(
        listInfo.list.map((item) => fetchItem(api, item.id))
      );
      return fetchedItems;
    },
    {
      onSuccess: (fetchedItems) => {
        setInitialListItems(fetchedItems);
      },
    }
  );

  useEffect(() => {
    if (token && user && listInfo && ownerInfo) {
      const randomId = crypto.randomUUID();
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        extraHeaders: { Authorization: `Bearer ${token}` },
        query: {
          owner: listInfo.owner,
          accessor: user._id,
          randomId,
          targetStream: "list",
        },
      });

      newSocket.on(
        `stream/list/${listInfo.owner}/${user._id}/${randomId}`,
        (change) => {
          console.log(change);
          if (change.type == "delete") {
            mutate(
              (prevList) => prevList.filter((item) => item._id !== change._id),
              false
            );
          }
          if (change.type == "update") {
            console.log("update");
            if (change.list) {
              mutate(change.list, false);
            }
            if (change.name) {
              setListInfo(
                (prevListInfo) => ({
                  ...prevListInfo,
                  name: change.name,
                }),
                false
              );
            }
            if (change.description) {
              setListInfo(
                (prevListInfo) => ({
                  ...prevListInfo,
                  description: change.description,
                }),
                false
              );
            }
          }
        }
      );

      return () => newSocket.disconnect();
    }
  }, [token, listInfo, user, ownerInfo, toastInfo]);

  const toggleEditMode = useCallback(() => {
    const hasChanges =
      JSON.stringify(listItems.map(({ originalIndex, ...rest }) => rest)) !==
      JSON.stringify(initialListItems);

    if (isEditMode) {
      if (hasChanges) {
        confirm({
          message:
            "You have unsaved changes. Are you sure you want to exit edit mode?",
          onConfirm: () => {
            mutate(initialListItems, false);
            setIsEditMode(false);
          },
        });
      } else {
        mutate(initialListItems, false);
        setIsEditMode(false);
      }
    } else {
      setInitialListItems(listItems);
      setDeletedItems([]);
      setIsEditMode(true);
    }
  }, [isEditMode, listItems, initialListItems, confirm]);

  const saveChanges = useCallback(async () => {
    try {
      await api.patch(`/lists?list_id=${listInfo._id}`, {
        new_list: listItems,
      });
      toastInfo("Changes saved successfully.");
      setInitialListItems(listItems);
      setIsEditMode(false);
    } catch (error) {
      toastInfo("Failed to save changes.");
    }
  }, [api, listInfo, listItems, initialListItems, toastInfo]);

  const handleSave = () => {
    const hasChanges =
      JSON.stringify(listItems.map(({ originalIndex, ...rest }) => rest)) !==
      JSON.stringify(initialListItems);

    if (!hasChanges) return toastInfo("No changes made.");

    confirm({
      message: "Save changes?",
      onConfirm: saveChanges,
    });
  };

  return {
    listItems,
    toggleEditMode,
    setIsEditMode,
    isEditMode,
    mutate,
    deletedItems,
    setDeletedItems,
    handleSave,
  };
};
