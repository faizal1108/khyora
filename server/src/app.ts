import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { scansRouter } from './routes/scans.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '7mb' }));

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  const scanLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/scans', scanLimiter, scansRouter);

  app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err && typeof err === 'object' && 'type' in err && err.type === 'entity.too.large') {
      res.status(413).json({ error: 'Image is too large.' });
      return;
    }
    next(err);
  });

  return app;
}
