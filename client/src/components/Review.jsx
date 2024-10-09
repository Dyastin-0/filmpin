import axios from "axios";
import useSWR from "swr";
import { fetchOwner } from "../helpers/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useToast } from "./hooks/useToast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useRef, useEffect } from "react";

dayjs.extend(relativeTime);

const Review = ({ review, details }) => {
  const { api } = useAxios();
  const { user } = useAuth();
  const { toastInfo } = useToast();
  const { created_on, content, owner, hearts } = review;
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const { data: ownerData } = useSWR(
    review ? `/public/account?id=${owner}` : null,
    () => fetchOwner(axios, owner),
    {
      dedupingInterval: 60000,
    }
  );

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    }
  }, [content]);

  const handleLike = async () => {
    try {
      const response = await api.post(
        `/reviews/like?id=${details.id}&title=${details.title}&owner=${ownerData._id}`
      );
    } catch (error) {
      toastInfo(error.response.data.message);
    }
  };

  const isOwner = ownerData?.username === user?.username;
  const hasLiked = hearts?.includes(user?._id);

  return (
    <div className="flex lg:w-1/2 md:w-1/2 w-full flex-col gap-2">
      <div className="tex-xs p-4 rounded-md w-fit max-w-full border border-secondary-accent">
        <div className="flex gap-2">
          <img
            src={ownerData?.profileImageURL}
            className="w-[30px] h-[30px] rounded-full object-cover"
          />
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-col rounded-md gap-2">
              <div className="flex gap-2">
                <Link
                  to={`/${ownerData?.username}`}
                  className="text-primary-foreground text-xs font-semibold
                outline-none transition-all duration-300 focus:text-primary-highlight hover:text-primary-highlight"
                >
                  {isOwner && ownerData && user ? "You" : ownerData?.username}
                </Link>
                <span className="text-xs text-secondary-foreground">
                  {dayjs.unix(created_on / 1000).fromNow()}
                </span>
              </div>
              <span
                ref={contentRef}
                className={`text-primary-foreground text-xs whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-2"}`}
              >
                {content}
              </span>
              {isOverflowing && (
                <button
                  className="w-fit text-xs text-primary-foreground underline outline-none
                  transition-all duration-300
                  focus:text-primary-highlight hover:text-primary-highlight hover:cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isOwner && ownerData && user ? (
        <div className="flex gap-2">
          <button
            className="flex text-primary-foreground items-center outline-none
            transition-all duration-300
            hover:text-primary-highligh focus:text-primary-highlightt hover:cursor-pointer"
            onClick={handleLike}
          >
            <FontAwesomeIcon icon={hasLiked ? faSolidHeart : faRegularHeart} />
          </button>
          <span className="text-xs text-primary-foreground">
            {hearts?.length}
          </span>
        </div>
      ) : (
        <div className="flex gap-2">
          <span className="flex text-primary-foreground">
            <FontAwesomeIcon icon={faSolidHeart} />
          </span>
          <span className="text-xs text-primary-foreground">
            {hearts?.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default Review;
