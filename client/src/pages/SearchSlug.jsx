import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { fetchSearchQueryResults } from "../helpers/api";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import SearchMovie from "../components/paginations/SearchMovie";
import SearchTvShow from "../components/paginations/SearchTvShow";
import Button from "../components/ui/Button";
import SearchList from "../components/paginations/SearchList";
import clsx from "clsx";

const SearchSlug = () => {
  const { api, isAxiosReady } = useAxios();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState("Movies");
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const moviesCurrentPage = parseInt(searchParams.get("movies-page")) || 1;
  const tvShowsCurrentPage = parseInt(searchParams.get("tvshows-page")) || 1;
  const listsCurrentPage = parseInt(searchParams.get("lists-page")) || 1;

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const { data: movieResults } = useSWR(
    isAxiosReady && tab === "Movies"
      ? `/movies/search?query=${query}&page=${moviesCurrentPage}`
      : null,
    () => fetchSearchQueryResults(api, "movies", query, moviesCurrentPage),
    {
      dedupingInterval: 60000,
    }
  );

  const { data: tvShowResults } = useSWR(
    isAxiosReady && tab === "TV Shows"
      ? `/tvshows/search?query=${query}&page=${tvShowsCurrentPage}`
      : null,
    () => fetchSearchQueryResults(api, "tvshows", query, tvShowsCurrentPage),
    {
      dedupingInterval: 60000,
    }
  );

  const { data: listResults } = useSWR(
    isAxiosReady && query !== "" && tab === "Lists"
      ? `/lists/search?query=${query}&page=${listsCurrentPage}&limit=20`
      : null,
    () => fetchSearchQueryResults(api, "lists", query, listsCurrentPage),
    {
      dedupingInterval: 60000,
    }
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [moviesCurrentPage, tvShowsCurrentPage, listsCurrentPage]);

  const onMoviesPageChange = (page) => {
    setSearchParams({
      query,
      "movies-page": page,
      "tvshows-page": tvShowsCurrentPage,
      "lists-page": listsCurrentPage,
    });
  };

  const onTvShowsPageChange = (page) => {
    setSearchParams({
      query,
      "movies-page": moviesCurrentPage,
      "tvshows-page": page,
      "lists-page": listsCurrentPage,
    });
  };

  const onListsPageChange = (page) => {
    setSearchParams({
      query,
      "movies-page": moviesCurrentPage,
      "tvshows-page": tvShowsCurrentPage,
      "lists-page": page,
    });
  };

  return (
    <div className="flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full">
      <Helmet>
        <title>Search</title>
      </Helmet>
      <div className="flex justify-start items-center w-full gap-2">
        <h1 className="text-primary-foreground text-sm text-start font-semibold">
          Results
        </h1>
        <Button
          className={clsx({
            "bg-primary-highlight text-primary-highlight": tab === "Movies",
          })}
          variant="default_rounded"
          text="Movies"
          onClick={() => setTab("Movies")}
        />
        <Button
          className={clsx({
            "bg-primary-highlight text-primary-highlight": tab === "TV Shows",
          })}
          variant="default_rounded"
          text="TV Shows"
          onClick={() => setTab("TV Shows")}
        />
        <Button
          className={clsx({
            "text-primary-highlight": tab === "Lists",
          })}
          variant="default_rounded"
          text="Lists"
          onClick={() => setTab("Lists")}
        />
      </div>
      {tab === "Movies" && (
        <SearchMovie
          data={movieResults}
          currentPage={moviesCurrentPage}
          onPageChange={onMoviesPageChange}
        />
      )}
      {tab === "TV Shows" && (
        <SearchTvShow
          data={tvShowResults}
          currentPage={tvShowsCurrentPage}
          onPageChange={onTvShowsPageChange}
        />
      )}
      {tab === "Lists" && (
        <SearchList
          data={listResults}
          currentPage={listsCurrentPage}
          onPageChange={onListsPageChange}
        />
      )}
    </div>
  );
};

export default SearchSlug;
