import React from "react";
import listTypes from "../../models/listTypes";
import { Link } from "react-router-dom";
import UserList from "../UserList";

const ListTitleSection = ({ listData, listItems, ownerData }) => {
  return (
    <section className="flex gap-4 w-full">
      <UserList list={{ list: listItems }} />
      <div className="flex justify-end flex-col gap-2">
        <h1 className="text-md text-primary-foreground font-semibold">
          {listData?.name}
        </h1>
        <p className="text-xs text-secondary-foreground">
          Description:
          <br />
          <span className="text-xs text-primary-foreground">
            {listData?.description}
          </span>
        </p>
        <div className="flex gap-1">
          <h1 className="text-xs text-primary-foreground">{`List of ${
            listTypes[listData?.type]
          } by`}</h1>
          <Link
            className="w-fit outline-none text-primary-foreground text-xs transition-colors duration-300 underline hover:text-primary-highlight focus:text-primary-highlight"
            to={`/${ownerData?.username}`}
          >
            {ownerData?.username}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ListTitleSection;
