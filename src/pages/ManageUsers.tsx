const ManageUsers = () => {
  const content = null;

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
                <th className="px-4 font-medium">Phone </th>
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
