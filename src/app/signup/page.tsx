"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Terminal, Key, ShieldCheck, Edit2 } from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/variants";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("All fields are required");
    }
    setLoading(true);
    try {
      await apiService.requestRegister(formData.email);
      toast.success("TRANSMISSION SUCCESSFUL", { 
        description: `Verification security token dispatched to ${formData.email.toUpperCase()}` 
      });
      setOtpSent(true);
    } catch (error: any) {
      console.error("OTP send error:", error);
      const detail = error.response?.data?.detail;
      const message = Array.isArray(detail) ? detail[0]?.msg : detail;
      toast.error("TRANSMISSION FAILED", { 
        description: message || "Could not dispatch verification key. Verify your email is correct." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error("Verification code is required");
    
    setLoading(true);
    try {
      await apiService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp_code: otp
      });
      toast.success("REGISTRATION SUCCESSFUL", { 
        description: "Identity verified. Security credentials established." 
      });
      setTimeout(() => window.location.href = "/login", 2000);
    } catch (error: any) {
      console.error("Signup error:", error);
      const detail = error.response?.data?.detail;
      const message = Array.isArray(detail) ? detail[0]?.msg : detail;
      toast.error("VERIFICATION FAILED", { 
        description: message || "Security token is invalid or has expired." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-ui-bg p-6 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div 
        initial="initial"
        animate="animate"
        className="w-full max-w-md relative z-10"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Terminal className="w-3 h-3 text-brand-red" />
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Module // Operator_Reg</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2 italic">
            Access <span className="text-brand-red">Request</span>
          </h1>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
            Direct Identity Enrollment Protocol
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="tech-panel relative">
          <div className="scanline" />
          <div className="tech-panel-header">
             <span className="tech-label">
               {otpSent ? "Identity Verification" : "Registration Portal"}
             </span>
             <div className="flex gap-1">
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-brand-red" />
             </div>
          </div>

          <div className="p-10 space-y-8">
            {!otpSent ? (
              // Step 1: Initial Details Form
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <label className="tech-label">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-red transition-colors" />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="tech-input pl-12"
                      placeholder="OPERATOR NAME"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="tech-label">Operational Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-red transition-colors" />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="tech-input pl-12"
                      placeholder="OPERATOR@FIREGUARD.AI"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="tech-label">Set Access Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-red transition-colors" />
                    <input 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="tech-input pl-12"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full tech-button-primary py-4 mt-6 group overflow-hidden relative"
                >
                  {loading ? (
                     <span className="flex items-center justify-center gap-2 animate-pulse">
                       <Terminal className="w-4 h-4" />
                       DISPATCHING KEY...
                     </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      REQUEST ENROLLMENT OTP
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>
            ) : (
              // Step 2: OTP Entry Form
              <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                <div className="text-center space-y-2 border border-white/5 bg-white/[0.01] p-4 font-mono">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Target Verification Target</p>
                  <p className="text-[12px] text-brand-red font-bold uppercase select-all">{formData.email}</p>
                  <button 
                    type="button" 
                    onClick={() => setOtpSent(false)} 
                    className="text-[9px] text-white/30 hover:text-white flex items-center justify-center gap-1 mx-auto mt-2 transition-colors"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                    EDIT ACCOUNT DETAILS
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="tech-label">Security Transmission Code (6-Digit OTP)</label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-red transition-colors" />
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="tech-input pl-12 text-center text-lg tracking-[0.4em] font-mono text-brand-red"
                      placeholder="000000"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full tech-button-primary py-4 mt-4 group overflow-hidden relative"
                >
                  {loading ? (
                     <span className="flex items-center justify-center gap-2 animate-pulse">
                       <Terminal className="w-4 h-4" />
                       VERIFYING ACCESS...
                     </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      VERIFY & ACTIVATE IDENTITY
                      <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </span>
                  )}
                </button>
              </form>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Authorized?</span>
              <Link href="/login" className="text-[10px] font-mono text-white hover:text-brand-red transition-colors uppercase font-bold tracking-widest">
                Return to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
