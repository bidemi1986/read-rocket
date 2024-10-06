'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { ChevronRight, ChevronLeft, Upload, Link, Plus, Send } from 'lucide-react'

interface Channel {
  id: string
  name: string
  color: string
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
}

const channels: Channel[] = [
  { id: '1', name: 'General', color: 'bg-pink-500' },
  { id: '2', name: 'Research', color: 'bg-purple-400' },
  { id: '3', name: 'Literature', color: 'bg-green-400' },
  { id: '4', name: 'Data Analysis', color: 'bg-red-400' },
  { id: '5', name: 'Methodology', color: 'bg-orange-400' },
  { id: '5', name: '+', color: 'bg-violet-400' },
]

export default function ResearchChatInterface() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>(channels[0])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [documents, setDocuments] = useState<string[]>([])
  const [links, setLinks] = useState<string[]>([])
  const [context, setContext] = useState('')
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel)
    // In a real application, you would fetch messages for the selected channel here
    setMessages([])
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: 'user',
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
      // In a real application, you would send the message to a backend here
    }
  }

  const handleAddDocument = (document: string) => {
    setDocuments([...documents, document])
  }

  const handleAddLink = (link: string) => {
    setLinks([...links, link])
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    // Simulate AI response
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      setTimeout(() => {
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: "I'm an AI assistant. How can I help you with your research?",
          sender: 'ai',
        }
        setMessages([...messages, aiMessage])
      }, 1000)
    }
  }, [messages])

  return (
    <div className="w-[100%] flex flex-col h-screen bg-blue-50 dark:bg-gray-900">
      <div className="flex items-center border-b p-2">
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        <div className="flex-1 relative">
          {/* <Button variant="ghost" size="icon" className="absolute left-0 z-10" onClick={() => handleScroll('left')}>
            <ChevronLeft className="h-4 w-4" />
          </Button> */}
          <ScrollArea className="w-full" ref={carouselRef}>
            <div className="flex space-x-2 p-2">
              {channels.map((channel) => (
                <span
                  key={channel.id}
                  onClick={() => handleChannelSelect(channel)}
                  style={{ backgroundColor: channel.color }}
                  className={`text-gray-800 text-sm rounded px-3 shadow-md  ${channel.color} `}
                >
                  <span className="text-xs font-bold opacity-50 ">#</span>{channel.name}
                </span>
              ))}
            </div>
          </ScrollArea>
          <Button variant="ghost" size="icon" className="absolute right-0 top-0 z-10" onClick={() => handleScroll('right')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
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
          <ScrollArea className="flex-1 p-4">
            {messages.map((message) => (
              <Card key={message.id} className={`mb-4 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                <CardContent className="p-3">
                  <p>{message.text}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          <div className="p-4 border-t border">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}