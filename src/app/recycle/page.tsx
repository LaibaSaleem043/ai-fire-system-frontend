"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { Detection } from "@/types";
import { 
  RotateCcw, 
  Trash2, 
  AlertCircle,
  Clock
} from "lucide-react";

export default function RecycleBinPage() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeleted = async () => {
    try {
      setError(null);
      const data = await apiService.getDeletedDetections();
      // Handle correct object mapping from {"count": X, "records": [...]}
      const rawRecords = (data as any).records || data || [];
      const records = rawRecords.map((r: any) => ({
        ...r,
        detection_id: r.detection_id || r.original_detection_id
      }));
      setDetections(records);
    } catch (e: any) {
      console.error(e);
      const msg = e.response?.data?.detail || e.message || "Failed to establish connection to the database.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeleted();
  }, []);

  const handleRestore = async (id: number) => {
    try {
      await apiService.restoreDetection(id);
      fetchDeleted(); // Refresh
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Recycle Bin</h2>
          <p className="text-slate-400">Soft-deleted records (Stored for 30 days)</p>
        </div>
        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-amber-500 text-sm font-medium">
          <Clock className="w-4 h-4" />
          Auto-cleanup active
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl flex gap-4 items-start max-w-4xl animate-in slide-in-from-top duration-300">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1 font-mono">
            <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest">TACTICAL DATABASE LINK SEVERED</h3>
            <p className="text-xs text-slate-300 select-text leading-relaxed mt-1">
              {error}
            </p>
            <div className="pt-2 text-[10px] text-white/30 leading-relaxed uppercase tracking-wide">
              REASON // Standard MongoDB Atlas port 27017 outbound traffic is currently blocked or refused by active ISP network firewall rules.
            </div>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Detection ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Original Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expires In</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {detections.map((d) => {
              const id = d.detection_id || (d as any).original_detection_id;
              return (
                <tr key={id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-slate-300">#FD-{id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 bg-white/5 rounded-md text-slate-400">
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-amber-500/80">28 Days</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleRestore(id)}
                      className="flex items-center gap-2 ml-auto px-3 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg text-xs font-bold hover:bg-green-500/20 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore Record
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {detections.length === 0 && !loading && (
          <div className="py-20 flex flex-col items-center justify-center opacity-30">
            <Trash2 className="w-12 h-12 mb-4" />
            <p>Recycle bin is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
