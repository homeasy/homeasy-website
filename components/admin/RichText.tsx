"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "@tiptap/extension-image";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Code, Heading2, Heading3, ImagePlus, Italic, Link2, Link2Off, List, ListOrdered, Minus, Quote, Redo2, Strikethrough, Underline, Undo2 } from "lucide-react";
import { uploadArticleImage } from "@/app/(admin)/admin/blog/actions";
import { shrinkPhoto } from "./shrink-photo";

/**
 * The article editor (Tiptap). Headings start at Heading 2 because the article title is the page's main heading.
 * Photos need a description. The HTML it produces is cleaned again on the server when the article is saved.
 */
export default function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const [panel, setPanel] = useState<"link" | "image" | null>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https", HTMLAttributes: { rel: null, target: null } },
      }),
      Image.configure({ inline: false, HTMLAttributes: { loading: "lazy" } }),
      Placeholder.configure({ placeholder: "Start writing your article…" }),
      CharacterCount,
    ],
    content: value,
    editorProps: { attributes: { class: "article-prose adm-editor min-h-[420px] px-5 py-4 focus:outline-none", "aria-label": "Article text" } },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
    immediatelyRender: false,
  });
  if (!editor) return <div className="min-h-[480px] rounded-lg border border-navy-700 bg-navy p-5 text-sm text-mist">Loading the editor…</div>;

  return (
    <div className="rounded-lg border border-navy-700 bg-navy focus-within:border-amber/60">
      <Toolbar editor={editor} panel={panel} setPanel={setPanel} />
      {panel === "link" && <LinkPanel editor={editor} close={() => setPanel(null)} />}
      {panel === "image" && <ImagePanel editor={editor} close={() => setPanel(null)} />}
      <EditorContent editor={editor} />
      <Counts editor={editor} />
    </div>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px bg-navy-700" aria-hidden="true" />;

function ToolBtn({ active, disabled, onClick, label, children }: { active?: boolean; disabled?: boolean; onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex size-9 items-center justify-center rounded-md transition-colors disabled:opacity-30 ${active ? "bg-amber/15 text-amber" : "text-mist hover:bg-white/5 hover:text-white"}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, panel, setPanel }: { editor: Editor; panel: "link" | "image" | null; setPanel: (p: "link" | "image" | null) => void }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });
  const c = () => editor.chain().focus();
  const toggle = (p: "link" | "image") => setPanel(panel === p ? null : p);
  return (
    <div className="sticky top-[7.5rem] z-10 flex flex-wrap items-center gap-0.5 rounded-t-lg border-b border-navy-700 bg-navy-800 px-2 py-1.5 lg:top-16" role="toolbar" aria-label="Formatting">
      <ToolBtn label="Heading 2" active={s.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></ToolBtn>
      <ToolBtn label="Heading 3" active={s.h3} onClick={() => c().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></ToolBtn>
      <Sep />
      <ToolBtn label="Bold" active={s.bold} onClick={() => c().toggleBold().run()}><Bold size={16} /></ToolBtn>
      <ToolBtn label="Italic" active={s.italic} onClick={() => c().toggleItalic().run()}><Italic size={16} /></ToolBtn>
      <ToolBtn label="Underline" active={s.underline} onClick={() => c().toggleUnderline().run()}><Underline size={16} /></ToolBtn>
      <ToolBtn label="Strikethrough" active={s.strike} onClick={() => c().toggleStrike().run()}><Strikethrough size={16} /></ToolBtn>
      <ToolBtn label="Inline code" active={s.code} onClick={() => c().toggleCode().run()}><Code size={16} /></ToolBtn>
      <Sep />
      <ToolBtn label="Bulleted list" active={s.bullet} onClick={() => c().toggleBulletList().run()}><List size={16} /></ToolBtn>
      <ToolBtn label="Numbered list" active={s.ordered} onClick={() => c().toggleOrderedList().run()}><ListOrdered size={16} /></ToolBtn>
      <ToolBtn label="Quote" active={s.quote} onClick={() => c().toggleBlockquote().run()}><Quote size={16} /></ToolBtn>
      <ToolBtn label="Divider line" onClick={() => c().setHorizontalRule().run()}><Minus size={16} /></ToolBtn>
      <Sep />
      <ToolBtn label="Add or change a link" active={s.link || panel === "link"} onClick={() => toggle("link")}><Link2 size={16} /></ToolBtn>
      <ToolBtn label="Remove link" disabled={!s.link} onClick={() => c().extendMarkRange("link").unsetLink().run()}><Link2Off size={16} /></ToolBtn>
      <ToolBtn label="Insert a photo" active={panel === "image"} onClick={() => toggle("image")}><ImagePlus size={16} /></ToolBtn>
      <Sep />
      <ToolBtn label="Undo" disabled={!s.canUndo} onClick={() => c().undo().run()}><Undo2 size={16} /></ToolBtn>
      <ToolBtn label="Redo" disabled={!s.canRedo} onClick={() => c().redo().run()}><Redo2 size={16} /></ToolBtn>
    </div>
  );
}

const PANEL = "border-b border-navy-700 bg-navy-800/50 p-3";
const SMALL = "mb-1 block text-xs font-medium uppercase tracking-wider text-mist";

function LinkPanel({ editor, close }: { editor: Editor; close: () => void }) {
  const [href, setHref] = useState(() => (editor.getAttributes("link").href as string) ?? "");
  const apply = () => {
    const url = href.trim();
    if (!url) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}` }).run();
    close();
  };
  return (
    <div className={PANEL}>
      <label className="block">
        <span className={SMALL}>Link address</span>
        <input
          autoFocus
          value={href}
          onChange={(e) => setHref(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), apply())}
          placeholder="/how-it-works or https://…"
          className="adm-control"
        />
      </label>
      <p className="mt-1 text-xs text-ash">Select the words first, then add the link. Links to your own pages (like /book-survey) help the SEO score.</p>
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className="adm-btn adm-btn-sm adm-btn-ghost" onClick={close}>Cancel</button>
        <button type="button" className="adm-btn adm-btn-sm adm-btn-primary" onClick={apply}>Apply link</button>
      </div>
    </div>
  );
}

function ImagePanel({ editor, close }: { editor: Editor; close: () => void }) {
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const valid = /^(https:\/\/|\/)/i.test(src.trim()) && alt.trim().length >= 3;

  async function upload(f: File | undefined) {
    if (!f) return;
    setBusy(true);
    setError("");
    try {
      const data = new FormData();
      data.set("photo", await shrinkPhoto(f));
      const r = await uploadArticleImage(data);
      if (r.url) setSrc(r.url);
      else setError(r.error ?? "The photo could not be uploaded.");
    } catch {
      setError("The photo could not be uploaded.");
    }
    setBusy(false);
  }
  const insert = () => {
    if (!valid) return;
    editor.chain().focus().setImage({ src: src.trim(), alt: alt.trim() }).run();
    close();
  };
  return (
    <div className={PANEL}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <span className={SMALL}>Photo</span>
          <input ref={file} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => upload(e.target.files?.[0])} className="block w-full text-sm text-mist" aria-label="Upload a photo" />
          <input value={src} onChange={(e) => setSrc(e.target.value)} placeholder="or paste an address: https://…" className="adm-control mt-2" aria-label="Photo address" />
        </div>
        <label className="block">
          <span className={SMALL}>Description (required)</span>
          <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="What the photo shows" className="adm-control" />
          <span className="mt-1 block text-xs text-ash">Read out by screen readers and used by Google Images.</span>
        </label>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
      <div className="mt-2 flex items-center justify-end gap-2">
        {busy && <span className="mr-auto text-xs text-mist">Uploading…</span>}
        <button type="button" className="adm-btn adm-btn-sm adm-btn-ghost" onClick={close}>Cancel</button>
        <button type="button" className="adm-btn adm-btn-sm adm-btn-primary" disabled={!valid || busy} onClick={insert}>Insert photo</button>
      </div>
    </div>
  );
}

function Counts({ editor }: { editor: Editor }) {
  const { words, chars } = useEditorState({
    editor,
    selector: ({ editor: e }) => ({ words: e.storage.characterCount.words() as number, chars: e.storage.characterCount.characters() as number }),
  });
  return (
    <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 border-t border-navy-700 px-4 py-2 text-xs text-ash">
      <span>{words.toLocaleString("en-IN")} words</span>
      <span>{chars.toLocaleString("en-IN")} characters</span>
      <span>about {Math.max(1, Math.round(words / 200))} min read</span>
    </div>
  );
}
