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
      initial={{ y: -70 }}
      className="flex gap-4 w-full h-fit z-20"
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
              className="w-[150px] h-[150px] object-cover rounded-full
              shadow-[var(--accent)_0_0_0_2px]
              transition-all duration-300 hover:cursor-pointer hover:opacity-90"
            />
          </div>
        ) : (
          <div
            className="flex justify-center items-center w-[100px] h-[100px] rounded-full bg-secondary hover:cursor-pointer"
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
            <h1 className="text-primary-foreground text-md font-semibold">
              {userData?.username}
            </h1>
            <h1 className="text-center text-primary-foreground text-xs line-clamp-1">
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
