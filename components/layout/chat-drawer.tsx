"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Copy, LoaderCircle, MessageSquare, SendHorizonal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getChatContextSnapshot } from "@/lib/firestore";
import { formatDateTime, safeJsonParse } from "@/lib/utils";
import type { ChatContextSnapshot } from "@/types";

export function ChatDrawer() {
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<ChatContextSnapshot | null>(null);
  const [input, setInput] = useState("");
  const [timestampLookup, setTimestampLookup] = useState<Record<string, string>>({});
  const timestampLookupRef = useRef<Record<string, string>>({});

  const { messages, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        snapshot,
      },
    }),
  });

  useEffect(() => {
    const storedMessages = safeJsonParse<Array<{ id: string; role: "user" | "assistant" | "system"; createdAt: string; content: string }>>(
      localStorage.getItem("stockbot-history"),
      [],
    );

    if (storedMessages.length > 0) {
      queueMicrotask(() => {
        const nextLookup = Object.fromEntries(
          storedMessages.map((message) => [message.id, message.createdAt]),
        );
        timestampLookupRef.current = nextLookup;
        setTimestampLookup(nextLookup);
        setMessages(
          storedMessages.map((message) => ({
            id: message.id,
            role: message.role,
            parts: [{ type: "text", text: message.content }],
          })),
        );
      });
    }

    void getChatContextSnapshot().then(setSnapshot);
  }, [setMessages]);

  useEffect(() => {
    const normalizedMessages = messages
      .map((message) => ({
        id: message.id,
        role: message.role,
        createdAt: timestampLookupRef.current[message.id] ?? new Date().toISOString(),
        content: message.parts
          .filter((part) => part.type === "text")
          .map((part) => ("text" in part ? part.text : ""))
          .join(""),
      }))
      .slice(-50);

    queueMicrotask(() => {
      timestampLookupRef.current = {
        ...timestampLookupRef.current,
        ...Object.fromEntries(normalizedMessages.map((message) => [message.id, message.createdAt])),
      };
      setTimestampLookup(timestampLookupRef.current);
      localStorage.setItem("stockbot-history", JSON.stringify(normalizedMessages));
    });
  }, [messages]);

  const renderedMessages = useMemo(
    () =>
      messages.map((message) => ({
        id: message.id,
        role: message.role,
        createdAt: timestampLookup[message.id] ?? new Date().toISOString(),
        content: message.parts
          .filter((part) => part.type === "text")
          .map((part) => ("text" in part ? part.text : ""))
          .join(""),
      })),
    [messages, timestampLookup],
  );

  return (
    <div className="fixed bottom-24 right-4 z-40 lg:bottom-6">
      {open ? (
        <div className="w-[calc(100vw-2rem)] max-w-md rounded-2xl border border-white/10 bg-[#1A1D27] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/15 p-2 text-indigo-400">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-50">StockBot</p>
                <p className="text-xs text-slate-400">AI assistant ready</p>
              </div>
            </div>
            <button
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[26rem] space-y-3 overflow-y-auto p-4">
            {renderedMessages.length === 0 ? (
              <div className="rounded-2xl bg-[#252836] p-3 text-sm text-slate-300">
                Ask about low stock items, current quantities, reorder timing, or recent activity.
              </div>
            ) : null}
            {renderedMessages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl p-3 text-sm ${
                  message.role === "user" ? "ml-8 bg-indigo-500 text-white" : "mr-8 bg-[#252836] text-slate-200"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="mt-2 flex items-center justify-between text-[11px] opacity-80">
                  <span>{formatDateTime(message.createdAt)}</span>
                  {message.role !== "user" ? (
                    <button
                      className="inline-flex items-center gap-1"
                      onClick={() => void navigator.clipboard.writeText(message.content)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            {status === "streaming" || status === "submitted" ? (
              <div className="mr-8 inline-flex items-center gap-2 rounded-2xl bg-[#252836] px-3 py-2 text-sm text-slate-300">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                StockBot is typing...
              </div>
            ) : null}
          </div>
          <form
            className="border-t border-white/10 p-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!input.trim()) {
                return;
              }

              void sendMessage({ text: input });
              setInput("");
            }}
          >
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                name="prompt"
                placeholder="Ask StockBot..."
                autoComplete="off"
              />
              <Button type="submit" disabled={status === "streaming" || status === "submitted"}>
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <button
          aria-label="Open AI chatbot"
          onClick={() => setOpen(true)}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg transition hover:bg-indigo-400"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
