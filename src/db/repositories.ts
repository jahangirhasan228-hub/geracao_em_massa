import type { Batch, BatchVideo } from "../workflow/batchWorkflow.js";
import type { BatchSettings } from "../workflow/settings.js";
import type { BatchStatus, VideoStatus } from "../workflow/status.js";

export type BatchRow = {
  id: string;
  user_id: string;
  telegram_user_id: string;
  template_id: string | null;
  status: string;
  settings_json: string;
  status_panel_chat_id: string | null;
  status_panel_message_id: string | null;
  output_zip_url: string | null;
  created_at: string;
  updated_at: string;
};

export type VideoRow = {
  id: string;
  batch_id: string;
  telegram_file_id: string;
  original_file_name: string;
  size_bytes: number;
  status: string;
  output_url: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export function mapBatchRow(row: BatchRow): Batch {
  return {
    id: row.id,
    telegramUserId: row.telegram_user_id,
    status: row.status as BatchStatus,
    templateId: row.template_id,
    settings: JSON.parse(row.settings_json) as BatchSettings,
    videos: []
  };
}

export function mapVideoRow(row: VideoRow): BatchVideo {
  return {
    id: row.id,
    fileId: row.telegram_file_id,
    fileName: row.original_file_name,
    sizeBytes: row.size_bytes,
    status: row.status as VideoStatus
  };
}
