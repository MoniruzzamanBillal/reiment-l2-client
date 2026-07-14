"use client";

import ProductCard from "@/components/shared/cards/ProductCard";
import ProductCardSkeleton from "@/components/shared/cards/ProductCardSkeleton";
import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { useDeleteData, useFetchData, usePost } from "@/hooks/useApi";
import { useAuthStore } from "@/stores/useAuthStore";
import { TFollowData, TProductResponse, TShopDetail } from "@/types";
import { Package, Users } from "lucide-react";
import Image from "next/image";
import { use } from "react";
import { toast } from "sonner";

type TFollower = { shopId: string };

type TShopDetailWithProducts = TShopDetail & {
  Products: TProductResponse[];
  follower: TFollower[];
};

type TProps = { params: Promise<{ id: string }> };

export default function ShopDetailPage({ params }: TProps) {
  const { id } = use(params);
  const user = useAuthStore((s) => s.user);

  const {
    data: shopData,
    isLoading: shopLoading,
    refetch: shopRefetch,
  } = useFetchData<TShopDetailWithProducts>(
    ["shop", id],
    `/shop/shop-detail/${id}`,
    { enabled: !!id },
  );

  const { data: userData, refetch: userRefetch } = useFetchData<TFollowData[]>(
    ["loggedUserFollow"],
    "/follow/logged-user-data",
    { enabled: !!user },
  );

  const { mutateAsync: followMutate, isPending: followLoading } = usePost([
    ["shop", id],
    ["loggedUserFollow"],
  ]);
  const { mutateAsync: unfollowMutate, isPending: unfollowLoading } =
    useDeleteData([["shop", id], ["loggedUserFollow"]]);

  const shop: TShopDetailWithProducts | null = (shopData as any)?.data ?? null;
  const followedShops: TFollowData[] = (userData as any)?.data ?? [];
  const isFollowing = followedShops.some((f) => f.shopId === shop?.id);

  const handleFollow = async () => {
    const toastId = toast.loading("Following Shop…");
    try {
      const result: any = await followMutate({
        url: "/follow/follow-shop",
        payload: { shopId: shop?.id },
      });
      if (result?.data) {
        userRefetch();
        shopRefetch();
        toast.success(result.data.message, { id: toastId, duration: 1000 });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", {
        id: toastId,
        duration: 1400,
      });
    }
  };

  const handleUnfollow = async () => {
    const toastId = toast.loading("Unfollowing Shop…");
    try {
      const result: any = await unfollowMutate({
        url: "/follow/unfollow-shop",
        payload: { shopId: shop?.id },
      });
      if (result?.data) {
        userRefetch();
        shopRefetch();
        toast.success(result.data.message, { id: toastId, duration: 1000 });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", {
        id: toastId,
        duration: 1400,
      });
    }
  };

  return (
    <div className="ShopDetailContainer bg-gray-50 min-h-screen pb-12">
      {/* Hero banner */}
      <div
        className="relative w-full h-52 sm:h-64 md:h-72"
        style={{
          backgroundImage: `url('https://i.postimg.cc/bNFjCb9j/7d918b0c437f1db11c738e4de8aed608-jpg-2200x2200q75-jpg-ezgif-com-webp-to-jpg-converter.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Shop info card — overlaps banner */}
      <Wrapper>
        <div className="-mt-16 relative z-10 bg-white rounded-2xl border border-gray-100 shadow-lg p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Logo */}
            <div className="relative size-20 sm:size-24 rounded-2xl ring-4 ring-white shadow-md overflow-hidden shrink-0 bg-gray-100">
              {shop?.logo ? (
                <Image
                  src={shop.logo}
                  alt={shop.name ?? "shop"}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {shop?.name ?? "Loading…"}
              </h1>
              {shop?.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-lg">
                  {shop.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-5 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Users className="size-4 text-prime100" />
                  <span className="font-semibold">
                    {shop?.follower?.length ?? 0}
                  </span>
                  <span className="text-gray-400">followers</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Package className="size-4 text-prime100" />
                  <span className="font-semibold">
                    {shop?.Products?.length ?? 0}
                  </span>
                  <span className="text-gray-400">products</span>
                </div>
              </div>
            </div>

            {/* Follow button */}
            <div className="shrink-0">
              {isFollowing ? (
                <Button
                  onClick={handleUnfollow}
                  disabled={unfollowLoading}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 px-6 rounded-xl"
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  onClick={handleFollow}
                  disabled={followLoading || !user}
                  className="bg-prime100 hover:bg-prime200 px-6 rounded-xl"
                >
                  Follow
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Products section */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Products</h2>
            {!shopLoading && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-prime100/10 text-prime100">
                {shop?.Products?.length ?? 0}
              </span>
            )}
          </div>

          {!shopLoading && shop?.Products?.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
              <Package className="mx-auto size-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">
                This shop has no products yet.
              </p>
            </div>
          )}

          <div className="products grid mx-auto w-[85%] xsm:w-full grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
            {shopLoading &&
              Array.from({ length: 8 }).map((_, ind) => (
                <ProductCardSkeleton key={ind} />
              ))}
            {shop?.Products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
