import useSWR from "swr";
import useAxios from "../../hooks/useAxios";
import { fetchUserReviews } from "../../helpers/api";
import UserReview from "../UserReview";
import { useAuth } from "../../hooks/useAuth";

const UserReviewsSection = ({ userData }) => {
  const { user } = useAuth();
  const { api, isAxiosReady } = useAxios();

  const { data: reviews, isLoading } = useSWR(
    isAxiosReady && userData ? "/api/reviews" : null,
    () => fetchUserReviews(api, userData._id, 1)
  );

  return (
    <section className="flex flex-col w-full gap-4">
      <h1 className="text-sm font-semibold">{`${user?.username === userData?.username ? "Your" : userData?.username} reviews`}</h1>
      <div className="flex w-full flex-wrap gap-2">
        {!isLoading &&
          reviews?.map((review, index) => (
            <UserReview key={index} review={review} />
          ))}
      </div>
    </section>
  );
};

export default UserReviewsSection;
