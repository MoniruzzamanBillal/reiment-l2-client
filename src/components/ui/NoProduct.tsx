const NoProduct = () => {
  return (
    <div className="   h-[60vh] w-[90vw] xl:w-[62vw]  flex  robotoFont mt-6 flex-col items-center justify-center   px-4">
      <h1 className=" text-3xl sm:text-4xl font-bold text-prime50 mb-4">
        No products available
      </h1>
      <p className="text-gray-600 text-base sm:text-lg mb-8">
        We run out of product.We will notify you when we get stock.
      </p>
    </div>
  );
};

export default NoProduct;
