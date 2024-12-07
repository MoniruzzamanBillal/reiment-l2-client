const VendorCustomerReview = () => {
  const content = null;

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
                <th className="px-4 font-medium">Order Data </th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
        {/* Customer Review  table ends  */}

        {/*  */}
      </div>
    </div>
  );
};

export default VendorCustomerReview;
