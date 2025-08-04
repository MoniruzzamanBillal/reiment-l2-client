import { TableDataError, TableDataLoading } from "@/components/ui";
import { useGetAllTransactionDataQuery } from "@/redux/features/order/order.api";
import { format } from "date-fns";

type TCustomer = {
  id: string;
  username: string;
  email: string;
  profileImg: string;
  password: string;
  role: string;
  status: string;
};

type TOrderHistory = {
  id: string;
  customerId: string;
  customer: TCustomer;
  isDelated: boolean;
  status: string;
  totalPrice: number;
  trxnNumber: string;
  createdAt: string;
  updatedAt: string;
};

const MonitorTransaction = () => {
  let content = null;

  const {
    data: transactionData,
    isLoading: transactionDataLoading,
    isError: transactionDataError,
  } = useGetAllTransactionDataQuery(undefined);

  // *  if data is loading
  if (transactionDataLoading) {
    content = (
      <tr>
        <td colSpan={4} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  // *  if any error
  if (!transactionDataLoading && transactionDataError) {
    content = (
      <tr>
        <td colSpan={4}>
          <TableDataError message="Something went wrong" />
        </td>
      </tr>
    );
  }

  // * for no data
  if (
    !transactionDataLoading &&
    !transactionDataError &&
    transactionData?.data?.length < 1
  ) {
    content = (
      <tr>
        <td colSpan={4}>
          <TableDataError message="No transactions found" />
        </td>
      </tr>
    );
  }

  // * if data exists
  if (
    !transactionDataLoading &&
    !transactionDataError &&
    transactionData?.data?.length
  ) {
    content = transactionData?.data?.map((transaction: TOrderHistory) => (
      <tr key={transaction.id} className="border-b">
        <td className="p-4 text-center">{transaction?.customer?.username}</td>
        <td className="p-4 text-center">{transaction?.trxnNumber}</td>
        <td className="p-4 text-center">${transaction?.totalPrice}</td>
        <td className="p-4 text-center">
          {format(new Date(transaction?.createdAt), "dd-MMM-yyyy")}
        </td>
      </tr>
    ));
  }

  return (
    <div className="MonitorTransactionContainer">
      <div className="MonitorTransactionWrapper bg-gray-100  border border-gray-300 shadow rounded-md p-3  ">
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
