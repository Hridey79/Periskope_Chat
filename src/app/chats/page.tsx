"use client";

import ChatWindow from "@/components/ChatWindow";
import UserList from "@/components/UserList";
import React from "react";
import { User } from "@/types/User";

const Chats: React.FC = () => {
  const [selectedChat, setSelectedChat] = React.useState<User | null>(null);

  const users: User[] = [
    {
      id: 1,
      name: "Test Demo7",
      number: "+91 99999 99999",
      lastMessage: "Hello, South Euna!",
      time: "08:01",
      imageUrl: "/avatar1.jpg",
    },
    {
      id: 2,
      name: "Yasin 3",
      number: "+91 89718 44008",
      lastMessage: "First Bulk Message",
      time: "09:30",
      imageUrl: "/avatar2.jpg",
    },
  ];

  const handleUserSelect = (user: User) => {
    setSelectedChat(user);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-full md:w-2/5 max-w-sm border-r bg-blue-50">
        <UserList users={users} onSelect={handleUserSelect} />
      </div>

      {/* Chat Window */}
      <div className="flex-grow bg-white ">
        {selectedChat ? (
          <ChatWindow selectedChat={selectedChat} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
