import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { db } from '@/lib/firebaseAdmin'; // Firestore instance
import { clientConfig, serverConfig } from '@/config'; // Your Firebase config
import { Timestamp } from 'firebase-admin/firestore'; // Firestore admin timestamp
import nookies from 'nookies'; // For setting cookies

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token, true); // Enforce token expiration check
    const { uid, email, firebase } = decodedToken;
    console.log("{ uid, email, firebase } from token ", { uid, email, firebase });

    const googleId = firebase?.identities?.['google.com']?.[0] || '';

    // Set the Firebase token in an HTTP-only cookie
    nookies.set({ res }, serverConfig.cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',  // Set cookie for all paths
      maxAge: 60 * 60, // Set token expiration to 1 hour (matching Firebase token)
    });

    // Firestore logic with Firebase Admin SDK
    const userRef = db.collection('users').doc(uid);
    const docSnapshot = await userRef.get();

    // Define default user data
    const userData = {
      email: email || '',
      googleId: googleId,
      isAdmin: false,
      lastActiveTimestamp: Timestamp.now(),
      createdAt: Timestamp.now(),
      username: email || '',
      credits: 3,
      userId: uid,
    };

    if (docSnapshot.exists) {
      const existingUserData = docSnapshot.data();
      const updatedUserData = {
        ...userData,
        ...existingUserData, // Merge existing data, overriding defaults
        createdAt: existingUserData?.createdAt || Timestamp.now(), // Preserve original createdAt
      };
      // Update Firestore user record
      await userRef.set(updatedUserData, { merge: true });
    } else {
      // Create new user record if not found
      await userRef.set(userData);
    }

    // Respond with a success message
    return res.status(200).json({ message: 'Login successful and user data updated' });
  } catch (error) {
    console.error('Token verification or user record handling failed:', error);

    // Handle expired tokens with specific messaging
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired, please login again.' });
    }

    return res.status(401).json({ error: 'Invalid token or user record handling failed' });
  }
}
