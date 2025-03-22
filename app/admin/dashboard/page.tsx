"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Download,
  Upload,
  Package,
  UserCircle,
} from "lucide-react"
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

// Mock statistics data
const MOCK_STATS = {
  memberCount: 25,
  applicationCount: 125,
  savingsTotal: 1500,
  loansTotal: 2040,
}

export default function AdminDashboard() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)

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
              <Link href="/admin/dashboard" className="flex items-center p-3 rounded-md bg-[#2B7A39] text-white">
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
              <Link href="/admin/pinjaman" className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100">
                <FileText className="mr-3" size={20} />
                <span>Pinjaman</span>
              </Link>
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
          <h1 className="text-4xl font-bold mb-8">Selamat datang, Admin!</h1>
          <hr className="mb-8 border-gray-200" />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Member Count Card */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl text-gray-600 mb-4">Jumlah Anggota</h2>
                  <p className="text-6xl font-bold">{MOCK_STATS.memberCount}</p>
                </div>
                <div className="bg-[#EEF1FF] p-6 rounded-lg">
                  <UserCircle size={40} className="text-[#8B95EE]" />
                </div>
              </div>
            </div>

            {/* Application Count Card */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl text-gray-600 mb-4">Jumlah Pengajuan</h2>
                  <p className="text-6xl font-bold">{MOCK_STATS.applicationCount}</p>
                </div>
                <div className="bg-[#FFF8E6] p-6 rounded-lg">
                  <Package size={40} className="text-[#FFD166]" />
                </div>
              </div>
            </div>

            {/* Savings Total Card */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl text-gray-600 mb-4">Total Simpanan</h2>
                  <p className="text-6xl font-bold">{MOCK_STATS.savingsTotal}</p>
                </div>
                <div className="bg-[#E6FFF0] p-6 rounded-lg">
                  <Download size={40} className="text-[#2B7A39]" />
                </div>
              </div>
            </div>

            {/* Loans Total Card */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl text-gray-600 mb-4">Total Pinjaman</h2>
                  <p className="text-6xl font-bold">{MOCK_STATS.loansTotal}</p>
                </div>
                <div className="bg-[#FFECE6] p-6 rounded-lg">
                  <Upload size={40} className="text-[#FF6B35]" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

