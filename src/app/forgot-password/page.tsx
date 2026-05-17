"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, Terminal, Send, Key, ShieldCheck, Edit2 } from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/variants";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Operational email is required");

    setLoading(true);
    try {
      await apiService.requestPasswordReset(email);
      toast.success("RECOVERY DISPATCHED", { 
        description: `A security override token has been transmitted to ${email.toUpperCase()}` 
      });
      setStep(2);
    } catch (error: any) {
      console.error("Password reset request error:", error);
      const detail = error.response?.data?.detail;
      const message = Array.isArray(detail) ? detail[0]?.msg : detail;
      toast.error("DISPATCH FAILED", { 
        description: message || "Could not authorize recovery. Verify the email exists." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return toast.error("A valid 6-digit security code is required");
    }
    // Transition to step 3 (actual verification is executed at reset)
    toast.success("TOKEN KEY STAGED", { description: "Security code staging successful. Set new access key." });
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return toast.error("New access key is required");

    setLoading(true);
    try {
      await apiService.resetPassword({
        email,
        otp_code: otp,
        new_password: newPassword
      });
      toast.success("CREDENTIAL OVERRIDE SUCCESSFUL", { 
        description: "Your security access key has been updated. You can now login." 
      });
      setTimeout(() => window.location.href = "/login", 2000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      const detail = error.response?.data?.detail;
      const message = Array.isArray(detail) ? detail[0]?.msg : detail;
      toast.error("OVERRIDE FAILED", { 
        description: message || "Invalid or expired security code. Override aborted." 
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
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Module // Auth_Recovery</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2 italic">
            Secure <span className="text-brand-red">Recovery</span>
          </h1>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
            Direct Credential Override Protocol
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="tech-panel relative">
          <div className="scanline" />
          <div className="tech-panel-header">
             <span className="tech-label">
               {step === 1 && "Bypass Authorization"}
               {step === 2 && "Identity Verification"}
               {step === 3 && "Access Key Override"}
             </span>
             <div className="flex gap-1">
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-brand-red" />
             </div>
          </div>

          <div className="p-10 space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                // Step 1: Input Email
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSendOTP} 
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="tech-label">Target Account Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-red transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="tech-input pl-12"
                        placeholder="OPERATOR@FIREGUARD.AI"
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
                         AUTHORIZING DISPATCH...
                       </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        DISPATCH RECOVERY KEY
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </motion.form>
              )}

              {step === 2 && (
                // Step 2: Input OTP
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleVerifyOTP} 
                  className="space-y-6"
                >
                  <div className="text-center space-y-2 border border-white/5 bg-white/[0.01] p-4 font-mono">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Target Recovery Target</p>
                    <p className="text-[12px] text-brand-red font-bold uppercase select-all">{email}</p>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)} 
                      className="text-[9px] text-white/30 hover:text-white flex items-center justify-center gap-1 mx-auto mt-2 transition-colors"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                      EDIT ACCOUNT EMAIL
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
                    className="w-full tech-button-primary py-4 mt-6 group overflow-hidden relative"
                  >
                    <span className="flex items-center justify-center gap-3">
                      VERIFY CODE & CONTINUE
                      <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </span>
                  </button>
                </motion.form>
              )}

              {step === 3 && (
                // Step 3: Input New Password
                <motion.form 
                  key="step3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleResetPassword} 
                  className="space-y-6"
                >
                  <div className="text-center space-y-1 border border-white/5 bg-white/[0.01] p-3 font-mono text-[10px]">
                    <p className="text-white/40 uppercase tracking-widest">Staged Session Parameters</p>
                    <p className="text-white/60">TARGET: <span className="text-white font-bold">{email.toUpperCase()}</span></p>
                    <p className="text-white/60">TOKEN: <span className="text-brand-red font-bold">{otp}</span></p>
                  </div>

                  <div className="space-y-2">
                    <label className="tech-label">New Access Key</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-red transition-colors" />
                      <input 
                        type="password" 
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                         OVERRIDING CREDENTIALS...
                       </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        EXECUTE ACCESS OVERRIDE
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-center pt-6 border-t border-white/5">
              <Link href="/login" className="flex items-center gap-2 text-[10px] font-mono text-white/30 hover:text-white transition-colors uppercase tracking-widest">
                <ArrowLeft className="w-3 h-3" />
                Return to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
