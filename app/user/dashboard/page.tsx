"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, FileText, ClipboardList, Wallet, Settings, LogOut, Upload, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Type for user data
type UserData = {
  name: string
  role: string
  loanAmount: number
  savingsAmount: number
  profileImage?: string
}

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      setUserData(JSON.parse(storedUser))
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

  if (!userData) {
    return null // Will redirect in useEffect
  }

  // Format currency to Indonesian Rupiah
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID").format(amount)
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

      {/* Sidebar - now extends full height */}
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
              <Link href="/user/dashboard" className="flex items-center p-3 rounded-md bg-[#2B7A39] text-white">
                <CheckCircle className="mr-3" size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/user/pengajuan-pinjaman"
                className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <FileText className="mr-3" size={20} />
                <span>Pengajuan Pinjaman</span>
              </Link>
            </li>
            <li>
              <Link
                href="/user/status-pinjaman"
                className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <ClipboardList className="mr-3" size={20} />
                <span>Status Pinjaman</span>
              </Link>
            </li>
            <li>
              <Link
                href="/user/daftar-simpanan"
                className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Wallet className="mr-3" size={20} />
                <span>Daftar Simpanan</span>
              </Link>
            </li>
            <li>
              <Link href="/user/pengaturan" className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100">
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
                src={userData.profileImage || "/placeholder.svg?height=40&width=40"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium">{userData.name}</p>
                <p className="text-sm">{userData.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-8">
          <h1 className="text-4xl font-bold mb-8">Selamat datang, {userData.name}</h1>
          <hr className="mb-8 border-gray-200" />

          {/* Loan Amount Card */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl text-gray-600 mb-4">Jumlah Pinjaman Anda</h2>
                <p className="text-5xl font-bold">Rp {formatCurrency(userData.loanAmount)}</p>
              </div>
              <div className="bg-[#FFECE6] p-6 rounded-lg">
                <Upload size={32} className="text-[#FF6B35]" />
              </div>
            </div>
          </div>

          {/* Savings Amount Card */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl text-gray-600 mb-4">Jumlah Simpanan Anda</h2>
                <p className="text-5xl font-bold">Rp {formatCurrency(userData.savingsAmount)}</p>
              </div>
              <div className="bg-[#E6FFF0] p-6 rounded-lg">
                <Download size={32} className="text-[#2B7A39]" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

