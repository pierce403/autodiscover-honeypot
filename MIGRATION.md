# Autodiscover Cloudflare preparation

Root, favicon, static files, /autodiscover/autodiscover.xml and /dump remain.
The endpoint preserves401 and its Basic challenge. READ_ONLY prevents all capture,
including GET requests with credentials/values, without logging request headers.
The original schema fields and external PostgreSQL destination remain; no production
database/table is created. Source DATABASE_URL2 currently times out, so historical
records remain unrecovered. The source slug/configuration stays available.

The old public credential dump is now owner-only through ADMIN_TOKEN, with no-store
responses and escaped HTML. Form/query values are serialized as ordered pairs;
existing stored rows are left unchanged. Input sizes are bounded to the original
8000-character columns. Staging exercises synthetic credentials in independent D1.
No public domain change, credential capture or production writer cutover is complete.

Native main builds run npm ci, npm run build and npx wrangler deploy --env "".
Previews stay off. The original source commit branch is a recovery source. The three source
custom domains remain untouched because current ownership is unverified.

The owner-approved DATABASE_URL2 identity is now in Cloudflare. Hosting uses the
Worker host while the three custom domains remain unverified and untouched.
Heroku web is stopped; collection stays disabled and owner recovery access is pending.
