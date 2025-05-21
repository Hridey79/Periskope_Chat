import LeftSideBar from "@/components/LeftSideBar";
import Navbar from "@/components/Navbar";
import RightSideBar from "@/components/RightSideBar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
      <Navbar />
      <div className="flex flex-1 min-w-0 overflow-hidden">
        {/* Sidebar */}
        <LeftSideBar />

        {/* Main Content */}
        <div className="flex-1 min-w-0 box-border">{children}</div>

        {/* Rightbar */}
        <RightSideBar />
      </div>
    </div>
  );
};

export default Layout;
