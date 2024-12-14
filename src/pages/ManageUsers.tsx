import DeleteModal from "@/components/shared/DeleteModal";
import UnblockModal from "@/components/shared/UnblockModal";
import {
  FormSubmitLoading,
  TableDataError,
  TableDataLoading,
} from "@/components/ui";
import { useDeleteUserMutation } from "@/redux/features/auth/auth.api";
import { useGetUserQuery } from "@/redux/features/user/user.api";
import { toast } from "sonner";

const alertMessage =
  " This action cannot be undone. This will permanently delete the user  .";

const unblockAlertMessage = "This action will unblock this user .";

const ManageUsers = () => {
  const {
    data: userData,
    isLoading: userDataLoading,
    isError: userDataError,
    refetch: userDataRefetch,
  } = useGetUserQuery(undefined);

  const [deleteUser, { isLoading: userDeletationLoading }] =
    useDeleteUserMutation();

  console.log(userData?.data);

  let content = null;

  // ! function for deleting a user
  const handleDeleteUser = async (id: string) => {
    try {
      const taostId = toast.loading("Deleting user....");
      const payload = {
        userId: id,
      };
      const result = await deleteUser(payload);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: taostId,
          duration: 1400,
        });
      }

      // * for successful insertion
      if (result?.data) {
        userDataRefetch();
        const successMsg = result?.data?.message;

        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while crating product !!!", {
        duration: 1400,
      });
    }
  };

  // ! function for unblocking user
  const handleUnblockUser = async (id: string) => {
    console.log(id);
  };

  // *  if data is loading
  if (userDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  // *  if any error
  if (!userDataLoading && userDataError) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Something went wrong " />
        </td>
      </tr>
    );
  }

  // * for no user
  if (!userDataLoading && !userDataError && userData?.data?.length < 1) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Nothing Found" />
        </td>
      </tr>
    );
  }

  // * for user data
  if (!userDataLoading && !userDataError && userData?.data?.length) {
    content = userData?.data?.map((user: any) => (
      <tr key={user.id} className="border-b">
        <td className="p-4 text-center">{user?.username}</td>
        <td className="p-4 text-center">{user?.email}</td>
        <td className="p-4 text-center  flex justify-center items-center ">
          <img
            src={user?.profileImg}
            className=" size-[4.4rem] rounded-md "
            alt=""
          />
        </td>

        <td className="p-4 text-center">{user?.role}</td>
        <td
          className={`p-4 text-center font-semibold ${
            user?.status === "ACTIVE" ? "text-green-600" : "text-red-600"
          }`}
        >
          {user?.status}
        </td>
        <td className="p-4 text-center">
          {user?.status === "ACTIVE" ? (
            <DeleteModal
              handleDeleteFunction={handleDeleteUser}
              id={user?.id}
              alertMessage={alertMessage}
            />
          ) : (
            <UnblockModal
              handleUnblockFunction={handleUnblockUser}
              id={user?.id}
              unblockAlertMessage={alertMessage}
            />
          )}
        </td>
      </tr>
    ));
  }

  return (
    <>
      {userDeletationLoading && <FormSubmitLoading />}

      <div className="ManageUsersContainer">
        <div className="ManageUsersWrapper bg-gray-100  shadow rounded-md p-3  ">
          <h3 className="brand text-2xl font-medium mb-4 "> Manage Users </h3>

          {/* manage user table starts  */}
          <div className="manageUserTable relative w-full overflow-auto mt-4 ">
            <table className="w-full text-sm ">
              <thead className="border-b">
                <tr className="w-full text-sm bg-sky-100  ">
                  <th className="px-4 font-medium">Name</th>
                  <th className="px-4 font-medium">Email </th>
                  <th className="px-4 font-medium">User Image </th>
                  <th className="px-4 font-medium">Role </th>
                  <th className="px-4 font-medium">Status </th>
                  <th className="px-4 font-medium">Delete User </th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
          {/* manage user table ends  */}

          {/*  */}
          {/*  */}
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
