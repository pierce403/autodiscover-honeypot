# Autodiscover migration

This preserves an existing owned research application. Do not add domains whose
ownership is unverified, broaden capture scope, collect real credentials for tests,
or expose stored credential material. Production remains READ_ONLY until historical
storage and collection scope are verified. The original DATABASE_URL2 is retained;
timeouts do not prove empty data. No empty production database replacement.

The dump endpoint requires a separate owner token, responses never cache and raw
Authorization headers/values never go to logs. Staging uses synthetic credential
fixtures in its own D1 database; no production secrets or historic data. Native main
builds own publishing, with Cloudflare credentials held there and previews disabled.
Preserve original master a7955a81843c602143dd73f3259af9af1eb39e65 and source slug.
