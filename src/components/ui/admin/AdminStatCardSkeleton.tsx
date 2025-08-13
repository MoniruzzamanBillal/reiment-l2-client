import { Card, CardContent, CardHeader } from "../card";
import { Skeleton } from "../skeleton";

const AdminStatCardSkeleton = () => {
  return (
    <Card className="border border-gray-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* Skeleton for the title */}
        <Skeleton className="w-24 h-4 bg-gray-300 rounded" />
        {/* Skeleton for the icon */}
        <Skeleton className="w-6 h-6 bg-gray-300 rounded-full" />
      </CardHeader>
      <CardContent>
        {/* Skeleton for the value */}
        <Skeleton className="w-32 h-6 bg-gray-300 rounded" />
      </CardContent>
    </Card>
  );
};

export default AdminStatCardSkeleton;
