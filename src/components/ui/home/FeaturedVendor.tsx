import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const vendors = [
  {
    id: "0d72382c-41ba-48c1-aebb-bbbdd9a82084",
    name: "TinyToys Land",
    logo: "https://res.cloudinary.com/dbgrq28js/image/upload/v1747219232/TinyToys%20Land.jpg",
    description: "Premium fashion and accessories",
    rating: 4.8,
    products: 250,
    followers: "12K",
    badge: "Top Seller",
  },
  {
    id: "7b4de18e-30de-417a-a573-3cbc0b696007",
    name: "ShopNest",
    logo: "https://res.cloudinary.com/dbgrq28js/image/upload/v1747218712/vendor%202.jpg",
    description: "Latest electronics and gadgets",
    rating: 4.9,
    products: 180,
    followers: "8.5K",
    badge: "Verified",
  },
  {
    id: "6b31815c-d6fb-4ea8-828d-6bdb395d1c7c",
    name: "Urban Cart",
    logo: "https://res.cloudinary.com/dbgrq28js/image/upload/v1747206617/vendor%201.jpg",
    description: "Everything for your home",
    rating: 4.7,
    products: 320,
    followers: "15K",
    badge: "Featured",
  },
  {
    id: "7b4de18e-30de-417a-a573-3cbc0b696007",
    name: "Sports Zone",
    logo: "https://res.cloudinary.com/dbgrq28js/image/upload/v1747218712/vendor%202.jpg",
    description: "Sports and fitness equipment",
    rating: 4.6,
    products: 150,
    followers: "6K",
    badge: "New",
  },
];

const FeaturedVendor = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Featured Vendors
          </h2>
          <p className="text-gray-600">Discover our top-rated sellers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors?.map((vendor, index) => (
            <Card
              key={index}
              className=" shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-300 bg-gray-50 "
            >
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <img
                    src={vendor?.logo || "/placeholder.svg"}
                    alt={vendor?.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                  />
                  <Badge className="absolute -top-1 -right-1 text-xs">
                    {vendor?.badge}
                  </Badge>
                </div>

                <h3 className="font-semibold text-lg mb-2">{vendor?.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {vendor?.description}
                </p>

                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>⭐ {vendor?.rating}</span>
                  <span>{vendor?.products} Products</span>
                  <span>{vendor?.followers} Followers</span>
                </div>

                <Link to={`/shop/detail/${vendor?.id}`} className="  ">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent border border-gray-400 "
                  >
                    Visit Shop
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVendor;
