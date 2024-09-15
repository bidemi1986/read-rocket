import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware, redirectToHome, redirectToLogin } from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "./config";

// Fix the extra comma and ensure correct paths
const PUBLIC_PATHS = ['/register', '/login', '/reset-password','/'];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: "/api/login", // Updated login path
    logoutPath: "/api/logout",
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
    handleValidToken: async ({ token, decodedToken }, headers) => {
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request); // Redirect if user tries to access public pages while authenticated
      }

      return NextResponse.next({
        request: {
          headers
        }
      });
    },
    handleInvalidToken: async (reason) => {
      console.info('Missing or malformed credentials', { reason });
      return redirectToLogin(request, {
        path: '/me/rooms', // Redirect to login if token is invalid
        publicPaths: PUBLIC_PATHS
      });
    },
    handleError: async (error) => {
      console.error('Unhandled authentication error', { error });
      return redirectToLogin(request, {
        path: '/login', // Redirect to login on error
        publicPaths: PUBLIC_PATHS
      });
    }
  });
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    // '/chat/:path*',
    // '/me/:path*',
    // '/profile/:path*',
    // '/settings/:path*',
    // '/[userid]/room/:path*',
    // '/[userid]/r/:path*',
    // '/new-room',
  ],
};
