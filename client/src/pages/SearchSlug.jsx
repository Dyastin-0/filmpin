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
          className={
            tab === "Movies" &&
            "bg-[var(--highlight)] text-[var(--text-highlight)]"
          }
          variant="default_rounded"
          text="Movies"
          onClick={() => setTab("Movies")}
        />
        <Button
          className={
            tab === "TV Shows" &&
            "bg-[var(--highlight)] text-[var(--text-highlight)]"
          }
          variant="default_rounded"
          text="TV Shows"
          onClick={() => setTab("TV Shows")}
        />
      </div>
      {tab === "Movies" ? (
        <SearchMovie
          data={movieResults}
          currentPage={moviesCurrentPage}
          onPageChange={onMoviesPageChange}
        />
      ) : (
        <SearchTvShow
          data={tvShowResults}
          currentPage={tvShowsCurrentPage}
          onPageChange={onTvShowsPageChange}
        />
      )}
    </div>
  );
};

export default DiscoverMovieSlug;
