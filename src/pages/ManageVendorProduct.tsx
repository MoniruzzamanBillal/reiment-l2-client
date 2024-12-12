import DeleteModal from "@/components/shared/DeleteModal";
import {
  FormSubmitLoading,
  TableDataError,
  TableDataLoading,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { TVendorProduct } from "@/constants/vendor";
import {
  useDeleteProductMutation,
  useDuplicateProductMutation,
  useGetVendorShopProductsQuery,
} from "@/redux/features/product/product.api";
import { useGetVendorShopQuery } from "@/redux/features/shop/shop.api";

import { Link } from "react-router-dom";
import { toast } from "sonner";

const alertMessage =
  " This action cannot be undone. This will permanently delete the Product .";

const ManageVendorProduct = () => {
  let content = null;

  const { data: vendorShopData } = useGetVendorShopQuery(undefined);

  const {
    data: productData,
    isLoading: productDataLoading,
    isError: productDataError,
    refetch: prodDataRefetch,
  } = useGetVendorShopProductsQuery(vendorShopData?.data?.id, {
    skip: !vendorShopData?.data?.id,
  });

  const [deleteProduct, { isLoading: productDeleteLoading }] =
    useDeleteProductMutation();

  const [duplicateProduct, { isLoading: productDuplicatingLoading }] =
    useDuplicateProductMutation();

  // console.log(productData?.data);

  // ! for deleting product
  const handleDeleteProduct = async (prodId: string) => {
    try {
      const taostId = toast.loading("Deleting product....");
      const result = await deleteProduct(prodId);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: taostId,
          duration: 1400,
        });
      }

      // * for successful insertion
      if (result?.data) {
        const successMsg = result?.data?.message;

        prodDataRefetch();

        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting product!!!", {
        duration: 1400,
      });
    }
  };

  // ! for duplicating a product
  const handleDuplicateProduct = async (product: TVendorProduct) => {
    const {
      shopId,
      categoryId,
      name,
      price,
      description,
      inventoryCount,
      productImg,
    } = product;

    const payload = {
      shopId,
      categoryId,
      name,
      price,
      description,
      inventoryCount,
      productImg,
    };

    try {
      const taostId = toast.loading("Duplicating Product....");
      const result = await duplicateProduct(payload);

      console.log(result?.data);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: taostId,
          duration: 1400,
        });
      }

      // * for successful insertion
      if (result?.data) {
        prodDataRefetch();
        const successMsg = result?.data?.message;

        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while duplicating product !!!", {
        duration: 1400,
      });
    }
  };

  // *  if data is loading
  if (productDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  // *  if any error
  if (!productDataLoading && productDataError) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Something went wrong " />
        </td>
      </tr>
    );
  }

  // * for no data
  if (
    !productDataLoading &&
    !productDataError &&
    productData?.data?.length < 1
  ) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Nothing Found" />
        </td>
      </tr>
    );
  }

  // * Render product data
  if (!productDataLoading && !productDataError && productData?.data?.length) {
    content = productData?.data?.map((product: TVendorProduct) => (
      <tr key={product.id} className="border-b">
        <td className="p-4 text-center">{product.name}</td>
        <td className="p-4 text-center">
          <img
            src={product.productImg as string}
            alt={product.name}
            className="w-16 h-16 object-cover rounded "
          />
        </td>
        <td className="p-4 text-center">{product?.category?.name}</td>
        <td className="p-4 text-center">${product?.price}</td>

        <td className="p-4 text-center">{product?.inventoryCount}</td>
        <td className="p-4 text-center">{product?.shop?.name}</td>
        <td className="p-4 text-center">
          <Link to={`/dashboard/vendor/update-products/${product.id}`}>
            <Button className="px-4 font-semibold text-sm bg-prime100 hover:bg-prime100 active:scale-95 duration-500">
              Update
            </Button>
          </Link>
        </td>
        <td className="p-4 text-center">
          <DeleteModal
            id={product.id}
            handleDeleteFunction={handleDeleteProduct}
            alertMessage={alertMessage}
          />
        </td>
        <td className="p-4 text-center">
          <Button
            onClick={() => handleDuplicateProduct(product)}
            className="px-4 font-semibold text-sm bg-prime100 hover:bg-prime100 active:scale-95 duration-500"
          >
            Duplicate
          </Button>
        </td>
      </tr>
    ));
  }

  return (
    <>
      {(productDataLoading ||
        productDeleteLoading ||
        productDuplicatingLoading) && <FormSubmitLoading />}

      <div className="ManageVendorProductContainer">
        <div className="ManageVendorProductWrapper bg-gray-100 border border-gray-300  shadow rounded-md p-3  ">
          <h3 className="brand text-2xl font-medium mb-4 "> Manage Product </h3>

          {/* new category add  container starts  */}
          <div className="addNewProduct mb-6 ">
            <Link to={"/dashboard/vendor/add-products"}>
              <Button className=" px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base bg-prime50 hover:bg-prime100 active:scale-95 duration-500 ">
                Add Product
              </Button>
            </Link>

            {/*  */}
          </div>
          {/* new category add  container ends */}

          {/*manage product  table starts  */}
          <div className="manageUserTable relative w-full overflow-auto mt-4 ">
            <table className="w-full text-sm ">
              <thead className="border-b">
                <tr className="w-full text-sm bg-sky-100  ">
                  <th className="px-4 font-medium">Name</th>
                  <th className="px-4 font-medium">Image </th>
                  <th className="px-4 font-medium">Category </th>
                  <th className="px-4 font-medium">Price </th>

                  <th className="px-4 font-medium">Inventory Count </th>
                  <th className="px-4 font-medium">Shop Name </th>
                  <th className="px-4 font-medium">Update Product </th>
                  <th className="px-4 font-medium">Delete Product </th>
                  <th className="px-4 font-medium">Duplicate </th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
          {/* manage product  table ends  */}

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default ManageVendorProduct;
