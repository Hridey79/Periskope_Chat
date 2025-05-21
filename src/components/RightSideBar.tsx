"use client";

import React, { useState } from "react";
import {
  MdHome,
  MdMessage,
  MdSettings,
  MdGroups,
  MdPhone,
  MdNotifications,
  MdSearch,
  MdPerson,
  MdHelpOutline,
  MdDashboard,
  MdFavorite,
} from "react-icons/md";

const icons = [
  MdHome,
  MdMessage,
  MdSettings,
  MdGroups,
  MdPhone,
  MdNotifications,
  MdSearch,
  MdPerson,
  MdHelpOutline,
  MdDashboard,
  MdFavorite,
];

const RightSideBar = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center justify-between w-14 bg-white px-2 py-3 box-border border-r">
      <div className="flex flex-col items-center justify-center gap-3">
        {icons.map((Icon, index) => (
          <div
            key={index}
            onClick={() => setSelected(index)}
            className={`p-2 rounded-xl transition-all duration-150 cursor-pointer 
              ${
                selected === index
                  ? "bg-green-100 text-green-600"
                  : "text-slate-400 hover:bg-gray-100"
              }`}
          >
            <Icon className="text-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSideBar;
