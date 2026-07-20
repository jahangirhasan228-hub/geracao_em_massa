import "dotenv/config";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "../config/env.js";
import { createDbClient } from "./client.js";

const env = parseEnv(process.env);
const db = createDbClient(env);
const rootDir = join(fileURLToPath(new URL("../..", import.meta.url)));
const migrationPath = join(rootDir, "db/migrations/001_initial_schema.sql");
const sql = await readFile(migrationPath, "utf8");

await db.batch(
  sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean)
    .map((statement) => ({ sql: statement, args: [] })),
  "write"
);

await db.execute({
  sql: "INSERT OR IGNORE INTO schema_migrations (version) VALUES (?)",
  args: ["001_initial_schema"]
});

console.log("Applied migration 001_initial_schema");
