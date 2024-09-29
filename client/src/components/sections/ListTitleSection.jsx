import React from "react";
import listTypes from "../../models/listTypes";
import { Link } from "react-router-dom";
import UserList from "../UserList";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import ListPoster from "../ListPoster";

const ListTitleSection = ({
  listData,
  listItems,
  ownerData,
  toggleEditMode,
}) => {
  return (
    <section className="flex lg:flex-row md:flex-row flex-col gap-4">
      <div className="w-[165.79px]">
        <ListPoster list={{ list: listItems }} />
      </div>
      <div className="flex text-primary-foreground justify-end flex-col gap-2">
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
        <h1 className="text-md font-semibold">{listData?.name}</h1>
        {listData?.description && (
          <p className="text-xs text-secondary-foreground">
            Description:
            <br />
            <span className="text-xs">{listData?.description}</span>
          </p>
        )}
        <div className="flex items-center gap-1">
          <Link
            className="w-fit outline-none text-primary-foreground text-xs
            font-semibold underline
            transition-colors duration-300
            hover:text-primary-highlight focus:text-primary-highlight"
            to={`/${ownerData?.username}`}
          >
            {ownerData?.username}
          </Link>
          &#8226;
          <span className="text-xs">{`${listItems?.length} ${listTypes[
            listData?.type
          ].toLowerCase()}`}</span>
        </div>
      </div>
    </section>
  );
};

export default ListTitleSection;
