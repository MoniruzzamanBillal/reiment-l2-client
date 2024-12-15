type TMessageProps = {
  message: string;
};

const TableDataError = ({ message }: TMessageProps) => {
  return (
    <div className="bg-red-200 py-4 text-red-700 rounded  w-full">
      <span className="block  font-medium text-lg ">{message}</span>
    </div>
  );
};

export default TableDataError;
