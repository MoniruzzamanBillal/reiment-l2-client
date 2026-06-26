"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { TAdminUser } from "@/types";
import Image from "next/image";
import { toast } from "sonner";

export default function ManageUsersPage() {
  const {
    data: userData, isLoading, isError, refetch,
  } = useFetchData<TAdminUser[]>(["allUsers"], "/user/all-user");
  const users: TAdminUser[] = (userData as any)?.data ?? [];

  const { mutateAsync: blockMutate, isPending: blockPending } = usePatch([["allUsers"]]);
  const { mutateAsync: unblockMutate, isPending: unblockPending } = usePatch([["allUsers"]]);

  const handleBlockUser = async (userId: string) => {
    const toastId = toast.loading("Blocking user...");
    try {
      const result: any = await blockMutate({ url: "/auth/delete-user", payload: { userId } });
      if (result?.data) { refetch(); toast.success(result.data.message, { id: toastId, duration: 1000 }); }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", { id: toastId, duration: 1400 });
    }
  };

  const handleUnblockUser = async (userId: string) => {
    const toastId = toast.loading("Unblocking user...");
    try {
      const result: any = await unblockMutate({ url: "/auth/unblock-user", payload: { userId } });
      if (result?.data) { refetch(); toast.success(result.data.message, { id: toastId, duration: 1000 }); }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", { id: toastId, duration: 1400 });
    }
  };

  let content = null;
  if (isLoading) content = <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>;
  else if (isError) content = <tr><td colSpan={6} className="p-8 text-center text-red-500">Something went wrong</td></tr>;
  else if (users.length === 0) content = <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nothing Found</td></tr>;
  else {
    content = users.map((user) => (
      <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-4 text-center">{user.username}</td>
        <td className="p-4 text-center">{user.email}</td>
        <td className="p-4 text-center">
          <div className="flex justify-center">
            <div className="relative size-[4.4rem] rounded-md overflow-hidden">
              <Image src={user.profileImg || "/placeholder.svg"} alt={user.username} fill className="object-cover" sizes="70px" />
            </div>
          </div>
        </td>
        <td className="p-4 text-center">{user.role}</td>
        <td className={`p-4 text-center font-semibold ${user.status === "ACTIVE" ? "text-green-600" : "text-red-600"}`}>{user.status}</td>
        <td className="p-4 text-center">
          {user.status === "ACTIVE" ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="text-sm">Block User</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Block User?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone. This will permanently block the user.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleBlockUser(user.id)}>Block</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="text-sm bg-green-600 hover:bg-green-700">Unblock</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unblock User?</AlertDialogTitle>
                  <AlertDialogDescription>This action will unblock this user.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleUnblockUser(user.id)}>Unblock</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </td>
      </tr>
    ));
  }

  return (
    <>
      {(blockPending || unblockPending) && <FormSubmitLoading />}
      <div className="ManageUsersContainer">
        <div className="bg-gray-100 border border-gray-300 shadow rounded-md p-3">
          <h3 className="text-2xl font-medium mb-4">Manage Users</h3>
          <div className="relative w-full overflow-auto mt-4">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="w-full text-sm bg-sky-100">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">User Image</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
