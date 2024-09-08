"use client"; // Mark this as a Client Component

import { usePathname } from 'next/navigation'; // Import usePathname hook
import Navbar from '@/components/navbar';
import Footer from './footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current path

  return (
    <>
      {/* Conditionally render the Navbar: Hide on home page ("/") */}
      {pathname !== '/' && <Navbar />}
      {children} 
      {pathname !== '/' &&<Footer />}
    </>
  );
}
