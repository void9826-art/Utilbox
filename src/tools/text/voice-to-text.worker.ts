/**
 * Runs Whisper speech recognition off the main thread.
 *
 * The page decodes the audio to 16 kHz mono samples and posts them here; the
 * model files download once from Hugging Face and are cached by the browser.
 * Nothing about the audio leaves this worker except the transcript, which is
 * posted back to the page.
 */

type Incoming = {
  type: "transcribe";
  audio: Float32Array;
  model: string;
  language: string | null;
  timestamps: boolean;
};

type TranscriptChunk = { text: string; timestamp: [number, number | null] };
type Transcriber = (
  audio: Float32Array,
  options: Record<string, unknown>,
) => Promise<{ text: string; chunks?: TranscriptChunk[] }>;

const scope = self as unknown as {
  onmessage: ((event: MessageEvent<Incoming>) => void) | null;
  postMessage: (message: unknown) => void;
};

let loadedModel = "";
let transcriberPromise: Promise<Transcriber> | null = null;

function loadTranscriber(model: string): Promise<Transcriber> {
  if (!transcriberPromise || loadedModel !== model) {
    loadedModel = model;
    transcriberPromise = (async () => {
      const { pipeline, env } = await import("@huggingface/transformers");
      env.allowLocalModels = false;
      const instance = await pipeline("automatic-speech-recognition", model, {
        progress_callback: (progress: { status: string; file?: string; loaded?: number; total?: number }) => {
          if (progress.status === "progress" && progress.file) {
            scope.postMessage({ type: "download", file: progress.file, loaded: progress.loaded ?? 0, total: progress.total ?? 0 });
          }
        },
      });
      return instance as unknown as Transcriber;
    })();
    transcriberPromise.catch(() => {
      transcriberPromise = null;
    });
  }
  return transcriberPromise;
}

scope.onmessage = async (event) => {
  const message = event.data;
  if (message?.type !== "transcribe") return;

  try {
    scope.postMessage({ type: "status", status: "loading" });
    const transcribe = await loadTranscriber(message.model);
    scope.postMessage({ type: "status", status: "transcribing" });

    const output = await transcribe(message.audio, {
      task: "transcribe",
      // Whisper works on 30-second windows; the overlap stops words at the edges being lost.
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: message.timestamps,
      ...(message.language ? { language: message.language } : {}),
    });

    scope.postMessage({ type: "result", text: output.text.trim(), chunks: output.chunks ?? [] });
  } catch (error) {
    scope.postMessage({ type: "error", message: error instanceof Error ? error.message : String(error) });
  }
};
