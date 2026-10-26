"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Status = "idle" | "playing" | "paused";

const TARGET_SELECTOR = "[data-listen-target]";
const BLOCK_SELECTOR = "h2, h3, h4, p, li, blockquote";
const HIGHLIGHT_CLASS = "listen-active";

const noopSubscribe = () => () => {};

function useSpeechSupported(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    () => false,
  );
}

/** Divide textos longos: alguns navegadores cortam falas com mais de ~200 caracteres. */
function splitText(text: string): string[] {
  const sentences = text.match(/[^.!?…]+[.!?…]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > 220 && current) {
      chunks.push(current.trim());
      current = "";
    }
    current += sentence;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function pickPortugueseVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "pt-BR" && /google|natural|online/i.test(v.name)) ??
    voices.find((v) => v.lang === "pt-BR") ??
    voices.find((v) => v.lang.startsWith("pt")) ??
    null
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

/**
 * Botão "Ouvir este artigo": lê o texto em voz alta com a voz do próprio
 * aparelho (Web Speech API). Sem custo e sem enviar o texto para fora.
 */
export function ListenButton({ title }: { title: string }) {
  const supported = useSpeechSupported();
  const [status, setStatus] = useState<Status>("idle");
  const [slow, setSlow] = useState(false);
  const runId = useRef(0);
  const activeEl = useRef<HTMLElement | null>(null);
  const position = useRef(0);

  function clearHighlight() {
    activeEl.current?.classList.remove(HIGHLIGHT_CLASS);
    activeEl.current = null;
  }

  function stop() {
    runId.current += 1;
    window.speechSynthesis.cancel();
    clearHighlight();
    setStatus("idle");
  }

  useEffect(() => {
    return () => {
      runId.current += 1;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      activeEl.current?.classList.remove(HIGHLIGHT_CLASS);
    };
  }, []);

  function start(rate: number, fromIndex = 0) {
    const target = document.querySelector<HTMLElement>(TARGET_SELECTOR);
    if (!target) return;

    const blocks = Array.from(target.querySelectorAll<HTMLElement>(BLOCK_SELECTOR)).filter(
      (el) => el.innerText.trim().length > 0,
    );
    const queue: { el: HTMLElement | null; text: string }[] = [{ el: null, text: title }];
    for (const el of blocks) {
      // Evita ler duas vezes um parágrafo que está dentro de item de lista ou citação.
      if (el.tagName === "P" && el.parentElement?.closest("li, blockquote")) continue;
      for (const text of splitText(el.innerText.trim())) queue.push({ el, text });
    }

    const synth = window.speechSynthesis;
    synth.cancel();
    const myRun = ++runId.current;
    const voice = pickPortugueseVoice();
    let index = fromIndex;

    const speakNext = () => {
      if (runId.current !== myRun) return;
      if (index >= queue.length) {
        clearHighlight();
        setStatus("idle");
        return;
      }
      position.current = index;
      const item = queue[index++];
      if (item.el !== activeEl.current) {
        clearHighlight();
        if (item.el) {
          item.el.classList.add(HIGHLIGHT_CLASS);
          activeEl.current = item.el;
          item.el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = "pt-BR";
      if (voice) utterance.voice = voice;
      utterance.rate = rate;
      utterance.onend = speakNext;
      utterance.onerror = (event) => {
        if (event.error === "interrupted" || event.error === "canceled") return;
        speakNext();
      };
      synth.speak(utterance);
    };

    setStatus("playing");
    speakNext();
  }

  function toggleSpeed() {
    const next = !slow;
    setSlow(next);
    // Reinicia o trecho atual na nova velocidade, se estiver tocando.
    if (status !== "idle") start(next ? 0.8 : 1, position.current);
  }

  if (!supported) return null;

  const baseBtn =
    "inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2 font-heading text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/40";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-sage-muted/40 p-3 sm:p-4">
      {status === "idle" ? (
        <button
          type="button"
          onClick={() => start(slow ? 0.8 : 1)}
          className={`${baseBtn} bg-forest text-off-white hover:bg-sage`}
        >
          <SpeakerIcon />
          Ouvir este artigo
        </button>
      ) : (
        <>
          {status === "playing" ? (
            <button
              type="button"
              onClick={() => {
                window.speechSynthesis.pause();
                setStatus("paused");
              }}
              className={`${baseBtn} bg-forest text-off-white hover:bg-sage`}
            >
              Pausar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                window.speechSynthesis.resume();
                setStatus("playing");
              }}
              className={`${baseBtn} bg-forest text-off-white hover:bg-sage`}
            >
              Continuar
            </button>
          )}
          <button
            type="button"
            onClick={stop}
            className={`${baseBtn} border border-border-strong bg-surface text-forest hover:bg-sage-muted`}
          >
            Parar
          </button>
        </>
      )}
      <button
        type="button"
        onClick={toggleSpeed}
        aria-pressed={slow}
        className={`${baseBtn} border border-border-strong bg-surface text-forest hover:bg-sage-muted`}
      >
        {slow ? "Velocidade: mais devagar" : "Velocidade: normal"}
      </button>
      <p className="w-full text-xs text-muted sm:w-auto">
        Usa a voz do seu celular ou computador.
      </p>
    </div>
  );
}
