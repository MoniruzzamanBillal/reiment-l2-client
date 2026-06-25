import { TRelatedProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";

const RelatedProductCard = ({ product }: { product: TRelatedProduct }) => {
  const price =
    product.discount
      ? product.price - product.discount
      : product.price;

  return (
    <Link href={`/product/${product.id}`}>
      <div className="RelatedProductCard bg-gray-50 py-3 cursor-pointer group flex flex-col items-center gap-y-1 border border-gray-300 rounded-md shadow-md hover:shadow-lg hover:scale-[1.01] duration-200 overflow-hidden">
        <div className="relatedProductImg size-[9rem] relative">
          <Image
            src={product.productImg || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="144px"
          />
        </div>
        <div className="productName">
          <p className="font-medium group-hover:text-prime100 text-center">
            {product.name}
          </p>
        </div>
        <div className="productPrice">
          <p className="font-medium group-hover:text-prime100">
            ${price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RelatedProductCard;
