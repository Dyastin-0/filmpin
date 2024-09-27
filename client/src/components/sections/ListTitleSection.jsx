import React from "react";
import listTypes from "../../models/listTypes";
import { Link } from "react-router-dom";
import UserList from "../UserList";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const ListTitleSection = ({
  listData,
  listItems,
  ownerData,
  toggleEditMode,
}) => {
  return (
    <section className="flex lg:flex-row md:flex-row flex-col gap-4">
      <UserList list={{ list: listItems }} />
      <div className="flex justify-end flex-col gap-2">
        <div className="flex gap-2 h-fit w-fit">
          <Dropdown
            name={
              <div className="flex box-border justify-center items-center h-[14px] w-[14px]">
                <FontAwesomeIcon icon={faEllipsisV} />
              </div>
            }
          >
            <DropdownItem onClick={toggleEditMode}>
              Edit <FontAwesomeIcon icon={faEdit} />
            </DropdownItem>
          </Dropdown>
        </div>
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
