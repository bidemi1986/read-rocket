// src/pages/api/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Remove the token by clearing the cookie
  nookies.destroy({ res }, 'token', { path: '/' });
  res.status(200).json({ message: 'Logged out successfully' });
}
