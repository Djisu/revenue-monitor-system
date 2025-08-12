import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

export function loadEnv() {
    dotenv.config();
    
  const env = process.env.NODE_ENV || 'development';
  const envPath = path.resolve(process.cwd(), `backend/.env.${env}`);

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('[ENV] Loaded env from', envPath);
  } else {
    console.warn('[ENV] No .env file found at', envPath);
  }
}
