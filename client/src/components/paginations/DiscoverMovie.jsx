import useSWR from "swr";
import { useLoading } from "../hooks/useLoading";
import Movie from "../Movie";
import Pagination from "../ui/Pagination";
import useAxios from "../../hooks/useAxios";
import { fetchDiscovery } from "../../helpers/api";
import { LoadingDiscover } from "../loaders/MovieLoaders";

const DiscoverMovie = ({ genresString, sortBy, currentPage, onPageChange }) => {
  const { api, isAxiosReady } = useAxios();
  const { setLoading } = useLoading();

  const { data, isLoading, isError } = useSWR(
    isAxiosReady
      ? `/discover/movies?genres=${genresString}&sort_by=${sortBy}&page=${currentPage}`
      : null,
    () => fetchDiscovery(api, "movies", genresString, sortBy, currentPage),
    {
      onSuccess: () => {
        setLoading(false);
      },
    }
  );

  if (isLoading) return <LoadingDiscover />;

  if (isError) return <section>Failed to load</section>;

  return (
    <section className="flex flex-col items-center gap-4">
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
    </section>
  );
};

export default DiscoverMovie;
