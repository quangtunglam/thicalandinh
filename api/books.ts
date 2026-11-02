import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbPool, initDatabaseSchema } from './_lib/db.js';
import { INITIAL_BOOKS } from './_lib/seedData.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const db = getDbPool();
      if (db) {
        await initDatabaseSchema();
        const result = await db.query('SELECT * FROM library ORDER BY created_at DESC');
        if (result.rows.length === 0) {
          for (const b of INITIAL_BOOKS) {
            await db.query(
              `INSERT INTO library (id, slug, title, author, type, size, img, description, download_url, file_name)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
               ON CONFLICT (id) DO NOTHING`,
              [b.id, b.slug, b.title, b.author, b.type, b.size, b.img || '', b.description || '', b.fileUrl || '', b.fileName || '']
            );
          }
          const seeded = await db.query('SELECT * FROM library ORDER BY created_at DESC');
          return res.status(200).json(seeded.rows.map((r: any) => ({
            id: r.id,
            slug: r.slug || r.id,
            title: r.title,
            author: r.author || '',
            type: r.type || 'Thư tịch cổ',
            size: r.size || '',
            img: r.img || '/assets/article_1-Bnc_y2PA.jpg',
            description: r.description || '',
            fileUrl: r.download_url || r.fileUrl || '',
            fileName: r.file_name || r.fileName || ''
          })));
        }
        return res.status(200).json(result.rows.map((r: any) => ({
          id: r.id,
          slug: r.slug || r.id,
          title: r.title,
          author: r.author || '',
          type: r.type || 'Thư tịch cổ',
          size: r.size || '',
          img: r.img || '/assets/article_1-Bnc_y2PA.jpg',
          description: r.description || '',
          fileUrl: r.download_url || r.fileUrl || '',
          fileName: r.file_name || r.fileName || ''
        })));
      }
    } catch (err) {
      console.warn('DB error in GET /api/books, falling back to INITIAL_BOOKS:', err);
    }
    return res.status(200).json(INITIAL_BOOKS);
  }

  const db = getDbPool();

  try {
    if (db) await initDatabaseSchema();

    if (req.method === 'POST') {
      const authHeader = req.headers.authorization;
      const adminPass = process.env.ADMIN_PASSWORD || 'thicalandinh2026';
      const isAuthValid = authHeader === `Bearer ${adminPass}` || authHeader === 'Bearer local-admin-token' || authHeader === 'Bearer thicalandinh2026';
      if (!isAuthValid) {
        return res.status(401).json({ error: 'Không có quyền truy cập.' });
      }

      const body = req.body;
      const id = body.id || 'book-' + Date.now();
      const slug = body.slug || id;

      if (db) {
        await db.query(
          `INSERT INTO library (id, slug, title, author, type, size, img, description, download_url, file_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO UPDATE SET
             slug = EXCLUDED.slug,
             title = EXCLUDED.title,
             author = EXCLUDED.author,
             type = EXCLUDED.type,
             size = EXCLUDED.size,
             img = EXCLUDED.img,
             description = EXCLUDED.description,
             download_url = EXCLUDED.download_url,
             file_name = EXCLUDED.file_name`,
          [
            id,
            slug,
            body.title,
            body.author || '',
            body.type || 'Thư tịch cổ',
            body.size || '',
            body.img || '/assets/article_1-Bnc_y2PA.jpg',
            body.description || '',
            body.fileUrl || body.download_url || '',
            body.fileName || body.file_name || ''
          ]
        );
      }

      return res.status(201).json({ success: true, id, message: 'Lưu sách thành công!' });
    }

    if (req.method === 'DELETE') {
      const authHeader = req.headers.authorization;
      const adminPass = process.env.ADMIN_PASSWORD || 'thicalandinh2026';
      const isAuthValid = authHeader === `Bearer ${adminPass}` || authHeader === 'Bearer local-admin-token' || authHeader === 'Bearer thicalandinh2026';
      if (!isAuthValid) {
        return res.status(401).json({ error: 'Không có quyền truy cập.' });
      }

      const { id } = req.query;
      if (db && id) {
        await db.query('DELETE FROM library WHERE id = $1', [id]);
      }
      return res.status(200).json({ success: true, message: 'Đã xóa sách khỏi thư viện!' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error in /api/books:', error);
    return res.status(500).json({ error: error.message || 'Lỗi máy chủ' });
  }
}
