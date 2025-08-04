import { Skeleton } from "@/components/ui/skeleton";

const CategoryCardSkeleton = () => {
  return (
    <div className="categoryCardContainer m-auto flex flex-col justify-center ">
      <div className="imgSection flex justify-center items-center">
        <div className="imgContainer size-[8rem] rounded-full overflow-hidden">
          <Skeleton className="w-full h-full rounded-full bg-gray-200 " />
        </div>
      </div>

      <div className="nameSection mt-2 flex justify-center">
        <Skeleton className="h-5 w-24 rounded bg-gray-200" />
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;
