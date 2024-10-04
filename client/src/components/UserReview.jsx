import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

dayjs.extend(relativeTime);

const UserReview = ({ review }) => {
  const { created_on, content, hearts } = review;
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    }
  }, [content]);

  return (
    <div className="flex lg:w-[500px] md:w-[400px] sm:w-full flex-col gap-2">
      <div className="tex-xs p-4 rounded-md w-full border border-secondary-accent">
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-col rounded-md gap-2">
            <div className="flex gap-2">
              <div className="text-xs text-primary-foreground font-semibold">
                {review.title}
              </div>
              <span className="text-xs text-secondary-foreground">
                {dayjs.unix(created_on / 1000).fromNow()}
              </span>
              <span className="text-xs">{review.hearts.length}</span>
              <FontAwesomeIcon size="xs" icon={faHeart} />
            </div>
            <span
              ref={contentRef}
              className={`text-primary-foreground text-xs whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-1"}`}
            >
              {content}
            </span>
            {isOverflowing && (
              <button
                className="text-xs text-primary-highlight"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReview;
