'use client'

import { useState, useEffect } from 'react'
import { db, auth } from '@/apis/firebase'
import { collection, query, where, addDoc, onSnapshot, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion } from 'firebase/firestore'
import { onAuthStateChanged, User } from 'firebase/auth'
import { MessageSquare, Plus, Edit, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChatWindow } from './chat_window'
import { MessageInput } from './message_input'
import { ChannelList } from './channel_list'

interface Channel {
  id: string
  name: string
  ownerId: string
  members: string[]
}

// function ChannelList({ channels, selectedChannelId, onChannelSelect, onChannelCreate }) {
//   const [newChannelName, setNewChannelName] = useState('')

//   const handleCreateChannel = () => {
//     if (newChannelName) {
//       onChannelCreate(newChannelName, [])
//       setNewChannelName('')
//     }
//   }

//   return (
//     <ScrollArea className="h-[calc(100vh-4rem)]">
//       <div className="space-y-2 p-2">
//         {channels.map((channel) => (
//           <Button
//             key={channel.id}
//             variant={channel.id === selectedChannelId ? "secondary" : "ghost"}
//             className="w-full justify-start"
//             onClick={() => onChannelSelect(channel.id)}
//           >
//             <MessageSquare className="mr-2 h-4 w-4" />
//             {channel.name}
//           </Button>
//         ))}
//       </div>
//       <div className="p-2">
//         <Input
//           placeholder="New channel name"
//           value={newChannelName}
//           onChange={(e) => setNewChannelName(e.target.value)}
//           className="mb-2"
//         />
//         <Button onClick={handleCreateChannel} className="w-full">
//           Create Channel
//         </Button>
//       </div>
//     </ScrollArea>
//   )
// }
 

export default function ChatApp() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [isChatWindowVisible, setIsChatWindowVisible] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedChannelName, setEditedChannelName] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      const userData = {
        email: user.email,
        lastActiveTimestamp: user.metadata.lastSignInTime,
        uid: user.uid,
      }

      const userRef = doc(db, 'users', user.uid)

      getDoc(userRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          setDoc(userRef, userData, { merge: true }).catch((error) =>
            console.error('Error updating user in Firestore:', error)
          )
        } else {
          setDoc(userRef, userData).catch((error) =>
            console.error('Error adding new user to Firestore:', error)
          )
        }
      }).catch((error) =>
        console.error('Error fetching user from Firestore:', error)
      )
    }
  }, [user])

  useEffect(() => {
    if (user) {
      const channelsRef = collection(db, 'channels')
      const q = query(channelsRef, where('members', 'array-contains', user.uid))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedChannels = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Channel[]
        setChannels(fetchedChannels)
        if (!selectedChannelId && fetchedChannels.length > 0) {
          setSelectedChannelId(fetchedChannels[0].id)
        }
      })

      return () => unsubscribe()
    }
  }, [user, selectedChannelId])

  useEffect(() => {
    if (selectedChannelId) {
      const timer = setTimeout(() => {
        setIsChatWindowVisible(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [selectedChannelId])

  const handleChannelCreate = async (name: string, members: string[]) => {
    if (user) {
      const channelData = {
        name,
        ownerId: user.uid,
        members: [user.uid, ...members],
      }
      const docRef = await addDoc(collection(db, 'channels'), channelData)
      setSelectedChannelId(docRef.id)
    }
  }

  const handleAddMember = async () => {
    if (!newMemberEmail || !validateEmail(newMemberEmail)) {
      // Show error
      return
    }

    if (newMemberEmail && selectedChannelId) {
      try {
        const userRef = query(collection(db, 'users'), where('email', '==', newMemberEmail))
        const userSnapshot = await getDocs(userRef)

        if (!userSnapshot.empty) {
          const member = userSnapshot.docs[0]
          const memberId = member.id

          const channelRef = doc(db, 'channels', selectedChannelId)
          await updateDoc(channelRef, {
            members: arrayUnion(memberId),
          })

          setNewMemberEmail('')
        } else {
          console.error('User not found.')
        }
      } catch (error) {
        console.error('Error adding member:', error)
      }
    }
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleEditChannelName = async () => {
    if (editedChannelName && selectedChannelId) {
      try {
        const channelRef = doc(db, 'channels', selectedChannelId)
        await updateDoc(channelRef, { name: editedChannelName })
        setIsEditingName(false)
        setEditedChannelName('')
      } catch (error) {
        console.error('Error updating channel name:', error)
      }
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Read-Rocket</h1> {/* Text color */}
          <ChannelList
            channels={channels}
            selectedChannelId={selectedChannelId}
            onChannelSelect={setSelectedChannelId}
            onChannelCreate={handleChannelCreate}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {isEditingName ? (
              <Input
                value={editedChannelName}
                onChange={(e) => setEditedChannelName(e.target.value)}
                onBlur={handleEditChannelName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEditChannelName();
                }}
                className="w-40 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800" // Adjust input colors for both themes
              />
            ) : (
              <>
                <span className="font-semibold text-gray-900 dark:text-white">
                  #{channels.find(channel => channel.id === selectedChannelId)?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-900 dark:text-gray-300"
                  onClick={() => {
                    setIsEditingName(true);
                    setEditedChannelName(channels.find(channel => channel.id === selectedChannelId)?.name || '');
                  }}
                >
                  <Edit className="h-4 w-4 text-gray-900 dark:text-gray-300" /> {/* Icon color */}
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-gray-900 dark:text-gray-300">
                  <Plus className="h-4 w-4 mr-2 text-gray-900 dark:text-gray-300" /> {/* Icon color */}
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-gray-100">Add Member</DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    Enter the email address of the user you want to add to this channel.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  placeholder="Email address"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800" // Input color
                />
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-900 dark:text-gray-300">
                  <Users className="h-4 w-4 text-gray-900 dark:text-gray-300" /> {/* Icon color */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300">
                <DropdownMenuLabel>Channel Members</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {channels
                  .find(channel => channel.id === selectedChannelId)
                  ?.members.map(memberId => (
                    <DropdownMenuItem key={memberId}>
                      <Avatar className="h-8 w-8 mr-2 bg-gray-200 dark:bg-gray-700">
                        <AvatarFallback className="text-gray-900 dark:text-white">
                          {memberId[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {memberId}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
          {selectedChannelId && (
            <MessageInput channelId={selectedChannelId} />
          )}
        </footer>
      </div>
    </div>
  ); 
}