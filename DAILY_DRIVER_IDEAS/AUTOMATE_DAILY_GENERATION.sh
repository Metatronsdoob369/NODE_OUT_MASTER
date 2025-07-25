#!/bin/bash
# 🎯 AUTOMATED DAILY NEEDLE MOVER GENERATION
# Run this script every morning at 6 AM to generate fresh ideas

cd /Users/joewales/NODE_OUT_Master/DAILY_DRIVER_IDEAS

echo "🌅 Good morning! Generating today's 5 needle movers..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Generate today's needle movers
node GENERATE_TOMORROWS_5.js

echo ""
echo "📋 Today's Revenue Opportunities Ready!"
echo "💡 Never run out of ways to grow the business"
echo "🎯 Execute all 5 for maximum impact"
echo ""
echo "🔗 Open your needle movers file:"
TODAY_FILE="NEEDLE_MOVERS_$(date +%Y_%m_%d).md"
echo "📄 $TODAY_FILE"
echo ""

# Optional: Open the file automatically (uncomment next line)
# open "$TODAY_FILE"

echo "✅ Ready to move the needle!"