"use client"

import type React from "react"

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
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Type for admin data
type AdminData = {
  name: string
  role: string
  profileImage?: string
}

// Type for installment data
type Installment = {
  id: string
  nik: string
  name: string
  loanAmount: number
  installmentAmount: number
  month: string
  status: "Lunas" | "Belum Lunas"
}

// Mock installment data
const MOCK_INSTALLMENTS: Installment[] = [
  {
    id: "INS00001",
    nik: "25225",
    name: "Christine Brooks",
    loanAmount: 5000000,
    installmentAmount: 450000,
    month: "Januari 2024",
    status: "Lunas",
  },
  {
    id: "INS00002",
    nik: "25226",
    name: "Rosie Pearson",
    loanAmount: 3000000,
    installmentAmount: 270000,
    month: "Januari 2024",
    status: "Lunas",
  },
  {
    id: "INS00003",
    nik: "25227",
    name: "Darrell Caldwell",
    loanAmount: 10000000,
    installmentAmount: 900000,
    month: "Januari 2024",
    status: "Belum Lunas",
  },
  {
    id: "INS00004",
    nik: "25228",
    name: "Gilbert Johnston",
    loanAmount: 2000000,
    installmentAmount: 180000,
    month: "Januari 2024",
    status: "Lunas",
  },
  {
    id: "INS00005",
    nik: "25229",
    name: "Alan Cain",
    loanAmount: 7500000,
    installmentAmount: 675000,
    month: "Januari 2024",
    status: "Belum Lunas",
  },
  {
    id: "INS00006",
    nik: "25225",
    name: "Christine Brooks",
    loanAmount: 5000000,
    installmentAmount: 450000,
    month: "Februari 2024",
    status: "Lunas",
  },
  {
    id: "INS00007",
    nik: "25226",
    name: "Rosie Pearson",
    loanAmount: 3000000,
    installmentAmount: 270000,
    month: "Februari 2024",
    status: "Belum Lunas",
  },
  {
    id: "INS00008",
    nik: "25227",
    name: "Darrell Caldwell",
    loanAmount: 10000000,
    installmentAmount: 900000,
    month: "Februari 2024",
    status: "Belum Lunas",
  },
  {
    id: "INS00009",
    nik: "25228",
    name: "Gilbert Johnston",
    loanAmount: 2000000,
    installmentAmount: 180000,
    month: "Februari 2024",
    status: "Lunas",
  },
]

export default function DataCicilan() {
  const router = useRouter()
  const { toast } = useToast()
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [installments, setInstallments] = useState<Installment[]>(MOCK_INSTALLMENTS)
  const [filteredInstallments, setFilteredInstallments] = useState<Installment[]>(MOCK_INSTALLMENTS)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isPinjamanOpen, setIsPinjamanOpen] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newInstallment, setNewInstallment] = useState<{
    nik: string
    name: string
    loanAmount: string
    installmentAmount: string
    month: string
    status: "Lunas" | "Belum Lunas"
  }>({
    nik: "",
    name: "",
    loanAmount: "",
    installmentAmount: "",
    month: "",
    status: "Belum Lunas",
  })

  // Add state for edit and delete dialogs
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null)
  const [editFormData, setEditFormData] = useState({
    nik: "",
    name: "",
    loanAmount: "",
    installmentAmount: "",
    month: "",
    status: "Belum Lunas" as "Lunas" | "Belum Lunas",
  })

  // Number of installments per page
  const installmentsPerPage = 9

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

    // Sort installments by ID in descending order (newest first)
    const sortedInstallments = [...MOCK_INSTALLMENTS].sort((a, b) => {
      // Extract numeric part from ID for proper sorting
      const idA = Number.parseInt(a.id.replace(/\D/g, ""))
      const idB = Number.parseInt(b.id.replace(/\D/g, ""))
      return idB - idA // Descending order
    })

    setInstallments(sortedInstallments)
    setFilteredInstallments(sortedInstallments)

    setLoading(false)
    const calculatedTotalPages = Math.max(1, Math.ceil(sortedInstallments.length / installmentsPerPage))
    setTotalPages(calculatedTotalPages)
  }, [router, installmentsPerPage])

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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredInstallments(installments)
      const newTotalPages = Math.max(1, Math.ceil(installments.length / installmentsPerPage))
      setTotalPages(newTotalPages)
      setCurrentPage(1)
      return
    }

    const filtered = installments.filter(
      (installment) =>
        installment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        installment.nik.includes(searchQuery) ||
        installment.id.includes(searchQuery) ||
        installment.month.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setFilteredInstallments(filtered)
    const newTotalPages = Math.max(1, Math.ceil(filtered.length / installmentsPerPage))
    setTotalPages(newTotalPages)
    setCurrentPage(1)
  }

  // Get current page installments
  const getCurrentPageInstallments = () => {
    const startIndex = (currentPage - 1) * installmentsPerPage
    const endIndex = startIndex + installmentsPerPage
    return filteredInstallments.slice(startIndex, endIndex)
  }

  // Handle pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
      // Scroll to top of table when changing pages
      const tableElement = document.querySelector(".bg-white.rounded-lg.shadow-sm.overflow-hidden")
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
      // Scroll to top of table when changing pages
      const tableElement = document.querySelector(".bg-white.rounded-lg.shadow-sm.overflow-hidden")
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  // Format currency to Indonesian Rupiah
  const formatCurrency = (amount: number | string) => {
    if (typeof amount === "string") {
      // Remove non-numeric characters
      const numericValue = amount.replace(/\D/g, "")
      amount = Number.parseInt(numericValue) || 0
    }
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  // Handle input change for new installment
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewInstallment((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle select change for new installment
  const handleSelectChange = (name: string, value: string) => {
    if (name === "status") {
      // Ensure the status is properly typed
      setNewInstallment((prev) => ({
        ...prev,
        status: value as "Lunas" | "Belum Lunas",
      }))
    } else {
      setNewInstallment((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle create new installment
  const handleCreateInstallment = () => {
    // Validate form
    if (
      !newInstallment.nik.trim() ||
      !newInstallment.name.trim() ||
      !newInstallment.loanAmount.trim() ||
      !newInstallment.installmentAmount.trim() ||
      !newInstallment.month.trim()
    ) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      })
      return
    }

    // Create new installment
    const newId = `INS${(installments.length + 1).toString().padStart(5, "0")}`
    const newInstallmentData: Installment = {
      id: newId,
      nik: newInstallment.nik,
      name: newInstallment.name,
      loanAmount: Number(newInstallment.loanAmount.replace(/\D/g, "")),
      installmentAmount: Number(newInstallment.installmentAmount.replace(/\D/g, "")),
      month: newInstallment.month,
      status: newInstallment.status as "Lunas" | "Belum Lunas",
    }

    // Add to installments (at the beginning to show newest first)
    const updatedInstallments = [newInstallmentData, ...installments]
    setInstallments(updatedInstallments)
    setFilteredInstallments(updatedInstallments)
    setTotalPages(Math.ceil(updatedInstallments.length / installmentsPerPage))

    // If we're not on the first page, go to first page to see the new entry
    if (currentPage !== 1) {
      setCurrentPage(1)
    }

    // Reset form and close dialog
    setNewInstallment({
      nik: "",
      name: "",
      loanAmount: "",
      installmentAmount: "",
      month: "",
      status: "Belum Lunas",
    })
    setIsCreateDialogOpen(false)

    // Show success toast
    toast({
      title: "Berhasil",
      description: "Data cicilan berhasil ditambahkan",
      variant: "default",
    })
  }

  // Handle status change
  const handleStatusChange = (id: string) => {
    const updatedInstallments = installments.map((installment) => {
      if (installment.id === id) {
        const newStatus: "Lunas" | "Belum Lunas" = installment.status === "Lunas" ? "Belum Lunas" : "Lunas"
        return {
          ...installment,
          status: newStatus,
        }
      }
      return installment
    })

    setInstallments(updatedInstallments)
    setFilteredInstallments(
      filteredInstallments.map((installment) => {
        if (installment.id === id) {
          const newStatus: "Lunas" | "Belum Lunas" = installment.status === "Lunas" ? "Belum Lunas" : "Lunas"
          return {
            ...installment,
            status: newStatus,
          }
        }
        return installment
      }),
    )

    toast({
      title: "Status Diperbarui",
      description: "Status cicilan berhasil diperbarui",
      variant: "default",
    })
  }

  // Add these functions after the handleStatusChange function

  // Handle edit button click
  const handleEditClick = (installment: Installment) => {
    setSelectedInstallment(installment)
    setEditFormData({
      nik: installment.nik,
      name: installment.name,
      loanAmount: installment.loanAmount.toString(),
      installmentAmount: installment.installmentAmount.toString(),
      month: installment.month,
      status: installment.status,
    })
    setShowEditDialog(true)
  }

  // Handle delete button click
  const handleDeleteClick = (installment: Installment) => {
    setSelectedInstallment(installment)
    setShowDeleteConfirmation(true)
  }

  // Handle edit form submit
  const handleEditSubmit = () => {
    if (!selectedInstallment) return

    // Create updated installment
    const updatedInstallment: Installment = {
      id: selectedInstallment.id,
      nik: editFormData.nik,
      name: editFormData.name,
      loanAmount: Number(editFormData.loanAmount.replace(/\D/g, "")),
      installmentAmount: Number(editFormData.installmentAmount.replace(/\D/g, "")),
      month: editFormData.month,
      status: editFormData.status,
    }

    // Update installments
    const updatedInstallments = installments.map((installment) =>
      installment.id === selectedInstallment.id ? updatedInstallment : installment,
    )

    setInstallments(updatedInstallments)
    setFilteredInstallments(
      filteredInstallments.map((installment) =>
        installment.id === selectedInstallment.id ? updatedInstallment : installment,
      ),
    )

    // Close dialog and show success toast
    setShowEditDialog(false)
    setSelectedInstallment(null)

    toast({
      title: "Data Diperbarui",
      description: "Data cicilan berhasil diperbarui",
      variant: "default",
    })
  }

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (!selectedInstallment) return

    // Remove installment
    const updatedInstallments = installments.filter((installment) => installment.id !== selectedInstallment.id)

    setInstallments(updatedInstallments)
    setFilteredInstallments(filteredInstallments.filter((installment) => installment.id !== selectedInstallment.id))

    // Update total pages
    setTotalPages(Math.ceil(updatedInstallments.length / installmentsPerPage))

    // If current page is now empty and not the first page, go to previous page
    if (currentPage > 1 && (currentPage - 1) * installmentsPerPage >= updatedInstallments.length) {
      setCurrentPage(currentPage - 1)
    }

    // Close dialog and show success toast
    setShowDeleteConfirmation(false)
    setSelectedInstallment(null)

    toast({
      title: "Data Dihapus",
      description: "Data cicilan berhasil dihapus",
      variant: "default",
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!adminData) {
    return null // Will redirect in useEffect
  }

  const currentInstallments = getCurrentPageInstallments()
  const totalItems = filteredInstallments.length
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * installmentsPerPage + 1
  const endItem = Math.min(startItem + installmentsPerPage - 1, totalItems)

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

      {/* Create Installment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Data Cicilan</DialogTitle>
            <DialogDescription>Masukkan data cicilan baru</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nik" className="text-right">
                NIK
              </Label>
              <Input
                id="nik"
                name="nik"
                value={newInstallment.nik}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                name="name"
                value={newInstallment.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loanAmount" className="text-right">
                Jumlah Pinjaman
              </Label>
              <Input
                id="loanAmount"
                name="loanAmount"
                value={newInstallment.loanAmount}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Rp"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="installmentAmount" className="text-right">
                Besar Cicilan
              </Label>
              <Input
                id="installmentAmount"
                name="installmentAmount"
                value={newInstallment.installmentAmount}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Rp"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="month" className="text-right">
                Bulan
              </Label>
              <Input
                id="month"
                name="month"
                value={newInstallment.month}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Contoh: Januari 2024"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newInstallment.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lunas">Lunas</SelectItem>
                  <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Batal
            </Button>
            <Button type="button" className="bg-[#2B7A39] hover:bg-[#236A2F]" onClick={handleCreateInstallment}>
              Simpan
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
              Apakah Anda yakin ingin menghapus data cicilan {selectedInstallment?.name} untuk bulan{" "}
              {selectedInstallment?.month}?
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

      {/* Edit Installment Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Cicilan</DialogTitle>
            <DialogDescription>Ubah data cicilan</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-nik" className="text-right">
                NIK
              </Label>
              <Input
                id="edit-nik"
                value={editFormData.nik}
                onChange={(e) => setEditFormData({ ...editFormData, nik: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nama
              </Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-loanAmount" className="text-right">
                Jumlah Pinjaman
              </Label>
              <Input
                id="edit-loanAmount"
                value={editFormData.loanAmount}
                onChange={(e) => setEditFormData({ ...editFormData, loanAmount: e.target.value })}
                className="col-span-3"
                placeholder="Rp"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-installmentAmount" className="text-right">
                Besar Cicilan
              </Label>
              <Input
                id="edit-installmentAmount"
                value={editFormData.installmentAmount}
                onChange={(e) => setEditFormData({ ...editFormData, installmentAmount: e.target.value })}
                className="col-span-3"
                placeholder="Rp"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-month" className="text-right">
                Bulan
              </Label>
              <Input
                id="edit-month"
                value={editFormData.month}
                onChange={(e) => setEditFormData({ ...editFormData, month: e.target.value })}
                className="col-span-3"
                placeholder="Contoh: Januari 2024"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, status: value as "Lunas" | "Belum Lunas" })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lunas">Lunas</SelectItem>
                  <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
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
                      className="block p-2 rounded-md bg-[#e6f7ed] text-[#2B7A39] font-medium"
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Data Cicilan</h1>
            <Button
              className="bg-[#2B7A39] hover:bg-[#236A2F] flex items-center gap-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus size={18} />
              <span>Tambah Data</span>
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

          {/* Installments Table */}
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
                      BESAR CICILAN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BULAN
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
                  {currentInstallments.map((installment) => (
                    <tr key={installment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{installment.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{installment.nik}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{installment.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(installment.loanAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(installment.installmentAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{installment.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            installment.status === "Lunas"
                              ? "bg-teal-100 text-teal-700 hover:bg-teal-100"
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          }
                        >
                          {installment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 p-0 border-gray-300"
                            onClick={() => handleEditClick(installment)}
                          >
                            <Pencil className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 p-0 border-gray-300"
                            onClick={() => handleDeleteClick(installment)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentInstallments.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                        Tidak ada data cicilan yang ditemukan
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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1 || totalItems === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Halaman {totalItems > 0 ? currentPage : 0} dari {totalPages}
                  </span>
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
          </div>
        </main>
      </div>
    </div>
  )
}
