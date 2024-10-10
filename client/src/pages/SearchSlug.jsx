import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLoading } from "../components/hooks/useLoading";
import useAxios from "../hooks/useAxios";
import { fetchSearchQueryResults } from "../helpers/api";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import SearchMovie from "../components/paginations/SearchMovie";
import SearchTvShow from "../components/paginations/SearchTvShow";
import Button from "../components/ui/Button";
import SearchList from "../components/paginations/SearchList";
import clsx from "clsx";

const DiscoverMovieSlug = () => {
  const { api, isAxiosReady } = useAxios();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [tab, setTab] = useState("Movies");
  const [moviesCurrentPage, setMoviesCurrentPage] = useState(
    parseInt(searchParams.get("movies-page")) || 1
  );
  const [tvShowsCurrentPage, setTvShowsCurrentPage] = useState(
    parseInt(searchParams.get("tvshows-page")) || 1
  );
  const [listsCurrentPage, setListsCurrentPage] = useState(
    parseInt(searchParams.get("lists-page")) || 1
  );
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const { data: movieResults } = useSWR(
    isAxiosReady
      ? `/movies/search?query=${query}&page=${moviesCurrentPage}`
      : null,
    () => fetchSearchQueryResults(api, "movies", query, moviesCurrentPage),
    {
      dedupingInterval: 60000,
      onSuccess: () => setLoading(false),
    }
  );

  const { data: tvShowResults } = useSWR(
    isAxiosReady
      ? `/tvshows/search?query=${query}&page=${tvShowsCurrentPage}`
      : null,
    () => fetchSearchQueryResults(api, "tvshows", query, tvShowsCurrentPage),
    {
      dedupingInterval: 60000,
      onSuccess: () => setLoading(false),
    }
  );

  const { data: listResults } = useSWR(
    isAxiosReady ? `/lists/search?query=${query}&page=1&limit=20` : null,
    () => api.get(`/lists/search/${query}?&page=1`).then((res) => res.data),
    {
      dedupingInterval: 60000,
      onSuccess: () => setLoading(false),
    }
  );

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setMoviesCurrentPage(parseInt(searchParams.get("movies-page")) || 1);
    setTvShowsCurrentPage(parseInt(searchParams.get("tvshows-page")) || 1);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    navigate(
      `/search?query=${query}&movies-page=${moviesCurrentPage}&tvshows-page=${tvShowsCurrentPage}`,
      {
        replace: true,
      }
    );
  }, [query, moviesCurrentPage, navigate]);

  useEffect(() => {
    setLoading(true);
    navigate(
      `/search?query=${query}&movies-page=${moviesCurrentPage}&tvshows-page=${tvShowsCurrentPage}`,
      {
        replace: true,
      }
    );
  }, [query, tvShowsCurrentPage, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [moviesCurrentPage, tvShowsCurrentPage]);

  const onMoviesPageChange = (page) => {
    setMoviesCurrentPage(page);
  };

  const onTvShowsPageChange = (page) => {
    setTvShowsCurrentPage(page);
  };

  const onListsPageChange = (page) => {
    setListsCurrentPage(page);
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

export default DiscoverMovieSlug;
