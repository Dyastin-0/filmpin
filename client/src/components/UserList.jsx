import { useNavigate } from "react-router-dom";
import ListPoster from "./ListPoster";

const UserList = ({ list }) => {
  const navigate = useNavigate();

  const handleClick = (listParam) => {
    navigate(`/list?list_id=${list._id}`);
  };

  return (
    <div
      className="flex flex-col rounded-lg drop-shadow-sm gap-4 p-4 w-[200px] h-fit
			text-primary-foreground border border-secondary-accent
			transition-all duration-300
			hover:cursor-pointer hover:scale-95"
      onClick={() => handleClick(list)}
    >
      {list?.name && (
        <h1 className="text-xs text-center text-primary-foreground font-semibold line-clamp-1">
          {list.name}
        </h1>
      )}
      <ListPoster list={list} />
    </div>
  );
};

export default UserList;
