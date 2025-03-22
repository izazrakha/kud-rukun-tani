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
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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

// Type for savings transaction
type SavingsTransaction = {
  id: number
  nominal: number
  tanggal: string
  jenis: "Sukarela" | "Wajib" | "Pokok"
  status: "Proses" | "Selesai"
}

export default function DaftarSimpanan() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [allTransactions, setAllTransactions] = useState<SavingsTransaction[]>([])

  // Number of transactions per page
  const transactionsPerPage = 9

  // Mock savings data
  const totalSavings = 400000
  const flexibleSavings = 250000

  // Mock transaction data - updated with more recent dates for newer IDs
  const mockTransactions: SavingsTransaction[] = [
    { id: 18, nominal: 65000, tanggal: "01 Jun 2023", jenis: "Sukarela", status: "Proses" },
    { id: 17, nominal: 55000, tanggal: "20 May 2023", jenis: "Wajib", status: "Selesai" },
    { id: 16, nominal: 40000, tanggal: "10 May 2023", jenis: "Sukarela", status: "Selesai" },
    { id: 15, nominal: 35000, tanggal: "01 May 2023", jenis: "Wajib", status: "Selesai" },
    { id: 14, nominal: 25000, tanggal: "20 Apr 2023", jenis: "Pokok", status: "Selesai" },
    { id: 13, nominal: 60000, tanggal: "10 Apr 2023", jenis: "Wajib", status: "Selesai" },
    { id: 12, nominal: 45000, tanggal: "01 Apr 2023", jenis: "Sukarela", status: "Selesai" },
    { id: 11, nominal: 30000, tanggal: "20 Mar 2023", jenis: "Wajib", status: "Selesai" },
    { id: 10, nominal: 75000, tanggal: "10 Mar 2023", jenis: "Sukarela", status: "Selesai" },
    { id: 9, nominal: 50000, tanggal: "01 Mar 2023", jenis: "Pokok", status: "Selesai" },
    { id: 8, nominal: 20000, tanggal: "20 Feb 2023", jenis: "Wajib", status: "Selesai" },
    { id: 7, nominal: 20000, tanggal: "10 Feb 2023", jenis: "Wajib", status: "Selesai" },
    { id: 6, nominal: 100000, tanggal: "01 Feb 2023", jenis: "Sukarela", status: "Selesai" },
    { id: 5, nominal: 20000, tanggal: "20 Jan 2023", jenis: "Wajib", status: "Selesai" },
    { id: 4, nominal: 50000, tanggal: "10 Jan 2023", jenis: "Sukarela", status: "Selesai" },
    { id: 3, nominal: 20000, tanggal: "01 Jan 2023", jenis: "Wajib", status: "Selesai" },
    { id: 2, nominal: 20000, tanggal: "20 Dec 2022", jenis: "Wajib", status: "Selesai" },
    { id: 1, nominal: 100000, tanggal: "10 Dec 2022", jenis: "Sukarela", status: "Selesai" },
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

    // Check for any savings transactions in localStorage (for future implementation)
    const storedSavings = localStorage.getItem("savingsTransactions")
    let newTransactions: SavingsTransaction[] = []

    if (storedSavings) {
      newTransactions = JSON.parse(storedSavings)
    }

    // Combine with mock data and sort by newest first
    // Using ID as a proxy for date - higher ID means newer transaction
    const combinedTransactions = [...newTransactions, ...mockTransactions].sort((a, b) => b.id - a.id)

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
  const formatCurrency = (amount: number) => {
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
              <Link
                href="/user/status-pinjaman"
                className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <ClipboardList className="mr-3" size={20} />
                <span>Status Pinjaman</span>
              </Link>
            </li>
            <li>
              <Link href="/user/daftar-simpanan" className="flex items-center p-3 rounded-md bg-[#2B7A39] text-white">
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
          <h1 className="text-3xl font-bold mb-8">Daftar Simpanan Anda</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Savings Summary Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-48 text-gray-600">Simpanan Keseluruhan</span>
                  <span className="font-medium">: {formatCurrency(totalSavings)}</span>
                </div>
                <div className="flex">
                  <span className="w-48 text-gray-600">Simpanan Fleksibel</span>
                  <span className="font-medium">: {formatCurrency(flexibleSavings)}</span>
                </div>
              </div>
            </div>

            {/* Information Note */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-600 font-medium">Note :</AlertTitle>
                <AlertDescription className="text-sm text-gray-700">
                  Simpanan Keseluruhan ialah jumlah nominal dari seluruh jenis simpanan sedangkan Simpanan Fleksibel
                  ialah jumlah nominal dari simpanan jenis Sukarela yang tentunya dapat ditarik kapan saja. Untuk
                  Simpanan Pokok dan Wajib hanya dapat diambil sesuai dengan syarat dan ketentuan yang sebelumnya sudah
                  disetujui ketika mendaftar sebagai anggota KUD Rukun Tani.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-medium">NOMINAL</TableHead>
                  <TableHead className="text-center font-medium">TANGGAL</TableHead>
                  <TableHead className="text-center font-medium">JENIS</TableHead>
                  <TableHead className="text-center font-medium">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-center">{formatCurrency(transaction.nominal)}</TableCell>
                    <TableCell className="text-center">{transaction.tanggal}</TableCell>
                    <TableCell className="text-center">{transaction.jenis}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          transaction.status === "Proses"
                            ? "bg-purple-200 text-purple-700 hover:bg-purple-200"
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

