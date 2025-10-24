#!/bin/bash

# OneWorld LMS Data Migration Script
# This script exports data from old server and imports to MongoDB Atlas

set -e  # Exit on error

echo "==================================="
echo "OneWorld LMS Data Migration"
echo "==================================="
echo ""

# Configuration
SSH_KEY="$HOME/Downloads/Keys/oneworld-live.pem"
OLD_SERVER="ubuntu@3.144.1.10"
ATLAS_URI="mongodb+srv://oneworld_user:AQ3Wd3yY5tL8lKsw@unifiedlms.lvywnng.mongodb.net/oneworld-lms?retryWrites=true&w=majority"
BACKUP_DIR="$HOME/Downloads/oneworld-migration"

# Step 1: Export from old server
echo "Step 1/4: Connecting to old server and exporting database..."
ssh -i "$SSH_KEY" "$OLD_SERVER" << 'REMOTE_COMMANDS'
# Find database name
echo "Available databases:"
mongosh --quiet --eval "db.adminCommand('listDatabases').databases.forEach(db => print(db.name))"

# Export (assuming database is called 'oneworld' - adjust if needed)
echo ""
echo "Exporting database..."
mongodump --db oneworld-prod --out ./oneworld-backup 2>&1 | grep -v "Warning"

# Compress backup
echo "Compressing backup..."
tar -czf oneworld-backup.tar.gz oneworld-backup/
ls -lh oneworld-backup.tar.gz

echo "Export complete!"
REMOTE_COMMANDS

echo ""
echo "Step 2/4: Downloading backup to your Mac..."
mkdir -p "$BACKUP_DIR"
scp -i "$SSH_KEY" "$OLD_SERVER:~/oneworld-backup.tar.gz" "$BACKUP_DIR/"

echo ""
echo "Step 3/4: Extracting backup..."
cd "$BACKUP_DIR"
tar -xzf oneworld-backup.tar.gz

echo ""
echo "Step 4/4: Importing to MongoDB Atlas..."
mongorestore \
  --uri="$ATLAS_URI" \
  --nsFrom='oneworld-prod.*' \
  --nsTo='oneworld-lms.*' \
  --drop \
  ./oneworld-backup/oneworld-prod/

echo ""
echo "==================================="
echo "✅ Migration Complete!"
echo "==================================="
echo ""
echo "Verifying import..."
mongosh "$ATLAS_URI" --quiet --eval "
  print('Collections in oneworld-lms:');
  db.getCollectionNames().forEach(c => {
    const count = db.getCollection(c).countDocuments();
    print('  ' + c + ': ' + count + ' documents');
  });
"

echo ""
echo "Backup files saved in: $BACKUP_DIR"
echo "Railway URL: https://oneworld-lms-production.up.railway.app/api/graphql"
