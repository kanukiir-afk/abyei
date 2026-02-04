Backend README

Run locally:

1. Install deps

```bash
cd apps/backend
npm install
```

2. Generate Prisma client

```bash
npx prisma generate
```

3. Provide `DATABASE_URL` and `JWT_SECRET` in .env

4. Run migrations (requires a configured PostgreSQL):

```bash
npx prisma migrate dev --name init
```

5. Start server

```bash
npm run dev
```

Tests

```bash
npm test
```

Notes:
- If Prisma CLI complains about schema location, run `npx prisma generate --schema ../../prisma/schema.prisma`.
- Uploaded files are saved to `/home/pc/south-project/uploads` when running locally.
