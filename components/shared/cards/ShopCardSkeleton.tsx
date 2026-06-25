import { Skeleton } from "@/components/ui/skeleton";

const ShopCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
      {/* Circular logo */}
      <div className="flex justify-center pt-6 pb-4 px-4">
        <Skeleton className="size-24 rounded-full bg-gray-200" />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-4 pb-5 gap-3">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-2/3 rounded-full bg-gray-200" />
          <Skeleton className="h-3 w-full rounded-full bg-gray-200" />
          <Skeleton className="h-3 w-4/5 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <Skeleton className="h-3.5 w-24 rounded-full bg-gray-200" />
          <Skeleton className="h-3.5 w-20 rounded-full bg-gray-200" />
        </div>

        <Skeleton className="h-10 w-full rounded-xl bg-gray-200" />
      </div>
    </div>
  );
};

export default ShopCardSkeleton;
