import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchCategory } from "../helpers/api";
import { useLoading } from "../components/hooks/useLoading";
import useAxios from "../hooks/useAxios";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm, faTv } from "@fortawesome/free-solid-svg-icons";

const Discover = () => {
  const { api, isAxiosReady } = useAxios();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const [isMovieHovered, setIsMovieHovered] = useState(true);

  const { data: movies, isLoading: areMoviesLoading } = useSWR(
    isAxiosReady ? "/movies/list?category=top_ratedt&page=1" : null,
    () => fetchCategory(api, "movies", "top_rated", 1),
    {
      dedupingInterval: 60000,
    }
  );

  const { data: shows, isLoading: areShowsLoading } = useSWR(
    isAxiosReady ? "/tvshows/list?category=top_rated&page=1" : null,
    () => fetchCategory(api, "tvshows", "top_rated", 1),
    {
      dedupingInterval: 60000,
    }
  );

  useEffect(() => {
    const activeList = isMovieHovered ? movies : shows;
    if (activeList?.length > 0) {
      const intervalId = setInterval(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % activeList?.length);
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [movies, shows, isMovieHovered]);

  useEffect(() => {
    setLoading(areMoviesLoading || areShowsLoading);
  }, [areMoviesLoading, areShowsLoading]);

  if (!movies || !shows) return;

  const backdrop = isMovieHovered
    ? movies[imageIndex]?.backdrop_path
    : shows[imageIndex]?.backdrop_path;

  return (
    <div className="flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full">
      <Helmet>
        <title>Discover</title>
      </Helmet>
      <div className="relative flex h-full w-full justify-center rounded-lg bg-accent gap-4">
        <div className="absolute w-full h-full bg-black opacity-20 rounded-md z-20"></div>
        <AnimatePresence>
          {backdrop && (
            <motion.img
              key={backdrop}
              src={`https://image.tmdb.org/t/p/original/${backdrop}`}
              className="absolute w-full h-full z-10 rounded-lg object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>
        <div className="flex w-fit h-fit rounded-md text-xs font-semibold p-4 gap-4 z-30">
          <Link
            to={"/discover/tvshows?genres=&sort_by=vote_count&page=1"}
            onMouseEnter={() => setIsMovieHovered(false)}
            className={`rounded-md p-2
            transition-all duration-300
            ${isMovieHovered ? "bg-primary text-primary-foreground" : "bg-primary-highlight text-primary-highlight-foreground"}`}
          >
            TV Shows <FontAwesomeIcon icon={faTv} />
          </Link>
          <Link
            to={"/discover/movies?genres=&sort_by=vote_count&page=1"}
            onMouseEnter={() => setIsMovieHovered(true)}
            className={`rounded-md p-2
            transition-all duration-300
            ${!isMovieHovered ? "bg-primary text-primary-foreground" : "bg-primary-highlight text-primary-highlight-foreground"}`}
          >
            Movies <FontAwesomeIcon icon={faFilm} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Discover;
