import { useEffect, useState } from "react";
import Movie from "../components/Movie";
import Pagination from "../components/ui/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingDiscover } from "../components/loaders/MovieLoaders";
import { useLoading } from "../components/hooks/useLoading";
import useAxios from "../hooks/useAxios";
import { fetchSearchQueryResults } from "../helpers/api";
import useSWR from "swr";
import { Helmet } from "react-helmet";

const DiscoverMovieSlug = () => {
  const { api, isAxiosReady } = useAxios();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const { data, isLoading, isError } = useSWR(
    isAxiosReady ? `/movies/search?query=${query}&page=${currentPage}` : null,
    () => fetchSearchQueryResults(api, query, currentPage),
    {
      onSuccess: () => setLoading(false),
    }
  );

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setCurrentPage(parseInt(searchParams.get("page")) || 1);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    navigate(`/movies/search?query=${query}&page=${currentPage}`, {
      replace: true,
    });
  }, [query, currentPage, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    document.title = "Discover movies";
  }, []);

  const onPageChange = (page) => {
    setCurrentPage(page);
    navigate(`/movies/search?query=${query}&page=${page}`, { replace: true });
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
      </div>
      {isLoading ? (
        <LoadingDiscover />
      ) : isError ? (
        <div>Error loading data.</div>
      ) : (
        <div className="flex flex-col items-center gap-4">
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
        </div>
      )}
    </div>
  );
};

export default DiscoverMovieSlug;
