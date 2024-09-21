import Pagination from "../ui/Pagination";
import TvShow from "../TvShow";

const DiscoverTvShow = ({ data, currentPage, onPageChange }) => {
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
