import 'dotenv/config';
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3000);

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const app = createApp();

app.listen(port, () => {
  console.log(`Khyora API listening on port ${port}`);
});
