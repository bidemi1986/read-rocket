// src/types.ts

import { Timestamp } from 'firebase/firestore';

// Type for a single chat message
export type Message = {
  id: string;
  user: string; 
  text: string;
  timestamp: Timestamp;
};

// Type for a chat channel
export type Channel = {
  id: string;
  name: string;
  createdAt: Timestamp;   
  members: string[]
  color:  string;
  ownerId: string;
  roomId: string
};
