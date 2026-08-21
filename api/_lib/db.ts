import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
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
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255),
      type VARCHAR(100),
      size VARCHAR(50),
      download_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await db.query(createTablesSql);
}
