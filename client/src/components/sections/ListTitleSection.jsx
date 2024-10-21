import React from "react";
import listTypes from "../../models/listTypes";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEllipsisV,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import ListPoster from "../ListPoster";
import useConfirm from "../hooks/useConfirm";
import useAxios from "../../hooks/useAxios";
import { useToast } from "../hooks/useToast";

const ListTitleSection = ({
  listData,
  listItems,
  ownerData,
  toggleEditMode,
  isOwner,
}) => {
  const confirm = useConfirm();
  const { toastInfo } = useToast();
  const { api } = useAxios();
  const navigate = useNavigate();

  const handleDeleteList = () => {
    confirm({
      title: "Delete List",
      message: `Are you sure you want to delete the list '${listData?.name}'?`,
      onConfirm: async () => {
        try {
          await api.delete(`/lists/${listData?._id}`);
          toastInfo(`List '${listData?.name}' has been deleted.`);
          navigate(`/${ownerData?.username}`);
        } catch (error) {
          console.error("Failed to delete list.", error);
          toastInfo("Failed to delete list.");
        }
      },
    });
  };

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
            <span className="text-xs text-primary-foreground">
              {listData?.description}
            </span>
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
              <DropdownItem onClick={handleDeleteList}>
                Delete <FontAwesomeIcon icon={faRemove} />
              </DropdownItem>
            </Dropdown>
          </div>
        )}
      </div>
    </section>
  );
};

export default ListTitleSection;
