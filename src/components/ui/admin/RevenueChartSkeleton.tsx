import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { Skeleton } from "../skeleton";

const RevenueChartSkeleton = () => {
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
          <Skeleton className="h-72 w-full bg-gray-200 rounded" />{" "}
          {/* Skeleton for the chart */}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueChartSkeleton;
