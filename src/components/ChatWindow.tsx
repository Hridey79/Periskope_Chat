"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getChatRoomDetails, joinChatRoom } from "@/lib/supabaseUtils";
import { ChatRoom, Message } from "@/types";
import { supabase } from "@/lib/supabaseClient";

type ChatWindowProps = {
  selectedChat: ChatRoom;
  currentUserId: string;
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedChat,
  currentUserId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomDetails, setRoomDetails] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedChat?.id) {
        const data = await getChatRoomDetails(selectedChat.id);
        if (data) {
          setRoomDetails(data);
          setMessages(data.messages || []);
          const memberIds = data.chat_room_members?.map((m) => m.user.id);
          setIsMember(memberIds?.includes(currentUserId) || false);
        }
      }
    };

    fetchDetails();
  }, [selectedChat, currentUserId]);

  useEffect(() => {
    if (!selectedChat?.id || !isMember) return;

    const channel = supabase
      .channel(`chat_room_${selectedChat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${selectedChat.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.id === newMsg.id);
            return exists ? prev : [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat, isMember]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from("messages").insert([
      {
        chat_room_id: selectedChat.id,
        sender_id: currentUserId,
        content: newMessage.trim(),
      },
    ]);

    if (error) {
      console.error("Error sending message:", error.message);
    } else {
      setNewMessage(""); // Clear input only after successful send
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      await joinChatRoom(selectedChat.id);
      const data = await getChatRoomDetails(selectedChat.id);
      if (data) {
        setRoomDetails(data);
        setMessages(data.messages || []);
        // @ts-ignore
        const memberIds = data.chat_room_members?.map((m) => m.user.id);
        setIsMember(memberIds?.includes(currentUserId) || false);
      }
    } catch (error) {
      console.error("Error joining chat room:", error);
    }
    setJoining(false);
  };

  return (
    <div className="flex flex-col h-[94%] w-full self-end">
      {/* Header */}
      <div className="px-4 py-3 bg-[#075E54] text-white flex items-center gap-3 border-b min-h-[56px]">
        <div className="relative h-10 w-10">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center text-xs">
            {(roomDetails?.name || selectedChat?.name)?.charAt(0)}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">
            {roomDetails?.name || selectedChat?.name}
          </span>
          <span className="text-sm text-white/70">
            {roomDetails?.chat_room_members
              ?.map((member) => member.user.username)
              .join(", ")}
          </span>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-[#ECE5DD] space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id || msg.created_at}
            className={`flex ${
              msg.sender?.id === currentUserId || msg.sender_id == currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg text-sm max-w-96 break-words whitespace-pre-wrap ${
                msg.sender?.id === currentUserId ||
                msg.sender_id == currentUserId
                  ? "bg-[#DCF8C6] text-black"
                  : "bg-white text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input or Join Button */}
      {isMember ? (
        <div className="flex items-center px-4 py-3 border-t bg-white gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            className="bg-[#075E54] text-white hover:bg-[#0a8066] font-semibold"
          >
            Send
          </Button>
        </div>
      ) : (
        <div className="flex justify-center px-4 py-3 border-t bg-white">
          <Button
            onClick={handleJoin}
            disabled={joining}
            className="bg-[#075E54] text-white hover:bg-[#0a8066] font-semibold"
          >
            {joining ? "Joining..." : "Join Chat Room"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
