"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileVideo, CheckCircle2, AlertCircle, X, Play } from "lucide-react";
import { apiService } from "@/services/api";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { activeJobs, removeJob } = useAppStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.avi', '.mov'] },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      await apiService.uploadVideo(file, (p) => setProgress(p));
      setFile(null);
      setUploading(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Video Intelligence</h2>
        <p className="text-slate-400 text-lg">Upload recordings for automated fire analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            {...getRootProps()} 
            className={cn(
              "glass-card h-80 flex flex-col items-center justify-center border-2 border-dashed cursor-pointer transition-all duration-300",
              isDragActive ? "border-red-500 bg-red-500/5" : "border-white/10 hover:border-white/20",
              file ? "border-green-500/50 bg-green-500/5" : ""
            )}
          >
            <input {...getInputProps()} />
            
            {file ? (
              <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <FileVideo className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <p className="text-white font-bold">{file.name}</p>
                  <p className="text-slate-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  Change File
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-300 font-medium">
                  {isDragActive ? "Drop the video here" : "Drag & drop video or click to browse"}
                </p>
                <p className="text-slate-500 text-sm">Supported formats: MP4, AVI, MOV</p>
              </div>
            )}
          </div>

          <button
            disabled={!file || uploading}
            onClick={handleUpload}
            className={cn(
              "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300",
              !file || uploading 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)]"
            )}
          >
            {uploading ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Uploading {progress}%</span>
              </div>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                Start AI Analysis
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 h-full">
            <h3 className="text-lg font-bold text-white mb-6">Active Jobs</h3>
            
            <div className="space-y-4">
              {Object.keys(activeJobs).length > 0 ? (
                Object.values(activeJobs).map((job) => (
                  <div key={job.job_id} className={cn(
                    "p-4 border rounded-xl space-y-3 transition-all duration-500",
                    job.status === "Complete" ? "bg-green-500/5 border-green-500/20" : "bg-white/5 border-white/10"
                  )}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-300 truncate max-w-[200px]">
                        {job.filename}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                          job.status === "Complete" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
                        )}>
                          {job.status || "Processing"}
                        </span>
                        {job.status === "Complete" && (
                          <button 
                            onClick={() => removeJob(job.job_id)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                          >
                            <X className="w-3 h-3 text-slate-500" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {job.status !== "Complete" ? (
                      <>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 transition-all duration-300" 
                            style={{ width: `${job.progress}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>{job.progress}% Complete</span>
                          <span>{job.detections} Fire(s) Detected</span>
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                        <div className="text-center">
                          <p className="text-[10px] text-slate-500 mb-0.5 uppercase">Detections</p>
                          <p className="text-sm font-bold text-white">{job.detections}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-slate-500 mb-0.5 uppercase">Avg Conf</p>
                          <p className="text-sm font-bold text-green-500">{( (job.average_confidence || 0) * 100).toFixed(1)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-slate-500 mb-0.5 uppercase">Max Conf</p>
                          <p className="text-sm font-bold text-green-400">{( (job.max_confidence || 0) * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
                  <FileVideo className="w-12 h-12 mb-4" />
                  <p className="text-sm">No active processing jobs</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
