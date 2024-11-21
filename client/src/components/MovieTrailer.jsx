import { useEffect, useState } from "react";
import { TrailerImageDummy, TrailerTitleDummy } from "./loaders/TrailerLoaders";
import useAxios from "../hooks/useAxios";
import Clip from "./Clip";
import { fetchVideos } from "../helpers/api";
import useSWR from "swr";

const MovieTrailer = ({ id, title }) => {
  const { api, isAxiosReady } = useAxios();
  const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data: videos } = useSWR(
    isAxiosReady ? `/movies/${id}/videos` : null,
    () => fetchVideos(api, "movies", id),
    {
      dedupingInterval: 60000,
    }
  );

  useEffect(() => {
    if (trailerYoutubeKey) {
      const img = new Image();
      img.src = `https://img.youtube.com/vi/${trailerYoutubeKey}/maxresdefault.jpg`;
      img.onload = () => {
        setImageLoaded(true);
      };
    }
  }, [trailerYoutubeKey]);

  useEffect(() => {
    videos &&
      setTrailerYoutubeKey(
        videos.find((video) => video.type === "Trailer")?.key
      );
  }, [videos]);

  return (
    <div>
      {imageLoaded ? (
        <Clip title={title} trailerKey={trailerYoutubeKey} />
      ) : (
        <div className="flex flex-col items-center gap-1 justify-center">
          <TrailerImageDummy />
          <TrailerTitleDummy />
        </div>
      )}
    </div>
  );
};

export default MovieTrailer;
