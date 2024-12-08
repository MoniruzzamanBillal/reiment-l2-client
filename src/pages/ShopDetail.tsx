import Wrapper from "@/components/shared/Wrapper";
import { ProductCard } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useGetSingleShopQuery } from "@/redux/features/shop/shop.api";
import { UseGetUser } from "@/utils/SharedFunction";
import { useParams } from "react-router-dom";

//
const ShopDetail = () => {
  const userInfo = UseGetUser();
  const { id } = useParams();

  if (!id) {
    throw new Error("Something went wrong!! ");
  }

  const {
    data: shopData,
    isLoading: shopDataLoading,
    isError: shopDataError,
  } = useGetSingleShopQuery(id, { skip: !id });

  // console.log(userInfo);
  // console.log(shopData?.data);
  // console.log(shopData?.data?.Products);

  return (
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
                src="https://res.cloudinary.com/dbgrq28js/image/upload/v1733121648/user%204.jpg"
                alt=""
              />
            </div>
            {/* middle detail starts  */}
            <div className="middleDetail">
              <p className=" text-lg font-medium ">Shop name</p>

              <p>12 followers</p>
            </div>

            {/* right follow unfollow button starts  */}
            <div className="rightSection">
              <Button className=" bg-prime50 hover:bg-prime100 px-8 ">
                Follow
              </Button>
            </div>
          </div>
        </div>
        {/* shop name sectio ends  */}

        <div className="productCardsSection">
          <h1 className=" text-2xl font-medium mb-8 ">All Products </h1>

          <div className="products grid grid-cols-4 gap-x-4 gap-y-6 ">
            {shopData?.data?.Products &&
              shopData?.data?.Products?.map((product) => (
                <ProductCard key={product?.id} product={product} />
              ))}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default ShopDetail;
