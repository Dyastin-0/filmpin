import { useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import {
  ImageDummy,
  TitleDummy,
  YearDummy,
  GenresDummy,
} from "./loaders/MovieLoaders";
import useAxios from "../hooks/useAxios";
import { fetchShow } from "../helpers/api";
import useSWR from "swr";

const TvShow = ({ info }) => {
  const { api, isAxiosReady } = useAxios();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    data: details,
    isLoading,
    isError,
  } = useSWR(
    isAxiosReady ? `/tvshows/details?show_id=${info.id}` : null,
    () => fetchShow(api, info.id),
    {
      dedupingInterval: 60000,
    }
  );

  const handleImageLoad = () => {
    const img = new Image();
    img.src = `https://image.tmdb.org/t/p/w500/${details?.poster_path}`;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
  };

  if (details && !imageLoaded) {
    handleImageLoad();
  }

  return (
    <Link
      className="flex flex-col rounded-lg drop-shadow-none gap-1 p-4 w-[200px] h-[370px]
        text-primary-foreground border border-secondary-accent
        hover:cursor-pointer hover:border-primary-highlight duration-300"
      to={`/tvshows?id=${details?.id}_${details?.name}`}
    >
      {imageLoaded ? (
        <img
          loading="lazy"
          className="rounded-md w-[200px] h-[250px] object-cover self-center"
          src={`https://image.tmdb.org/t/p/w200/${details?.poster_path}`}
          alt={`${info.title} poster`}
        />
      ) : !imageError ? (
        <ImageDummy />
      ) : (
        <div className="w-full h-[250px] bg-secondary rounded-md" />
      )}
      {isLoading ? (
        <>
          <TitleDummy />
          <YearDummy />
          <GenresDummy />
        </>
      ) : isError ? (
        <p>Error loading details</p>
      ) : (
        <>
          <h4 className="text-sm font-semibold line-clamp-2 text-ellipsis">
            {details?.name}
          </h4>
          <h4 className="text-xs">
            {`${details?.first_air_date?.split("-")[0]}-${
              details?.last_air_date?.split("-")[0]
            }`}
          </h4>
          <h4 className="text-xs">{`${details?.number_of_seasons} seasons`}</h4>
        </>
      )}
      {details && (
        <div className="absolute bottom-4 right-4">
          <CircularProgress
            size="40px"
            color="var(--highlight)"
            trackColor="var(--bg-primary)"
            value={details.vote_average}
            max={10}
          >
            <CircularProgressLabel>
              {details.vote_average?.toFixed(1)}
            </CircularProgressLabel>
          </CircularProgress>
        </div>
      )}
    </Link>
  );
};

export default TvShow;
