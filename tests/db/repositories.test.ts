import { describe, expect, it } from "vitest";
import { mapBatchRow, mapVideoRow } from "../../src/db/repositories.js";
import { DEFAULT_BATCH_SETTINGS } from "../../src/workflow/settings.js";

describe("db repository mappers", () => {
  it("maps a batch row into a domain batch", () => {
    const batch = mapBatchRow({
      id: "batch-1",
      user_id: "user-1",
      telegram_user_id: "123",
      template_id: "humor-01",
      status: "settings",
      settings_json: JSON.stringify(DEFAULT_BATCH_SETTINGS),
      status_panel_chat_id: "123",
      status_panel_message_id: "456",
      output_zip_url: null,
      created_at: "2026-07-20 10:00:00",
      updated_at: "2026-07-20 10:00:00"
    });

    expect(batch).toMatchObject({
      id: "batch-1",
      telegramUserId: "123",
      status: "settings",
      templateId: "humor-01",
      settings: DEFAULT_BATCH_SETTINGS,
      videos: []
    });
  });

  it("maps a video row into a domain video", () => {
    const video = mapVideoRow({
      id: "video-1",
      batch_id: "batch-1",
      telegram_file_id: "file-1",
      original_file_name: "one.mp4",
      size_bytes: 1234,
      status: "ready",
      output_url: "https://files.example.com/one.mp4",
      error_message: null,
      created_at: "2026-07-20 10:00:00",
      updated_at: "2026-07-20 10:00:00"
    });

    expect(video).toMatchObject({
      id: "video-1",
      fileId: "file-1",
      fileName: "one.mp4",
      sizeBytes: 1234,
      status: "ready"
    });
  });
});
