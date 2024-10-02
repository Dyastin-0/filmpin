import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MovieSection } from "../components/sections/MovieSection";
import { LoadingMovieSection } from "../components/loaders/MovieLoaders";
import { MovieSlugLoader } from "../components/loaders/MovieSlugLoader";
import CastSection from "../components/sections/CastSection";
import CrewSection from "../components/sections/CrewSection";
import { ClipSection } from "../components/sections/ClipSection";
import useAxios from "../hooks/useAxios";
import {
  fetchCredits,
  fetchDiscovery,
  fetchMovie,
  fetchVideos,
} from "../helpers/api";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import MovieInfoSection from "../components/sections/MovieInfoSection";
import CreditsSection from "../components/sections/CreditsSection";
import ReviewSection from "../components/sections/ReviewSection";

const MovieSlug = () => {
  const [searchParams] = useSearchParams();
  const { api, isAxiosReady } = useAxios();
  const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);

  const id = searchParams.get("id").split("_")[0];

  const { data: details, isLoading: isDetailsLoading } = useSWR(
    isAxiosReady ? `/movies/details?movie_id=${id}` : null,
    () => fetchMovie(api, id),
    {
      dedupingInterval: 60000,
    }
  );

  const genres = details?.genres
    .map((genre) => genre.name.toLowerCase())
    .join("_");

  const { data: similarMovies, isLoading: isDiscoverLoading } = useSWR(
    isAxiosReady && details
      ? `/movies/discover?genres=${genres}&sort_by=vote_count&page=1`
      : null,
    () => fetchDiscovery(api, "movies", genres),
    {
      dedupingInterval: 60000,
    }
  );

  const { data: videos, isLoading: isVideosLoading } = useSWR(
    isAxiosReady ? `/movies/videos?movie_id=${id}` : null,
    () => fetchVideos(api, "movies", "movie_id", id),
    {
      dedupingInterval: 60000,
      onSuccess: (data) =>
        setTrailerYoutubeKey(
          data.find((video) => video.type === "Trailer").key
        ),
    }
  );

  const { data: credits, isLoading: isCreditsLoading } = useSWR(
    isAxiosReady ? `/movies/credits?movie_id=${id}` : null,
    () => fetchCredits(api, "movies", id),
    {
      dedupingInterval: 60000,
    }
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [details]);

  return (
    <div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
      <Helmet>
        <title>{details?.title}</title>
      </Helmet>
      {!details ? (
        <MovieSlugLoader />
      ) : (
        <MovieInfoSection
          trailerYoutubeKey={trailerYoutubeKey}
          details={details}
        />
      )}
      <motion.div
        initial={{ marginTop: -120 }}
        className="flex flex-col rounded-lg gap-4 w-full overflow-hidden"
      >
        <h1 className="text-primary-foreground text-sm font-semibold">
          Credits
        </h1>
        <CreditsSection credits={credits} />
        <CastSection title="Full cast" casts={credits?.cast} />
        <CrewSection title="Full crew" crews={credits?.crew} />
      </motion.div>
      <section className="flex flex-col rounded-lg gap-4 items-center w-[calc(100%-2rem)]">
        {similarMovies ? (
          <MovieSection
            title="Recommendations"
            movies={similarMovies.results.filter(
              (similarMovie) => similarMovie.title !== details.title
            )}
          />
        ) : (
          <LoadingMovieSection title="Recommendations" />
        )}
      </section>
      <div className="flex flex-col rounded-lg gap-4 items-center w-[calc(100%-2rem)]">
        <ClipSection
          title={"Videos"}
          keys={videos?.map((video) => ({
            name: video.name,
            value: video.key,
          }))}
        />
      </div>
      <ReviewSection details={details} />
    </div>
  );
};

export default MovieSlug;
