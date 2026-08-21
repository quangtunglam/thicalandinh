import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbPool, initDatabaseSchema } from './_lib/db';
import { INITIAL_POEMS } from './_lib/seedData';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = getDbPool();

  try {
    if (db) {
      await initDatabaseSchema();
    }

    if (req.method === 'GET') {
      if (db) {
        const result = await db.query('SELECT * FROM poems ORDER BY created_at DESC');
        if (result.rows.length === 0) {
          // Auto-seed if empty
          for (const poem of INITIAL_POEMS) {
            await db.query(
              `INSERT INTO poems (id, slug, title, author, category, period, img, featured_quote, verses, original_text, translation, explanation, tags)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
               ON CONFLICT (id) DO NOTHING`,
              [
                poem.id,
                poem.slug,
                poem.title,
                poem.author,
                poem.category,
                poem.period,
                poem.img,
                poem.featured_quote,
                JSON.stringify(poem.verses),
                JSON.stringify(poem.original_text || []),
                JSON.stringify(poem.translation || []),
                poem.explanation,
                JSON.stringify(poem.tags || [])
              ]
            );
          }
          const seeded = await db.query('SELECT * FROM poems ORDER BY created_at DESC');
          return res.status(200).json(seeded.rows);
        }
        return res.status(200).json(result.rows);
      } else {
        // In-memory fallback
        return res.status(200).json(INITIAL_POEMS);
      }
    }

    if (req.method === 'POST') {
      const authHeader = req.headers.authorization;
      const adminPass = process.env.ADMIN_PASSWORD || 'thicalandinh2026';
      if (authHeader !== `Bearer ${adminPass}`) {
        return res.status(401).json({ error: 'Không có quyền truy cập. Vui lòng đăng nhập Admin!' });
      }

      const body = req.body;
      const id = body.id || 'poem-' + Date.now();
      const slug = body.slug || id;

      if (db) {
        await db.query(
          `INSERT INTO poems (id, slug, title, author, category, period, img, featured_quote, verses, original_text, translation, explanation, tags)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             author = EXCLUDED.author,
             category = EXCLUDED.category,
             period = EXCLUDED.period,
             img = EXCLUDED.img,
             featured_quote = EXCLUDED.featured_quote,
             verses = EXCLUDED.verses,
             original_text = EXCLUDED.original_text,
             translation = EXCLUDED.translation,
             explanation = EXCLUDED.explanation,
             tags = EXCLUDED.tags,
             updated_at = CURRENT_TIMESTAMP`,
          [
            id,
            slug,
            body.title,
            body.author,
            body.category,
            body.period || '',
            body.img || '/assets/article_1-Bnc_y2PA.jpg',
            body.featured_quote || body.verses?.[0] || '',
            JSON.stringify(body.verses || []),
            JSON.stringify(body.original_text || []),
            JSON.stringify(body.translation || []),
            body.explanation || '',
            JSON.stringify(body.tags || [])
          ]
        );
      }

      return res.status(201).json({ success: true, id, message: 'Đăng bài thơ thành công!' });
    }

    if (req.method === 'DELETE') {
      const authHeader = req.headers.authorization;
      const adminPass = process.env.ADMIN_PASSWORD || 'thicalandinh2026';
      if (authHeader !== `Bearer ${adminPass}`) {
        return res.status(401).json({ error: 'Không có quyền truy cập.' });
      }

      const { id } = req.query;
      if (db && id) {
        await db.query('DELETE FROM poems WHERE id = $1', [id]);
      }
      return res.status(200).json({ success: true, message: 'Đã xóa bài thơ!' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Lỗi máy chủ' });
  }
}
