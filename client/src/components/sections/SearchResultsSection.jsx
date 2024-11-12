import { motion } from "framer-motion";
import SearchResult from "../SearchResult";
import SearchListResult from "../SearchListResult";
import useViewport from "../../hooks/useViewport";

const SearchResultsSection = ({
  movies,
  shows,
  lists,
  visible,
  setVisible,
}) => {
  return (
    <motion.div
      initial={{ height: 0, y: 0, opacity: 0 }}
      animate={
        movies && visible
          ? { height: "auto", y: 10, opacity: 1, display: "flex" }
          : { height: 0, y: 0, opacity: 0, display: "none" }
      }
      className="absolute flex flex-col p-4 gap-2 w-full bg-primary rounded-md
      h-fit max-h-[calc(100vh-5.75rem)] overflow-y-hidden"
    >
      <p className="text-xs">Quick results</p>
      <div
        className="flex gap-2 p-2 lg:flex-row md:flex-row flex-col
      overflow-y-auto
      scrollbar-thin scrollbar-thumb-secondary-accent scrollbar-track-transparent"
      >
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-primary-foreground font-semibold">
            Movies
          </p>
          {movies &&
            movies.results
              .slice(0, 3)
              .map((result, index) => (
                <SearchResult
                  key={index}
                  result={result}
                  setVisible={setVisible}
                />
              ))}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-primary-foreground font-semibold">
            TV Shows
          </p>
          {shows &&
            shows.results
              .slice(0, 3)
              .map((result, index) => (
                <SearchResult
                  key={index}
                  result={result}
                  setVisible={setVisible}
                />
              ))}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-primary-foreground font-semibold">Lists</p>
          {lists &&
            lists.length > 0 &&
            lists
              .slice(0, 3)
              .map((list, index) => (
                <SearchListResult
                  key={index}
                  list={list}
                  setVisible={setVisible}
                />
              ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchResultsSection;
