import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import SearchInput from "./ui/SearchInput";
import { useAuth } from "../hooks/useAuth";
import useSWR from "swr";
import useAxios from "../hooks/useAxios";
import { fetchSearchQueryResults } from "../helpers/api";
import SearchResultsSection from "./sections/SearchResultsSection";

const Search = ({ isScrollingDown, viewWidth }) => {
  const { api, isAxiosReady } = useAxios();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (isScrollingDown) setVisible(false);
  }, [isScrollingDown]);

  const { data: movies } = useSWR(
    isAxiosReady && query ? `/movies/search?query=${query}` : null,
    () => fetchSearchQueryResults(api, "movies", query, 1),
    { dedupingInterval: 60000 }
  );

  const { data: shows } = useSWR(
    isAxiosReady && query ? `/tvshows/search?query=${query}` : null,
    () => fetchSearchQueryResults(api, "tvshows", query, 1),
    { dedupingInterval: 60000 }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setVisible(false);
    if (query) {
      navigate(
        `/search?query=${query.replace(/[_\s]/g, "+")}&movies-page=1&tvshows-page=1&lists-page=1`
      );
    }
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!token) return null;

  return (
    <div ref={searchRef} className="relative max-w-full">
      <SearchInput
        onClick={() => setVisible(true)}
        value={query}
        onSubmit={handleSearch}
        type="text"
        id="search"
        placeholder="Search"
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchResultsSection
        movies={movies}
        shows={shows}
        visible={visible}
        setVisible={setVisible}
        viewWith={viewWidth}
      />
    </div>
  );
};

export default Search;
