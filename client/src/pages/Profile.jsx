import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ListSection from "../components/sections/ListSection";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import UserBackdropSection from "../components/sections/UserBackdropSection";
import axios from "axios";
import UserInfoSection from "../components/sections/UserInfoSection";

const Profile = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.pathname.slice(1);

  const { data: userData, mutate } = useSWR(
    `/public/account?username=${username}`,
    () =>
      axios
        .get(`/public/account?username=${username}`)
        .then((response) => response.data.user),
    {
      onError: () => navigate("/404"),
    }
  );

  useEffect(() => {
    if (user) mutate();
  }, [user]);

  return (
    <div className="relative flex flex-col items-center p-4 gap-4 w-full h-full bg-primary rounded-md">
      <Helmet>
        <title>{userData?.username}</title>
      </Helmet>
      <UserBackdropSection userData={userData} user={user} />
      <UserInfoSection userData={userData} user={user} />
      <ListSection userData={userData} />
    </div>
  );
};

export default Profile;
