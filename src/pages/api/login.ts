import { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken } from '@/lib/firebaseAdmin';
import nookies from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await verifyIdToken(token);

    // Set the token in an HTTP-only cookie
    nookies.set({ res }, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure cookie in production
      path: '/',
    });

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
