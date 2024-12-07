const MonitorTransaction = () => {
  const content = null;

  return (
    <div className="MonitorTransactionContainer">
      <div className="MonitorTransactionWrapper bg-gray-100  shadow rounded-md p-3  ">
        <h3 className="brand text-2xl font-medium mb-4 ">
          {" "}
          Monitor Transaction{" "}
        </h3>

        {/*manage transaction table starts  */}
        <div className="manageUserTable relative w-full overflow-auto mt-4 ">
          <table className="w-full text-sm ">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100  ">
                <th className="px-4 font-medium">Transaction user </th>
                <th className="px-4 font-medium">Transaction number </th>
                <th className="px-4 font-medium">Transaction amount </th>
                <th className="px-4 font-medium">Transaction date </th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
        {/* manage transaction table ends  */}

        {/*  */}
      </div>
    </div>
  );
};

export default MonitorTransaction;
