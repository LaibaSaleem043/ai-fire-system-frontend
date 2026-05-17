"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Terminal, 
  X, 
  UserCheck, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Loader2, 
  Plus, 
  AlertCircle 
} from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/variants";

interface UserRecord {
  user_id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  // Create User Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Analyst");
  const [formLoading, setFormLoading] = useState(false);

  // Helper to parse JWT
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (error: any) {
      console.error("Failed to fetch operators:", error);
      toast.error("DATA FETCH ERROR", { description: "Failed to download tactical operator profiles." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const payload = parseJwt(token);
    if (!payload || payload.role !== "Admin") {
      setIsAdmin(false);
      toast.error("ACCESS FORBIDDEN", { description: "You are not authorized to view the Operator Console." });
      setTimeout(() => router.push("/"), 2000);
      return;
    }

    setIsAdmin(true);
    fetchUsers();
  }, [router]);

  const handleAddOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error("VALIDATION ERROR", { description: "All parameter fields must be securely filled." });
    }

    setFormLoading(true);
    try {
      await apiService.createUserByAdmin({ name, email, password, role });
      toast.success("PROVISION SUCCESSFUL", { description: `New ${role.toUpperCase()} operator has been provisioned.` });
      
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("Analyst");
      setShowAddModal(false);
      
      // Refresh list
      fetchUsers();
    } catch (error: any) {
      console.error("Failed to provision operator:", error);
      const detail = error.response?.data?.detail;
      const message = Array.isArray(detail) ? detail[0]?.msg : detail;
      toast.error("PROVISION FAILED", { description: message || "Could not provision operator credentials." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteOperator = async (userId: number, userName: string) => {
    if (confirm(`CRITICAL SECURITY ACTION: Are you sure you want to permanently revoke credentials for ${userName.toUpperCase()} (ID: ${userId})? This action is irreversible.`)) {
      try {
        await apiService.deleteUser(userId);
        toast.success("CREDENTIALS REVOKED", { description: `Operator ${userName.toUpperCase()} has been deleted.` });
        fetchUsers();
      } catch (error: any) {
        console.error("Failed to delete user:", error);
        toast.error("REVOCATION ABORTED", { description: error.response?.data?.detail || "Could not delete operator credentials." });
      }
    }
  };

  if (isAdmin === null || loading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center font-mono gap-4">
        <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
        <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase animate-pulse">Establishing Secure Node Link...</span>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center font-mono gap-4 text-center">
        <ShieldAlert className="w-12 h-12 text-brand-red animate-bounce" />
        <h2 className="text-xl font-bold uppercase tracking-widest text-white">Security Override Required</h2>
        <span className="text-[10px] text-brand-red/80 tracking-widest max-w-sm">
          UNAUTHORIZED ROLE PROFILE DETECTED. DIRECT SESSION ACCESS HAS BEEN SUSPENDED. REDIRECTING...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-12 relative z-10">
      {/* Tactical Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono">
            <Terminal className="w-3.5 h-3.5 text-brand-red" />
            <span className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Module // Sec_Ops_Console</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
            Operator <span className="text-brand-red">Console</span>
          </h1>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">
            System Credential Provisioning and Role Allocations
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="tech-button-primary flex items-center justify-center gap-2 py-3 px-6 text-xs"
        >
          <UserPlus className="w-4 h-4" />
          PROVISION NEW OPERATOR
        </button>
      </div>

      {/* Operators List Panel */}
      <div className="tech-panel relative overflow-hidden">
        <div className="scanline" />
        <div className="tech-panel-header">
           <span className="tech-label">Active Surveillance Personnel Directory</span>
           <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">TOTAL: {users.length} NODES</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="border-b border-white/5 text-[9px] text-white/30 uppercase tracking-widest bg-white/[0.01]">
                <th className="py-4 px-6 font-medium">Node ID</th>
                <th className="py-4 px-6 font-medium">Operator Name</th>
                <th className="py-4 px-6 font-medium">Operational Email</th>
                <th className="py-4 px-6 font-medium">Assigned Role</th>
                <th className="py-4 px-6 font-medium text-right">Revocation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white/70">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-white/30 uppercase tracking-widest">
                    No active operator profiles found.
                  </td>
                </tr>
              ) : (
                users.map((operator) => (
                  <tr key={operator.user_id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-6 text-brand-red font-bold">
                      #{String(operator.user_id).padStart(4, '0')}
                    </td>
                    <td className="py-4 px-6 font-sans font-bold text-white uppercase tracking-wide">
                      {operator.name}
                    </td>
                    <td className="py-4 px-6 text-white/50 lowercase select-all">
                      {operator.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border ${
                        operator.role === "Admin"
                          ? "bg-brand-red/10 border-brand-red/40 text-brand-red"
                          : operator.role === "Officer"
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : "bg-blue-500/10 border-blue-500/40 text-blue-400"
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${
                          operator.role === "Admin"
                            ? "bg-brand-red animate-pulse"
                            : operator.role === "Officer"
                            ? "bg-emerald-400"
                            : "bg-blue-400"
                        }`} />
                        {operator.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {operator.email === "admin@fire.com" ? (
                        <span className="text-[8px] text-white/20 uppercase tracking-widest italic pr-3">System Protected</span>
                      ) : (
                        <button 
                          onClick={() => handleDeleteOperator(operator.user_id, operator.name)}
                          className="p-2 border border-white/5 hover:border-brand-red/40 hover:bg-brand-red/10 text-white/30 hover:text-brand-red transition-all rounded-sm group"
                          title="Revoke operator credentials"
                        >
                          <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Operator Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md tech-panel relative"
            >
              <div className="scanline" />
              <div className="tech-panel-header">
                 <span className="tech-label">Provision Operator Credentials</span>
                 <button 
                   onClick={() => setShowAddModal(false)}
                   className="text-white/30 hover:text-white transition-colors"
                 >
                   <X className="w-4 h-4" />
                 </button>
              </div>

              <form onSubmit={handleAddOperator} className="p-8 space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="tech-label">Operator Full Name</label>
                  <div className="relative group">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-red transition-colors" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="tech-input pl-12"
                      placeholder="OPERATOR NAME"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="tech-label">Operational Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-red transition-colors" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="tech-input pl-12 lowercase"
                      placeholder="NAME@FIREGUARD.AI"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="tech-label">Temporary Access Key (Password)</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-red transition-colors" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="tech-input pl-12"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Role Dropdown */}
                <div className="space-y-2">
                  <label className="tech-label">Assigned Clearance Tier (Role)</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="tech-input pl-12 appearance-none uppercase text-xs font-mono font-bold"
                    >
                      <option value="Analyst" className="bg-ui-bg text-white">Analyst (Surveillance Monitoring)</option>
                      <option value="Officer" className="bg-ui-bg text-white">Officer (Alarms Reviewer)</option>
                      <option value="Admin" className="bg-ui-bg text-white">Admin (Full Control Override)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3.5 border border-white/5 hover:border-white/20 text-white/40 hover:text-white text-xs font-mono font-bold uppercase transition-all rounded-sm"
                  >
                    ABORT
                  </button>

                  <button 
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 tech-button-primary py-3.5 text-xs font-bold"
                  >
                    {formLoading ? (
                      <span className="flex items-center justify-center gap-1.5 animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        PROVISIONING...
                      </span>
                    ) : (
                      "COMMENCE PROVISION"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
