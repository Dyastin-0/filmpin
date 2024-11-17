import { Link } from "react-router-dom";
import ListPoster from "./ListPoster";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const UserList = ({ list }) => {
  return (
    <Link
      className="flex flex-col rounded-lg drop-shadow-sm gap-4 p-4 w-[200px] h-fit
			text-primary-foreground border border-secondary-accent
			transition-all duration-300
			hover:cursor-pointer hover:border-primary-highlight"
      to={`/lists/${list._id}`}
    >
      {list && (
        <>
          <h1 className="text-xs text-center text-primary-foreground font-semibold line-clamp-1">
            {list.name}
          </h1>
          <ListPoster list={list} />
          <span className="text-xs text-center text-secondary-foreground">
            {dayjs.unix(list.created_on / 1000).fromNow()}
          </span>
        </>
      )}
    </Link>
  );
};

export default UserList;
