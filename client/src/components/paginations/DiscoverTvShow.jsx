import Pagination from "../ui/Pagination";
import TvShow from "../TvShow";
import { LoadingDiscover } from "../loaders/MovieLoaders";
import useSimilar from "../../hooks/useSimilar";

const DiscoverTvShow = ({
  genresString,
  sortBy,
  currentPage,
  onPageChange,
}) => {
  const { similar: data, isLoading } = useSimilar({
    type: "tvshows",
    genres: genresString || "[]",
    page: currentPage,
    sortBy: sortBy,
    isResultOnly: false,
  });

  if (isLoading) return <LoadingDiscover />;

  return (
    <section className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-3 w-full h-full">
        {data?.results?.map((show, index) => (
          <TvShow key={index} info={show} />
        ))}
      </div>
      {data?.total_pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.total_pages > 500 ? 500 : data.total_pages}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
};

export default DiscoverTvShow;
