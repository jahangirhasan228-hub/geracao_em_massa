import { stat, readFile } from "node:fs/promises";

export type TelegramDeliveryVideo = {
  id: string;
  fileName: string;
  outputPath?: string | null;
  outputUrl?: string | null;
};

export type TelegramDeliveryInput = {
  chatId: string;
  zipUrl: string;
  videos: TelegramDeliveryVideo[];
};

export type TelegramFetch = (url: URL, init: RequestInit) => Promise<Response>;

export function createTelegramDelivery(options: {
  botToken: string;
  maxTelegramSendBytes: number;
  fetch?: TelegramFetch;
}) {
  const fetchImpl = options.fetch ?? fetch;

  return {
    async deliverBatch(input: TelegramDeliveryInput): Promise<void> {
      for (const video of input.videos) {
        if (!video.outputPath) {
          continue;
        }

        const file = await stat(video.outputPath);
        if (file.size > options.maxTelegramSendBytes) {
          continue;
        }

        const fileBuffer = await readFile(video.outputPath);
        const formData = new FormData();
        formData.append("chat_id", input.chatId);
        formData.append("caption", video.fileName);
        formData.append("video", new Blob([fileBuffer], { type: "video/mp4" }), video.fileName);

        await callTelegramMultipart(fetchImpl, options.botToken, "sendVideo", formData);
      }

      await callTelegram(fetchImpl, options.botToken, "sendMessage", {
        chat_id: input.chatId,
        text: `ZIP do lote pronto: ${input.zipUrl}`,
        disable_web_page_preview: true
      });
    }
  };
}

async function callTelegram(fetchImpl: TelegramFetch, botToken: string, method: string, body: Record<string, unknown>) {
  const response = await fetchImpl(new URL(`https://api.telegram.org/bot${botToken}/${method}`), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Telegram delivery failed with status ${response.status}: ${responseText}`);
  }
}

async function callTelegramMultipart(fetchImpl: TelegramFetch, botToken: string, method: string, formData: FormData) {
  const response = await fetchImpl(new URL(`https://api.telegram.org/bot${botToken}/${method}`), {
    method: "POST",
    body: formData as unknown as BodyInit
  } as RequestInit);

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Telegram delivery failed with status ${response.status}: ${responseText}`);
  }
    }
