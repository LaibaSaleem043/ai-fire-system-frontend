"use client";

// Design intent: Tactical surveillance dashboard with asymmetrical layout and technical data visualization.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { useAppStore } from "@/store/useAppStore";
import { apiService } from "@/services/api";
import { AnalyticsTrend } from "@/types";
import { ShieldAlert, AlertTriangle, Crosshair, Terminal } from "lucide-react";
import { fadeInUp, staggerContainer, fadeIn } from "@/lib/variants";

export default function DashboardPage() {
  const { summary, fetchSummary, activeJobs } = useAppStore();
  const [trends, setTrends] = useState<AnalyticsTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchSummary();
      try {
        const trendData = await apiService.getAnalyticsTrends();
        setTrends(trendData);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    loadData();
  }, [fetchSummary]);

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-12"
    >
      {/* Header Area */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-brand-red" />
            <span className="text-[10px] font-mono text-brand-red uppercase tracking-[0.3em]">Sector 07 // Monitoring</span>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            System <span className="text-brand-red">Overview</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-6 border-l border-border pl-6">
          <div className="flex flex-col">
            <span className="tech-label">Latency</span>
            <span className="text-sm font-mono text-white">24ms</span>
          </div>
          <div className="flex flex-col">
            <span className="tech-label">Status</span>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-brand-red animate-pulse" />
               <span className="text-sm font-mono text-white">SECURE</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div variants={fadeInUp}>
        <StatsCards summary={summary} />
      </motion.div>

      {/* Main Grid: Asymmetrical 2/3 and 1/3 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <motion.div variants={fadeInUp} className="xl:col-span-8">
          <div className="tech-panel">
            <div className="tech-panel-header">
              <span className="tech-label">Temporal Trends // 24H</span>
              <Crosshair className="w-4 h-4 text-white/20" />
            </div>
            <div className="p-8">
              <TrendChart data={trends} />
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={fadeInUp} className="xl:col-span-4 space-y-8">
          <div className="tech-panel min-h-[400px]">
             <div className="tech-panel-header">
              <span className="tech-label">Live Threat Stream</span>
              <ShieldAlert className="w-4 h-4 text-brand-red" />
            </div>
            
            <div className="p-6 space-y-6">
              {Object.keys(activeJobs).length > 0 ? (
                Object.values(activeJobs).map((job) => (
                  <motion.div 
                    key={job.job_id} 
                    variants={fadeIn}
                    className="p-4 border border-brand-red/20 bg-brand-red/[0.02] relative group"
                  >
                    <div className="absolute top-0 right-0 p-1 opacity-20">
                       <Crosshair className="w-3 h-3 text-brand-red group-hover:animate-spin" />
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono font-bold text-brand-red uppercase tracking-widest">
                        Analysis in Progress
                      </span>
                      <span className="text-[10px] font-mono text-white/40">{job.progress}%</span>
                    </div>
                    <div className="h-0.5 bg-white/5 w-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${job.progress}%` }}
                        className="h-full bg-brand-red" 
                      />
                    </div>
                    <p className="text-[9px] font-mono text-white/40 mt-3 truncate uppercase tracking-tighter">
                      FILE: {job.filename}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                  <div className="relative mb-6">
                    <AlertTriangle className="w-10 h-10 text-white/10" />
                    <motion.div 
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-white/5 blur-xl rounded-full"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] max-w-[200px]">
                    No active threat signals detected in current sector
                  </p>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-white/[0.01]">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-brand-red animate-ping" />
                  <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest">Awaiting Signal</span>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
