import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const MovieCommentSection = ({ comments }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");

  const handlePost = (user) => {};

  return (
    <section className="flex flex-col rounded-lg gap-4 p-4 w-[calc(100%-2rem)]">
      <h1 className="text-primary-foreground text-sm font-semibold">
        Comments
      </h1>
      <input
        className="outline-none rounded-full w-96 max-w-full h-8 bg-secondary text-xs pl-3 pr-3
				placeholder-secondary-foreground"
        placeholder="Write a comment"
        type="text"
        onChange={(e) => setComment(e.currentTarget.value)}
      />
    </section>
  );
};

export default MovieCommentSection;
