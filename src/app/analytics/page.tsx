"use client";

// Design intent: High-precision analytics workstation with technical bar charts and monochromatic pie distributions.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { apiService } from "@/services/api";
import { AnalyticsTrend, AnalyticsSummary } from "@/types";
import { Download, Calendar, Activity, Database, LayoutGrid } from "lucide-react";
import { fadeInUp, staggerContainer, fadeIn } from "@/lib/variants";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [trends, setTrends] = useState<AnalyticsTrend[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      try {
        const [trendData, summaryData] = await Promise.all([
          apiService.getAnalyticsTrends(),
          apiService.getAnalyticsSummary()
        ]);
        setTrends(trendData);
        setSummary(summaryData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const pieData = [
    { name: "Approved", value: summary?.total_detections ? (summary.total_detections - summary.pending_review) * 0.8 : 10, color: "#FFFFFF" },
    { name: "Rejected", value: summary?.total_detections ? (summary.total_detections - summary.pending_review) * 0.2 : 5, color: "#FF3B30" },
    { name: "Pending", value: summary?.pending_review ?? 5, color: "#FF9500" },
  ];

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div variants={fadeInUp}>
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-white/30" />
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Historical Analysis // Archive</span>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            Data <span className="text-white/20">Intelligence</span>
          </h2>
        </motion.div>
        
        <motion.div variants={fadeInUp} className="flex gap-2">
          <button className="tech-button">
            <Calendar className="w-3 h-3 mr-2" />
            30_DAYS_VAR
          </button>
          <button className="tech-button-primary">
            <Download className="w-3 h-3 mr-2" />
            Export_Report
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div variants={fadeInUp} className="lg:col-span-8">
          <div className="tech-panel">
            <div className="tech-panel-header">
              <span className="tech-label">Temporal Signal Distribution</span>
              <Activity className="w-4 h-4 text-white/20" />
            </div>
            <div className="p-8">
              <div className="h-[400px] w-full">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trends} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="rgba(255,255,255,0.2)" 
                        fontSize={9}
                        fontFamily="var(--font-mono)"
                        tickFormatter={(str) => {
                          try {
                            const date = new Date(str);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
                          } catch (e) {
                            return str;
                          }
                        }}
                      />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="var(--font-mono)" />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                        contentStyle={{ 
                          backgroundColor: "#080809", 
                          border: "1px solid rgba(255,255,255,0.1)", 
                          borderRadius: "0px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          textTransform: "uppercase"
                        }}
                      />
                      <Bar dataKey="count" fill="#FF3B30" shape={<RectangleWithTechnicalStyle />} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="lg:col-span-4 flex flex-col">
          <div className="tech-panel flex-1">
             <div className="tech-panel-header">
                <span className="tech-label">Integrity Breakdown</span>
                <LayoutGrid className="w-4 h-4 text-white/20" />
             </div>
            
            <div className="p-8 flex flex-col items-center justify-center h-full">
              <div className="h-64 w-full relative">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#080809", 
                          border: "1px solid rgba(255,255,255,0.1)", 
                          borderRadius: "0px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          textTransform: "uppercase"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="tech-label">Total</span>
                   <span className="text-2xl font-black">{summary?.total_detections ?? 0}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 w-full mt-10">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const RectangleWithTechnicalStyle = (props: any) => {
  const { x, y, width, height, fill } = props;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.8} />
      <rect x={x} y={y} width={width} height={2} fill={fill} />
    </g>
  );
};
