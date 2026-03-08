import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luxe & Trim - Premium Salon Experience",
  description: "Book premium salon services with expert stylists. Haircuts, styling, grooming, and more at Luxe & Trim.",
  keywords: "salon, hair salon, beauty salon, haircuts, styling, grooming, luxury salon",
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
          {/* global navbar/footer */}
          <div className="flex flex-col min-h-screen">
            <header>
              <Navbar />
            </header>
            <main className="flex-grow">{children}</main>
            <footer>
              <Footer />
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
