'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/apis/firebase';
import { collection, query, where, addDoc, onSnapshot, doc, getDoc, getDocs, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChannelList } from './channel_list';
import { ChatWindow } from './chat_window';
import { MessageInput } from './message_input'; 
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
import { ChevronRight, ChevronLeft, Upload, Link, Plus, Send, Edit, Users } from 'lucide-react'
interface Channel {
  id: string;
  name: string;
  ownerId: string;
  members: string[];
  createdAt: Timestamp,
  color: string
}

export default function ChatApp({ roomid, channelid }: any) {
  const [room, setRoom] = useState<any>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(channelid || null);
  const [isChatWindowVisible, setIsChatWindowVisible] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedChannelName, setEditedChannelName] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Room data fetching logic
  const fetchRoomData = async (roomid: string) => {
    try {
      const roomRef = doc(db, "rooms", roomid);
      const roomSnapshot = await getDoc(roomRef);
      if (roomSnapshot.exists()) {
        return roomSnapshot.data();
      } else {
        console.error("Room not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      return null;
    }
  };

  // Fetch channels from Firestore based on channelIds in the room
  const fetchChannels = async (channelIds: string[]) => {
    if (channelIds.length === 0) return [];

    try {
      const channels = await Promise.all(
        channelIds.map(async (channelId) => {
          const channelDocRef = doc(db, "channels", channelId);
          const channelSnapshot = await getDoc(channelDocRef);
          if (channelSnapshot.exists()) {
            return { id: channelSnapshot.id, ...channelSnapshot.data() };
          }
          return null;
        })
      );

      // Filter out any null results from channels that might not exist
      return channels.filter((channel) => channel !== null) as Channel[];
    } catch (error) {
      console.error("Error fetching channels:", error);
      return [];
    }
  };
  function generateColor(): string {
    // Generate three RGB values where at least two values are between 200 and 255 (bright range)
    const r = Math.floor(200 + Math.random() * 55);  // Red: 200 to 255
    const g = Math.floor(200 + Math.random() * 55);  // Green: 200 to 255
    const b = Math.floor(Math.random() * 200);       // Blue: 0 to 199 (keep it lower to maintain contrast)
  
    // Convert the RGB to hex and return the color
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // Create default channel
  const createDefaultChannel = async (roomId: string, ownerId: string) => {
    if(!roomid || !ownerId) {
      router.push('/login')
    } 
    const newChannel = {
      name: "General",
      createdAt: Timestamp.now(),
      members: [ownerId],
      roomId,
      ownerId,
      color: generateColor()
    };

    const channelRef = await addDoc(collection(db, "channels"), newChannel);
    return { id: channelRef.id, ...newChannel };
  };

  // Update room's channelIds
  const updateRoomChannelIds = async (roomid: string, channelIds: string[]) => {
    try {
      const roomRef = doc(db, "rooms", roomid);
      await updateDoc(roomRef, { channelIds });
    } catch (error) {
      console.error("Error updating room channels:", error);
    }
  };

  useEffect(() => {
    const handleRoomLogic = async () => {
      if (!roomid) return;

      const roomData = await fetchRoomData(roomid);
      if (!roomData) return;

      if (!roomData.channelIds || roomData.channelIds.length === 0) {
        const newChannel = await createDefaultChannel(roomid, user?.uid || "");
        const updatedChannelIds = [newChannel.id];
        await updateRoomChannelIds(roomid, updatedChannelIds);

        setRoom({ ...roomData, channelIds: updatedChannelIds });
        setChannels([newChannel]);
        setSelectedChannelId(newChannel.id);
        router.push(`/me/r/${roomid}/c/${newChannel.id}`);
      } else {
        const fetchedChannels = await fetchChannels(roomData.channelIds);
        setRoom(roomData);
        setChannels(fetchedChannels);

        if (!channelid) {
          setSelectedChannelId(fetchedChannels[0]?.id);
          router.push(`/me/r/${roomid}/c/${fetchedChannels[0]?.id}`);
        }
      }
    };

    handleRoomLogic();
  }, [roomid, channelid, router, user]);

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
    router.push(`/me/r/${roomid}/c/${channelId}`);
  };

  const handleChannelCreate = async (name: string, members: string[], roomId: string) => {
    if (user) {
      try {
        const newChannel = {
          name,
          ownerId: user.uid,
          members: [user.uid, ...members],
          roomId,
          createdAt: Timestamp.now(),
        };

        // Add the new channel to the channels collection
        const channelDocRef = await addDoc(collection(db, 'channels'), newChannel);

        // Update the local state to include the new channel
        setChannels((prev) => [...prev, { id: channelDocRef.id, ...newChannel }]);
        setSelectedChannelId(channelDocRef.id);

        // Update the room's channelIds array by adding the new channel ID
        const roomRef = doc(db, 'rooms', roomId);
        await updateDoc(roomRef, {
          channelIds: arrayUnion(channelDocRef.id), // Append the new channel ID to the room's channelIds array
        });

        // Redirect to the newly created channel
        router.push(`/me/r/${roomId}/c/${channelDocRef.id}`);
      } catch (error) {
        console.error("Error creating channel:", error);
      }
    }
  };
  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      onChannelCreate(newChannelName.trim(), []);
      setNewChannelName('');
    }
  };
  return (
    <div className="flex h-screen flex flex-col">
      <ChannelList
        channels={channels}
        roomData={room}
        selectedChannelId={selectedChannelId}
        onChannelSelect={handleChannelSelect} 
      />
      <div className="flex flex-row h-full">
      <ScrollArea
    // open={isMenuOpen}
    // onOpenChange={setIsMenuOpen}
    className="p-4 w-2/6 max-w-100 bg-white border border-gray-400 dark:bg-black transition-all duration-300 ease-in-out xs:sm:w-3/3"
  >
    {/* <CollapsibleContent className="p-4 space-y-4"> */}
    <Tabs defaultValue="account" >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Context</TabsTrigger>
        <TabsTrigger value="password">Configure</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
            <CardDescription>
              Add links for scaping here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">URL</Label>
              <Input id="link" defaultValue="" />
            </div>
            <Button type="submit" className="w-full text-white dark:text-black">
              +
            </Button>
          </CardContent>
          <CardFooter>
            <Button>Scrape & save</Button>
          </CardFooter> 
        </Card>

        <div className="mt-2 text-black dark:text-white text-sm font-bold pl-3">Documents</div> 
        <Card className="mt-2 rounded border-0">   
            <CardContent className=" border rounded flex aspect-rectangle items-center justify-center p-3 py-12">
              <span className="text-sm font-regular text-gray-400">drap and drop files</span>
            </CardContent> 
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    {/* </CollapsibleContent> */}
     </ScrollArea>
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {isEditingName ? (
              <Input
                value={editedChannelName}
                onChange={(e) => setEditedChannelName(e.target.value)}
                onBlur={handleEditChannelName}
                onKeyDown={(e) => e.key === 'Enter' && handleEditChannelName()}
                className="w-40 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800"
              />
            ) : (
              <>
                <span className="font-semibold text-gray-900 dark:text-white">
                  #{channels.find((channel) => channel.id === selectedChannelId)?.name}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)}>
                  <Edit className="h-4 w-4 text-gray-900 dark:text-gray-300" />
                </Button>
              </>
            )}
          </div> 
        </header>
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {isChatWindowVisible && selectedChannelId && (
              <ChatWindow channelId={selectedChannelId} />
            )}
          </ScrollArea>
        </main>
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 p-4">
          {selectedChannelId && <MessageInput channelId={selectedChannelId} />}
        </footer>
      </div>
      </div>
    </div>
  );
}
