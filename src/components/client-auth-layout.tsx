// src/components/server-auth-layout.tsx (Server Component)
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { clientConfig, serverConfig } from "../config";
import { redirect } from "next/navigation";

export default async function ServerAuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies(); // Get cookies from the request

  // Get tokens from cookies
  const tokens = await getTokens(cookieStore, {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  // If tokens are missing or invalid, redirect to login
  if (!tokens) {
    redirect('/login');
  }

  // If tokens are valid, render the children
  return <>{children}</>;
}
