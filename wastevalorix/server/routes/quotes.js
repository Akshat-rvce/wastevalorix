import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// GET all quotes
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM quote_requests ORDER BY id DESC');
    const quotes = stmt.all();
    res.json(quotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// POST new quote request
router.post('/', (req, res) => {
  try {
    const data = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO quote_requests (
        timestamp, analysis_id, buyer_name, buyer_location, waste_type,
        quantity_kg, quoted_price_min, quoted_price_max, requester_name,
        requester_phone, pickup_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      new Date().toISOString(),
      data.analysisId || null,
      data.buyerName || 'Unknown Buyer',
      data.buyerLocation || '',
      data.wasteType || '',
      data.quantityKg || 0,
      data.quotedPriceMin || 0,
      data.quotedPriceMax || 0,
      data.requesterName || '',
      data.requesterPhone || '',
      data.pickupDate || '',
      data.status || 'pending'
    );
    
    res.status(201).json({ id: result.lastInsertRowid, ...data, status: 'pending' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create quote request' });
  }
});

// PATCH update status
router.patch('/:id', (req, res) => {
  try {
    const { status } = req.body;
    const stmt = db.prepare('UPDATE quote_requests SET status = ? WHERE id = ?');
    stmt.run(status, req.params.id);
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

export default router;
