import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes"; // Import ThemeProvider
import { AuthProvider } from "@/context/authcontext";
import ClientLayout from '@/components/ClientLayout'; // Import the client-side layout

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Read Rocket",
  description: "Ai group chat and document fact finder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        {/* Wrap the app with ThemeProvider */}
        <ThemeProvider attribute="class"> 
          <Toaster />
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
