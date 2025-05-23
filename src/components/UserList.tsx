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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { createChatRoom, getAllChatRooms } from "@/lib/supabaseUtils";

/** ------------------------------------------------------------------
 *  Type helpers
 *  ------------------------------------------------------------------*/
export type ChatRoom = {
  id: string;
  name: string;
  created_at?: string;
  tags?: string[];
};

type ChatRoomListProps = {
  onSelect: (room: ChatRoom) => void;
};

const ChatRoomList: React.FC<ChatRoomListProps> = ({ onSelect }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [roomName, setRoomName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"name" | "tag">("name");

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
    const newRoom = await createChatRoom(roomName.trim(), tags);
    if (newRoom) {
      setRooms((prev) => [newRoom, ...prev]);
      setRoomName("");
      setTags([]);
      setTagInput("");
      setIsDialogOpen(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();

    if (filterType === "name") {
      return room.name.toLowerCase().includes(term);
    }

    if (filterType === "tag") {
      return room.tags?.some((tag) => tag.toLowerCase().includes(term));
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-y-auto">
      {/* Top Bar */}
      <div className="bg-gray-50 w-full h-14 p-2 flex items-center justify-between">
        <span className="text-green-600 font-semibold">
          {loading ? "Loading rooms…" : "All Chat Rooms"}
        </span>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto bg-green-600 text-white hover:bg-green-700 cursor-pointer">
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

            <div className="mt-4">
              <Input
                placeholder="Add tag (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <div className="flex flex-wrap mt-2 gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCreateRoom}
              className="mt-4 bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            >
              Create Room
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <div className="p-2 bg-white border-b flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <Input
            placeholder={`Search by ${filterType}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />

          <ToggleGroup
            type="single"
            value={filterType}
            onValueChange={(val) => {
              if (val === "name" || val === "tag") setFilterType(val);
            }}
            className="gap-1"
          >
            <ToggleGroupItem value="name" className="cursor-pointer">
              Name
            </ToggleGroupItem>
            <ToggleGroupItem value="tag" className="cursor-pointer">
              Tag
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onSelect(room)}
            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-none"
          >
            <p className="font-medium truncate">{room.name}</p>
            {room.tags?.length > 0 && (
              <div className="flex gap-2 text-sm text-green-700 mt-1 flex-wrap">
                {room.tags.map((tag, idx) => (
                  <span key={idx}>#{tag}</span>
                ))}
              </div>
            )}
            {room.created_at && (
              <p className="text-xs text-gray-400">
                {new Date(room.created_at).toLocaleString()}
              </p>
            )}
          </div>
        ))}

        {!loading && filteredRooms.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No matching rooms found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
