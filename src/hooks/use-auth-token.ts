import { useEffect } from 'react';
import { auth } from '@/apis/firebase';
import nookies from 'nookies';

export default function useAuthToken() {
  useEffect(() => {
    // Subscribe to the onIdTokenChanged event to handle token changes
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(true); // Force refresh token immediately
          nookies.set(undefined, 'token', token, {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false, // Token is client-managed, so not httpOnly
          });
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      } else {
        // User is not signed in, clear the token
        nookies.destroy(undefined, 'token');
      }
    });

    // Set up token refresh interval (every 50 minutes)
    const handleTokenRefresh = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          await user.getIdToken(true); // Force token refresh
        } catch (error) {
          console.error('Error refreshing token at interval:', error);
        }
      }
    }, 50 * 60 * 1000); // 50 minutes

    return () => {
      unsubscribe();
      clearInterval(handleTokenRefresh); // Cleanup on component unmount
    };
  }, []);
}

