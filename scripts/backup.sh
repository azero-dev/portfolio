#!/usr/bin/env bash

# Backup script for portfolio D1 database
# Usage: ./scripts/backup.sh [--upload] [--local]

set -euo pipefail

# Configuration
DATABASE_NAME="portfolio-db"
OUTPUT_DIR="${OUTPUT_DIR:-./backups}"
DATE=$(date +%Y%m%d-%H%M%S)
FILENAME="backup-${DATABASE_NAME}-${DATE}.sql"
BACKUP_PATH="${OUTPUT_DIR}/${FILENAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $*"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*"
}

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Parse arguments
UPLOAD_TO_R2=false
USE_LOCAL=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --upload)
            UPLOAD_TO_R2=true
            shift
            ;;
        --local)
            USE_LOCAL=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Usage: $0 [--upload] [--local]"
            echo "  --upload   Upload backup to Cloudflare R2 (requires R2 configuration)"
            echo "  --local    Use local D1 database (instead of remote)"
            exit 1
            ;;
    esac
done

# Determine target database
TARGET_DB="$DATABASE_NAME"
if [[ "$USE_LOCAL" == "true" ]]; then
    TARGET_DB="$DATABASE_NAME"  # local database (requires wrangler.toml preview_database_id)
    log_info "Using local D1 database ($TARGET_DB)"
else
    log_info "Using remote D1 database ($TARGET_DB)"
fi

# Export database
log_info "Exporting D1 database '$TARGET_DB' to $BACKUP_PATH"
if [[ "$USE_LOCAL" == "true" ]]; then
    npx wrangler d1 export "$TARGET_DB" --local --output "$BACKUP_PATH"
else
    npx wrangler d1 export "$TARGET_DB" --remote --output "$BACKUP_PATH"
fi

if [[ $? -eq 0 ]]; then
    log_info "Export successful. Size: $(du -h "$BACKUP_PATH" | cut -f1)"
else
    log_error "Export failed"
    exit 1
fi

# Optional: upload to Cloudflare R2
if [[ "$UPLOAD_TO_R2" == "true" ]]; then
    log_warn "R2 upload not implemented. Placeholder for future enhancement."
    # Example using AWS CLI (configured for R2):
    # aws s3 cp "$BACKUP_PATH" "s3://your-bucket-name/$FILENAME" --endpoint-url "https://${ACCOUNT_ID}.r2.cloudflarestorage.com"
fi

# Optional: compress backup
log_info "Compressing backup..."
gzip -f "$BACKUP_PATH"
BACKUP_PATH="${BACKUP_PATH}.gz"
log_info "Compressed backup: $BACKUP_PATH"

# Cleanup old backups (keep last 30 days)
log_info "Cleaning up backups older than 30 days..."
find "$OUTPUT_DIR" -name "backup-*.sql.gz" -mtime +30 -delete 2>/dev/null || true

log_info "Backup completed: $BACKUP_PATH"
echo "To restore, use:"
echo "  npx wrangler d1 execute $DATABASE_NAME --remote --file $BACKUP_PATH"
echo "  (or --local for local database)"