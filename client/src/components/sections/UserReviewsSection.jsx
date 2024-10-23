import useSWR from "swr";
import useAxios from "../../hooks/useAxios";
import { fetchUserReviews } from "../../helpers/api";
import UserReview from "../UserReview";

const UserReviewsSection = ({ userData }) => {
  const { api, isAxiosReady } = useAxios();

  const { data, isLoading } = useSWR(
    isAxiosReady && userData ? "/api/reviews" : null,
    () => fetchUserReviews(api, userData._id, 1)
  );

  return (
    <section className="flex flex-col w-full gap-4">
      <h1 className="text-sm font-semibold">Reviews</h1>
      <div className="flex w-full flex-wrap gap-2">
        {!isLoading && data?.reviews?.length > 0 ? (
          data.reviews.map((review, index) => (
            <UserReview key={index} review={review} />
          ))
        ) : (
          <p className="text-xs text-secondary-foreground">No reviews yet.</p>
        )}
      </div>
    </section>
  );
};

export default UserReviewsSection;
