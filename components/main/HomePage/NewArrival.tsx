"use client";

import Wrapper from "@/components/shared/Wrapper";
import ProductCard from "@/components/shared/cards/ProductCard";
import ProductCardSkeleton from "@/components/shared/cards/ProductCardSkeleton";
import { useFetchData } from "@/hooks/useApi";
import { TProductResponse } from "@/types";
import Link from "next/link";

const NewArrival = () => {
  const { data: allProducts, isLoading } = useFetchData<TProductResponse[]>(
    ["newArrivalProducts"],
    "/product/all-products?limit=4&sortBy=createdAt&sortOrder=desc"
  );

  const products: TProductResponse[] = (allProducts as any)?.data?.data ?? [];

  return (
    <div className="NewArrivalContainer py-8">
      <Wrapper className="NewArrivalWrapper">
        <div className="headingSection flex justify-between items-center">
          <h1 className="mb-8 font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl">
            Newly Arrival
          </h1>
          <Link
            href="/products"
            className="font-medium text-prime100 hover:bg-prime100 hover:text-gray-50 py-2 px-4 rounded-md"
          >
            Show more
          </Link>
        </div>

        <div className="products mx-auto w-[80%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 xmd:grid-cols-4 gap-x-5 gap-y-8">
          {isLoading &&
            Array.from({ length: 4 }).map((_, ind) => (
              <ProductCardSkeleton key={ind} />
            ))}
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default NewArrival;
