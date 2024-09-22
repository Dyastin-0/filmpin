import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import useAxios from "../../hooks/useAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";

const ReviewForm = ({ details }) => {
  const { api } = useAxios();
  const { user } = useAuth();
  const { toastError, toastSuccess } = useToast();
  const [review, setReview] = useState("");
  const textareaRef = useRef(null);

  const handlePost = async (e) => {
    e.preventDefault();

    if (!review) return toastError("Review cannot be empty.");

    try {
      const response = await api
        .post("/reviews", {
          id: details.id,
          title: details.title || details.name,
          content: review,
        })
        .then((response) => response.data.newReview);
      toastSuccess("Review posted.");
      setReview("");
      textareaRef.current.style.height = "auto";
    } catch (error) {
      toastError(error.response.data.message);
    }
  };

  return (
    <div className="flex lg:w-1/2 md:w-1/2 w-full gap-2">
      <img
        src={user?.profileImageURL}
        className="w-[30px] h-[30px] rounded-full object-cover"
      />
      <form
        className="flex flex-col w-full rounded-md bg-secondary p-4"
        onSubmit={handlePost}
      >
        <textarea
          ref={textareaRef}
          rows="1"
          className="outline-none rounded-md bg-secondary text-xs resize-none
		    placeholder-secondary-foreground text-primary-foreground scrollbar-none"
          placeholder="Write a review..."
          type="text"
          value={review}
          onChange={(e) => {
            const textarea = textareaRef.current;
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
            setReview(e.currentTarget.value);
          }}
        />
        <button
          className="outline-none text-md text-primary-foreground w-fit h-fit self-end
        transition-all duration-300 focus:text-primary-highlight hover:text-primary-highlight"
          type="submit"
        >
          <FontAwesomeIcon icon={faReply} />
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
