import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const SearchResult = ({ result, setVisible, type }) => {
  const navigate = useNavigate();

  return (
    <Link
      className="flex items-end gap-2 p-2 rounded-md text-primary-foreground text-xs
      transition-all duration-300 max-h-[145.07px]
			border border-secondary-accent outline-none
			hover:cursor-pointer hover:border-primary-highlight focus:border-primary-highlight"
      to={`/${type}/${result.id}`}
      onClick={() => setVisible(false)}
    >
      <img
        className="rounded-md w-[45px] object-cover"
        src={`https://image.tmdb.org/t/p/w200/${result.poster_path}`}
        alt={result.name || result.title}
      />
      <p className="font-semibold text-ellipsis line-clamp-4">
        {result.title || result.name}
      </p>
    </Link>
  );
};

export default SearchResult;
