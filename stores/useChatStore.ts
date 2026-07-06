"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TAiChatMessage } from "@/types";

type TChatState = {
  isOpen: boolean;
  messages: TAiChatMessage[];
  toggle: () => void;
  addMessage: (message: TAiChatMessage) => void;
  reset: () => void;
};

export const useChatStore = create<TChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      messages: [],
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      reset: () => set({ messages: [] }),
    }),
    { name: "reiment_chat" }
  )
);
