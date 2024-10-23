import useSWR from "swr";
import useAxios from "../../hooks/useAxios";
import { fetchUserReviews } from "../../helpers/api";
import UserReview from "../UserReview";
import { useState, useEffect } from "react";

const UserReviewsSection = ({ userData }) => {
  const { api, isAxiosReady } = useAxios();
  const [firstColumnReviews, setFirstColumnReviews] = useState([]);
  const [secondColumnReviews, setSecondColumnReviews] = useState([]);

  const { data, isLoading } = useSWR(
    isAxiosReady && userData ? "/api/reviews" : null,
    () => fetchUserReviews(api, userData._id, 1)
  );

  useEffect(() => {
    if (data) {
      const firstColumn = [];
      const secondColumn = [];

      data.reviews.forEach((review, index) => {
        if (index % 2 === 0) {
          firstColumn.push(<UserReview key={index} review={review} />);
        } else {
          secondColumn.push(<UserReview key={index} review={review} />);
        }
      });

      setFirstColumnReviews(firstColumn);
      setSecondColumnReviews(secondColumn);
    }
  }, [data]);

  return (
    <section className="flex flex-col w-full gap-4">
      <h1 className="text-sm font-semibold">Reviews</h1>
      <div className="flex lg:flex-row md:flex-row flex-col w-full gap-2">
        <div className="flex lg:w-1/2 md:w-1/2 w-full items-start flex-col gap-2">
          {firstColumnReviews}
        </div>
        <div className="flex lg:w-1/2 md:w-1/2 w-full items-start flex-col gap-2">
          {secondColumnReviews}
        </div>
      </div>
    </section>
  );
};

export default UserReviewsSection;
