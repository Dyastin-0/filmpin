import { Helmet } from "react-helmet";
import UserInfoSection from "../components/sections/UserInfoSection";
import { useAuth } from "../hooks/useAuth";
import UsernameSection from "../components/sections/UsernameSection";
import ProfilePhotoSection from "../components/sections/ProfilePhotoSection";

const ProfileSettings = () => {
  const { user } = useAuth();

  return (
    <div className="relative flex lg:flex-row md:flex-row flex-col gap-4 w-full h-full">
      <Helmet>
        <title>Account Settings</title>
      </Helmet>
      <UserInfoSection userData={user} />
      <div className="flex flex-col w-full h-full bg-primary rounded-md gap-4 p-4">
        <h1 className="text-md text-center font-bold">Public Profile</h1>
        <UsernameSection />
        <ProfilePhotoSection />
      </div>
    </div>
  );
};

export default ProfileSettings;
