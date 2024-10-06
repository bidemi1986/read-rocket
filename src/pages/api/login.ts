// src/pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin-config'; // Ensure Firebase Admin is initialized
import nookies from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const authorization = req.headers.authorization;

      if (authorization?.startsWith('Bearer ')) {
        const idToken = authorization.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(idToken);

        if (decodedToken) {
          const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
          const sessionCookie = await auth.createSessionCookie(idToken, {
            expiresIn,
          });

          // Set the session cookie using nookies
          nookies.set({ res }, 'session', sessionCookie, {
            maxAge: expiresIn / 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
          });

          return res.status(200).json({ message: 'Logged in successfully' });
        }
      }

      return res.status(401).json({ error: 'Unauthorized' });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = nookies.get({ req });
    const session = cookies.session || '';

    if (!session) {
      return res.status(401).json({ isLogged: false });
    }

    // Validate the session cookie using Firebase Admin
    const decodedClaims = await auth.verifySessionCookie(session, true);

    if (!decodedClaims) {
      return res.status(401).json({ isLogged: false });
    }

    return res.status(200).json({ isLogged: true });
  } catch (error) {
    return res.status(401).json({ isLogged: false });
  }
}
