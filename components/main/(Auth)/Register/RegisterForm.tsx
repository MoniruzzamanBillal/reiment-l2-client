"use client";

import { useState } from "react";
import Link from "next/link";
import UserRegisterForm from "./UserRegisterForm";
import VendorRegisterForm from "./VendorRegisterForm";

const RegisterForm = () => {
  const [activeTab, setActiveTab] = useState<"user" | "vendor">("user");

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-14">
      <div className="w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[65%] lg:w-[50%] mx-auto p-6 sm:p-10 rounded-md shadow-xl bg-white border border-gray-200">
        <h1 className="mb-6 text-2xl sm:text-3xl text-center font-semibold text-gray-700">
          Sign up
        </h1>

        {/* tabs */}
        <div className="grid grid-cols-2 gap-1 mb-6 bg-gray-100 p-1 rounded-md">
          <button
            onClick={() => setActiveTab("user")}
            className={`py-2 rounded text-sm font-medium transition-colors ${
              activeTab === "user"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setActiveTab("vendor")}
            className={`py-2 rounded text-sm font-medium transition-colors ${
              activeTab === "vendor"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Vendor
          </button>
        </div>

        {/* tab content */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-5">
          <h2 className="text-lg font-semibold mb-4">
            {activeTab === "user" ? "User Registration" : "Vendor Registration"}
          </h2>
          {activeTab === "user" ? <UserRegisterForm /> : <VendorRegisterForm />}
        </div>

        <div className="text-center mt-5 text-sm text-gray-700">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-700 font-bold hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
