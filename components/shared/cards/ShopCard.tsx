import { TShopDetail } from "@/types";
import { format } from "date-fns";
import { ArrowRight, Calendar, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ShopCard = ({ shop }: { shop: TShopDetail }) => {
  return (
    <div className="shopCard bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="flex justify-center pt-6 pb-4 px-4">
        <div className="relative size-24 rounded-full ring-4 ring-gray-100 overflow-hidden bg-gray-50">
          <Image
            src={shop.logo}
            alt={shop.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-4 pb-5 gap-3">
        <div className="text-center">
          <h2 className="text-base font-bold text-gray-900 mb-1 truncate">{shop.name}</h2>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {shop.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {format(new Date(shop.createdAt), "dd MMM yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {(shop as any)?.follower?.length ?? 0} followers
          </span>
        </div>

        <Link
          href={`/shop/${shop.id}`}
          className="mt-auto flex items-center justify-center gap-2 bg-prime100 hover:bg-prime200 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          Visit Store
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;
