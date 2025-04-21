"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { LayoutDashboard, FileText, ClipboardList, Wallet, Settings, LogOut, InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Type for user data
type UserData = {
  name: string
  role: string
  loanAmount: number
  savingsAmount: number
  profileImage?: string
}

// Type for loan application
export type LoanApplication = {
  id: string
  nik: string
  nama: string
  jumlahPinjaman: string
  lamaPinjaman: string
  tanggal: string
  status: "Proses" | "Selesai" | "Ditolak"
}

export default function PengajuanPinjaman() {
  const router = useRouter()
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [monthlyInstallment, setMonthlyInstallment] = useState<number | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    jumlahPinjaman: "",
    lamaPinjaman: "",
  })

  // Error state
  const [errors, setErrors] = useState({
    nik: "",
    nama: "",
    jumlahPinjaman: "",
    lamaPinjaman: "",
  })

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserData(user)

      // Pre-fill name if available
      setFormData((prev) => ({
        ...prev,
        nama: user.name,
      }))
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

  const calculateMonthlyInstallment = (amount: string, duration: string) => {
    if (!amount || !duration) {
      setMonthlyInstallment(null)
      return
    }

    // Remove non-numeric characters and convert to number
    const loanAmount = Number(amount.replace(/\D/g, ""))
    const loanDuration = Number(duration)

    if (isNaN(loanAmount) || isNaN(loanDuration) || loanAmount <= 0 || loanDuration <= 0) {
      setMonthlyInstallment(null)
      return
    }

    // Calculate total interest (1.5% per month)
    const monthlyInterestRate = 0.015
    const totalInterest = loanAmount * monthlyInterestRate * loanDuration

    // Calculate total amount to be paid
    const totalAmount = loanAmount + totalInterest

    // Calculate monthly installment
    const monthly = totalAmount / loanDuration

    setMonthlyInstallment(monthly)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // Calculate monthly installment if amount changes
    if (name === "jumlahPinjaman") {
      calculateMonthlyInstallment(value, formData.lamaPinjaman)
    }
  }

  const handleLoanDurationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      lamaPinjaman: value,
    }))

    // Clear error when user selects
    if (errors.lamaPinjaman) {
      setErrors((prev) => ({
        ...prev,
        lamaPinjaman: "",
      }))
    }

    // Calculate monthly installment
    calculateMonthlyInstallment(formData.jumlahPinjaman, value)
  }

  const formatCurrency = (amount: string | number) => {
    if (typeof amount === "string") {
      // Remove non-numeric characters
      const numericValue = amount.replace(/\D/g, "")
      // Format as currency
      return new Intl.NumberFormat("id-ID").format(Number.parseInt(numericValue) || 0)
    } else {
      return new Intl.NumberFormat("id-ID").format(amount)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      nik: "",
      nama: "",
      jumlahPinjaman: "",
      lamaPinjaman: "",
    }

    let isValid = true

    if (!formData.nik.trim()) {
      newErrors.nik = "NIK harus diisi"
      isValid = false
    }

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama lengkap harus diisi"
      isValid = false
    }

    if (!formData.jumlahPinjaman.trim()) {
      newErrors.jumlahPinjaman = "Jumlah pinjaman harus diisi"
      isValid = false
    }

    if (!formData.lamaPinjaman) {
      newErrors.lamaPinjaman = "Lama pinjaman harus dipilih"
      isValid = false
    }

    setErrors(newErrors)

    // If form is valid, proceed with submission
    if (isValid) {
      setIsSubmitting(true)

      // Create new loan application object
      const newApplication: LoanApplication = {
        id: Date.now().toString(),
        nik: formData.nik,
        nama: formData.nama,
        jumlahPinjaman: formData.jumlahPinjaman,
        lamaPinjaman: formData.lamaPinjaman,
        tanggal: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "Proses",
      }

      // Store application in localStorage
      const existingApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]")
      const updatedApplications = [newApplication, ...existingApplications]
      localStorage.setItem("loanApplications", JSON.stringify(updatedApplications))

      // Simulate form submission
      setTimeout(() => {
        toast({
          title: "Pengajuan Berhasil!",
          description: "Pengajuan pinjaman Anda telah berhasil diajukan dan sedang dalam proses review.",
          variant: "default",
        })

        setIsSubmitting(false)

        // Redirect to status page after submission
        setTimeout(() => {
          router.push("/user/status-pinjaman")
        }, 2000)
      }, 1500)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!userData) {
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
                className="flex items-center p-3 rounded-md bg-[#2B7A39] text-white"
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
              <Link
                href="/user/pengaturan"
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
          <h1 className="text-3xl font-bold mb-8">Formulir Pengajuan Pinjaman</h1>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
              <div className="space-y-2">
                <label htmlFor="nik" className="block text-gray-700">
                  NIK
                </label>
                <Input
                  id="nik"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="123456789"
                  className={`w-full p-3 rounded-lg bg-gray-50 ${errors.nik ? "border-red-500" : ""}`}
                />
                {errors.nik && <p className="text-red-500 text-sm mt-1">{errors.nik}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="nama" className="block text-gray-700">
                  Nama Lengkap Anggota
                </label>
                <Input
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Nama Lengkap"
                  className={`w-full p-3 rounded-lg bg-gray-50 ${errors.nama ? "border-red-500" : ""}`}
                />
                {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="jumlahPinjaman" className="block text-gray-700">
                  Jumlah Pinjaman
                </label>
                <Input
                  id="jumlahPinjaman"
                  name="jumlahPinjaman"
                  value={formData.jumlahPinjaman}
                  onChange={handleChange}
                  placeholder="XXX"
                  className={`w-full p-3 rounded-lg bg-gray-50 ${errors.jumlahPinjaman ? "border-red-500" : ""}`}
                />
                {errors.jumlahPinjaman && <p className="text-red-500 text-sm mt-1">{errors.jumlahPinjaman}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="lamaPinjaman" className="block text-gray-700">
                  Lama Pinjaman
                </label>
                <Select onValueChange={handleLoanDurationChange} value={formData.lamaPinjaman}>
                  <SelectTrigger
                    className={`w-full p-3 rounded-lg bg-gray-50 h-12 ${errors.lamaPinjaman ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Bulan</SelectItem>
                    <SelectItem value="6">6 Bulan</SelectItem>
                    <SelectItem value="12">12 Bulan</SelectItem>
                    <SelectItem value="24">24 Bulan</SelectItem>
                    <SelectItem value="36">36 Bulan</SelectItem>
                  </SelectContent>
                </Select>
                {errors.lamaPinjaman && <p className="text-red-500 text-sm mt-1">{errors.lamaPinjaman}</p>}
              </div>

              {/* Monthly Installment Information */}
              {monthlyInstallment !== null && (
                <div className="mt-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <div className="flex items-start">
                      <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <AlertDescription className="text-gray-700">
                        <p className="font-medium">Informasi Cicilan:</p>
                        <p>Dengan bunga 1,5% per bulan, cicilan bulanan Anda adalah:</p>
                        <p className="text-lg font-semibold text-[#2B7A39] mt-1">
                          Rp {formatCurrency(monthlyInstallment)} / bulan
                        </p>
                      </AlertDescription>
                    </div>
                  </Alert>
                </div>
              )}

              <div className="flex justify-center mt-8">
                <Button
                  type="submit"
                  className="bg-[#2B7A39] hover:bg-[#236A2F] text-white py-2.5 px-12 text-lg rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Memproses..." : "Ajukan"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
