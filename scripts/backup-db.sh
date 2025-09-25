#!/bin/bash

# Database backup script for Scholarship Scraper
set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/scholarship_scraper_$DATE.sql"

# Database connection (from environment or defaults)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-scholarship_scraper}"
DB_USER="${DB_USER:-postgres}"

echo "🗄️  Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if database is accessible
echo "🔍 Checking database connection..."
if ! PGPASSWORD="$DB_PASSWORD" pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; then
    echo "❌ Cannot connect to database. Please check your connection settings."
    exit 1
fi

echo "✅ Database connection successful"

# Create backup
echo "💾 Creating backup: $BACKUP_FILE"
PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --verbose \
    --no-owner \
    --no-privileges \
    --create \
    --clean \
    > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database backup completed successfully"
else
    echo "❌ Database backup failed"
    exit 1
fi

# Compress backup
echo "🗜️  Compressing backup..."
gzip "$BACKUP_FILE"
BACKUP_FILE="$BACKUP_FILE.gz"

# Get file size
FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "📦 Compressed backup size: $FILE_SIZE"

# Clean up old backups
echo "🧹 Cleaning up backups older than $RETENTION_DAYS days..."
OLD_BACKUPS=$(find "$BACKUP_DIR" -name "scholarship_scraper_*.sql.gz" -mtime +$RETENTION_DAYS -print)

if [ -n "$OLD_BACKUPS" ]; then
    echo "Removing old backups:"
    echo "$OLD_BACKUPS"
    find "$BACKUP_DIR" -name "scholarship_scraper_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "✅ Old backups cleaned up"
else
    echo "ℹ️  No old backups to clean up"
fi

# Backup summary
echo ""
echo "📊 Backup Summary:"
echo "   File: $BACKUP_FILE"
echo "   Size: $FILE_SIZE"
echo "   Date: $(date)"
echo ""
echo "✅ Backup process completed successfully!"

# Optional: Upload to cloud storage
if [ -n "$AWS_S3_BUCKET" ] && command -v aws &> /dev/null; then
    echo "☁️  Uploading backup to S3..."
    aws s3 cp "$BACKUP_FILE" "s3://$AWS_S3_BUCKET/backups/$(basename $BACKUP_FILE)"
    echo "✅ Backup uploaded to S3"
fi

# Optional: Send notification
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"📦 Scholarship Scraper database backup completed successfully\\nFile: $(basename $BACKUP_FILE)\\nSize: $FILE_SIZE\"}" \
        "$SLACK_WEBHOOK_URL" > /dev/null 2>&1
fi