/* eslint-disable @typescript-eslint/no-explicit-any */
import DeleteModal from "@/components/shared/DeleteModal";
import {
  FormSubmitLoading,
  TableDataError,
  TableDataLoading,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  useDeleteCouponMutation,
  useGetAllCouponQuery,
} from "@/redux/features/cupon/coupon.api";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const alertMsg =
  "This action cannot be undone. This will permanently delete the coupon";

const ManageCoupon = () => {
  const {
    data: couponData,
    isLoading: couponDataLoading,
    isError: couponDataError,
    refetch: couponDataRefetch,
  } = useGetAllCouponQuery(undefined);

  const [deleteCoupon, { isLoading: couponDeleteLoading }] =
    useDeleteCouponMutation();

  console.log(couponData?.data);

  // ! for deleting a coupon
  const handleDeleteCoupon = async (id: string) => {
    try {
      const toastId = toast.loading("Deleting Coupon...");

      const result = await deleteCoupon(id);

      //  *  for any error
      if (result?.error) {
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: toastId,
          duration: 1400,
        });
      }

      // * for successful deletion
      if (result?.data) {
        couponDataRefetch();
        const successMsg = result?.data?.message;
        toast.success(successMsg, {
          id: toastId,
          duration: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while Deleting Coupon!", {
        duration: 1400,
      });
    }
  };

  let content = null;

  // * if data is loading
  if (couponDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  // * if any error
  if (!couponDataLoading && couponDataError) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Something went wrong" />
        </td>
      </tr>
    );
  }

  // * for no data
  if (!couponDataLoading && !couponDataError && couponData?.data?.length < 1) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Nothing Found" />
        </td>
      </tr>
    );
  }

  // * for coupon data
  if (!couponDataLoading && !couponDataError && couponData?.data?.length) {
    content = couponData?.data?.map((coupon: any) => (
      <tr key={coupon?.id} className="border-b">
        <td className="p-4 text-center">{coupon?.code}</td>
        <td className="p-4 text-center">{coupon?.discountValue}%</td>
        <td className="p-4 text-center">{coupon?.usageLimit}</td>

        <td className="p-4 text-center">
          <DeleteModal
            handleDeleteFunction={handleDeleteCoupon}
            id={coupon?.id}
            alertMessage={alertMsg}
          />
        </td>
      </tr>
    ));
  }

  useEffect(() => {
    couponDataRefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {couponDeleteLoading && <FormSubmitLoading />}

      <div className="ManageCouponContainer">
        <div className="ManageCouponWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-3">
          <h3 className="brand text-2xl font-medium mb-6">Manage Coupon</h3>

          {/* Add new coupon container starts */}
          <div className="addNewCoupon mb-6">
            <Link to={"/dashboard/admin/manage-coupon/add-coupon"}>
              <Button className="px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base bg-prime50 hover:bg-prime100 active:scale-95 duration-500">
                Add new Coupon
              </Button>
            </Link>
          </div>
          {/* Add new coupon container ends */}

          {/* Manage coupon table starts */}
          <div className="manageCouponTable relative w-full overflow-auto mt-4">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="w-full text-sm bg-sky-100">
                  <th className="px-4 font-medium">Coupon Code</th>
                  <th className="px-4 font-medium">Discount Amount</th>
                  <th className="px-4 font-medium">Usage Limit</th>
                  <th className="px-4 font-medium">Delete Coupon</th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
          {/* Manage coupon table ends */}
        </div>
      </div>
    </>
  );
};

export default ManageCoupon;
