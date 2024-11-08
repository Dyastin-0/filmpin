import { LoadingMovieSection } from "../components/loaders/MovieLoaders";
import { LoadingTrailerSection } from "../components/loaders/TrailerLoaders";
import { MovieSection } from "../components/sections/MovieSection";
import { TrailerSection } from "../components/sections/TrailerSection";
import { TvShowSection } from "../components/sections/tvShowSection";
import useAxios from "../hooks/useAxios";
import { fetchCategory, fetchDiscovery } from "../helpers/api";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import HomeSlider from "../components/sliders/HomeSlider";
import BackdropLoader from "../components/loaders/BackdropLoader";
import useList from "../hooks/useList";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import ListPoster from "../components/ListPoster";
import QuickList from "../components/QuickList";

const Home = () => {
  const { api, isAxiosReady } = useAxios();
  const { user } = useAuth();
  const { list } = useList({ userData: user });

  const { data: topMovies, isLoading: isLoadingTopMovies } = useSWR(
    isAxiosReady ? `/movies/list?category=top_rated&page=1` : null,
    () =>
      fetchDiscovery(api, "movies", "[]").then((response) => response.results),
    {
      dedupingInterval: 60000,
    }
  );

  const { data: popularMovies, isLoading: isLoadingPopularMovies } = useSWR(
    isAxiosReady ? "/movies/list?category=popular&page=1" : null,
    () => fetchCategory(api, "movies", "popular"),
    {
      dedupingInterval: 60000,
    }
  );

  const { data: topTvShows, isLoading: isLoadingTopTvShows } = useSWR(
    isAxiosReady ? "/tvshows/list?category=top_rated&page=1" : null,
    () => fetchCategory(api, "tvshows", "top_rated"),
    {
      dedupingInterval: 60000,
    }
  );

  return (
    <div className="relative flex gap-4 w-full h-full">
      <Helmet>
        <title>Home</title>
        <meta
          name="description"
          content="Browse and find movies and TV shows to watch"
        />
      </Helmet>
      <QuickList list={list} />
      <div className="flex flex-col bg-primary rounded-lg gap-4 p-4 justify-center items-center h-full w-[calc(100%-200px)]">
        {!isLoadingTopMovies ? (
          <HomeSlider data={topMovies} />
        ) : (
          <BackdropLoader />
        )}
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
    </div>
  );
};

export default Home;
