import { motion } from "framer-motion";
import { useModal } from "../hooks/useModal";
import SelectProfile from "../SelectProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faImage } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import { useAuth } from "../../hooks/useAuth";
import SelectBackdrop from "../SelectBackdrop";
import { Image } from "../ui/Image";

const UserInfoSection = ({ userData, user }) => {
  const { token } = useAuth();
  const { setModal, setOpen } = useModal();

  return (
    <motion.section
      initial={{ y: -120 }}
      className="flex gap-4 w-full h-fit p-4"
    >
      <div className="flex flex-col max-w-full items-center gap-4">
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
              className="w-[100px] h-[100px] object-cover rounded-full transition-all duration-300 hover:cursor-pointer hover:opacity-70"
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
        <div>
          <h1 className="text-primary-foreground text-sm font-semibold">
            {userData?.username}
          </h1>
          <h1 className="text-center text-primary-foreground mt-2 text-xs line-clamp-1">
            {userData?.email}
          </h1>
        </div>
      </div>
      {token && userData?._id === user?._id && (
        <div className="absolute top-4 right-4">
          <Dropdown name={<FontAwesomeIcon icon={faEllipsisH} />}>
            <DropdownItem
              onClick={() => {
                setModal(<SelectProfile />);
                setOpen(true);
              }}
            >
              Change profile
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setModal(<SelectBackdrop />);
                setOpen(true);
              }}
            >
              Change background
            </DropdownItem>
          </Dropdown>
        </div>
      )}
    </motion.section>
  );
};

export default UserInfoSection;
