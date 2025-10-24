# OneWorld LMS - Data Migration Guide (SSH Tunnel + Compass)

## Your Current Setup
- **Old Server:** `ubuntu@3.144.1.10:22`
- **SSH Tunnel:** Local port 27017 → Remote MongoDB
- **Tool:** MongoDB Compass (GUI)
- **Target:** MongoDB Atlas `oneworld-lms` database

---

## Migration Strategy

Since you already use SSH tunnel + Compass, we'll use a hybrid approach:
1. **Export** from old server using command line (via SSH)
2. **Import** to Atlas using command line or Compass

---

## Method 1: Command Line (Recommended - Fastest)

### Step 1: SSH into Old Server
```bash
ssh ubuntu@3.144.1.10
```

### Step 2: Export Data from Old MongoDB
```bash
# Find the database name first
mongosh --eval "db.adminCommand('listDatabases')"

# Assuming database is called 'oneworld' or similar
# Export all data to a directory
mongodump --db oneworld --out ./oneworld-backup

# Compress for faster download
tar -czf oneworld-backup.tar.gz oneworld-backup/

# Check the size
ls -lh oneworld-backup.tar.gz
```

### Step 3: Download Backup to Your Mac
```bash
# On your local machine (new terminal)
scp ubuntu@3.144.1.10:~/oneworld-backup.tar.gz ~/Downloads/

# Extract it
cd ~/Downloads
tar -xzf oneworld-backup.tar.gz
```

### Step 4: Import to MongoDB Atlas
```bash
# Import to Atlas (replace PASSWORD with actual password)
mongorestore \
  --uri="mongodb+srv://oneworld_user:AQ3Wd3yY5tL8lKsw@unifiedlms.lvywnng.mongodb.net/oneworld-lms?retryWrites=true&w=majority" \
  --nsFrom='oneworld.*' \
  --nsTo='oneworld-lms.*' \
  ./oneworld-backup/oneworld/

# This will import all collections from 'oneworld' to 'oneworld-lms'
```

### Step 5: Verify Import
```bash
# Connect to Atlas and check
mongosh "mongodb+srv://oneworld_user:AQ3Wd3yY5tL8lKsw@unifiedlms.lvywnng.mongodb.net/oneworld-lms"

# List collections
show collections

# Count documents in a collection (e.g., users)
db.users.countDocuments()
```

---

## Method 2: Using MongoDB Compass (GUI Method)

### Step 1: Connect to Old Database via Tunnel

Your tunnel is already set up:
- **Local:** `127.0.0.1:27017`

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select the OneWorld database
4. Note all collection names

### Step 2: Export Each Collection

For each collection:

1. Click on the collection name
2. Click "..." menu → "Export Collection"
3. Format: **JSON** (recommended) or CSV
4. Save to: `~/Downloads/oneworld-export/[collection-name].json`

Repeat for all collections:
- `users`
- `courses`
- `lessons`
- `progress`
- `certificates`
- `enrollments`
- etc.

### Step 3: Connect to MongoDB Atlas in Compass

1. In Compass, click "New Connection"
2. Paste this connection string:
   ```
   mongodb+srv://oneworld_user:AQ3Wd3yY5tL8lKsw@unifiedlms.lvywnng.mongodb.net/oneworld-lms
   ```
3. Click "Connect"
4. You should see the `oneworld-lms` database

### Step 4: Import Each Collection

For each exported JSON file:

1. In Atlas connection, select `oneworld-lms` database
2. Click "Create Collection" or select existing collection
3. Click "Add Data" → "Import JSON or CSV file"
4. Select the exported `.json` file
5. Click "Import"
6. Repeat for all collections

---

## Method 3: Programmatic Export/Import (If Collections Are Large)

If you have many large collections, use this script:

```bash
#!/bin/bash

# Configuration
OLD_DB="oneworld"  # Change to actual database name
ATLAS_URI="mongodb+srv://oneworld_user:AQ3Wd3yY5tL8lKsw@unifiedlms.lvywnng.mongodb.net/oneworld-lms"

# Collections to migrate (add/remove as needed)
COLLECTIONS=(
  "users"
  "courses"
  "lessons"
  "progress"
  "enrollments"
  "certificates"
  "sessions"
)

# Export from old server (run on old server via SSH)
for collection in "${COLLECTIONS[@]}"; do
  echo "Exporting $collection..."
  mongoexport \
    --db=$OLD_DB \
    --collection=$collection \
    --out="./${collection}.json"
done

# Compress all exports
tar -czf oneworld-data.tar.gz *.json

# Then download to your Mac and import:
# scp ubuntu@3.144.1.10:~/oneworld-data.tar.gz ~/Downloads/

# Extract and import (run on your Mac)
# cd ~/Downloads
# tar -xzf oneworld-data.tar.gz
# for collection in "${COLLECTIONS[@]}"; do
#   echo "Importing $collection..."
#   mongoimport \
#     --uri="$ATLAS_URI" \
#     --collection=$collection \
#     --file="./${collection}.json"
# done
```

---

## Pre-Migration Checklist

Before starting migration:

- [ ] Identify the exact database name on old server
- [ ] List all collections to migrate
- [ ] Estimate total data size
- [ ] Verify MongoDB Atlas allows connections (IP whitelist: `0.0.0.0/0` for testing)
- [ ] Test connection to Atlas from your Mac
- [ ] Have backup of old data (just in case)

---

## Finding Database Name on Old Server

If you're unsure of the database name:

```bash
# Via SSH tunnel + mongosh on your Mac
mongosh mongodb://localhost:27017

# List all databases
show dbs

# Switch to likely database
use oneworld  # or whatever name you see

# List collections
show collections

# Sample a document to verify it's the right data
db.users.findOne()
```

---

## Post-Migration Verification

After import, verify data integrity:

```javascript
// Connect to Atlas in mongosh or Compass
use oneworld-lms

// Check collection counts match old database
db.users.countDocuments()
db.courses.countDocuments()
db.lessons.countDocuments()
// ... etc

// Spot check some records
db.users.findOne()
db.courses.findOne()

// Verify indexes were created (if any)
db.users.getIndexes()
```

---

## Common Issues & Solutions

### Issue: "Authentication failed"
**Solution:** Double-check Atlas username/password in connection string

### Issue: "Network timeout"
**Solution:** 
1. Check Atlas Network Access settings
2. Add `0.0.0.0/0` to IP whitelist (allows all IPs)
3. Or add your specific IP address

### Issue: "Collection already exists"
**Solution:** 
- Drop existing collection: `db.users.drop()`
- Or use `--drop` flag with mongorestore

### Issue: "Document size too large"
**Solution:** MongoDB Atlas supports up to 16MB per document (should be fine for LMS data)

### Issue: SSH tunnel connection drops
**Solution:**
```bash
# Keep tunnel alive with ServerAliveInterval
ssh -L 27017:localhost:27017 ubuntu@3.144.1.10 -o ServerAliveInterval=60
```

---

## Recommended Approach

Based on your setup, I recommend:

1. **For small datasets (<1GB):** Use Method 2 (Compass GUI) - easiest, visual
2. **For medium datasets (1-10GB):** Use Method 1 (Command line) - faster, more reliable  
3. **For large datasets (>10GB):** Use Method 1 with compression - most efficient

---

## Quick Reference Commands

### Check old database size:
```bash
mongosh mongodb://localhost:27017
use oneworld
db.stats()  // Shows database size
```

### Export entire database:
```bash
# On old server
mongodump --db oneworld --out ./backup
```

### Import to Atlas:
```bash
# On your Mac
mongorestore --uri="mongodb+srv://oneworld_user:AQ3Wd3yY5tL8lKsw@unifiedlms.lvywnng.mongodb.net/oneworld-lms" --nsFrom='oneworld.*' --nsTo='oneworld-lms.*' ./backup/oneworld/
```

---

## Timeline Estimate

- **Setup & Discovery:** 15 minutes (find database, list collections)
- **Export:** 5-30 minutes (depends on data size)
- **Download:** 5-15 minutes (depends on size & network)
- **Import to Atlas:** 10-45 minutes (depends on size)
- **Verification:** 10 minutes

**Total: 45 minutes to 2 hours** (depending on data size)

---

## Need Help?

If you run into issues:
1. Check Railway logs to see if app still works with new data
2. Verify connection strings are correct
3. Check Atlas Network Access allows your IP
4. Make sure old SSH tunnel is active during export

Let me know which method you prefer and I can provide more detailed steps!
