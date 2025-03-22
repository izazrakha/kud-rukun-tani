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
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

// Type for member data
type Member = {
  id: string
  nik: string
  name: string
  address: string
  date: string
  type: string
  status: "Selesai" | "Proses" | "Ditolak" | "Menunggu" | "Draft"
}

// Mock member data
const MOCK_MEMBERS: Member[] = [
  {
    id: "00001",
    nik: "25225",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "04 Sep 2019",
    type: "Electric",
    status: "Selesai",
  },
  {
    id: "00002",
    nik: "25226",
    name: "Rosie Pearson",
    address: "979 Immanuel Ferry Suite 526",
    date: "28 May 2019",
    type: "Book",
    status: "Proses",
  },
  {
    id: "00003",
    nik: "25227",
    name: "Darrell Caldwell",
    address: "8587 Frida Ports",
    date: "23 Nov 2019",
    type: "Medicine",
    status: "Ditolak",
  },
  {
    id: "00004",
    nik: "25228",
    name: "Gilbert Johnston",
    address: "768 Destiny Lake Suite 600",
    date: "05 Feb 2019",
    type: "Mobile",
    status: "Selesai",
  },
  {
    id: "00005",
    nik: "25229",
    name: "Alan Cain",
    address: "042 Mylene Throughway",
    date: "29 Jul 2019",
    type: "Watch",
    status: "Proses",
  },
  {
    id: "00006",
    nik: "25230",
    name: "Alfred Murray",
    address: "543 Weimann Mountain",
    date: "15 Aug 2019",
    type: "Medicine",
    status: "Selesai",
  },
  {
    id: "00007",
    nik: "25231",
    name: "Maggie Sullivan",
    address: "New Scottleberg",
    date: "21 Dec 2019",
    type: "Watch",
    status: "Proses",
  },
  {
    id: "00008",
    nik: "25232",
    name: "Rosie Todd",
    address: "New Jon",
    date: "30 Apr 2019",
    type: "Medicine",
    status: "Menunggu",
  },
  {
    id: "00009",
    nik: "25233",
    name: "Dollie Hines",
    address: "124 Lyla Forge Suite 975",
    date: "09 Jan 2019",
    type: "Book",
    status: "Draft",
  },
]

export default function AdminAnggota() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS)

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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setMembers(MOCK_MEMBERS)
      return
    }

    const filteredMembers = MOCK_MEMBERS.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.id.includes(searchQuery) ||
        member.nik.includes(searchQuery),
    )

    setMembers(filteredMembers)
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
              <Link href="/admin/anggota" className="flex items-center p-3 rounded-md bg-[#2B7A39] text-white">
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Daftar Anggota</h1>
            <Button className="bg-[#2B7A39] hover:bg-[#236A2F]" onClick={() => router.push("/register")}>
              Tambah Anggota
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Cari berdasarkan ID, NIK, atau Nama"
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button onClick={handleSearch} className="bg-[#2B7A39] hover:bg-[#236A2F] text-white px-6">
              Cari
            </Button>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NAMA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ALAMAT
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.nik}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Link href={`/admin/anggota/${member.id}`} className="text-blue-600 hover:underline">
                          {member.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">Showing 1-09 of 78</div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

