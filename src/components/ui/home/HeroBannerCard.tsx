import { Link } from "react-router-dom";
import { Button } from "../button";

const HeroBannerCard = ({ banner }) => {
  return (
    <section className="   flex container flex-col items-center justify-between  lg:flex-row gap-y-10 lg:gap-y-0 ">
      {/* content - start  */}

      <div className=" w-[99%] xsm:w-[90%] sm:w-[80%]  md:w-[70%] xmd:w-[60%] lg:w-[50%] flex flex-col justify-center sm:text-center  lg:text-left   ">
        <p className="mb-4 font-semibold text-prime100 md:mb-6 md:text-lg xl:text-xl">
          {banner?.subHeading}
        </p>

        <h1 className="mb-8 text-3xl font-bold text-black sm:text-4xl md:mb-12 md:text-5xl">
          {banner?.heading}
        </h1>

        <p className="mb-8 leading-relaxed text-gray-500 md:mb-12 lg:w-4/5 xl:text-lg">
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
