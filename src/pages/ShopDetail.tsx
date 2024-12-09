import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

//
const ShopDetail = () => {
  const { id } = useParams();

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

        <div className="productCards">
          <h1 className=" text-xl font-medium mb-6 ">All Products </h1>
          <h1>products </h1>
          <h1>products </h1>
          <h1>products </h1>
        </div>
      </Wrapper>
    </div>
  );
};

export default ShopDetail;
