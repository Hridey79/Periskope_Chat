export type User = {
  id: number;
  name: string; // Group name
  number?: string; // Optional
  imageUrl?: string;
  members: {
    id: number;
    name: string;
    imageUrl?: string;
  }[];
  lastMessage: string;
  time: string;
};
