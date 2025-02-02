import { LoadingDiscover } from "../loaders/MovieLoaders";
import Movie from "../Movie";
import Pagination from "../ui/Pagination";

const SearchMovie = ({ data, currentPage, onPageChange }) => {
  return !data ? (
    <LoadingDiscover />
  ) : (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-3 w-full h-full">
        {data?.results?.map((movie, index) => (
          <Movie key={index} info={movie} />
        ))}
      </div>
      {data?.total_pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.total_pages > 500 ? 500 : data.total_pages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default SearchMovie;
