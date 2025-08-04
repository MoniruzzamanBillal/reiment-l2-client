import Wrapper from "@/components/shared/Wrapper";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserRegisterForm from "@/components/ui/register/UserRegisterForm";
import VendorRegisterForm from "@/components/ui/register/VendorRegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="RegisterContainer">
      <Wrapper className="formContainer py-20 ">
        {/*  */}
        <div className="    w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto p-3 xsm:p-5 sm:p-7 md:p-10  rounded-md shadow-xl bg-gray-300 border border-gray-400 dark:bg-black100 backdrop-blur bg-opacity-60 dark:backdrop-blur  ">
          <p className=" mb-3 xsm:mb-5 sm:mb-8 text-xl xsm:text-2xl sm:text-3xl text-center font-semibold CormorantFont text-gray-700 dark:text-white  ">
            Sign up
          </p>

          {/*  */}

          <div className="tabSection">
            <Tabs defaultValue="user" className="w-full max-w-2xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="vendor">Vendor</TabsTrigger>
              </TabsList>

              <TabsContent value="user">
                <Card>
                  <CardHeader>
                    <CardTitle>User Registration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <UserRegisterForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vendor">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Registration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Vendor Registration Form */}
                    <VendorRegisterForm />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/*  */}

          <div className="text-center mt-6   ">
            <a className="right-0 inline-block text-sm font-semibold align-baseline text-gray-900 hover:text-gray-950 dark:text-gray-200  ">
              Already have account ?{" "}
              <span className=" text-blue-700 font-bold cursor-pointer ">
                <Link to={`/login`}>Log in </Link>
              </span>
            </a>
          </div>
        </div>
        {/*  */}
      </Wrapper>
    </div>
  );
};

export default Register;
