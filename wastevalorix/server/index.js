import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import analysesRouter from './routes/analyses.js';
import quotesRouter from './routes/quotes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow all origins for simplicity in full-stack deployment
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for base64 images

// API Routes
app.use('/api/analyses', analysesRouter);
app.use('/api/quotes', quotesRouter);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*splat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  });
}

// Database initialized during routes setup

app.listen(port, () => {
  console.log(`WasteValorix backend server running at http://localhost:${port}`);
});
