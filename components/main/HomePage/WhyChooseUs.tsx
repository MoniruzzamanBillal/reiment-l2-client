import { GitCompare, Tag, Store, Zap, ShieldCheck, Smartphone } from "lucide-react";
import Wrapper from "@/components/shared/Wrapper";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: GitCompare,
    title: "Product Comparison",
    description:
      "Compare up to 3 products from the same category to make informed decisions",
  },
  {
    icon: Tag,
    title: "Coupon Codes",
    description:
      "Apply discount coupons during checkout and save on your purchases",
  },
  {
    icon: Store,
    title: "Multiple Vendors",
    description: "Shop from hundreds of verified vendors all in one place",
  },
  {
    icon: Zap,
    title: "Flash Sales",
    description:
      "Exclusive flash sales with amazing discounts on popular products",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Safe and secure payment processing with multiple payment options",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Shop seamlessly on any device with our responsive design",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-14 bg-white">
      <Wrapper className="mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3">
            Why Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Why Choose Reiment?
          </h2>
          <p className="text-gray-500 text-sm">
            Discover what makes us the best choice for online shopping
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-md hover:border-indigo-100 transition-all duration-200 border border-gray-100"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-base mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Wrapper>
    </section>
  );
};

export default WhyChooseUs;
