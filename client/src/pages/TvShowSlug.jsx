import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { TvShowSection } from "../components/sections/tvShowSection";
import { LoadingMovieSection } from "../components/loaders/MovieLoaders";
import { MovieSlugLoader } from "../components/loaders/MovieSlugLoader";
import useAxios from "../hooks/useAxios";
import SeasonSection from "../components/sections/SeasonSection";
import { fetchShow, fetchTvShowVideos } from "../helpers/api";
import { ClipSection } from "../components/sections/ClipSection";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import TvShowInfoSection from "../components/sections/TvShowInfoSection";
import ReviewSection from "../components/sections/ReviewSection";
import useSimilar from "../hooks/useSimilar";

const TvShowSlug = () => {
  const params = useParams();
  const { api, isAxiosReady } = useAxios();
  const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);

  const id = params["id"];

  const { data: details, isLoading: isShowLoading } = useSWR(
    isAxiosReady ? `/tvshows/${id}` : null,
    () => fetchShow(api, id),
    {
      dedupingInterval: 60000,
    }
  );

  const genres = details?.genres
    ?.slice(0, 3)
    .map((genre) => genre.name.toLowerCase())
    .join("_");

  const { similar: similarShows, loading: isSimilarShowsLoading } = useSimilar({
    type: "tvshows",
    genres: genres,
    page: 1,
    isResultOnly: false,
  });

  const { data: videos } = useSWR(
    isAxiosReady && details ? `/tvshows/${id}/videos` : null,
    () => fetchTvShowVideos(api, id),
    {
      dedupingInterval: 60000,
      onSuccess: (videos) =>
        setTrailerYoutubeKey(
          videos.find((video) => video.type === "Trailer").key
        ),
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
      {!details ? (
        <MovieSlugLoader />
      ) : (
        <TvShowInfoSection
          details={details}
          trailerYoutubeKey={trailerYoutubeKey}
        />
      )}
      <motion.div
        className="flex flex-col rounded-lg gap-4 p-4 items-center w-full"
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
        {videos?.length > 0 && (
          <ClipSection
            keys={videos.map((video) => ({
              name: video.name,
              value: video.key,
            }))}
            title="Videos"
          />
        )}
        <ReviewSection details={details} />
      </motion.div>
    </div>
  );
};

export default TvShowSlug;
