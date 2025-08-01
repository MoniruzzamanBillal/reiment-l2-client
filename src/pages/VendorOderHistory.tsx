import { TableDataError, TableDataLoading } from "@/components/ui";
import { useGetVendorOrderHistoryQuery } from "@/redux/features/order/order.api";
import { format } from "date-fns";

type TOrderHistory = {
  id: string;
  customerId: string;
  customer: {
    id: string;
    username: string;
    email: string;
    profileImg: string;
    password: string;
    role: string;
    status: string;
  };
  orderItem: {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
  }[];
  status: string;
  totalPrice: number;
  trxnNumber: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};

const VendorOderHistory = () => {
  let content = null;

  const {
    data: vendorOrderHistoryData,
    isLoading: vendorOrderHistoryDataLoading,
    isError: vendorOrderHistoryDataError,
  } = useGetVendorOrderHistoryQuery(undefined);

  console.log(vendorOrderHistoryData?.data?.length);

  // *  if data is loading
  if (vendorOrderHistoryDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  // *  if any error
  if (!vendorOrderHistoryDataLoading && vendorOrderHistoryDataError) {
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
    !vendorOrderHistoryDataLoading &&
    !vendorOrderHistoryDataError &&
    vendorOrderHistoryData?.data?.length < 1
  ) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Nothing Found" />
        </td>
      </tr>
    );
  }

  if (
    !vendorOrderHistoryDataLoading &&
    !vendorOrderHistoryDataError &&
    vendorOrderHistoryData?.data?.length
  ) {
    content = vendorOrderHistoryData?.data?.map(
      (orderHistory: TOrderHistory) => (
        <tr key={orderHistory.id} className="border-b">
          <td className="p-4 text-center">
            {" "}
            {orderHistory?.customer?.username}{" "}
          </td>
          <td className="p-4 text-center"> {orderHistory?.totalPrice} </td>
          <td className="p-4 text-center"> {orderHistory?.trxnNumber} </td>
          <td className="p-4 text-center">
            {" "}
            {format(new Date(orderHistory?.updatedAt), "dd-MMM-yyyy")}{" "}
          </td>
        </tr>
      )
    );
  }

  return (
    <div className="VendorOderHistoryContainer">
      <div className="VendorOderHistoryWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-3  ">
        <h3 className="brand text-2xl font-medium mb-6 ">
          Monitor Order History
        </h3>

        {/*order history table starts  */}
        <div className="manageUserTable relative w-full overflow-auto mt-4 ">
          <table className="w-full text-sm ">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100  ">
                <th className="px-4 font-medium">Customer Name </th>
                <th className="px-4 font-medium">Total Price </th>
                <th className="px-4 font-medium">Transaction number</th>
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
