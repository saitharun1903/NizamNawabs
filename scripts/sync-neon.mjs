import fs from 'fs';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const neonUrl = 'postgresql://neondb_owner:npg_lxdLc4fAEz5F@ep-empty-sun-a5vryuoc-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';

const schema = fs.readFileSync('prisma/schema.prisma', 'utf8').replace(
  /datasource\s+db\s+\{[\s\S]*?\}/,
  `datasource db {\n  provider = "postgresql"\n  url      = "${neonUrl}"\n}`
);

fs.writeFileSync('prisma/test_neon.prisma', schema);

try {
  console.log('Running prisma db push against Neon PostgreSQL...');
  const res = execSync('npx prisma db push --schema=prisma/test_neon.prisma', { encoding: 'utf8' });
  console.log('Result:\n', res);
} catch (e) {
  console.error('Error during db push:');
  console.error(e.stdout || e.message);
} finally {
  if (fs.existsSync('prisma/test_neon.prisma')) {
    fs.unlinkSync('prisma/test_neon.prisma');
  }
}
