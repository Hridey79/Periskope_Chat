"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createChatRoom, getAllChatRooms } from "@/lib/supabaseUtils";

/** ------------------------------------------------------------------
 *  Type helpers
 *  ------------------------------------------------------------------*/
export type ChatRoom = {
  id: string;
  name: string;
  created_at?: string;
};

type ChatRoomListProps = {
  /** called when user selects a room (e.g. open ChatWindow) */
  onSelect: (room: ChatRoom) => void;
};

const ChatRoomList: React.FC<ChatRoomListProps> = ({ onSelect }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // controls modal visibility

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const data = await getAllChatRooms();
      if (data) setRooms(data);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    const newRoom = await createChatRoom(roomName.trim());
    if (newRoom) {
      setRooms((prev) => [newRoom, ...prev]);
      setRoomName("");
      setIsDialogOpen(false); // ⬅ close modal here
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="bg-gray-50 w-full h-14 p-2 flex items-center justify-between">
        <span className="text-green-600 font-semibold">
          {loading ? "Loading rooms…" : "All Chat Rooms"}
        </span>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto bg-green-600 text-white hover:bg-green-700">
              Add New Chat Room
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Chat Room</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
            />

            <Button onClick={handleCreateRoom} className="mt-4">
              Create Room
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onSelect(room)}
            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-none"
          >
            <p className="font-medium truncate">{room.name}</p>
            {room.created_at && (
              <p className="text-xs text-gray-400">
                {new Date(room.created_at).toLocaleString()}
              </p>
            )}
          </div>
        ))}

        {!loading && rooms.length === 0 && (
          <p className="text-center text-gray-500 py-6">No chat rooms yet.</p>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
