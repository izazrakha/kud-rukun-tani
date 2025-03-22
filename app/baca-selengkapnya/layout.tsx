"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BacaSelengkapnyaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - Exactly matching the home page header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white shadow-md py-2" 
            : "bg-white py-2"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logokud.png"
              alt="KUD Rukun Tani Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-medium text-gray-800">KUD RUKUN TANI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 text-sm">
              BERANDA
            </Link>
            <Link href="/#layanan" className="text-gray-700 hover:text-gray-900 text-sm">
              LAYANAN KAMI
            </Link>
            <Link href="/#tentang" className="text-gray-700 hover:text-gray-900 text-sm">
              TENTANG KUD
            </Link>
          </nav>
          <Button 
            className="bg-[#2B7A39] hover:bg-[#236A2F] text-sm" 
            onClick={() => router.push('/login')}
          >
            Masuk Sekarang
          </Button>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-10">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-6 text-center mt-8">
        <p>Copyright © 2025. All rights reserved. Developed by KUD Rukun Tani</p>
      </footer>
    </div>
  );
}