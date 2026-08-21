import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbPool, initDatabaseSchema } from './_lib/db';
import { INITIAL_STORIES } from './_lib/seedData';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDbPool();

  try {
    if (db) await initDatabaseSchema();

    if (req.method === 'GET') {
      if (db) {
        const result = await db.query('SELECT * FROM stories ORDER BY created_at DESC');
        if (result.rows.length === 0) {
          for (const s of INITIAL_STORIES) {
            await db.query(
              `INSERT INTO stories (id, slug, title, subtitle, theme, img, summary, content, moral)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
               ON CONFLICT (id) DO NOTHING`,
              [s.id, s.slug, s.title, s.subtitle, s.theme, s.img, s.summary, JSON.stringify(s.content), s.moral]
            );
          }
          const seeded = await db.query('SELECT * FROM stories ORDER BY created_at DESC');
          return res.status(200).json(seeded.rows);
        }
        return res.status(200).json(result.rows);
      }
      return res.status(200).json(INITIAL_STORIES);
    }

    if (req.method === 'POST') {
      const authHeader = req.headers.authorization;
      const adminPass = process.env.ADMIN_PASSWORD || 'thicalandinh2026';
      if (authHeader !== `Bearer ${adminPass}`) {
        return res.status(401).json({ error: 'Không có quyền truy cập.' });
      }

      const body = req.body;
      const id = body.id || 'story-' + Date.now();
      const slug = body.slug || id;

      if (db) {
        await db.query(
          `INSERT INTO stories (id, slug, title, subtitle, theme, img, summary, content, moral)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             subtitle = EXCLUDED.subtitle,
             theme = EXCLUDED.theme,
             img = EXCLUDED.img,
             summary = EXCLUDED.summary,
             content = EXCLUDED.content,
             moral = EXCLUDED.moral`,
          [
            id,
            slug,
            body.title,
            body.subtitle || '',
            body.theme || 'Điển cố văn học',
            body.img || '/assets/story_scholars-CtpupIEr.jpg',
            body.summary || '',
            JSON.stringify(body.content || []),
            body.moral || ''
          ]
        );
      }

      return res.status(201).json({ success: true, id, message: 'Đăng câu chuyện thành công!' });
    }

    if (req.method === 'DELETE') {
      const authHeader = req.headers.authorization;
      const adminPass = process.env.ADMIN_PASSWORD || 'thicalandinh2026';
      if (authHeader !== `Bearer ${adminPass}`) {
        return res.status(401).json({ error: 'Không có quyền truy cập.' });
      }

      const { id } = req.query;
      if (db && id) {
        await db.query('DELETE FROM stories WHERE id = $1', [id]);
      }
      return res.status(200).json({ success: true, message: 'Đã xóa bài viết!' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Lỗi máy chủ' });
  }
}
