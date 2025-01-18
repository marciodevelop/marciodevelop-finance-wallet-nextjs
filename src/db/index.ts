import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = "postgresql://wallet-local:postgres@localhost:5432/wallet-local";
export const client = postgres(connectionString, { max: 1 });
export const db = drizzle(client, { schema });