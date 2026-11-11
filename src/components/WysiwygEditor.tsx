import React, { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Palette,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  Code,
  Eye,
  Type,
  CornerDownLeft,
} from 'lucide-react';

export interface WysiwygEditorProps {
  value: string[] | string;
  onChange: (paragraphs: string[]) => void;
  placeholder?: string;
  minHeight?: string;
}

const BLOCK_TAGS = new Set([
  'P',
  'DIV',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'BLOCKQUOTE',
  'UL',
  'OL',
  'LI',
  'TABLE',
  'HR',
  'PRE',
  'SECTION',
  'ARTICLE',
  'HEADER',
  'FOOTER',
]);

// Check if an HTML string is just an empty spacer like <div><br></div> or <p><br></p>
export function isEmptyHtmlSpacer(html: string): boolean {
  if (!html) return true;
  const stripped = html
    .replace(/&lt;\/?br\s*\/?&gt;/gi, '')
    .replace(/<\/?(p|div|span|br|b|strong|i|em|u|s|font)[^>]*>/gi, '')
    .replace(/&nbsp;|\u00A0/gi, ' ')
    .trim();
  if (stripped.length > 0) return false;
  return !/<(img|hr|audio|iframe|table)/i.test(html);
}

// Safely clean junk browser spans using DOM traversal (never breaks nested spans)
function cleanDomSpans(root: HTMLElement): void {
  const spans = Array.from(root.querySelectorAll('span')).reverse();
  for (const span of spans) {
    const style = span.getAttribute('style') || '';
    if (style) {
      // Remove default browser-computed styles that shouldn't be hardcoded
      if (span.style.fontSize === '1rem') {
        span.style.removeProperty('font-size');
      }
      const c = span.style.color.replace(/\s+/g, '');
      if (c === 'rgb(44,40,38)' || c === 'rgb(36,28,21)' || c === '#241c15') {
        span.style.removeProperty('color');
      }
      if (span.style.backgroundColor === 'transparent' || span.style.backgroundColor === 'rgba(0, 0, 0, 0)') {
        span.style.removeProperty('background-color');
      }
    }

    const remainingStyle = (span.getAttribute('style') || '').trim();
    if (!remainingStyle) {
      span.removeAttribute('style');
    }

    // If span has no attributes left, unwrap it safely
    if (span.attributes.length === 0) {
      const parent = span.parentNode;
      if (parent) {
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
      }
    }
  }
}

// Convert incoming value (array of paragraphs or string) into HTML for contentEditable
export function toHtml(val: string[] | string): string {
  if (Array.isArray(val)) {
    return val
      .map((p) => {
        let trimmed = (p || '').trim();
        if (!trimmed) return '';
        // Auto convert any &lt;/br&gt; or </br> to <br>
        trimmed = trimmed
          .replace(/&lt;\/?br\s*\/?&gt;/gi, '<br>')
          .replace(/<\/?br\s*\/?>/gi, '<br>');

        // Skip empty <div><br></div> spacers so they don't stack extra gaps
        if (isEmptyHtmlSpacer(trimmed)) {
          return '';
        }

        // Convert top-level <div>...</div> to <p>...</p> so editor and public view have identical paragraph margins
        if (/^<div(\s[^>]*)?>[\s\S]*<\/div>$/i.test(trimmed)) {
          const temp = document.createElement('div');
          temp.innerHTML = trimmed;
          if (temp.children.length === 1 && temp.children[0].tagName === 'DIV') {
            const divEl = temp.children[0] as HTMLElement;
            if (!divEl.querySelector('p, div, h1, h2, h3, h4, h5, h6, blockquote, ul, ol, table, hr')) {
              const styleAttr = divEl.getAttribute('style') ? ` style="${divEl.getAttribute('style')}"` : '';
              return `<p${styleAttr}>${divEl.innerHTML}</p>`;
            }
          }
        }

        if (/^<(p|div|h[1-6]|blockquote|ul|ol|table|hr)/i.test(trimmed)) {
          return trimmed;
        }
        return `<p>${trimmed}</p>`;
      })
      .filter(Boolean)
      .join('');
  }
  return (val || '')
    .replace(/&lt;\/?br\s*\/?&gt;/gi, '<br>')
    .replace(/<\/?br\s*\/?>/gi, '<br>');
}

// Convert contentEditable HTML into an array of clean paragraphs without losing any root text nodes
export function toParagraphs(html: string): string[] {
  if (!html || !html.trim()) return [];

  const normalizedHtml = html
    .replace(/&lt;\/?br\s*\/?&gt;/gi, '<br>')
    .replace(/<\/?br\s*\/?>/gi, '<br>');

  const temp = document.createElement('div');
  temp.innerHTML = normalizedHtml;
  cleanDomSpans(temp);

  const result: string[] = [];
  let inlineBuffer: string[] = [];

  const pushCleanParagraph = (rawContent: string, styleAttr = '') => {
    // Split on 2 or more consecutive <br> tags into separate paragraphs
    const parts = rawContent.split(/(?:<br\s*\/?>\s*){2,}/i);
    for (const part of parts) {
      const cleanedPart = part
        .replace(/^(?:<br\s*\/?>|\s)+/i, '')
        .replace(/(?:<br\s*\/?>|\s)+$/i, '')
        .trim();
      if (!cleanedPart) continue;
      if (isEmptyHtmlSpacer(cleanedPart)) continue;
      result.push(`<p${styleAttr}>${cleanedPart}</p>`);
    }
  };

  const flushInlineBuffer = () => {
    if (inlineBuffer.length === 0) return;
    const combined = inlineBuffer.join('').trim();
    inlineBuffer = [];
    if (!combined) return;
    pushCleanParagraph(combined);
  };

  const processNodeList = (nodes: Node[], inheritedStyle = '') => {
    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        if (text) {
          const esc = document.createElement('span');
          esc.textContent = text;
          inlineBuffer.push(esc.innerHTML);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toUpperCase();

        if (tag === 'BR') {
          inlineBuffer.push('<br>');
          continue;
        }

        // If an inline element wraps block elements (e.g. from Ctrl+A then changing font size/family),
        // flush inline buffer and process its children with the inline element's style
        if (!BLOCK_TAGS.has(tag)) {
          const hasNestedBlock = Array.from(el.querySelectorAll('*')).some((child) =>
            BLOCK_TAGS.has(child.tagName.toUpperCase())
          );
          if (hasNestedBlock) {
            flushInlineBuffer();
            const inlineStyle = el.getAttribute('style') || '';
            const mergedStyle = [inheritedStyle, inlineStyle].filter(Boolean).join('; ');
            processNodeList(Array.from(el.childNodes), mergedStyle);
            flushInlineBuffer();
          } else {
            inlineBuffer.push(el.outerHTML);
          }
          continue;
        }

        // It is a block element: first flush any preceding top-level text/inline nodes!
        flushInlineBuffer();

        if (tag === 'HR') {
          result.push('<hr>');
          continue;
        }

        if (tag === 'UL' || tag === 'OL' || tag === 'BLOCKQUOTE' || tag === 'TABLE' || /^H[1-6]$/.test(tag)) {
          const text = (el.textContent || '').replace(/\u00A0/g, ' ').trim();
          if (text || el.querySelector('img, hr, audio, iframe')) {
            if (inheritedStyle && !el.getAttribute('style')) {
              el.setAttribute('style', inheritedStyle);
            }
            result.push(el.outerHTML.trim());
          }
          continue;
        }

        // For P, DIV, SECTION, ARTICLE:
        const hasChildBlocks = Array.from(el.children).some((c) =>
          BLOCK_TAGS.has(c.tagName.toUpperCase())
        );
        const ownStyle = el.getAttribute('style') || '';
        const alignAttr = el.getAttribute('align');
        const alignStyle =
          alignAttr && !ownStyle.includes('text-align') ? `text-align: ${alignAttr};` : '';
        const combinedStyle = [inheritedStyle, ownStyle, alignStyle].filter(Boolean).join('; ');

        if (hasChildBlocks) {
          processNodeList(Array.from(el.childNodes), combinedStyle);
          flushInlineBuffer();
        } else {
          if (isEmptyHtmlSpacer(el.outerHTML)) {
            continue;
          }
          const styleAttr = combinedStyle ? ` style="${combinedStyle}"` : '';
          pushCleanParagraph(el.innerHTML, styleAttr);
        }
      }
    }
  };

  processNodeList(Array.from(temp.childNodes));
  flushInlineBuffer();

  return result;
}

// Sanitize pasted HTML from external sources (websites, Word, Google Docs) while keeping paragraphs & formatting
function sanitizePastedHtml(rawHtml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');
  const body = doc.body;

  // Remove non-content elements
  body
    .querySelectorAll('script, style, meta, link, iframe, object, embed, svg, form, input, button, img')
    .forEach((el) => el.remove());

  const cleanNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      const esc = document.createElement('span');
      esc.textContent = node.textContent || '';
      return esc.innerHTML;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const el = node as HTMLElement;
    const tag = el.tagName.toUpperCase();

    if (tag === 'BR') return '<br>';
    if (tag === 'HR') return '<hr>';

    const childrenHtml = Array.from(el.childNodes).map(cleanNode).join('');

    // Check inline formatting from style
    const style = el.style;
    let wrappedInner = childrenHtml;
    const fw = style?.fontWeight || '';
    if ((fw === 'bold' || Number(fw) >= 600) && tag !== 'B' && tag !== 'STRONG' && !/^H[1-6]$/.test(tag)) {
      wrappedInner = `<strong>${wrappedInner}</strong>`;
    }
    if (style?.fontStyle === 'italic' && tag !== 'I' && tag !== 'EM') {
      wrappedInner = `<em>${wrappedInner}</em>`;
    }
    if (style?.textDecoration?.includes('underline') && tag !== 'U') {
      wrappedInner = `<u>${wrappedInner}</u>`;
    }

    const textAlign = style?.textAlign || el.getAttribute('align') || '';
    const alignAttr =
      textAlign && ['center', 'right', 'justify'].includes(textAlign.toLowerCase())
        ? ` style="text-align: ${textAlign.toLowerCase()};"`
        : '';

    if (tag === 'B' || tag === 'STRONG') return `<strong>${wrappedInner}</strong>`;
    if (tag === 'I' || tag === 'EM') return `<em>${wrappedInner}</em>`;
    if (tag === 'U') return `<u>${wrappedInner}</u>`;
    if (tag === 'S' || tag === 'STRIKE' || tag === 'DEL') return `<s>${wrappedInner}</s>`;
    if (tag === 'H1' || tag === 'H2') return `<h2${alignAttr}>${wrappedInner}</h2>`;
    if (tag === 'H3' || tag === 'H4' || tag === 'H5' || tag === 'H6') return `<h3${alignAttr}>${wrappedInner}</h3>`;
    if (tag === 'BLOCKQUOTE') return `<blockquote${alignAttr}>${wrappedInner}</blockquote>`;
    if (tag === 'UL') return `<ul>${wrappedInner}</ul>`;
    if (tag === 'OL') return `<ol>${wrappedInner}</ol>`;
    if (tag === 'LI') return `<li>${wrappedInner}</li>`;

    if (tag === 'P' || tag === 'DIV' || tag === 'SECTION' || tag === 'ARTICLE') {
      // If it contains nested block tags in wrappedInner, return wrappedInner directly
      if (/<(p|div|h[1-6]|blockquote|ul|ol)\b/i.test(wrappedInner)) {
        return wrappedInner;
      }
      const trimmed = wrappedInner.trim();
      if (!trimmed || isEmptyHtmlSpacer(trimmed)) return '';
      return `<p${alignAttr}>${trimmed}</p>`;
    }

    return wrappedInner;
  };

  const rawResult = Array.from(body.childNodes).map(cleanNode).join('');
  const paragraphs = toParagraphs(rawResult);
  return paragraphs.join('');
}

const FONT_FAMILIES = [
  { label: 'Phông Serif Cổ điển', value: '"Playfair Display", serif' },
  { label: 'Phông Hiện đại (Be Vietnam Pro)', value: '"Be Vietnam Pro", sans-serif' },
  { label: 'Phông Thư pháp (Ma Shan Zheng)', value: '"Ma Shan Zheng", cursive' },
  { label: 'Phông Trang nhã (Georgia)', value: 'Georgia, serif' },
  { label: 'Phông Báo chí (Times New Roman)', value: '"Times New Roman", serif' },
];

const FONT_SIZES = [
  { label: '14px (Nhỏ)', value: '14px' },
  { label: '16px (Vừa)', value: '16px' },
  { label: '18px (Chuẩn bài đọc)', value: '18px' },
  { label: '20px (Lớn)', value: '20px' },
  { label: '24px (Rất lớn)', value: '24px' },
  { label: '28px (Tiêu đề)', value: '28px' },
];

const COLOR_PRESETS = [
  { label: 'Mặc định (Đen chữ)', value: '#241c15', bg: '#241c15' },
  { label: 'Đỏ son Thi Ca', value: '#8b261d', bg: '#8b261d' },
  { label: 'Vàng kim / Hổ phách', value: '#b48227', bg: '#b48227' },
  { label: 'Xanh ngọc / Trúc diệp', value: '#1e5f4a', bg: '#1e5f4a' },
  { label: 'Nâu cổ điển', value: '#5c4033', bg: '#5c4033' },
  { label: 'Xám đậm', value: '#4b5563', bg: '#4b5563' },
];

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung câu chuyện tại đây... Sử dụng thanh công cụ bên trên để chỉnh phông chữ, cỡ chữ, căn dòng, xuống dòng, in đậm...',
  minHeight = '320px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [codeValue, setCodeValue] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const isFocusedRef = useRef(false);
  const lastHtmlRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch {}
  }, []);

  // Sync incoming value to editor DOM without disturbing the active cursor
  useEffect(() => {
    if (isFocusedRef.current || (editorRef.current && editorRef.current.contains(document.activeElement))) {
      return;
    }

    const nextHtml = toHtml(value);
    if (nextHtml === lastHtmlRef.current) {
      return;
    }

    if (editorRef.current && editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
    lastHtmlRef.current = nextHtml;
    setCodeValue(toParagraphs(nextHtml).join('\n\n'));
  }, [value]);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const htmlData = e.clipboardData.getData('text/html');
    const plainText = e.clipboardData.getData('text/plain');

    let htmlToInsert = '';
    if (htmlData && htmlData.trim()) {
      htmlToInsert = sanitizePastedHtml(htmlData);
    }

    if (!htmlToInsert && plainText) {
      const normalized = plainText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const blocks = normalized
        .split(/\n\s*\n+/)
        .map((b) => b.trim())
        .filter(Boolean);

      htmlToInsert = blocks
        .map((b) => {
          const esc = document.createElement('span');
          esc.textContent = b;
          return `<p>${esc.innerHTML.replace(/\n/g, '<br>')}</p>`;
        })
        .join('');
    }

    if (htmlToInsert) {
      document.execCommand('insertHTML', false, htmlToInsert);
      handleInput();
    }
  };

  const cleanFormatting = () => {
    if (isCodeView) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      if (editorRef.current) {
        cleanDomSpans(editorRef.current);
        const normalized = toParagraphs(editorRef.current.innerHTML).join('');
        editorRef.current.innerHTML = normalized;
        handleInput();
      }
      return;
    }
    document.execCommand('removeFormat', false, undefined);
    handleInput();
  };

  // Pure input handler: NEVER mutate innerHTML while typing so cursor never jumps!
  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastHtmlRef.current = html;
    const paragraphs = toParagraphs(html);
    setCodeValue(paragraphs.join('\n\n'));
    onChange(paragraphs);
  };

  // Normalize structure when the user finishes editing and clicks away
  const handleBlur = () => {
    isFocusedRef.current = false;
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const paragraphs = toParagraphs(html);
    const normalizedHtml = paragraphs.join('');
    if (/&lt;\/?br\s*\/?&gt;/i.test(html) || /<\/br>/i.test(html)) {
      editorRef.current.innerHTML = normalizedHtml;
    }
    lastHtmlRef.current = editorRef.current.innerHTML;
    setCodeValue(paragraphs.join('\n\n'));
    onChange(paragraphs);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let val = e.target.value;
    val = val
      .replace(/&lt;\/?br\s*\/?&gt;/gi, '<br>')
      .replace(/<\/?br\s*\/?>/gi, '<br>');
    setCodeValue(val);
    const paragraphs = toParagraphs(val);
    onChange(paragraphs);
    if (editorRef.current) {
      const nextHtml = paragraphs.join('');
      editorRef.current.innerHTML = nextHtml;
      lastHtmlRef.current = nextHtml;
    }
  };

  const exec = (command: string, arg?: string) => {
    if (isCodeView) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleInput();
  };

  // Insert a clean <br> element at the cursor position for line breaks
  const insertLineBreak = () => {
    if (isCodeView) {
      setCodeValue((prev) => prev + '\n');
      return;
    }
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const br = document.createElement('br');
    range.insertNode(br);
    range.setStartAfter(br);
    range.setEndAfter(br);
    selection.removeAllRanges();
    selection.addRange(range);
    handleInput();
  };

  // Helper to wrap selected text in custom CSS style safely across single or multiple paragraphs
  const applyCustomStyle = (property: string, styleValue: string) => {
    if (isCodeView) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return;
    }

    const range = selection.getRangeAt(0);

    // Check if selection spans multiple block elements inside editorRef
    if (editorRef.current) {
      const blocks = Array.from(
        editorRef.current.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, blockquote, li')
      ) as HTMLElement[];
      const intersectedBlocks = blocks.filter((b) => selection.containsNode(b, true));

      if (intersectedBlocks.length > 1) {
        for (const blk of intersectedBlocks) {
          blk.style.setProperty(property, styleValue);
        }
        handleInput();
        return;
      }
    }

    const span = document.createElement('span');
    span.style.setProperty(property, styleValue);

    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
      handleInput();
    } catch (e) {
      console.warn('Could not apply custom style:', e);
    }
  };

  // Word & Paragraph count
  const wordCount = (editorRef.current?.innerText || codeValue || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const paragraphCount = Array.isArray(value) ? value.filter((p) => !isEmptyHtmlSpacer(p)).length : toParagraphs(codeValue).length;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background shadow-sm transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
      {/* WYSIWYG TOOLBAR */}
      <div className="bg-card border-b border-border/80 p-2 flex flex-wrap items-center gap-1.5 select-none text-foreground/80">
        {/* Font Family Selector */}
        <div className="flex items-center gap-1 bg-background/80 border border-border/80 rounded px-2 py-1 text-xs shadow-xs">
          <Type className="w-3.5 h-3.5 text-primary shrink-0" />
          <select
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              if (e.target.value) {
                applyCustomStyle('font-family', e.target.value);
                e.target.value = '';
              }
            }}
            className="bg-transparent border-none text-xs text-foreground focus:outline-none cursor-pointer max-w-[130px] truncate"
            title="Chọn phông chữ cho đoạn văn hoặc từ được bôi đen"
            defaultValue=""
          >
            <option value="" disabled>
              Phông chữ...
            </option>
            {FONT_FAMILIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Selector */}
        <div className="flex items-center gap-1 bg-background/80 border border-border/80 rounded px-2 py-1 text-xs shadow-xs">
          <span className="text-[11px] font-bold text-primary shrink-0">Aa</span>
          <select
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              if (e.target.value) {
                applyCustomStyle('font-size', e.target.value);
                e.target.value = '';
              }
            }}
            className="bg-transparent border-none text-xs text-foreground focus:outline-none cursor-pointer max-w-[110px] truncate"
            title="Chọn cỡ chữ cho từ được bôi đen"
            defaultValue=""
          >
            <option value="" disabled>
              Cỡ chữ...
            </option>
            {FONT_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="h-5 w-px bg-border/80 mx-1" />

        {/* Bold, Italic, Underline, Strike */}
        <div className="flex items-center bg-background/80 border border-border/80 rounded p-0.5 shadow-xs">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('bold');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="In đậm (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('italic');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="In nghiêng (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('underline');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Gạch chân (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('strikeThrough');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Gạch ngang chữ"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Line Break / Xuống dòng Button */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            insertLineBreak();
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-background/80 border border-border/80 hover:border-primary/50 hover:bg-primary/10 rounded text-xs text-foreground/80 hover:text-primary transition-all shadow-xs"
          title="Xuống dòng / Ngắt dòng thơ hoặc đối thoại (Shift + Enter)"
        >
          <CornerDownLeft className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-medium hidden sm:inline">Xuống dòng</span>
        </button>

        {/* Text Color Picker */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowColorPicker(!showColorPicker);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-background/80 border border-border/80 hover:border-primary/50 rounded text-xs text-foreground/80 hover:text-primary transition-all shadow-xs"
            title="Đổi màu chữ hoặc đánh dấu màu"
          >
            <Palette className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-medium hidden sm:inline">Màu chữ</span>
          </button>

          {showColorPicker && (
            <div
              className="absolute left-0 top-full mt-1.5 p-2.5 bg-card border border-border rounded-lg shadow-lg z-30 w-48 space-y-2 animate-in fade-in"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-1">
                Chọn màu chữ:
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      exec('foreColor', c.value);
                      setShowColorPicker(false);
                    }}
                    className="flex items-center gap-1.5 p-1 rounded hover:bg-muted text-left text-xs text-foreground/80 transition-colors"
                    title={c.label}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-border/80 shrink-0"
                      style={{ backgroundColor: c.bg }}
                    />
                    <span className="text-[10px] truncate">{c.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-border/80 mx-1" />

        {/* Headings & Paragraph */}
        <div className="flex items-center bg-background/80 border border-border/80 rounded p-0.5 shadow-xs">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('formatBlock', '<p>');
            }}
            className="px-2 py-1 text-xs font-serif font-semibold hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Đoạn văn thông thường"
          >
            P
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('formatBlock', '<h2>');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Tiêu đề vừa (H2)"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('formatBlock', '<h3>');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Tiêu đề nhỏ (H3)"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Alignments */}
        <div className="flex items-center bg-background/80 border border-border/80 rounded p-0.5 shadow-xs">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('justifyLeft');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Căn lề trái"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('justifyCenter');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Căn giữa"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('justifyRight');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Căn lề phải"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('justifyFull');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Căn đều hai bên"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-border/80 mx-1" />

        {/* Lists & Quote */}
        <div className="flex items-center bg-background/80 border border-border/80 rounded p-0.5 shadow-xs">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('insertUnorderedList');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Danh sách gạch đầu dòng"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('insertOrderedList');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Danh sách đánh số"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('formatBlock', '<blockquote>');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Đoạn văn trích dẫn"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Utilities: Clear format, Undo, Redo */}
        <div className="flex items-center bg-background/80 border border-border/80 rounded p-0.5 shadow-xs">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              cleanFormatting();
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Chuẩn hóa phông chữ / Xóa định dạng thừa"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('undo');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Hoàn tác (Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('redo');
            }}
            className="p-1.5 hover:bg-muted hover:text-primary rounded text-foreground/80 transition-colors"
            title="Làm lại (Ctrl+Y)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grow" />

        {/* Toggle Mode: Visual WYSIWYG ↔ Raw HTML/Text */}
        <button
          type="button"
          onClick={() => {
            if (!isCodeView) {
              const paragraphs = toParagraphs(editorRef.current?.innerHTML || '');
              setCodeValue(paragraphs.join('\n\n'));
            } else {
              const paragraphs = toParagraphs(codeValue);
              const nextHtml = paragraphs.join('');
              if (editorRef.current) {
                editorRef.current.innerHTML = nextHtml;
                lastHtmlRef.current = nextHtml;
              }
              onChange(paragraphs);
            }
            setIsCodeView(!isCodeView);
          }}
          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all border ${
            isCodeView
              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
              : 'bg-background/80 text-foreground/70 border-border/80 hover:text-foreground hover:border-border'
          }`}
          title="Chuyển đổi giữa chế độ Soạn thảo trực quan và Mã nguồn"
        >
          {isCodeView ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Chế độ Trực quan</span>
            </>
          ) : (
            <>
              <Code className="w-3.5 h-3.5" />
              <span>Xem mã HTML</span>
            </>
          )}
        </button>
      </div>

      {/* EDITOR CONTENT AREA */}
      <div className="relative">
        {/* Visual ContentEditable Mode */}
        <div
          ref={editorRef}
          contentEditable={!isCodeView}
          onFocus={() => {
            isFocusedRef.current = true;
            try {
              document.execCommand('defaultParagraphSeparator', false, 'p');
            } catch {}
          }}
          onBlur={handleBlur}
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (e.shiftKey) {
                e.preventDefault();
                insertLineBreak();
              }
            }
          }}
          data-placeholder={placeholder}
          style={{ minHeight }}
          className={`p-4 text-lg font-serif leading-relaxed text-foreground focus:outline-none story-rich-content ${
            isCodeView ? 'hidden' : 'block'
          } empty:before:content-[attr(data-placeholder)] empty:before:text-foreground/40 empty:before:italic empty:before:pointer-events-none`}
        />

        {/* Raw Code / HTML Mode */}
        {isCodeView && (
          <textarea
            value={codeValue}
            onChange={handleCodeChange}
            style={{ minHeight }}
            className="w-full p-4 font-mono text-xs leading-relaxed bg-muted/20 text-foreground focus:outline-none resize-y whitespace-pre-line"
            placeholder="Chỉnh sửa mã HTML trực tiếp..."
          />
        )}
      </div>

      {/* FOOTER STATS */}
      <div className="bg-card/50 border-t border-border/60 px-3 py-1.5 flex items-center justify-between text-[11px] text-foreground/60">
        <div className="flex items-center gap-3">
          <span>
            Số đoạn: <strong className="text-foreground">{paragraphCount}</strong>
          </span>
          <span>
            Số từ: <strong className="text-foreground">{wordCount}</strong>
          </span>
        </div>
        <div className="text-[10px] text-foreground/50 italic">
          Bấm nút <strong>"Xuống dòng"</strong> hoặc nhấn <strong>Shift + Enter</strong> để ngắt dòng thơ / đối thoại
        </div>
      </div>
    </div>
  );
};
