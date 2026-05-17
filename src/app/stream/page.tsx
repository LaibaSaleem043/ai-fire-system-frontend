"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { 
  Activity, 
  ShieldAlert, 
  Monitor, 
  Settings,
  Maximize2,
  AlertTriangle,
  Crosshair,
  Terminal,
  Zap,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/variants";

export default function StreamPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cameraId, setCameraId] = useState("SCANNING...");
  const [videoSrc, setVideoSrc] = useState("http://127.0.0.1:8001/api/stream/video");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      if (isProduction) {
        setVideoSrc("https://laiba1232-smoke.hf.space/api/stream/video");
      }
    }
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await apiService.getStreamStatus();
        setIsOnline(status.running);
        setCameraId(status.camera_id || "LAPTOP_CAM_01");
      } catch (e) {
        setIsOnline(false);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-8"
    >
      {/* Header Area */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-brand-red" />
            <span className="text-[10px] font-mono text-brand-red uppercase tracking-[0.3em]">Module 04 // Intelligence</span>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            Live <span className="text-brand-red">Terminal</span>
          </h2>
        </div>
        
        <div className="flex gap-4">
          <div className={cn(
            "px-4 py-2 border font-mono text-[10px] uppercase tracking-widest transition-all duration-500",
            isOnline 
              ? "bg-brand-red/10 border-brand-red text-brand-red shadow-[0_0_15px_rgba(255,59,48,0.2)]" 
              : "bg-white/5 border-white/10 text-white/40"
          )}>
            <div className="flex items-center gap-2">
               <div className={cn("w-1.5 h-1.5", isOnline ? "bg-brand-red animate-pulse" : "bg-white/20")} />
               {isOnline ? "SIGNAL ACTIVE" : "SIGNAL LOST"}
            </div>
          </div>
          <button className="p-2 border border-border hover:border-white/40 transition-colors">
            <Settings className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <motion.div variants={fadeInUp} className="lg:col-span-3 space-y-8">
          <div className="tech-panel aspect-video relative group">
            <div className="tech-panel-header">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-red animate-ping" />
                <span className="tech-label">Stream ID: {cameraId}</span>
              </div>
              <Maximize2 className="w-4 h-4 text-white/20" />
            </div>
            
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              {isOnline ? (
                <img 
                  src={videoSrc} 
                  alt="Live Feed"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center space-y-6 max-w-sm px-6">
                  <div className="relative inline-block">
                    <AlertTriangle className="w-12 h-12 text-white/10" />
                    <div className="absolute inset-0 bg-brand-red/5 blur-2xl rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Access Denied // No Signal</h3>
                    <p className="text-[10px] font-mono text-white/30 uppercase mt-2 leading-relaxed">
                      Interface source not found. Ensure RTSP_URL is configured in .env and hardware is initialized.
                    </p>
                  </div>
                  <div className="pt-4">
                     <button className="tech-button">Re-Initialize Hardware</button>
                  </div>
                </div>
              )}
              
              {/* Scanline Overlay */}
              <div className="scanline" />
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-red/40" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-red/40" />
            </div>

            {/* Tactical Overlays */}
            {isOnline && (
              <div className="absolute top-14 left-6 space-y-2 pointer-events-none">
                <div className="px-2 py-1 bg-black/60 border-l-2 border-brand-red backdrop-blur-sm">
                   <span className="text-[9px] font-mono text-white/60 tracking-tighter">LATENCY: 120MS</span>
                </div>
                <div className="px-2 py-1 bg-black/60 border-l-2 border-brand-red backdrop-blur-sm">
                   <span className="text-[9px] font-mono text-white/60 tracking-tighter">BITRATE: 4.2MBPS</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="tech-panel p-6 border-l-2 border-l-brand-red">
               <span className="tech-label mb-1 block">Engine Accuracy</span>
               <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-bold text-white">94.2</span>
                 <span className="text-[10px] font-mono text-white/40">%</span>
               </div>
            </div>
            <div className="tech-panel p-6">
               <span className="tech-label mb-1 block">Frame Buffer</span>
               <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-bold text-white">30</span>
                 <span className="text-[10px] font-mono text-white/40">FPS</span>
               </div>
            </div>
            <div className="tech-panel p-6">
               <span className="tech-label mb-1 block">Processing Load</span>
               <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-bold text-white">18</span>
                 <span className="text-[10px] font-mono text-white/40">%</span>
               </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-8">
          <div className="tech-panel h-full flex flex-col min-h-[500px]">
            <div className="tech-panel-header">
              <span className="tech-label">Telemetry Log</span>
              <Activity className="w-4 h-4 text-brand-red" />
            </div>
            
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                 <Crosshair className="w-12 h-12 text-white/5 animate-pulse" />
                 <div className="absolute inset-0 bg-white/2 blur-2xl" />
              </div>
              <p className="text-[10px] font-mono text-white/20 uppercase leading-relaxed tracking-widest">
                Listening for real-time<br/>fire signatures in<br/>Live Signal...
              </p>
            </div>
            
            <div className="p-6 border-t border-border bg-white/[0.01]">
              <span className="tech-label mb-4 block">AI Profile</span>
              <div className="p-4 border border-border relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-red/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 border border-brand-red/40 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-brand-red" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">YOLOv8-Industrial</p>
                    <p className="text-[9px] font-mono text-white/40 uppercase">Optimized for Terminals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
