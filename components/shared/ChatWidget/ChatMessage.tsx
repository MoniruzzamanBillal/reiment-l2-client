"use client";

import { TAiChatMessage, TProductResponse } from "@/types";
import ChatProductCard from "./ChatProductCard";
import { cn } from "@/lib/utils";

export default function ChatMessage({
  message,
  products,
}: {
  message: TAiChatMessage;
  products?: TProductResponse[];
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className="flex flex-col gap-2 max-w-[85%]">
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-prime100 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-800 rounded-bl-sm",
          )}
        >
          {message.content}
        </div>

        {!isUser && products && products.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {products.map((product) => (
              <ChatProductCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
