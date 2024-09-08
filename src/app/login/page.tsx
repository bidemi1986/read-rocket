"use client"; // Mark it as a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/apis/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Function to send the token to the API for secure cookie storage
  const sendTokenToBackend = async (token: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        router.push('/me/rooms'); // Redirect to rooms on success
      } else {
        setError('Login failed');
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  // Handle email/password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); // Get Firebase token
      await sendTokenToBackend(token); // Send the token to the backend
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  // Handle Google sign-in client-side
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken(); // Get Firebase token
      await sendTokenToBackend(token); // Send the token to the backend
    } catch (error) {
      setError('Google sign-in failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-[family-name:var(--font-geist-sans)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              <FaGoogle/><span className="mr-2"/>
               Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
