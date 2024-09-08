// src/app/@me/rooms/page.tsx
'use client'

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

// Mock data for study rooms
const studyRooms = [
  {
    id: 1,
    name: "Physics 101",
    category: "Science",
    recentMessage: "Can someone explain quantum entanglement?",
    readers: 5,
    lastActive: "2023-06-15T10:30:00Z"
  },
  {
    id: 2,
    name: "World History",
    category: "History",
    recentMessage: "Discussing the impact of the Industrial Revolution",
    readers: 3,
    lastActive: "2023-06-15T09:45:00Z"
  },
  {
    id: 3,
    name: "Calculus Study Group",
    category: "Math",
    recentMessage: "Working on integration by parts problems",
    readers: 7,
    lastActive: "2023-06-14T14:20:00Z"
  },
  {
    id: 4,
    name: "Literature Circle",
    category: "English",
    recentMessage: "Analyzing themes in '1984' by George Orwell",
    readers: 4,
    lastActive: "2023-06-15T08:15:00Z"
  },
  {
    id: 5,
    name: "Computer Science Fundamentals",
    category: "Science",
    recentMessage: "Discussing Big O notation and algorithm efficiency",
    readers: 6,
    lastActive: "2023-06-15T10:05:00Z"
  },
  {
    id: 6,
    name: "Art History",
    category: "History",
    recentMessage: "Exploring the Renaissance period",
    readers: 2,
    lastActive: "2023-06-13T16:40:00Z"
  },
  {
    id: 7,
    name: "Biology Study Group",
    category: "Science",
    recentMessage: "Reviewing cellular respiration processes",
    readers: 5,
    lastActive: "2023-06-15T09:30:00Z"
  },
  {
    id: 8,
    name: "Statistics for Data Science",
    category: "Math",
    recentMessage: "Discussing hypothesis testing methods",
    readers: 8,
    lastActive: "2023-06-15T10:29:00Z"
  }
]

const categories = ["All", ...new Set(studyRooms.map(room => room.category))]

export default function StudyRoomsList() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomCategory, setNewRoomCategory] = useState("")

  const filterRooms = (rooms: any[]) => {
    return rooms.filter((room: { category: string; name: string; recentMessage: string; lastActive: string | number | Date }) => {
      const categoryMatch = selectedCategory === "All" || room.category === selectedCategory
      const searchMatch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.recentMessage.toLowerCase().includes(searchQuery.toLowerCase())
      const timeMatch = (() => {
        const now = new Date()
        const lastActive = new Date(room.lastActive)
        const hoursDiff = (now.getTime() - lastActive.getTime()) / (1000 * 3600)
        switch (timeFilter) {
          case 'last24h': return hoursDiff <= 24
          case 'last7d': return hoursDiff <= 168
          case 'last30d': return hoursDiff <= 720
          default: return true
        }
      })()
      return categoryMatch && searchMatch && timeMatch
    })
  }

  const filteredRooms = filterRooms(studyRooms)

  const handleCreateRoom = () => {
    // Here you would typically make an API call to create a new room
    console.log("Creating new room:", { name: newRoomName, category: newRoomCategory })
    // Reset the form
    setNewRoomName("")
    setNewRoomCategory("")
  }

  const formatLastActive = (dateString: string | number | Date) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

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
              <DialogTitle>Create New Study Room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select value={newRoomCategory} onValueChange={setNewRoomCategory}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat !== "All").map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCreateRoom}>Create Room</Button>
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
          {filteredRooms.map((room: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; recentMessage: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; readers: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; lastActive: any }) => (
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
                  <div className="text-sm text-muted-foreground mb-2">{room.recentMessage}</div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {room.readers} readers
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