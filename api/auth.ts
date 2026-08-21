import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { password } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD || 'thicalandinh2026';

    if (password === adminPassword) {
      return res.status(200).json({
        success: true,
        token: adminPassword,
        message: 'Đăng nhập quản trị viên thành công!'
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Mật khẩu quản trị không chính xác!'
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
