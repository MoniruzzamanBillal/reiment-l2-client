import Image from "next/image";
import Link from "next/link";

type TCategoryOption = {
  name: string;
  value: string;
  categoryImg: string;
};

const CategoryCard = ({ category }: { category: TCategoryOption }) => {
  return (
    <div className="categoryCardContainer m-auto flex justify-center group duration-200">
      <Link href={`/products?ParamCategory=${category.value}`}>
        <div className="imgSection flex justify-center items-center">
          <div className="imgContainer size-[8rem] rounded-full overflow-hidden relative ring-2 ring-transparent group-hover:ring-indigo-300 group-hover:ring-offset-2 transition-all duration-200">
            <Image
              src={category.categoryImg}
              alt={category.name}
              fill
              className="object-cover cursor-pointer"
              sizes="128px"
            />
          </div>
        </div>
        <div className="nameSection">
          <h1 className="m-2 text-sm text-center font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors cursor-pointer">
            {category.name}
          </h1>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
