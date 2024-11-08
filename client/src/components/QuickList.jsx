import React from "react";
import ListPoster from "./ListPoster";
import { Link } from "react-router-dom";

const QuickList = ({ list }) => {
  return (
    <div className="sticky flex flex-col items-center gap-4 top-4 p-4 w-[200px] h-fit bg-primary rounded-md">
      <p className="text-xs text-primary-foreground font-semibold">
        Your lists
      </p>
      <ul className="flex flex-col items-center gap-4">
        {list &&
          list.length > 0 &&
          list.map((item) => (
            <Link to={`/lists/${item._id}`}>
              <li
                className="flex flex-col p-4 gap-2 items-center max-w-[134.21px] rounded-md border border-secondary-accent
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

export default QuickList;
