"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/supabaseUtils";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/"); // Redirect to login/home after logout
  };

  return (
    <div className="p-2 flex items-center justify-between bg-white border-b">
      <Image src={"/whatsapp.png"} alt="logo" height={30} width={30} />

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
