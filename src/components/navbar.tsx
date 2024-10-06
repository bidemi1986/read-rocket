import { useState, useEffect } from 'react';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import nookies from 'nookies';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [error, setError] = useState('');
  const router = useRouter();

  const Logout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        router.push('/login'); // Redirect to rooms on success
        nookies.destroy(null, 'token');
        nookies.set(null, 'token', '', { path: '/' }); // Set empty token
        // window.location.href = '/login'; // Redirect to login
      } else {
        setError('Login failed');
      }
    } catch (error) {
      setError('Login failed');
    }
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-gray-100 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">[Read-Rocket]</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#"
                className="text-gray-800 dark:text-gray-300 hover:text-gray-600 dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-800 dark:text-gray-300 hover:text-gray-600 dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-800 dark:text-gray-300 hover:text-gray-600 dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              className="mr-6"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-6 w-6 text-gray-800 dark:text-gray-300 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 text-gray-800 dark:text-gray-300 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {/* AvatarImage fallback styling */}
                    <AvatarImage
                      src="/placeholder-user.jpg"
                      alt="@user"
                      className="bg-gray-200 dark:bg-gray-700" // Light and dark background for AvatarImage
                    />
                    <AvatarFallback className="bg-gray-500 dark:bg-gray-700 text-white dark:text-gray-200">
                      U
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={Logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="ml-4 md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6 text-gray-800 dark:text-gray-300" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Home</DropdownMenuItem>
                  <DropdownMenuItem>About</DropdownMenuItem>
                  <DropdownMenuItem>Contact</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
