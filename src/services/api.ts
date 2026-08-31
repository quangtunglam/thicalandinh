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
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'local-admin-token');
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, username);
        return { success: true, token: 'local-admin-token' };
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
      const res = await fetch(`${API_BASE}/poems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'thicalandinh2026'}`,
        },
        body: JSON.stringify(poem),
      });
      if (res.ok) {
        const current = await this.getPoems();
        const existingIdx = current.findIndex(p => p.id === poem.id);
        if (existingIdx >= 0) {
          current[existingIdx] = poem;
        } else {
          current.unshift(poem);
        }
        localStorage.setItem(STORAGE_KEYS.POEMS, JSON.stringify(current));
        return true;
      }
    } catch {}

    const current = await this.getPoems();
    const existingIdx = current.findIndex(p => p.id === poem.id);
    if (existingIdx >= 0) {
      current[existingIdx] = poem;
    } else {
      current.unshift(poem);
    }
    localStorage.setItem(STORAGE_KEYS.POEMS, JSON.stringify(current));
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
          'Authorization': `Bearer ${token || 'thicalandinh2026'}`,
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
    try {
      const res = await fetch(`${API_BASE}/stories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((s: any) => ({
            id: s.id,
            slug: s.slug || s.id,
            title: s.title,
            subtitle: s.subtitle || '',
            theme: s.theme || 'Điển cố văn học',
            img: s.img || '/assets/story_scholars-CtpupIEr.jpg',
            summary: s.summary || '',
            content: Array.isArray(s.content) ? s.content : (typeof s.content === 'string' ? JSON.parse(s.content) : []),
            moral: s.moral || '',
          }));
        }
      }
    } catch {}

    const local = localStorage.getItem(STORAGE_KEYS.STORIES);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return STORIES;
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
          'Authorization': `Bearer ${token || 'thicalandinh2026'}`,
        },
        body: JSON.stringify(story),
      });
    } catch {}

    const current = await this.getStories();
    const existingIdx = current.findIndex(s => s.id === story.id);
    if (existingIdx >= 0) {
      current[existingIdx] = story;
    } else {
      current.unshift(story);
    }
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(current));
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
          'Authorization': `Bearer ${token || 'thicalandinh2026'}`,
        },
      });
    } catch {}

    const current = await this.getStories();
    const filtered = current.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(filtered));
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
    localStorage.setItem(STORAGE_KEYS.SCHOLARS, JSON.stringify(current));
    return true;
  },

  async deleteScholar(slug: string): Promise<boolean> {
    if (!this.isAdminLoggedIn()) {
      throw new Error('Chỉ có Quản trị viên (Admin) mới có quyền quản lý danh nhân!');
    }

    const current = await this.getScholars();
    const filtered = current.filter(s => s.slug !== slug);
    localStorage.setItem(STORAGE_KEYS.SCHOLARS, JSON.stringify(filtered));
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
