import Wrapper from "@/components/shared/Wrapper";
import { useGetAllProductQuery } from "@/redux/features/product/product.api";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { useEffect, useState } from "react";
import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";
import NoProduct from "../NoProduct";
import { useGetLoggedInUserQuery } from "@/redux/features/user/user.api";

type TCategory = {
  id: string;
  name: string;
};

const HomeProducts = () => {
  const { data: userData } = useGetLoggedInUserQuery(undefined);

  const { data: categoryData, isLoading: categoryDataLoading } =
    useGetAllCategoryQuery(undefined);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // console.log(categoryData?.data);
  // console.log(categoryOptions);
  console.log(userData?.data);

  const [pcategory, setpPcategory] = useState("");
  const [params, setParams] = useState<Record<string, unknown> | undefined>(
    undefined
  );

  const { data: allProducts, isLoading: productDataLoading } =
    useGetAllProductQuery(params);

  // console.log(allProducts?.data);

  //! Use effect to track param value
  useEffect(() => {
    const updateParam = () => {
      const newParam: Record<string, unknown> = {};

      if (pcategory) {
        newParam.categoryId = pcategory;
      }
      if (userData?.data) {
        newParam.userId = userData?.data?.id;
      }

      setParams(newParam);
    };

    updateParam();
  }, [pcategory, userData?.data]);

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
    <div className="HomeProductsContainer">
      <Wrapper className="HomeProductsWrapper">
        {/* heading section  */}
        <div className="headingSection flex justify-between items-center ">
          <h1 className=" mb-8 font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
            Just For You
          </h1>

          <Link
            to={"/products"}
            className=" font-medium text-prime100 hover:bg-prime100 hover:text-gray-50 py-2 px-4 rounded-md "
          >
            Show more
          </Link>
        </div>
        {/* heading section  */}

        <div className="bodySection flex  gap-x-4 ">
          {/* left category section starts  */}
          <div className="leftCategory  ">
            {/* category input starts  */}

            <div className="categoryInput bg-gray-100 shadow-md rounded border border-gray-300 py-2 px-4">
              <h1 className="font-medium mb-2 text-gray-800">Category :</h1>
              <ul className="text-sm font-medium text-gray-800">
                {categoryOptions &&
                  categoryOptions?.map(
                    (item: { name: string; value: string }) => (
                      <li className="w-full border-b border-gray-300">
                        <div className="flex items-center ps-3">
                          <input
                            id={item?.value}
                            type="radio"
                            value={item?.value}
                            onChange={() => setpPcategory(item?.value)}
                            checked={pcategory === item.value}
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
                    )
                  )}
              </ul>
            </div>
            {/* *  category input  ends   */}
          </div>
          {/* left category section ends  */}

          {/* right section starts  */}
          <div className="rightSection  ">
            <div className="products  grid grid-cols-1 sm:grid-cols-2 xmd:grid-cols-3 gap-x-5 gap-y-8">
              {allProducts?.data?.length === 0 ? (
                <NoProduct />
              ) : (
                allProducts?.data &&
                allProducts?.data?.map((product) => (
                  <ProductCard product={product} key={product?.id} />
                ))
              )}

              {/* {allProducts?.data &&
                allProducts?.data?.map((product) => (
                  <ProductCard product={product} key={product?.id} />
                ))} */}
            </div>
          </div>
          {/* right section ends  */}

          {/*  */}
        </div>
      </Wrapper>
    </div>
  );
};

export default HomeProducts;
