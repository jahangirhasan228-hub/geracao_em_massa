import { createClient } from "@libsql/client";
import type { AppEnv } from "../config/env.js";

export function createDbClient(env: Pick<AppEnv, "tursoDatabaseUrl" | "tursoAuthToken">) {
  return createClient({
    url: env.tursoDatabaseUrl,
    authToken: env.tursoAuthToken
  });
}
