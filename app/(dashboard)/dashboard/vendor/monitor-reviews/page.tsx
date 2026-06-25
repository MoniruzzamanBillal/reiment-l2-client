"use client";

import { useFetchData } from "@/hooks/useApi";
import Image from "next/image";
import { format } from "date-fns";

type TVendorReview = {
  id: string;
  comment: string;
  rating: number;
  updatedAt: string;
  product: { id: string; name: string; productImg: string };
  user: { id: string; username: string };
};

export default function VendorMonitorReviewsPage() {
  const { data: reviewData, isLoading, isError } = useFetchData<TVendorReview[]>(
    ["vendorReviews"],
    "/review/getVendorProductReviews"
  );
  const reviews: TVendorReview[] = (reviewData as any)?.data ?? [];

  let content = null;
  if (isLoading) {
    content = <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>;
  } else if (isError) {
    content = <tr><td colSpan={6} className="p-8 text-center text-red-500">Something went wrong</td></tr>;
  } else if (reviews.length === 0) {
    content = <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nothing Found</td></tr>;
  } else {
    content = reviews.map((r) => (
      <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-4 text-center">{r.product?.name}</td>
        <td className="p-4 text-center">
          <div className="flex justify-center">
            <div className="relative size-[4.5rem] rounded-md overflow-hidden">
              <Image src={r.product?.productImg || "/placeholder.svg"} alt={r.product?.name} fill className="object-cover" sizes="72px" />
            </div>
          </div>
        </td>
        <td className="p-4 text-center">{r.user?.username}</td>
        <td className="p-4 text-center">{r.rating}</td>
        <td className="p-4 text-center">{r.comment}</td>
        <td className="p-4 text-center">{format(new Date(r.updatedAt), "dd-MMM-yyyy")}</td>
      </tr>
    ));
  }

  return (
    <div className="VendorReviewContainer">
      <div className="bg-gray-100 shadow rounded-md p-3">
        <h3 className="text-2xl font-medium mb-6">Monitor Customer Review</h3>
        <div className="relative w-full overflow-auto mt-4">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100">
                <th className="px-4 py-3 font-medium">Product Name</th>
                <th className="px-4 py-3 font-medium">Product Image</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Review</th>
                <th className="px-4 py-3 font-medium">Review Date</th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
