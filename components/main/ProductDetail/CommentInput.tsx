"use client";

import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";

type TProps = {
  comment: string | null;
  rating: number;
  reviewGivingLoading: boolean;
  setRating: (value: number) => void;
  setComment: (value: string) => void;
  handleAddComment: () => void;
};

const CommentInput = ({
  comment,
  setComment,
  handleAddComment,
  rating,
  setRating,
  reviewGivingLoading,
}: TProps) => {
  return (
    <div className="CommentContainer mb-6">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 pt-4 pb-2">
          <p className="text-sm font-semibold text-gray-700 mb-3">Write your review</p>
          <textarea
            id="comment"
            rows={4}
            value={comment as string}
            onChange={(e) => setComment(e.target.value)}
            className="w-full text-sm text-gray-800 bg-white border-0 outline-none resize-none placeholder-gray-400"
            required
            placeholder="Share your experience with this product…"
          />
        </div>

        <div className="px-5 pb-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Your rating</p>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <FaStar
                  className={`text-xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-200"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-xs text-gray-400 ml-2">{rating}/5</span>
            )}
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {(comment?.length ?? 0) === 0 ? "No characters yet" : `${comment?.length} characters`}
          </span>
          <Button
            disabled={reviewGivingLoading}
            type="submit"
            onClick={handleAddComment}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 text-sm font-semibold"
          >
            {reviewGivingLoading ? "Posting…" : "Post Review"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
