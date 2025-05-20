/* eslint-disable @typescript-eslint/no-explicit-any */
import Wrapper from "@/components/shared/Wrapper";
import { removeFromComparison } from "@/redux/features/product/product.slice";
import { useAppSelector } from "@/redux/hook";
import { useDispatch } from "react-redux";

const ComparisonTable = () => {
  const comparisonProducts = useAppSelector(
    (state) => state?.comparison?.products
  );

  // console.log(comparisonProducts);

  const dispatch = useDispatch();

  return (
    <div className="ComparisonTableContainer py-8 bg-gray-100  ">
      <Wrapper>
        <p className="  text-3xl font-semibold mb-6  ">Product Comparison : </p>

        {/*  */}
        <div className="comparison-table pt-2 ">
          {comparisonProducts.length === 0 ? (
            <div className="noProduct  min-h-screen w-full flex justify-center items-center ">
              <p className=" text-3xl font-semibold text-prime100 ">
                No products selected for comparison
              </p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  {comparisonProducts.map((product) => (
                    <th key={product.id}>
                      {product.name}
                      <button
                        onClick={() =>
                          dispatch(removeFromComparison(product.id))
                        }
                        className=" pl-4 text-red-600 hover:text-red-700 "
                      >
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/*  */}
                <tr>
                  <td>Shop Name </td>
                  {comparisonProducts.map((product: any) => (
                    <td key={product.id}>{product?.shop?.name}</td>
                  ))}
                </tr>
                {/*  */}

                {/*  */}
                <tr>
                  <td>Price</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id}>{product.price}</td>
                  ))}
                </tr>
                {/*  */}

                {/*  */}
                <tr>
                  <td>Product Image</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className=" text-center ">
                      <div className="div   flex  justify-center items-center ">
                        <img
                          src={product.productImg}
                          className=" size-[5.4rem] rounded-md overflow-auto "
                          alt=""
                        />
                      </div>
                    </td>
                  ))}
                </tr>
                {/*  */}

                <tr>
                  <td>Inventory</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id}>{product.inventoryCount}</td>
                  ))}
                </tr>
                <tr>
                  <td>Discount</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id}>{product.discount || "N/A"}</td>
                  ))}
                </tr>
                {/* Add more rows for other attributes as needed */}
              </tbody>
            </table>
          )}
        </div>
        {/*  */}
      </Wrapper>
    </div>
  );
};

export default ComparisonTable;
