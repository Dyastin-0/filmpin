import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import useSWR from "swr";
import { fetchReviews } from "../../helpers/api";
import Review from "../Review";
import Pagination from "../ui/Pagination";
import ReviewForm from "../forms/ReviewForm";

const MovieReviewSection = ({ details }) => {
  const { api, isAxiosReady } = useAxios();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, mutate } = useSWR(
    isAxiosReady && details
      ? `/movies/reviews?id=${details.id}title=${
          details.title || details.name
        }&page=${currentPage}`
      : null,
    () =>
      fetchReviews(api, details.id, details.title || details.name, currentPage)
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="flex flex-col w-full rounded-lg gap-4 p-4">
      <h1 className="text-primary-foreground text-sm font-semibold">Reviews</h1>
      <div className="flex flex-col gap-4">
        {data?.reviews.map((review, index) => (
          <Review
            key={index}
            review={review}
            details={details}
            mutate={mutate}
          />
        ))}
      </div>
      {data?.total_pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data?.total_pages}
          onPageChange={onPageChange}
        />
      )}
      <ReviewForm details={details} mutate={mutate} />
    </section>
  );
};

export default MovieReviewSection;
