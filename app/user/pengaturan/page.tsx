"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { LayoutDashboard, FileText, ClipboardList, Wallet, Settings, LogOut } from "lucide-react"
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

// Extended user data type for profile
type UserProfile = {
  name: string
  role: string
  nik: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  profileImage: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    role: "",
    nik: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    profileImage: "/placeholder.svg?height=100&width=100",
  })

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      const user = JSON.parse(storedUser)

      // In a real app, you would fetch the full profile from an API
      // For this demo, we'll create mock data based on the stored user
      const mockProfile: UserProfile = {
        name: user.name || "Maemunah",
        role: user.role || "Pengguna",
        nik: "3233032299001234",
        email: "maemunah@yahoo.com",
        phone: "0812-3456-1234",
        dateOfBirth: "11-08-1995",
        gender: "Perempuan",
        profileImage: "/placeholder.svg?height=100&width=100",
      }

      setUserData(mockProfile)
      setFormData(mockProfile)
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
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }))
  }

  const handleEditClick = () => {
    if (isEditing) {
      // Save changes
      const updatedUser: UserProfile = {
        ...(userData as UserProfile),
        name: formData.name,
        nik: formData.nik,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        profileImage: formData.profileImage,
        role: formData.role, // Ensure role is included and typed correctly
      }

      // Update local storage
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: updatedUser.name,
          role: updatedUser.role,
          loanAmount: 2000000, // Preserve existing data
          savingsAmount: 400000, // Preserve existing data
        }),
      )

      setUserData(updatedUser)

      toast({
        title: "Profil Berhasil Diperbarui",
        description: "Informasi profil Anda telah berhasil diperbarui.",
        variant: "default",
      })
    }

    setIsEditing(!isEditing)
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For this demo, we'll create a local URL
      const imageUrl = URL.createObjectURL(file)

      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }))

      toast({
        title: "Foto Profil Diperbarui",
        description: "Foto profil Anda telah berhasil diperbarui.",
        variant: "default",
      })
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
              <Link
                href="/user/daftar-simpanan"
                className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Wallet className="mr-3" size={20} />
                <span>Daftar Simpanan</span>
              </Link>
            </li>
            <li>
              <Link href="/user/pengaturan" className="flex items-center p-3 rounded-md bg-[#2B7A39] text-white">
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
        {/* Header */}
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
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Profil Anda</h1>

            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <Image
                  src={formData.profileImage || "/placeholder.svg"}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <button onClick={handlePhotoClick} className="text-blue-500 mt-2 text-sm hover:underline">
                Edit Photo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-gray-600 text-sm">
                  Nama Lengkap
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-lg bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nik" className="block text-gray-600 text-sm">
                  NIK
                </label>
                <Input
                  id="nik"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-lg bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-600 text-sm">
                  Alamat Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-lg bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-gray-600 text-sm">
                  Nomor Telepon
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-lg bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="block text-gray-600 text-sm">
                  Tanggal Lahir
                </label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-lg bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gender" className="block text-gray-600 text-sm">
                  Jenis Kelamin
                </label>
                {isEditing ? (
                  <Select onValueChange={handleGenderChange} value={formData.gender}>
                    <SelectTrigger className="w-full p-3 rounded-lg bg-gray-50 h-12">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={formData.gender} disabled className="w-full p-3 rounded-lg bg-gray-50" />
                )}
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <Button
                onClick={handleEditClick}
                className="px-12 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isEditing ? "Simpan" : "Edit"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

