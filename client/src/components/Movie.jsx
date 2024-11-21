import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "./ui/CircularProgess";
import {
  ImageDummy,
  TitleDummy,
  YearDummy,
  GenresDummy,
} from "./loaders/MovieLoaders";
import useAxios from "../hooks/useAxios";
import { fetchMovie } from "../helpers/api";
import useSWR from "swr";

const Movie = ({ info }) => {
  const { api, isAxiosReady } = useAxios();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    data: details,
    isError,
    isLoading,
  } = useSWR(
    isAxiosReady ? `/movies/${info.id}` : null,
    () => fetchMovie(api, info.id),
    {
      dedupingInterval: 60000,
    }
  );

  useEffect(() => {
    if (details) {
      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/w500/${details?.poster_path}`;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
    }
  }, [details]);

  if (!details) return;

  return (
    <Link
      className="flex flex-col rounded-lg drop-shadow-none gap-1 p-4 w-[200px] h-[370px]
        text-primary-foreground border border-secondary-accent
        hover:cursor-pointer hover:border-primary-highlight duration-300"
      to={`/movies/${details.id}`}
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
            {details?.title}
          </h4>
          <h4 className="text-xs">{details?.release_date?.split("-")[0]}</h4>
          <h4 className="text-xs">
            {`${Math.floor(details?.runtime / 60)}h ${details?.runtime % 60}m`}
          </h4>
        </>
      )}
      {details && (
        <div className="absolute bottom-4 right-4">
          <CircularProgress value={details.vote_average?.toFixed(1)} />
        </div>
      )}
    </Link>
  );
};

export default Movie;
