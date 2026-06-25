"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData } from "@/hooks/useApi";
import { TLoggedInUser } from "@/types";
import { Edit, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const { data: userData, isLoading } = useFetchData<TLoggedInUser>(
    ["loggedInUser"],
    "/user/logged-user"
  );

  const user: TLoggedInUser | null = (userData as any)?.data ?? null;

  if (isLoading) {
    return (
      <div className="UserProfileContainer bg-gray-100/90 border border-gray-300 shadow rounded-md p-4">
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <Skeleton className="w-full h-48 sm:h-64" />
          <div className="container mx-auto px-4 pt-4 flex flex-col items-center gap-4">
            <Skeleton className="size-32 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="UserProfileContainer bg-gray-100/90 border border-gray-300 shadow rounded-md p-4">
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative w-full h-48 sm:h-64 md:h-80 bg-gray-300 overflow-hidden">
          <Image
            src="https://i.postimg.cc/HLTCWBgC/pexels-scottwebb-1029604-1.jpg"
            alt="Cover Photo"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="container mx-auto px-4 -mt-16 sm:-mt-24 md:-mt-32 relative z-5">
          <div className="flex flex-col items-center gap-4">
            <div className="relative size-32 sm:size-40 md:size-48 rounded-full border-4 border-white bg-gray-200 shadow-lg overflow-hidden">
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={user.profileImg || "/placeholder.svg?height=120&width=120"}
                  alt={user.username}
                />
                <AvatarFallback>
                  <User className="h-24 w-24 text-gray-500" />
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">
              {user.username}
            </h1>
          </div>

          <div className="p-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <p className="text-lg font-medium text-gray-800 mb-2">
                  {user.email}
                </p>
              </div>
              <Link
                href={`/dashboard/update-profile/${user.id}`}
                className="mt-4 md:mt-0"
              >
                <Button className="bg-teal-600 hover:bg-teal-700 font-semibold text-sm sm:text-base">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
