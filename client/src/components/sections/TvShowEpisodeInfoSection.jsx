import { motion } from "framer-motion";
import Poster from "../Poster";

const TvShowInfoSection = ({
  details,
  title,
  seasonNumber,
  trailerYoutubeKey,
}) => {
  return (
    <motion.section
      initial={{ y: -120 }}
      className="flex md:flex-row flex-col p-4 rounded-md w-full gap-4"
    >
      <Poster details={details} trailerYoutubeKey={trailerYoutubeKey} />
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-primary-foreground text-4xl font-semibold">
          {" "}
          {`${title}, S${seasonNumber}`}{" "}
        </h1>
        <h1 className="text-primary-foreground text-md font-semibold">
          {" "}
          {details?.name}{" "}
        </h1>
        <p className="text-primary-foreground text-sm"> {details?.overview} </p>
        <h4 className="text-primary-foreground text-xs">
          {" "}
          {`${details?.air_date?.split("-")[0]}`}{" "}
        </h4>
        <p className="text-primary-foreground text-xs">
          {" "}
          {`${Math.floor(details?.runtime / 60)}h ${
            details?.runtime % 60
          }m`}{" "}
        </p>
      </div>
    </motion.section>
  );
};

export default TvShowInfoSection;
