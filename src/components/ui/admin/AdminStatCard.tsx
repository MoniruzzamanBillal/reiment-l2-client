import { Card, CardContent, CardHeader, CardTitle } from "../card";

import { DollarSign, ShoppingCart, Store, Users, UserX } from "lucide-react";

type TProps = {
  data: {
    value: number;
    title: string;
  };
};

const AdminStatCard = ({ data }: TProps) => {
  return (
    <Card className=" border border-gray-300 ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium"> {data?.title} </CardTitle>

        {data?.title === "Total Users" && (
          <Users className="h-4 w-4 text-muted-foreground" />
        )}

        {data?.title === "Active Vendors" && (
          <Store className="h-4 w-4 text-muted-foreground" />
        )}

        {data?.title === "Blocked Vendors" && (
          <UserX className="h-4 w-4 text-muted-foreground" />
        )}

        {data?.title === "Total Orders" && (
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        )}

        {data?.title === "Total Revenue" && (
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data?.value}</div>
      </CardContent>
    </Card>
  );
};

export default AdminStatCard;
