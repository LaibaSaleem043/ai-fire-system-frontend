"use client";

// Design intent: High-precision tactical sidebar with mono-spaced labels and technical accents.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  Activity, 
  PieChart, 
  Trash2, 
  ShieldAlert,
  Crosshair,
  Camera,
  CameraOff,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/variants";
import { apiService } from "@/services/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// JWT decoder helper
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

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", code: "01", roles: ["Admin", "Officer", "Analyst"] },
  { icon: FileText, label: "Incident Log", href: "/incidents", code: "02", roles: ["Admin", "Officer", "Analyst"] },
  { icon: Upload, label: "Video Upload", href: "/upload", code: "03", roles: ["Admin", "Officer", "Analyst"] },
  { icon: Activity, label: "Live Stream", href: "/stream", code: "04", roles: ["Admin", "Officer", "Analyst"] },
  { icon: PieChart, label: "Analytics", href: "/analytics", code: "05", roles: ["Admin", "Officer", "Analyst"] },
  { icon: Trash2, label: "Recycle Bin", href: "/recycle", code: "06", roles: ["Admin"] },
  { icon: UserIcon, label: "Operators", href: "/admin-users", code: "07", roles: ["Admin"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [cameraActive, setCameraActive] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Decode user role and email from persistent JWT token
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        setUserRole(payload.role || "Analyst");
        // Extract email prefix or standard username
        const emailStr = payload.sub || payload.email || "OPERATOR";
        setUserEmail(emailStr.split('@')[0]);
      }
    }

    apiService.getStreamStatus().then(status => {
      setCameraActive(status.running);
    }).catch(() => setCameraActive(false));
  }, []);

  const handleToggleCamera = async () => {
    try {
      const res = await apiService.toggleStream();
      setCameraActive(res.running);
    } catch (e) {
      console.error("Camera toggle failed", e);
    }
  };

  const handleLogout = async () => {
    // Stop camera if it's currently active
    if (cameraActive) {
      try {
        await apiService.toggleStream();
      } catch (e) {
        console.error("Failed to stop camera during logout", e);
      }
    }
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="w-64 h-screen bg-ui-bg border-r border-border flex flex-col fixed left-0 top-0 z-50 overflow-hidden"
    >
      {/* Scanline Effect */}
      <div className="scanline" />

      {/* Brand Section */}
      <div className="p-8 border-b border-border relative group">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShieldAlert className="w-6 h-6 text-brand-red" />
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-2 bg-brand-red/10 blur-md rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-[0.3em] uppercase text-white leading-none">
              FireWatch
            </h1>
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-1">
              Tactical Unit AI
            </span>
          </div>
        </div>
      </div>

      {/* Operator Identification Badge */}
      <div className="px-6 py-4 border-b border-border bg-white/[0.01] font-mono">
        <div className="flex items-center gap-3.5">
          <div className="relative p-2 bg-white/[0.02] border border-white/5 rounded-sm">
            <UserIcon className="w-4 h-4 text-white/40" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-black">Operator Staged</span>
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">{userEmail || "STANDBY..."}</span>
            <span className="text-[8px] text-brand-red font-bold uppercase tracking-widest mt-0.5">ROLE // {userRole || "FETCHING..."}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <motion.nav 
        variants={staggerContainer}
        className="flex-1 px-4 py-8 space-y-1 overflow-y-auto"
      >
        {menuItems
          .filter(item => !item.roles || (userRole && item.roles.includes(userRole)))
          .map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.href} variants={fadeInUp}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 border transition-all duration-200 group relative",
                    isActive 
                      ? "bg-white/[0.03] border-brand-red/50 text-brand-red" 
                      : "border-transparent text-white/50 hover:text-white hover:bg-white/[0.02]"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-indicator"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-red" 
                    />
                  )}
                  <span className="text-[9px] font-mono opacity-30 group-hover:opacity-100 transition-opacity">
                    {item.code}
                  </span>
                  <item.icon className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                  {isActive && (
                     <Crosshair className="ml-auto w-3 h-3 animate-spin-[reverse] opacity-50" />
                  )}
                </Link>
              </motion.div>
            );
          })}
      </motion.nav>

      {/* System Status / Camera Toggle */}
      <div className="p-4 border-t border-border bg-white/[0.01]">
        <button 
          onClick={handleToggleCamera}
          className={cn(
            "w-full px-4 py-4 border transition-all duration-300 group",
            cameraActive 
              ? "bg-brand-red/5 border-brand-red/50 text-brand-red" 
              : "bg-white/5 border-white/10 text-white/30 hover:border-white/20"
          )}
        >
          <div className="flex items-center justify-between mb-3">
             <span className="text-[9px] font-mono uppercase tracking-widest">Surveillance Feed</span>
             <div className={cn(
               "w-1.5 h-1.5 rounded-full",
               cameraActive ? "bg-brand-red animate-pulse" : "bg-white/20"
             )} />
          </div>
          
          <div className="flex items-center gap-3">
            {cameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              {cameraActive ? "ENGINE: ACTIVE" : "ENGINE: STANDBY"}
            </span>
          </div>
        </button>

        {/* Terminal Termination (Logout) */}
        <button 
          onClick={handleLogout}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3 border border-transparent text-white/20 hover:text-white hover:bg-white/[0.03] transition-all group"
        >
          <LogOut className="w-3 h-3 opacity-30 group-hover:opacity-100 group-hover:text-brand-red transition-all" />
          <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Terminate Session</span>
        </button>
      </div>
    </motion.div>
  );
}
