import useSWR from "swr";
import { fetchOwner } from "../helpers/api";
import useAxios from "./useAxios";

const useOwnerInfo = ({ id }) => {
  const { api, isAxiosReady } = useAxios();

  const { data: ownerInfo } = useSWR(
    id && isAxiosReady ? `/public/account?id=${id}` : null,
    () => fetchOwner(api, id),
    {
      dedupingInterval: 60000,
    }
  );

  return { ownerInfo };
};

export default useOwnerInfo;
