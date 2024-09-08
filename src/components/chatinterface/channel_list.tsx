import { useState } from "react";
import { Channel } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Plus, Edit, Users } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChannelList({ channels, selectedChannelId, onChannelSelect, onChannelCreate }: {
  channels: Channel[];
  selectedChannelId: string | null;
  onChannelSelect: (id: string) => void;
  onChannelCreate: (name: string, members: string[]) => void;
}) {
  const [newChannelName, setNewChannelName] = useState('');

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      onChannelCreate(newChannelName.trim(), []);
      setNewChannelName('');
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-2 p-2">
        {channels.map((channel) => (
          <Button
            key={channel.id}
            variant={channel.id === selectedChannelId ? "secondary" : "ghost"}
            className={`w-full justify-start text-gray-900 dark:text-gray-300 ${channel.id === selectedChannelId ? 'bg-gray-300 text-gray-700 dark:hover:bg-gray-500 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-900'}`} // Ensure visible text and hover effects
            onClick={() => onChannelSelect(channel.id)}
          >
            <MessageSquare className="mr-2 h-4 w-4 text-gray-900 dark:text-gray-300" /> {/* Ensure icon is visible */}
            #{channel.name}
          </Button>
        ))}
      </div>
      <div className="p-2">
        <Input
          placeholder="create a new topic"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          className="mb-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-500"
        />
        <Button onClick={handleCreateChannel} className="w-full text-gray-100 dark:text-gray-800">
          Create Topic
        </Button>
      </div>
    </ScrollArea>
  );
}
