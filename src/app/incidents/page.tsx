"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { Detection } from "@/types";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Filter,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function IncidentsPage() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        setIsAdmin(payload.role === "Admin");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchDetections = async () => {
    try {
      const data = await apiService.getDetections();
      setDetections(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetections();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') await apiService.approveDetection(id);
      else await apiService.rejectDetection(id);
      fetchDetections(); // Refresh
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("CRITICAL SURVEILLANCE ACTION: Soft-delete this incident and archive it to the Recycle Bin?")) {
      try {
        await apiService.deleteDetection(id);
        fetchDetections(); // Refresh
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Incident Log</h2>
          <p className="text-slate-400">Manage and verify detected fire incidents</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
          <Filter className="w-4 h-4" />
          Filter Logs
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Preview</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Detection ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Confidence</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {detections.map((d) => (
              <tr key={d.detection_id} className="group hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 border border-white/10 relative">
                    {d.evidence?.image_url && (
                      <img 
                        src={`http://localhost:8001${d.evidence.image_url}`} 
                        alt="Evidence"
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-slate-300">#FD-{d.detection_id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-1 bg-white/5 rounded-md text-slate-400 capitalize">
                    {d.source_type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-800 rounded-full w-12">
                      <div 
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${(d.evidence?.confidence_score ?? 0) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {((d.evidence?.confidence_score ?? 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                    d.status === 'Approved' ? "bg-green-500/10 text-green-500" :
                    d.status === 'Rejected' ? "bg-red-500/10 text-red-500" :
                    "bg-amber-500/10 text-amber-500"
                  )}>
                    {d.status === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> :
                     d.status === 'Rejected' ? <XCircle className="w-3 h-3" /> :
                     <Clock className="w-3 h-3" />}
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {new Date(d.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleAction(d.detection_id, 'approve')}
                          className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleAction(d.detection_id, 'reject')}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(d.detection_id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Incident"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button className="p-2 text-slate-400 hover:bg-white/10 rounded-lg transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {detections.length === 0 && !loading && (
          <div className="py-20 text-center">
            <p className="text-slate-500">No incidents logged yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
