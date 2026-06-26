"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "sonner";

type TReview = {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; username: string; profileImg: string };
};

const UserCommentCard = ({ review }: { review: TReview }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review.comment);
  const user = useAuthStore((s) => s.user);

  const { refetch: productDataRefetch } = useFetchData(
    ["product", review.productId],
    `/product/get-product/${review.productId}`,
    { enabled: !!review.productId }
  );

  const { mutateAsync: updateReviewMutate, isPending: reviewUpdateLoading } =
    usePatch([["product", review.productId]]);

  const handleSaveClick = async () => {
    try {
      const toastId = toast.loading("Updating Review…");
      const result: any = await updateReviewMutate({
        url: "/review/update-review",
        payload: { reviewId: review.id, comment: editedContent },
      });
      if (result?.data) {
        productDataRefetch();
        setIsEditing(false);
        toast.success(result.data.message, { id: toastId, duration: 1000 });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update review", {
        duration: 1400,
      });
    }
  };

  return (
    <>
      {reviewUpdateLoading && <FormSubmitLoading />}
      <div className="UserCommentCardContainer my-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
              <Image
                src={review.user.profileImg || "/placeholder.svg"}
                alt={review.user.username}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {review.user.username}
              </p>
              <p className="text-xs text-gray-400">
                {format(new Date(review.createdAt), "dd MMM yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {Array.from({ length: 5 }, (_, i) =>
              i < review.rating ? (
                <FaStar key={i} className="text-yellow-400 text-xs" />
              ) : (
                <FaRegStar key={i} className="text-gray-200 text-xs" />
              )
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 leading-relaxed mb-3">
          {isEditing ? (
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 w-full text-sm focus:border-indigo-400 outline-none"
            />
          ) : (
            <p>{review.comment}</p>
          )}
        </div>

        {review.user.id === user?.userId && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveClick}
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium hover:bg-indigo-100 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(review.comment);
                  }}
                  className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Edit review
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UserCommentCard;
