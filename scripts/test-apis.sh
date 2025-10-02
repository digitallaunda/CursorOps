#!/bin/bash
# Test all API connections and credentials

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "════════════════════════════════════════════════════════════════"
echo "           🧪 API CREDENTIALS TESTING"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Load environment variables
if [ -f .env ]; then
    source .env
    echo -e "${GREEN}✅ Environment loaded from .env${NC}"
else
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

echo ""

# Test Apify
echo "1️⃣  Testing Apify API..."
APIFY_RESULT=$(curl -s -H "Authorization: Bearer $APIFY_TOKEN" \
    "https://api.apify.com/v2/users/me")

if echo "$APIFY_RESULT" | jq -e '.data.username' > /dev/null 2>&1; then
    USERNAME=$(echo "$APIFY_RESULT" | jq -r '.data.username')
    EMAIL=$(echo "$APIFY_RESULT" | jq -r '.data.email')
    echo -e "   ${GREEN}✅ Connected${NC}"
    echo "   User: $USERNAME"
    echo "   Email: $EMAIL"
else
    echo -e "   ${RED}❌ Failed${NC}"
fi

echo ""

# Test Airtable
echo "2️⃣  Testing Airtable API..."
AIRTABLE_RESULT=$(curl -s -H "Authorization: Bearer $AIRTABLE_API_KEY" \
    "https://api.airtable.com/v0/meta/bases")

if echo "$AIRTABLE_RESULT" | jq -e '.bases' > /dev/null 2>&1; then
    BASE_COUNT=$(echo "$AIRTABLE_RESULT" | jq -r '.bases | length')
    FIRST_BASE=$(echo "$AIRTABLE_RESULT" | jq -r '.bases[0].name // "N/A"')
    echo -e "   ${GREEN}✅ Connected${NC}"
    echo "   Bases found: $BASE_COUNT"
    echo "   First base: $FIRST_BASE"
else
    echo -e "   ${RED}❌ Failed${NC}"
fi

echo ""

# Test Make.com
echo "3️⃣  Testing Make.com API..."
MAKE_RESULT=$(curl -s -H "Authorization: Token $MAKE_API_TOKEN" \
    "https://$MAKE_ZONE/api/v2/scenarios?organizationId=$MAKE_ORGANIZATION_ID")

if echo "$MAKE_RESULT" | jq -e '.scenarios' > /dev/null 2>&1; then
    SCENARIO_COUNT=$(echo "$MAKE_RESULT" | jq -r '.scenarios | length')
    echo -e "   ${GREEN}✅ Connected${NC}"
    echo "   Organization ID: $MAKE_ORGANIZATION_ID"
    echo "   Zone: $MAKE_ZONE"
    echo "   Scenarios: $SCENARIO_COUNT"
else
    echo -e "   ${RED}❌ Failed${NC}"
    echo "   Error: $(echo "$MAKE_RESULT" | jq -r '.message // "Unknown error"')"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ All API tests completed!${NC}"
echo "════════════════════════════════════════════════════════════════"

