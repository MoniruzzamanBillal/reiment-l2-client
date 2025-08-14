import Wrapper from "@/components/shared/Wrapper";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "🔍",
    title: "Product Comparison",
    description:
      "Compare up to 3 products from the same category to make informed decisions",
  },
  {
    icon: "🎫",
    title: "Coupon Codes",
    description:
      "Apply discount coupons during checkout and save on your purchases",
  },
  {
    icon: "🏪",
    title: "Multiple Vendors",
    description: "Shop from hundreds of verified vendors all in one place",
  },
  {
    icon: "⚡",
    title: "Flash Sales",
    description:
      "Exclusive flash sales with amazing discounts on popular products",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    description:
      "Safe and secure payment processing with multiple payment options",
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Shop seamlessly on any device with our responsive design",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-12  ">
      <Wrapper className="mx-auto ">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Why Choose Raiment?
          </h2>
          <p className="text-gray-600">
            Discover what makes us the best choice for online shopping
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features?.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow duration-300 border border-gray-300 "
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{feature?.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature?.title}</h3>
                <p className="text-gray-600 text-sm">{feature?.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default WhyChooseUs;
