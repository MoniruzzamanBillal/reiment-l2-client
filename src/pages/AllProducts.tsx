import Wrapper from "@/components/shared/Wrapper";
import {
  NoProduct,
  ProductCard,
  ProductCardSkeleton,
  ProductsFilter,
} from "@/components/ui";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetAllProductQuery } from "@/redux/features/product/product.api";
import { TProductDetail } from "@/types/globalTypes";
import useDebounce from "@/utils/DebounceTerm";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const AllProducts = () => {
  const [searchParams] = useSearchParams();
  const paramSearchTerm = searchParams.get("paramSearchTerm");
  const ParamCategory = searchParams.get("ParamCategory");

  const [searchTerm, setSearchTerm] = useState("");
  const [pprice, setPprice] = useState<number | null>(null);
  const [pcategory, setpPcategory] = useState("");
  const [sort, setSortBy] = useState("");
  const [params, setParams] = useState<Record<string, unknown> | undefined>(
    undefined
  );

  const debounceTerm = useDebounce(searchTerm, 400);

  const [isXl, setIsXl] = useState(false);

  const { data: allProducts, isLoading: productDataLoading } =
    useGetAllProductQuery(params);

  // console.log(allProducts?.data);

  //   ! for reseting all filter category
  const handleAddReset = () => {
    setParams(undefined);
    setSearchTerm("");
    setPprice(null);
    setSortBy("");
    setpPcategory("");
  };

  // ! to set category if parameter exists
  useEffect(() => {
    if (ParamCategory) {
      setpPcategory(ParamCategory);
    }
  }, [ParamCategory]);

  // ! to set searchterm if  exists
  useEffect(() => {
    if (paramSearchTerm) {
      setSearchTerm(paramSearchTerm);
    }
  }, [paramSearchTerm]);

  //! Use effect to track param value
  useEffect(() => {
    const updateParam = () => {
      const newParam: Record<string, unknown> = {};

      if (debounceTerm) {
        newParam.searchTerm = debounceTerm;
      }

      if (pprice) {
        newParam.priceRange = pprice;
      }
      if (pcategory) {
        newParam.categoryId = pcategory;
      }
      if (sort) {
        newParam.sortBy = "price";
        newParam.sortOrder = sort;
      }

      setParams(newParam);
    };

    updateParam();
  }, [searchTerm, pprice, pcategory, sort, debounceTerm]);

  useEffect(() => {
    const handleResize = () => {
      setIsXl(window.innerWidth >= 1280);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="AllProductsContainer bg-gray-100 py-4 min-h-screen ">
        <Wrapper className=" AllProductsWrapper ">
          {/* search section   */}
          <div className="searchSection bg-gray-50 border border-gray-300  w-[40%] m-auto py-1 px-5 rounded-full flex justify-center items-center mb-5  ">
            <Input
              type="text"
              placeholder="Looking for...."
              className=" border-none "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* search section ends  */}

          {/* content body starts  */}
          <div className="contentBody  flex justify-between gap-x-3 ">
            {/* left section starts  */}

            {/* filter section   */}
            <div className="contentLeft w-0 xl:w-[30%] hidden xl:block  ">
              <ProductsFilter
                priceRange={pprice}
                category={pcategory}
                setPriceRange={setPprice}
                setCategory={setpPcategory}
                handleAddReset={handleAddReset}
              />
              {/*  */}
            </div>
            {/* left section ends  */}

            {/* right section starts  */}
            {/* products section  */}
            <div className="contentRight w-[100%] xl:w-[70%] flex flex-col gap-y-4 ">
              {/* content top section  */}
              <div className="contentTop bg-gray-50 shadow-md rounded border border-gray-300 py-2 px-4 flex justify-between items-center ">
                {/* Conditional rendering of ProductsFilter */}
                {!isXl ? (
                  <Sheet>
                    <SheetTrigger>
                      <div className="filterMenuIcon flex justify-between items-center gap-x-1 cursor-pointer ">
                        {/* icon starts  */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                          />
                        </svg>

                        {/* icon ends */}
                        <p className=" font-medium  ">Filter</p>
                      </div>
                    </SheetTrigger>
                    <SheetContent>
                      <ProductsFilter
                        priceRange={pprice}
                        category={pcategory}
                        setPriceRange={setPprice}
                        setCategory={setpPcategory}
                        handleAddReset={handleAddReset}
                      />
                    </SheetContent>
                  </Sheet>
                ) : (
                  <h1 className=" text-lg font-medium ">Product name </h1>
                )}

                {/* sort input section starts  */}
                <div className="sortSection  flex  justify-between items-center gap-x-1 ">
                  <p className="text-gray-600 "> sort by : </p>

                  {/* input section  */}
                  <Select
                    value={sort}
                    onValueChange={(value) => setSortBy(value)}
                  >
                    <SelectTrigger className="w-[14rem]  outline-none border-gray-400 ring-0 focus:ring-0  ">
                      <SelectValue placeholder="sort by price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Low to High</SelectItem>
                      <SelectItem value="desc">High to Low </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* sort input section ends  */}

                {/*  */}
              </div>
              {/* content top section ends */}

              {/* products content starts  */}
              <div className="productsContent  py-3 px-4 ">
                {/* all products  */}
                <div className="allProducts grid grid-cols-1 sm:grid-cols-2 xmd:grid-cols-3 gap-x-5 gap-y-8 ">
                  {productDataLoading &&
                    Array.from({ length: 6 })?.map((_, ind) => (
                      <ProductCardSkeleton key={ind} />
                    ))}

                  {allProducts?.data?.length === 0 ? (
                    <NoProduct />
                  ) : (
                    allProducts?.data &&
                    allProducts?.data?.map((product: TProductDetail) => (
                      <ProductCard product={product} key={product?.id} />
                    ))
                  )}
                </div>
              </div>
              {/* products content ends */}

              {/*  */}
            </div>
            {/* right section ends  */}

            {/*  */}
          </div>
          {/* content body ends   */}
        </Wrapper>
      </div>
    </>
  );
};

export default AllProducts;
