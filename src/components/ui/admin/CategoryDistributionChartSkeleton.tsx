import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { Skeleton } from "../skeleton";

const CategoryDistributionChartSkeleton = () => {
  return (
    <div className="p-4">
      <Card className="border border-gray-300">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48 bg-gray-300 rounded" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64 bg-gray-200 rounded" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full bg-gray-200 rounded" />{" "}
          {/* Skeleton for Pie chart */}
          <div className="mt-4 space-y-2">
            {/* Skeleton for each category breakdown */}
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="w-3 h-3 rounded-full bg-gray-300" />
                  <Skeleton className="h-4 w-24 bg-gray-300 rounded" />
                </div>
                <Skeleton className="h-4 w-16 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryDistributionChartSkeleton;
