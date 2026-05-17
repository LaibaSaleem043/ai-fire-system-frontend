"use client";

// Design intent: High-security authentication terminal with monochromatic UI and technical crosshair motifs.
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, Mail, Lock, ArrowRight, Loader2, Crosshair, Terminal } from "lucide-react";
import { apiService } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { fadeInUp, fadeIn, scanline } from "@/lib/variants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAppStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const data = await apiService.login({ username: email, password });
      localStorage.setItem("token", data.access_token);
      setUser({ 
        user_id: 0, 
        name: "Admin", 
        email: email, 
        role: data.role 
      });
      router.push("/");
    } catch (err: any) {
      setError("AUTHENTICATION_FAILED: INVALID_CREDENTIALS");
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
          <div className="inline-flex relative mb-6">
            <div className="p-4 border border-brand-red/30 bg-brand-red/5">
              <ShieldAlert className="w-8 h-8 text-brand-red" />
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-white/5 rounded-full pointer-events-none"
            />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
            Fire<span className="text-brand-red">Watch</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
            <Terminal className="w-3 h-3" />
            Terminal Access Required
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="tech-panel relative">
          <div className="scanline" />
          <div className="tech-panel-header">
             <span className="tech-label">Authentication Portal</span>
             <div className="flex gap-1">
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-white/20" />
                <div className="w-1 h-1 bg-brand-red" />
             </div>
          </div>

          <div className="p-10 space-y-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="tech-label">Operator Identity</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="IDENTIFIER@FIRE.COM"
                    className="tech-input pl-12 uppercase"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="tech-label">Access Key</label>
                  <Link href="/forgot-password" size="sm" className="text-[10px] text-brand-red hover:text-white font-mono uppercase tracking-widest">
                    Recovery
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="tech-input pl-12"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-mono font-bold text-brand-red text-center bg-brand-red/10 py-2 border border-brand-red/20"
                >
                  ERROR: {error}
                </motion.p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full tech-button-primary py-4 group overflow-hidden relative"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    Initiate Sequence
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Unregistered?</span>
              <Link href="/signup" className="text-[10px] font-mono text-white hover:text-brand-red transition-colors uppercase font-bold tracking-widest">
                Request Protocol
              </Link>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={fadeIn} className="mt-12 text-center">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">
            Security Tier 4 • Build 040526
          </p>
        </motion.div>
      </motion.div>

      {/* Decorative Crosshairs */}
      <div className="absolute top-10 left-10 w-20 h-20 border-l border-t border-white/5 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-r border-b border-white/5 pointer-events-none" />
    </div>
  );
}
