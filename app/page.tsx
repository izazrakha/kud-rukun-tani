"use client";

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users, Building2, Network } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function Home() {
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

  // Smooth scroll function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
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
            <button onClick={() => scrollToSection('beranda')} className="text-gray-700 hover:text-gray-900 text-sm">
              BERANDA
            </button>
            <button onClick={() => scrollToSection('layanan')} className="text-gray-700 hover:text-gray-900 text-sm">
              LAYANAN KAMI
            </button>
            <button onClick={() => scrollToSection('tentang')} className="text-gray-700 hover:text-gray-900 text-sm">
              TENTANG KUD
            </button>
          </nav>
          <Button 
            className="bg-[#2B7A39] hover:bg-[#236A2F] text-sm" 
            onClick={() => router.push('/login')}
          >
            Masuk Sekarang
          </Button>
        </div>
      </header>

      {/* Beranda Section - Full Screen */}
      <section id="beranda" className="min-h-screen pt-20 flex items-center bg-gray-100">
        <div className="max-w-[1440px] mx-auto px-2 grid sm:grid-cols-2 gap-5 items-center">
          <div>
            <h1 className="text-[2.75rem] font-bold text-gray-800 leading-tight">
              SYSTEM MANAGEMENT
              <br />
              <span className="text-[#2B7A39]">KOPERASI UNIT DESA(KUD)</span>
              <br />
              RUKUN TANI
              <br />
              CILONGOK
            </h1>
            <p className="mt-4 text-gray-600">Koperasi Unit Desa Rukun Tani Cilongok 2025</p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/man&comp.png"
              alt="KUD Management System Illustration"
              width={500}
              height={400}
              priority
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Layanan Section - Full Screen */}
      <section id="layanan" className="min-h-screen m-2 p-2 flex flex-col justify-center">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-[#2B7A39] text-3xl font-bold mt-10 mb-1">LAYANAN KAMI</h2>
            <p className="text-gray-600">3 Layanan Utama KUD Rukun Tani Cilongok</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            <div className="bg-[#F0FDF4] p-8 rounded-xl text-center">
              <div className="flex justify-center mb-6">
                <Users className="h-12 w-12 text-[#2B7A39]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">UNIT SOPP</h3>
              <p className="text-gray-600">
                Melayani pembayaran listrik, air, telepon, dan tagihan lainnya untuk kemudahan anggota.
              </p>
            </div>

            <div className="bg-[#F0FDF4] p-8 rounded-xl text-center">
              <div className="flex justify-center mb-6">
                <Building2 className="h-12 w-12 text-[#2B7A39]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">UKM MART</h3>
              <p className="text-gray-600">
                Menyediakan kebutuhan pokok dan produk pertanian dengan harga terjangkau bagi anggota dan masyarakat sekitar.
              </p>
            </div>

            <div className="bg-[#F0FDF4] p-8 rounded-xl text-center">
              <div className="flex justify-center mb-6">
                <Network className="h-12 w-12 text-[#2B7A39]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">SIMPAN PINJAM ANGGOTA</h3>
              <p className="text-gray-600">
                Menyediakan layanan simpan pinjam dengan bunga rendah dan syarat mudah bagi anggota koperasi.
              </p>
            </div>
          </div>

          <div className="max-w-[1000px] mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Bergabunglah Menjadi Anggota! <span className="text-[#2B7A39]">Untuk Menikmati Seluruh Layanan Yang Ada!</span>
            </h2>
            <p className="text-gray-600 text-justify">
              Dan beragam lagi layanan kami yang tersedia di KUD Rukun Tani mulai dari Pemasaran & Distribusi Hasil Pertanian untuk
              membantu anggota dalam menjual hasil pertanian dengan harga yang kompetitif dan menjalin kerja sama dengan pasar atau
              industri pengolahan hasil pertanian. Penyediaan Sarana & Prasarana Pertanian dimana kami menyediakan pupuk bersubsidi, benih,
              pestisida, dan alat pertanian untuk memenuhi kebutuhan anggota. Serta, Unit Fotokopi yang menyediakan layanan fotokopi untuk 
              kebutuhan administratif dan pendidikan.
            </p>
          </div>
        </div>
      </section>

      {/* Tentang Section - Full Screen */}
<section id="tentang" className="mt-10 pt-20 pb-10 bg-gray-100">
    {/* Logo & Deskripsi */}
    <div className="grid md:grid-cols-2 gap-0 items-center mb-5">
      <div className="flex justify-center">
        <Image
          src="/logokud.png"
          alt="KUD Rukun Tani Emblem"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>
      <div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">KUD Rukun Tani Cilongok</h2>
        <p className="text-gray-600 text-justify leading-relaxed mb-6 pr-10">
          KUD Rukun Tani Cilongok adalah Koperasi Unit Desa yang berperan sebagai wadah ekonomi bagi petani
          dan masyarakat di Kecamatan Cilongok, Kabupaten Banyumas. Sebagai salah satu KUD terbesar di daerahnya,
          kami menyediakan berbagai layanan dengan prinsip kebersamaan dan kesejahteraan anggota.
        </p>
        <button 
          className="bg-[#2B7A39] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#236A2F]"
          onClick={() => router.push('/baca-selengkapnya')}
        >
          Baca Selengkapnya
        </button>
      </div>
    </div>
</section>

      {/* Statistik Section - White Background */}
      <section className="bg-white py-10">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Kami Koperasi Lokal <br />
                <span className="text-[#2B7A39]">Bekerja Secara Universal</span>
              </h2>
              <p className="text-gray-600 mt-2">
                Dengan komitmen tinggi dan kerja sama yang solid, kami terus berkembang untuk melayani lebih baik.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Users className="h-6 w-6 text-[#2B7A39]" />, number: "100+", label: "Anggota" },
                { icon: <Users className="h-6 w-6 text-[#2B7A39]" />, number: "20+", label: "Kemitraan & Kerjasama" },
                { icon: <Building2 className="h-6 w-6 text-[#2B7A39]" />, number: "150+", label: "Produk UKM Mart" },
                { icon: <Network className="h-6 w-6 text-[#2B7A39]" />, number: "50+", label: "Simpan & Pinjam" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="bg-[#F0FDF4] p-3 rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-xl">{item.number}</p>
                    <p className="text-sm text-gray-600">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-6 text-center">
        <p>Copyright © 2025. All rights reserved. Developed by KUD Rukun Tani</p>
      </footer>
    </div>
  )
}