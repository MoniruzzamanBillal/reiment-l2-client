import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { Clock, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FlashSaleHeader = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-red-600 text-white py-8 px-4">
      <Wrapper className=" ">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Flame className="h-8 w-8 text-yellow-300" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Flash Sale!</h2>
              <p className="text-lg opacity-90">
                Up to 70% off on selected items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Ends in:</span>
            </div>
            <div className="flex gap-2">
              <div className="bg-white text-red-600 px-3 py-2 rounded font-bold min-w-[3rem] text-center">
                {timeLeft.hours.toString().padStart(2, "0")}
              </div>
              <span className="text-2xl">:</span>
              <div className="bg-white text-red-600 px-3 py-2 rounded font-bold min-w-[3rem] text-center">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <span className="text-2xl">:</span>
              <div className="bg-white text-red-600 px-3 py-2 rounded font-bold min-w-[3rem] text-center">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </div>
            </div>

            <Link to={"/flash-sale"}>
              <Button className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold">
                Shop Flash Sale
              </Button>
            </Link>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default FlashSaleHeader;
