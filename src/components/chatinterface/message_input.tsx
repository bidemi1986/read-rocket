import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db, auth } from '@/apis/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FaSmile, FaRegLaugh } from 'react-icons/fa';
import { Button } from '@/components/ui/button'; // Shadcn Button
import { Input } from '@/components/ui/input'; // Shadcn Input
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Shadcn Popover for emoji/gif picker
import { useToast } from '@/hooks/use-toast'; // Shadcn toast for feedback

// Uncomment and use the Giphy API for gif fetching
// const gf = new GiphyFetch('YOUR_GIPHY_API_KEY');

export function MessageInput({ channelId }: { channelId: string }) {
  const [message, setMessage] = useState('');
  const [inputError, setInputError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Get the authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) {
      // setInputError('Message cannot be empty.');
      toast({ title:'Error',description: 'Message cannot be empty',  variant: 'destructive', // You can use variants like 'destructive'
      });
      return;
    }

    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const username = userDoc.exists() ? userDoc.data()?.username || 'Anonymous' : 'Anonymous';

        await addDoc(collection(db, 'channels', channelId, 'messages'), {
          user: username,
          text: message.trim(),
          timestamp: Timestamp.now(),
        });

        setMessage(''); // Clear the message input after sending
        toast({ description: 'Message sent successfully' });
      } catch (error) {
        console.error('Error sending message: ', error);
        setInputError('Failed to send the message. Please try again.');
      }
    } else {
      setInputError('You must be logged in to send a message.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (inputError) {
      setInputError('');
    }
  };

  const addEmoji = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
    setShowEmojiPicker(false);
  };

  const selectGif = (gif: any) => {
    setMessage((prevMessage) => prevMessage + ` ${gif.url} `);
    setShowGifPicker(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center shadow-lg space-x-2">
        <Input
          id="message-input"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          className={inputError ? 'border-red-500' : ''}
        />

        {/* Emoji Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2"
              aria-label="Toggle Emoji Picker"
            >
              <FaSmile />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            {/* Replace the following div with an actual emoji picker library, like emoji-mart */}
            <div className="p-2">
              <Button onClick={() => addEmoji({ native: '😄' })}>😄</Button>
              <Button onClick={() => addEmoji({ native: '😢' })}>😢</Button>
              <Button onClick={() => addEmoji({ native: '❤️' })}>❤️</Button>
              {/* You can map more emojis here */}
            </div>
          </PopoverContent>
        </Popover>

        {/* GIF Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setShowGifPicker(!showGifPicker)}
              className="p-2"
              aria-label="Toggle GIF Picker"
            >
              <FaRegLaugh />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            {/* Replace the following div with an actual GIF picker */}
            {/* {showGifPicker && (
              <div className="w-80 h-80 bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg">
                <Grid
                  fetchGifs={() => gf.trending({ limit: 10 })}
                  width={280}
                  columns={2}
                  gutter={6}
                  onGifClick={(gif) => selectGif(gif)}
                />
              </div>
            )} */}
            <div className="p-2">
              <Button onClick={() => selectGif({ url: 'https://giphy.com/some-gif-url' })}>
                Select GIF
              </Button>
              {/* You can map more GIFs here */}
            </div>
          </PopoverContent>
        </Popover>

        <Button onClick={sendMessage} className="bg-purple-500 dark:bg-purple-600 text-white">
          Send
        </Button>
      </div> 
    </div>
  );
}
