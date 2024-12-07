import { Button } from "@/components/ui/button";
import { GetUserRole } from "@/utils/GetUserRole";
import { UseGetUser } from "@/utils/SharedFunction";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { AddressCard } from "@/components/ui";

const address = {
  id: "1",
  street: "123 Main St",
  city: "Springfield",
  state: "IL",
  postalCode: "62701",
  country: "USA",
};

const Dashboard = () => {
  const userRole = GetUserRole();
  const userInfo = UseGetUser();

  // console.log(userRole);
  console.log(userInfo);

  const handleEditAddress = (id) => {
    console.log(`Edit address with id: ${id}`);
  };

  const handleDeleteAddress = (id) => {
    console.log(`Delete address with id: ${id}`);
  };

  return (
    <div className="DashboardContainer">
      <div className="dashBoardWrapper  bg-gray-100  shadow rounded-md p-3 flex flex-col gap-y-4 ">
        {/* profile section starts  */}
        <div className="profileSection">
          {/*  */}
          <div className="ProfileImgSectionContainer   rounded-md ">
            <div className="profileImgWrapper flex flex-col xsm:flex-row justify-between items-center gap-y-8  ">
              {/* left section starts  */}
              <div className="profileLeftSection  flex  items-center gap-x-5 ">
                {/* left image section starts  */}
                <div className="imgSection rounded-full overflow-auto w-[8rem] sm:w-[10rem] md:w-[10rem] xmd:w-[12rem] ">
                  <img src="https://i.ibb.co.com/NxFFxKT/ubaida.jpg" alt="" />
                </div>
                {/* left image section ends */}

                {/* left name section starts  */}
                <div className="nameSection   ">
                  <div className="nameTopSection flex items-center gap-x-2 mb-2 ">
                    <p className=" text-xl sm:text-2xl font-semibold   ">
                      user name
                    </p>
                  </div>

                  <p className=" text-sm font-medium text-gray-400 mb-2 ">
                    {" "}
                    user?.email{" "}
                  </p>
                </div>
                {/* left name section ends  */}

                {/*  */}
              </div>
              {/* left section ends  */}

              {/* right section starts  */}
              <div className="profileRightSection  ">
                <Link to={`/dashboard/update-profile/1212`}>
                  <Button className=" bg-prime50 hover:bg-prime100  font-semibold text-sm sm:text-base  ">
                    <FiEdit className="  " />
                    Edit profile
                  </Button>
                </Link>
              </div>
              {/* right section ends  */}

              {/*  */}
            </div>
          </div>
          {/*  */}
        </div>
        {/* profile section ends  */}

        {/*  */}

        {/* button for adding new address  */}
        <div className="btnSection">
          <Button
            className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime50 hover:bg-prime100 `}
          >
            Add New Address
          </Button>
        </div>
      </div>

      {/* address card  */}
      <div className="addressCard bg-gray-100  shadow rounded-md p-3  ">
        <AddressCard
          address={address}
          onEdit={handleEditAddress}
          onDelete={handleDeleteAddress}
        />
      </div>
      {/* address card ends */}
    </div>
  );
};

export default Dashboard;
