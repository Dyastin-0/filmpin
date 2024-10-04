import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import SelectBackdrop from "../SelectBackdrop";
import UserBackdrop from "../UserBackdrop";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../hooks/useModal";

const UserBackdropSection = ({ userData }) => {
  const { setModal, setOpen } = useModal();
  const { token, user } = useAuth();

  return (
    <section className="relative flex justify-center items-center w-full max-h-[400px] rounded-md">
      {/* <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div> */}
      {userData?.backdropPath ? (
        <UserBackdrop
          username={userData.username}
          backdropPath={userData.backdropPath}
        />
      ) : token && userData?._id === user?._id ? (
        <div
          className="relative flex justify-center gap-2 p-4 items-center w-full min-h-[400px] rounded-md hover:cursor-pointer"
          onClick={() => {
            setModal(<SelectBackdrop />);
            setOpen(true);
          }}
        >
          <FontAwesomeIcon
            className="text-primary-foreground text-xl"
            icon={faImage}
          />
          <p className="text-xs text-primary-foreground font-semibold">
            Select a backdrop for your profile
          </p>
        </div>
      ) : (
        <div className="relative flex justify-center gap-2 p-4 items-center w-full min-h-[400px] rounded-md"></div>
      )}
    </section>
  );
};

export default UserBackdropSection;
