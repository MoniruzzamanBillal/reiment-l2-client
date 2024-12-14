import { TableDataError, TableDataLoading } from "@/components/ui";
import { useGetUserOrderHistoryQuery } from "@/redux/features/order/order.api";
import { format } from "date-fns";

const CustomerOrderHistory = () => {
  const {
    data: userOrderData,
    isLoading: orderDataLoading,
    isError: orderDataError,
  } = useGetUserOrderHistoryQuery(undefined);

  // console.log(userOrderData?.data);

  let content = null;

  // *  if data is loading
  if (orderDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  // *  if any error
  if (!orderDataLoading && orderDataError) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Something went wrong " />
        </td>
      </tr>
    );
  }

  // * for no data
  if (!orderDataLoading && !orderDataError && userOrderData?.data?.length < 1) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Nothing Found" />
        </td>
      </tr>
    );
  }

  if (!orderDataLoading && !orderDataError && userOrderData?.data?.length) {
    content = userOrderData?.data?.map((orderHistory) => (
      <tr key={orderHistory.id} className="border-b">
        <td className="p-4 text-center"> {orderHistory?.trxnNumber} </td>
        <td className="p-4 text-center">{orderHistory?.totalPrice}</td>
        <td className="p-4 text-center">
          {format(new Date(orderHistory?.updatedAt), "dd-MMM-yyyy")}
        </td>
      </tr>
    ));
  }

  return (
    <div className="CustomerOrderHistoryContainer">
      <div className="CustomerOrderHistoryWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-3  ">
        <h3 className="brand text-2xl font-medium mb-6 ">Order History </h3>

        {/*Followed shop table starts  */}
        <div className="manageUserTable relative w-full overflow-auto mt-4 ">
          <table className="w-full text-sm ">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100  ">
                <th className="px-4 font-medium">Transaction Number </th>
                <th className="px-4 font-medium">Total Price </th>
                <th className="px-4 font-medium">Order Date </th>
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
