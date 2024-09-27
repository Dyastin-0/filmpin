import { motion } from "framer-motion";
import { useModal } from "../hooks/useModal";
import Poster from "../Poster";

const TvShowSeasonSection = ({
  details,
  title,
  backdropPath,
  trailerYoutubeKey,
}) => {
  const { setModal, setOpen } = useModal();

  return (
    <section className="w-full">
      <div className="relative w-full h-[400px] rounded-md overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
        <img
          loading="lazy"
          className="w-full h-full object-cover"
          src={`https://image.tmdb.org/t/p/original/${backdropPath}`}
          alt={`${details.name} backdrop`}
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
            {title}{" "}
          </h1>
          <h1 className="text-primary-foreground text-md font-semibold">
            {" "}
            {details.name}{" "}
          </h1>
          <p className="text-primary-foreground text-sm">
            {" "}
            {details.overview}{" "}
          </p>
          <h4 className="text-primary-foreground text-xs">
            {" "}
            {`${details.air_date?.split("-")[0]}`}{" "}
          </h4>
          <p className="text-primary-foreground text-xs">
            {" "}
            {`${details.episodes.length} episodes`}{" "}
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default TvShowSeasonSection;
