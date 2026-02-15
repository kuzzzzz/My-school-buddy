import { Pool } from 'pg';
import { env } from './env';

export const pgPool = env.postgresUrl
  ? new Pool({ connectionString: env.postgresUrl, ssl: { rejectUnauthorized: false } })
  : null;
