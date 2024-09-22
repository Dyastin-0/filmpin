import axios from "axios";
import useSWR from "swr";
import { fetchOwner } from "../helpers/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";

const Review = ({ review }) => {
  const { user } = useAuth();
  const { created_on, content, owner } = review;

  const { data: ownerData } = useSWR(
    review ? `/public/account?id=${owner}` : null,
    () => fetchOwner(axios, owner)
  );

  const isOwner = ownerData?.username === user?.username;

  return (
    <div className="flex items-start tex-xs rounded-md w-fit max-w-full">
      <div className="flex gap-2">
        <img
          src={ownerData?.profileImageURL}
          className="w-[30px] h-[30px] rounded-full object-cover"
        />
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-col bg-secondary rounded-md p-2 gap-2">
            <div className="flex gap-2">
              <h1 className="text-primary-foreground text-xs font-semibold">
                {isOwner ? "You" : ownerData?.username}
              </h1>
              <span className="text-xs text-secondary-foreground">
                {new Date(created_on).toLocaleString()}
              </span>
            </div>
            <span className="text-primary-foreground text-xs">{content}</span>
          </div>
          {!isOwner && <FontAwesomeIcon icon={faHeart} />}
        </div>
      </div>
    </div>
  );
};

export default Review;
