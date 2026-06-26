"use client";

import { useFetchData } from "@/hooks/useApi";
import { TOrderHistory } from "@/types";
import { format } from "date-fns";

export default function CustomerOrderHistoryPage() {
  const {
    data: orderData,
    isLoading,
    isError,
  } = useFetchData<TOrderHistory[]>(
    ["customerOrderHistory"],
    "/order/user-order-history"
  );

  const orders: TOrderHistory[] = (orderData as any)?.data ?? [];

  let content = null;

  if (isLoading) {
    content = (
      <tr>
        <td colSpan={4} className="p-8 text-center text-gray-500">
          Loading...
        </td>
      </tr>
    );
  } else if (isError) {
    content = (
      <tr>
        <td colSpan={4} className="p-8 text-center text-red-500">
          Something went wrong
        </td>
      </tr>
    );
  } else if (orders.length === 0) {
    content = (
      <tr>
        <td colSpan={4} className="p-8 text-center text-gray-500">
          Nothing Found
        </td>
      </tr>
    );
  } else {
    content = orders.map((order) => (
      <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-4 text-center">{order.trxnNumber}</td>
        <td className="p-4 text-center">${order.totalPrice}</td>
        <td className="p-4 text-center">
          <ul className="space-y-1">
            {order.orderItem.map((item, idx) => (
              <li key={idx}>{item?.product?.name}</li>
            ))}
          </ul>
        </td>
        <td className="p-4 text-center">
          {format(new Date(order.updatedAt), "dd-MMM-yyyy")}
        </td>
      </tr>
    ));
  }

  return (
    <div className="CustomerOrderHistoryContainer">
      <div className="CustomerOrderHistoryWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-3">
        <h3 className="text-2xl font-medium mb-6">Order History</h3>

        <div className="relative w-full overflow-auto mt-4">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100">
                <th className="px-4 py-3 font-medium">Transaction Number</th>
                <th className="px-4 py-3 font-medium">Total Price</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Order Date</th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
