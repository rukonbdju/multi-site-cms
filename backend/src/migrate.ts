import fs from 'fs';
import path from 'path';
import pool from './config/db';

async function ensureMigrationsTable() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      run_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
    const result = await pool.query<{ name: string }>('SELECT name FROM public.migrations');
    return new Set(result.rows.map(r => r.name));
}

async function runMigrations() {
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    const appliedMigrations = await getAppliedMigrations();

    for (const file of files) {
        if (!appliedMigrations.has(file)) {
            console.log(`🚀 Running migration: ${file}`);
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

            try {
                await pool.query('BEGIN');
                await pool.query(sql);
                await pool.query('INSERT INTO migrations(name) VALUES($1)', [file]);
                await pool.query('COMMIT');
                console.log(`✅ Migration applied: ${file}`);
            } catch (err) {
                await pool.query('ROLLBACK');
                console.error(`❌ Migration failed: ${file}`, err);
                process.exit(1);
            }
        } else {
            console.log(`⏭ Skipping already applied migration: ${file}`);
        }
    }

    console.log('🎉 All migrations are up to date');
}

(async () => {
    try {
        await ensureMigrationsTable();
        await runMigrations();
    } finally {
        await pool.end();
    }
})();
