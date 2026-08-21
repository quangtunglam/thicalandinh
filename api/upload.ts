import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { imageBase64, filename } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ error: 'Dữ liệu ảnh không hợp lệ!' });
    }

    // In serverless, returns the base64 data URL directly or uploaded URL
    return res.status(200).json({
      success: true,
      url: imageBase64,
      filename: filename || 'uploaded_image.jpg',
      message: 'Tải ảnh lên thành công!'
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
