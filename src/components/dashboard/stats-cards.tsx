import { motion } from "framer-motion";
import { ShieldAlert, Clock, CheckCircle2, Activity, Zap } from "lucide-react";
import { AnalyticsSummary } from "@/types";
import { fadeInUp, staggerContainer } from "@/lib/variants";

interface StatsCardsProps {
  summary: AnalyticsSummary | null;
}

export function StatsCards({ summary }: StatsCardsProps) {
  const cards = [
    {
      label: "Critical Signals",
      value: summary?.total_detections ?? 0,
      icon: ShieldAlert,
      color: "text-brand-red",
      borderColor: "border-brand-red/30",
      trend: "+12.4%",
    },
    {
      label: "Pending Analysis",
      value: summary?.pending_review ?? 0,
      icon: Clock,
      color: "text-brand-orange",
      borderColor: "border-brand-orange/30",
      trend: "-2.1%",
    },
    {
      label: "Model Precision",
      value: `${((summary?.accuracy_rate ?? 0) * 100).toFixed(1)}%`,
      icon: CheckCircle2,
      color: "text-white",
      borderColor: "border-white/20",
      trend: "OPTIMAL",
    },
    {
      label: "Uplink Status",
      value: "ACTIVE",
      icon: Activity,
      color: "text-white",
      borderColor: "border-white/20",
      trend: "STABLE",
    },
  ];

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card) => (
        <motion.div 
          key={card.label} 
          variants={fadeInUp}
          className={`tech-panel group hover:border-ui-accent/40 transition-colors duration-500`}
        >
          <div className="scanline" />
          
          {/* Header */}
          <div className="tech-panel-header">
             <span className="tech-label">{card.label}</span>
             <card.icon className={`w-3 h-3 ${card.color}`} />
          </div>

          <div className="p-6">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">
                  {card.value}
                </h3>
                <div className="flex items-center gap-2">
                  <Zap className={`w-3 h-3 ${card.color} opacity-50`} />
                  <span className={`text-[10px] font-mono font-bold ${card.color}`}>
                    {card.trend}
                  </span>
                  <span className="text-[10px] font-mono text-white/20">/ SYSTEM_VAR</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
             <div className={`absolute top-0 right-0 w-[1px] h-2 bg-white/20`} />
             <div className={`absolute top-0 right-0 w-2 h-[1px] bg-white/20`} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
