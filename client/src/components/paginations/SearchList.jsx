import { LoadingDiscover } from "../loaders/MovieLoaders";
import UserList from "../UserList";
import Pagination from "../ui/Pagination";

const SearchList = ({ data, currentPage, onPageChange }) => {
  return !data ? (
    <LoadingDiscover />
  ) : (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-3 w-full h-full">
        {data?.lists?.map((list, index) => (
          <UserList key={index} list={list} />
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

export default SearchList;
