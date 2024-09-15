import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseAdmin'; // Firestore admin instance from firebaseAdmin
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { ownerId, name, visibility, members, description } = req.body;

    // Check if required fields are present
    if (!ownerId || !name || !visibility || !members || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const roomData = {
        ownerId,
        name,
        visibility,
        members,
        description,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now(),
        active: true,
        latestMessage: '',
        lastActive: Timestamp.now(),
        channelIds: [],
        files: [],
        tags: [],
        topics: [],
        category: '', // Add category if applicable
      };

      // Add the room to the 'rooms' collection using Firestore admin SDK
      const docRef = await db.collection('rooms').add(roomData);

      return res.status(201).json({ roomId: docRef.id }); // Return roomId
    } catch (error) {
      console.error('Error creating room:', error);
      return res.status(500).json({ message: 'Failed to create room' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
