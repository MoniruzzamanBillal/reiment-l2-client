import { Button } from "./button";

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
    <div className="CommentContainer  ">
      <div className="w-full mb-4 border border-gray-300 bg-gray-50   rounded-md ">
        <div className="px-4 py-2    ">
          <label htmlFor="comment" className="sr-only">
            Your comment
          </label>
          <textarea
            id="comment"
            rows={5}
            value={comment as string}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-0 text-sm text-gray-900 bg-gray-50  border-none outline-none  "
            required
            placeholder="Write a comment..."
          ></textarea>
        </div>

        {/* Rating Section */}
        <div className="px-4 py-2">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Rating (1-5)
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t  ">
          <Button
            disabled={reviewGivingLoading}
            type="submit"
            onClick={() => handleAddComment()}
            className=" text-sm font-medium  text-white bg-prime50 rounded-md  hover:bg-prime100 "
          >
            Post comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
