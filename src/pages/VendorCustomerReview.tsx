import { TableDataError, TableDataLoading } from "@/components/ui";
import { useGetVendorProductReviewsQuery } from "@/redux/features/review/review.api";
import { format } from "date-fns";
import { useState } from "react";

type TVendorProductReview = {
  id: string;
  comment: string;
  rating: number;
  isDeleted: boolean;

  updatedAt: string;
  orderItemId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    productImg: string;
    categoryId: string;
    shopId: string;
  };
  userId: string;
  user: {
    id: string;
    username: string;
    email: string;
    profileImg: string;
  };
};

const VendorCustomerReview = () => {
  let content = null;

  const {
    data: vendorProductReviewData,
    isLoading: vendorProductReviewDataLoading,
    isError: vendorProductReviewDataError,
  } = useGetVendorProductReviewsQuery(undefined);

  console.log(vendorProductReviewData?.data);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = vendorProductReviewData?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedProducts = vendorProductReviewData?.data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // *  if data is loading
  if (vendorProductReviewDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  // *  if any error
  if (!vendorProductReviewDataLoading && vendorProductReviewDataError) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Something went wrong " />
        </td>
      </tr>
    );
  }

  // * for no data
  if (
    !vendorProductReviewDataLoading &&
    !vendorProductReviewDataError &&
    vendorProductReviewData?.data?.length < 1
  ) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Nothing Found" />
        </td>
      </tr>
    );
  }

  //
  if (
    !vendorProductReviewDataLoading &&
    !vendorProductReviewDataError &&
    vendorProductReviewData?.data?.length
  ) {
    content = paginatedProducts?.map((ReviewData: TVendorProductReview) => (
      <tr key={ReviewData.id} className="border-b">
        <td className="p-4 text-center"> {ReviewData?.product?.name} </td>
        <td className="p-4 text-center">
          <div className="img flex justify-center items-center ">
            <img
              src={ReviewData?.product?.productImg}
              className=" size-[4.5rem] rounded-md overflow-auto    "
              alt=""
            />
          </div>
        </td>
        <td className="p-4 text-center"> {ReviewData?.user?.username} </td>
        <td className="p-4 text-center"> {ReviewData?.rating} </td>
        <td className="p-4 text-center"> {ReviewData?.comment} </td>

        <td className="p-4 text-center">
          {format(new Date(ReviewData?.updatedAt), "dd-MMM-yyyy")}{" "}
        </td>
      </tr>
    ));
  }

  return (
    <div className="VendorCustomerReviewContainer">
      <div className="VendorCustomerReviewWrapper bg-gray-100  shadow rounded-md p-3  ">
        <h3 className="brand text-2xl font-medium mb-6 ">
          Monitor Customer Review
        </h3>

        {/*Customer Review  table starts  */}
        <div className="manageUserTable relative w-full overflow-auto mt-4 ">
          <table className="w-full text-sm ">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100  ">
                <th className="px-4 font-medium">Product Name </th>
                <th className="px-4 font-medium">Product Image </th>
                <th className="px-4 font-medium">Customer </th>
                <th className="px-4 font-medium">Rating </th>
                <th className="px-4 font-medium">Review </th>
                <th className="px-4 font-medium">Review Data </th>
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
        {/* Customer Review  table ends  */}

        {/*  */}
      </div>
    </div>
  );
};

export default VendorCustomerReview;
