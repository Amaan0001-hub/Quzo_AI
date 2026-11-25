"use client";

import { Bot, Check, Copy, User } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Block } from "./agents";

/* ---------- plain text / markdown exports ---------- */

export function toText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading":
        case "text": return b.text;
        case "list": return b.items.map((i) => `- ${i}`).join("\n");
        case "code": return b.code;
        case "table": return [b.head, ...b.rows].map((r) => r.join(" | ")).join("\n");
        case "bars": return `${b.title}\n${b.data.map(([k, v]) => `${k}: ${v}${b.unit ?? ""}`).join("\n")}`;
        case "chat": return b.messages.map(([who, m]) => `${who}: ${m}`).join("\n");
        case "scenes": return b.scenes.map((s) => s.join(" | ")).join("\n");
        case "palette": return b.colors.map(([n, c]) => `${n} ${c}`).join("\n");
      }
    })
    .join("\n\n");
}

export function toMarkdown(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading": return `## ${b.text}`;
        case "text": return b.text;
        case "list": return b.items.map((i) => `- ${i}`).join("\n");
        case "code": return "```" + b.lang + "\n" + b.code + "\n```";
        case "table": {
          const row = (r: string[]) => `| ${r.join(" | ")} |`;
          return [row(b.head), row(b.head.map(() => "---")), ...b.rows.map(row)].join("\n");
        }
        case "bars": return `**${b.title}**\n\n${b.data.map(([k, v]) => `- ${k}: ${v}${b.unit ?? ""}`).join("\n")}`;
        case "chat": return b.messages.map(([who, m]) => `**${who === "agent" ? "AI agent" : "Customer"}:** ${m}`).join("\n\n");
        case "scenes": return b.scenes.map(([t, v, vo], i) => `**Scene ${i + 1} (${t})**\n- Visual: ${v}\n- Voice-over: "${vo}"`).join("\n\n");
        case "palette": return b.colors.map(([n, c]) => `- ${n}: \`${c}\``).join("\n");
      }
    })
    .join("\n\n");
}

/* ---------- helpers ---------- */

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return [copied, copy] as const;
}

const TOKEN = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|export|from|const|let|return|if|function|type|await|async|new|default)\b|\b(\d+)\b/gm;

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of code.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(code.slice(last, at));
    const cls = m[1] ? "tk-c" : m[2] ? "tk-s" : m[3] ? "tk-k" : "tk-n";
    out.push(<span key={n++} className={cls}>{m[0]}</span>);
    last = at + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, copy] = useCopy(code);
  const lines = code.split("\n").length;
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 text-slate-200 shadow-lg" style={{ background: "var(--code-bg)" }}>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <i className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <i className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
            <i className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{lang} · {lines} lines</span>
        </div>
        <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-300 hover:bg-white/10" aria-label="Copy code">
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="qz-scroll overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed"><code>{highlight(code)}</code></pre>
    </div>
  );
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  const [copied, copy] = useCopy(hex);
  return (
    <button type="button" onClick={copy} className="border-[color:var(--line)] group overflow-hidden rounded-2xl border text-left transition hover:-translate-y-0.5 hover:shadow-lg" aria-label={`Copy ${name} ${hex}`}>
      <div className="relative h-20" style={{ background: hex }}>
        <span className="absolute right-2 top-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          {copied ? "Copied" : "Copy"}
        </span>
      </div>
      <p className="p-2 text-xs font-semibold">
        {name}
        <span className="text-[color:var(--muted)] block font-mono font-normal uppercase">{hex}</span>
      </p>
    </button>
  );
}

/** "0–5s" -> [0, 5]; falls back to null when it cannot be parsed. */
function span(t: string): [number, number] | null {
  const m = t.match(/(\d+)\D+(\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

/* ---------- block renderer ---------- */

export function BlockView({ block: b, color }: { block: Block; color: string }) {
  switch (b.type) {
    case "heading":
      return (
        <h4 className="flex items-center gap-3 text-lg font-bold tracking-tight">
          <span className="h-6 w-1 shrink-0 rounded-full" style={{ background: color }} />
          {b.text}
        </h4>
      );
    case "text":
      return <p className="whitespace-pre-line text-sm leading-relaxed opacity-90">{b.text}</p>;
    case "list":
      return (
        <ul className="space-y-2">
          {b.items.map((i, idx) => (
            <li key={idx} className="bg-[var(--soft)] flex gap-3 rounded-xl px-3 py-2.5 text-sm">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
              {i}
            </li>
          ))}
        </ul>
      );
    case "code":
      return <CodeBlock lang={b.lang} code={b.code} />;
    case "table":
      return (
        <div className="border-[color:var(--line)] qz-scroll overflow-x-auto rounded-2xl border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[var(--soft)]">
                {b.head.map((c, i) => (
                  <th key={i} className="whitespace-nowrap px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider" style={{ color }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, ri) => (
                <tr key={ri} className="border-[color:var(--line)] border-t transition-colors hover:bg-[var(--soft)]">
                  {r.map((c, i) => (
                    <td key={i} className={`px-4 py-2.5 ${i === 0 ? "font-semibold" : ""}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "bars": {
      const max = Math.max(...b.data.map(([, v]) => v), 1);
      const total = b.data.reduce((s, [, v]) => s + v, 0) || 1;
      const unit = b.unit ?? "";
      return (
        <div className="border-[color:var(--line)] rounded-2xl border p-4 sm:p-5">
          <p className="mb-4 text-sm font-semibold">{b.title}</p>
          <div className="space-y-3">
            {b.data.map(([k, v]) => (
              <div key={k} className="flex items-center gap-3 text-xs">
                <span className="text-[color:var(--muted)] w-16 shrink-0 font-medium sm:w-20">{k}</span>
                <span className="bg-[var(--soft)] h-3.5 flex-1 overflow-hidden rounded-full">
                  <span
                    className="qz-grow block h-full rounded-full"
                    style={{ width: `${(v / max) * 100}%`, background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 55%, white))`, boxShadow: `0 0 14px -2px ${color}` }}
                  />
                </span>
                <span className="w-24 shrink-0 text-right font-semibold tabular-nums">
                  {v.toLocaleString("en-US")}{unit}
                  <span className="text-[color:var(--muted)] ml-1 font-normal">· {Math.round((v / total) * 100)}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "chat":
      return (
        <div className="space-y-3">
          {b.messages.map(([who, m], i) => {
            const agent = who === "agent";
            return (
              <div key={i} className={`flex items-end gap-2 ${agent ? "flex-row-reverse" : ""}`}>
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: agent ? `linear-gradient(135deg, ${color}, #4338ca)` : "#64748b" }}
                  aria-hidden
                >
                  {agent ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </span>
                <div
                  className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed ${agent ? "bg-gradient-to-br from-[var(--btn-a)] to-[var(--btn-b)] text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 active:scale-95 rounded-2xl rounded-br-md" : "bg-[var(--soft)] rounded-2xl rounded-bl-md"}`}
                >
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest opacity-70">{agent ? "AI agent" : "Customer"}</span>
                  {m}
                </div>
              </div>
            );
          })}
        </div>
      );
    case "scenes": {
      const spans = b.scenes.map(([t]) => span(t));
      const end = Math.max(...spans.map((s) => s?.[1] ?? 0), 0);
      return (
        <div className="space-y-3">
          {end > 0 && (
            <div className="flex h-2.5 w-full gap-1 overflow-hidden rounded-full" aria-hidden>
              {b.scenes.map(([t], i) => {
                const s = spans[i];
                const w = s ? s[1] - s[0] : 1;
                return <span key={t} className="h-full rounded-full" style={{ flex: w, background: color, opacity: 0.4 + (i / b.scenes.length) * 0.6 }} />;
              })}
            </div>
          )}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
            {b.scenes.map(([time, visual, voice], i) => (
              <figure key={time} className="border-[color:var(--line)] overflow-hidden rounded-2xl border">
                <div
                  className="relative flex aspect-video items-center justify-center p-3 text-center text-xs font-medium text-white"
                  style={{ background: `radial-gradient(circle at 20% 15%, color-mix(in srgb, ${color} 70%, transparent), transparent 55%), linear-gradient(135deg, ${color}, #0b1020 ${70 + i * 6}%)` }}
                >
                  <span className="absolute left-2 top-2 rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-bold">{i + 1}</span>
                  {visual}
                </div>
                <figcaption className="p-3 text-xs leading-relaxed">
                  <span className="text-[color:var(--muted)] block font-semibold">Scene {i + 1} · {time}</span>
                  “{voice}”
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      );
    }
    case "palette":
      return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-2.5">
          {b.colors.map(([name, hex]) => <Swatch key={name} name={name} hex={hex} />)}
        </div>
      );
  }
}
