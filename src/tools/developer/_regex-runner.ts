"use client";

import * as React from "react";

import type { RegexRequest } from "./regex.worker";

/** How long a pattern may run before the worker is stopped. */
export const REGEX_TIME_LIMIT_MS = 1500;

type Payload<T> = { status: "idle" } | { status: "running" } | { status: "done"; data: T } | { status: "timeout" };

type Request = RegexRequest extends infer R ? (R extends { id: number } ? Omit<R, "id"> : never) : never;

/**
 * Sends the latest request to a worker, debounced, and resolves with its
 * answer. A request that runs past the time limit terminates the worker (the
 * only way to stop a runaway regex) and a fresh one is created next time.
 */
export function useRegexWorker<T>(request: Request | null, delay = 120): Payload<T> {
  const [state, setState] = React.useState<Payload<T>>({ status: "idle" });
  const workerRef = React.useRef<Worker | null>(null);
  const counter = React.useRef(0);
  const inFlight = React.useRef(false);
  const key = request ? JSON.stringify(request) : null;

  React.useEffect(() => () => workerRef.current?.terminate(), []);

  React.useEffect(() => {
    if (!key) return;
    const id = (counter.current += 1);
    let timer: ReturnType<typeof setTimeout> | undefined;

    const start = setTimeout(() => {
      if (!workerRef.current) {
        workerRef.current = new Worker(new URL("./regex.worker.ts", import.meta.url), { type: "module" });
      }
      const worker = workerRef.current;
      setState({ status: "running" });
      worker.onmessage = (event: MessageEvent<{ id: number } & T>) => {
        if (event.data.id !== counter.current) return;
        inFlight.current = false;
        clearTimeout(timer);
        setState({ status: "done", data: event.data });
      };
      timer = setTimeout(() => {
        if (counter.current !== id) return;
        worker.terminate();
        workerRef.current = null;
        inFlight.current = false;
        setState({ status: "timeout" });
      }, REGEX_TIME_LIMIT_MS);
      inFlight.current = true;
      worker.postMessage({ ...(JSON.parse(key) as Request), id });
    }, delay);

    return () => {
      clearTimeout(start);
      clearTimeout(timer);
      // A worker still busy with an outdated request may be stuck on a slow
      // pattern; replace it rather than queue the next request behind it.
      if (inFlight.current) {
        workerRef.current?.terminate();
        workerRef.current = null;
        inFlight.current = false;
      }
    };
  }, [delay, key]);

  return key ? state : { status: "idle" };
}
