import React from "react";
import ListPoster from "./ListPoster";
import { Link } from "react-router-dom";

const SideNavbarQuickList = ({ list, close }) => {
  return (
    <div className="flex flex-col items-center gap-2 top-4 pl-4 pr-4 pb-4 bg-primary rounded-md">
      <p className="text-xs text-primary-foreground font-semibold">
        Your lists
      </p>
      <ul className="flex flex-col max-w-full items-center gap-4">
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
