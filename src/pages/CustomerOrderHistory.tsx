const CustomerOrderHistory = () => {
  const content = null;

  return (
    <div className="CustomerOrderHistoryContainer">
      <div className="CustomerOrderHistoryWrapper bg-gray-100  shadow rounded-md p-3  ">
        <h3 className="brand text-2xl font-medium mb-6 ">Order History </h3>

        {/*Followed shop table starts  */}
        <div className="manageUserTable relative w-full overflow-auto mt-4 ">
          <table className="w-full text-sm ">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100  ">
                <th className="px-4 font-medium">Transaction Number </th>
                <th className="px-4 font-medium">Total Price </th>
                <th className="px-4 font-medium">Order Date </th>
                <th className="px-4 font-medium">Order Items </th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
        {/* Followed shop table ends  */}

        {/*  */}
      </div>
    </div>
  );
};

export default CustomerOrderHistory;
