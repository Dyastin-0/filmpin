import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { Link } from "react-router-dom";
import { useModal } from "../hooks/useModal";
import AddToList from "../AddToList";
import Poster from "../Poster";
import CircularProgess from "../ui/CircularProgess";
import { useAuth } from "../../hooks/useAuth";
import { useList } from "../../hooks/useList";
import useAxios from "../../hooks/useAxios";
import useConfirm from "../../components/hooks/useConfirm";
import { useToast } from "../hooks/useToast";
import { addListItem, createList, patchList } from "../../helpers/api";

const MovieInfoSection = ({ details, trailerYoutubeKey }) => {
  const { api } = useAxios();
  const confirm = useConfirm();
  const { toastInfo } = useToast();
  const { user } = useAuth();
  const { list } = useList({ userData: user });
  const { setModal, setOpen } = useModal();

  const watchedList = list?.find((item) => item.name === "Watched");
  const isWatched = watchedList?.list?.find((item) => item.id == details.id);

  const handleAddToWatched = () => {
    confirm({
      message: isWatched
        ? `Remove ${details.title} from watched list?`
        : `Add ${details.title} to watched list?`,
      onConfirm: async () => {
        if (isWatched) {
          patchList(
            api,
            watchedList._id,
            watchedList.list.filter((item) => item.id != details.id)
          ).then(() =>
            toastInfo(`${details.title} removed from watched list.`)
          );
          return;
        }
        if (watchedList) {
          addListItem(api, watchedList._id, {
            id: details.id,
            title: details.title,
            poster_path: details.poster_path,
            backdrop_path: details.backdrop_path,
          }).then(() => toastInfo(`${details.title} added to watched list.`));
        } else {
          createList(api, "Watched", "Movies", {
            id: details.id,
            title: details.title,
            poster_path: details.poster_path,
            backdrop_path: details.backdrop_path,
          }).then(() => toastInfo(`${details.title} added to watched list.`));
        }
      },
    });
  };

  return (
    <section className="w-full">
      <div className="relative w-full h-[400px] rounded-md overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
        <img
          loading="lazy"
          className="w-full h-full object-cover"
          src={`https://image.tmdb.org/t/p/original/${details?.backdrop_path}`}
          alt={`${details?.name} backdrop`}
        />
      </div>
      <motion.div
        initial={{ y: -120 }}
        className="flex md:flex-row flex-col rounded-md max-w-full w-full gap-4 p-4"
      >
        <Poster details={details} trailerYoutubeKey={trailerYoutubeKey} />
        <div className="flex flex-col gap-2 w-full">
          <p className="text-primary-foreground text-xs">{details.tagline}</p>
          <h1 className="text-primary-foreground text-4xl font-semibold">
            {details?.title}
          </h1>
          <p className="text-primary-foreground text-sm">{details.overview}</p>
          <h4 className="text-primary-foreground text-xs">
            {details.release_date.split("-")[0]}
          </h4>
          <div className="flex gap-1">
            {details.genres.map((genre, index) => (
              <Link
                key={index}
                to={`/discover/movies?genres=${genre.name.toLowerCase()}&sort_by=vote_count&page=1`}
                className="underline outline-none underline-offset-2 text-xs
                transition-all duration-300 hover:text-primary-highlight focus:text-primary-highlight"
              >
                {`${
                  index === details?.genres.length - 1
                    ? genre.name
                    : `${genre.name},`
                }`}
              </Link>
            ))}
          </div>
          <p className="text-primary-foreground text-xs">
            {`${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`}
          </p>
          <CircularProgess value={details.vote_average?.toFixed(1)} />
          <div className="flex gap-2">
            <Button
              text="Add to list"
              icon={<FontAwesomeIcon icon={faPlus} />}
              className="w-fit"
              onClick={() => {
                setModal(<AddToList selected={details} type="Movies" />);
                setOpen(true);
              }}
            />
            <Button
              text="Watched"
              icon={<FontAwesomeIcon icon={!isWatched ? faPlus : faCheck} />}
              className="w-fit"
              onClick={handleAddToWatched}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default MovieInfoSection;
