import { TableDataError, TableDataLoading } from "@/components/ui";
import { useGetAllReviewQuery } from "@/redux/features/review/review.api";
import { format } from "date-fns";
import { useState } from "react";

type TUser = {
  id: string;
  username: string;
  email: string;
  profileImg: string;
  password: string;
  role: string;
  status: string;
  isDelated: boolean;
};

type TProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  productImg: string;
  inventoryCount: number;
  categoryId: string;
  shopId: string;
  isDelated: boolean;
};

type TReview = {
  id: string;
  comment: string;
  rating: number;
  isDeleted: boolean;
  orderItemId: string;
  productId: string;
  userId: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  product: TProduct;
  user: TUser;
};

const MonitorReview = () => {
  let content = null;

  const {
    data: allReviewData,
    isLoading: reviewProductLoading,
    isError: reviewDataError,
  } = useGetAllReviewQuery(undefined);

  // console.log(allReviewData?.data);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalItems = allReviewData?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedProducts = allReviewData?.data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // * If data is loading
  if (reviewProductLoading) {
    content = (
      <tr>
        <td colSpan={6} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  // * If there is an error
  if (!reviewProductLoading && reviewDataError) {
    content = (
      <tr>
        <td colSpan={6}>
          <TableDataError message="Something went wrong" />
        </td>
      </tr>
    );
  }

  // * If no data exists
  if (
    !reviewProductLoading &&
    !reviewDataError &&
    allReviewData?.data?.length < 1
  ) {
    content = (
      <tr>
        <td colSpan={6}>
          <TableDataError message="No reviews found" />
        </td>
      </tr>
    );
  }

  // * If data exists
  if (
    !reviewProductLoading &&
    !reviewDataError &&
    allReviewData?.data?.length
  ) {
    content = paginatedProducts?.map((review: TReview) => (
      <tr key={review.id} className="border-b">
        <td className="p-4 text-center">{review.user.username}</td>
        <td className="p-4 text-center">{review.product.name}</td>
        <td className="p-4 text-center">
          <img
            src={review.product.productImg}
            alt={review.product.name}
            className="w-16 h-16 object-cover mx-auto"
          />
        </td>
        <td className="p-4 text-center">{review.rating}</td>
        <td className="p-4 text-center">{review.comment}</td>
        <td className="p-4 text-center">
          {format(new Date(review.createdAt), "dd-MMM-yyyy")}
        </td>
      </tr>
    ));
  }

  return (
    <div className="MonitorReviewContainer">
      <div className="MonitorReviewWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-3  ">
        <h3 className="brand text-2xl font-medium mb-4 "> Monitor Review</h3>

        {/*monitor review  table starts  */}
        <div className="manageUserTable relative w-full overflow-auto mt-4 ">
          <table className="w-full text-sm ">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100  ">
                <th className="px-4 font-medium">Customer Name </th>
                <th className="px-4 font-medium">Product Name </th>
                <th className="px-4 font-medium">Product Image </th>
                <th className="px-4 font-medium">Rating </th>
                <th className="px-4 font-medium">Review </th>
                <th className="px-4 font-medium">Review Date </th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>

          {/*  */}
          {/*  */}
          {/*  */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          {/*  */}
          {/*  */}
          {/*  */}
        </div>
        {/* monitor review  table ends  */}

        {/*  */}
      </div>
    </div>
  );
};

export default MonitorReview;
