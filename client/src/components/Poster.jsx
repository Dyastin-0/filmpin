import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Frame from "./Frame";
import { useModal } from "./hooks/useModal";
import Button from "./ui/Button";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const Poster = ({ details, trailerYoutubeKey }) => {
  const { setModal, setOpen } = useModal();

  return (
    <div className="flex flex-col w-fit self-center gap-3">
      <img
        loading="lazy"
        className="rounded-lg max-w-[168px] h-[250px] object-cover self-center"
        src={`https://image.tmdb.org/t/p/original/${
          details.poster_path || details.still_path
        }`}
        alt={`${details.title} poster`}
      />
      <Button
        text={
          <p>
            Watch trailer <FontAwesomeIcon size="lg" icon={faPlay} />
          </p>
        }
        className="text-md font-semibold"
        onClick={() => {
          setModal(
            <Frame youtubeKey={trailerYoutubeKey} title={details.name} />
          );
          setOpen(true);
        }}
      />
    </div>
  );
};

export default Poster;
