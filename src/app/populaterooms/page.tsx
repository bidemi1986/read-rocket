'use client';

import { useEffect } from 'react';
import { auth, db } from '@/apis/firebase'; // Import Firebase auth and Firestore instances
import { useAuth } from '@/context/authcontext'
import { addDoc, Timestamp, collection } from 'firebase/firestore';

interface RoomData {
  name: string;
  description: string;
  latestMessage: string;
  members: string[];
  lastActive: Timestamp;
  createdAt: Timestamp;
  lastUpdated: Timestamp;
  active: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  channelIds: string[];
  files: string[];
  tags: string[];
  topics: string[];
  ownerId: string;
  roomId: string;
}

const studyRooms = [
    { 
        name: "Physics 101",
        category: "Science",
        recentMessage: "Can someone explain quantum entanglement?",
        readers: 5,
        lastActive: "2023-06-15T10:30:00Z"
      },
      { 
        name: "World History",
        category: "History",
        recentMessage: "Discussing the impact of the Industrial Revolution",
        readers: 3,
        lastActive: "2023-06-15T09:45:00Z"
      },
      { 
        name: "Calculus Study Group",
        category: "Math",
        recentMessage: "Working on integration by parts problems",
        readers: 7,
        lastActive: "2023-06-14T14:20:00Z"
      },
      { 
        name: "Literature Circle",
        category: "English",
        recentMessage: "Analyzing themes in '1984' by George Orwell",
        readers: 4,
        lastActive: "2023-06-15T08:15:00Z"
      },
      { 
        name: "Computer Science Fundamentals",
        category: "Science",
        recentMessage: "Discussing Big O notation and algorithm efficiency",
        readers: 6,
        lastActive: "2023-06-15T10:05:00Z"
      },
      { 
        name: "Art History",
        category: "History",
        recentMessage: "Exploring the Renaissance period",
        readers: 2,
        lastActive: "2023-06-13T16:40:00Z"
      },
      { 
        name: "Biology Study Group",
        category: "Science",
        recentMessage: "Reviewing cellular respiration processes",
        readers: 5,
        lastActive: "2023-06-15T09:30:00Z"
      },
      { 
        name: "Statistics for Data Science",
        category: "Math",
        recentMessage: "Discussing hypothesis testing methods",
        readers: 8,
        lastActive: "2023-06-15T10:29:00Z"
      }
];

const createRoom = async (roomData: RoomData) => {
    try {
      const roomRef = await addDoc(collection(db, 'rooms'), roomData); // Firestore auto-generates roomId
      console.log(`Room ${roomData.name} created with ID: ${roomRef.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
};

export default function PopulateRooms() {
  const {user} = useAuth(); // Use Firebase hook to get logged-in user

  useEffect(() => {
    // Function to populate rooms with logged-in user as owner
    const populateRooms = async () => {
      if (user) {
        const ownerId = user.uid; // Get the logged-in user's UID

        for (const room of studyRooms) {
          const roomData = {
            name: room.name,
            description: room.category,
            latestMessage: room.recentMessage,
            members: [ownerId], // Set logged-in user as the first member
            lastActive: Timestamp.fromDate(new Date(room.lastActive)),
            createdAt: Timestamp.now(),
            lastUpdated: Timestamp.now(),
            active: true,
            visibility: 'public',
            channelIds: [],
            files: [],
            tags: [],
            topics: [],
            ownerId, // The logged-in user becomes the owner
          };

          try {
            await createRoom(roomData); // Create each room
          } catch (error) {
            console.error(`Failed to create room ${room.name}:`, error);
          }
        }
      } else {
        console.log('User not logged in');
      }
    };

    populateRooms(); // Run the population function on component mount
  }, [user]);

  return <div>Populating rooms... Check the console for updates.</div>;
}
