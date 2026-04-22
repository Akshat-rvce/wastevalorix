import express from 'express';
import cors from 'cors';
import analysesRouter from './routes/analyses.js';
import quotesRouter from './routes/quotes.js';

const app = express();
const port = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow Vite frontend
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for base64 images

// Routes
app.use('/api/analyses', analysesRouter);
app.use('/api/quotes', quotesRouter);

// Database initialized during routes setup

app.listen(port, () => {
  console.log(`WasteValorix backend server running at http://localhost:${port}`);
});
