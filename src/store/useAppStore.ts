import { create } from 'zustand';
import { User, Detection, AnalyticsSummary, JobProgress } from '@/types';
import { apiService } from '@/services/api';

interface AppState {
  user: User | null;
  detections: Detection[];
  summary: AnalyticsSummary | null;
  activeJobs: Record<string, JobProgress>;
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  fetchDetections: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  addDetection: (detection: Detection) => void;
  updateJob: (job: JobProgress) => void;
  removeJob: (jobId: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  detections: [],
  summary: null,
  activeJobs: {},
  isLoading: false,

  setUser: (user) => set({ user }),

  fetchDetections: async () => {
    set({ isLoading: true });
    try {
      const detections = await apiService.getDetections();
      set({ detections, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch detections:', error);
    }
  },

  fetchSummary: async () => {
    try {
      const summary = await apiService.getAnalyticsSummary();
      set({ summary });
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  },

  addDetection: (detection) => {
    set((state) => ({
      detections: [detection, ...state.detections],
      summary: state.summary ? {
        ...state.summary,
        total_detections: state.summary.total_detections + 1,
        pending_review: state.summary.pending_review + 1,
      } : null
    }));
  },

  updateJob: (job) => {
    if (!job || !job.job_id) return;
    set((state) => ({
      activeJobs: { ...state.activeJobs, [job.job_id]: job }
    }));
  },

  removeJob: (jobId) => {
    set((state) => {
      const { [jobId]: _, ...rest } = state.activeJobs;
      return { activeJobs: rest };
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, detections: [], summary: null, activeJobs: {} });
  },
}));
