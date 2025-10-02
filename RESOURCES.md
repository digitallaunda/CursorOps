# Discovered Resources

## ✅ Airtable

### Bases
```bash
./scripts/airtable-list-bases.sh
```

**Your bases:**
- `[appiyAPI36T3uCHfj]` MZZI_Digital

### Tables in MZZI_Digital base
```bash
./scripts/airtable-get-schema.sh
```

**Available tables:**
- `[tbl6v2KQdlDPREoU6]` Table 1

**Usage:**
```bash
# Query Table 1
./scripts/airtable-query.sh "Table 1" "" 10

# Create record in Table 1
./scripts/airtable-create.sh "Table 1" '{"Name":"Test"}'
```

---

## ⚠️ Make.com

**Status:** 403 Permission Denied

The API token doesn't have permission to list scenarios.

**Options:**
1. Generate a new API token with "Scenarios - Read" permission
2. Get scenario IDs manually from Make.com dashboard
3. Use webhook URLs instead of API

**Current workaround:**
Get scenario ID from Make.com UI → Settings → General

Then use:
```bash
./scripts/make-run.sh <SCENARIO_ID> '{}'
```

---

## ✅ Apify

**Status:** No actors found

```bash
./scripts/apify-list-actors.sh
# Returns: 0 actors
```

**You have two options:**

### Option 1: Use public actors from Apify Store
Browse: https://apify.com/store

Popular actors:
- `apify/web-scraper` - General web scraping
- `apify/google-search-scraper` - Google search results
- `apify/linkedin-scraper` - LinkedIn data
- `apify/instagram-scraper` - Instagram posts

Usage:
```bash
./scripts/apify-run.sh "apify/web-scraper" '{
  "startUrls": [{"url": "https://example.com"}],
  "pageFunction": "async function pageFunction(context) { return context.request.url; }"
}'
```

### Option 2: Create your own actor
1. Go to https://console.apify.com/actors
2. Create new actor
3. Get the actor ID
4. Run with your actor ID

---

## 🌐 HTTP Client

**Status:** ✅ Working

Test any HTTP endpoint:
```bash
# GET request
./scripts/http-request.sh GET https://api.github.com/zen

# POST request
./scripts/http-request.sh POST https://httpbin.org/post '{"test":true}'
```

---

## Summary

| Provider | Status | Resources Found |
|----------|--------|----------------|
| Airtable | ✅ Working | 1 base, 1 table |
| Make.com | ⚠️ Permission denied | Need token update |
| Apify | ✅ Working | 0 actors (use store) |
| HTTP | ✅ Working | Universal |

