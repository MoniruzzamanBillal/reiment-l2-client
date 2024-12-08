import { useNavigate } from "react-router-dom";

const NoCartItem = () => {
  const navigate = useNavigate();

  return (
    <div className="NoCartItemContainer py-8 ">
      <div className="    flex  robotoFont flex-col items-center justify-center   px-4">
        <h1 className=" text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          No products in the cart
        </h1>

        <button
          className=" mt-6 bg-violet-600 hover:bg-violet-800 py-2 px-5 rounded text-white font-semibold "
          onClick={() => navigate("/")}
        >
          Go back to shooping page
        </button>
      </div>
    </div>
  );
};

export default NoCartItem;
