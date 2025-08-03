import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../button";
import { TBanner } from "./HeroBanner";

const HeroBannerCard = ({ banner }: { banner: TBanner }) => {
  return (
    <section className="relative min-h-[480px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute ">
        <img
          src={banner?.bannerImg || "/placeholder.svg"}
          loading="lazy"
          alt="Hero Banner"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-prime100/20 backdrop-blur-sm border border-prime100/30 rounded-full mb-6">
              <span className="text-sm font-medium text-white">
                {banner?.subHeading}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl  font-bold text-white mb-6 leading-tight">
              {banner?.heading}
            </h1>

            {/* Description */}
            <p className="text-lg  text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {banner?.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/products">
                <Button className="group bg-prime100 hover:bg-prime100/90 text-white px-6 py-3 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                  {banner?.primaryCTA || "Shop Now"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right side decorative element or additional content */}
          <div className="hidden lg:block w-1/2">
            <div className="relative">
              {/* Floating cards or additional visual elements can go here */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl rotate-12"></div>
              <div className="absolute top-8 -right-8 w-16 h-16 bg-prime100/20 backdrop-blur-sm rounded-xl -rotate-12"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerCard;
