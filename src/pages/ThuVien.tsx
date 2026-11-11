import React, { useState, useEffect } from 'react';
import { Download, Library, BookOpen, ExternalLink, FileText, X, Loader2 } from 'lucide-react';
import { BOOKS, Book } from '@/data/books';
import { apiService } from '@/services/api';
import { audioStorage } from '@/services/audioStorage';

function extractGoogleDriveFileId(url: string): string | null {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export const ThuVien: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [previewBook, setPreviewBook] = useState<{ book: Book; url: string } | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [loadingBookId, setLoadingBookId] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    apiService.getBooks().then((loadedBooks) => {
      setBooks(loadedBooks);
      // If admin is logged in and has legacy idb:book_ blobs in this browser, auto-sync to cloud chunks
      if (apiService.isAdminLoggedIn()) {
        for (const bk of loadedBooks) {
          if (bk.fileUrl && bk.fileUrl.startsWith('idb:book_')) {
            audioStorage.getRawBlob(bk.fileUrl).then(async (blob) => {
              if (blob && blob.size > 0) {
                try {
                  const token = apiService.getAuthToken() || 'thicalandinh2026';
                  const chunkedUrl = await audioStorage.uploadBookInChunks(bk.id, blob, token);
                  const updated: Book = { ...bk, fileUrl: chunkedUrl };
                  await apiService.saveBook(updated);
                  setBooks(prev => prev.map(item => item.id === bk.id ? updated : item));
                } catch {}
              }
            });
          }
        }
      }
    }).catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 6000);
  };

  const categories = ['Tất cả', ...Array.from(new Set(books.map(b => b.type).filter(Boolean)))];

  const filteredBooks = selectedCategory === 'Tất cả'
    ? books
    : books.filter(b => b.type === selectedCategory);

  const handleDownloadBook = async (book: Book) => {
    if (!book.fileUrl) {
      showToast(`Tài liệu "${book.title}" hiện đang được số hóa. Quản trị viên có thể tải file PDF lên trong mục Quản Trị!`);
      return;
    }

    // Handle Google Drive links cleanly
    if (book.fileUrl.startsWith('http://') || book.fileUrl.startsWith('https://')) {
      const gdriveId = extractGoogleDriveFileId(book.fileUrl);
      const downloadUrl = gdriveId
        ? `https://drive.google.com/uc?export=download&id=${gdriveId}`
        : book.fileUrl;
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      setLoadingBookId(book.id);
      setLoadingProgress(5);
      const resolvedUrl = await audioStorage.getAudio(
        book.fileUrl,
        (pct) => setLoadingProgress(pct),
        book.id
      );
      setLoadingBookId(null);

      if (!resolvedUrl) {
        if (book.fileUrl.startsWith('idb:book_')) {
          showToast(
            `File "${book.title}" (${book.size}) được tải lên trước bản nâng cấp đám mây nên chưa đồng bộ lên máy chủ. Bạn vui lòng vào Quản Trị -> Thư Viện Sách -> bấm Sửa (✏️) và chọn lại file PDF một lần để đồng bộ!`
          );
        } else {
          showToast('Không tìm thấy tệp tin sách trên máy chủ. Vui lòng tải lại file trong trang Quản Trị.');
        }
        return;
      }

      const link = document.createElement('a');
      link.href = resolvedUrl;
      link.download = book.fileName || `${book.slug || 'tai-lieu-thu-vien'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Đang tải xuống: ${book.fileName || book.title}`);
    } catch {
      setLoadingBookId(null);
      showToast('Có lỗi khi tải sách. Vui lòng thử lại.');
    }
  };

  const handlePreviewBook = async (book: Book) => {
    if (!book.fileUrl) return;

    if (book.fileUrl.startsWith('http://') || book.fileUrl.startsWith('https://')) {
      const gdriveId = extractGoogleDriveFileId(book.fileUrl);
      if (gdriveId) {
        setPreviewBook({
          book,
          url: `https://drive.google.com/file/d/${gdriveId}/preview`,
        });
        return;
      }
      if (book.fileUrl.toLowerCase().endsWith('.pdf')) {
        setPreviewBook({ book, url: book.fileUrl });
        return;
      }
      window.open(book.fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      setLoadingBookId(book.id);
      setLoadingProgress(5);
      const resolvedUrl = await audioStorage.getAudio(
        book.fileUrl,
        (pct) => setLoadingProgress(pct),
        book.id
      );
      setLoadingBookId(null);

      if (!resolvedUrl) {
        if (book.fileUrl.startsWith('idb:book_')) {
          showToast(
            `File "${book.title}" (${book.size}) được tải lên trước bản nâng cấp đám mây nên chưa đồng bộ lên máy chủ. Bạn vui lòng vào Quản Trị -> Thư Viện Sách -> bấm Sửa (✏️) và chọn lại file PDF một lần để đồng bộ!`
          );
        } else {
          showToast('Không thể mở bản xem trước của sách. Vui lòng tải lại file trong trang Quản Trị.');
        }
        return;
      }

      setPreviewBook({ book, url: resolvedUrl });
    } catch {
      setLoadingBookId(null);
      showToast('Không thể mở bản xem trước của sách.');
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-4">
          <Library className="w-3.5 h-3.5" /> Kho Lưu Trữ Số Hóa
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Thư Viện Tài Liệu & Thư Tịch Cổ
        </h1>
        <p className="font-serif text-foreground/70 text-lg leading-relaxed">
          Bộ sưu tập số hóa các trước tác kinh điển, bản dịch Nôm cổ và công trình nghiên cứu văn học có giá trị.
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border text-foreground/70 hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="mb-8 p-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium shadow-md text-center animate-in fade-in leading-relaxed">
          {toastMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBooks.map((book) => {
          const isLoadingThis = loadingBookId === book.id;
          return (
            <div
              key={book.id || book.title}
              className="bg-card border border-border p-6 rounded-lg flex flex-col justify-between hover:border-primary/50 transition-all shadow-sm hover:shadow-md group"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  {book.img ? (
                    <img
                      src={book.img}
                      alt={book.title}
                      loading="lazy"
                      className="w-16 h-22 object-cover rounded border border-border shrink-0 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-16 h-22 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <FileText className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-0.5 rounded-full mb-2 inline-block">
                      {book.type}
                    </span>
                    <h3 className="font-serif font-bold text-xl text-foreground leading-snug group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-foreground/60 font-serif italic mt-1">— {book.author}</p>
                  </div>
                </div>

                {book.description && (
                  <p className="text-xs text-foreground/75 font-serif leading-relaxed mb-4 line-clamp-3">
                    {book.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs gap-2">
                <span className="text-foreground/50 font-medium">{book.size || 'PDF'}</span>
                {isLoadingThis ? (
                  <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải ({loadingProgress}%)...
                  </span>
                ) : (
                  <div className="flex items-center gap-3">
                    {book.fileUrl && (
                      <button
                        onClick={() => handlePreviewBook(book)}
                        className="inline-flex items-center gap-1 text-foreground/70 hover:text-primary font-medium transition-colors"
                        title="Đọc trực tuyến"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Đọc sách
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadBook(book)}
                      className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline"
                    >
                      {book.fileUrl?.startsWith('http') && !extractGoogleDriveFileId(book.fileUrl) ? (
                        <>
                          <ExternalLink className="w-3.5 h-3.5" /> Mở tài liệu
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" /> Tải về PDF
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Online Reader Modal for uploaded PDFs */}
      {previewBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-lg max-w-5xl w-full h-[88vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-3.5 border-b border-border bg-background flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-foreground">{previewBook.book.title}</h3>
                <p className="text-xs text-foreground/60 font-serif italic">— {previewBook.book.author}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadBook(previewBook.book)}
                  className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3.5 py-1.5 rounded text-xs font-semibold hover:bg-primary/90"
                >
                  <Download className="w-3.5 h-3.5" /> Tải xuống
                </button>
                <button
                  onClick={() => setPreviewBook(null)}
                  className="p-1.5 hover:bg-muted rounded text-foreground/60 hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-muted/30">
              <iframe
                src={previewBook.url}
                title={previewBook.book.title}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
