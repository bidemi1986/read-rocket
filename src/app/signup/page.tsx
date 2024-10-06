"use client"; // Mark it as a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/apis/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Handle email/password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); // Get Firebase token

      // Redirect to your server-side login endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push('/me/rooms'); // Redirect to rooms on success
      } else {
        setError('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Invalid email or password');
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken(); // Get Firebase token

      // Redirect to your server-side login endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push('/me/rooms'); // Redirect to rooms on success
      } else {
        setError('Google login failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Google sign-in failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-[family-name:var(--font-geist-sans)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create Your Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="user">Username</Label>
              <Input
                id="User Name"
                type="username"
                placeholder="HenryFong"
                value={email}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              <FaGoogle />
              <span className="mr-2" />
              Sign Up with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
