export type UserRole = 'Admin' | 'Officer' | 'Analyst';

export interface User {
  user_id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type DetectionStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Detection {
  detection_id: number;
  source_type: 'video' | 'camera';
  status: DetectionStatus;
  timestamp: string;
  evidence?: Evidence;
}

export interface Evidence {
  evidence_id: number;
  detection_id: number;
  image_url: string;
  crop_url: string;
  confidence_score: number;
}

export interface AnalyticsSummary {
  total_detections: number;
  pending_review: number;
  accuracy_rate: number;
}

export interface AnalyticsTrend {
  date: string;
  count: number;
}

export interface JobProgress {
  job_id: string;
  filename: string;
  progress: number;
  total_frames: number;
  current_frame: number;
  detections: number;
  average_confidence?: number;
  max_confidence?: number;
  status?: 'Processing' | 'Complete' | 'Error';
}
