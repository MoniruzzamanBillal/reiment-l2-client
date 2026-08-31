/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useDeleteData, useFetchData, usePost } from "@/hooks/useApi";
import { TWishlistData } from "@/types";
import { toast } from "sonner";

export const useWishlistToggle = (productId: string) => {
  const user = useAuthStore((s) => s.user);
  const isCustomer = !!user && user.userRole === "CUSTOMER";

  const {
    data: wishlistData,
    isLoading,
    refetch,
  } = useFetchData<TWishlistData[]>(
    ["loggedUserWishlist"],
    "/wishlist/logged-user-data",
    { enabled: isCustomer },
  );

  const { mutateAsync: addMutate, isPending: addPending } = usePost([
    ["loggedUserWishlist"],
  ]);
  const { mutateAsync: removeMutate, isPending: removePending } = useDeleteData([
    ["loggedUserWishlist"],
  ]);

  const wishlist: TWishlistData[] = (wishlistData as any)?.data ?? [];
  const isWishlisted = wishlist.some((item) => item.productId === productId);

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Login to save products to your wishlist", { duration: 1400 });
      return;
    }
    if (!isCustomer) return;

    const toastId = toast.loading(
      isWishlisted ? "Removing from wishlist..." : "Adding to wishlist...",
    );
    try {
      const result: any = isWishlisted
        ? await removeMutate({
            url: "/wishlist/remove-wishlist",
            payload: { productId },
          })
        : await addMutate({
            url: "/wishlist/add-wishlist",
            payload: { productId },
          });

      if (result?.data) {
        refetch();
        toast.success(result.data.message, { id: toastId, duration: 1200 });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId,
        duration: 1400,
      });
    }
  };

  return {
    isCustomer,
    isWishlisted,
    isLoading,
    isPending: addPending || removePending,
    toggleWishlist,
  };
};
