"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { LayoutDashboard, Users, Wallet, FileText, BarChart3, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Type for admin data
type AdminData = {
  name: string
  role: string
  profileImage?: string
}

export default function AdminPinjaman() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [isPinjamanOpen, setIsPinjamanOpen] = useState(true)

  useEffect(() => {
    // Check if user is logged in and is an admin
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      const user = JSON.parse(storedUser)

      if (user.role === "Admin") {
        setAdminData(user)
      } else {
        // Redirect to user dashboard if not an admin
        router.push("/dashboard")
      }
    } else {
      // Redirect to login if not logged in
      router.push("/login")
    }

    setLoading(false)
  }, [router])

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const togglePinjamanDropdown = () => {
    setIsPinjamanOpen(!isPinjamanOpen)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!adminData) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen">
      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Keluar</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin keluar dari akun Anda?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setShowLogoutConfirmation(false)}>
              Tidak
            </Button>
            <Button type="button" variant="default" className="bg-[#2B7A39] hover:bg-[#236A2F]" onClick={handleLogout}>
              Ya
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-md z-10">
        {/* KUD Logo/Title at top of sidebar */}
        <div className="p-6 pb-4">
          <h1 className="text-xl">
            <span className="text-[#2B7A39] font-bold">KUD</span>{" "}
            <span className="font-bold text-gray-800">Rukun Tani</span>
          </h1>
        </div>

        <nav className="px-4 py-2">
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin/dashboard"
                className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <LayoutDashboard className="mr-3" size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/anggota" className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100">
                <Users className="mr-3" size={20} />
                <span>Anggota</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/simpanan" className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100">
                <Wallet className="mr-3" size={20} />
                <span>Simpanan</span>
              </Link>
            </li>
            <li>
              <div className="flex flex-col">
                <button
                  onClick={togglePinjamanDropdown}
                  className="flex items-center p-3 rounded-md bg-[#2B7A39] text-white w-full text-left"
                >
                  <FileText className="mr-3" size={20} />
                  <span>Pinjaman</span>
                  <ChevronDown className={`ml-auto h-5 w-5 transform ${isPinjamanOpen ? "rotate-180" : ""}`} />
                </button>
                {isPinjamanOpen && (
                  <div className="ml-7 mt-1 space-y-1">
                    <Link
                      href="/admin/pinjaman/pengajuan-pinjaman"
                      className="block p-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      Pengajuan Pinjaman
                    </Link>
                    <Link
                      href="/admin/pinjaman/data-cicilan"
                      className="block p-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      Data Cicilan
                    </Link>
                  </div>
                )}
              </div>
            </li>
            <li>
              <Link href="/admin/laporan" className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100">
                <BarChart3 className="mr-3" size={20} />
                <span>Laporan</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pengaturan"
                className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Settings className="mr-3" size={20} />
                <span>Pengaturan</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogoutClick}
                className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="mr-3" size={20} />
                <span>Keluar</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header - now only on the right side */}
        <header className="bg-[#2B7A39] text-white p-2 flex justify-end items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Image
                src={adminData.profileImage || "/placeholder.svg?height=40&width=40"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium">{adminData.name}</p>
                <p className="text-sm">{adminData.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-8">
          <h1 className="text-3xl font-bold mb-8">Manajemen Pinjaman</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pengajuan Pinjaman Card */}
            <div className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold mb-4">Pengajuan Pinjaman</h2>
              <p className="text-gray-600 mb-6">
                Kelola pengajuan pinjaman dari anggota. Setujui atau tolak pengajuan pinjaman baru.
              </p>
              <Button
                onClick={() => router.push("/admin/pinjaman/pengajuan-pinjaman")}
                className="bg-[#2B7A39] hover:bg-[#236A2F]"
              >
                Lihat Pengajuan
              </Button>
            </div>

            {/* Data Cicilan Card */}
            <div className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold mb-4">Data Cicilan</h2>
              <p className="text-gray-600 mb-6">
                Kelola data cicilan pinjaman anggota. Catat pembayaran cicilan dan pantau status pembayaran.
              </p>
              <Button
                onClick={() => router.push("/admin/pinjaman/data-cicilan")}
                className="bg-[#2B7A39] hover:bg-[#236A2F]"
              >
                Lihat Data Cicilan
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
