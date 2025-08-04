import { Skeleton } from "./skeleton";

const ShopCardSkeleton = () => {
  return (
    <div className="shopCard bg-white rounded-md border border-gray-200 shadow-md">
      <div className="p-4">
        <div className="mx-auto flex items-center justify-center mb-4 size-[10rem]">
          <Skeleton className="w-full h-full rounded" />
        </div>

        <Skeleton className="h-5 w-3/4 mb-2" />

        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <Skeleton className="h-4 w-1/3 mb-6" />

        <Skeleton className="h-9 w-28 rounded" />
      </div>
    </div>
  );
};

export default ShopCardSkeleton;
