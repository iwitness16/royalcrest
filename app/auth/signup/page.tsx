"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Eye, EyeOff, ChevronRight, ChevronLeft, CheckCircle,
  Mail, Lock, Phone, Globe, User, ShieldCheck, Sparkles, AlertCircle,
} from "lucide-react"
import Logo from "@/components/logo"
import { supabase } from "@/lib/supabase/client"
import { COUNTRIES, PHONE_CODES } from "@/lib/countries"

export default function SignupPage() {
  const router = useRouter()

  const [step, setStep]     = useState(1)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")

  const [form, setForm] = useState({
    email: "", country: "United States", phone: "",
    password: "", firstName: "", lastName: "", confirmPassword: "",
  })

  const set = (k: keyof typeof form, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: "" }))
    setServerError("")
  }

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!form.email.includes("@")) e.email = "Please enter a valid email address."
    if (!form.country) e.country = "Please select your country."
    if (!form.phone) e.phone = "Phone number is required."
    if (form.password.length < 6) e.password = "Password must be at least 6 characters."
    setErrors(e); return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = "First name is required."
    if (!form.lastName.trim())  e.lastName  = "Last name is required."
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match."
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleNext = () => { if (validateStep1()) setStep(2) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return
    setLoading(true)
    setServerError("")

    const phoneCode = PHONE_CODES[form.country] || ""
    const fullPhone = `${phoneCode} ${form.phone}`.trim()

    // Call Supabase Auth signUp â€” this creates the auth.users row,
    // which fires the database trigger that auto-creates the profile row.
    const { data, error } = await supabase.auth.signUp({
      email:    form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name:  form.lastName,
          phone:      fullPhone,
          country:    form.country,
        },
        // Skip email confirmation â€” user goes straight to congrats
        emailRedirectTo: undefined,
      },
    })

    if (error) {
      setServerError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Auto-confirm the email via our server-side API route
      // so users can log in immediately without clicking a confirmation link
      await fetch("/api/confirm-user", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId: data.user.id }),
      })

      // Update the profile with phone + country (trigger only sets name/email)
      await supabase.from("profiles").update({
        phone:      fullPhone,
        country:    form.country,
        updated_at: new Date().toISOString(),
      }).eq("id", data.user.id)
    }

    router.push("/auth/congrats")
    setLoading(false)
  }

  const phoneCode = PHONE_CODES[form.country] || "+1"
  const pwStrength =
    form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password)
      ? "strong"
      : form.password.length >= 6 ? "medium"
      : form.password.length > 0  ? "weak"
      : ""

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#edf0f7]/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#f0f7f0]/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up">

          <div className="text-center mb-8">
            <div className="mb-5">
              <Logo size="lg" href="/" />
            </div>
            <h1 className="text-2xl font-bold text-[#1b2a4a] tracking-tight">Create your account</h1>
            <p className="text-[#64748b] text-sm mt-1.5">Join RoyalCrest Bank â€” it&apos;s free</p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-2">
            {[1, 2].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= s ? "bg-gradient-to-r from-[#1b2a4a] to-[#2d4a7a]" : "bg-[#e2e8f0]"}`} />
            ))}
          </div>
          <p className="text-xs text-[#94a3b8] text-center mb-5 font-medium">Step {step} of 2</p>

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-7 shadow-sm">

            {/* Server error */}
            {serverError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm text-red-600 animate-scale-in">
                <AlertCircle size={15} className="shrink-0" /> {serverError}
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none transition-all placeholder:text-[#c4d4e0] ${errors.email ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#2d4a7a] focus:ring-2 focus:ring-[#2d4a7a]/20"}`}
                      placeholder="you@example.com" autoComplete="email" />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Country <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <select value={form.country} onChange={e => set("country", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-sm text-[#1b2a4a] outline-none focus:border-[#2d4a7a] focus:ring-2 focus:ring-[#2d4a7a]/20 transition-all bg-white appearance-none">
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm text-[#475569] font-bold min-w-[68px] justify-center">
                      {phoneCode}
                    </div>
                    <div className="relative flex-1">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                      <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none transition-all placeholder:text-[#c4d4e0] ${errors.phone ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#2d4a7a] focus:ring-2 focus:ring-[#2d4a7a]/20"}`}
                        placeholder="Phone number" autoComplete="tel" />
                    </div>
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input type={showPw ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)}
                      className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm outline-none transition-all placeholder:text-[#c4d4e0] ${errors.password ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#2d4a7a] focus:ring-2 focus:ring-[#2d4a7a]/20"}`}
                      placeholder="Create a strong password" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#2d4a7a] transition-colors">
                      {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {pwStrength && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex gap-1 flex-1">
                        {["weak","medium","strong"].map((s, i) => (
                          <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            (pwStrength === "weak"   && i === 0) ? "bg-red-400" :
                            (pwStrength === "medium" && i <= 1)  ? "bg-amber-400" :
                            (pwStrength === "strong")             ? "bg-[#2d4a7a]" : "bg-[#e2e8f0]"
                          }`} />
                        ))}
                      </div>
                      <span className={`text-[10px] font-semibold capitalize ${pwStrength === "strong" ? "text-[#2d4a7a]" : pwStrength === "medium" ? "text-amber-500" : "text-red-500"}`}>{pwStrength}</span>
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <button onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1b2a4a] to-[#243354] hover:from-[#243354] hover:to-[#2d4a7a] text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm hover:shadow-lg btn-press">
                  Next Step <ChevronRight size={16} />
                </button>

                <p className="text-center text-sm text-[#475569]">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-[#2d4a7a] font-bold hover:underline">Sign in</Link>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#1b2a4a] mb-1 transition-colors font-medium">
                  <ChevronLeft size={16} /> Back
                </button>

                <div className="grid grid-cols-2 gap-3">
                  {[["First Name","firstName","First name"],["Last Name","lastName","Last name"]].map(([label, key, ph]) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-[#334155] mb-1.5">{label} <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                        <input value={form[key as keyof typeof form]} onChange={e => set(key as keyof typeof form, e.target.value)}
                          className={`w-full pl-9 pr-3 py-3 border rounded-xl text-sm outline-none transition-all placeholder:text-[#c4d4e0] ${errors[key] ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#2d4a7a] focus:ring-2 focus:ring-[#2d4a7a]/20"}`}
                          placeholder={ph} autoComplete={key === "firstName" ? "given-name" : "family-name"} />
                      </div>
                      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Email <span className="text-xs font-normal text-[#94a3b8]">(read-only)</span></label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input value={form.email} readOnly className="w-full pl-9 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-sm text-[#94a3b8] bg-[#f8fafc]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
                      className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm outline-none transition-all placeholder:text-[#c4d4e0] ${errors.confirmPassword ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#2d4a7a] focus:ring-2 focus:ring-[#2d4a7a]/20"}`}
                      placeholder="Confirm your password" autoComplete="new-password" />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="bg-gradient-to-r from-[#edf0f7] to-[#f0f7f0] border border-[#2d4a7a]/20 rounded-xl p-3.5 flex gap-2.5">
                  <Sparkles size={15} className="text-[#2d4a7a] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#1b2a4a] leading-relaxed">
                    By creating an account you agree to our <span className="text-[#2d4a7a] font-semibold">Terms of Service</span> and <span className="text-[#2d4a7a] font-semibold">Privacy Policy</span>. You&apos;ll receive a <strong>$10 welcome bonus</strong>!
                  </p>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1b2a4a] to-[#243354] hover:from-[#243354] hover:to-[#2d4a7a] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm hover:shadow-lg btn-press">
                  {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={16} />}
                  {loading ? "Creating your account..." : "Create Account"}
                </button>
              </form>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mt-5 text-xs text-[#94a3b8]">
            <ShieldCheck size={13} className="text-[#0e9483]" />
            <span>256-bit SSL encrypted Â· FDIC Insured Â· No fees to join</span>
          </div>
        </div>
      </div>
    </div>
  )
}