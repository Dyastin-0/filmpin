import { useNavigate } from "react-router";

const SearchResult = ({ result, setVisible }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-end gap-2 p-2 rounded-md text-primary-foreground text-xs
      transition-all duration-300
			border border-secondary-accent
			hover:cursor-pointer hover:border-primary-highlight"
      onClick={() => {
        setVisible(false);
        navigate(`/movies?id=${result.id}_${result.title}`);
      }}
    >
      <img
        className="rounded-md w-[45px] h-[60px] object-cover"
        src={`https://image.tmdb.org/t/p/w200/${result.poster_path}`}
        alt={result.title}
      />
      <p className="font-semibold">{result.title || result.name}</p>
    </div>
  );
};

export default SearchResult;
