import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { io } from "socket.io-client";
import listTypes from "../models/listTypes";
import { useToast } from "../components/hooks/useToast";
import {
  ListBackdropDummy,
  ListTitleDummy,
} from "../components/loaders/ListSlugLoader";
import { LoadingDiscover as ListLoader } from "../components/loaders/MovieLoaders";
import useAxios from "../hooks/useAxios";
import { fetchList, fetchOwner, fetchMovie, fetchShow } from "../helpers/api";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import ImageLazy from "../components/ui/ImageLazy";
import ListTitleSection from "../components/sections/ListTitleSection";
import ListItemSection from "../components/sections/ListItemSection";
import axios from "axios";
import EditModeSection from "../components/sections/EditModeSection";

const ListSlug = () => {
  const { token, user } = useAuth();
  const { api, isAxiosReady } = useAxios();
  const params = useParams();
  const { toastInfo } = useToast();

  const id = params.list_id.split("=").pop();

  const [listItems, setListItems] = useState([]);
  const [initialListItems, setInitialListItems] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    data: listData,
    isLoading,
    isError,
  } = useSWR(isAxiosReady ? `/lists/${id}` : null, () => fetchList(api, id), {
    onSuccess: (data) => {
      if (data && data.list) {
        const fetchItem =
          listTypes[data.type] === "Movies" ? fetchMovie : fetchShow;
        Promise.all(data.list.map((item) => fetchItem(api, item.id))).then(
          (fetchedItems) => {
            setListItems(fetchedItems);
            setInitialListItems(fetchedItems);
          }
        );
      }
    },
  });

  const { data: ownerData } = useSWR(
    listData ? `/public/account?id=${listData.owner}` : null,
    () => fetchOwner(axios, listData.owner)
  );

  const isOwner = user && ownerData && user._id === ownerData._id;

  useEffect(() => {
    if (token && user && listData && ownerData) {
      const randomId = crypto.randomUUID();
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        extraHeaders: { Authorization: `Bearer ${token}` },
        query: {
          owner: listData.owner,
          accessor: user._id,
          randomId,
          targetStream: "list",
        },
      });

      newSocket.on(
        `stream/list/${listData.owner}/${user._id}/${randomId}`,
        (change) => {
          if (change.type === "delete") {
            setListItems((prevList) =>
              prevList.filter((item) => item._id !== change.list)
            );
          }
          if (change.type === "update") {
            const hasChanges =
              JSON.stringify(listItems) !== JSON.stringify(change.list);
            if (hasChanges) {
              setListItems(change.list);
              toastInfo(
                isOwner
                  ? `Your list has been updated.`
                  : `${ownerData.username} updated this list.`
              );
            }
          }
        }
      );

      return () => newSocket.disconnect();
    }
  }, [token, listData, user, ownerData, toastInfo]);

  const handleSave = useCallback(async () => {
    const hasChanges =
      JSON.stringify(listItems) !== JSON.stringify(initialListItems);

    if (!hasChanges) return toastInfo("No changes detected.");

    try {
      await api.patch(`/lists?list_id=${listData._id}`, {
        new_list: listItems,
      });
      toastInfo("Changes saved successfully.");
      setInitialListItems(listItems);
      setIsEditMode(false);
    } catch (error) {
      toastInfo("Failed to save changes.");
    }
  }, [api, listData, listItems, initialListItems, toastInfo]);

  const toggleEditMode = useCallback(() => {
    if (isEditMode) {
      setListItems(initialListItems);
    } else {
      setInitialListItems(listItems);
      setDeletedItems([]);
    }
    setIsEditMode(!isEditMode);
  }, [isEditMode, listItems, initialListItems]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative flex flex-col items-center p-4 gap-4 w-full h-full bg-primary rounded-md">
      <Helmet>
        <title>{listData?.name}</title>
      </Helmet>
      <div className="relative flex justify-center items-center w-full max-h-[400px] min-h-[400px] rounded-md">
        <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
        {isLoading ? (
          <ListBackdropDummy />
        ) : (
          <ImageLazy
            imagePath={listItems[0]?.backdrop_path}
            name={listData?.name}
          />
        )}
      </div>
      <motion.div
        initial={{ y: -120 }}
        className="relative flex flex-col gap-4 w-full p-4 rounded-md"
      >
        {!listData ? (
          <ListTitleDummy />
        ) : (
          <ListTitleSection
            listData={listData}
            listItems={listItems}
            ownerData={ownerData}
            toggleEditMode={toggleEditMode}
            isOwner={isOwner}
          />
        )}
      </motion.div>
      <motion.div
        initial={{ marginTop: -120 }}
        className="relative flex flex-col items-center gap-4 w-full p-4 rounded-md overflow-hidden"
      >
        {isLoading ? (
          <ListLoader />
        ) : isError ? (
          <p className="text-xs text-primary-foreground text-center font-bold">
            Failed to load {listTypes[listData.type]}, Something went wrong.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {isOwner && (
              <EditModeSection
                isEditMode={isEditMode}
                handleSave={handleSave}
                toggleEditMode={toggleEditMode}
              />
            )}
            <ListItemSection
              listItems={listItems}
              listData={listData}
              setListItems={setListItems}
              isEditMode={isEditMode}
              deletedItems={deletedItems}
              setDeletedItems={setDeletedItems}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ListSlug;
