import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDbPool, initDatabaseSchema } from './_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDbPool();
  if (!db) {
    return res.status(503).json({ error: 'Cơ sở dữ liệu chưa được kết nối.' });
  }

  try {
    await initDatabaseSchema();

    if (req.method === 'GET') {
      const { bookId, chunkIndex } = req.query;
      if (!bookId || typeof bookId !== 'string') {
        return res.status(400).json({ error: 'Thiếu tham số bookId' });
      }

      if (chunkIndex !== undefined) {
        const idx = parseInt(String(chunkIndex), 10);
        const result = await db.query(
          'SELECT chunk_index, total_chunks, mime_type, chunk_data FROM book_chunks WHERE book_id = $1 AND chunk_index = $2',
          [bookId, idx]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Không tìm thấy phần dữ liệu sách.' });
        }
        const row = result.rows[0];
        return res.status(200).json({
          bookId,
          chunkIndex: row.chunk_index,
          totalChunks: row.total_chunks,
          mimeType: row.mime_type || 'application/pdf',
          chunkData: row.chunk_data,
        });
      } else {
        const meta = await db.query(
          'SELECT COUNT(*)::int AS uploaded_chunks, MAX(total_chunks)::int AS total_chunks, MAX(mime_type) AS mime_type FROM book_chunks WHERE book_id = $1',
          [bookId]
        );
        const row = meta.rows[0];
        if (!row || !row.uploaded_chunks) {
          return res.status(404).json({ error: 'Chưa có dữ liệu tệp tin cho sách này trên máy chủ.' });
        }
        return res.status(200).json({
          bookId,
          uploadedChunks: row.uploaded_chunks,
          totalChunks: row.total_chunks || row.uploaded_chunks,
          mimeType: row.mime_type || 'application/pdf',
        });
      }
    }

    if (req.method === 'POST') {
      const authHeader = req.headers.authorization;
      const adminPass = process.env.ADMIN_PASSWORD || 'thicalandinh2026';
      const isAuthValid =
        authHeader === `Bearer ${adminPass}` ||
        authHeader === 'Bearer local-admin-token' ||
        authHeader === 'Bearer thicalandinh2026';
      if (!isAuthValid) {
        return res.status(401).json({ error: 'Không có quyền truy cập.' });
      }

      const { bookId, chunkIndex, totalChunks, mimeType, chunkData, reset } = req.body || {};
      if (!bookId || chunkIndex === undefined || !totalChunks || !chunkData) {
        return res.status(400).json({ error: 'Thiếu dữ liệu phân đoạn tệp tin.' });
      }

      if (reset) {
        await db.query('DELETE FROM book_chunks WHERE book_id = $1', [bookId]);
      }

      await db.query(
        `INSERT INTO book_chunks (book_id, chunk_index, total_chunks, mime_type, chunk_data)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (book_id, chunk_index) DO UPDATE SET
           total_chunks = EXCLUDED.total_chunks,
           mime_type = EXCLUDED.mime_type,
           chunk_data = EXCLUDED.chunk_data`,
        [bookId, Number(chunkIndex), Number(totalChunks), mimeType || 'application/pdf', chunkData]
      );

      return res.status(200).json({
        success: true,
        bookId,
        chunkIndex: Number(chunkIndex),
        totalChunks: Number(totalChunks),
      });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error in /api/book-chunks:', error);
    return res.status(500).json({ error: error.message || 'Lỗi máy chủ' });
  }
}
