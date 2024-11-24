import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import listTypes from "../models/listTypes";
import {
  ListBackdropDummy,
  ListTitleDummy,
} from "../components/loaders/ListSlugLoader";
import { LoadingDiscover as ListLoader } from "../components/loaders/MovieLoaders";
import { Helmet } from "react-helmet";
import ImageLazy from "../components/ui/ImageLazy";
import ListTitleSection from "../components/sections/ListTitleSection";
import ListItemSection from "../components/sections/ListItemSection";
import EditModeSection from "../components/sections/EditModeSection";
import { MovieSection } from "../components/sections/MovieSection";
import { TvShowSection } from "../components/sections/tvShowSection";
import { useListItems } from "../hooks/useListItems";
import useListInfo from "../hooks/useListInfo";
import useOwnerInfo from "../hooks/useOwnerInfo";
import useSimilar from "../hooks/useSimilar";

const ListSlug = () => {
  const { user } = useAuth();
  const { list_id: id } = useParams();

  const { listInfo, mutate: setListInfo } = useListInfo({ id });
  const { ownerInfo } = useOwnerInfo({ id: listInfo?.owner });

  const isOwner = user && ownerInfo && user._id === ownerInfo._id;

  const {
    toggleEditMode,
    listItems,
    mutate: setListItems,
    isEditMode,
    deletedItems,
    setDeletedItems,
    handleSave,
  } = useListItems({ listInfo, ownerInfo, setListInfo });

  const randomItem = listItems
    ? listItems[Math.floor(Math.random() * listItems.length)]
    : {};
  const type = listTypes[listInfo?.type]?.replace(" ", "").toLowerCase();
  const genres = randomItem?.genres
    ?.map((genre) => genre.name.toLowerCase())
    .join("_");

  const { similar } = useSimilar({ type, genres, page: 1 });

  const hasListInfo = listInfo && listItems;
  const isMovieType = listInfo && listTypes[listInfo.type] === "Movies";
  const isTvShowType = listInfo && listTypes[listInfo.type] === "TV Shows";

  return (
    <div className="relative flex flex-col items-center p-4 gap-4 w-full h-full bg-primary rounded-md">
      <Helmet>
        <title>{listInfo?.name}</title>
      </Helmet>
      <div className="relative flex justify-center items-center w-full max-h-[400px] min-h-[400px] rounded-md">
        <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
        {hasListInfo ? (
          <ImageLazy
            imagePath={listItems[0]?.backdrop_path}
            name={listInfo?.name}
          />
        ) : (
          <ListBackdropDummy />
        )}
      </div>
      <motion.div
        initial={{ y: -120 }}
        className="relative flex flex-col gap-4 w-full p-4 rounded-md"
      >
        {hasListInfo ? (
          <ListTitleSection
            listInfo={listInfo}
            listItems={listItems}
            ownerInfo={ownerInfo}
            toggleEditMode={toggleEditMode}
            isOwner={isOwner}
          />
        ) : (
          <ListTitleDummy />
        )}
      </motion.div>
      <motion.div
        initial={{ marginTop: -120 }}
        className="relative flex flex-col items-center gap-4 w-full p-4 rounded-md overflow-hidden"
      >
        {hasListInfo ? (
          <div className="flex flex-col w-full gap-4">
            {isOwner && isEditMode && (
              <EditModeSection
                handleSave={handleSave}
                toggleEditMode={toggleEditMode}
              />
            )}
            <ListItemSection
              listItems={listItems}
              listInfo={listInfo}
              setListItems={setListItems}
              isEditMode={isEditMode}
              deletedItems={deletedItems}
              setDeletedItems={setDeletedItems}
            />
          </div>
        ) : (
          <ListLoader />
        )}
        {similar && hasListInfo && isMovieType && (
          <MovieSection title="Recommendations" movies={similar} />
        )}
        {similar && hasListInfo && isTvShowType && (
          <TvShowSection title="Recommendations" shows={similar} />
        )}
      </motion.div>
    </div>
  );
};

export default ListSlug;
