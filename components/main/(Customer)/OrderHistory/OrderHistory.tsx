"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useFetchData } from "@/hooks/useApi";
import { useOrderPusher } from "@/hooks/useOrderPusher";
import { downloadFile } from "@/lib/downloadFile";
import { buildUrl } from "@/utils/buildUrl";
import { format } from "date-fns";
import { useState } from "react";
import { TOrderHistory } from "./type/orderHistory.type";

const LIMIT = 10;

export default function OrderHistory() {
  useOrderPusher();

  const [page, setPage] = useState(1);

  const url = buildUrl("/order/user-order-history", { page, limit: LIMIT });

  const {
    data: orderData,
    isLoading,
    isError,
  } = useFetchData<TOrderHistory[]>(
    ["customerOrderHistory", String(page)],
    url
  );

  const orders: TOrderHistory[] = (orderData as any)?.data ?? [];
  const totalItems: number = (orderData as any)?.meta?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / LIMIT);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadInvoice = async (orderId: string) => {
    setDownloadingId(orderId);
    await downloadFile(`/order/${orderId}/invoice`, `invoice-${orderId}.pdf`);
    setDownloadingId(null);
  };

  let content = null;

  if (isLoading) {
    content = (
      <tr>
        <td colSpan={5} className="p-8 text-center text-gray-500">
          Loading...
        </td>
      </tr>
    );
  } else if (isError) {
    content = (
      <tr>
        <td colSpan={5} className="p-8 text-center text-red-500">
          Something went wrong
        </td>
      </tr>
    );
  } else if (orders.length === 0) {
    content = (
      <tr>
        <td colSpan={5} className="p-8 text-center text-gray-500">
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
        <td className="p-4 text-center">
          <Button
            size="sm"
            disabled={downloadingId === order.id}
            onClick={() => handleDownloadInvoice(order.id)}
            className="bg-prime100 hover:bg-prime200"
          >
            {downloadingId === order.id ? "Downloading..." : "Download Invoice"}
          </Button>
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
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, ind) => (
                  <PaginationItem key={ind}>
                    <PaginationLink
                      href="#"
                      isActive={page === ind + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(ind + 1);
                      }}
                    >
                      {ind + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
