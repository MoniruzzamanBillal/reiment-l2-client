"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAiChat } from "@/hooks/useAi";
import { useChatStore } from "@/stores/useChatStore";
import { TProductResponse } from "@/types";
import { apiGet } from "@/utils/api";
import { Loader2, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatMessage from "./ChatMessage";

export default function ChatWindow() {
  const messages = useChatStore((s) => s.messages);
  const addMessage = useChatStore((s) => s.addMessage);
  const { mutateAsync: chatMutate, isPending } = useAiChat();

  const [input, setInput] = useState("");
  const [productsByMessage, setProductsByMessage] = useState<
    Record<number, TProductResponse[]>
  >({});
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isPending]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isPending) return;

    addMessage({ role: "user", content });
    setInput("");

    try {
      const result: any = await chatMutate({
        url: "/ai/chat",
        payload: { message: content, history: messages.slice(-10) },
      });
      const reply: string = result?.data?.reply ?? "";
      const productIds: string[] = result?.data?.productIds ?? [];

      const assistantIndex = messages.length + 1;
      addMessage({ role: "assistant", content: reply });

      if (productIds.length > 0) {
        const settled = await Promise.all(
          productIds.map((id) =>
            apiGet(`/product/get-product/${id}`).catch(() => null),
          ),
        );
        const products: TProductResponse[] = settled
          .map((r: any) => r?.data)
          .filter(Boolean);
        if (products.length > 0) {
          setProductsByMessage((prev) => ({
            ...prev,
            [assistantIndex]: products,
          }));
        }
      }
    } catch (err: any) {
      addMessage({
        role: "assistant",
        content: "Sorry, I'm having trouble right now. Please try again.",
      });
      toast.error(err?.response?.data?.message || "Chat request failed");
    }
  };

  return (
    <div className="flex flex-col h-[28rem]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-10">
            Ask me about products — e.g. &quot;show me waterproof shoes under $50&quot;
          </p>
        )}
        {messages.map((message, index) => (
          <ChatMessage
            message={message}
            products={productsByMessage[index]}
            key={index}
          />
        ))}
        {isPending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2 flex items-center gap-1.5">
              <Loader2 className="size-3.5 animate-spin text-gray-500" />
              <span className="text-xs text-gray-500">typing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 p-3 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="rounded-full bg-gray-50 border-gray-200 text-sm"
          disabled={isPending}
        />
        <Button
          type="button"
          size="icon"
          disabled={isPending || !input.trim()}
          onClick={handleSend}
          className="shrink-0 rounded-full"
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}
