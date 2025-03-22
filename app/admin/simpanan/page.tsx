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
} from "lucide-react"
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

// Type for admin data
type AdminData = {
  name: string
  role: string
  profileImage?: string
}

export default function AdminSimpanan() {
  const router = useRouter()
  const { toast } = useToast()
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    nik: "3214876512345678",
    namaAnggota: "Slamet Riyadi",
    jumlahSimpanan: "",
    jenisSimpanan: "Pokok",
  })

  // Error state
  const [errors, setErrors] = useState({
    nik: "",
    namaAnggota: "",
    jumlahSimpanan: "",
    jenisSimpanan: "",
  })

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
  }

  const handleSavingsTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      jenisSimpanan: value,
    }))

    // Clear error when user selects
    if (errors.jenisSimpanan) {
      setErrors((prev) => ({
        ...prev,
        jenisSimpanan: "",
      }))
    }
  }

  const formatCurrency = (amount: string) => {
    // Remove non-numeric characters
    const numericValue = amount.replace(/\D/g, "")

    // Format as currency
    return new Intl.NumberFormat("id-ID").format(Number.parseInt(numericValue) || 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      nik: "",
      namaAnggota: "",
      jumlahSimpanan: "",
      jenisSimpanan: "",
    }

    let isValid = true

    if (!formData.nik.trim()) {
      newErrors.nik = "NIK harus diisi"
      isValid = false
    }

    if (!formData.namaAnggota.trim()) {
      newErrors.namaAnggota = "Nama anggota harus diisi"
      isValid = false
    }

    if (!formData.jumlahSimpanan.trim()) {
      newErrors.jumlahSimpanan = "Jumlah simpanan harus diisi"
      isValid = false
    }

    if (!formData.jenisSimpanan) {
      newErrors.jenisSimpanan = "Jenis simpanan harus dipilih"
      isValid = false
    }

    setErrors(newErrors)

    // If form is valid, proceed with submission
    if (isValid) {
      setIsSubmitting(true)

      // Simulate form submission
      setTimeout(() => {
        toast({
          title: "Simpanan Berhasil Ditambahkan!",
          description: "Data simpanan telah berhasil disimpan.",
          variant: "default",
        })

        setIsSubmitting(false)

        // Reset form after submission
        setFormData({
          nik: "",
          namaAnggota: "",
          jumlahSimpanan: "",
          jenisSimpanan: "Pokok",
        })
      }, 1500)
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
              <Link href="/admin/simpanan" className="flex items-center p-3 rounded-md bg-[#2B7A39] text-white">
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
          <h1 className="text-3xl font-bold mb-8">Formulir Simpanan</h1>

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
                  placeholder="Masukkan NIK"
                  className={`w-full p-3 rounded-lg bg-gray-50 ${errors.nik ? "border-red-500" : ""}`}
                />
                {errors.nik && <p className="text-red-500 text-sm mt-1">{errors.nik}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="namaAnggota" className="block text-gray-700">
                  Nama Anggota
                </label>
                <Input
                  id="namaAnggota"
                  name="namaAnggota"
                  value={formData.namaAnggota}
                  onChange={handleChange}
                  placeholder="Masukkan nama anggota"
                  className={`w-full p-3 rounded-lg bg-gray-50 ${errors.namaAnggota ? "border-red-500" : ""}`}
                />
                {errors.namaAnggota && <p className="text-red-500 text-sm mt-1">{errors.namaAnggota}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="jumlahSimpanan" className="block text-gray-700">
                  Jumlah Simpanan
                </label>
                <Input
                  id="jumlahSimpanan"
                  name="jumlahSimpanan"
                  value={formData.jumlahSimpanan}
                  onChange={handleChange}
                  placeholder="Rp. XXX"
                  className={`w-full p-3 rounded-lg bg-gray-50 ${errors.jumlahSimpanan ? "border-red-500" : ""}`}
                />
                {errors.jumlahSimpanan && <p className="text-red-500 text-sm mt-1">{errors.jumlahSimpanan}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="jenisSimpanan" className="block text-gray-700">
                  Jenis Simpanan
                </label>
                <Select onValueChange={handleSavingsTypeChange} value={formData.jenisSimpanan}>
                  <SelectTrigger
                    className={`w-full p-3 rounded-lg bg-gray-50 h-12 ${errors.jenisSimpanan ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Pilih jenis simpanan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pokok">Pokok</SelectItem>
                    <SelectItem value="Wajib">Wajib</SelectItem>
                    <SelectItem value="Sukarela">Sukarela</SelectItem>
                  </SelectContent>
                </Select>
                {errors.jenisSimpanan && <p className="text-red-500 text-sm mt-1">{errors.jenisSimpanan}</p>}
              </div>

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

          {/* Pagination */}
          <div className="flex items-center justify-between">
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
        </main>
      </div>
    </div>
  )
}

