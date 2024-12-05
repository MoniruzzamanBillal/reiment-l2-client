import { Outlet } from "react-router-dom";
import Navbar from "../shared/NavBar";

export const MainLayout = () => {
  return (
    <div className="MainLayoutContainer  ">
      {/* nav starts  */}
      <div className="navContainer   ">
        <Navbar />
      </div>
      {/* nav ends */}

      {/* child component  */}
      <div className="childComponent mt-[5.2rem]   ">
        <Outlet />
      </div>
      {/* child component  */}

      <div className="footerContainer   ">
        {/* <Footer /> */}
        <h1>footer</h1>
        <h1>footer</h1>
      </div>
    </div>
  );
};
