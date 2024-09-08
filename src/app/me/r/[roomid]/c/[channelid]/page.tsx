// src/app/@me/room/[roomid]/c/[channelid]/page.tsx and similar files
import { useRouter } from 'next/router';

export default function ChannelPage() {
  const { roomid, channelid } = useRouter().query;

  return (
    <div>
      <h1>Room: {roomid} - Channel: {channelid}</h1>
      {/* Load specific channel content in the room */}
    </div>
  );
}
