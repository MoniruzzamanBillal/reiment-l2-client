"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiLogin } from "react-icons/ci";
import { LuUser } from "react-icons/lu";
import { useAuthStore } from "@/stores/useAuthStore";
import DashboardLinks from "./DashboardLinks";

const Sidebar = () => {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-md p-4 sticky top-[8.2rem] shadow-md">
      <div className="flex items-center space-x-2 border-b-4 border-rose-500 pb-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="inline-block p-2 rounded-full bg-slate-200">
            <div className="w-6">
              <LuUser className="text-2xl font-bold text-gray-800" />
            </div>
          </span>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </Link>
      </div>

      <nav className="mt-4">
        <DashboardLinks />
        <div
          onClick={handleLogout}
          className="mt-4 flex items-center gap-x-1 cursor-pointer font-medium p-1 border border-gray-300 hover:bg-rose-50 transition-colors rounded"
        >
          <CiLogin className="text-xl" />
          Logout
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
