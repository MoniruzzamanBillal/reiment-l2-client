"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, DollarSign, Package, ShoppingCart } from "lucide-react";

type TProps = { data: { value: number; title: string } };

export default function VendorStatCard({ data }: TProps) {
  return (
    <Card className="border border-gray-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
        {data.title === "Total Orders" && <ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        {data.title === "Total Revenue" && <DollarSign className="h-4 w-4 text-muted-foreground" />}
        {data.title === "Total Products" && <Package className="h-4 w-4 text-muted-foreground" />}
        {data.title === "Low Stock Products" && <AlertTriangle className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.value}</div>
      </CardContent>
    </Card>
  );
}
