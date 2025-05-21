import React from "react";
import Image from "next/image";
import { User } from "@/types/User";

type UserListProps = {
  users: User[];
  onSelect: (user: User) => void;
};

const UserList: React.FC<UserListProps> = ({ users, onSelect }) => {
  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Top Filter Header */}
      <div className="bg-gray-50 w-full h-14 p-2">
        {/* Action Bar */}
        <div className="flex items-center justify-between w-full text-black">
          <div className="flex items-center gap-3 px-2">
            <div className="text-green-600 font-semibold">Custom Filter</div>
            <div className="border px-2 py-1 rounded-md cursor-pointer transition-transform hover:scale-105">
              Save
            </div>
          </div>
          <div className="flex items-center gap-3 px-2">
            <div className="border px-2 py-1 rounded-md cursor-pointer transition-transform hover:scale-105">
              Search
            </div>
            <div className="border px-2 py-1 rounded-md cursor-pointer transition-transform hover:scale-105">
              Filtered
            </div>
          </div>
        </div>
      </div>

      {/* User List Header */}

      {/* User List Scrollable */}
      <div className="flex-1 overflow-y-auto mt-2">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelect(user)}
            className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={user.imageUrl}
                alt={user.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-medium truncate">{user.name}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {user.time}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {user.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
