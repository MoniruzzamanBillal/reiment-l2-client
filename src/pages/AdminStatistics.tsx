import {
  AdminStatCard,
  AdminStatCardSkeleton,
  CategoryDistributionChartSkeleton,
  RevenueChartSkeleton,
} from "@/components/ui/admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAdminStatsQuery } from "@/redux/features/admin/admin.api";

import { ShieldX, Store, Users, UserX } from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const categoryData = [
  { name: "Fashion", value: 35 },
  { name: "Electronics", value: 25 },
  { name: "Home & Garden", value: 20 },
  { name: "Sports", value: 12 },
  { name: "Books", value: 8 },
  { name: "Books", value: 8 },
  { name: "Books", value: 8 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

const AdminStatistics = () => {
  const { data: adminStats, isLoading } = useGetAdminStatsQuery(undefined);

  // console.log(adminStats?.data);
  console.log(adminStats?.data?.categoryDataPercentage);

  return (
    <div className="min-h-screen bg-gray-100  border border-gray-300 shadow rounded-md p-3 ">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}

        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/*  */}

          {isLoading &&
            Array.from({ length: 6 })?.map((_, ind) => (
              <AdminStatCardSkeleton key={ind} />
            ))}

          {adminStats?.data?.statsData &&
            adminStats?.data?.statsData?.map(
              (item: { value: number; title: string }, ind: number) => (
                <AdminStatCard key={ind} data={item} />
              )
            )}
          {/*  */}
        </div>

        {/* Charts and Analytics */}
        <div className="border border-gray-300 rounded-md  ">
          {isLoading && <RevenueChartSkeleton />}

          {adminStats?.data?.revenueDatas && (
            <Card className="  ">
              <CardHeader>
                <CardTitle>Revenue & Orders Trend</CardTitle>
                <CardDescription>
                  Monthly revenue and order volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={adminStats?.data?.revenueDatas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                    <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* category product percentage  */}
        <div className=" border border-gray-300 rounded-md ">
          {isLoading && <CategoryDistributionChartSkeleton />}

          {adminStats?.data?.categoryDataPercentage && (
            <Card className="  ">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Product categories breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={adminStats?.data?.categoryDataPercentage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {adminStats?.data?.categoryDataPercentage?.map(
                        (
                          entry: { name: string; value: number },
                          index: number
                        ) => (
                          <Cell
                            key={`cell-${entry?.name}`}
                            fill={COLORS[index % COLORS?.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {adminStats?.data?.categoryDataPercentage?.map(
                    (
                      category: { name: string; value: number },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS?.length],
                            }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <span className="font-medium">{category.value}%</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card className=" border border-gray-300 rounded-md ">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 border border-gray-300  flex-col gap-2 bg-transparent"
              >
                <Users className="w-5 h-5" />
                <span>Manage Users</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
              >
                <Store className="w-5 h-5" />
                <span>Manage Vendors</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
              >
                <UserX className="w-5 h-5" />
                <span>Suspend Account</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
              >
                <ShieldX className="w-5 h-5" />
                <span>Blacklist Shop</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatistics;
