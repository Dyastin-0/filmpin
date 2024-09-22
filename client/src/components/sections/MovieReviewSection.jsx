import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useSWR from "swr";
import { fetchReviews } from "../../helpers/api";
import Review from "../Review";
import Pagination from "../ui/Pagination";
import ReviewForm from "../forms/ReviewForm";
import { io } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth";

const MovieReviewSection = ({ details }) => {
  const { token } = useAuth();
  const { api } = useAxios();
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState(null);

  useEffect(() => {
    details &&
      fetchReviews(
        api,
        details.id,
        details.title || details.name,
        currentPage
      ).then((response) => setData(response));
  }, [details]);

  useEffect(() => {
    if (details) {
      const randomId = crypto.randomUUID();
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
        query: {
          randomId: randomId,
          itemId: details.id,
          targetStream: "review",
        },
      });

      newSocket.on(`stream/review/${details.id}/${randomId}`, (change) => {
        if (change.type === "delete")
          setData((prevReviews) =>
            prevReviews.reviews.filter((review) => review._id !== change.review)
          );
        if (change.type === "insert")
          setData((prevReviews) => ({
            ...prevReviews,
            reviews: [...prevReviews.reviews, change.newReview],
          }));
        if (change.type === "update") {
          setData((prevReviews) => {
            return {
              ...prevReviews,
              reviews: prevReviews.reviews.map((review) =>
                review._id === change.key._id
                  ? { ...review, hearts: change.newReview }
                  : review
              ),
            };
          });
        }
      });
      return () => newSocket.disconnect();
    }
  }, [details]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="flex flex-col w-full rounded-lg gap-4 p-4">
      <h1 className="text-primary-foreground text-sm font-semibold">Reviews</h1>
      <div className="flex flex-col gap-4">
        {data?.reviews?.map((review, index) => (
          <Review key={index} review={review} details={details} />
        ))}
      </div>
      {data?.total_pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data?.total_pages}
          onPageChange={onPageChange}
        />
      )}
      <ReviewForm details={details} />
    </section>
  );
};

export default MovieReviewSection;
