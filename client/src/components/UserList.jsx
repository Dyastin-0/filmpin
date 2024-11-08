import { useNavigate } from "react-router-dom";
import ListPoster from "./ListPoster";
import dayjs from "dayjs";

const UserList = ({ list }) => {
  const navigate = useNavigate();

  const handleClick = (listParam) => {
    navigate(`/lists/${list._id}`);
  };

  return (
    <div
      className="flex flex-col rounded-lg drop-shadow-sm gap-4 p-4 w-[200px] h-fit
			text-primary-foreground border border-secondary-accent
			transition-all duration-300
			hover:cursor-pointer"
      onClick={() => handleClick(list)}
    >
      {list && (
        <h1 className="text-xs text-center text-primary-foreground font-semibold line-clamp-1">
          {list.name}
        </h1>
      )}
      <ListPoster list={list} />
      {list && (
        <span className="text-xs text-secondary-foreground">
          {dayjs.unix(list.created_on / 1000).fromNow()}
        </span>
      )}
    </div>
  );
};

export default UserList;
