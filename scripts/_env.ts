import fs from "node:fs";
import path from "node:path";

export function loadLocalEnv(): void {
  const envPath = path.resolve(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local not found. Create it from .env.example first.");
  }

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}
