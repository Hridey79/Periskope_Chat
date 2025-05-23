import { supabase } from "./supabaseClient";

const createChatRoom = async (roomName: string, tags: string[] = []) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("Error getting current user:", userError);
    return;
  }

  const { data: chatRoom, error: chatError } = await supabase
    .from("chat_rooms")
    .insert([
      {
        name: roomName,
        created_by: userData.user.id,
        tags, // ✅ store tags array
      },
    ])
    .select("*")
    .single();

  if (chatError) {
    console.error("Error creating chat room:", chatError);
    return;
  }

  const { error: memberError } = await supabase
    .from("chat_room_members")
    .insert([{ chat_room_id: chatRoom.id, user_id: userData.user.id }]);

  if (memberError) {
    console.error("Error adding user to chat room:", memberError);
    return;
  }

  return chatRoom;
};

const getAllChatRooms = async () => {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching chat rooms:", error);
    return [];
  }

  return data;
};

const addUserToChatRoom = async (roomId: string) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;

  const { error } = await supabase
    .from("chat_room_members")
    .insert([{ user_id: userData.user.id, chat_room_id: roomId }]);

  if (error) console.error("Error joining chat room:", error);
};

const exitChatRoom = async (roomId: string) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;

  const { error } = await supabase
    .from("chat_room_members")
    .delete()
    .eq("user_id", userData.user.id)
    .eq("chat_room_id", roomId);

  if (error) console.error("Error leaving chat room:", error);
};

const deleteChatRoom = async (roomId: string) => {
  const { error } = await supabase.from("chat_rooms").delete().eq("id", roomId);
  if (error) console.error("Error deleting chat room:", error);
};

const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error logging out:", error);
};

async function getChatRoomDetails(roomId: string) {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select(
      `
      *,
      chat_room_members:chat_room_members (
        joined_at,
        user:profiles (
          id,
          username,
          email
        )
      ),
      messages (
        content,
        created_at,
        sender:profiles (
          id,
          username
        )
      )
    `
    )
    .eq("id", roomId)
    .single();

  if (error) {
    console.error("Error fetching chat room:", error.message);
    return null;
  }

  return data;
}

// Example joinChatRoom function:
async function joinChatRoom(chatRoomId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("Error getting current user:", userError);
    return;
  }

  const { error } = await supabase.from("chat_room_members").insert([
    {
      chat_room_id: chatRoomId,
      user_id: userData.user.id,
    },
  ]);
  if (error) throw error;
}

export {
  createChatRoom,
  addUserToChatRoom,
  exitChatRoom,
  deleteChatRoom,
  logoutUser,
  getAllChatRooms,
  getChatRoomDetails,
  joinChatRoom,
};
