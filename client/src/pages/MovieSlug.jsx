import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MovieSection } from "../components/sections/MovieSection";
import { LoadingMovieSection } from "../components/loaders/MovieLoaders";
import { MovieSlugLoader } from "../components/loaders/MovieSlugLoader";
import CastSection from "../components/sections/CastSection";
import CrewSection from "../components/sections/CrewSection";
import { ClipSection } from "../components/sections/ClipSection";
import useAxios from "../hooks/useAxios";
import { fetchCredits, fetchMovie, fetchVideos } from "../helpers/api";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import MovieInfoSection from "../components/sections/MovieInfoSection";
import CreditsSection from "../components/sections/CreditsSection";
import ReviewSection from "../components/sections/ReviewSection";
import useSimilar from "../hooks/useSimilar";

const MovieSlug = () => {
  const params = useParams();
  const { api, isAxiosReady } = useAxios();
  const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);

  const id = params["id"].split("_")[0];

  const { data: details } = useSWR(
    isAxiosReady ? `/movies/${id}` : null,
    () => fetchMovie(api, id),
    {
      dedupingInterval: 60000,
    }
  );

  const genres = details?.genres
    ?.slice(0, 3)
    .map((genre) => genre.name.toLowerCase())
    .join("_");

  const { similar: similarMovies } = useSimilar({
    type: "movies",
    genres: genres,
    page: 1,
    isResultOnly: false,
  });

  const { data: videos } = useSWR(
    isAxiosReady ? `/movies/${id}/videos` : null,
    () => fetchVideos(api, "movies", id),
    {
      dedupingInterval: 60000,
      onSuccess: (data) =>
        setTrailerYoutubeKey(
          data.find((video) => video.type === "Trailer").key
        ),
    }
  );

  const { data: credits } = useSWR(
    isAxiosReady ? `/movies/${id}/credits` : null,
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
        className="flex flex-col rounded-lg gap-4 p-4 w-full overflow-hidden"
      >
        <h1 className="text-primary-foreground text-sm font-semibold">
          Credits
        </h1>
        <CreditsSection credits={credits} />
        <CastSection title="Full cast" casts={credits?.cast} />
        <CrewSection title="Full crew" crews={credits?.crew} />
        {similarMovies ? (
          <MovieSection
            title="Recommendations"
            movies={similarMovies.results?.filter(
              (similarMovie) => similarMovie.title !== details.title
            )}
          />
        ) : (
          <LoadingMovieSection title="Recommendations" />
        )}
        <ClipSection
          title={"Videos"}
          keys={videos?.map((video) => ({
            name: video.name,
            value: video.key,
          }))}
        />
        <ReviewSection details={details} />
      </motion.div>
    </div>
  );
};

export default MovieSlug;
