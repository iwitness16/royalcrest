"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Copy, CheckCircle, Gift, Share2, Mail, MessageSquare, Users } from "lucide-react"
import { useApp } from "@/lib/store"

const HOW_IT_WORKS = [
  { step: "01", title: "Share your code",  desc: "Share your unique referral code with friends and family.", icon: Share2 },
  { step: "02", title: "They sign up",     desc: "Your friend creates an account using your referral link.", icon: Users },
  { step: "03", title: "You both earn",    desc: "You get $25 bonus. Your friend gets $10 on signup.",       icon: Gift },
]

export default function ReferralPage() {
  const { currentUser, users } = useApp()
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const referralCode = currentUser?.referralCode || "---"
  const referralLink = `https://royalcrestfinancials.com/auth/signup?ref=${referralCode}`
  const totalReferrals = users.filter(u => u.referralCode !== currentUser?.referralCode).length
  const totalEarned = totalReferrals * 25

  const copyCode = () => { navigator.clipboard.writeText(referralCode); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const copyLink = () => { navigator.clipboard.writeText(referralLink); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000) }

  return (
    <div className="max-w-2xl mx-auto pb-4 space-y-5 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#1b2a4a] transition-all"><ChevronLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-bold text-[#1b2a4a] tracking-tight">Referral Program</h1>
          <p className="text-xs text-[#64748b]">Invite friends · Earn rewards</p>
        </div>
      </div>

      {/* Hero banner */}
      <div className="balance-card rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#c9a84c]/20 rounded-lg flex items-center justify-center">
              <Gift size={16} className="text-[#c9a84c]" />
            </div>
            <span className="text-[#c9a84c] text-sm font-bold">Referral Rewards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
            Earn <span className="text-[#c9a84c]">$25</span> per referral
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            For every friend who signs up and completes KYC, you earn $25 and they earn $10.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/10">
            {[["Total Referrals",totalReferrals],["Total Earned",`$${totalEarned}`],["Pending",0]].map(([l,v]) => (
              <div key={l}>
                <p className="text-xl font-bold text-[#c9a84c]">{v}</p>
                <p className="text-xs text-white/50">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referral code */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#1b2a4a] mb-4 tracking-tight">Your Referral Code</h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-[#f4f7fb] border border-[#e2e8f0] rounded-xl px-4 py-3.5">
            <p className="font-mono font-bold text-2xl text-[#1b2a4a] tracking-[0.25em] text-center">{referralCode}</p>
          </div>
          <button onClick={copyCode}
            className={`flex items-center gap-2 font-bold px-5 py-3.5 rounded-xl text-sm transition-all btn-press ${copied ? "bg-[#0e9483] text-white" : "bg-[#1b2a4a] hover:bg-[#243354] text-white"}`}>
            {copied ? <><CheckCircle size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
          </button>
        </div>

        <div className="border-t border-[#f1f5f9] pt-4">
          <p className="text-xs font-semibold text-[#94a3b8] mb-2">Or share your referral link</p>
          <div className="flex items-center gap-2 bg-[#f4f7fb] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5">
            <p className="flex-1 text-xs text-[#64748b] font-mono truncate">{referralLink}</p>
            <button onClick={copyLink} className="shrink-0 text-[#94a3b8] hover:text-[#2d4a7a] transition-colors p-1">
              {linkCopied ? <CheckCircle size={15} className="text-[#0e9483]" /> : <Copy size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Share options */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#1b2a4a] mb-4 tracking-tight">Share via</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Copy Link", icon: Copy, action: copyLink, cls: "bg-[#f4f7fb] text-[#64748b] hover:bg-[#e2e8f0] border border-[#e2e8f0]" },
            { label: "Email", icon: Mail, action: () => window.open(`mailto:?subject=Join RoyalCrest Bank&body=Use my referral code ${referralCode}: ${referralLink}`), cls: "bg-blue-50 text-[#2d4a7a] hover:bg-blue-100 border border-blue-100" },
            { label: "Message", icon: MessageSquare, action: () => window.open(`sms:?body=Join RoyalCrest! Use code ${referralCode}: ${referralLink}`), cls: "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100" },
          ].map(({ label, icon: Icon, action, cls }) => (
            <button key={label} onClick={action} className={`flex flex-col items-center gap-2.5 py-4 rounded-xl text-xs font-bold transition-all ${cls} btn-press`}>
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#1b2a4a] mb-5 tracking-tight">How it works</h3>
        <div className="space-y-4">
          {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-[#1b2a4a] text-white flex items-center justify-center">
                <Icon size={18} />
              </div>
              <div className="pt-1">
                <p className="font-bold text-[#1b2a4a] text-sm">{step}. {title}</p>
                <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#94a3b8] text-center px-4">
        Bonuses credited within 3–5 business days after your friend completes KYC. Max 50 referrals per account.
      </p>
    </div>
  )
}
