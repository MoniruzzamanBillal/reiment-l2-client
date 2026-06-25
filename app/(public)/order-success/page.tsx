"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="OrderSuccessContainer bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="confirmationCard bg-white py-8 px-16 rounded-md shadow-md border border-gray-300 flex flex-col justify-center items-center gap-y-3">
        <div className="icon text-center flex justify-center items-center">
          <IoIosCheckmarkCircleOutline className="text-7xl text-prime100" />
        </div>
        <p className="text-3xl font-semibold">Your order is confirmed!!</p>
        <Button
          onClick={() => router.push("/products")}
          className="mt-3 bg-prime100 hover:bg-prime100 hover:scale-[1.01] hover:shadow-md active:scale-100"
        >
          Continue shopping
        </Button>
      </div>
    </div>
  );
}
