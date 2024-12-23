import { useNavigate } from "react-router-dom";
import { useModal } from "../hooks/useModal";
import SelectProfile from "../SelectProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { Image } from "../ui/Image";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

const UserInfoSection = ({ userData }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setModal, setOpen } = useModal();

  const isOwner = userData?._id === user?._id;

  return (
    <section
      className="flex gap-4 p-4 bg-primary rounded-md h-fit
    lg:w-fit md:w-fit w-full justify-center"
    >
      <div className="flex lg:flex-col md:flex-col flex-row max-w-full items-center gap-4">
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
              lg:min-w-[150px] lg:min-h-[150px] md:min-w-[130px] md:min-h-[130px] min-w-[100px] min-h-[100px]
              lg:max-w-[150px] lg:max-h-[150px] md:max-w-[130px] md:max-h-[130px] max-w-[100px] max-h-[100px]
              shadow-[var(--accent)_0_0_0_2px]
              transition-all duration-300 hover:cursor-pointer hover:opacity-90"
            />
          </div>
        ) : (
          <div
            className="flex justify-center items-center
            lg:max-h[150px] lg:max-w-[150px] md:max-h-[130px] md:max-w-[130px] max-h-[100px] max-w-[100px]
            lg:min-w-[150px] lg:min-h-[150px] md:min-w-[130px] md:min-h-[130px] min-w-[100px] min-h-[100px]
            rounded-full bg-secondary hover:cursor-pointer"
            onClick={() => {
              setModal(<SelectProfile />);
              setOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faImage} />
          </div>
        )}
        <div className="flex flex-col overflow-hidden p-1 gap-2">
          <div>
            <h1 className="text-primary-foreground text-md font-semibold truncate">
              {userData?.username}
            </h1>
            <h1 className="text-center text-primary-foreground text-xs truncate">
              {userData?.email}
            </h1>
          </div>
          {isOwner && (
            <Button
              text="Edit profile"
              onClick={() => navigate("/settings/profile")}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default UserInfoSection;
