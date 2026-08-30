"use client";

import VendorStatCard from "./VendorStatCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData } from "@/hooks/useApi";
import { TVendorStats } from "./type/vendorStats.type";
import { History, MessageCircle, Package, Store } from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Statistics() {
  const { data: statsData, isLoading } = useFetchData<TVendorStats>(
    ["vendorStats"],
    "/shop/vendor-stats",
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stats: TVendorStats | null = (statsData as any)?.data ?? null;

  return (
    <div className="min-h-screen bg-gray-100 border border-gray-300 shadow rounded-md p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border border-gray-300">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          {stats?.statsData &&
            Array.isArray(stats.statsData) &&
            stats.statsData.map((item, i) => (
              <VendorStatCard key={i} data={item} />
            ))}
        </div>

        {/* Revenue Bar Chart */}
        <div className="border border-gray-300 rounded-md">
          {isLoading && <Skeleton className="h-64 w-full" />}
          {stats?.revenueDatas && (
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Orders Trend</CardTitle>
                <CardDescription>Monthly revenue and order volume</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.revenueDatas.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.revenueDatas}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                      <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No orders yet.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Top Products Bar Chart */}
        <div className="border border-gray-300 rounded-md">
          {isLoading && <Skeleton className="h-64 w-full" />}
          {stats?.topProducts && (
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best-selling products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                      <Bar dataKey="quantity" fill="#82ca9d" name="Units Sold" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No product sales yet.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="border border-gray-300 rounded-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/vendor/manage-products">
                <Button
                  variant="outline"
                  className="h-20 w-full border border-gray-400 flex-col gap-2 bg-transparent"
                >
                  <Package className="w-5 h-5" />
                  <span>Manage Inventory</span>
                </Button>
              </Link>
              <Link href="/dashboard/vendor/order-history">
                <Button
                  variant="outline"
                  className="h-20 w-full border border-gray-400 flex-col gap-2 bg-transparent"
                >
                  <History className="w-5 h-5" />
                  <span>Order History</span>
                </Button>
              </Link>
              <Link href="/dashboard/vendor/manage-shop">
                <Button
                  variant="outline"
                  className="h-20 w-full border border-gray-400 flex-col gap-2 bg-transparent"
                >
                  <Store className="w-5 h-5" />
                  <span>Manage Shop</span>
                </Button>
              </Link>
              <Link href="/dashboard/vendor/monitor-reviews">
                <Button
                  variant="outline"
                  className="h-20 w-full border border-gray-400 flex-col gap-2 bg-transparent"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Customer Reviews</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
