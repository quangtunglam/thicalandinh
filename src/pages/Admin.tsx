import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Poem } from '@/data/poems';
import { Story } from '@/data/stories';
import { Scholar } from '@/data/scholars';
import {
  Lock,
  Plus,
  Trash2,
  Edit,
  Feather,
  BookMarked,
  Users,
  LogOut,
  Check,
  Sparkles,
  Upload,
  RotateCcw,
  User,
  Key,
  ShieldCheck,
  Headphones,
  Volume2
} from 'lucide-react';
import { audioStorage } from '@/services/audioStorage';

// Helper: Compress an uploaded file using an offscreen Canvas
const compressImageFile = (file: File, maxWidth = 900, maxHeight = 900, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(src);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

// Helper: Downscale an existing large base64 image if needed
const compressBase64IfNeeded = async (base64Str: string): Promise<string> => {
  if (!base64Str || !base64Str.startsWith('data:image') || base64Str.length < 90000) {
    return base64Str;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const maxWidth = 900;
      const maxHeight = 900;
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(base64Str);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => resolve(base64Str);
    img.src = base64Str;
  });
};

export const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(apiService.isAdminLoggedIn());
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'poems' | 'stories' | 'scholars'>('poems');

  // Operation states
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Data states
  const [poems, setPoems] = useState<Poem[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [notification, setNotification] = useState('');

  // Modal / Form states
  const [poemModalOpen, setPoemModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [scholarModalOpen, setScholarModalOpen] = useState(false);

  // Form Fields for Poem
  const [poemForm, setPoemForm] = useState<Partial<Poem>>({
    title: '',
    author: '',
    category: 'Đường luật',
    period: '',
    img: '/assets/article_1-Bnc_y2PA.jpg',
    featuredQuote: '',
    verses: [''],
    originalText: [''],
    translation: [''],
    explanation: '',
    tags: ['Thi Ca', 'Kinh điển'],
  });

  // Form Fields for Story
  const [storyForm, setStoryForm] = useState<Partial<Story>>({
    title: '',
    subtitle: '',
    theme: 'Điển cố văn học',
    img: '/assets/story_scholars-CtpupIEr.jpg',
    summary: '',
    content: [''],
    moral: '',
    audioVi: '',
    audioCs: '',
  });

  // Form Fields for Scholar
  const [scholarForm, setScholarForm] = useState<Partial<Scholar>>({
    name: '',
    title: '',
    era: '',
    img: '/assets/avatar_1-DuNlxL1Y.jpg',
    bio: '',
    legacy: '',
    famousQuote: '',
    works: [''],
  });

  const loadData = async () => {
    const [p, s, sc] = await Promise.all([
      apiService.getPoems(),
      apiService.getStories(),
      apiService.getScholars(),
    ]);
    setPoems(p);
    setStories(s);
    setScholars(sc);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await apiService.loginAdmin(usernameInput, passwordInput);
    if (res.success) {
      setIsLoggedIn(true);
      showNotify(`Xin chào Quản trị viên ${usernameInput}! Đăng nhập thành công!`);
    } else {
      setLoginError(res.error || 'Tài khoản hoặc mật khẩu không đúng!');
    }
  };

  const handleLogout = () => {
    apiService.logoutAdmin();
    setIsLoggedIn(false);
  };

  // --- SAVE POEM ---
  const handleSavePoem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!poemForm.title?.trim() || !poemForm.author?.trim()) {
      setFormError('Vui lòng nhập đầy đủ Tựa bài thơ và Tác giả!');
      return;
    }

    try {
      setIsSaving(true);
      const finalImg = poemForm.img ? await compressBase64IfNeeded(poemForm.img) : '/assets/article_1-Bnc_y2PA.jpg';

      const newPoem: Poem = {
        id: poemForm.id || 'poem-' + Date.now(),
        slug: poemForm.slug || poemForm.title.toLowerCase().replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s-]/g, '').trim().replace(/\s+/g, '-'),
        title: poemForm.title.trim(),
        author: poemForm.author.trim(),
        category: (poemForm.category as any) || 'Đường luật',
        period: poemForm.period?.trim() || 'Cổ cận đại',
        img: finalImg,
        featuredQuote: poemForm.featuredQuote?.trim() || poemForm.verses?.[0]?.trim() || '',
        verses: (poemForm.verses || []).filter(v => v.trim() !== ''),
        originalText: (poemForm.originalText || []).filter(v => v.trim() !== ''),
        translation: (poemForm.translation || []).filter(v => v.trim() !== ''),
        explanation: poemForm.explanation?.trim() || '',
        tags: poemForm.tags || ['Thi Ca'],
      };

      await apiService.savePoem(newPoem);
      await loadData();
      setPoemModalOpen(false);
      showNotify(`Đã lưu bài thơ "${newPoem.title}" thành công!`);
    } catch (err: any) {
      console.error('Lỗi khi lưu bài thơ:', err);
      setFormError('Có lỗi xảy ra khi lưu: ' + (err?.message || 'Vui lòng thử lại'));
    } finally {
      setIsSaving(false);
    }
  };

  // --- SAVE STORY ---
  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!storyForm.title?.trim()) {
      setFormError('Vui lòng nhập Tựa đề câu chuyện ở đầu biểu mẫu!');
      return;
    }

    try {
      setIsSaving(true);
      const finalImg = storyForm.img ? await compressBase64IfNeeded(storyForm.img) : '/assets/story_scholars-CtpupIEr.jpg';

      const newStory: Story = {
        id: storyForm.id || 'story-' + Date.now(),
        slug: storyForm.slug || storyForm.title.toLowerCase().replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s-]/g, '').trim().replace(/\s+/g, '-'),
        title: storyForm.title.trim(),
        subtitle: storyForm.subtitle?.trim() || '',
        theme: storyForm.theme?.trim() || 'Điển cố',
        img: finalImg,
        summary: storyForm.summary?.trim() || '',
        content: (storyForm.content || []).map(c => c.trim()).filter(c => c !== ''),
        moral: storyForm.moral?.trim() || '',
        audioVi: storyForm.audioVi || '',
        audioCs: storyForm.audioCs || '',
      };

      await apiService.saveStory(newStory);
      await loadData();
      setStoryModalOpen(false);
      showNotify(`Đã lưu câu chuyện "${newStory.title}" thành công!`);
    } catch (err: any) {
      console.error('Lỗi khi lưu câu chuyện:', err);
      setFormError('Có lỗi xảy ra khi lưu: ' + (err?.message || 'Vui lòng kiểm tra lại'));
    } finally {
      setIsSaving(false);
    }
  };

  // --- SAVE SCHOLAR ---
  const handleSaveScholar = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!scholarForm.name?.trim()) {
      setFormError('Vui lòng nhập Họ và tên danh nhân!');
      return;
    }

    try {
      setIsSaving(true);
      const finalImg = scholarForm.img ? await compressBase64IfNeeded(scholarForm.img) : '/assets/avatar_1-DuNlxL1Y.jpg';

      const newScholar: Scholar = {
        id: scholarForm.id !== undefined ? scholarForm.id : Date.now(),
        slug: scholarForm.slug || scholarForm.name.toLowerCase().replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s-]/g, '').trim().replace(/\s+/g, '-'),
        name: scholarForm.name.trim(),
        title: scholarForm.title?.trim() || '',
        era: scholarForm.era?.trim() || '',
        img: finalImg,
        bio: scholarForm.bio?.trim() || '',
        legacy: scholarForm.legacy?.trim() || '',
        famousQuote: scholarForm.famousQuote?.trim() || '',
        works: (scholarForm.works || []).filter(w => w.trim() !== ''),
      };

      await apiService.saveScholar(newScholar);
      await loadData();
      setScholarModalOpen(false);
      showNotify(`Đã lưu hồ sơ danh nhân "${newScholar.name}" thành công!`);
    } catch (err: any) {
      console.error('Lỗi khi lưu danh nhân:', err);
      setFormError('Có lỗi xảy ra khi lưu: ' + (err?.message || 'Vui lòng kiểm tra lại'));
    } finally {
      setIsSaving(false);
    }
  };

  // --- DELETE HANDLERS ---
  const handleDeletePoem = async (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài thơ "${title}"?`)) {
      await apiService.deletePoem(id);
      await loadData();
      showNotify(`Đã xóa bài thơ "${title}"`);
    }
  };

  const handleDeleteStory = async (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      await apiService.deleteStory(id);
      await loadData();
      showNotify(`Đã xóa bài viết "${title}"`);
    }
  };

  const handleDeleteScholar = async (slug: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh nhân "${name}"?`)) {
      await apiService.deleteScholar(slug);
      await loadData();
      showNotify(`Đã xóa danh nhân "${name}"`);
    }
  };

  // Reset demo data
  const handleResetData = async () => {
    if (confirm('Khôi phục toàn bộ dữ liệu mặc định ban đầu của Thi Ca Lan Đình?')) {
      apiService.resetAllData();
      await loadData();
      showNotify('Đã khôi phục dữ liệu gốc thành công!');
    }
  };

  // --- IMAGE UPLOAD HELPER ---
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'poem' | 'story' | 'scholar') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress and downscale uploaded image file using Canvas to optimize storage
        const base64 = await compressImageFile(file, 900, 900, 0.82);
        if (target === 'poem') setPoemForm(prev => ({ ...prev, img: base64 }));
        if (target === 'story') setStoryForm(prev => ({ ...prev, img: base64 }));
        if (target === 'scholar') setScholarForm(prev => ({ ...prev, img: base64 }));
        showNotify('Đã tải và tối ưu hóa ảnh thành công!');
      } catch (err) {
        console.error('Lỗi khi xử lý ảnh:', err);
        showNotify('Không thể xử lý ảnh. Vui lòng thử lại!');
      }
    }
  };

  // --- AUDIO UPLOAD HELPER ---
  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>, lang: 'vi' | 'cs') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes('audio') && !file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
        showNotify('Vui lòng chọn file âm thanh định dạng MP3, M4A hoặc WAV!');
        return;
      }
      try {
        const key = `idb:audio_${lang}_${Date.now()}`;
        // Store in IndexedDB for fast local playback
        await audioStorage.saveAudio(key, file);

        // If file is small (< 3.5MB), also read as base64 data URL so it can be saved in backend
        if (file.size < 3.5 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            if (lang === 'vi') setStoryForm(prev => ({ ...prev, audioVi: base64 }));
            if (lang === 'cs') setStoryForm(prev => ({ ...prev, audioCs: base64 }));
            showNotify(`Đã tải bản đọc ${lang === 'vi' ? 'Tiếng Việt' : 'Tiếng Séc'} thành công!`);
          };
          reader.readAsDataURL(file);
        } else {
          if (lang === 'vi') setStoryForm(prev => ({ ...prev, audioVi: key }));
          if (lang === 'cs') setStoryForm(prev => ({ ...prev, audioCs: key }));
          showNotify(`Đã lưu file âm thanh (${(file.size / 1024 / 1024).toFixed(1)}MB) thành công!`);
        }
      } catch (err) {
        console.error('Lỗi khi tải file âm thanh:', err);
        showNotify('Không thể tải file âm thanh. Vui lòng thử lại!');
      }
    }
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="bg-card border border-border p-8 md:p-10 rounded-xl max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Đăng Nhập Quản Trị</h1>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Khu vực dành riêng cho Quản trị viên (Admin) để đăng bài thơ, câu chuyện và quản lý nội dung website.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground/80 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" /> Tài khoản Quản trị
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Tên tài khoản (mặc định: admin)..."
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground/80 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-primary" /> Mật khẩu Quản trị
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Nhập mật khẩu quản trị..."
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
              />
              <p className="text-[11px] text-foreground/50 mt-1.5 italic">
                * Tài khoản mặc định: <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary">admin</code> / Mật khẩu: <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary">thicalandinh2026</code>
              </p>
            </div>

            {loginError && (
              <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-200 animate-in fade-in">
                ⚠️ {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-all uppercase tracking-widest text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Đăng Nhập Hệ Thống
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DASHBOARD MAIN
  // -------------------------------------------------------------
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 md:px-8">
      {/* Top Bar */}
      <div className="bg-card border border-border p-6 rounded-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-foreground">Bảng Điều Khiển Quản Trị</h1>
              <span className="text-[11px] font-semibold bg-primary/15 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                👤 {apiService.getAdminUsername()}
              </span>
            </div>
            <p className="text-xs text-foreground/60">Hệ thống quản lý nội dung độc quyền của Quản trị viên</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 text-xs bg-muted hover:bg-muted/80 text-foreground px-3.5 py-2 rounded transition-colors"
            title="Khôi phục dữ liệu mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Khôi phục gốc
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium px-4 py-2 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="mb-6 p-4 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 text-sm shadow-md animate-in slide-in-from-top">
          <Check className="w-4 h-4" /> {notification}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1 font-bold">Tổng số Thi Ca</p>
            <h3 className="font-serif text-3xl font-bold text-primary">{poems.length} bài thơ</h3>
          </div>
          <Feather className="w-8 h-8 text-primary/30" />
        </div>

        <div className="bg-card border border-border p-6 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1 font-bold">Cổ Tích & Điển Cố</p>
            <h3 className="font-serif text-3xl font-bold text-primary">{stories.length} câu chuyện</h3>
          </div>
          <BookMarked className="w-8 h-8 text-primary/30" />
        </div>

        <div className="bg-card border border-border p-6 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1 font-bold">Danh Nhân</p>
            <h3 className="font-serif text-3xl font-bold text-primary">{scholars.length} bậc hiền tài</h3>
          </div>
          <Users className="w-8 h-8 text-primary/30" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8 gap-4">
        <button
          onClick={() => setActiveTab('poems')}
          className={`pb-3 font-serif text-base font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'poems' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <Feather className="w-4 h-4" /> Quản Lý Thi Ca ({poems.length})
        </button>
        <button
          onClick={() => setActiveTab('stories')}
          className={`pb-3 font-serif text-base font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'stories' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <BookMarked className="w-4 h-4" /> Cổ Tích & Điển Cố ({stories.length})
        </button>
        <button
          onClick={() => setActiveTab('scholars')}
          className={`pb-3 font-serif text-base font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'scholars' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" /> Danh Nhân ({scholars.length})
        </button>
      </div>

      {/* ----------------- TAB 1: POEMS ----------------- */}
      {activeTab === 'poems' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold">Danh Sách Bài Thơ</h2>
            <button
              onClick={() => {
                setFormError('');
                setPoemForm({
                  title: '',
                  author: '',
                  category: 'Đường luật',
                  period: '',
                  img: '/assets/article_1-Bnc_y2PA.jpg',
                  featuredQuote: '',
                  verses: [''],
                  originalText: [''],
                  translation: [''],
                  explanation: '',
                  tags: ['Thi Ca'],
                });
                setPoemModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded hover:bg-primary/90 transition-colors uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" /> Đăng Bài Thơ Mới
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="divide-y divide-border">
              {poems.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={p.img} alt={p.title} className="w-14 h-14 rounded object-cover border border-border" />
                    <div>
                      <h4 className="font-serif font-bold text-lg text-foreground">{p.title}</h4>
                      <p className="text-xs text-foreground/60 font-serif italic">— {p.author} • Thể loại: {p.category}</p>
                      <p className="text-xs text-foreground/50 mt-1 line-clamp-1">{p.verses[0]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setFormError('');
                        setPoemForm(p);
                        setPoemModalOpen(true);
                      }}
                      className="p-2 hover:bg-muted rounded text-foreground/70 hover:text-primary transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePoem(p.id, p.title)}
                      className="p-2 hover:bg-red-50 rounded text-foreground/70 hover:text-red-600 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: STORIES ----------------- */}
      {activeTab === 'stories' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold">Danh Sách Cổ Tích & Điển Cố</h2>
            <button
              onClick={() => {
                setFormError('');
                setStoryForm({
                  title: '',
                  subtitle: '',
                  theme: 'Điển cố văn học',
                  img: '/assets/story_scholars-CtpupIEr.jpg',
                  summary: '',
                  content: [''],
                  moral: '',
                  audioVi: '',
                  audioCs: '',
                });
                setStoryModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded hover:bg-primary/90 transition-colors uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" /> Đăng Bài Viết Mới
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="divide-y divide-border">
              {stories.map((st) => (
                <div key={st.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={st.img} alt={st.title} className="w-16 h-12 rounded object-cover border border-border" />
                    <div>
                      <h4 className="font-serif font-bold text-lg text-foreground">{st.title}</h4>
                      <p className="text-xs text-primary font-medium">{st.theme} • "{st.subtitle}"</p>
                      <p className="text-xs text-foreground/60 line-clamp-1 mt-0.5">{st.summary}</p>
                      {(st.audioVi || st.audioCs) && (
                        <div className="flex items-center gap-2 mt-1.5">
                          {st.audioVi && (
                            <span className="text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                              <Volume2 className="w-3 h-3" /> 🇻🇳 MP3 Việt
                            </span>
                          )}
                          {st.audioCs && (
                            <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                              <Volume2 className="w-3 h-3" /> 🇨🇿 MP3 Séc
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setFormError('');
                        setStoryForm(st);
                        setStoryModalOpen(true);
                      }}
                      className="p-2 hover:bg-muted rounded text-foreground/70 hover:text-primary transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStory(st.id, st.title)}
                      className="p-2 hover:bg-red-50 rounded text-foreground/70 hover:text-red-600 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 3: SCHOLARS ----------------- */}
      {activeTab === 'scholars' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold">Danh Sách Danh Nhân</h2>
            <button
              onClick={() => {
                setFormError('');
                setScholarForm({
                  name: '',
                  title: '',
                  era: '',
                  img: '/assets/avatar_1-DuNlxL1Y.jpg',
                  bio: '',
                  legacy: '',
                  famousQuote: '',
                  works: [''],
                });
                setScholarModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded hover:bg-primary/90 transition-colors uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" /> Thêm Danh Nhân Mới
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {scholars.map((sc) => (
              <div key={sc.slug} className="bg-card border border-border p-4 rounded-lg text-center relative group">
                <img src={sc.img} alt={sc.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-border" />
                <h4 className="font-serif font-bold text-lg">{sc.name}</h4>
                <p className="text-xs text-primary font-medium mb-1">{sc.era}</p>
                <p className="text-xs text-foreground/60 line-clamp-2 mb-4">{sc.title}</p>
                <div className="flex justify-center gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => {
                      setFormError('');
                      setScholarForm(sc);
                      setScholarModalOpen(true);
                    }}
                    className="p-1.5 hover:bg-muted rounded text-xs text-foreground/80 flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteScholar(sc.slug, sc.name)}
                    className="p-1.5 hover:bg-red-50 text-red-600 rounded text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ĐĂNG / SỬA BÀI THƠ */}
      {/* ------------------------------------------------------------- */}
      {poemModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-border bg-background flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-foreground">
                {poemForm.id ? 'Chỉnh Sửa Bài Thơ' : 'Đăng Bài Thơ Mới'}
              </h3>
              <button onClick={() => setPoemModalOpen(false)} className="text-foreground/60 hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleSavePoem} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Tựa bài thơ *</label>
                  <input
                    type="text"
                    required
                    value={poemForm.title || ''}
                    onChange={(e) => setPoemForm({ ...poemForm, title: e.target.value })}
                    placeholder="VD: Côn Sơn Ca"
                    className="w-full bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Tác giả *</label>
                  <input
                    type="text"
                    required
                    value={poemForm.author || ''}
                    onChange={(e) => setPoemForm({ ...poemForm, author: e.target.value })}
                    placeholder="VD: Nguyễn Trãi"
                    className="w-full bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Thể loại</label>
                  <select
                    value={poemForm.category || 'Đường luật'}
                    onChange={(e) => setPoemForm({ ...poemForm, category: e.target.value as any })}
                    className="w-full bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Đường luật">Đường luật (Thất ngôn bát cú / Tứ tuyệt)</option>
                    <option value="Lục bát">Lục bát</option>
                    <option value="Song thất lục bát">Song thất lục bát</option>
                    <option value="Thơ cổ phong">Thơ cổ phong</option>
                    <option value="Thơ hiện đại">Thơ hiện đại</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Thời kỳ / Triều đại</label>
                  <input
                    type="text"
                    value={poemForm.period || ''}
                    onChange={(e) => setPoemForm({ ...poemForm, period: e.target.value })}
                    placeholder="VD: Thế kỷ XV (Thời Hậu Lê)"
                    className="w-full bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Hình ảnh bìa bài thơ</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={poemForm.img || ''}
                    onChange={(e) => setPoemForm({ ...poemForm, img: e.target.value })}
                    placeholder="Đường dẫn ảnh hoặc tải lên từ máy tính..."
                    className="flex-1 bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <label className="cursor-pointer bg-muted hover:bg-muted/80 px-3 py-2 rounded text-xs font-medium flex items-center gap-1.5 text-foreground">
                    <Upload className="w-3.5 h-3.5" /> Tải ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, 'poem')}
                    />
                  </label>
                </div>
              </div>

              {/* Verses */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1">
                  Nội dung bài thơ (Nhập từng câu trên một dòng) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={(poemForm.verses || []).join('\n')}
                  onChange={(e) => setPoemForm({ ...poemForm, verses: e.target.value.split('\n') })}
                  placeholder="Dòng 1&#10;Dòng 2&#10;Dòng 3..."
                  className="w-full bg-background border border-border rounded p-3 text-sm font-serif italic focus:outline-none focus:border-primary leading-relaxed"
                />
              </div>

              {/* Original Han-Nom */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1">
                  Nguyên tác chữ Hán / Nôm (Tùy chọn)
                </label>
                <textarea
                  rows={3}
                  value={(poemForm.originalText || []).join('\n')}
                  onChange={(e) => setPoemForm({ ...poemForm, originalText: e.target.value.split('\n') })}
                  placeholder="Nhập nguyên tác chữ Hán/Nôm nếu có..."
                  className="w-full bg-background border border-border rounded p-3 text-sm font-serif focus:outline-none focus:border-primary"
                />
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Lời bình & Phân tích nghệ thuật</label>
                <textarea
                  rows={3}
                  value={poemForm.explanation || ''}
                  onChange={(e) => setPoemForm({ ...poemForm, explanation: e.target.value })}
                  placeholder="Ý nghĩa, hoàn cảnh sáng tác và giá trị nghệ thuật..."
                  className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded flex items-center gap-2">
                  <span>⚠️</span> <span>{formError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPoemModalOpen(false);
                    setFormError('');
                  }}
                  className="px-4 py-2 text-xs uppercase tracking-wider bg-muted rounded hover:bg-muted/80"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 text-xs uppercase tracking-wider bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu Bài Thơ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ĐĂNG / SỬA BÀI VIẾT CỔ TÍCH & ĐIỂN CỐ */}
      {/* ------------------------------------------------------------- */}
      {storyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-border bg-background flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-foreground">
                {storyForm.id ? 'Chỉnh Sửa Bài Viết' : 'Đăng Bài Viết Điển Cố Mới'}
              </h3>
              <button onClick={() => setStoryModalOpen(false)} className="text-foreground/60 hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleSaveStory} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Tựa đề câu chuyện *</label>
                <input
                  type="text"
                  required
                  value={storyForm.title || ''}
                  onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                  placeholder="VD: Ngu Công Dời Núi"
                  className="w-full bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Chủ đề / Thể loại</label>
                  <input
                    type="text"
                    value={storyForm.theme || ''}
                    onChange={(e) => setStoryForm({ ...storyForm, theme: e.target.value })}
                    placeholder="VD: Ý chí kiên định"
                    className="w-full bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Câu hỏi gợi mở / Phụ đề</label>
                  <input
                    type="text"
                    value={storyForm.subtitle || ''}
                    onChange={(e) => setStoryForm({ ...storyForm, subtitle: e.target.value })}
                    placeholder='VD: "Ý chí có thể dời non lấp biển?"'
                    className="w-full bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Hình ảnh minh họa</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={storyForm.img || ''}
                    onChange={(e) => setStoryForm({ ...storyForm, img: e.target.value })}
                    placeholder="URL ảnh hoặc tải lên..."
                    className="flex-1 bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <label className="cursor-pointer bg-muted hover:bg-muted/80 px-3 py-2 rounded text-xs font-medium flex items-center gap-1.5 text-foreground">
                    <Upload className="w-3.5 h-3.5" /> Tải ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, 'story')}
                    />
                  </label>
                </div>
              </div>

              {/* Audio MP3 Attachments: Vietnamese and Czech */}
              <div className="p-4 bg-muted/40 border border-primary/20 rounded-lg space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                    <Headphones className="w-4 h-4" /> Đính Kèm Bản Đọc Âm Thanh (Audio MP3)
                  </div>
                  <p className="text-[11px] text-foreground/60 leading-relaxed">
                    Đính kèm file âm thanh MP3 diễn đọc câu chuyện bằng <strong>Tiếng Việt</strong> và <strong>Tiếng Séc (Čeština)</strong>. Có thể dán link URL trực tiếp (từ Google Drive, Dropbox, Cloudinary, lưu trữ web) hoặc tải file MP3 từ máy tính.
                  </p>
                </div>

                {/* Vietnamese Audio */}
                <div className="space-y-1.5 p-3 bg-background/80 rounded border border-border">
                  <div className="flex items-center justify-between text-xs font-bold uppercase">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <span>🇻🇳</span> Bản đọc Tiếng Việt (MP3)
                    </span>
                    {storyForm.audioVi && (
                      <button
                        type="button"
                        onClick={() => setStoryForm({ ...storyForm, audioVi: '' })}
                        className="text-[11px] text-red-600 hover:underline lowercase font-normal"
                      >
                        ✕ gỡ bỏ file
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={storyForm.audioVi || ''}
                      onChange={(e) => setStoryForm({ ...storyForm, audioVi: e.target.value })}
                      placeholder="Dán link URL file MP3 Tiếng Việt (https://... hoặc /audio/...) hoặc bấm Tải file..."
                      className="flex-1 bg-background border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-primary"
                    />
                    <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-2 rounded text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Tải file MP3
                      <input
                        type="file"
                        accept="audio/*,.mp3,.m4a,.wav,.ogg"
                        className="hidden"
                        onChange={(e) => handleAudioFileChange(e, 'vi')}
                      />
                    </label>
                  </div>
                  {storyForm.audioVi && (
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-[11px] text-foreground/60 shrink-0">Nghe thử:</span>
                      <audio controls src={storyForm.audioVi} className="w-full h-8" />
                    </div>
                  )}
                </div>

                {/* Czech Audio */}
                <div className="space-y-1.5 p-3 bg-background/80 rounded border border-border">
                  <div className="flex items-center justify-between text-xs font-bold uppercase">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <span>🇨🇿</span> Bản đọc Tiếng Séc / Čeština (MP3)
                    </span>
                    {storyForm.audioCs && (
                      <button
                        type="button"
                        onClick={() => setStoryForm({ ...storyForm, audioCs: '' })}
                        className="text-[11px] text-red-600 hover:underline lowercase font-normal"
                      >
                        ✕ gỡ bỏ file
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={storyForm.audioCs || ''}
                      onChange={(e) => setStoryForm({ ...storyForm, audioCs: e.target.value })}
                      placeholder="Dán link URL file MP3 Tiếng Séc hoặc bấm Tải file..."
                      className="flex-1 bg-background border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-primary"
                    />
                    <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-2 rounded text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Tải file MP3
                      <input
                        type="file"
                        accept="audio/*,.mp3,.m4a,.wav,.ogg"
                        className="hidden"
                        onChange={(e) => handleAudioFileChange(e, 'cs')}
                      />
                    </label>
                  </div>
                  {storyForm.audioCs && (
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-[11px] text-foreground/60 shrink-0">Nghe thử:</span>
                      <audio controls src={storyForm.audioCs} className="w-full h-8" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Tóm tắt ngắn</label>
                <textarea
                  rows={2}
                  value={storyForm.summary || ''}
                  onChange={(e) => setStoryForm({ ...storyForm, summary: e.target.value })}
                  placeholder="Tóm tắt nội dung chính trong 2-3 câu..."
                  className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Toàn văn câu chuyện (Mỗi đoạn cách nhau một dòng trống)</label>
                <textarea
                  rows={8}
                  value={(storyForm.content || []).join('\n\n')}
                  onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value.split('\n\n') })}
                  placeholder="Đoạn 1...&#10;&#10;Đoạn 2...&#10;&#10;Đoạn 3..."
                  className="w-full bg-background border border-border rounded p-3 text-sm font-serif focus:outline-none focus:border-primary leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Bài học nhân sinh đúc kết</label>
                <textarea
                  rows={2}
                  value={storyForm.moral || ''}
                  onChange={(e) => setStoryForm({ ...storyForm, moral: e.target.value })}
                  placeholder="Ý nghĩa và bài học đạo đức..."
                  className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded flex items-center gap-2">
                  <span>⚠️</span> <span>{formError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStoryModalOpen(false);
                    setFormError('');
                  }}
                  className="px-4 py-2 text-xs uppercase tracking-wider bg-muted rounded hover:bg-muted/80"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 text-xs uppercase tracking-wider bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu Bài Viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ĐĂNG / SỬA DANH NHÂN */}
      {/* ------------------------------------------------------------- */}
      {scholarModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-border bg-background flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-foreground">
                {scholarForm.id !== undefined ? 'Chỉnh Sửa Danh Nhân' : 'Thêm Danh Nhân Mới'}
              </h3>
              <button onClick={() => setScholarModalOpen(false)} className="text-foreground/60 hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleSaveScholar} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Họ và tên danh nhân *</label>
                  <input
                    type="text"
                    required
                    value={scholarForm.name || ''}
                    onChange={(e) => setScholarForm({ ...scholarForm, name: e.target.value })}
                    placeholder="VD: Cao Bá Quát"
                    className="w-full bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Thời đại / Năm sinh mất</label>
                  <input
                    type="text"
                    value={scholarForm.era || ''}
                    onChange={(e) => setScholarForm({ ...scholarForm, era: e.target.value })}
                    placeholder="VD: 1809 – 1855 (Thời Nguyễn)"
                    className="w-full bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Danh xưng / Tước hiệu</label>
                <input
                  type="text"
                  value={scholarForm.title || ''}
                  onChange={(e) => setScholarForm({ ...scholarForm, title: e.target.value })}
                  placeholder="VD: Thánh Quát — Danh sĩ lỗi lạc thời Nguyễn"
                  className="w-full bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Chân dung / Ảnh đại diện</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={scholarForm.img || ''}
                    onChange={(e) => setScholarForm({ ...scholarForm, img: e.target.value })}
                    placeholder="URL ảnh..."
                    className="flex-1 bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <label className="cursor-pointer bg-muted hover:bg-muted/80 px-3 py-2 rounded text-xs font-medium flex items-center gap-1.5 text-foreground">
                    <Upload className="w-3.5 h-3.5" /> Tải ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, 'scholar')}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Tiểu sử & Cuộc đời</label>
                <textarea
                  rows={4}
                  value={scholarForm.bio || ''}
                  onChange={(e) => setScholarForm({ ...scholarForm, bio: e.target.value })}
                  placeholder="Cuộc đời, chí hướng và hành trạng..."
                  className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Câu nói bất hủ / Danh ngôn</label>
                <input
                  type="text"
                  value={scholarForm.famousQuote || ''}
                  onChange={(e) => setScholarForm({ ...scholarForm, famousQuote: e.target.value })}
                  placeholder="VD: Nhất sinh đê thủ bái hoa mai..."
                  className="w-full bg-background border border-border rounded px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded flex items-center gap-2">
                  <span>⚠️</span> <span>{formError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setScholarModalOpen(false);
                    setFormError('');
                  }}
                  className="px-4 py-2 text-xs uppercase tracking-wider bg-muted rounded hover:bg-muted/80"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 text-xs uppercase tracking-wider bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu Danh Nhân'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
