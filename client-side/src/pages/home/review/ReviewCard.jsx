import React from "react";
import { FaRegCommentDots } from "react-icons/fa";

const ReviewCard = ({ userName, user_photoURL, reviewText }) => {
  return (
    <div className="review-card bg-base-200 shadow-md rounded-lg p-5 h-64 flex flex-col justify-between">
      <div className="text-primary text-2xl mb-3">
        <FaRegCommentDots />
      </div>

      <p className="text-base-content/80 line-clamp-4">{reviewText}</p>

      <hr className="border-dashed border-t border-base-300 my-4" />

      <div className="flex items-center gap-3">
        <img
          src={user_photoURL}
          alt={userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-semibold">{userName}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
