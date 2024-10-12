import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useModal } from "../hooks/useModal";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import AddToList from "../AddToList";
import Poster from "../Poster";
import CircularProgess from "../ui/CircularProgess";

const TvShowInfoSection = ({ details, trailerYoutubeKey }) => {
  const { setModal, setOpen } = useModal();

  return (
    <section className="w-full">
      <div className="relative w-full h-[400px] rounded-md overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
        <img
          loading="lazy"
          className="w-full h-full object-cover"
          src={`https://image.tmdb.org/t/p/original/${details.backdrop_path}`}
          alt={`${details.title} backdrop`}
        />
      </div>
      <motion.div
        initial={{ y: -120 }}
        className="flex md:flex-row flex-col p-4 rounded-md max-w-full w-full gap-4"
      >
        <Poster details={details} trailerYoutubeKey={trailerYoutubeKey} />
        <div className="flex flex-col gap-2 w-full">
          <p className="text-primary-foreground text-xs">{details.tagline}</p>
          <h1 className="text-primary-foreground text-4xl font-semibold">
            {" "}
            {details.name}{" "}
          </h1>
          <p className="text-primary-foreground text-sm">
            {" "}
            {details.overview}{" "}
          </p>
          <h4 className="text-primary-foreground text-xs">
            {`${details.first_air_date?.split("-")[0]}-${
              details.last_air_date?.split("-")[0]
            }`}
          </h4>
          <div className="flex gap-1">
            {details.genres.map((genre, index) => (
              <Link
                key={index}
                to={`/discover/tvshows?genres=${genre?.name.toLowerCase()}&sort_by=vote_count&page=1`}
                className="underline outline-none underline-offset-2 text-xs
                transition-all duration-300 hover:text-primary-highlight focus:text-primary-highlight"
              >
                {`${
                  index === details.genres.length - 1
                    ? genre?.name
                    : `${genre?.name},`
                }`}
              </Link>
            ))}
          </div>
          <p className="text-primary-foreground text-xs">
            {`${details.number_of_seasons} seasons, ${details.number_of_episodes} episodes`}
          </p>
          <CircularProgess value={details.vote_average?.toFixed(1)} />
          <Button
            text="Add to list"
            icon={<FontAwesomeIcon icon={faPlus} />}
            className="w-fit"
            onClick={() => {
              setModal(<AddToList selected={details} type="TV Shows" />);
              setOpen(true);
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default TvShowInfoSection;
