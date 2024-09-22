import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import useAxios from "../../hooks/useAxios";

const ReviewForm = ({ details, mutate }) => {
  const { api } = useAxios();
  const { user } = useAuth();
  const { toastError, toastSuccess } = useToast();
  const [review, setReview] = useState("");

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const response = await api
        .post("/movies/reviews", {
          id: details.id,
          content: review,
        })
        .then((response) => response.data.newReview);
      toastSuccess("Review posted.");
      setReview("");
      mutate();
    } catch (error) {
      toastError(error.response.data.message);
    }
  };

  return (
    <form className="flex gap-4" onSubmit={handlePost}>
      <img
        src={user?.profileImageURL}
        className="w-[30px] h-[30px] rounded-full object-cover"
      />
      <input
        className="outline-none rounded-full w-96 max-w-full h-[30px] bg-secondary text-xs pl-3 pr-3
		placeholder-secondary-foreground"
        placeholder="Write a review"
        type="text"
        value={review}
        onChange={(e) => setReview(e.currentTarget.value)}
      />
    </form>
  );
};

export default ReviewForm;
