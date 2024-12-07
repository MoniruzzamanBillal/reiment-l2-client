const ManageShop = () => {
  const content = null;

  return (
    <div className="ManageShopContainer">
      <div className="ManageShopWrapper bg-gray-100  shadow rounded-md p-3  ">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Shop </h3>

        {/*manage shop table starts  */}
        <div className="manageUserTable relative w-full overflow-auto mt-4 ">
          <table className="w-full text-sm ">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100  ">
                <th className="px-4 font-medium">Name</th>
                <th className="px-4 font-medium">Logo </th>
                <th className="px-4 font-medium">Vendor </th>
                <th className="px-4 font-medium">Status </th>
                <th className="px-4 font-medium">Block Shop </th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
        {/* manage shop table ends  */}

        {/*  */}
      </div>
    </div>
  );
};

export default ManageShop;
