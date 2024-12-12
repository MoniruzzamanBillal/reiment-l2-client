import { ReimentForm, ReimentInput } from "@/components/form";
import { FormSubmitLoading, TableDataLoading } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { z } from "zod";
import { FieldValues } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useGetVendorShopQuery,
  useUpdateShopMutation,
} from "@/redux/features/shop/shop.api";

const UpdateShop = () => {
  let defaultValues;
  let content;

  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    throw new Error("Something went wrong!! ");
  }

  const { data: shopData, isLoading: shopDataLoading } =
    useGetVendorShopQuery(undefined);

  const [updateShop, { isLoading: shopDataUpdatingLoading }] =
    useUpdateShopMutation();

  defaultValues = {
    name: shopData?.data?.name,
    logo: shopData?.data?.logo,
    description: shopData?.data?.description,
  };

  // ! for updating a shop
  const handleUpdateShop = async (data: FieldValues) => {
    const { logo, name, description } = data;

    const payload = {
      name,
      description,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));

    if (logo) {
      formData.append("logo", logo);
    }

    try {
      const taostId = toast.loading("Updating shop....");
      const result = await updateShop({ formData, id: shopData?.data?.id });

      // console.log(result);

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

        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });

        setTimeout(() => {
          navigate("/dashboard/vendor/manage-shop");
        }, 700);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating shop data  !!!", {
        duration: 1400,
      });
    }
  };

  if (shopDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  } else {
    content = (
      <ReimentForm onSubmit={handleUpdateShop} defaultValues={defaultValues}>
        <ReimentInput
          type="text"
          label="Shop Name :"
          name="name"
          placeholder="Enter Shop Name"
        />
        <ReimentInput type="file" label="Shop Logo :" name="logo" />

        <ReimentInput
          type="text"
          label="Shop Description :"
          name="description"
          placeholder="Enter Shop Description"
        />

        <Button
          className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime50 hover:bg-prime100`}
        >
          Update Shop
        </Button>
      </ReimentForm>
    );
  }

  useEffect(() => {
    if (shopData?.data) {
      defaultValues = {
        name: shopData?.data?.name,
        logo: shopData?.data?.logo,
        description: shopData?.data?.description,
      };
    }
  }, [shopData?.data]);

  return (
    <>
      {(shopDataLoading || shopDataUpdatingLoading) && <FormSubmitLoading />}

      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Update Shop
          </h1>

          {/* add category form container starts */}
          <div className="addCategoryForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            {/* form starts */}
            {content}
            {/* form ends */}
          </div>
          {/* add category form container ends */}
        </div>
      </div>
    </>
  );
};

export default UpdateShop;
