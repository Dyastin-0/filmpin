import { Link } from "react-router-dom";
import ListPoster from "./ListPoster";
import useAxios from "../hooks/useAxios";
import useSWR from "swr";
import { fetchOwner } from "../helpers/api";
import listTypes from "../models/listTypes";

const SearchListResult = ({ list }) => {
  const { api, isAxiosReady } = useAxios();

  const { data: owner } = useSWR(
    isAxiosReady ? `/public/account?id=${list.owner}` : null,
    () => fetchOwner(api, list.owner),
    {
      dedupingInterval: 60000,
    }
  );

  return (
    <Link
      className="flex items-end gap-2 p-2 rounded-md border border-secondary-accent
			transition-all duration-300 outline-none
			hover:cursor-pointer focus:border-primary-highlight hover:border-primary-highlight"
    >
      <ListPoster list={list} multipleSize="45px" />
      <div className="flex flex-col gap-1 text-primary-foreground">
        <p className="text-xs font-semibold text-ellipsis line-clamp-1">
          {list.name}
        </p>
        <p className="text-xs text-ellipsis line-clamp-1">
          {list?.list?.length}{" "}
          {list?.list?.length > 1
            ? listTypes[list?.type]
            : listTypes[list?.type].slice(0, -1)}
        </p>
        <p className="text-xs text-secondary-foreground text-ellipsis line-clamp-1">
          {owner?.username}
        </p>
      </div>
    </Link>
  );
};

export default SearchListResult;
