import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { format } from "date-fns";
import { UseGetUser } from "@/utils/SharedFunction";
import { useUpdateReviewMutation } from "@/redux/features/review/review.api";
import { toast } from "sonner";
import FormSubmitLoading from "./FormSubmitLoading";
import { useGetSingleProductsQuery } from "@/redux/features/product/product.api";

const UserCommentCard = ({ review }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review?.comment);

  const [updateReview, { isLoading: reviewUpdateLoading }] =
    useUpdateReviewMutation();

  const { refetch: productDataRefetch } = useGetSingleProductsQuery(
    review?.productId,
    { skip: !review?.productId }
  );

  const userInfo = UseGetUser();

  //   console.log(userInfo);

  // console.log(review);
  // console.log(review);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  // ! for updating comment
  const handleSaveClick = async () => {
    console.log(editedContent);
    console.log(review?.id);

    try {
      const payload = { reviewId: review?.id, comment: editedContent };

      const taostId = toast.loading("Updating Review....");
      const result = await updateReview(payload);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: taostId,
          duration: 1400,
        });
      }

      // * for successful insertion
      if (result?.data) {
        productDataRefetch();
        setIsEditing(false);
        const successMsg = result?.data?.message;

        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating profile!!!", {
        duration: 1400,
      });
    }
  };

  // ! for canceling updadteing edit
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent(review?.comment);
  };

  //   ! fucntion for rendering star
  const renderStars = () => {
    const totalLength = 5;
    const filledStars = review?.rating || 0;

    return Array.from({ length: totalLength }, (_, index) => (
      <FaStar
        key={index}
        className={`  ${
          index < filledStars ? "text-orange-400" : "text-gray-500"
        }`}
      />
    ));
  };

  return (
    <>
      {reviewUpdateLoading && <FormSubmitLoading />}

      <div className="UserCommentCardContainer  my-3 p-3 rounded-md bg-gray-50 border border-gray-300   ">
        <div className="UserCommentWrapper   ">
          {/* writer info starts  */}
          <div className="writerInfo  flex items-center gap-3 mb-3  ">
            {/* writer image  */}
            <div className="writerImg   ">
              <img
                className=" w-8 h-8 xsm:w-9 xsm:h-9 sm:w-10 sm:h-10 rounded-full"
                src={review?.user?.profileImg}
                alt="user avatar"
              />
            </div>
            {/* writer image  */}

            {/* writer name  */}

            <div className="writerName   ">
              <p className=" text-gray-900 font-semibold text-xs sm:text-sm ">
                {review?.user?.username}
              </p>
              <p className=" text-gray-600 font-medium text-xs  ">
                {format(new Date(review?.createdAt as string), "dd-MMMM-yyyy")}
              </p>
            </div>

            {/* writer name  */}
          </div>
          {/* writer info ends */}

          {/* review star starts  */}
          <div className="reviewStar paragraphFont text-sm sm:text-base mb-2 flex gap-x-.5 ">
            {renderStars()}
          </div>
          {/* review star ends  */}

          {/* User comment */}
          <div className="userComment paragraphFont text-sm sm:text-base mb-2 ">
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="  border border-gray-300 rounded-md p-1  "
                />
              </div>
            ) : (
              <p> {review?.comment} </p>
            )}
          </div>
          {/* User comment */}

          {/* Edit delete button section */}

          {review?.user?.id === userInfo?.userId && (
            <div className="mt-4 editDeleteBtn text-xs flex items-center gap-x-4">
              {isEditing ? (
                <>
                  <p
                    className="underline text-green-600 font-semibold cursor-pointer"
                    onClick={handleSaveClick}
                  >
                    Save
                  </p>
                  <p
                    className="underline text-red-600 font-semibold cursor-pointer"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="underline text-green-600 font-semibold cursor-pointer"
                    onClick={handleEditClick}
                  >
                    Edit
                  </p>
                </>
              )}
            </div>
          )}

          {/* Edit delete button section */}

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default UserCommentCard;
