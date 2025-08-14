import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "Raiment has completely changed how I shop online. The vendor variety is incredible and the product comparison feature saved me so much time!",
    author: "Jessica Williams",
    role: "Fashion Enthusiast",
    rating: 5,
  },
  {
    quote:
      "As a vendor, this platform has helped me reach thousands of customers. The admin support is excellent and the interface is user-friendly.",
    author: "David Kumar",
    role: "Electronics Vendor",
    rating: 5,
  },
  {
    quote:
      "The flash sales and coupon system make shopping here so rewarding. I've saved hundreds of dollars on quality products!",
    author: "Maria Rodriguez",
    role: "Regular Customer",
    rating: 5,
  },
];

const CustomerTestimonials = () => {
  return (
    <section className="py-12 bg-prime100 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">What Our Community Says</h2>
          <p className="text-gray-100">Real experiences from real people</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors duration-300"
            >
              <CardContent className="p-6">
                <div className="flex text-yellow-400 mb-4">
                  {"★".repeat(testimonial.rating)}
                </div>

                <blockquote className="text-sm mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>

                <div className="border-t border-white/20 pt-4">
                  <p className="font-semibold text-white ">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-100/90 text-sm">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
