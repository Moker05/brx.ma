# Social Trading API — Quick Test Guide

This file contains quick `curl` examples to exercise the Social Trading endpoints added under `/api/social`.

Base URL
- `http://localhost:5000` (adjust `PORT` if your server runs on a different port)

Authentication
- The API uses Bearer JWT tokens. You can obtain a token from your existing auth endpoints (for example `POST /api/auth/login` returning `{ token: '...' }`).
- Replace `<TOKEN>` in examples below with your token.

Public endpoints

- Get posts (optionally filter by symbol):

```bash
curl "http://localhost:5000/api/social/posts?symbol=BTC&page=1&limit=20"
```

- Get leaderboard:

```bash
curl "http://localhost:5000/api/social/leaderboard"
```

Protected endpoints (require `Authorization: Bearer <TOKEN>`)

- Create a post:

```bash
curl -X POST "http://localhost:5000/api/social/posts" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"BTC","assetType":"CRYPTO","content":"Bullish on BTC at 60k","sentiment":"BULLISH","targetPrice":60000}'
```

- Like a post:

```bash
curl -X POST "http://localhost:5000/api/social/posts/<POST_ID>/like" \
  -H "Authorization: Bearer <TOKEN>"
```

- Create a comment:

```bash
curl -X POST "http://localhost:5000/api/social/posts/<POST_ID>/comments" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Nice idea!"}'
```

- Follow a user (use `UserProfile.id`):

```bash
curl -X POST "http://localhost:5000/api/social/follow/<PROFILE_ID>" \
  -H "Authorization: Bearer <TOKEN>"
```

- Rate a user:

```bash
curl -X POST "http://localhost:5000/api/social/rate/<PROFILE_ID>" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"rating":5, "comment":"Excellent analysis"}'
```

Notes
- Ensure `JWT_SECRET` is set in `server/.env` and that your auth endpoints issue tokens compatible with the `authenticateToken` middleware (token payload should include `userId`).
- Run Prisma migrations locally before hitting endpoints that write to the DB:

```powershell
cd c:\Users\YFA\projets\brx.ma\server
npx prisma generate; npx prisma db push
```

If you want, I can also export a Postman collection JSON — say `oui` and I'll add it to the repo.
