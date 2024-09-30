import { useState } from "react";
import SearchInput from "./ui/SearchInput";
import useAxios from "../hooks/useAxios";
import { Backdrop } from "./Backdrop";
import { useToast } from "./hooks/useToast";
import useSWR from "swr";
import { fetchSearchQueryResults } from "../helpers/api";

const SelectBackdrop = () => {
  const { api, isAxiosReady } = useAxios();
  const [query, setQuery] = useState("");
  const { toastError } = useToast();

  const { data: backdrops, isLoading } = useSWR(
    isAxiosReady ? `/movies/search?query=${query}&page=1` : null,
    () => fetchSearchQueryResults(api, "movies", query, 1),
    {
      dedupingInterval: 60000,
      onError: () => toastError("Failed to search for backdrops."),
    }
  );

  return (
    <div className="flex flex-col w-[800px] h-[400px] max-w-full p-4 gap-4 bg-primary rounded-md overflow-hidden">
      <SearchInput
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for your favorite movie or TV show"
      />
      <div
        className="h-full flex flex-col items-center gap-4 overflow-y-auto
				scrollbar scrollbar-thumb-secondary scrollbar-track-transparent"
      >
        {backdrops?.results.length > 0 ? (
          backdrops?.results.map(
            (backdrop, index) =>
              backdrop.backdrop_path && (
                <Backdrop
                  key={index}
                  title={backdrop.title}
                  backdrop_path={backdrop.backdrop_path}
                />
              )
          )
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <p className="text-xs text-center">
              {!isLoading
                ? "Search for your favorite movie or TV show to set as your profile backdrop."
                : "Searching..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectBackdrop;
