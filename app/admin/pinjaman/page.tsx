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
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Type for admin data
type AdminData = {
  name: string
  role: string
  profileImage?: string
}

// Type for loan application
type LoanApplication = {
  id: string
  userId: string
  name: string
  nik: string
  amount: number
  duration: string
  date: string
  status: "Menunggu" | "Disetujui" | "Ditolak"
}

// Mock loan application data
const MOCK_LOAN_APPLICATIONS: LoanApplication[] = [
  {
    id: "00001",
    userId: "U00001",
    name: "Christine Brooks",
    nik: "25225",
    amount: 5000000,
    duration: "12 bulan",
    date: "04 Sep 2023",
    status: "Menunggu",
  },
  {
    id: "00002",
    userId: "U00002",
    name: "Rosie Pearson",
    nik: "25226",
    amount: 3000000,
    duration: "6 bulan",
    date: "28 May 2023",
    status: "Menunggu",
  },
  {
    id: "00003",
    userId: "U00003",
    name: "Darrell Caldwell",
    nik: "25227",
    amount: 10000000,
    duration: "24 bulan",
    date: "23 Nov 2023",
    status: "Disetujui",
  },
  {
    id: "00004",
    userId: "U00004",
    name: "Gilbert Johnston",
    nik: "25228",
    amount: 2000000,
    duration: "6 bulan",
    date: "05 Feb 2024",
    status: "Ditolak",
  },
  {
    id: "00005",
    userId: "U00005",
    name: "Alan Cain",
    nik: "25229",
    amount: 7500000,
    duration: "18 bulan",
    date: "29 Jul 2023",
    status: "Disetujui",
  },
  {
    id: "00006",
    userId: "U00006",
    name: "Alfred Murray",
    nik: "25230",
    amount: 4000000,
    duration: "12 bulan",
    date: "15 Aug 2023",
    status: "Menunggu",
  },
  {
    id: "00007",
    userId: "U00007",
    name: "Maggie Sullivan",
    nik: "25231",
    amount: 8000000,
    duration: "24 bulan",
    date: "21 Dec 2023",
    status: "Menunggu",
  },
  {
    id: "00008",
    userId: "U00008",
    name: "Rosie Todd",
    nik: "25232",
    amount: 1500000,
    duration: "3 bulan",
    date: "30 Apr 2024",
    status: "Menunggu",
  },
  {
    id: "00009",
    userId: "U00009",
    name: "Dollie Hines",
    nik: "25233",
    amount: 6000000,
    duration: "12 bulan",
    date: "09 Jan 2024",
    status: "Menunggu",
  },
]

export default function AdminPinjaman() {
  const router = useRouter()
  const { toast } = useToast()
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>(MOCK_LOAN_APPLICATIONS)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject"
    application: LoanApplication | null
  }>({ type: "approve", application: null })

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
      setLoanApplications(MOCK_LOAN_APPLICATIONS)
      return
    }

    const filteredApplications = MOCK_LOAN_APPLICATIONS.filter(
      (application) =>
        application.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.id.includes(searchQuery) ||
        application.nik.includes(searchQuery),
    )

    setLoanApplications(filteredApplications)
  }

  // Format currency to Indonesian Rupiah
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  // Handle approve button click
  const handleApproveClick = (application: LoanApplication) => {
    setConfirmAction({
      type: "approve",
      application,
    })
    setShowConfirmDialog(true)
  }

  // Handle reject button click
  const handleRejectClick = (application: LoanApplication) => {
    setConfirmAction({
      type: "reject",
      application,
    })
    setShowConfirmDialog(true)
  }

  // Handle confirm action
  const handleConfirmAction = () => {
    if (!confirmAction.application) return

    const updatedApplications = loanApplications.map((app) => {
      if (app.id === confirmAction.application?.id) {
        return {
          ...app,
          status: confirmAction.type === "approve" ? ("Disetujui" as const) : ("Ditolak" as const),
        }
      }
      return app
    })

    setLoanApplications(updatedApplications)
    setShowConfirmDialog(false)

    // Show toast notification
    toast({
      title: confirmAction.type === "approve" ? "Pengajuan Disetujui" : "Pengajuan Ditolak",
      description: `Pengajuan pinjaman dari ${confirmAction.application.name} telah ${
        confirmAction.type === "approve" ? "disetujui" : "ditolak"
      }.`,
      variant: "default",
    })
  }

  // Get status badge color based on status
  const getStatusBadgeClass = (status: LoanApplication["status"]) => {
    switch (status) {
      case "Disetujui":
        return "bg-teal-100 text-teal-700 hover:bg-teal-100"
      case "Menunggu":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100"
      case "Ditolak":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
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

      {/* Action Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmAction.type === "approve" ? "Konfirmasi Persetujuan" : "Konfirmasi Penolakan"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction.type === "approve"
                ? `Apakah Anda yakin ingin menyetujui pengajuan pinjaman dari ${confirmAction.application?.name}?`
                : `Apakah Anda yakin ingin menolak pengajuan pinjaman dari ${confirmAction.application?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Batal
            </Button>
            <Button
              type="button"
              variant={confirmAction.type === "approve" ? "default" : "destructive"}
              className={confirmAction.type === "approve" ? "bg-[#2B7A39] hover:bg-[#236A2F]" : ""}
              onClick={handleConfirmAction}
            >
              {confirmAction.type === "approve" ? "Setujui" : "Tolak"}
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
              <Link href="/admin/pinjaman" className="flex items-center p-3 rounded-md bg-[#2B7A39] text-white">
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
          <h1 className="text-3xl font-bold mb-8">Pengajuan Pinjaman</h1>

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

          {/* Loan Applications Table */}
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
                      JUMLAH PINJAMAN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DURASI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TANGGAL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AKSI
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loanApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.nik}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(application.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusBadgeClass(application.status)}>{application.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {application.status === "Menunggu" && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 p-0 border-gray-300"
                                onClick={() => handleApproveClick(application)}
                                title="Setujui"
                              >
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 p-0 border-gray-300"
                                onClick={() => handleRejectClick(application)}
                                title="Tolak"
                              >
                                <XCircle className="h-5 w-5 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing 1-{loanApplications.length} of {loanApplications.length}
              </div>
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

