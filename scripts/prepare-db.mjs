import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

if (!fs.existsSync(schemaPath)) {
  console.error('[prepare-db] prisma/schema.prisma not found.');
  process.exit(1);
}

let schema = fs.readFileSync(schemaPath, 'utf8');
const databaseUrl = process.env.DATABASE_URL || '';
const isPostgres =
  databaseUrl.startsWith('postgresql://') ||
  databaseUrl.startsWith('postgres://') ||
  process.env.DB_PROVIDER === 'postgresql';

if (isPostgres) {
  console.log('[prepare-db] PostgreSQL connection detected. Configuring schema for PostgreSQL...');
  schema = schema.replace(
    /datasource\s+db\s+\{[\s\S]*?\}/,
    'datasource db {\n  provider =  "postgresql"\n  url      = env("DATABASE_URL")\n}'
  );
} else {
  console.log('[prepare-db] Local SQLite mode. Configuring schema for SQLite (file:./dev.db)...');
  schema = schema.replace(
    /datasource\s+db\s+\{[\s\S]*?\}/,
    'datasource db {\n  provider = "sqlite"\n  url      = \"file:./dev.db\"\n}'
  );
}

fs.writeFileSync(schemaPath, schema, 'utf8');

try {
  if (isPostgres) {
    console.log('[prepare-db] Syncing schema to PostgreSQL database...');
    try {
      execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit' });
      console.log('[prepare-db] Database schema sync complete.');
    } catch (syncError) {
      console.warn('[prepare-db] Notice: db push warning (continuing):', syncError.message);
    }
  }

  console.log('[prepare-db] Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('[prepare-db] Prisma Client generation complete.');
} catch (error) {
  console.error('[prepare-db] Error generating Prisma Client:', error);
  process.exit(1);
}