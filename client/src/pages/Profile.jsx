import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ListSection from "../components/sections/ListSection";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import UserBackdropSection from "../components/sections/UserBackdropSection";
import axios from "axios";
import UserInfoSection from "../components/sections/UserInfoSection";
import UserReviewsSection from "../components/sections/UserReviewsSection";

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
        .then((response) => response.data.user)
        .catch(() => {
          navigate("/404");
        })
  );

  useEffect(() => {
    if (user) mutate();
  }, [user]);

  return (
    <div className="relative flex flex-col items-center p-4 gap-4 lg:w-[1100px] md:w-full w-full max-w-full h-full bg-primary rounded-md self-center">
      <Helmet>
        <title>{userData?.username}</title>
      </Helmet>
      <UserBackdropSection userData={userData} />
      <div className="flex flex-col w-full gap-4 p-4">
        <UserInfoSection userData={userData} />
        <ListSection userData={userData} />
        <UserReviewsSection userData={userData} />
      </div>
    </div>
  );
};

export default Profile;
