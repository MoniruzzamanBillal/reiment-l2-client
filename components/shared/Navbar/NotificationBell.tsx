"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { useAuthStore } from "@/stores/useAuthStore";
import { TNotification } from "@/types";

const NotificationBell = () => {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  const { data: notificationsData, isLoading } = useFetchData<
    TNotification[]
  >(["notifications"], "/notification/my-notifications", {
    enabled: !!user,
  });

  const notifications: TNotification[] =
    (notificationsData as any)?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const { mutateAsync: markAsReadMutate } = usePatch([["notifications"]]);
  const { mutateAsync: markAllReadMutate } = usePatch([["notifications"]]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutate({ url: `/notification/${id}/read`, payload: {} });
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutate({
        url: "/notification/mark-all-read",
        payload: {},
      });
    } catch {
      toast.error("Failed to mark all notifications as read");
    }
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative cursor-pointer" aria-label="Notifications">
          <Bell className="text-xl" />
          {unreadCount > 0 && (
            <div className="text-gray-100 text-center size-5 bg-indigo-600 text-xs rounded-full absolute transform -translate-x-1/2 -translate-y-1/2 top-[0rem] left-[1.4rem]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <p className="font-medium text-sm">Notifications</p>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:underline cursor-pointer"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <p className="p-4 text-center text-sm text-gray-500">
              Loading...
            </p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-gray-500">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() =>
                  !notification.isRead && handleMarkAsRead(notification.id)
                }
                className={`w-full text-left p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors flex gap-2 items-start cursor-pointer ${
                  notification.isRead ? "" : "bg-indigo-50"
                }`}
              >
                {!notification.isRead && (
                  <span className="mt-1.5 size-2 rounded-full bg-indigo-600 shrink-0" />
                )}
                <div className={notification.isRead ? "pl-4" : ""}>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
