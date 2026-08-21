import app from '../server/server.js';
import { initDatabase } from '../server/db.js';

let dbInitialized = false;

export default async function handler(req, res) {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (err) {
      console.error("Serverless DB init error:", err);
    }
  }
  return app(req, res);
}
