import { LoadingMovieSection } from "../components/loaders/MovieLoaders";
import { LoadingTrailerSection } from "../components/loaders/TrailerLoaders";
import { useLoading } from "../components/hooks/useLoading";
import { MovieSection } from "../components/sections/MovieSection";
import { TrailerSection } from "../components/sections/TrailerSection";
import { TvShowSection } from "../components/sections/tvShowSection";
import useAxios from "../hooks/useAxios";
import { fetchCategory, fetchDiscovery } from "../helpers/api";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import HomeSlider from "../components/sliders/HomeSlider";
import BackdropLoader from "../components/loaders/BackdropLoader";
import HomeListSection from "../components/sections/HomeListSection";

const Home = () => {
  const { api, isAxiosReady } = useAxios();
  const { setLoading } = useLoading();

  const { data: topMovies, isLoading: isLoadingTopMovies } = useSWR(
    isAxiosReady ? `/movies/list?category=top_rated&page=1` : null,
    () =>
      fetchDiscovery(api, "movies", "[]").then((response) => response.results),
    {
      onSuccess: () => setLoading(false),
      dedupingInterval: 60000,
    }
  );

  const { data: popularMovies, isLoading: isLoadingPopularMovies } = useSWR(
    isAxiosReady ? "/movies/list?category=popular&page=1" : null,
    () => fetchCategory(api, "movies", "popular"),
    {
      onSuccess: () => setLoading(false),
      dedupingInterval: 60000,
    }
  );

  const { data: topTvShows, isLoading: isLoadingTopTvShows } = useSWR(
    isAxiosReady ? "/tvshows/list?category=top_rated&page=1" : null,
    () => fetchCategory(api, "tvshows", "top_rated"),
    {
      onSuccess: () => setLoading(false),
      dedupingInterval: 60000,
    }
  );

  return (
    <div className="flex flex-col bg-primary rounded-lg gap-4 p-4 justify-center items-center h-full w-full">
      <Helmet>
        <title>Home</title>
        <meta
          name="description"
          content="Browse and find movies and TV shows to watch"
        />
      </Helmet>
      {!isLoadingTopMovies ? (
        <HomeSlider data={topMovies} />
      ) : (
        <BackdropLoader />
      )}
      <HomeListSection />
      {!isLoadingPopularMovies ? (
        <MovieSection title="Popular movies" movies={popularMovies} />
      ) : (
        <LoadingMovieSection title="Popular movies" />
      )}
      {!isLoadingPopularMovies ? (
        <TrailerSection
          title="Trailers from popular movies"
          movies={popularMovies}
        />
      ) : (
        <LoadingTrailerSection title="Trailers from popular movies" />
      )}
      {!isLoadingTopMovies ? (
        <MovieSection title="Top rated movies" movies={topMovies} />
      ) : (
        <LoadingMovieSection title="Top rated" />
      )}
      {!isLoadingTopTvShows ? (
        <TvShowSection title="Top rated TV shows" shows={topTvShows} />
      ) : (
        <LoadingMovieSection title="Top rated TV shows" />
      )}
    </div>
  );
};

export default Home;
