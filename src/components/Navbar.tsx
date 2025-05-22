"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/supabaseUtils";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/"); // Redirect to login/home after logout
  };

  return (
    <div className="p-2 flex items-center justify-between bg-white border-b">
      <div className="flex items-center gap-2 ml-1">
        <div className="rounded-full bg-green-400 h-10 w-10"></div>
        <div className="text-slate-400">chats</div>
      </div>

      <div className="flex text-black gap-4 mr-10">
        <div className="border px-2 py-1 rounded-md cursor-pointer transform transition-transform hover:scale-105">
          Refresh
        </div>

        <div className="border px-2 py-1 rounded-md cursor-pointer transform transition-transform hover:scale-105">
          Help
        </div>

        <div className="border px-2 py-1 rounded-md cursor-pointer transform transition-transform hover:scale-105">
          5/6 Phones
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="border px-4 py-2 cursor-pointer rounded-md bg-red-700 text-white hover:bg-red-800 transition"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
