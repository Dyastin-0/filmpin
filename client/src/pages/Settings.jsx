import { useAuth } from "../hooks/useAuth";
import UserInfoSection from "../components/sections/UserInfoSection";
import PasswordSection from "../components/sections/PasswordSection";
import DeleteAccountSection from "../components/sections/DeleteAccountSection";
import { Helmet } from "react-helmet";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="relative flex lg:flex-row md:flex-row flex-col gap-4 w-full h-full">
      <Helmet>
        <title>Account Settings</title>
      </Helmet>
      <UserInfoSection userData={user} />
      <div className="flex flex-col w-full h-full bg-primary rounded-md gap-4 p-4">
        <h1 className="text-md text-center font-bold">Settings</h1>
        <PasswordSection />
        <DeleteAccountSection />
      </div>
    </div>
  );
};

export default Settings;
