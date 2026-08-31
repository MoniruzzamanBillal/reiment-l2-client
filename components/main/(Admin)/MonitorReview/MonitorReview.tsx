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
import Image from "next/image";
import { format } from "date-fns";
import { useState } from "react";
import { TAdminReview } from "./type/adminReview.type";

const LIMIT = 10;

export default function MonitorReview() {
  const [page, setPage] = useState(1);

  const url = buildUrl("/review/all-review", { page, limit: LIMIT });

  const { data: reviewData, isLoading, isError } = useFetchData<TAdminReview[]>(
    ["allReviews", String(page)], url
  );
  const reviews: TAdminReview[] = (reviewData as any)?.data ?? [];
  const totalItems: number = (reviewData as any)?.meta?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / LIMIT);

  let content = null;
  if (isLoading) content = <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>;
  else if (isError) content = <tr><td colSpan={6} className="p-8 text-center text-red-500">Something went wrong</td></tr>;
  else if (reviews.length === 0) content = <tr><td colSpan={6} className="p-8 text-center text-gray-500">No reviews found</td></tr>;
  else {
    content = reviews.map((review) => (
      <tr key={review.id} className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-4 text-center">{review.user?.username}</td>
        <td className="p-4 text-center">{review.product?.name}</td>
        <td className="p-4 text-center">
          <div className="flex justify-center">
            <div className="relative w-16 h-16 overflow-hidden rounded">
              <Image src={review.product?.productImg || "/placeholder.svg"} alt={review.product?.name} fill className="object-cover" sizes="64px" />
            </div>
          </div>
        </td>
        <td className="p-4 text-center">{review.rating}</td>
        <td className="p-4 text-center">{review.comment}</td>
        <td className="p-4 text-center">{format(new Date(review.createdAt), "dd-MMM-yyyy")}</td>
      </tr>
    ));
  }

  return (
    <div className="MonitorReviewContainer">
      <div className="bg-gray-100 border border-gray-300 shadow rounded-md p-3">
        <h3 className="text-2xl font-medium mb-4">Monitor Review</h3>
        <div className="relative w-full overflow-auto mt-4">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100">
                <th className="px-4 py-3 font-medium">Customer Name</th>
                <th className="px-4 py-3 font-medium">Product Name</th>
                <th className="px-4 py-3 font-medium">Product Image</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Review</th>
                <th className="px-4 py-3 font-medium">Review Date</th>
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
