"use client"

import { useEffect, useState, useRef } from "react"
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
  Printer,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Type for admin data
type AdminData = {
  name: string
  role: string
  profileImage?: string
}

// Type for transaction data
type Transaction = {
  id: string
  nik: string
  name: string
  type: "Simpanan Wajib" | "Simpanan Sukarela" | "Simpanan Pokok" | "Pinjaman"
  amount: number
  date: string
}

// Mock transaction data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TRX00001",
    nik: "3214876512345678",
    name: "Slamet Riyadi",
    type: "Simpanan Wajib",
    amount: 50000,
    date: "11/09/2023",
  },
  {
    id: "TRX00002",
    nik: "3214876512345679",
    name: "Maemunah",
    type: "Simpanan Sukarela",
    amount: 100000,
    date: "12/09/2023",
  },
  {
    id: "TRX00003",
    nik: "3214876512345680",
    name: "Darman",
    type: "Simpanan Pokok",
    amount: 200000,
    date: "13/09/2023",
  },
  {
    id: "TRX00004",
    nik: "3214876512345681",
    name: "Sutrisno",
    type: "Pinjaman",
    amount: 1000000,
    date: "14/09/2023",
  },
  {
    id: "TRX00005",
    nik: "3214876512345682",
    name: "Wati",
    type: "Simpanan Wajib",
    amount: 50000,
    date: "15/09/2023",
  },
  {
    id: "TRX00006",
    nik: "3214876512345683",
    name: "Bambang",
    type: "Simpanan Sukarela",
    amount: 150000,
    date: "16/09/2023",
  },
  {
    id: "TRX00007",
    nik: "3214876512345684",
    name: "Suparman",
    type: "Pinjaman",
    amount: 2000000,
    date: "17/09/2023",
  },
  {
    id: "TRX00008",
    nik: "3214876512345685",
    name: "Tuti",
    type: "Simpanan Pokok",
    amount: 200000,
    date: "18/09/2023",
  },
  {
    id: "TRX00009",
    nik: "3214876512345686",
    name: "Joko",
    type: "Simpanan Wajib",
    amount: 50000,
    date: "19/09/2023",
  },
  {
    id: "TRX00010",
    nik: "3214876512345687",
    name: "Sri",
    type: "Simpanan Sukarela",
    amount: 75000,
    date: "20/09/2023",
  },
  {
    id: "TRX00011",
    nik: "3214876512345688",
    name: "Budi",
    type: "Pinjaman",
    amount: 1500000,
    date: "21/09/2023",
  },
  {
    id: "TRX00012",
    nik: "3214876512345689",
    name: "Dewi",
    type: "Simpanan Pokok",
    amount: 200000,
    date: "22/09/2023",
  },
  {
    id: "TRX00013",
    nik: "3214876512345690",
    name: "Agus",
    type: "Simpanan Wajib",
    amount: 50000,
    date: "23/09/2023",
  },
  {
    id: "TRX00014",
    nik: "3214876512345691",
    name: "Rina",
    type: "Simpanan Sukarela",
    amount: 200000,
    date: "24/09/2023",
  },
  {
    id: "TRX00015",
    nik: "3214876512345692",
    name: "Hadi",
    type: "Pinjaman",
    amount: 3000000,
    date: "25/09/2023",
  },
]

export default function AdminLaporan() {
  const router = useRouter()
  const printFrameRef = useRef<HTMLIFrameElement>(null)
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [transactionType, setTransactionType] = useState<string>("all")
  const [showPrintDialog, setShowPrintDialog] = useState(false)

  // Number of transactions per page
  const transactionsPerPage = 10

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
    setTotalPages(Math.ceil(MOCK_TRANSACTIONS.length / transactionsPerPage))
  }, [router])

  // Filter transactions when transaction type changes
  useEffect(() => {
    filterTransactions()
  }, [transactionType, searchQuery])

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const filterTransactions = () => {
    let filtered = [...MOCK_TRANSACTIONS]

    // Filter by transaction type
    if (transactionType !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === transactionType)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.nik.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredTransactions(filtered)
    setTotalPages(Math.ceil(filtered.length / transactionsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSearch = () => {
    filterTransactions()
  }

  const handleTransactionTypeChange = (value: string) => {
    setTransactionType(value)
  }

  // Get current page transactions
  const getCurrentPageTransactions = () => {
    const startIndex = (currentPage - 1) * transactionsPerPage
    const endIndex = startIndex + transactionsPerPage
    return filteredTransactions.slice(startIndex, endIndex)
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
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  // Handle print button click
  const handlePrintClick = () => {
    setShowPrintDialog(true)
  }

  // Generate print content
  const generatePrintContent = () => {
    const title = transactionType === "all" ? "Laporan Semua Transaksi" : `Laporan Transaksi ${transactionType}`

    const date = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Transaksi KUD Rukun Tani</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            margin-bottom: 5px;
          }
          .header p {
            margin-top: 0;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .footer {
            margin-top: 20px;
            text-align: right;
          }
          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>KUD Rukun Tani</h1>
          <h2>${title}</h2>
          <p>Tanggal Cetak: ${date}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NIK</th>
              <th>NAMA</th>
              <th>JENIS TRANSAKSI</th>
              <th>JUMLAH</th>
              <th>TANGGAL</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTransactions
              .map(
                (transaction) => `
              <tr>
                <td>${transaction.id}</td>
                <td>${transaction.nik}</td>
                <td>${transaction.name}</td>
                <td>${transaction.type}</td>
                <td>${formatCurrency(transaction.amount)}</td>
                <td>${transaction.date}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Total Transaksi: ${filteredTransactions.length}</p>
        </div>
        
        <button onclick="window.print()" style="padding: 10px 20px; background-color: #2B7A39; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">
          Cetak Laporan
        </button>
      </body>
      </html>
    `
  }

  // Handle print confirmation
  const handlePrintConfirm = () => {
    // Create print content
    const printContent = generatePrintContent()

    // Open in new window
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      setShowPrintDialog(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!adminData) {
    return null // Will redirect in useEffect
  }

  const currentTransactions = getCurrentPageTransactions()
  const totalItems = filteredTransactions.length
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * transactionsPerPage + 1
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

      {/* Print Confirmation Dialog */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cetak Laporan</DialogTitle>
            <DialogDescription>
              Anda akan mencetak laporan{" "}
              {transactionType === "all" ? "semua transaksi" : `transaksi ${transactionType}`}. Lanjutkan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setShowPrintDialog(false)}>
              Batal
            </Button>
            <Button
              type="button"
              variant="default"
              className="bg-[#2B7A39] hover:bg-[#236A2F]"
              onClick={handlePrintConfirm}
            >
              Cetak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden iframe for printing */}
      <iframe ref={printFrameRef} style={{ display: "none" }} />

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
              <Link href="/admin/pinjaman" className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100">
                <FileText className="mr-3" size={20} />
                <span>Pinjaman</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/laporan" className="flex items-center p-3 rounded-md bg-[#2B7A39] text-white">
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
            <h1 className="text-3xl font-bold">Laporan Transaksi</h1>
            <Button
              onClick={handlePrintClick}
              className="bg-[#2B7A39] hover:bg-[#236A2F] text-white flex items-center gap-2"
            >
              <Printer size={18} />
              <span>Cetak Laporan</span>
            </Button>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-64">
              <Select value={transactionType} onValueChange={handleTransactionTypeChange}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Pilih Jenis Transaksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Transaksi</SelectItem>
                  <SelectItem value="Simpanan Wajib">Simpanan Wajib</SelectItem>
                  <SelectItem value="Simpanan Sukarela">Simpanan Sukarela</SelectItem>
                  <SelectItem value="Simpanan Pokok">Simpanan Pokok</SelectItem>
                  <SelectItem value="Pinjaman">Pinjaman</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

          {/* Transactions Table */}
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
                      JENIS TRANSAKSI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      JUMLAH
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TANGGAL
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.nik}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                    </tr>
                  ))}
                  {currentTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        Tidak ada transaksi yang ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {totalItems > 0 ? `Menampilkan ${startItem}-${endItem} dari ${totalItems}` : "Tidak ada data"}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1 || totalItems === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalItems === 0}
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

