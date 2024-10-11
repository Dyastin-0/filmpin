import Pagination from "../ui/Pagination";
import TvShow from "../TvShow";
import useAxios from "../../hooks/useAxios";
import { fetchDiscovery } from "../../helpers/api";
import useSWR from "swr";
import { LoadingDiscover } from "../loaders/MovieLoaders";

const DiscoverTvShow = ({
  genresString,
  sortBy,
  currentPage,
  onPageChange,
}) => {
  const { api, isAxiosReady } = useAxios();

  const { data, isLoading } = useSWR(
    isAxiosReady
      ? `/discover/tvshows?genres=${genresString}&sort_by=${sortBy}&page=${currentPage}`
      : null,
    () => fetchDiscovery(api, "tvshows", genresString, sortBy, currentPage),
    {
      dedupingInterval: 60000,
    }
  );

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
