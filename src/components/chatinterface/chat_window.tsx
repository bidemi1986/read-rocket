import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from '@/apis/firebase';
import { Message } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function ChatWindow({ channelId }: { channelId: string; }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!channelId) return;

    const messagesRef = collection(db, 'channels', channelId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [channelId]);

  return (
    // <Card className="w-full h-[100%]">
      <ScrollArea className="  p-4">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="flex items-start mb-4">
              <Avatar className="mr-4">
                <AvatarFallback>
                  {message.user[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {message.user}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {message.text}
                </div>
                <Separator className="my-2" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-600 dark:text-gray-400 text-center">
            No messages in this channel yet.
          </div>
        )}
      </ScrollArea>
    // </Card>
  );
}
