"use client";

// Design intent: High-precision data visualization with minimal aesthetic and technical axis formatting.
import { useEffect, useState } from "react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { AnalyticsTrend } from "@/types";

interface TrendChartProps {
  data: AnalyticsTrend[];
}

export function TrendChart({ data }: TrendChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1 h-3 bg-brand-red" />
             <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Signal History</span>
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Temporal Trends</h3>
        </div>
        <div className="flex gap-px bg-white/5 border border-white/10 p-0.5">
          {["24h", "7d", "30d"].map((period) => (
            <button 
              key={period}
              className={`px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest transition-all
                ${period === "24h" ? "bg-white text-black" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF3B30" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="#FF3B30" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="4 4" 
                stroke="rgba(255,255,255,0.05)" 
                vertical={true} 
                horizontal={true} 
              />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.2)" 
                fontSize={9} 
                fontFamily="var(--font-mono)"
                tickLine={true} 
                axisLine={false} 
                tickFormatter={(str) => {
                  try {
                    const date = new Date(str);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
                  } catch (e) {
                    return str;
                  }
                }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.2)" 
                fontSize={9} 
                fontFamily="var(--font-mono)"
                tickLine={true} 
                axisLine={false}
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip 
                cursor={{ stroke: '#FF3B30', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ 
                  backgroundColor: "#080809", 
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "0px",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase"
                }}
                itemStyle={{ color: "#FF3B30", fontWeight: "bold" }}
              />
              <Area 
                type="stepAfter" 
                dataKey="count" 
                stroke="#FF3B30" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCount)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
         <span className="text-[9px] font-mono text-white/20 uppercase">Authored by tactical.ai</span>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
               <div className="w-2 h-2 border border-brand-red bg-brand-red/20" />
               <span className="text-[9px] font-mono text-white/40 uppercase">Detections</span>
            </div>
         </div>
      </div>
    </div>
  );
}
