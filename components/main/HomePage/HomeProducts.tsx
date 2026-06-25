"use client";

import Wrapper from "@/components/shared/Wrapper";
import ProductCard from "@/components/shared/cards/ProductCard";
import ProductCardSkeleton from "@/components/shared/cards/ProductCardSkeleton";
import { useFetchData } from "@/hooks/useApi";
import { TProductResponse } from "@/types";
import Link from "next/link";

const HomeProducts = () => {
  const { data: allProducts, isLoading } = useFetchData<TProductResponse[]>(
    ["homeProducts"],
    "/product/all-products?limit=12"
  );

  const products: TProductResponse[] = (
    (allProducts as any)?.data?.data ?? []
  ).slice(4, 12);

  return (
    <div className="HomeProductsContainer py-6 bg-white">
      <Wrapper className="HomeProductsWrapper">
        <div className="headingSection flex justify-between items-center mb-8">
          <h1 className="font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl">
            Just For You
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
            Array.from({ length: 6 }).map((_, ind) => (
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

export default HomeProducts;
