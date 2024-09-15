import { Timestamp } from "firebase-admin/firestore";
export interface RoomData {
    name: string;
    description: string;
    latestMessage: string;
    members: string[];
    lastActive: Timestamp;
    createdAt: Timestamp;
    lastUpdated: Timestamp;
    active: boolean;
    visibility: 'public' | 'private' | 'unlisted';
    channelIds: string[];
    files: string[];
    tags: string[];
    topics: string[];
    ownerId: string;
    roomId: string;
  }
  