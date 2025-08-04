import { TShopDetail } from "@/types/globalTypes";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const ShopCard = ({ shop }: { shop: TShopDetail }) => {
  return (
    <div className="shopCard bg-white rounded-md border border-gray-200 shadow-md ">
      <div className=" p-4 ">
        <div className="  mx-auto flex items-center  justify-center mb-4 size-[10rem] ">
          <img
            src={shop?.logo}
            alt={shop?.name}
            className=" w-full h-full mx-auto  "
          />
        </div>

        <h2 className="text-lg font-semibold mb-1">{shop?.name}</h2>

        <p className="text-gray-900 text-sm mb-2.5 h-24 ">
          {shop?.description}
        </p>

        <p className="text-gray-700 text-sm mb-6">
          {format(new Date(shop?.createdAt), "dd-MMM-yyyy")}
        </p>

        <Link
          to={`/shop/detail/${shop?.id}`}
          className="bg-prime100 text-white px-4 py-2 rounded"
        >
          Visit Store
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;
