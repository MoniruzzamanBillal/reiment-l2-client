/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { Button } from "../button";

const HeroBannerCard = ({ banner }: { banner: any }) => {
  return (
    <section className="   flex container flex-col items-center justify-between  md:flex-row gap-y-5 xmd:gap-y-0 gap-x-2 ">
      {/* content - start  */}

      <div className=" w-[99%] xsm:w-[90%] sm:w-[80%]  md:w-[70%] xmd:w-[60%] lg:w-[50%] flex flex-col justify-center text-left   ">
        <p className=" font-semibold text-prime100 mb-4 text-lg  xmd:text-xl">
          {banner?.subHeading}
        </p>

        <h1 className=" text-2xl font-bold text-black mb-5 sm:text-3xl md:text-3xl  md:mb-4 lg:text-4xl">
          {banner?.heading}
        </h1>

        <p className=" leading-relaxed text-gray-700 mb-8 lg:w-4/5 xl:text-lg">
          {banner?.description}
        </p>

        <div className="">
          <Link to={"/products"}>
            <Button className="inline-block rounded-lg bg-prime100 px-6  text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-prime100 focus-visible:ring active:bg-prime100 md:text-base">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
      {/* content - end  */}

      {/* image - start  */}
      <div className="  w-[99%] xsm:w-[90%] sm:w-[80%]  md:w-[70%] xmd:w-[60%] lg:w-[50%]  overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:h-auto ">
        <img
          src={banner?.bannerImg}
          loading="lazy"
          alt="Photo by Fakurian Design"
          className="h-full w-full object-cover object-center"
        />
      </div>
      {/* image  end  */}
    </section>
  );
};

export default HeroBannerCard;
