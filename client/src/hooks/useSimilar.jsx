import useSWR from "swr";
import useAxios from "./useAxios";
import { fetchDiscovery } from "../helpers/api";

const useSimilar = ({
  type,
  genres,
  page,
  sortBy = "vote_count",
  isResultOnly = true,
}) => {
  const { api, isAxiosReady } = useAxios();

  const { data: similar, isLoading } = useSWR(
    type && isAxiosReady && genres
      ? `/${type}/discover?genres=${genres}&sort_by=${sortBy}&page=${page}`
      : null,
    () =>
      fetchDiscovery(api, type, genres, sortBy, page).then((data) =>
        isResultOnly ? data.results : data
      )
  );

  return { similar, isLoading };
};

export default useSimilar;
