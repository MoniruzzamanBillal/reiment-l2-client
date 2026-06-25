import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-[15rem]">
        <Skeleton className="w-full h-full rounded-none bg-gray-200" />
        {/* Category badge placeholder */}
        <div className="absolute top-2.5 left-2.5">
          <Skeleton className="h-5 w-16 rounded-full bg-gray-300" />
        </div>
        {/* Discount badge placeholder */}
        <div className="absolute top-2.5 right-2.5">
          <Skeleton className="h-5 w-12 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3 gap-2.5">
        <Skeleton className="h-4 w-3/4 rounded-full bg-gray-200" />
        <Skeleton className="h-3.5 w-1/2 rounded-full bg-gray-200" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-full bg-gray-200" />
          <Skeleton className="h-5 w-24 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Button */}
      <div className="px-3 pb-3">
        <Skeleton className="h-9 w-full rounded-xl bg-gray-200" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
