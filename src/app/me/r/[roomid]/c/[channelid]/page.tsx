// src/app/me/room/[roomid]/c/[channelid]/page.tsx and similar files
"use client" 
import { ChatApp } from '@/components';

export default function ChannelPage({ params }: { params: { roomid: string, channelid: string } }) {
  const { roomid, channelid } = params; 
  console.log(' params', params);

  return ( 
    <ChatApp roomid={roomid} channelid={channelid}/>
  );
}
