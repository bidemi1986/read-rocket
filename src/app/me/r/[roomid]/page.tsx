// src/app/@me/room/[roomid]/page.tsx and src/app/[userid]/room/[roomid]/page.tsx
// import { useRouter } from 'next/navigation';
import { ChatApp } from '@/components';
export default function RoomPage() {
  // const { roomid } = useRouter().query;

  return (
    // <div>
    //   <h1>Room: {roomid}</h1>
    //   {/* Load room-specific content */}
    // </div>
    <ChatApp/>
  );
}
