"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  LinkIcon,
} from "lucide-react";

/**
 * Drop-in WYSIWYG replacement for a plain Markdown textarea.
 *
 * Usage in your post/episode editor:
 *   const [content, setContent] = useState(initialHtml ?? "");
 *   <RichTextEditor value={content} onChange={setContent} />
 *
 * IMPORTANT: this stores content as HTML, not Markdown. If your Supabase
 * `posts` table currently expects Markdown in its content column, either:
 *   (a) rename/repurpose that column to hold HTML, or
 *   (b) keep both — save HTML to a new `content_html` column and leave
 *       the old Markdown column alone for legacy posts.
 * Also update wherever you render articles: swap react-markdown for
 * rendering this HTML directly (with sanitization — see note at bottom).
 */

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
        active
          ? "border-accent bg-accent-soft text-accent-strong"
          : "border-transparent text-muted hover:bg-surface-hover"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "underline underline-offset-2 decoration-1",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose-article max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    // Avoids SSR hydration mismatch warnings in Next.js App Router
    immediatelyRender: false,
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="rounded-lg border border-border bg-surface">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        <ToolbarButton
          label="Bold (Ctrl+B)"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Italic (Ctrl+I)"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton
          label="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton
          label="Link (Ctrl+K)"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          <LinkIcon size={16} />
        </ToolbarButton>
      </div>

      {/* Editable area — Ctrl/Cmd+B, Ctrl/Cmd+I, etc. work automatically via StarterKit */}
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}

/**
 * SANITIZATION NOTE:
 * When you render saved HTML back on the public article page, don't use
 * dangerouslySetInnerHTML on raw, unsanitized HTML if there's any chance
 * untrusted users could submit posts (e.g. via the writer-application
 * workflow). Run it through a sanitizer first, e.g.:
 *
 *   npm install isomorphic-dompurify
 *
 *   import DOMPurify from "isomorphic-dompurify";
 *   <div
 *     className="prose-article max-w-none"
 *     dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content_html) }}
 *   />
 *
 * Since this site already has an admin-approval step before someone
 * becomes a writer, risk is lower than a fully open form — but
 * sanitizing is still the safe default.
 */