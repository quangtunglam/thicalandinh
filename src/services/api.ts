import { POEMS, Poem } from '@/data/poems';
import { STORIES, Story } from '@/data/stories';
import { SCHOLARS, Scholar } from '@/data/scholars';

const STORAGE_KEYS = {
  POEMS: 'tcd_poems_v1',
  STORIES: 'tcd_stories_v1',
  SCHOLARS: 'tcd_scholars_v1',
  AUTH_TOKEN: 'tcd_admin_token',
};

// API Base URL - relative /api in production on Vercel
const API_BASE = '/api';

export const apiService = {
  // --- AUTHENTICATION ---
  async loginAdmin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        return { success: true, token: data.token };
      }
      return { success: false, error: data.error || 'Sai mật khẩu!' };
    } catch {
      // Offline / Local fallback check
      if (password === 'thicalandinh2026' || password === 'admin123') {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'local-admin-token');
        return { success: true, token: 'local-admin-token' };
      }
      return { success: false, error: 'Mật khẩu quản trị không đúng (Mặc định: thicalandinh2026)' };
    }
  },

  isAdminLoggedIn(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
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
          // Normalize fields if from PostgreSQL
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
    } catch {
      // Fallback
    }

    // LocalStorage / static fallback
    const local = localStorage.getItem(STORAGE_KEYS.POEMS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return POEMS;
  },

  async savePoem(poem: Poem): Promise<boolean> {
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
        // Also update local cache
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

    // Save locally if API is offline
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
    const current = await this.getScholars();
    const filtered = current.filter(s => s.slug !== slug);
    localStorage.setItem(STORAGE_KEYS.SCHOLARS, JSON.stringify(filtered));
    return true;
  },

  // Reset to default data
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.POEMS);
    localStorage.removeItem(STORAGE_KEYS.STORIES);
    localStorage.removeItem(STORAGE_KEYS.SCHOLARS);
  }
};
