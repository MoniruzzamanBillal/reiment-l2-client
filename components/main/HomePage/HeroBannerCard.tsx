"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type TBanner = {
  subHeading: string;
  heading: string;
  description: string;
  bannerImg: string;
  primaryCTA: string;
  secondaryCTA?: string;
};

const HeroBannerCard = ({ banner }: { banner: TBanner }) => {
  return (
    <section className="relative h-[18rem] xsm:h-[22rem] sm:h-[28rem] xmd:h-[34rem] flex items-center">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={banner.bannerImg || "/placeholder.svg"}
          alt="Hero Banner"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-600/30 backdrop-blur-sm border border-indigo-400/40 rounded-full mb-6">
            <span className="text-xs sm:text-sm font-medium text-indigo-100 tracking-wide">
              {banner.subHeading}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl xmd:text-6xl font-bold text-white mb-5 leading-tight">
            {banner.heading}
          </h1>

          <p className="text-sm sm:text-base xmd:text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
            {banner.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/products">
              <Button className="group bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                {banner.primaryCTA || "Shop Now"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {banner.secondaryCTA && (
              <Link href="/products">
                <Button
                  variant="outline"
                  className="border-white/60 text-white hover:bg-white/10 hover:border-white bg-transparent px-7 py-3 text-sm sm:text-base font-semibold rounded-full transition-all duration-300"
                >
                  {banner.secondaryCTA}
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-5 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerCard;
