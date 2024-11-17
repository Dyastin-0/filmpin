import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ListSection from "../components/sections/ListSection";
import useSWR from "swr";
import { Helmet } from "react-helmet";
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
    <div className="relative flex lg:flex-row md:flex-row flex-col gap-4 w-full h-full">
      <Helmet>
        <title>{userData?.username}</title>
      </Helmet>
      <UserInfoSection userData={userData} />
      <div className="flex flex-col w-full bg-primary rounded-md p-4 gap-4">
        <ListSection userData={userData} />
        <UserReviewsSection userData={userData} />
      </div>
    </div>
  );
};

export default Profile;
