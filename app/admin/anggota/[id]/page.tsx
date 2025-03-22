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
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
type MemberDetail = {
  id: string
  nik: string
  name: string
  address: string
  status: string
  profileImage: string
}

// Type for transaction data
type Transaction = {
  id: number
  month: string
  date: string
  type: string
  status: "SUDAH" | "BELUM" | "PROSES"
}

// Mock member data
const MOCK_MEMBERS: Record<string, MemberDetail> = {
  "00001": {
    id: "00001",
    nik: "25225",
    name: "Izaz Rakha Anggara",
    address: "Jl Di Pandjaitan",
    status: "Anggota",
    profileImage: "/placeholder.svg?height=150&width=150",
  },
  "00002": {
    id: "00002",
    nik: "25226",
    name: "Rosie Pearson",
    address: "979 Immanuel Ferry Suite 526",
    status: "Anggota",
    profileImage: "/placeholder.svg?height=150&width=150",
  },
  "00003": {
    id: "00003",
    nik: "25227",
    name: "Darrell Caldwell",
    address: "8587 Frida Ports",
    status: "Anggota",
    profileImage: "/placeholder.svg?height=150&width=150",
  },
  "00004": {
    id: "00004",
    nik: "25228",
    name: "Gilbert Johnston",
    address: "768 Destiny Lake Suite 600",
    status: "Anggota",
    profileImage: "/placeholder.svg?height=150&width=150",
  },
  "00005": {
    id: "00005",
    nik: "25229",
    name: "Alan Cain",
    address: "042 Mylene Throughway",
    status: "Anggota",
    profileImage: "/placeholder.svg?height=150&width=150",
  },
}

// Mock transaction data for each member
const MOCK_TRANSACTIONS: Record<string, Transaction[]> = {
  "00001": [
    { id: 1, month: "Januari", date: "2 Januari 2024", type: "Simpanan Wajib", status: "SUDAH" },
    { id: 2, month: "Februari", date: "14 Februari 2024", type: "Simpanan Wajib", status: "SUDAH" },
    { id: 3, month: "Maret", date: "11 Maret 2024", type: "Simpanan Wajib", status: "SUDAH" },
    { id: 4, month: "April", date: "4 April 2024", type: "Simpanan Wajib", status: "SUDAH" },
    { id: 5, month: "Mei", date: "15 Mei 2024", type: "Simpanan Wajib", status: "SUDAH" },
    { id: 6, month: "Juni", date: "16 Juni 2024", type: "Simpanan Wajib", status: "SUDAH" },
    { id: 7, month: "Juli", date: "10 Juli 2024", type: "Simpanan Wajib", status: "BELUM" },
    { id: 8, month: "Agustus", date: "5 Agustus 2024", type: "Simpanan Wajib", status: "BELUM" },
    { id: 9, month: "September", date: "8 September 2024", type: "Simpanan Wajib", status: "BELUM" },
    { id: 10, month: "Oktober", date: "12 Oktober 2024", type: "Simpanan Wajib", status: "BELUM" },
    { id: 11, month: "November", date: "7 November 2024", type: "Simpanan Wajib", status: "BELUM" },
    { id: 12, month: "Desember", date: "3 Desember 2024", type: "Simpanan Wajib", status: "BELUM" },
  ],
  "00002": [
    { id: 1, month: "Januari", date: "3 Januari 2024", type: "Simpanan Wajib", status: "SUDAH" },
    { id: 2, month: "Februari", date: "5 Februari 2024", type: "Simpanan Wajib", status: "SUDAH" },
    { id: 3, month: "Maret", date: "7 Maret 2024", type: "Simpanan Wajib", status: "SUDAH" },
    { id: 4, month: "April", date: "9 April 2024", type: "Simpanan Wajib", status: "SUDAH" },
    { id: 5, month: "Mei", date: "11 Mei 2024", type: "Simpanan Wajib", status: "SUDAH" },
  ],
}

export default function MemberDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [memberData, setMemberData] = useState<MemberDetail | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

  // States for edit and delete functionality
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [editFormData, setEditFormData] = useState({
    month: "",
    date: "",
    type: "",
    status: "",
  })

  // Number of transactions per page
  const transactionsPerPage = 6

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

    // Get member data based on ID
    const member = MOCK_MEMBERS[params.id]
    if (member) {
      setMemberData(member)

      // Get transactions for this member
      const memberTransactions = MOCK_TRANSACTIONS[params.id] || []
      setTransactions(memberTransactions)
      setFilteredTransactions(memberTransactions)
      setTotalPages(Math.ceil(memberTransactions.length / transactionsPerPage))
    } else {
      // Member not found, redirect to members list
      router.push("/admin/anggota")
    }

    setLoading(false)
  }, [params.id, router])

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredTransactions(transactions)
      setTotalPages(Math.ceil(transactions.length / transactionsPerPage))
      setCurrentPage(1)
      return
    }

    const filtered = transactions.filter(
      (transaction) =>
        transaction.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setFilteredTransactions(filtered)
    setTotalPages(Math.ceil(filtered.length / transactionsPerPage))
    setCurrentPage(1)
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

  // Get status badge color based on status
  const getStatusBadgeClass = (status: Transaction["status"]) => {
    switch (status) {
      case "SUDAH":
        return "bg-teal-100 text-teal-700 hover:bg-teal-100"
      case "PROSES":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100"
      case "BELUM":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  // Handle edit button click
  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setEditFormData({
      month: transaction.month,
      date: transaction.date,
      type: transaction.type,
      status: transaction.status,
    })
    setShowEditDialog(true)
  }

  // Handle delete button click
  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowDeleteConfirmation(true)
  }

  // Handle edit form change
  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData({
      ...editFormData,
      [field]: value,
    })
  }

  // Handle edit form submit
  const handleEditSubmit = () => {
    if (!selectedTransaction) return

    // Update the transaction in the transactions array
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === selectedTransaction.id
        ? {
            ...transaction,
            month: editFormData.month,
            date: editFormData.date,
            type: editFormData.type,
            status: editFormData.status as "SUDAH" | "BELUM" | "PROSES",
          }
        : transaction,
    )

    // Update the state
    setTransactions(updatedTransactions)
    setFilteredTransactions(updatedTransactions)

    // Close the dialog
    setShowEditDialog(false)
    setSelectedTransaction(null)
  }

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (!selectedTransaction) return

    // Remove the transaction from the transactions array
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== selectedTransaction.id)

    // Update the state
    setTransactions(updatedTransactions)
    setFilteredTransactions(updatedTransactions)
    setTotalPages(Math.ceil(updatedTransactions.length / transactionsPerPage))

    // If the current page is now empty and not the first page, go to the previous page
    if (currentPage > 1 && (currentPage - 1) * transactionsPerPage >= updatedTransactions.length) {
      setCurrentPage(currentPage - 1)
    }

    // Close the dialog
    setShowDeleteConfirmation(false)
    setSelectedTransaction(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!adminData || !memberData) {
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus transaksi {selectedTransaction?.month} {selectedTransaction?.date}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
              Batal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaksi</DialogTitle>
            <DialogDescription>Ubah detail transaksi berikut</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="month" className="text-right">
                Bulan
              </Label>
              <Input
                id="month"
                value={editFormData.month}
                onChange={(e) => handleEditFormChange("month", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Tanggal
              </Label>
              <Input
                id="date"
                value={editFormData.date}
                onChange={(e) => handleEditFormChange("date", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipe
              </Label>
              <Input
                id="type"
                value={editFormData.type}
                onChange={(e) => handleEditFormChange("type", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={editFormData.status} onValueChange={(value) => handleEditFormChange("status", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUDAH">SUDAH</SelectItem>
                  <SelectItem value="BELUM">BELUM</SelectItem>
                  <SelectItem value="PROSES">PROSES</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
              Batal
            </Button>
            <Button type="button" className="bg-[#2B7A39] hover:bg-[#236A2F]" onClick={handleEditSubmit}>
              Simpan
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
          <div className="flex items-center mb-6">
            <Button
              onClick={() => router.push("/admin/anggota")}
              variant="default"
              className="bg-[#2B7A39] hover:bg-[#236A2F] mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> KEMBALI
            </Button>
            <h1 className="text-3xl font-bold">Data Anggota</h1>
          </div>

          {/* Member Profile Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-start">
              <div className="relative w-36 h-36 rounded-full overflow-hidden bg-[#2B7A39] flex items-center justify-center mr-8">
                <Image
                  src={memberData.profileImage || "/placeholder.svg"}
                  alt={memberData.name}
                  width={150}
                  height={150}
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center">
                  <span className="w-24 text-gray-600 font-medium">ID</span>
                  <span className="text-gray-900">: {memberData.id}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-gray-600 font-medium">NIK</span>
                  <span className="text-gray-900">: {memberData.nik}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-gray-600 font-medium">Nama</span>
                  <span className="text-gray-900">: {memberData.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-gray-600 font-medium">Alamat</span>
                  <span className="text-gray-900">: {memberData.address}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-gray-600 font-medium">Status</span>
                  <span className="text-gray-900">: {memberData.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex justify-end gap-4 mb-6">
            <div className="relative w-80">
              <Input
                type="text"
                placeholder="Search"
                className="pl-4 pr-4 py-2 rounded-full border border-gray-300 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="bg-[#2B7A39] hover:bg-[#236A2F] text-white px-6 rounded-full">
              Cari
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAMA BULAN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TANGGAL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TIPE
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
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusBadgeClass(transaction.status)}>{transaction.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 p-0 border-gray-300"
                          onClick={() => handleEditClick(transaction)}
                        >
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 p-0 border-gray-300"
                          onClick={() => handleDeleteClick(transaction)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {totalItems > 0 ? `Showing ${startItem}-${endItem} of ${totalItems}` : "No items to display"}
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

