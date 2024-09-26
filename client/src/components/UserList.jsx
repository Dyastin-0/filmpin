import { useNavigate } from "react-router-dom";

const UserList = ({ list }) => {
  const navigate = useNavigate();

  const handleClick = (listParam) => {
    navigate(`/list?list_id=${list._id}`, { state: { list: listParam } });
  };

  return (
    <div
      className="flex flex-col rounded-lg drop-shadow-sm gap-4 p-4 max-w-[200px] h-fit
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
      {list?.list?.length >= 4 ? (
        <div className="flex flex-wrap h-[240px] overflow-hidden rounded-md bg-black">
          <img
            className="h-[120px] w-1/2"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w200/${list?.list[0]?.poster_path}`}
            alt={`${list?.list[0]?.title || list?.list[0]?.name} poster `}
          />
          <img
            className="h-[120px] w-1/2"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w200/${list?.list[1]?.poster_path}`}
            alt={`${list?.list[1]?.title || list?.list[1]?.name} poster `}
          />
          <img
            className="h-[120px] w-1/2"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w200/${list?.list[2]?.poster_path}`}
            alt={`${list?.list[2]?.title || list?.list[2]?.name} poster `}
          />
          <img
            className="h-[120px] w-1/2"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w200/${list?.list[3]?.poster_path}`}
            alt={`${list?.list[3]?.title || list?.list[3]?.name} poster `}
          />
        </div>
      ) : (
        <img
          className="rounded-md"
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w200/${list?.list[0]?.poster_path}`}
          alt={`${list?.list[0]?.title || list?.list[0]?.name} poster `}
        />
      )}
    </div>
  );
};

export default UserList;
