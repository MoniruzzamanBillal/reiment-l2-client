"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useFetchData } from "@/hooks/useApi";
import { buildUrl } from "@/utils/buildUrl";
import { format } from "date-fns";
import { useState } from "react";
import { TTransaction } from "./type/transaction.type";

const LIMIT = 10;

export default function MonitorTransaction() {
  const [page, setPage] = useState(1);

  const url = buildUrl("/order/all-transaction", { page, limit: LIMIT });

  const { data: txData, isLoading, isError } = useFetchData<TTransaction[]>(
    ["allTransaction", String(page)], url
  );
  const transactions: TTransaction[] = (txData as any)?.data ?? [];
  const totalItems: number = (txData as any)?.meta?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / LIMIT);

  let content = null;
  if (isLoading) content = <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading...</td></tr>;
  else if (isError) content = <tr><td colSpan={4} className="p-8 text-center text-red-500">Something went wrong</td></tr>;
  else if (transactions.length === 0) content = <tr><td colSpan={4} className="p-8 text-center text-gray-500">No transactions found</td></tr>;
  else {
    content = transactions.map((tx) => (
      <tr key={tx.id} className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-4 text-center">{tx.customer?.username}</td>
        <td className="p-4 text-center">{tx.trxnNumber}</td>
        <td className="p-4 text-center">${tx.totalPrice}</td>
        <td className="p-4 text-center">{format(new Date(tx.createdAt), "dd-MMM-yyyy")}</td>
      </tr>
    ));
  }

  return (
    <div className="MonitorTransactionContainer">
      <div className="bg-gray-100 border border-gray-300 shadow rounded-md p-3">
        <h3 className="text-2xl font-medium mb-4">Monitor Transaction</h3>
        <div className="relative w-full overflow-auto mt-4">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100">
                <th className="px-4 py-3 font-medium">Transaction User</th>
                <th className="px-4 py-3 font-medium">Transaction Number</th>
                <th className="px-4 py-3 font-medium">Transaction Amount</th>
                <th className="px-4 py-3 font-medium">Transaction Date</th>
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
