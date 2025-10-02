#!/usr/bin/env bash
# Check MCP server status and credential loading

set -e

echo "🔍 MCP Server Status"
echo "===================="

# Health check
echo -e "\n✅ Health:"
curl -s http://localhost:7337/health | jq

# Test Make.com auth
echo -e "\n🔧 Make.com:"
MAKE_TEST=$(curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{"tool":"make.runScenario","args":{"scenarioId":"test"}}')

if echo "$MAKE_TEST" | grep -q "need:MAKE_API_TOKEN"; then
  echo "❌ Not authenticated"
elif echo "$MAKE_TEST" | grep -q "Make API error"; then
  echo "✅ Authenticated (credentials loaded)"
else
  echo "⚠️  Unknown status"
fi

# Test Airtable auth
echo -e "\n📊 Airtable:"
AIRTABLE_TEST=$(curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{"tool":"airtable.query","args":{"table":"test"}}')

if echo "$AIRTABLE_TEST" | grep -q "need:AIRTABLE"; then
  echo "❌ Not authenticated"
elif echo "$AIRTABLE_TEST" | grep -q "Airtable API error"; then
  echo "✅ Authenticated (credentials loaded)"
else
  echo "⚠️  Unknown status"
fi

# Test Apify auth
echo -e "\n🕷️  Apify:"
APIFY_TEST=$(curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{"tool":"apify.run","args":{"actorId":"test"}}')

if echo "$APIFY_TEST" | grep -q "need:APIFY_TOKEN"; then
  echo "❌ Not authenticated"
elif echo "$APIFY_TEST" | grep -q "Apify API error"; then
  echo "✅ Authenticated (credentials loaded)"
else
  echo "⚠️  Unknown status"
fi

# Test HTTP (always works)
echo -e "\n🌐 HTTP Client:"
HTTP_TEST=$(curl -s -X POST http://localhost:7337/tools \
  -H "Content-Type: application/json" \
  -d '{"tool":"http.request","args":{"method":"GET","url":"https://api.github.com/zen"}}')

if echo "$HTTP_TEST" | grep -q '"result"'; then
  echo "✅ Working"
else
  echo "❌ Failed"
fi

echo -e "\n✨ All providers checked"

