import React, { useState, useRef, useEffect } from "react";
import { User } from "@/types/User";

type ChatWindowProps = {
  selectedChat: User;
};

type Message = {
  id: number;
  sender: "me" | "them";
  content: string;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "them", content: selectedChat.lastMessage },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "me",
        content: newMessage.trim(),
      },
    ]);
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ...existing code...
  return (
    <div className="flex flex-col h-full bg-white z-10">
      {/* Header (Fixed by layout, not position) */}
      <div className="px-4 py-2 border-b bg-white flex items-center gap-3 shrink-0">
        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        <div className="flex flex-col">
          <span className="font-semibold text-black">{selectedChat.name}</span>
          <span className="text-sm text-gray-500">{selectedChat.number}</span>
        </div>
      </div>

      {/* Messages (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`px-3 py-2 rounded-md break-words text-wrap max-w-xs whitespace-pre-wrap ${
              msg.sender === "me"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar (Fixed by layout, not position) */}
      <div className="flex items-center p-2 border-t bg-white shrink-0">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-md px-3 py-2 mr-2 outline-none focus:ring-2 focus:ring-blue-400"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
  // ...existing code...
};

export default ChatWindow;
