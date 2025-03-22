"use client";

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function BacaSelengkapnya() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/">
          <Button className="mb-3 flex items-center bg-[#2B7A39] hover:bg-[#236A2F] text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> KEMBALI
          </Button>
          </Link>

          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="grid md:grid-cols-[280px,1fr] gap-8 mb-8">
              <div className="flex justify-center">
                <Image 
                  src="/logokud.png" 
                  alt="KUD Rukun Tani Emblem" 
                  width={280}
                  height={280}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#2B7A39] mb-4">
                  KOPERASI UNIT DESA (KUD)<br />
                  RUKUN TANI CILONGOK
                </h1>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Sejarah dan Peran KUD Rukun Tani Cilongok
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6 text-justify">
                  Koperasi Unit Desa (KUD) Rukun Tani Cilongok, yang berlokasi di Desa Pernasidi, Kecamatan Cilongok, Kabupaten Banyumas, telah menjadi pilar penting dalam pengembangan ekonomi pedesaan sejak pendiriannya. Sebagai salah satu KUD terbesar dan terbaik kedua di Kabupaten Banyumas, KUD ini berkomitmen untuk meningkatkan kesejahteraan anggotanya melalui berbagai unit usaha yang dikelola secara profesional.
                </p>
              </div>
            </div>

            <div className="text-gray-600 space-y-6 text-justify">
              <p>
                Sejak awal berdirinya, KUD Rukun Tani Cilongok telah berperan aktif dalam menyediakan berbagai layanan yang dirancang untuk memenuhi kebutuhan masyarakat setempat. Unit Pupuk, misalnya, menyediakan berbagai jenis pupuk berkualitas untuk mendukung produktivitas pertanian lokal. Unit Simpan Pinjam menawarkan layanan keuangan bagi anggota dan masyarakat sekitar, termasuk fasilitas kredit dan tabungan dengan bunga kompetitif. Unit Waserda/UKM Mart menjual berbagai kebutuhan pokok sehari-hari dengan harga terjangkau, seperti beras, minyak, dan gula.
              </p>
              <p>
                Selain itu, terdapat Unit Fotokopi yang menyediakan layanan fotokopi dan percetakan untuk keperluan administrasi dan pendidikan, serta Unit SOPP yang melayani pembayaran berbagai tagihan, termasuk listrik, air, telepon, dan angsuran kredit lainnya. Di bawah kepemimpinan Ketua KUD, Danan Setianto, yang telah berkiprah dalam dunia perkoperasian sejak tahun 1990, KUD Rukun Tani Cilongok terus berinovasi dan beradaptasi dengan perkembangan zaman. Hal ini dibuktikan dengan pengembangan unit usaha yang beragam dan peningkatan aset yang signifikan dari Rp5,37 miliar pada tahun 2014 menjadi Rp9,33 miliar pada tahun 2016.
              </p>
              <div className="flex justify-center">
                <Image 
                  src="/KUD.jpg" 
                  alt="foto KUD Rukun Tani" 
                  width={280}
                  height={280}
                  className="object-contain"
                />
              </div>
              <div className="flex text-sm font-bold justify-center">
                <p>Gambar KUD Rukun Tani Tampak Depan</p>
              </div>
              <p>
                Selain layanan utama tersebut, KUD Rukun Tani Cilongok juga berupaya meningkatkan pelayanan kepada anggota dan masyarakat melalui berbagai inisiatif. Beberapa di antaranya adalah menjalin kerja sama dengan pihak lain untuk memperluas jaringan bisnis, merintis usaha di bidang perdagangan gula merah, meningkatkan pelayanan UKM Mart dengan program BRI Link, serta berusaha menjadi distributor pupuk. KUD ini juga berencana menghidupkan kembali unit penggilingan padi (Rice Milling Unit) dan melakukan investasi di bidang tanah dan properti.
              </p>
              <p>
                Dengan semangat gotong royong dan profesionalisme, KUD Rukun Tani Cilongok berkomitmen untuk terus mendukung pertumbuhan ekonomi lokal dan kesejahteraan masyarakat melalui layanan yang berkualitas dan beragam. Keberhasilan ini tidak lepas dari partisipasi aktif anggota dan masyarakat, serta kerjasama yang solid antara pengurus dan berbagai pihak terkait.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}