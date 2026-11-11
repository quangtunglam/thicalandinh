import pg from 'pg';
const { Pool } = pg;

let pool: any = null;

export function getDbPool(): any {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING;
  if (!connectionString) {
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    });
    pool.on('error', (err) => {
      console.error('Unexpected error on idle pg client', err);
    });
  }
  return pool;
}

export async function initDatabaseSchema() {
  const db = getDbPool();
  if (!db) return;

  const createTablesSql = `
    CREATE TABLE IF NOT EXISTS poems (
      id VARCHAR(255) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      period VARCHAR(100),
      img TEXT,
      featured_quote TEXT,
      verses JSONB NOT NULL,
      original_text JSONB,
      translation JSONB,
      explanation TEXT,
      tags JSONB,
      youtube_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stories (
      id VARCHAR(255) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255),
      theme VARCHAR(100),
      img TEXT,
      summary TEXT,
      content JSONB NOT NULL,
      moral TEXT,
      audio_vi TEXT,
      audio_cs TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scholars (
      id VARCHAR(255) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      title VARCHAR(255),
      era VARCHAR(100),
      img TEXT,
      bio TEXT,
      legacy TEXT,
      famous_quote TEXT,
      works JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS library (
      id VARCHAR(255) PRIMARY KEY,
      slug VARCHAR(255),
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255),
      type VARCHAR(100),
      size VARCHAR(50),
      img TEXT,
      description TEXT,
      download_url TEXT,
      file_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS book_chunks (
      book_id VARCHAR(255) NOT NULL,
      chunk_index INT NOT NULL,
      total_chunks INT NOT NULL,
      mime_type VARCHAR(100) DEFAULT 'application/pdf',
      chunk_data TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (book_id, chunk_index)
    );
  `;

  await db.query(createTablesSql);
  // Ensure columns exist if table was already created
  try {
    await db.query(`ALTER TABLE poems ADD COLUMN IF NOT EXISTS youtube_url TEXT;`);
    await db.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS audio_vi TEXT;`);
    await db.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS audio_cs TEXT;`);
    await db.query(`ALTER TABLE library ADD COLUMN IF NOT EXISTS slug VARCHAR(255);`);
    await db.query(`ALTER TABLE library ADD COLUMN IF NOT EXISTS img TEXT;`);
    await db.query(`ALTER TABLE library ADD COLUMN IF NOT EXISTS description TEXT;`);
    await db.query(`ALTER TABLE library ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);`);
  } catch {}
}
