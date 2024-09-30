import React from "react";
import listTypes from "../../models/listTypes";
import { Link } from "react-router-dom";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import ListPoster from "../ListPoster";

const ListTitleSection = ({
  listData,
  listItems,
  ownerData,
  toggleEditMode,
  isOwner,
}) => {
  return (
    <section className="flex lg:flex-row md:flex-row flex-col gap-4">
      <div className="w-[165.79px]">
        <ListPoster list={{ list: listItems }} />
      </div>
      <div className="flex text-primary-foreground flex-col gap-2">
        <h1 className="text-4xl font-bold">{listData?.name}</h1>
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
          <span className="text-xs">{`${listItems?.length} ${
            listItems?.length > 1
              ? listTypes[listData?.type].toLowerCase()
              : listTypes[listData?.type].toLowerCase().slice(0, -1)
          }`}</span>
        </div>
        {isOwner && (
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
        )}
      </div>
    </section>
  );
};

export default ListTitleSection;
