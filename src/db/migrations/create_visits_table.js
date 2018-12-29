import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const CREATE_VISITS = `
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
  CREATE TABLE IF NOT EXISTS "visits" (
      "visit_id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      "user_id"  text NOT NULL,
      "name"     text NOT NULL,
  
      "created_at" timestamp NOT NULL DEFAULT (now() at time zone 'UTC')
  );`;

(async () => {
  const client = await pool.connect();
  try {
    await client.query(CREATE_VISITS);
  } finally {
    client.release();
  }
})().catch(e => console.log(e.stack)); // eslint-disable-line no-console
