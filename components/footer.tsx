import Link from 'next/link';
import { Scissors, Phone, MapPin, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <Scissors className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">Luxe & Trim</span>
            </div>
            <p className="text-gray-400 text-sm">
              Premium salon services with expert stylists. Experience luxury grooming and styling in an elegant atmosphere.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services#haircuts" className="text-gray-400 hover:text-amber-400 transition-colors">Haircuts & Styling</Link></li>
              <li><Link href="/services#beard" className="text-gray-400 hover:text-amber-400 transition-colors">Beard Grooming</Link></li>
              <li><Link href="/services#facial" className="text-gray-400 hover:text-amber-400 transition-colors">Facial Treatments</Link></li>
              <li><Link href="/services#massage" className="text-gray-400 hover:text-amber-400 transition-colors">Massage Therapy</Link></li>
              <li><Link href="/services#color" className="text-gray-400 hover:text-amber-400 transition-colors">Hair Coloring</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-amber-400 transition-colors">About Us</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-amber-400 transition-colors">Gallery</Link></li>
              <li><Link href="/reviews" className="text-gray-400 hover:text-amber-400 transition-colors">Reviews</Link></li>
              <li><Link href="/booking" className="text-gray-400 hover:text-amber-400 transition-colors">Book Appointment</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-amber-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-gray-400">123 Luxury Ave, Downtown<br />New York, NY 10001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-gray-400">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-gray-400">info@luxetrim.com</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm">
                <strong>Hours:</strong><br />
                Mon-Fri: 9AM-8PM<br />
                Sat: 8AM-7PM<br />
                Sun: 10AM-6PM
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Luxe & Trim. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}