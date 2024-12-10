import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";

import { useGetLoggedInUserQuery } from "@/redux/features/user/user.api";
import { FormSubmitLoading } from "@/components/ui";

const Dashboard = () => {
  const { data: userData, isLoading: userDataLoading } =
    useGetLoggedInUserQuery(undefined);

  // console.log(userData?.data);

  return (
    <>
      {userDataLoading && <FormSubmitLoading />}

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
                    <img src={userData?.data?.profileImg} alt="" />
                  </div>
                  {/* left image section ends */}

                  {/* left name section starts  */}
                  <div className="nameSection   ">
                    <div className="nameTopSection flex items-center gap-x-2 mb-2 ">
                      <p className=" text-xl sm:text-2xl font-semibold   ">
                        {userData?.data?.username}
                      </p>
                    </div>

                    <p className=" text-sm font-medium text-gray-600 mb-2 ">
                      {userData?.data?.email}
                    </p>
                  </div>
                  {/* left name section ends  */}

                  {/*  */}
                </div>
                {/* left section ends  */}

                {/* right section starts  */}
                <div className="profileRightSection  ">
                  <Link to={`/dashboard/update-profile/${userData?.data?.id}`}>
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
