"use client";

import AdminStatCard from "@/components/main/AdminDashboard/AdminStatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData } from "@/hooks/useApi";
import { TAdminStats } from "@/types";
import { CreditCard, Store, Tag, Users } from "lucide-react";
import Link from "next/link";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

export default function AdminStatisticsPage() {
  const { data: statsData, isLoading } = useFetchData<TAdminStats>(["adminStats"], "/admin/stats");
  const stats: TAdminStats | null = (statsData as any)?.data ?? null;

  return (
    <div className="min-h-screen bg-gray-100 border border-gray-300 shadow rounded-md p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading && Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border border-gray-300">
              <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))}
          {stats?.statsData && Array.isArray(stats.statsData) && (stats.statsData as any[]).map((item: { value: number; title: string }, i: number) => (
            <AdminStatCard key={i} data={item} />
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Category Pie Chart */}
        <div className="border border-gray-300 rounded-md">
          {isLoading && <Skeleton className="h-64 w-full" />}
          {stats?.categoryDataPercentage && (
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Product categories breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stats.categoryDataPercentage}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={100}
                      paddingAngle={5} dataKey="value"
                    >
                      {stats.categoryDataPercentage.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {stats.categoryDataPercentage.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-medium">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="border border-gray-300 rounded-md">
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/admin/manage-user">
                <Button variant="outline" className="h-20 w-full border border-gray-400 flex-col gap-2 bg-transparent">
                  <Users className="w-5 h-5" /><span>Manage Users</span>
                </Button>
              </Link>
              <Link href="/dashboard/admin/manage-shop">
                <Button variant="outline" className="h-20 w-full border border-gray-400 flex-col gap-2 bg-transparent">
                  <Store className="w-5 h-5" /><span>Manage Vendors</span>
                </Button>
              </Link>
              <Link href="/dashboard/admin/categories">
                <Button variant="outline" className="h-20 w-full border border-gray-400 flex-col gap-2 bg-transparent">
                  <Tag className="w-5 h-5" /><span>Manage Category</span>
                </Button>
              </Link>
              <Link href="/dashboard/admin/monitor-transaction">
                <Button variant="outline" className="h-20 w-full border border-gray-400 flex-col gap-2 bg-transparent">
                  <CreditCard className="w-5 h-5" /><span>Monitor Transaction</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
