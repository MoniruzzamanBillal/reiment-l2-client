const VendorOderHistory = () => {
  const content = null;

  return (
    <div className="VendorOderHistoryContainer">
      <div className="VendorOderHistoryWrapper bg-gray-100  shadow rounded-md p-3  ">
        <h3 className="brand text-2xl font-medium mb-6 ">
          Monitor Order History
        </h3>

        {/*order history table starts  */}
        <div className="manageUserTable relative w-full overflow-auto mt-4 ">
          <table className="w-full text-sm ">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100  ">
                <th className="px-4 font-medium">Customer Name </th>
                <th className="px-4 font-medium">Product Name </th>
                <th className="px-4 font-medium">Quantity </th>
                <th className="px-4 font-medium">Total Price </th>
                <th className="px-4 font-medium">Order Data </th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
        {/* order history table ends  */}

        {/*  */}
      </div>
    </div>
  );
};

export default VendorOderHistory;
