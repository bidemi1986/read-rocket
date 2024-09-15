import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseAdmin';
import { firestore } from 'firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.query; // Get the user's UID from the query

  if (!uid) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const roomsRef = db.collection('rooms');
    const querySnapshot = await roomsRef.where('members', 'array-contains', uid).get(); // Correct Firestore method usage

    const rooms = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return res.status(500).json({ message: 'Failed to fetch rooms' });
  }
}
