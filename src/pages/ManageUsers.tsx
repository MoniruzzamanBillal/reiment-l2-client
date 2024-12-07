import { TableDataError, TableDataLoading } from "@/components/ui";
import { useGetUserQuery } from "@/redux/features/user/user.api";

const ManageUsers = () => {
  const {
    data: userData,
    isLoading: userDataLoading,
    isError: userDataError,
    refetch: userDataRefetch,
  } = useGetUserQuery(undefined);

  // console.log(userData?.data);

  let content = null;

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
        <td className="p-4 text-center">user?.phone</td>
        <td className="p-4 text-center">{user?.role}</td>
        <td className="p-4 text-center"> delete user </td>
      </tr>
    ));
  }

  return (
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
                <th className="px-4 font-medium">User Contact </th>
                <th className="px-4 font-medium">Role </th>
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
  );
};

export default ManageUsers;
