import { Button } from "@/components/ui/button";
import { GetUserRole } from "@/utils/GetUserRole";
import { UseGetUser } from "@/utils/SharedFunction";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";

const Dashboard = () => {
  const userRole = GetUserRole();
  const userInfo = UseGetUser();

  // console.log(userRole);
  console.log(userInfo);

  return (
    <div className="DashboardContainer">
      <div className="profileSection">
        {/*  */}
        <div className="ProfileImgSectionContainer   rounded-md ">
          <div className="profileImgWrapper flex flex-col xsm:flex-row justify-between items-center gap-y-8 bg-gray-100  shadow rounded-md p-3 ">
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
              <Link to={`/`}>
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
    </div>
  );
};

export default Dashboard;
