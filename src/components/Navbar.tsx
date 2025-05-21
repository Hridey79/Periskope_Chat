import React from "react";

const Navbar = () => {
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
        <div className="border px-2 py-1 rounded-md cursor-pointer transform transition-transform hover:scale-105">
          ioc
        </div>
        <div className="border px-2 py-1 rounded-md cursor-pointer transform transition-transform hover:scale-105">
          ioc
        </div>
        <div className="border px-2 py-1 rounded-md cursor-pointer transform transition-transform hover:scale-105">
          ioc
        </div>
      </div>
    </div>
  );
};

export default Navbar;
