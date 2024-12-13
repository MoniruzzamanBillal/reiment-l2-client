import Wrapper from "@/components/shared/Wrapper";
import { FormSubmitLoading, ProductCard } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { TCustomerProduct } from "@/constants/customer";
import {
  useFollowShopMutation,
  useUnfollowShopMutation,
} from "@/redux/features/follower/follower.api";
import { useGetSingleShopQuery } from "@/redux/features/shop/shop.api";
import { useGetLoggedInUserQuery } from "@/redux/features/user/user.api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

//
const ShopDetail = () => {
  const { id } = useParams();

  if (!id) {
    throw new Error("Something went wrong!! ");
  }

  const {
    data: shopData,
    isLoading: shopDataLoading,
    isError: shopDataError,
    refetch: shopDataRefetch,
  } = useGetSingleShopQuery(id, { skip: !id });

  const {
    data: userData,
    isLoading: userDataLoading,
    refetch: userDataRefetch,
  } = useGetLoggedInUserQuery(undefined);

  const [followShop, { isLoading: followShopLoading }] =
    useFollowShopMutation();

  const [unfollowShop, { isLoading: unfollowShopLoading }] =
    useUnfollowShopMutation();

  // console.log(userData?.data?.follower);
  // console.log(shopData?.data?.id);

  const isFollowing =
    userData?.data?.follower?.some((follower: { shopId: string }) => {
      const isMatch = follower?.shopId === shopData?.data?.id;

      return isMatch;
    }) || false;

  // ! for following shop
  const handleFollowShop = async () => {
    try {
      const taostId = toast.loading("Following Shop....");

      const result = await followShop({ shopId: shopData?.data?.id });

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
        userDataRefetch();
        shopDataRefetch();
        const successMsg = result?.data?.message;

        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while following shop  !!!", {
        duration: 1400,
      });
    }
  };

  // ! for unfollowing user
  const handleUnfollowShop = async () => {
    try {
      const taostId = toast.loading("Following Shop....");

      const result = await unfollowShop({ shopId: shopData?.data?.id });

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
        userDataRefetch();
        shopDataRefetch();
        const successMsg = result?.data?.message;

        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while following shop  !!!", {
        duration: 1400,
      });
    }

    //
  };

  return (
    <>
      {(shopDataLoading ||
        shopDataError ||
        userDataLoading ||
        unfollowShopLoading) && <FormSubmitLoading />}

      <div className="ShopDetailContainer bg-gray-100 min-h-screen py-8 ">
        <Wrapper className=" ShopDetailWrapper flex flex-col gap-y-6 ">
          {/* shop name sectio starts  */}
          <div
            className="shopNameSection border border-gray-300 p-3 rounded overflow-auto flex  items-center  "
            style={{
              backgroundImage: `url('https://i.postimg.cc/bNFjCb9j/7d918b0c437f1db11c738e4de8aed608-jpg-2200x2200q75-jpg-ezgif-com-webp-to-jpg-converter.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="shopDetailCard bg-gray-50 p-2 rounded flex justify-between items-center gap-x-8 ">
              {/* left logo starts  */}
              <div className="leftLogo size-[4.5rem] rounded overflow-auto ">
                <img
                  className=" w-full h-full "
                  src={shopData?.data?.logo}
                  alt=""
                />
              </div>
              {/* middle detail starts  */}
              <div className="middleDetail">
                <p className=" text-lg font-medium ">
                  {" "}
                  {shopData?.data?.name}{" "}
                </p>

                <p> {shopData?.data?.follower?.length} Follower </p>
              </div>

              {/* right follow unfollow button starts  */}

              <div className="rightSection">
                {isFollowing ? (
                  <Button
                    onClick={() => handleUnfollowShop()}
                    className=" bg-red-600 hover:bg-red-700 px-8 "
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    onClick={handleFollowShop}
                    className="bg-prime50 hover:bg-prime100 px-8"
                    disabled={followShopLoading}
                  >
                    Follow
                  </Button>
                )}
              </div>
            </div>
          </div>
          {/* shop name sectio ends  */}

          <div className="productCardsSection">
            <h1 className=" text-2xl font-medium mb-8 ">All Products </h1>

            <div className="products grid grid-cols-4 gap-x-4 gap-y-6 ">
              {shopData?.data?.Products &&
                shopData?.data?.Products?.map((product: TCustomerProduct) => (
                  <ProductCard key={product?.id} product={product} />
                ))}
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default ShopDetail;
