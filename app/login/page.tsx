"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Mock user data for simulation
const MOCK_USER = {
  email: "user@example.com",
  password: "password123",
  name: "Maemunah",
  role: "Pengguna",
  loanAmount: 2000000,
  savingsAmount: 400000,
}

// Mock admin data for simulation
const MOCK_ADMIN = {
  email: "admin@example.com",
  password: "admin123",
  name: "Saepul",
  role: "Admin",
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberPassword, setRememberPassword] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    rememberPassword: "",
  })
  const [authError, setAuthError] = useState("")

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    // Reset errors
    const newErrors = {
      email: "",
      password: "",
      rememberPassword: "",
    }
    setAuthError("")

    // Validate fields
    let isValid = true

    if (!email.trim()) {
      newErrors.email = "Email harus diisi"
      isValid = false
    }

    if (!password.trim()) {
      newErrors.password = "Kata sandi harus diisi"
      isValid = false
    }

    if (!rememberPassword) {
      newErrors.rememberPassword = "Anda harus menyetujui untuk mengingat kata sandi"
      isValid = false
    }

    setErrors(newErrors)

    // If form is valid, proceed with login
    if (isValid) {
      // Check if admin login
      if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
        // Store admin data in localStorage for persistence
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: MOCK_ADMIN.name,
            role: MOCK_ADMIN.role,
          }),
        )

        // Redirect to admin dashboard
        router.push("/admin/dashboard")
      }
      // Check if regular user login
      else if (email === MOCK_USER.email && password === MOCK_USER.password) {
        // Store user data in localStorage for persistence
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: MOCK_USER.name,
            role: MOCK_USER.role,
            loanAmount: MOCK_USER.loanAmount,
            savingsAmount: MOCK_USER.savingsAmount,
          }),
        )

        // Redirect to user dashboard
        router.push("/user/dashboard")
      } else {
        setAuthError("Email atau kata sandi tidak valid")
      }
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg-login.png')" }}
    >
      {/* Logo */}
      <Link href="/" className="absolute top-8 left-8">
        <Image src="/logokud.svg" alt="KUD Rukun Tani Logo" width={80} height={80} className="object-contain" />
      </Link>

      {/* Login Form */}
      <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4 relative z-10 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Masuk ke Akun</h1>
          <p className="text-gray-600">Harap masukkan email dan kata sandi Anda untuk lanjut</p>
        </div>

        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{authError}</div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email:</Label>
            <Input
              id="email"
              type="email"
              placeholder="kud_rukuntani@gmail.com"
              className={`w-full p-3 rounded-lg bg-gray-50 ${errors.email ? "border-red-500" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              className={`w-full p-3 rounded-lg bg-gray-50 ${errors.password ? "border-red-500" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-start space-x-2">
            <div className="flex items-center h-2 mt-1">
              <Checkbox
                id="remember"
                checked={rememberPassword}
                onCheckedChange={(checked) => setRememberPassword(checked === true)}
              />
            </div>
            <div className="flex flex-col">
              <Label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ingat Kata Sandi
              </Label>
              {errors.rememberPassword && <p className="text-red-500 text-sm mt-1">{errors.rememberPassword}</p>}
            </div>
          </div>

          {/* Tombol Kembali dan Masuk di Sebelah Kiri-Kanan */}
          <div className="flex justify-between space-x-4">
            <Link href="/">
              <Button
                type="button"
                className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
              </Button>
            </Link>

            <Button type="submit" className="w-full bg-[#2B7A39] hover:bg-[#236A2F] text-white py-3">
              Masuk
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Belum punya akun?{" "}
            <Link href="https://wa.link/55l5pe" className="text-[#2B7A39] hover:underline font-medium">
              Ajukan Pendaftaran
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

