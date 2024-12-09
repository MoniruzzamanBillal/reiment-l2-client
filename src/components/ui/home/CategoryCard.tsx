import { Link } from "react-router-dom";

const CategoryCard = ({ product }) => {
  return (
    <div className="categoryCardContainer m-auto  flex justify-center  ">
      <Link to={`/products/${product?.productName}`}>
        <div className="categoryCard bg-gray-100 border border-gray-200  w-[11rem]  flex flex-col justify-center items-center  shadow-md rounded-t-lg overflow-auto  ">
          <div className="imgContainer  h-[8.2rem]   ">
            <img
              className=" w-full h-full  cursor-pointer "
              src={product?.productIMG}
              alt="Bordered avatar"
            />
          </div>

          <h1 className=" m-2 text-lg font-medium cursor-pointer dark:text-gray-100 ">
            {product?.productName}
          </h1>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
