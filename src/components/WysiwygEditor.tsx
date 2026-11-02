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

// Convert incoming value (array of paragraphs or string) into HTML for contentEditable
function toHtml(val: string[] | string): string {
  if (Array.isArray(val)) {
    return val
      .map((p) => {
        let trimmed = (p || '').trim();
        if (!trimmed) return '';
        // Auto convert any &lt;/br&gt; or </br> to <br>
        trimmed = trimmed
          .replace(/&lt;\/?br\s*\/?&gt;/gi, '<br>')
          .replace(/<\/?br\s*\/?>/gi, '<br>');

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

// Clean junk spans created by browser or copy-paste
function cleanJunkSpans(html: string): string {
  if (!html) return '';
  return html
    .replace(/<span style="[^"]*font-size:\s*1rem;?[^"]*">(.*?)<\/span>/gi, '$1')
    .replace(/<span style="[^"]*color:\s*rgb\(44,\s*40,\s*38\);?[^"]*">(.*?)<\/span>/gi, '$1')
    .replace(/<span style="">(.*?)<\/span>/gi, '$1')
    .replace(/<span>(.*?)<\/span>/gi, '$1');
}

// Convert contentEditable HTML into an array of clean paragraphs
function toParagraphs(html: string): string[] {
  if (!html || !html.trim()) return [];

  const cleaned = cleanJunkSpans(html);
  const temp = document.createElement('div');
  temp.innerHTML = cleaned;

  const result: string[] = [];

  // If top-level contains block elements
  if (temp.children.length > 0) {
    for (let i = 0; i < temp.children.length; i++) {
      const child = temp.children[i];
      const text = child.textContent?.trim();
      const childHtml = child.outerHTML?.trim();
      if (childHtml && (text || child.querySelector('img, hr, audio, br'))) {
        result.push(cleanJunkSpans(childHtml));
      }
    }
  }

  // If editor used single block or free text
  if (result.length === 0) {
    return cleanJunkSpans(html)
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  return result;
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
  const lastHtmlRef = useRef('');

  // Sync incoming value to editor DOM without disturbing the active cursor
  useEffect(() => {
    // If user is actively editing inside the editor, NEVER overwrite DOM innerHTML!
    if (isFocusedRef.current || (editorRef.current && editorRef.current.contains(document.activeElement))) {
      return;
    }

    const nextHtml = toHtml(value);
    if (nextHtml === lastHtmlRef.current) {
      return;
    }

    if (editorRef.current && editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
      lastHtmlRef.current = nextHtml;
    }
    setCodeValue(nextHtml);
  }, [value]);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (text) {
      document.execCommand('insertText', false, text);
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
        editorRef.current.innerHTML = cleanJunkSpans(editorRef.current.innerHTML);
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
    setCodeValue(html);
    const paragraphs = toParagraphs(html);
    onChange(paragraphs);
  };

  // Only normalize literal typed </br> when the user finishes and clicks away
  const handleBlur = () => {
    isFocusedRef.current = false;
    if (!editorRef.current) return;
    let html = editorRef.current.innerHTML;
    if (/&lt;\/?br\s*\/?&gt;/i.test(html) || /<\/br>/i.test(html)) {
      html = html
        .replace(/&lt;\/?br\s*\/?&gt;/gi, '<br>')
        .replace(/<\/br>/gi, '<br>');
      editorRef.current.innerHTML = html;
      lastHtmlRef.current = html;
      setCodeValue(html);
      onChange(toParagraphs(html));
    }
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
      editorRef.current.innerHTML = val;
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

  // Helper to wrap selected text in custom CSS style
  const applyCustomStyle = (property: string, styleValue: string) => {
    if (isCodeView) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      if (property === 'font-family') {
        exec('fontName', styleValue);
      }
      return;
    }

    const range = selection.getRangeAt(0);
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
  const paragraphCount = Array.isArray(value) ? value.length : toParagraphs(codeValue).length;

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
              setCodeValue(editorRef.current?.innerHTML || '');
            } else {
              if (editorRef.current) {
                editorRef.current.innerHTML = codeValue;
                lastHtmlRef.current = codeValue;
              }
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
          className={`p-4 text-lg font-serif leading-relaxed text-foreground focus:outline-none story-rich-content whitespace-pre-line ${
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
