import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Frame from "./Frame";
import { useModal } from "./hooks/useModal";

const Clip = ({ title, trailerKey }) => {
  const { setModal, setOpen } = useModal();

  return (
    <div
      className="h-fit max-w-[270px] group border border-secondary-accent p-4 rounded-md
      transition-all duration-300
      hover:cursor-pointer hover:border-primary-highlight"
      onClick={() => {
        setModal(<Frame youtubeKey={trailerKey} title={title} />);
        setOpen(true);
      }}
    >
      <div className="relative">
        <img
          loading="lazy"
          className="aspect-video object-cover rounded-md w-[270px] h-fit"
          src={`https://img.youtube.com/vi/${trailerKey}/hqdefault.jpg`}
          alt={`${title} trailer thumbnail`}
        />
        <div className="absolute inset-0 flex justify-center items-center bg-transparent rounded-md transition-colors duration-300 group-hover:bg-[#0000004D]">
          <FontAwesomeIcon icon={faPlay} className="text-accent text-2xl" />
        </div>
      </div>
      <h1 className="text-center text-primary-foreground mt-2 text-xs line-clamp-1 font-semibold">
        {title}
      </h1>
    </div>
  );
};

export default Clip;
