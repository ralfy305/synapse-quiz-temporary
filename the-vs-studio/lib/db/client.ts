import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import * as schema from "./schema";
import path from "path";
import os from "os";
import fs from "fs";

// We intentionally keep manual path resolution here for the synchronous server-side
// DB initialization. The new lib/tauri.ts provides the single source of truth
// for Tauri detection and will be used more heavily in client code and async contexts.

/**
* Get the proper user data directory for storing the database.
* This is critical for distribution as a real desktop app with an installer.
*
* - Development: Uses a local `data/` folder (easy to find)
* - Packaged (Tauri/Electron/etc.): Uses the OS standard user data location
*/
function getDatabasePath(): string {
    const isTauriPackaged =
        (typeof process !== 'undefined' && (process.env.TAURI_ENV || process.env.TAURI)) ||
        process.env.NODE_ENV === 'production';

    if (!isTauriPackaged) {
        // Development: keep it simple and local (works for both web dev and tauri:dev)
        const devDir = path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
        if (!fs.existsSync(devDir)) {
            fs.mkdirSync(devDir, { recursive: true });
        }
        return path.join(devDir, "synapse.db");
    }

    // === Packaged Tauri mode ===
    // 1. Highest priority: Rust sidecar injected the exact directory via env var.
    const injected = process.env.TAURI_APPDATA_DIR;
    if (injected) {
        const dir = path.join(injected, "Project Synapse");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        return path.join(dir, "synapse.db");
    }

    // 2. Use the centralized Tauri utility (will try @tauri-apps/api/path when possible).
    // Note: Because this function is synchronous and may run in the Next server process,
    // we fall back to the well-known OS paths when the async API is not immediately usable.
    // The utility still gives us a single place to evolve this logic.
    // For now we keep the proven manual resolution that matches Tauri's conventions.

    const appName = "Project Synapse";
    let userDataDir: string;

    switch (process.platform) {
        case "win32":

         userDataDir = path.join(
          process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"),
          appName
         );
         break;
        case "darwin":
         userDataDir = path.join(
          os.homedir(),
          "Library",
          "Application Support",
          appName
         );
         break;
        default: // Linux
         userDataDir = path.join(
          process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share"),
          appName.toLowerCase().replace(/\s+/g, "-")
         );
         break;
    }

    if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, { recursive: true });
    }

    return path.join(userDataDir, "synapse.db");
}

let _db: ReturnType<typeof drizzle> | null = null;

/**
* Creates a SQLite database connection.
* Uses the correct location depending on whether the app is running
* in development or as a packaged desktop application.
*/
export function createSqliteDb(customPath?: string) {
    const dbPath = customPath || getDatabasePath();
    const sqlite = new Database(dbPath);

    // Good defaults for desktop apps
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");

    const drizzleDb = drizzle(sqlite, { schema });

    // Ensure tables exist (simple approach for desktop apps)
    ensureTablesExist(sqlite);

    return drizzleDb;
}

function ensureTablesExist(sqlite: Database.Database) {
    // Create tables if they don't exist. This is simple and reliable for SQLite desktop apps.
    // For more advanced migrations later we can use drizzle-kit.
    sqlite.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE,
          first_name TEXT,
          last_name TEXT,
          profile_image_url TEXT,
          created_at INTEGER DEFAULT (unixepoch()),
          updated_at INTEGER DEFAULT (unixepoch())
        );

        CREATE TABLE IF NOT EXISTS couples (
          id TEXT PRIMARY KEY,
          invite_code TEXT NOT NULL UNIQUE,
          partner1_id TEXT REFERENCES users(id),
          partner2_id TEXT REFERENCES users(id),
          status TEXT NOT NULL DEFAULT 'pending',
          created_at INTEGER DEFAULT (unixepoch())
        );

        CREATE TABLE IF NOT EXISTS quiz_responses (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id),
          module_id TEXT NOT NULL,
          question_id TEXT NOT NULL,
          answer TEXT NOT NULL,
          created_at INTEGER DEFAULT (unixepoch()),
          updated_at INTEGER DEFAULT (unixepoch())
        );

        CREATE TABLE IF NOT EXISTS airlock_messages (
          id TEXT PRIMARY KEY,
          couple_id TEXT REFERENCES couples(id),
          sender_id TEXT REFERENCES users(id),
          sender_type TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at INTEGER DEFAULT (unixepoch())
        );

        INSERT OR IGNORE INTO users (id, email, first_name, last_name)
        VALUES ('local-user', 'local@synapse.local', 'Local', 'User');
    `);
}

/** Returns the singleton DB instance (creates it on first call if needed). */
export function getDb() {
    if (!_db) {
        _db = createSqliteDb();
    }

    return _db;
}

// Do not create a default database at module load time.
// Import getDb() inside server actions, API routes, or server-only utilities
// so static pages do not pull SQLite into the build trace.
