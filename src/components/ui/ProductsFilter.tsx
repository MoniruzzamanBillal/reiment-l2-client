import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";
import { Button } from "./button";
import { Slider } from "./slider";
import { useEffect, useState } from "react";

type TCategory = {
  id: string;
  name: string;
};

interface TProductsFilterProps {
  priceRange: number | null;
  category: string;

  setPriceRange: (range: number) => void;
  setCategory: (category: string) => void;
  handleAddReset: () => void;
}

const ProductsFilter = ({
  priceRange,
  category,
  setPriceRange,
  setCategory,
  handleAddReset,
}: TProductsFilterProps) => {
  const { data: categoryData, isLoading: categoryDataLoading } =
    useGetAllCategoryQuery(undefined);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // console.log(categoryData?.data);

  //   ! effect for get category data
  useEffect(() => {
    if (categoryData?.data) {
      const modifiedData = categoryData?.data?.map((item: TCategory) => {
        const optionValue = {
          name: item?.name,
          value: item?.id,
        };

        return optionValue;
      });

      const initialData = {
        name: "All",
        value: "",
      };

      setCategoryOptions([initialData, ...modifiedData]);
    }
  }, [categoryData?.data, categoryDataLoading]);

  return (
    <div className="ProductsFilterContainer flex flex-col gap-y-6">
      <h1 className=" mb-3   font-semibold text-indigo-500 text-lg xsm:text-xl sm:text-3xl md:text-2xl xl:text-3xl text-shadow-blue">
        Filtered By :
      </h1>
      {/*  price range type starts   */}
      <div className="priceRange bg-gray-50 shadow-md rounded border border-gray-300 py-2 px-4">
        <h1 className="font-medium mb-6 text-gray-800">Price Range :</h1>

        <div className="priceRangeInput">
          <Slider
            value={[priceRange ?? 0]}
            onValueChange={(value) => setPriceRange(value[0])}
            max={5000}
            step={1}
            className="w-full h-2 accent-red-500 rounded-lg "
          />

          {/* price labal   */}
          <div className="priceLabel mt-2 text-lg font-medium text-gray-800 flex justify-between">
            <span>0</span>
            <span>{priceRange ? priceRange : 1000}</span>
          </div>
        </div>

        {/*  */}
      </div>
      {/* price range type ends   */}

      {/* category input starts  */}

      <div className="categoryInput bg-gray-50 shadow-md rounded border border-gray-300 py-2 px-4">
        <h1 className="font-medium mb-2 text-gray-800">Category :</h1>
        <ul className="text-sm font-medium text-gray-800">
          {categoryOptions &&
            categoryOptions?.map((item: { name: string; value: string }) => (
              <li className="w-full border-b border-gray-300">
                <div className="flex items-center ps-3">
                  <input
                    id={item?.value}
                    type="radio"
                    value={item?.value}
                    onChange={() => setCategory(item?.value)}
                    checked={category === item.value}
                    name="list-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                  />
                  <label
                    htmlFor={item?.value}
                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                  >
                    {item?.name}
                  </label>
                </div>
              </li>
            ))}
        </ul>
      </div>
      {/* * car type input ends   */}

      {/* reset btn  */}
      <div className="resetBtn w-[98%] m-auto   ">
        <Button
          className="bg-red-600 hover:bg-red-700 hover:shadow-md hover:scale-[1.02] active:scale-100 duration-200 w-full  "
          onClick={() => handleAddReset()}
        >
          Reset
        </Button>
      </div>
      {/* reset btn  */}

      {/*  */}
    </div>
  );
};

export default ProductsFilter;
