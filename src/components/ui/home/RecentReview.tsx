import Wrapper from "@/components/shared/Wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
const reviews = [
  {
    user: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Amazing quality products and fast delivery. Highly recommended!",
    product: "Summer Dress Collection",
    date: "2 days ago",
  },
  {
    user: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Great electronics selection and competitive prices.",
    product: "Wireless Headphones",
    date: "3 days ago",
  },
  {
    user: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment:
      "Love the variety of vendors. Found exactly what I was looking for!",
    product: "Home Decor Items",
    date: "5 days ago",
  },
];

const RecentReview = () => {
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
          {reviews.map((review, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src={review.avatar || "/placeholder.svg"}
                      alt={review.user}
                    />
                    <AvatarFallback>
                      {review.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm">{review.user}</h4>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 text-sm mr-2">
                        {"★".repeat(review.rating)}
                      </div>
                      <span className="text-gray-500 text-xs">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-3">"{review.comment}"</p>
                <p className="text-gray-500 text-xs">
                  Product: {review.product}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default RecentReview;
