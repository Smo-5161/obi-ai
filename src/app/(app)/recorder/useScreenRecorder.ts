"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { record } from "rrweb";

export interface RecorderState {
  recording: boolean;
  seconds: number;
  eventCount: number;
  error: string | null;
}

interface RecorderHooks {
  start: () => Promise<boolean>;
  stop: () => void;
  getEvents: () => unknown[];
  getAudio: () => Blob | null;
}

export function useScreenRecorder(): RecorderHooks & { state: RecorderState } {
  const [state, setState] = useState<RecorderState>({
    recording: false,
    seconds: 0,
    eventCount: 0,
    error: null,
  });

  const stopFnsRef = useRef<Array<() => void>>([]);
  const eventsRef = useRef<unknown[]>([]);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioDoneRef = useRef<(() => void) | null>(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      micStreamRef.current = stream;

      const chunks: BlobPart[] = [];
      audioChunksRef.current = chunks;
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      mr.start(1000);
      mediaRecorderRef.current = mr;

      eventsRef.current = [];
      const stopRrweb = record({
        emit(event) {
          eventsRef.current.push(event);
          setState((s) => ({ ...s, eventCount: eventsRef.current.length }));
        },
        maskAllInputs: false,
      });
      if (stopRrweb) stopFnsRef.current = [stopRrweb];

      setState((s) => ({ ...s, recording: true, error: null, eventCount: 0, seconds: 0 }));
      timerRef.current = setInterval(() => {
        setState((s) => ({ ...s, seconds: s.seconds + 1 }));
      }, 1000);
      return true;
    } catch (e) {
      setState((s) => ({
        ...s,
        error:
          e instanceof Error && e.name === "NotAllowedError"
            ? "Accès au microphone refusé. Autorisez-le pour enregistrer le commentaire vocal."
            : "Impossible de démarrer l'enregistrement.",
      }));
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    for (const fn of stopFnsRef.current) fn();
    stopFnsRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      const done = new Promise<void>((resolve) => {
        audioDoneRef.current = resolve;
      });
      mr.onstop = () => {
        audioDoneRef.current?.();
      };
      mr.stop();
      void done;
    }
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;

    setState((s) => ({ ...s, recording: false }));
  }, []);

  const getEvents = useCallback(() => eventsRef.current, []);

  const getAudio = useCallback(() => {
    const chunks = audioChunksRef.current;
    if (!chunks.length) return null;
    return new Blob(chunks, { type: "audio/webm" });
  }, []);

  useEffect(() => {
    return () => {
      for (const fn of stopFnsRef.current) fn();
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { state, start, stop, getEvents, getAudio };
}
