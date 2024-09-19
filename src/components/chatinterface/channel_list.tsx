import { useState, useRef } from 'react'
import { Channel } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { ScrollArea } from "@/components/ui/scroll-area"; 

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ChevronRight, ChevronLeft, Upload, Link, Plus, Send, MessageSquare } from 'lucide-react'
export function ChannelList({ channels, selectedChannelId, onChannelSelect, onChannelCreate }: {
  channels: Channel[];
  selectedChannelId: string | null;
  onChannelSelect: (id: string) => void;
  onChannelCreate: (name: string, members: string[]) => void;
}) {
  const [newChannelName, setNewChannelName] = useState('');
  console.log('...channels...',channels);

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      onChannelCreate(newChannelName.trim(), []);
      setNewChannelName('');
    }
  };

  return (
    <ScrollArea className="w-[100%]">
      {/* <div className="space-y-2 p-2">
        {channels.map((channel) => (
          <Button
            key={channel.id}
            variant={channel.id === selectedChannelId ? "secondary" : "ghost"}
            className={`w-full justify-start text-gray-900 dark:text-gray-300 ${channel.id === selectedChannelId ? 'bg-gray-300 text-gray-700 dark:hover:bg-gray-500 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-900'}`} // Ensure visible text and hover effects
            onClick={() => onChannelSelect(channel.id)}
          >
            <MessageSquare className="mr-2 h-4 w-4 text-gray-900 dark:text-gray-300" />  
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
      </div> */}
       <ScrollArea className="w-full p-2"  >
            <div className="flex space-x-2 p-2">
              {channels.map((channel) => (
                <span
                  key={channel.id}
                  onClick={() => onChannelSelect(channel.id)}
                  style={{ backgroundColor: channel.color }}
                  className={`text-gray-800 text-sm rounded px-3 shadow-md  ${channel.color} `}
                >
                  <span className="text-xs font-bold opacity-50 ">#</span>{channel.name}
                </span>
              ))}
            </div>
          </ScrollArea>
    </ScrollArea>
    
  );
}