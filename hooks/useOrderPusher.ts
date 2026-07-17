"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFetchData } from "./useApi";
import { getBaseUrl } from "@/utils/config/envConfig";
import { TVendorShop } from "@/types";

export const useOrderPusher = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const isVendor = user?.userRole === "VENDOR";
  const isCustomer = user?.userRole === "CUSTOMER";

  const { data: shopData } = useFetchData<TVendorShop>(
    ["vendorShop"],
    "/shop/vendor-shop",
    { enabled: !!user && isVendor },
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shopId = (shopData as any)?.data?.id as string | undefined;

  useEffect(() => {
    if (!user || !token) return;
    if (!isVendor && !isCustomer) return;
    if (isVendor && !shopId) return;

    const channelName = isVendor
      ? `private-vendor-${shopId}`
      : `private-customer-${user.userId}`;

    const pusherClient = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY as string,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
        authEndpoint: `${getBaseUrl()}/pusher/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    );

    const channel = pusherClient.subscribe(channelName);

    if (isVendor) {
      channel.bind("new-order", () => {
        toast.success("You have a new order!");
        queryClient.invalidateQueries({ queryKey: ["vendorOrderHistory"] });
      });

      channel.bind(
        "low-stock",
        (data: {
          productId: string;
          productName: string;
          inventoryCount: number;
        }) => {
          toast.error(
            `Low stock: ${data.productName} has only ${data.inventoryCount} left!`,
          );
          queryClient.invalidateQueries({
            queryKey: ["vendorProducts", shopId ?? ""],
          });
        },
      );
    } else {
      channel.bind("order-status-changed", () => {
        toast.info("Your order status has been updated.");
        queryClient.invalidateQueries({ queryKey: ["customerOrderHistory"] });
      });
    }

    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.disconnect();
    };
  }, [user, token, isVendor, isCustomer, shopId, queryClient]);
};
