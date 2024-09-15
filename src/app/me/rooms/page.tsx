// src/app/@me/rooms/page.tsx
'use client'
import {useEffect} from "react"
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MoreVertical, Users, MessageSquare, Search, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/context/authcontext' 
import { RoomData } from "@/types/room-model"

export default function StudyRoomsList() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [rooms, setRooms] = useState<any[]>([]); // Store fetched rooms
  const [newRoomVisibility, setNewRoomVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [error, setError] = useState('');
  const { user } = useAuth(); // Get the authenticated user

  useEffect(() => {
    const fetchRooms = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/getRooms?uid=${user.uid}`);
          const data = await response.json();
          setRooms(data.rooms); // Store the rooms in the state
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      }
    };

    fetchRooms();
  }, [user]);

  // Extract categories from fetched rooms
  const categories = ['All', ...new Set(rooms.map((room) => room.category))];

  const filterRooms = (rooms: RoomData[]) => {
    return rooms.filter((room) => {
      // Category filtering
      const categoryMatch = selectedCategory === "All" || room.tags.includes(selectedCategory);
  
      // Search filtering
      const searchMatch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.description.toLowerCase().includes(searchQuery.toLowerCase());
  
      // Time filtering based on the last active time
      const now = new Date();
      const lastActive = new Date(room.lastActive * 1000); // Manually convert to Date
      const hoursDiff = (now.getTime() - lastActive.getTime()) / (1000 * 3600);
  
      const timeMatch = (() => {
        switch (timeFilter) {
          case 'last24h': return hoursDiff <= 24;
          case 'last7d': return hoursDiff <= 168; // 7 days * 24 hours
          case 'last30d': return hoursDiff <= 720; // 30 days * 24 hours
          default: return true;
        }
      })();
  
      return categoryMatch && searchMatch && timeMatch;
    });
  };
  

  const filteredRooms = filterRooms(rooms)

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      setError('Room name cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/createRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newRoomName,
          ownerId: user?.uid,
          visibility: newRoomVisibility,
          members: [user?.uid],
          description: newRoomDescription,
        }),
      });

      if (!response.ok) throw new Error('Failed to create room');
      
      const { roomId } = await response.json();
      console.log(`Room created with ID: ${roomId}`);
      
      setNewRoomName('');
      setNewRoomDescription('');
      setError('');
    } catch (error) {
      setError('Failed to create room');
      console.error(error);
    }
  };

  const formatLastActive = (lastActive: { _seconds: number, _nanoseconds: number }) => {
    if(!lastActive) return "Invalid Date"
    const milliseconds = lastActive._seconds * 1000 + lastActive._nanoseconds / 1000000;
    const date = new Date(milliseconds);
  
    return date.toLocaleString(); // Convert the date to a human-readable string
  };
  

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Study Rooms</h1>
      
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="last24h">Last 24 hours</SelectItem>
            <SelectItem value="last7d">Last 7 days</SelectItem>
            <SelectItem value="last30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Room
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Room Name
              </Label>
              <Input
                id="name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="visibility" className="text-right">
                Visibility
              </Label>
              <Select value={newRoomVisibility} onValueChange={setNewRoomVisibility}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button onClick={handleCreateRoom}>Create Room</Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>

      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      <ScrollArea className="w-full h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredRooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{room.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                      <DropdownMenuItem>Leave Room</DropdownMenuItem>
                      <DropdownMenuItem>Invite Others</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-2">{room.latestMessage}</div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {room.members.length} readers
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {formatLastActive(room.lastActive)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}