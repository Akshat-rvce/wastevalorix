import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create or open the database file
const dbPath = path.resolve(__dirname, 'wastevalorix.db');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database tables
const initDb = () => {
  // Analyses history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      waste_type TEXT NOT NULL,
      broad_category TEXT,
      specific_subtype TEXT,
      category TEXT,
      method TEXT,
      kwh_per_kg REAL,
      co2_per_kg REAL,
      quantity_kg REAL,
      market_value_per_kg REAL,
      market_demand TEXT,
      confidence INTEGER,
      emoji TEXT,
      efficiency INTEGER,
      description TEXT,
      image_thumbnail TEXT,
      tips TEXT,
      buyers_json TEXT,
      processing_steps TEXT
    )
  `);

  // Quote requests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quote_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      analysis_id INTEGER,
      buyer_name TEXT,
      buyer_location TEXT,
      waste_type TEXT,
      quantity_kg REAL,
      quoted_price_min REAL,
      quoted_price_max REAL,
      requester_name TEXT,
      requester_phone TEXT,
      pickup_date TEXT,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (analysis_id) REFERENCES analyses(id)
    )
  `);
};

initDb();

export default db;
