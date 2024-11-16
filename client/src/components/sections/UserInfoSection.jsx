import { motion } from "framer-motion";
import { useModal } from "../hooks/useModal";
import SelectProfile from "../SelectProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faImage } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import { useAuth } from "../../hooks/useAuth";
import SelectBackdrop from "../SelectBackdrop";
import { Image } from "../ui/Image";

const UserInfoSection = ({ userData }) => {
  const { token, user } = useAuth();
  const { setModal, setOpen } = useModal();

  return (
    <motion.section
      className="flex gap-4 p-4 bg-primary rounded-md h-fit
    lg:w-fit md:w-fit w-full"
    >
      <div className="flex flex-col max-w-full items-center gap-2">
        {userData?.profileImageURL ? (
          <div className="flex flex-col justify-center items-center gap-2">
            <img
              alt={`${userData.username} profile image`}
              src={userData.profileImageURL}
              onClick={() => {
                setModal(
                  <Image
                    imageURL={userData?.profileImageURL}
                    name={userData?.username}
                  />
                );
                setOpen(true);
              }}
              className=" object-cover rounded-full
              lg:w-[150px] lg:h-[150px] md:w-[100px] md:h-[100px] w-[80px] h-[80px]
              shadow-[var(--accent)_0_0_0_2px]
              transition-all duration-300 hover:cursor-pointer hover:opacity-90"
            />
          </div>
        ) : (
          <div
            className="flex justify-center items-center
            lg:w-[150px] lg:h-[150px] md:w-[130px] md:h-[130px] w-[100px] h-[100px]
            rounded-full bg-secondary hover:cursor-pointer"
            onClick={() => {
              setModal(<SelectProfile />);
              setOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faImage} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-primary-foreground text-md font-semibold text-ellipsis line-clamp-1">
              {userData?.username}
            </h1>
            <h1 className="text-center text-primary-foreground text-xs text-ellipsis line-clamp-1">
              {userData?.email}
            </h1>
          </div>
          {token && userData?._id === user?._id && (
            <div>
              <Dropdown
                name={
                  <div className="flex box-border justify-center items-center h-[14px] w-[14px]">
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </div>
                }
              >
                <DropdownItem
                  onClick={() => {
                    setModal(<SelectProfile />);
                    setOpen(true);
                  }}
                >
                  Change profile picture
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setModal(<SelectBackdrop />);
                    setOpen(true);
                  }}
                >
                  Change backdrop
                </DropdownItem>
              </Dropdown>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default UserInfoSection;
