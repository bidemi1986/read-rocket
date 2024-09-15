// import { NextApiRequest, NextApiResponse } from 'next';
// import { verifyIdToken } from '@/lib/firebaseAdmin'; // Firebase Admin SDK
// import nookies from 'nookies';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     // Get token from cookies
//     const cookies = nookies.get({ req });
//     const token = cookies.token;

//     // If no token, return unauthorized
//     if (!token) {
//       return res.status(401).json({ error: 'Not authenticated' });
//     }

//     // Verify the token using Firebase Admin SDK
//     const decodedToken = await verifyIdToken(token);

//     // Return the user's UID if the token is valid
//     return res.status(200).json({ uid: decodedToken.uid });
//   } catch (error) {
//     console.error('Error verifying token:', error);
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// }
// src/pages/api/verify-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken } from '@/lib/firebaseAdmin'; // Firebase Admin SDK
import nookies from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = nookies.get({ req });
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decodedToken = await verifyIdToken(token);
    return res.status(200).json({ uid: decodedToken.uid });
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
