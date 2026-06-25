// components/TextEditorBubbleMenu.tsx
"use client";

import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Bold, Heading2, Italic, Link as LinkIcon } from "lucide-react";

interface ITextEditorBubbleMenuProps {
  editor: Editor | null;
  onLinkClick: () => void;
}

export default function TextEditorBubbleMenu({
  editor,
  onLinkClick,
}: ITextEditorBubbleMenuProps) {
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      //   tippyOptions={{ duration: 100 }}
      className="flex gap-1 p-2 bg-surface-popover border border-surface-border rounded-lg shadow-lg"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${editor.isActive("bold") ? "bg-blue-100" : "hover:bg-surface-hover"}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${editor.isActive("italic") ? "bg-blue-100" : "hover:bg-surface-hover"}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded ${editor.isActive("heading", { level: 2 }) ? "bg-blue-100" : "hover:bg-surface-hover"}`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={onLinkClick}
        className={`p-2 rounded ${editor.isActive("link") ? "bg-blue-100" : "hover:bg-surface-hover"}`}
        title="Add Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </BubbleMenu>
  );
}
