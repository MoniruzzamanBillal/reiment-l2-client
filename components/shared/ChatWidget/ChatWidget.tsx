"use client";

import { useChatStore } from "@/stores/useChatStore";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const isOpen = useChatStore((s) => s.isOpen);
  const toggle = useChatStore((s) => s.toggle);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="w-[22rem] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-prime100 text-white">
              <div>
                <p className="font-semibold text-sm">Shopping Assistant</p>
                <p className="text-[11px] text-white/80">Ask about products</p>
              </div>
              <button
                onClick={toggle}
                aria-label="Close chat"
                className="hover:bg-white/10 rounded-full p-1 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            <ChatWindow />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggle}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="size-14 rounded-full bg-prime100 hover:bg-prime200 text-white shadow-xl flex items-center justify-center transition-colors"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.15 }}
            className="flex"
          >
            {isOpen ? (
              <X className="size-6" />
            ) : (
              <MessageCircle className="size-6" />
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
