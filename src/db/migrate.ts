import "dotenv/config"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { db, client } from "./index"
 
await migrate(db, { migrationsFolder: "./drizzle" })
 
await client.end()