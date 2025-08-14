import Wrapper from "@/components/shared/Wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useGetRecentReviewQuery } from "@/redux/features/review/review.api";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "../skeleton";

type TReview = {
  comment: string;
  createdAt: string;
  id: string;
  isDeleted: boolean;
  orderItemId: string;
  product: {
    id: string;
    name: string;
    price: number;
  };
  productId: string;
  rating: number;
  updatedAt: string;
  user: {
    email: string;
    id: string;
    profileImg: string;
    username: string;
  };
  userId: string;
};

const RecentReview = () => {
  const { data: recentReviews, isLoading } = useGetRecentReviewQuery(undefined);

  // console.log(recentReviews?.data);

  return (
    <section className="py-12 bg-white">
      <Wrapper className="mx-auto ">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Recent Reviews
          </h2>
          <p className="text-gray-600">See what our customers are saying</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading &&
            Array.from({ length: 3 })?.map((_, ind) => (
              <ReviewCardSkeleton key={ind} />
            ))}

          {recentReviews?.data &&
            recentReviews?.data?.map((review: TReview) => (
              <Card
                key={review?.id}
                className=" shadow-md hover:shadow-lg transition-shadow duration-300 bg-gray-100/70 border border-gray-300 "
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={review?.user?.profileImg || "/placeholder.svg"}
                        alt={review?.user?.username}
                      />
                      <AvatarFallback>
                        {review?.user?.username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm">
                        {review?.user?.username}
                      </h4>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 text-sm mr-2">
                          {"★".repeat(review?.rating)}
                        </div>
                        <span className="text-gray-500 text-xs">
                          {formatDistanceToNow(new Date(review?.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-3">
                    {review?.comment}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Product: {review?.product?.name}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </Wrapper>
    </section>
  );
};

const ReviewCardSkeleton = () => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-gray-100/70 border border-gray-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Skeleton className="h-10 w-10 mr-3 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="flex items-center">
              <Skeleton className="h-4 w-16 mr-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-3 w-48" />
      </CardContent>
    </Card>
  );
};

export default RecentReview;
