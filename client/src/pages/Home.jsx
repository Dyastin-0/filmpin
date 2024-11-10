import { MovieSection } from "../components/sections/MovieSection";
import { TrailerSection } from "../components/sections/TrailerSection";
import { TvShowSection } from "../components/sections/tvShowSection";
import useAxios from "../hooks/useAxios";
import { fetchCategory, fetchDiscovery } from "../helpers/api";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import HomeSlider from "../components/sliders/HomeSlider";
import BackdropLoader from "../components/loaders/BackdropLoader";
import { useList } from "../hooks/useList";
import { useAuth } from "../hooks/useAuth";
import QuickList from "../components/QuickList";
import useViewport from "../hooks/useViewport";
import { motion } from "framer-motion";

const Home = () => {
  const { api, isAxiosReady } = useAxios();
  const { viewWidth } = useViewport();
  const { user } = useAuth();
  const { list } = useList({ userData: user });

  const { data: topMovies } = useSWR(
    isAxiosReady ? `/movies/list?category=top_rated&page=1` : null,
    () =>
      fetchDiscovery(api, "movies", "[]").then((response) => response.results),
    {
      dedupingInterval: 60000,
    }
  );

  const { data: popularMovies } = useSWR(
    isAxiosReady ? "/movies/list?category=popular&page=1" : null,
    () => fetchCategory(api, "movies", "popular"),
    {
      dedupingInterval: 60000,
    }
  );

  const { data: topTvShows } = useSWR(
    isAxiosReady ? "/tvshows/list?category=top_rated&page=1" : null,
    () => fetchCategory(api, "tvshows", "top_rated"),
    {
      dedupingInterval: 60000,
    }
  );

  if (!user || !isAxiosReady) {
    return <BackdropLoader />;
  }

  return (
    <div className="relative flex gap-4 w-full h-full">
      <Helmet>
        <title>Home</title>
        <meta
          name="description"
          content="Browse and find movies and TV shows to watch"
        />
      </Helmet>
      {viewWidth >= 768 && <QuickList list={list} />}
      <motion.div
        className={`flex flex-col bg-primary rounded-lg gap-4 p-4 justify-center items-center h-full`}
        animate={{ width: viewWidth >= 768 ? "calc(100% - 200px)" : "100%" }}
        transition={{ duration: 0.5 }}
      >
        <HomeSlider data={topMovies} />
        <MovieSection title="Popular movies" movies={popularMovies} />
        <TrailerSection
          title="Trailers from popular movies"
          movies={popularMovies}
        />
        <MovieSection title="Top rated movies" movies={topMovies} />
        <TvShowSection title="Top rated TV shows" shows={topTvShows} />
      </motion.div>
    </div>
  );
};

export default Home;
