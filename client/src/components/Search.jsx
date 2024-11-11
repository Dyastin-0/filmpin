import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import SearchInput from "./ui/SearchInput";
import { useAuth } from "../hooks/useAuth";
import useSWR from "swr";
import useAxios from "../hooks/useAxios";
import { fetchSearchQueryResults } from "../helpers/api";
import SearchResultsSection from "./sections/SearchResultsSection";

const Search = ({ isScrollingDown }) => {
  const { api, isAxiosReady } = useAxios();
  const navigate = useNavigate();
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

  const { data: lists } = useSWR(
    isAxiosReady && query
      ? `/lists/search?query=${query}&page=1&limit=20`
      : null,
    () =>
      api.get(`/lists/search/${query}?&page=1`).then((res) => res.data.lists),
    {
      dedupingInterval: 60000,
    }
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

  return (
    <div ref={searchRef} className="relative lg:w-9/12 md:w-full w-full">
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
        lists={lists}
        visible={visible}
        setVisible={setVisible}
      />
    </div>
  );
};

export default Search;
