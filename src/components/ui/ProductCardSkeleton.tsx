import { Skeleton } from "./skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="ProductCardContainer bg-white border border-gray-400 shadow-md rounded-md overflow-auto">
      <div className="ProductCardWrapper flex flex-col gap-y-1">
        {/* Image Skeleton */}
        <div className="h-[15rem] relative">
          <Skeleton className="w-full h-full bg-gray-300 " />

          {/* Category Tag */}
          <div className="absolute top-0 left-0 py-1 px-2">
            <Skeleton className="h-4 w-16 rounded-md bg-gray-300" />
          </div>
        </div>

        <div className="p-3">
          {/* Title Skeleton */}
          <Skeleton className="h-6 w-3/4 mb-3 bg-gray-300 " />

          {/* Price & Shop */}
          <div className="flex justify-between items-center">
            <div className="flex gap-x-2">
              <Skeleton className="h-6 w-16 bg-gray-300 " />
              <Skeleton className="h-6 w-12 bg-gray-300 " />
            </div>

            <div className="flex items-center gap-x-1">
              <Skeleton className="h-6 w-6 rounded-full bg-gray-300 " />
              <Skeleton className="h-4 w-20 bg-gray-300 " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
