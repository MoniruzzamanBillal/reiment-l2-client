const NoProduct = ({ message = "No products found" }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

export default NoProduct;
