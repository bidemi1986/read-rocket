import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth'; // Use Firebase Admin SDK
import nookies from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Retrieve token from cookies
  const { token } = nookies.get({ req });

  if (!token) {
    return res.status(401).json({ error: 'No token found' });
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token);

    // Get the user's UID from the decoded token
    const { uid } = decodedToken;

    // Generate a fresh ID token using the Admin SDK
    const newToken = await getAuth().createCustomToken(uid);

    // Set the new token as a cookie
    nookies.set({ res }, 'token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return res.status(200).json({ message: 'Token refreshed', token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
