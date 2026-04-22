import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// GET all analyses
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM analyses ORDER BY id DESC');
    const analyses = stmt.all();
    
    // Parse JSON fields back to objects/arrays
    const formatted = analyses.map(row => ({
      ...row,
      tips: row.tips ? JSON.parse(row.tips) : [],
      buyers: row.buyers_json ? JSON.parse(row.buyers_json) : [],
      processingSteps: row.processing_steps ? JSON.parse(row.processing_steps) : []
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// GET stats
router.get('/stats', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        SUM(quantity_kg) as totalKg,
        SUM(quantity_kg * kwh_per_kg) as totalKwh,
        SUM(quantity_kg * co2_per_kg) as totalCo2,
        SUM(quantity_kg * market_value_per_kg) as totalValue,
        COUNT(*) as count
      FROM analyses
    `);
    const stats = stmt.get();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET single analysis
router.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM analyses WHERE id = ?');
    const row = stmt.get(req.params.id);
    
    if (!row) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    res.json({
      ...row,
      tips: row.tips ? JSON.parse(row.tips) : [],
      buyers: row.buyers_json ? JSON.parse(row.buyers_json) : [],
      processingSteps: row.processing_steps ? JSON.parse(row.processing_steps) : []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

// POST new analysis
router.post('/', (req, res) => {
  try {
    const data = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO analyses (
        timestamp, waste_type, broad_category, specific_subtype, category,
        method, kwh_per_kg, co2_per_kg, quantity_kg, market_value_per_kg,
        market_demand, confidence, emoji, efficiency, description,
        image_thumbnail, tips, buyers_json, processing_steps
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      new Date().toISOString(),
      data.wasteType || data.waste_type || 'Unknown',
      data.broadCategory || null,
      data.specificSubtype || null,
      data.category || '',
      data.method || '',
      data.kwhPerKg || data.kwh_per_kg || 0,
      data.co2PerKg || data.co2_per_kg || 0,
      data.quantity || data.quantity_kg || 0,
      data.marketValuePerKg || 0,
      data.marketDemand || 'Medium',
      data.confidence || 0,
      data.emoji || '♻️',
      data.efficiency || 0,
      data.description || '',
      data.imageThumbnail || data.image_thumbnail || null, // expects pre-compressed base64
      JSON.stringify(data.tips || []),
      JSON.stringify(data.buyers || []),
      JSON.stringify(data.processingSteps || data.processing_steps || [])
    );
    
    res.status(201).json({ id: result.lastInsertRowid, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create analysis entry' });
  }
});

// DELETE single analysis
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM analyses WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// DELETE all
router.delete('/', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM analyses');
    stmt.run();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

export default router;
