#!/bin/bash
# 🚀 UE5/Xcode Smart Downloader - Never Lose Progress Again

set -e

DOWNLOAD_URL="$1"
OUTPUT_FILE="$2"
TEMP_DIR="/tmp/smart_downloads"

if [ -z "$DOWNLOAD_URL" ] || [ -z "$OUTPUT_FILE" ]; then
    echo "Usage: $0 <download_url> <output_file>"
    echo ""
    echo "Examples:"
    echo "  $0 'https://developer.apple.com/xcode/download/' 'Xcode_15.xip'"
    echo "  $0 'https://unrealengine.com/download' 'UE5_Download.zip'"
    exit 1
fi

# Create temp directory
mkdir -p "$TEMP_DIR"

echo "🚀 UE5/Xcode Smart Downloader Starting..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 URL: $DOWNLOAD_URL"
echo "💾 Output: $OUTPUT_FILE"
echo "📂 Temp Dir: $TEMP_DIR"
echo ""

# Check available download tools
DOWNLOADER=""

if command -v aria2c >/dev/null 2>&1; then
    DOWNLOADER="aria2c"
    echo "✅ Found aria2c - Using multi-connection download"
elif command -v curl >/dev/null 2>&1; then
    DOWNLOADER="curl"
    echo "✅ Found curl - Using resume-capable download"
elif command -v wget >/dev/null 2>&1; then
    DOWNLOADER="wget"
    echo "✅ Found wget - Using basic resume download"
else
    echo "❌ No suitable downloader found!"
    echo "Install aria2c for best results: brew install aria2"
    exit 1
fi

echo ""

# Start download based on available tool
case $DOWNLOADER in
    "aria2c")
        echo "🏎️  Starting aria2c download with 16 connections..."
        aria2c \
            --continue=true \
            --max-connection-per-server=16 \
            --split=16 \
            --max-concurrent-downloads=16 \
            --min-split-size=1M \
            --file-allocation=falloc \
            --retry-wait=3 \
            --max-tries=10 \
            --timeout=60 \
            --dir="$(dirname "$OUTPUT_FILE")" \
            --out="$(basename "$OUTPUT_FILE")" \
            "$DOWNLOAD_URL"
        ;;
        
    "curl")
        echo "🌐 Starting curl download with resume..."
        curl \
            --location \
            --continue-at - \
            --retry 10 \
            --retry-delay 3 \
            --retry-max-time 3600 \
            --connect-timeout 60 \
            --max-time 0 \
            --output "$OUTPUT_FILE" \
            --progress-bar \
            "$DOWNLOAD_URL"
        ;;
        
    "wget")
        echo "📡 Starting wget download with resume..."
        wget \
            --continue \
            --retry-connrefused \
            --waitretry=3 \
            --read-timeout=60 \
            --timeout=60 \
            --tries=10 \
            --progress=bar:force \
            --output-document="$OUTPUT_FILE" \
            "$DOWNLOAD_URL"
        ;;
esac

# Verify download completed
if [ -f "$OUTPUT_FILE" ]; then
    FILE_SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE" 2>/dev/null || echo "unknown")
    echo ""
    echo "✅ Download completed successfully!"
    echo "📊 File size: $FILE_SIZE bytes"
    echo "📁 Location: $OUTPUT_FILE"
    
    # Suggest next steps
    echo ""
    echo "🎯 Next Steps:"
    if [[ "$OUTPUT_FILE" == *.xip ]]; then
        echo "   - Double-click to install Xcode"
        echo "   - Or: xip -x '$OUTPUT_FILE'"
    elif [[ "$OUTPUT_FILE" == *.zip ]]; then
        echo "   - Extract: unzip '$OUTPUT_FILE'"
    elif [[ "$OUTPUT_FILE" == *.dmg ]]; then
        echo "   - Mount: open '$OUTPUT_FILE'"
    fi
    
else
    echo "❌ Download failed or file not found!"
    exit 1
fi

echo ""
echo "🎉 Smart download complete - no more nightmares!"