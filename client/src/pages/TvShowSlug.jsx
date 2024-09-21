import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { TvShowSection } from "../components/sections/tvShowSection";
import { LoadingMovieSection } from "../components/loaders/MovieLoaders";
import { MovieSlugLoader } from "../components/loaders/MovieSlugLoader";
import useAxios from "../hooks/useAxios";
import SeasonSection from "../components/sections/SeasonSection";
import { fetchDiscovery, fetchShow, fetchTvShowVideos } from "../helpers/api";
import { ClipSection } from "../components/sections/ClipSection";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import TvShowInfoSection from "../components/sections/TvShowInfoSection";
import { useLoading } from "../components/hooks/useLoading";

const TvShowSlug = () => {
  const { setLoading } = useLoading();
  const [searchParams] = useSearchParams();
  const { api, isAxiosReady } = useAxios();
  const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);

  const id = searchParams.get("id");

  const { data: details, isLoading: isShowLoading } = useSWR(
    isAxiosReady ? `/tvshows?show_id=${id}` : null,
    () => fetchShow(api, id)
  );

  const { data: similarShows, isLoading: isSimilarShowsLoading } = useSWR(
    isAxiosReady && details ? `/discover/tvshows?` : null,
    () =>
      fetchDiscovery(
        api,
        "tvshows",
        details.genres
          .map((genre) => genre?.name)
          .join("_")
          .toLowerCase(),
        "vote_count",
        1
      ),
    {
      onSuccess: () => setLoading(false),
    }
  );

  const { data: videos } = useSWR(
    isAxiosReady && details ? `/tvshows/videos?show_id=${id}` : null,
    () => fetchTvShowVideos(api, id),
    {
      onSuccess: (videos) =>
        setTrailerYoutubeKey(
          videos.find((video) => video.type === "Trailer").key
        ),
    }
  );

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [details]);

  return (
    <div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
      <Helmet>
        <title>{details?.name}</title>
      </Helmet>
      {!details ? (
        <MovieSlugLoader />
      ) : (
        <TvShowInfoSection
          details={details}
          trailerYoutubeKey={trailerYoutubeKey}
        />
      )}
      <motion.section
        className="flex flex-col rounded-lg gap-4 p-4 items-center w-[calc(100%-2rem)]"
        initial={{ marginTop: -120 }}
      >
        {isShowLoading ? (
          <LoadingMovieSection title="Seasons" />
        ) : (
          <SeasonSection
            seasons={details?.seasons}
            title={details?.name}
            showId={details?.id}
            backdropPath={details?.backdrop_path}
          />
        )}
      </motion.section>
      <motion.div className="flex flex-col rounded-lg gap-4 p-4 items-center w-[calc(100%-2rem)]">
        {isSimilarShowsLoading ? (
          <LoadingMovieSection title="Recommendations" />
        ) : (
          <TvShowSection
            title="Recommendations"
            shows={similarShows?.results.filter(
              (similarShow) => similarShow?.name !== details?.name
            )}
          />
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

export default TvShowSlug;
