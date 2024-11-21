import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
  const params = useParams();
  const location = useLocation();
  const { api, isAxiosReady } = useAxios();
  const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);

  const { title, backdropPath } = location.state;
  const { season_number, show_id: id } = params;

  const { data: details, isLoading } = useSWR(
    isAxiosReady
      ? `/tvshows/season?tvshow_id=${id}&season_number=${season_number}`
      : null,
    () => fetchTvShowSeason(api, id, season_number),
    {
      dedupingInterval: 60000,
    }
  );

  const { data: videos } = useSWR(
    isAxiosReady
      ? `/tvshows/season/videos?tvshow_id=${id}&tvshow_season=${season_number}`
      : null,
    () => fetchTvShowSeasonVideos(api, id, season_number),
    {
      dedupingInterval: 60000,
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
        className="flex md:flex-row flex-col p-4 rounded-md max-w-full w-full gap-4"
      >
        {details?.episodes ? (
          <EpisodeSection
            episodes={details.episodes}
            season_number={season_number}
            showId={id}
            backdropPath={backdropPath}
            title={title}
          />
        ) : (
          <LoadingMovieSection title="Episodes" />
        )}
      </motion.div>
      {videos?.length > 0 && (
        <div className="flex flex-col p-4 rounded-md max-w-full w-full gap-4">
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
