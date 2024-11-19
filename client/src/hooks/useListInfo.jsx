import useSWR from "swr";
import { fetchList } from "../helpers/api";
import useAxios from "./useAxios";

const useListInfo = ({ id }) => {
  const { api, isAxiosReady } = useAxios();

  const {
    data: listInfo,
    error,
    isLoading,
    isValidating,
  } = useSWR(
    isAxiosReady && id ? `/lists/${id}` : null,
    () => fetchList(api, id),
    {
      dedupingInterval: 60000,
    }
  );

  return {
    listInfo,
    error,
    isLoading,
    isValidating,
  };
};

export default useListInfo;
