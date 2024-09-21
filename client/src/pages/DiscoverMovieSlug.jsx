import { useEffect, useState } from "react";
import Selector from "../components/ui/Selector";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingDiscover } from "../components/loaders/MovieLoaders";
import { useLoading } from "../components/hooks/useLoading";
import Accordion from "../components/ui/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { movieGenres } from "../models/genres";
import useAxios from "../hooks/useAxios";
import { fetchDiscovery } from "../helpers/api";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import DiscoverMovie from "../components/paginations/DiscoverMovie";

const DiscoverMovieSlug = () => {
  const navigate = useNavigate();
  const { api, isAxiosReady } = useAxios();
  const [searchParams] = useSearchParams();
  const { setLoading } = useLoading();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );

  const genresString =
    selectedGenres.length > 0 ? selectedGenres.join("_").toLowerCase() : "";
  const sortBy = "vote_count";

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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [selectedGenres, currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
    navigate(
      `/discover/movies?genres=${genresString}&sort_by=${sortBy}&page=${page}`,
      { replace: true }
    );
  };

  useEffect(() => {
    setCurrentPage(1);
    navigate(
      `/discover/movies?genres=${genresString}&sort_by=${sortBy}&page=1`,
      { replace: true }
    );
  }, [selectedGenres]);

  return (
    <div className="flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full">
      <Helmet>
        <title>Discover Movies</title>
      </Helmet>
      <h1 className="text-primary-foreground text-sm text-start font-semibold">
        Discover movies
      </h1>
      <Accordion
        title={
          <div className="gap-2">
            <FontAwesomeIcon icon={faFilter} /> Filter{" "}
          </div>
        }
      >
        <Selector
          items={movieGenres}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
        />
      </Accordion>
      {isLoading ? (
        selectedGenres && <LoadingDiscover />
      ) : isError ? (
        <p className="text-xs text-error text-center font-bold">
          Something went wrong.
        </p>
      ) : (
        <DiscoverMovie
          data={data}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default DiscoverMovieSlug;
