import { useEffect, useState } from "react";
import Selector from "../components/ui/Selector";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLoading } from "../components/hooks/useLoading";
import Accordion from "../components/ui/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { tvShowGenres } from "../models/genres";
import { Helmet } from "react-helmet";
import DiscoverTvShow from "../components/paginations/DiscoverTvShow";

const DiscoverTvShowSlug = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);

  const genresString =
    selectedGenres.length > 0
      ? selectedGenres.join("_").toLowerCase()
      : searchParams.get("genres") || "";

  const sortBy = "vote_count";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [selectedGenres, currentPage]);

  useEffect(() => {
    const genres = searchParams.get("genres");
    setSelectedGenres(genres !== "" ? genres.split("_") : []);
    setCurrentPage(parseInt(searchParams.get("page")) || 1);
  }, [searchParams]);

  useEffect(() => {
    const query = `?${searchParams.toString()}`;
    const newQuery = `?genres=${genresString}&sort_by=${sortBy}&page=${currentPage}`;
    if (query !== newQuery) {
      navigate(newQuery);
    }
  }, [selectedGenres]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
    navigate(
      `/discover/tvshows?genres=${genresString}&sort_by=${sortBy}&page=${page}`
    );
  };

  return (
    <div className="flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full">
      <Helmet>
        <title>Discover Movies</title>
      </Helmet>
      <h1 className="text-primary-foreground text-sm text-start font-semibold">
        Discover TV shows
      </h1>
      <Accordion
        title={
          <div className="gap-2">
            <FontAwesomeIcon icon={faFilter} /> Filter{" "}
          </div>
        }
      >
        <Selector
          items={tvShowGenres}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
        />
      </Accordion>
      <DiscoverTvShow
        genresString={genresString}
        sortBy={sortBy}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default DiscoverTvShowSlug;
