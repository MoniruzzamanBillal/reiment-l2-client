/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";

const CategoryCard = ({ category }: { category: any }) => {
  return (
    <div className="categoryCardContainer m-auto  flex justify-center  ">
      <Link to={`/products?ParamCategory=${category?.value}`}>
        {/* image section  */}
        <div className="imgSection  flex justify-center items-center   ">
          <div className="imgContainer  size-[8rem] rounded-full overflow-auto     ">
            <img
              className=" w-full h-full  cursor-pointer  object-cover "
              src={category?.categoryImg}
              alt="Bordered avatar"
            />
          </div>
        </div>

        {/* name section  */}
        <div className="nameSection">
          <h1 className=" m-2 text-lg text-center font-medium cursor-pointer dark:text-gray-100 ">
            {category?.name}
          </h1>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
