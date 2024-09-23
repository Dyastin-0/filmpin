import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MovieSlugLoader } from "../components/loaders/MovieSlugLoader";
import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import CrewSection from "../components/sections/CrewSection";
import CastSection from "../components/sections/CastSection";
import { ClipSection } from "../components/sections/ClipSection";
import {
  fetchTvShowEpisodeDetails,
  fetchTvShowEpisodeVideos,
} from "../helpers/api";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import TvShowEpisodeInfoSection from "../components/sections/TvShowEpisodeInfoSection";
import CreditsSection from "../components/sections/CreditsSection";

const TvShowEpisodeSlug = () => {
  const [searchParams] = useSearchParams();
  const { api, isAxiosReady } = useAxios();
  const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);

  const id = searchParams.get("id")?.split("_")[0] || "";
  const seasonNumber = searchParams.get("season_number") || "";
  const episodeNumber = searchParams.get("episode_number") || "";
  const title = searchParams.get("title") || "";
  const backdrop_path = searchParams.get("backdrop_path") || "";

  const {
    data: details,
    isLoading,
    isError,
  } = useSWR(
    isAxiosReady
      ? `/tvshows/season/episode?tvshow_id=${id}&season_number=${seasonNumber}&episode_number=${episodeNumber}`
      : null,
    () => fetchTvShowEpisodeDetails(api, id, seasonNumber, episodeNumber)
  );

  const { data: videos } = useSWR(
    isAxiosReady
      ? `/tvshows/season/episode/videos?tvshow_id=${id}&tvshow_season=${seasonNumber}&episode_number=${episodeNumber}`
      : null,
    () => fetchTvShowEpisodeVideos(api, id, seasonNumber, episodeNumber),
    {
      onSuccess: (data) => setTrailerYoutubeKey(data[0].key),
    }
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [details]);

  const casts =
    details?.guest_stars?.sort((a, b) => b.popularity - a.popularity) || [];

  return (
    <div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
      <Helmet>
        <title>{details?.name}</title>
      </Helmet>
      {isLoading ? (
        <MovieSlugLoader />
      ) : details ? (
        <>
          <div className="relative w-full h-[400px] rounded-md overflow-hidden">
            <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
            <img
              loading="lazy"
              className="w-full h-full object-cover"
              src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
              alt={`${details?.name} backdrop`}
            />
          </div>
          <TvShowEpisodeInfoSection
            details={details}
            title={title}
            seasonNumber={seasonNumber}
            trailerYoutubeKey={trailerYoutubeKey}
          />
          <motion.div
            initial={{ marginTop: -120 }}
            className="flex flex-col p-4 rounded-md max-w-full w-full gap-4"
          >
            <CreditsSection credits={{ crew: details.crew, cast: casts }} />
            <CastSection title="Full cast" casts={casts} />
            <CrewSection title="Full crew" crews={details?.crew} />
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
        </>
      ) : (
        <MovieSlugLoader />
      )}
    </div>
  );
};

export default TvShowEpisodeSlug;
