"use client";

import ChatWindow from "@/components/ChatWindow";
import UserList from "@/components/UserList";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@/types/User";

const Chats: React.FC = () => {
  const [selectedChat, setSelectedChat] = React.useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");

  const users: User[] = [
    {
      id: 1,
      name: "Project Team",
      lastMessage: "Let's meet at 5 PM",
      time: "10:30 AM",
      members: [
        { id: 1, name: "Amit", imageUrl: "/avatar1.jpg" },
        { id: 2, name: "Sara", imageUrl: "/avatar2.jpg" },
        { id: 3, name: "John", imageUrl: "/avatar3.jpg" },
      ],
    },
    {
      id: 2,
      name: "Project Team 2",
      lastMessage: "Let's meet at 7 PM",
      time: "10:30 AM",
      members: [
        { id: 1, name: "Amit", imageUrl: "/avatar1.jpg" },
        { id: 2, name: "Sara", imageUrl: "/avatar2.jpg" },
        { id: 3, name: "John", imageUrl: "/avatar3.jpg" },
      ],
    },
  ];

  const handleUserSelect = (user: User) => {
    setSelectedChat({ ...user }); // Force a state update by creating a new object
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error getting current user:", userError);
        return;
      }
      setUserId(userData.user.id);
      if (!data.session?.user) {
        router.push("/"); // Redirect to login page
      } else {
        setLoading(false); // Authenticated
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-full md:w-2/5 max-w-sm border-r bg-blue-50">
        <UserList users={users} onSelect={handleUserSelect} />
      </div>

      {/* Chat Window */}
      <div className="flex-grow bg-white flex ">
        {selectedChat ? (
          <ChatWindow selectedChat={selectedChat} currentUserId={userId} />
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
