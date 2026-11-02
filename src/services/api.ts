import { POEMS, Poem } from '@/data/poems';
import { STORIES, Story } from '@/data/stories';
import { SCHOLARS, Scholar } from '@/data/scholars';

const STORAGE_KEYS = {
  POEMS: 'tcd_poems_v1',
  STORIES: 'tcd_stories_v1',
  SCHOLARS: 'tcd_scholars_v1',
  AUTH_TOKEN: 'tcd_admin_token',
  AUTH_USER: 'tcd_admin_username',
};

// API Base URL - relative /api in production on Vercel
const API_BASE = '/api';

function safeSetStorage(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`LocalStorage quota exceeded for ${key}. Compacting data...`, err);
    try {
      if (Array.isArray(data)) {
        // Strip heavy base64 strings from older items if quota exceeded
        const compacted = data.map((item, idx) => {
          if (idx > 2 && item.img && item.img.startsWith('data:image')) {
            return { ...item, img: '/assets/story_scholars-CtpupIEr.jpg' };
          }
          return item;
        });
        localStorage.setItem(key, JSON.stringify(compacted));
      }
    } catch (e2) {
      console.error('Failed to save to localStorage even after compaction:', e2);
    }
  }
}

function cleanStories(list: Story[]): Story[] {
  const filtered = list.filter(s => {
    if (!s || !s.title) return false;
    if (s.id === 'tam-va-cam' && (s.img?.includes('story_scholars') || s.theme === 'Cổ tích dân gian Việt Nam')) {
      return false;
    }
    return true;
  });

  const normalize = (str: string) =>
    (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '');

  const result: Story[] = [];
  for (const s of filtered) {
    const normTitle = normalize(s.title);
    const existingIdx = result.findIndex(
      r => r.id === s.id || r.slug === s.slug || (normTitle && normalize(r.title) === normTitle)
    );
    if (existingIdx === -1) {
      result.push(s);
    } else {
      const existing = result[existingIdx];
      const sHasCustomImg = s.img && !s.img.includes('story_scholars');
      const existingHasCustomImg = existing.img && !existing.img.includes('story_scholars');
      if (sHasCustomImg && !existingHasCustomImg) {
        result[existingIdx] = s;
      } else if ((s.content?.length || 0) > (existing.content?.length || 0)) {
        result[existingIdx] = s;
      }
    }
  }
  return result;
}

export const apiService = {
  // --- AUTHENTICATION ---
  async loginAdmin(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, data.username || username);
        return { success: true, token: data.token };
      }
      return { success: false, error: data.error || 'Sai tài khoản hoặc mật khẩu!' };
    } catch {
      // Offline / Local fallback check
      const validUser = username.trim().toLowerCase() === 'admin';
      const validPass = password === 'thicalandinh2026' || password === 'admin123';
      if (validUser && validPass) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'thicalandinh2026');
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, username);
        return { success: true, token: 'thicalandinh2026' };
      }
      return {
        success: false,
        error: !validUser ? 'Tài khoản quản trị là: admin' : 'Mật khẩu quản trị không đúng (Mặc định: thicalandinh2026)'
      };
    }
  },

  isAdminLoggedIn(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  getAdminUsername(): string {
    return localStorage.getItem(STORAGE_KEYS.AUTH_USER) || 'Admin';
  },

  logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },

  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // --- POEMS CRUD ---
  async getPoems(): Promise<Poem[]> {
    try {
      const res = await fetch(`${API_BASE}/poems`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const normalized: Poem[] = data.map((p: any) => ({
            id: p.id,
            slug: p.slug || p.id,
            title: p.title,
            author: p.author,
            category: p.category,
            period: p.period || '',
            img: p.img || '/assets/article_1-Bnc_y2PA.jpg',
            featuredQuote: p.featured_quote || p.featuredQuote || (Array.isArray(p.verses) ? p.verses[0] : ''),
            verses: Array.isArray(p.verses) ? p.verses : (typeof p.verses === 'string' ? JSON.parse(p.verses) : []),
            originalText: p.original_text ? (Array.isArray(p.original_text) ? p.original_text : JSON.parse(p.original_text)) : undefined,
            translation: p.translation ? (Array.isArray(p.translation) ? p.translation : JSON.parse(p.translation)) : undefined,
            explanation: p.explanation || '',
            tags: Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags) : []),
          }));
          return normalized;
        }
      }
    } catch {}

    const local = localStorage.getItem(STORAGE_KEYS.POEMS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return POEMS;
  },

  async savePoem(poem: Poem): Promise<boolean> {
    if (!this.isAdminLoggedIn()) {
      throw new Error('Chỉ có Quản trị viên (Admin) mới có quyền đăng hoặc sửa bài thơ!');
    }

    const token = this.getAuthToken();
    try {
      await fetch(`${API_BASE}/poems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(!token || token === 'local-admin-token') ? 'thicalandinh2026' : token}`,
        },
        body: JSON.stringify(poem),
      });
    } catch (err) {
      console.warn('Network error saving to /api/poems, saving to local cache:', err);
    }

    const current = await this.getPoems();
    const existingIdx = current.findIndex(p => p.id === poem.id);
    if (existingIdx >= 0) {
      current[existingIdx] = poem;
    } else {
      current.unshift(poem);
    }
    safeSetStorage(STORAGE_KEYS.POEMS, current);
    return true;
  },

  async deletePoem(id: string): Promise<boolean> {
    if (!this.isAdminLoggedIn()) {
      throw new Error('Chỉ có Quản trị viên (Admin) mới có quyền xóa bài thơ!');
    }

    const token = this.getAuthToken();
    try {
      await fetch(`${API_BASE}/poems?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(!token || token === 'local-admin-token') ? 'thicalandinh2026' : token}`,
        },
      });
    } catch {}

    const current = await this.getPoems();
    const filtered = current.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.POEMS, JSON.stringify(filtered));
    return true;
  },

  // --- STORIES CRUD ---
  async getStories(): Promise<Story[]> {
    let serverStories: Story[] = [];

    try {
      const res = await fetch(`${API_BASE}/stories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          serverStories = data.map((s: any) => ({
            id: s.id,
            slug: s.slug || s.id,
            title: s.title,
            subtitle: s.subtitle || '',
            theme: s.theme || 'Điển cố văn học',
            img: s.img || '/assets/story_scholars-CtpupIEr.jpg',
            summary: s.summary || '',
            content: Array.isArray(s.content) ? s.content : (typeof s.content === 'string' ? JSON.parse(s.content) : []),
            moral: s.moral || '',
            audioVi: s.audioVi || s.audio_vi || '',
            audioCs: s.audioCs || s.audio_cs || '',
          }));
          const cleaned = cleanStories(serverStories);
          safeSetStorage(STORAGE_KEYS.STORIES, cleaned);
          return cleaned;
        }
      }
    } catch {}

    const local = localStorage.getItem(STORAGE_KEYS.STORIES);
    if (local) {
      try {
        const parsed: Story[] = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = cleanStories(parsed);
          safeSetStorage(STORAGE_KEYS.STORIES, cleaned);
          return cleaned;
        }
      } catch {}
    }

    const fallback = cleanStories(STORIES);
    safeSetStorage(STORAGE_KEYS.STORIES, fallback);
    return fallback;
  },

  async saveStory(story: Story): Promise<boolean> {
    if (!this.isAdminLoggedIn()) {
      throw new Error('Chỉ có Quản trị viên (Admin) mới có quyền đăng hoặc sửa bài viết!');
    }

    const token = this.getAuthToken();
    try {
      await fetch(`${API_BASE}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(!token || token === 'local-admin-token') ? 'thicalandinh2026' : token}`,
        },
        body: JSON.stringify(story),
      });
    } catch (err) {
      console.warn('Network request to /api/stories failed, saving to local cache:', err);
    }

    const current = await this.getStories();
    const existingIdx = current.findIndex(s => s.id === story.id || s.slug === story.slug);
    if (existingIdx >= 0) {
      current[existingIdx] = story;
    } else {
      current.unshift(story);
    }
    const cleaned = cleanStories(current);
    safeSetStorage(STORAGE_KEYS.STORIES, cleaned);
    return true;
  },

  async deleteStory(id: string): Promise<boolean> {
    if (!this.isAdminLoggedIn()) {
      throw new Error('Chỉ có Quản trị viên (Admin) mới có quyền xóa bài viết!');
    }

    const token = this.getAuthToken();
    try {
      await fetch(`${API_BASE}/stories?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(!token || token === 'local-admin-token') ? 'thicalandinh2026' : token}`,
        },
      });
    } catch {}

    const current = await this.getStories();
    const filtered = current.filter(s => s.id !== id && s.slug !== id);
    const cleaned = cleanStories(filtered);
    safeSetStorage(STORAGE_KEYS.STORIES, cleaned);
    return true;
  },

  // --- SCHOLARS CRUD ---
  async getScholars(): Promise<Scholar[]> {
    const local = localStorage.getItem(STORAGE_KEYS.SCHOLARS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return SCHOLARS;
  },

  async saveScholar(scholar: Scholar): Promise<boolean> {
    if (!this.isAdminLoggedIn()) {
      throw new Error('Chỉ có Quản trị viên (Admin) mới có quyền quản lý danh nhân!');
    }

    const current = await this.getScholars();
    const existingIdx = current.findIndex(s => s.slug === scholar.slug);
    if (existingIdx >= 0) {
      current[existingIdx] = scholar;
    } else {
      current.push(scholar);
    }
    safeSetStorage(STORAGE_KEYS.SCHOLARS, current);
    return true;
  },

  async deleteScholar(slug: string): Promise<boolean> {
    if (!this.isAdminLoggedIn()) {
      throw new Error('Chỉ có Quản trị viên (Admin) mới có quyền quản lý danh nhân!');
    }

    const current = await this.getScholars();
    const filtered = current.filter(s => s.slug !== slug);
    safeSetStorage(STORAGE_KEYS.SCHOLARS, filtered);
    return true;
  },

  // Reset to default data
  resetAllData() {
    if (!this.isAdminLoggedIn()) {
      throw new Error('Chỉ có Quản trị viên (Admin) mới có quyền khôi phục dữ liệu!');
    }
    localStorage.removeItem(STORAGE_KEYS.POEMS);
    localStorage.removeItem(STORAGE_KEYS.STORIES);
    localStorage.removeItem(STORAGE_KEYS.SCHOLARS);
  }
};
