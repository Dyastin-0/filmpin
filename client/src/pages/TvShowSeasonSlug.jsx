import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "../components/hooks/useModal";
import Frame from "../components/Frame";
import { LoadingMovieSection } from "../components/loaders/MovieLoaders";
import { MovieSlugLoader } from "../components/loaders/MovieSlugLoader";
import useAxios from "../hooks/useAxios";
import EpisodeSection from "../components/sections/EpisodeSection";
import { fetchTvShowSeason, fetchTvShowSeasonVideos } from "../helpers/api";
import { useEffect, useState } from "react";
import { ClipSection } from "../components/sections/ClipSection";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import TvShowSeasonSection from "../components/sections/TvShowSeasonSection";

const TvShowSeasonSlug = () => {
  const [searchParams] = useSearchParams();
  const { api, isAxiosReady } = useAxios();
  const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);

  const id = searchParams.get("id")?.split("_")[0];
  const seasonNumber = searchParams.get("season_number");
  const title = searchParams.get("title");
  const backdropPath = searchParams.get("backdrop_path");

  const { data: details, isLoading } = useSWR(
    isAxiosReady
      ? `/tvshows/season?tvshow_id=${id}&season_number=${seasonNumber}`
      : null,
    () => fetchTvShowSeason(api, id, seasonNumber)
  );

  const { data: videos } = useSWR(
    isAxiosReady
      ? `/tvshows/season/videos?tvshow_id=${id}&tvshow_season=${seasonNumber}`
      : null,
    () => fetchTvShowSeasonVideos(api, id, seasonNumber),
    {
      onSuccess: (data) => setTrailerYoutubeKey(data[0].key),
    }
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [details]);

  return (
    <div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
      <Helmet>
        <title>{details?.name}</title>
      </Helmet>
      {isLoading ? (
        <MovieSlugLoader />
      ) : (
        details && (
          <TvShowSeasonSection
            details={details}
            title={title}
            backdropPath={backdropPath}
            trailerYoutubeKey={trailerYoutubeKey}
          />
        )
      )}
      <motion.div
        initial={{ marginTop: -120 }}
        className="flex md:flex-row flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4"
      >
        {details?.episodes ? (
          <EpisodeSection
            episodes={details.episodes}
            seasonNumber={seasonNumber}
            showId={id}
            backdropPath={backdropPath}
            title={title}
          />
        ) : (
          <LoadingMovieSection title="Episodes" />
        )}
      </motion.div>
      {videos?.length > 0 && (
        <div className="flex flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4">
          <ClipSection
            keys={videos.map((video) => ({
              name: video.name,
              value: video.key,
            }))}
            title="Videos"
          />
        </div>
      )}
    </div>
  );
};

export default TvShowSeasonSlug;
