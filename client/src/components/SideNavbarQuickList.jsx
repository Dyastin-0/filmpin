import ListPoster from "./ListPoster";
import { Link } from "react-router-dom";

const SideNavbarQuickList = ({ list, close }) => {
  return (
    <div
      className="flex flex-col h-full w-full items-center gap-4 top-4 bg-primary rounded-md
    overflow-hidden"
    >
      <p className="text-xs text-primary-foreground font-bold">Your lists</p>
      <ul
        className="flex flex-col max-w-full items-center gap-4 p-4 w-full h-full
      overflow-y-scroll scrollbar-thin scrollbar-track-primary scrollbar-thumb-secondary-accent"
      >
        {list &&
          list.length > 0 &&
          list.map((item, index) => (
            <Link
              key={index}
              to={`/lists/${item._id}`}
              onClick={() => close(false)}
            >
              <li
                className="flex flex-col p-4 gap-2 items-center max-w-[134.21px] rounded-md border
								border-secondary-accent
								transition-all duration-300 text-xs text-primary-foreground
								hover:cursor-pointer hover:border-primary-highlight"
              >
                <ListPoster
                  list={item}
                  singleSize="100px"
                  multipleSize="100px"
                />
                <span>{item.name}</span>
              </li>
            </Link>
          ))}
      </ul>
    </div>
  );
};

export default SideNavbarQuickList;
