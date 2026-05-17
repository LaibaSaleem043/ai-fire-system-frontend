"use client";

import { useEffect } from "react";
import { wsService } from "@/services/websocket";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

export function WebSocketHandler() {
  const { addDetection, updateJob, removeJob } = useAppStore();

  useEffect(() => {
    if (!wsService) return;

    const unsubscribe = wsService.subscribe((event) => {
      if (!event || !event.type) return;

      switch (event.type) {
        case "FIRE_DETECTED":
          // toast.error("FIRE DETECTED!", {
          //   description: `Source: ${event.filename || event.source} | Confidence: ${((event.confidence ?? 0) * 100).toFixed(1)}%`,
          //   duration: 5000,
          // });
          // Map backend flat event to Detection type if needed
          addDetection({
            detection_id: event.detection_id,
            source_type: event.source === "upload" ? "video" : "camera",
            status: "Pending",
            timestamp: event.timestamp,
            evidence: {
              confidence_score: event.confidence,
              // Other fields will be fetched via API if needed
            } as any
          });
          break;

        case "JOB_PROGRESS":
          // event is the JobProgress object itself
          updateJob(event);
          break;

        case "JOB_COMPLETE":
          updateJob({
            job_id: event.job_id,
            filename: event.filename,
            progress: 100,
            total_frames: event.total_frames,
            current_frame: event.total_frames,
            detections: event.total_detections,
            average_confidence: event.average_confidence,
            max_confidence: event.max_confidence,
            status: "Complete"
          });
          // toast.success("ANALYSIS COMPLETE", {
          //   description: `Processed ${event.total_frames} frames. Found ${event.total_detections} fire(s).`,
          //   duration: 5000,
          // });
          break;

        case "JOB_ERROR":
          console.error("Job Error:", event.message);
          break;
      }
    });

    return () => unsubscribe();
  }, [addDetection, updateJob, removeJob]);

  return null;
}
