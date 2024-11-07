import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { blinkVariants } from "../configs/motionConfig";
import Button from "./ui/Button";

const SliderMovie = ({ movie }) => {
  const navigate = useNavigate();
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);

  useEffect(() => {
    const backdrop = new Image();
    backdrop.src = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
    backdrop.onload = () => setBackdropLoaded(true);

    const poster = new Image();
    poster.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
    poster.onload = () => setPosterLoaded(true);
  }, []);

  const handleClick = () => {
    navigate(`/movies?id=${movie.id}_${movie.title}`);
  };

  return (
    <div className="flex h-full items-center justify-center lg:justify-start relative">
      {backdropLoaded ? (
        <>
          <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-black z-20" />
          <img
            loading="lazy"
            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
            className="absolute top-0 left-0 w-full h-full rounded-md object-cover z-0"
          />
        </>
      ) : (
        <motion.div
          className="absolute w-full h-[400px] bg-secondary rounded-md overflow-hidden"
          variants={blinkVariants}
          animate="blink"
        ></motion.div>
      )}
      <div className="flex flex-col lg:flex-row justify-end lg:items-end z-20 p-4 gap-4">
        {posterLoaded ? (
          <img
            loading="lazy"
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
            className="z-10 rounded-lg min-w-[168px] h-[250px] self-center"
          />
        ) : (
          <motion.div
            className="z-10 rounded-lg min-w-[168px] h-[250px] self-center"
            variants={blinkVariants}
            animate="blink"
          />
        )}
        <div className="flex flex-col items-start text-primary-highlight-foreground">
          {movie ? (
            <div className="flex flex-col gap-2">
              <h1 className="text-sm font-bold">{movie.title}</h1>
              <p className="lg:flex hidden w-1/2 text-sm">{movie.overview}</p>
              <Button
                variant="default_rounded"
                icon={<FontAwesomeIcon icon={faInfoCircle} />}
                className="w-fit font-semibold"
                onClick={handleClick}
              />
            </div>
          ) : (
            <>
              <motion.div
                className="rounded-full w-[14px] h-[14px] bg-secondary"
                variants={blinkVariants}
                animate="blink"
              />
              <motion.div
                className="rounded-md w-[200px] h-[25px] bg-secondary"
                variants={blinkVariants}
                animate="blink"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SliderMovie;
