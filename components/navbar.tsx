'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Calendar,
  Users,
  BarChart3,
  Scissors
} from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  const getUserMenuItems = () => {
    const commonItems = [
      { label: 'Profile', href: '/profile', icon: User },
      { label: 'Settings', href: '/settings', icon: Settings },
    ];

    const roleSpecificItems = {
      admin: [
        { label: 'Admin Dashboard', href: '/admin', icon: BarChart3 },
        { label: 'Manage Staff', href: '/admin/staff', icon: Users },
        { label: 'Manage Services', href: '/admin/services', icon: Scissors },
      ],
      staff: [
        { label: 'Staff Dashboard', href: '/staff', icon: Calendar },
        { label: 'My Schedule', href: '/staff/schedule', icon: Calendar },
      ],
      customer: [
        { label: 'My Dashboard', href: '/dashboard', icon: Calendar },
        { label: 'My Appointments', href: '/dashboard/appointments', icon: Calendar },
      ],
    };

    return [
      ...commonItems,
      ...(roleSpecificItems[user?.role as keyof typeof roleSpecificItems] || []),
    ];
  };

  return (
    <nav className="bg-black/95 backdrop-blur-sm border-b border-amber-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <Scissors className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">Luxe & Trim</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-gray-300 hover:text-amber-400 transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-amber-400 transition-colors">
              About
            </Link>
            <Link href="/gallery" className="text-gray-300 hover:text-amber-400 transition-colors">
              Gallery
            </Link>
            <Link href="/reviews" className="text-gray-300 hover:text-amber-400 transition-colors">
              Reviews
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">
              Contact
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-amber-500/20 rounded-lg shadow-lg py-1">
                    {getUserMenuItems().map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <hr className="border-amber-500/20 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-amber-400 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-amber-500/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/services"
                className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/gallery"
                className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/reviews"
                className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Reviews
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              {user ? (
                <>
                  <div className="border-t border-amber-500/20 my-2"></div>
                  <div className="px-3 py-2 text-amber-400 font-medium">
                    Welcome, {user.name}
                  </div>
                  {getUserMenuItems().map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-amber-500/20 my-2"></div>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-lg font-medium text-center mx-3"
                    onClick={() => setIsOpen(false)}
                  >
                    Book Now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}