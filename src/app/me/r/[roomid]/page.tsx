// src/app/@me/room/[roomid]/page.tsx and src/app/[userid]/room/[roomid]/page.tsx
"use client"
import { ChatApp } from '@/components'; 
export default function RoomPage({ params }: { params: { roomid: string } }) {
  const { roomid } = params; 
  console.log(' roomid ', roomid);
  
  return ( 
    <ChatApp roomid={roomid}/>
  );
}
