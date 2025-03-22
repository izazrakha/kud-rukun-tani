"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form field states
  const [fullName, setFullName] = useState("")
  const [nik, setNik] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [terms, setTerms] = useState(false)

  // Error states
  const [errors, setErrors] = useState({
    fullName: "",
    nik: "",
    email: "",
    password: "",
    terms: "",
  })

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    const newErrors = {
      fullName: "",
      nik: "",
      email: "",
      password: "",
      terms: "",
    }

    // Validate fields
    let isValid = true

    if (!fullName.trim()) {
      newErrors.fullName = "Nama lengkap harus diisi"
      isValid = false
    }

    if (!nik.trim()) {
      newErrors.nik = "NIK harus diisi"
      isValid = false
    }

    if (!email.trim()) {
      newErrors.email = "Email harus diisi"
      isValid = false
    }

    if (!password.trim()) {
      newErrors.password = "Kata sandi harus diisi"
      isValid = false
    } else if (password.length < 8) {
      newErrors.password = "Kata sandi minimal 8 karakter"
      isValid = false
    }

    if (!terms) {
      newErrors.terms = "Anda harus menyetujui syarat dan ketentuan"
      isValid = false
    }

    setErrors(newErrors)

    // If form is valid, proceed with registration
    if (isValid) {
      // Simulate registration process
      setIsSubmitting(true)

      // In a real application, you would validate the form and submit data to your API here
      // For now, we'll just simulate a delay and show success message
      setTimeout(() => {
        // Show success toast
        toast({
          title: "Pendaftaran Berhasil!",
          description: "Akun Anda telah berhasil dibuat",
          variant: "default",
          duration: 3000,
          action: (
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          ),
        })

        console.log("Toast berhasil dipanggil!")

        // Redirect to login page after short delay to allow toast to be seen
        setTimeout(() => {
          router.push("/admin/anggota")
        }, 2000)
      }, 1000)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg-login.png')" }}
    >
      {/* Logo */}
      <Link href="/admin/anggota" className="absolute top-8 left-8">
        <Image src="/logokud.svg" alt="KUD Rukun Tani Logo" width={80} height={80} className="object-contain" />
      </Link>

      {/* Registration Form */}
      <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4 relative z-10 shadow-xl">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Daftar Akun</h1>
          <p className="text-gray-600">Lengkapi data berikut untuk membuat akun baru</p>
        </div>

        <form className="space-y-3" onSubmit={handleRegister}>
          <div className="space-y-1">
            <Label htmlFor="fullName">Nama Lengkap:</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Masukkan nama lengkap"
              className={`w-full p-2.5 rounded-lg bg-gray-50 ${errors.fullName ? "border-red-500" : ""}`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="nik">NIK:</Label>
            <Input
              id="nik"
              type="text"
              placeholder="Masukkan Nomor Induk Kependudukan"
              className={`w-full p-2.5 rounded-lg bg-gray-50 ${errors.nik ? "border-red-500" : ""}`}
              value={nik}
              onChange={(e) => setNik(e.target.value)}
            />
            {errors.nik && <p className="text-red-500 text-sm mt-1">{errors.nik}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Alamat Email:</Label>
            <Input
              id="email"
              type="email"
              placeholder="contoh@email.com"
              className={`w-full p-2.5 rounded-lg bg-gray-50 ${errors.email ? "border-red-500" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Kata Sandi:</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 8 karakter"
              className={`w-full p-2.5 rounded-lg bg-gray-50 ${errors.password ? "border-red-500" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-start space-x-2 mt-2">
            <div className="flex items-center h-2 mt-1">
              <Checkbox id="terms" checked={terms} onCheckedChange={(checked) => setTerms(checked === true)} />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="terms" className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Saya menyetujui{" "}
                <Link href="/terms" className="text-[#2B7A39] hover:underline font-medium">
                  Syarat dan Ketentuan
                </Link>{" "}
                yang berlaku
              </Label>
              {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
            </div>
          </div>

          {/* Tombol Kembali dan Daftar di Sebelah Kiri-Kanan */}
          <div className="flex justify-between space-x-4 mt-4">
            <Link href="/admin/anggota">
              <Button
                type="button"
                className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2.5 flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
              </Button>
            </Link>

            <Button
              type="submit"
              className="w-full bg-[#2B7A39] hover:bg-[#236A2F] text-white py-2.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mendaftar..." : "Daftar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

