import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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

const ListSlug = () => {
  const { token, user } = useAuth();
  const { api, isAxiosReady } = useAxios();
  const [searchParams] = useSearchParams();
  const { toastInfo } = useToast();

  const id = searchParams.get("list_id");

  const [listItems, setListItems] = useState([]);

  const {
    data: listData,
    isLoading,
    isError,
  } = useSWR(isAxiosReady ? `/list/${id}` : null, () => fetchList(api, id), {
    onSuccess: (data) => {
      if (data && data.list) {
        const fetchItem =
          listTypes[data.type] === "Movies" ? fetchMovie : fetchShow;
        Promise.all(data.list.map((item) => fetchItem(api, item.id))).then(
          (fetchedItems) => setListItems(fetchedItems)
        );
      }
    },
  });

  const { data: ownerData } = useSWR(
    isAxiosReady && listData ? `/public/account?id=${listData.owner}` : null,
    () => fetchOwner(api, listData.owner)
  );

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
          } else {
            setListItems((prevList) => {
              const newList = change.list.find(
                (objectList) =>
                  !prevList.some(
                    (prevObjectList) => objectList._id === prevObjectList._id
                  )
              );
              if (ownerData._id !== user._id) {
                toastInfo(
                  `${ownerData?.username} just added ${newList.title} to this list.`
                );
              }
              return change.list;
            });
          }
        }
      );

      return () => newSocket.disconnect();
    }
  }, [token, listData, user, ownerData]);

  return (
    <div className="relative flex flex-col items-center p-4 gap-4 w-full h-full bg-primary rounded-md">
      <Helmet>
        <title>{listData?.name}</title>
      </Helmet>
      <div className="relative flex justify-center items-center w-full max-h-[400px] rounded-md">
        <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
        {isLoading ? (
          <ListBackdropDummy />
        ) : (
          <ImageLazy
            imagePath={
              listData?.list[Math.floor(Math.random() * listData?.list.length)]
                ?.backdrop_path
            }
            name={listData?.name}
          />
        )}
      </div>
      <motion.div
        initial={{ y: -120 }}
        className="relative flex flex-col gap-4 w-[calc(100%-2rem)] p-4 rounded-md"
      >
        {isLoading ? (
          <ListTitleDummy />
        ) : isError ? (
          <p className="text-xs text-error text-center font-bold">
            Something went wrong.
          </p>
        ) : (
          <ListTitleSection listData={listData} ownerData={ownerData} />
        )}
      </motion.div>
      <motion.div
        initial={{ marginTop: -120 }}
        className="relative flex flex-col items-center gap-4 w-[calc(100%-2rem)] p-4 rounded-md overflow-hidden"
      >
        {isLoading ? (
          <ListLoader />
        ) : (
          <ListItemSection listItems={listItems} listData={listData} />
        )}
      </motion.div>
    </div>
  );
};

export default ListSlug;
