const ListPoster = ({ list, singleSize, multipleSize = "250px" }) => {
  return (
    <>
      {list?.list?.length >= 4 ? (
        <div
          className={`flex flex-wrap overflow-hidden rounded-md bg-black w-[${singleSize}]`}
        >
          <img
            className=" w-1/2"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w200/${list?.list[0]?.poster_path}`}
            alt={`${list?.list[0]?.title || list?.list[0]?.name} poster `}
          />
          <img
            className=" w-1/2"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w200/${list?.list[1]?.poster_path}`}
            alt={`${list?.list[1]?.title || list?.list[1]?.name} poster `}
          />
          <img
            className=" w-1/2"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w200/${list?.list[2]?.poster_path}`}
            alt={`${list?.list[2]?.title || list?.list[2]?.name} poster `}
          />
          <img
            className=" w-1/2"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w200/${list?.list[3]?.poster_path}`}
            alt={`${list?.list[3]?.title || list?.list[3]?.name} poster `}
          />
        </div>
      ) : (
        <img
          className={`rounded-md w-[${multipleSize}]`}
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w200/${list?.list[0]?.poster_path}`}
          alt={`${list?.list[0]?.title || list?.list[0]?.name} poster `}
        />
      )}
    </>
  );
};

export default ListPoster;
