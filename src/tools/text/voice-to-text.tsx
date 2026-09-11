"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ProgressIndicator, ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Segmented } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadText } from "@/lib/download";
import { stripExtension, type AcceptOptions } from "@/lib/files";
import { formatBytes } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";
import { TextOutput } from "./_shared";

const ACCEPT: AcceptOptions = { kinds: ["audio"], maxBytes: 50 * 1024 * 1024, label: "audio" };
const INPUT_ACCEPT = "audio/*,.opus,.ogg,.oga,.m4a,.mp3,.wav,.webm,.flac,.aac,.amr,.3gp";
const SAMPLE_RATE = 16_000;
const MAX_SECONDS = 10 * 60;

const MODELS = [
  { value: "onnx-community/whisper-tiny", label: "Faster (about 40 MB)" },
  { value: "onnx-community/whisper-base", label: "More accurate (about 80 MB)" },
] as const;

const LANGUAGES = [
  ["", "Detect automatically"],
  ["english", "English"],
  ["spanish", "Spanish"],
  ["french", "French"],
  ["german", "German"],
  ["portuguese", "Portuguese"],
  ["italian", "Italian"],
  ["dutch", "Dutch"],
  ["hindi", "Hindi"],
  ["urdu", "Urdu"],
  ["arabic", "Arabic"],
  ["turkish", "Turkish"],
  ["russian", "Russian"],
  ["polish", "Polish"],
  ["indonesian", "Indonesian"],
  ["japanese", "Japanese"],
  ["korean", "Korean"],
  ["chinese", "Chinese"],
] as const;

interface Chunk {
  text: string;
  timestamp: [number, number | null];
}

type Phase =
  | { name: "idle" }
  | { name: "decoding" }
  | { name: "loading"; loaded: number; total: number }
  | { name: "transcribing"; seconds: number };

function clock(seconds: number, separator = "."): string {
  const safe = Math.max(0, seconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = Math.floor(safe % 60);
  const millis = Math.round((safe % 1) * 1000);
  const base = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return separator === ","
    ? `${String(hours).padStart(2, "0")}:${base},${String(millis).padStart(3, "0")}`
    : hours > 0
      ? `${hours}:${base}`
      : base;
}

/** Decodes any browser-supported audio and resamples it to 16 kHz mono, as Whisper expects. */
async function decodeAudio(file: File): Promise<Float32Array> {
  const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const context = new AudioContextClass({ sampleRate: SAMPLE_RATE });
  try {
    const buffer = await context.decodeAudioData(await file.arrayBuffer());
    if (buffer.duration > MAX_SECONDS) {
      throw new RangeError(`That clip is ${Math.round(buffer.duration / 60)} minutes long. Clips up to 10 minutes are supported.`);
    }
    if (buffer.numberOfChannels === 1) return buffer.getChannelData(0);
    const mono = new Float32Array(buffer.length);
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const data = buffer.getChannelData(channel);
      for (let index = 0; index < data.length; index += 1) mono[index] += data[index] / buffer.numberOfChannels;
    }
    return mono;
  } finally {
    void context.close();
  }
}

export default function VoiceToText() {
  const [file, setFile] = React.useState<File | null>(null);
  const [model, setModel] = React.useState<string>(MODELS[0].value);
  const [language, setLanguage] = React.useState("");
  const [timestamps, setTimestamps] = React.useState(false);
  const [phase, setPhase] = React.useState<Phase>({ name: "idle" });
  const [text, setText] = React.useState("");
  const [chunks, setChunks] = React.useState<Chunk[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const workerRef = React.useRef<Worker | null>(null);
  const downloads = React.useRef(new Map<string, { loaded: number; total: number }>());

  React.useEffect(() => () => workerRef.current?.terminate(), []);

  const getWorker = () => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("./voice-to-text.worker.ts", import.meta.url), { type: "module" });
    }
    return workerRef.current;
  };

  const transcribe = async () => {
    if (!file) return;
    setError(null);
    setText("");
    setChunks([]);
    setPhase({ name: "decoding" });

    let audio: Float32Array;
    try {
      audio = await decodeAudio(file);
    } catch (caught) {
      setPhase({ name: "idle" });
      setError(
        caught instanceof RangeError
          ? caught.message
          : `"${file.name}" could not be decoded by this browser. Try another browser such as Chrome or Firefox, or convert the clip to MP3 or WAV.`,
      );
      return;
    }

    const seconds = audio.length / SAMPLE_RATE;
    const worker = getWorker();
    downloads.current.clear();

    worker.onmessage = (event: MessageEvent) => {
      const message = event.data as
        | { type: "download"; file: string; loaded: number; total: number }
        | { type: "status"; status: "loading" | "transcribing" }
        | { type: "result"; text: string; chunks: Chunk[] }
        | { type: "error"; message: string };

      if (message.type === "download") {
        downloads.current.set(message.file, { loaded: message.loaded, total: message.total });
        const totals = [...downloads.current.values()].reduce(
          (sum, entry) => ({ loaded: sum.loaded + entry.loaded, total: sum.total + entry.total }),
          { loaded: 0, total: 0 },
        );
        setPhase({ name: "loading", ...totals });
      } else if (message.type === "status") {
        setPhase(message.status === "loading" ? { name: "loading", loaded: 0, total: 0 } : { name: "transcribing", seconds });
      } else if (message.type === "result") {
        setText(message.text);
        setChunks(message.chunks);
        setPhase({ name: "idle" });
        if (!message.text) setError("No speech was recognised in that clip.");
      } else {
        setPhase({ name: "idle" });
        setError("The speech recognition model could not run. Check your connection for the first download, then try again.");
      }
    };

    worker.postMessage({ type: "transcribe", audio, model, language: language || null, timestamps }, [audio.buffer]);
  };

  const busy = phase.name !== "idle";
  const timed = timestamps && chunks.length > 0;
  const output = timed ? chunks.map((chunk) => `[${clock(chunk.timestamp[0])}] ${chunk.text.trim()}`).join("\n") : text;
  const srt = chunks
    .map((chunk, index) => `${index + 1}\n${clock(chunk.timestamp[0], ",")} --> ${clock(chunk.timestamp[1] ?? chunk.timestamp[0] + 2, ",")}\n${chunk.text.trim()}\n`)
    .join("\n");

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <Dropzone
            accept={ACCEPT}
            inputAccept={INPUT_ACCEPT}
            onFiles={(files) => {
              setFile(files[0] ?? null);
              setText("");
              setChunks([]);
            }}
            onError={setError}
            hint="Voice notes (OGG, Opus), M4A, MP3, WAV, WebM or FLAC, up to 10 minutes. Nothing is uploaded."
          />
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="min-w-0 truncate font-medium text-fg">{file.name}</span>
            <span className="tabular text-fg-muted">{formatBytes(file.size)}</span>
            {!busy ? (
              <ResetButton
                onReset={() => {
                  setFile(null);
                  setText("");
                  setChunks([]);
                }}
              >
                Choose another clip
              </ResetButton>
            ) : null}
          </div>
        )}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Model</span>
            <Segmented
              name="voice-model"
              ariaLabel="Speech recognition model"
              value={model}
              onChange={setModel}
              options={MODELS.map((entry) => ({ value: entry.value, label: entry.label }))}
            />
          </div>
          <SelectField label="Language" id="voice-language" value={language} onChange={setLanguage}>
            {LANGUAGES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
        </div>
        <Checkbox label="Add timestamps" checked={timestamps} onChange={(event) => setTimestamps(event.target.checked)} />

        {phase.name === "decoding" ? <ProgressIndicator label="Reading the audio…" /> : null}
        {phase.name === "loading" ? (
          <ProgressIndicator
            value={phase.total > 0 ? (phase.loaded / phase.total) * 100 : undefined}
            label={
              phase.total > 0
                ? `Downloading the speech model — ${formatBytes(phase.loaded)} of ${formatBytes(phase.total)} (first time only)…`
                : "Loading the speech model…"
            }
          />
        ) : null}
        {phase.name === "transcribing" ? (
          <ProgressIndicator label={`Transcribing ${clock(phase.seconds)} of audio on your device — this can take a while on a phone…`} />
        ) : null}

        <Button type="button" onClick={() => void transcribe()} loading={busy} disabled={!file}>
          Transcribe
        </Button>

        {text ? (
          <div className="space-y-2">
            <TextOutput
              id="voice-output"
              label="Transcript"
              value={output}
              rows={10}
              downloadName={file ? `${stripExtension(file.name)}-transcript.txt` : "transcript.txt"}
            />
            {timed ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => downloadText(srt, file ? `${stripExtension(file.name)}.srt` : "transcript.srt", "application/x-subrip;charset=utf-8")}
              >
                Download subtitles (.srt)
              </Button>
            ) : null}
          </div>
        ) : null}

        <Alert tone="info" title="Your audio stays on this device">
          The speech recognition model downloads once from Hugging Face and is then cached. Transcription runs in your
          browser, so the recording is never uploaded. Check names and numbers before relying on the transcript.
        </Alert>
      </div>
    </ToolFrame>
  );
}
