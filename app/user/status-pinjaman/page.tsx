"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Type for user data
type UserData = {
  name: string
  role: string
  loanAmount: number
  savingsAmount: number
  profileImage?: string
}

// Type for loan transaction
type LoanTransaction = {
  id: number | string
  nominal: number | string
  tanggal: string
  tipe: string
  status: "Proses" | "Selesai" | "Ditolak" | "Menunggu" | "Draft"
}

export default function StatusPinjaman() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [allTransactions, setAllTransactions] = useState<LoanTransaction[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)

  // Number of transactions per page
  const transactionsPerPage = 9

  // Mock loan data
  const loanAmount = 2000000
  const remainingAmount = 1850000

  // Mock transaction data for fallback
  const mockTransactions: LoanTransaction[] = [
    { id: 2, nominal: 20000, tanggal: "20 Mei 2019", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 3, nominal: 20000, tanggal: "20 Apr 2019", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 4, nominal: 50000, tanggal: "05 Apr 2019", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 5, nominal: 20000, tanggal: "10 Mar 2019", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 6, nominal: 100000, tanggal: "25 Feb 2019", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 7, nominal: 20000, tanggal: "15 Feb 2019", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 8, nominal: 20000, tanggal: "20 Jan 2019", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 9, nominal: 50000, tanggal: "09 Jan 2019", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 10, nominal: 75000, tanggal: "01 Jan 2019", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 11, nominal: 30000, tanggal: "25 Dec 2018", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 12, nominal: 45000, tanggal: "15 Dec 2018", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 13, nominal: 60000, tanggal: "01 Dec 2018", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 14, nominal: 25000, tanggal: "20 Nov 2018", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 15, nominal: 35000, tanggal: "10 Nov 2018", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 16, nominal: 40000, tanggal: "01 Nov 2018", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 17, nominal: 55000, tanggal: "20 Oct 2018", tipe: "Pinjaman Anggota", status: "Selesai" },
    { id: 18, nominal: 65000, tanggal: "10 Oct 2018", tipe: "Pinjaman Anggota", status: "Selesai" },
  ]

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      setUserData(JSON.parse(storedUser))
    } else {
      // Redirect to login if not logged in
      router.push("/login")
    }

    // Load loan applications from localStorage
    const storedApplications = localStorage.getItem("loanApplications")
    let newTransactions: LoanTransaction[] = []

    if (storedApplications) {
      const applications = JSON.parse(storedApplications)

      // Convert applications to transaction format
      newTransactions = applications.map((app: any) => ({
        id: app.id,
        nominal: app.jumlahPinjaman,
        tanggal: app.tanggal,
        tipe: "Pinjaman Anggota",
        status: app.status,
      }))
    }

    // Combine with mock data and sort by newest first (assuming newer items have higher IDs)
    const combinedTransactions = [...newTransactions, ...mockTransactions].sort((a, b) => {
      if (typeof a.id === "string" && typeof b.id === "string") {
        return b.id.localeCompare(a.id)
      }
      return Number(b.id) - Number(a.id)
    })

    setAllTransactions(combinedTransactions)
    setTotalPages(Math.ceil(combinedTransactions.length / transactionsPerPage))
    setLoading(false)
  }, [router])

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Get current page transactions
  const getCurrentPageTransactions = () => {
    const startIndex = (currentPage - 1) * transactionsPerPage
    const endIndex = startIndex + transactionsPerPage
    return allTransactions.slice(startIndex, endIndex)
  }

  // Handle pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Format currency to Indonesian Rupiah
  const formatCurrency = (amount: number | string) => {
    if (typeof amount === "string") {
      // Remove non-numeric characters
      const numericValue = amount.replace(/\D/g, "")
      amount = Number.parseInt(numericValue) || 0
    }
    return new Intl.NumberFormat("id-ID").format(amount)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!userData) {
    return null // Will redirect in useEffect
  }

  const currentTransactions = getCurrentPageTransactions()
  const totalItems = allTransactions.length
  const startItem = (currentPage - 1) * transactionsPerPage + 1
  const endItem = Math.min(startItem + transactionsPerPage - 1, totalItems)

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
              <Link href="/user/dashboard" className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100">
                <LayoutDashboard className="mr-3" size={20} />
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
              <Link href="/user/status-pinjaman" className="flex items-center p-3 rounded-md bg-[#2B7A39] text-white">
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
          <h1 className="text-3xl font-bold mb-8">Status Pinjaman Anda</h1>

          {/* Loan Summary Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="space-y-3">
              <div className="flex">
                <span className="w-48 text-gray-600">Jumlah Pinjaman</span>
                <span className="font-medium">: {formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-gray-600">Sisa Cicilan Pinjaman</span>
                <span className="font-medium">: {formatCurrency(remainingAmount)}</span>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-medium">NOMINAL</TableHead>
                  <TableHead className="text-center font-medium">TANGGAL</TableHead>
                  <TableHead className="text-center font-medium">TIPE</TableHead>
                  <TableHead className="text-center font-medium">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-center">{formatCurrency(transaction.nominal)}</TableCell>
                    <TableCell className="text-center">{transaction.tanggal}</TableCell>
                    <TableCell className="text-center">{transaction.tipe}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          transaction.status === "Proses"
                            ? "bg-purple-200 text-purple-700 hover:bg-purple-200"
                            : transaction.status === "Ditolak"
                              ? "bg-red-200 text-red-700 hover:bg-red-200"
                              : transaction.status === "Menunggu"
                                ? "bg-orange-200 text-orange-700 hover:bg-orange-200"
                                : transaction.status === "Draft"
                                  ? "bg-blue-200 text-blue-700 hover:bg-blue-200"
                                  : "bg-teal-100 text-teal-700 hover:bg-teal-100"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-4 flex items-center justify-between border-t">
              <div className="text-sm text-gray-500">
                Showing {startItem}-{endItem} of {totalItems}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
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

