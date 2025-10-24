# Fix: Port Conflict - Local MongoDB vs SSH Tunnel

## Problem
Your local MongoDB (unified platform) is using port 27017, so the SSH tunnel can't use the same port.

**Error:** "Could not request local forwarding"

---

## Solution: Use Different Port for Tunnel

### Option 1: SSH Tunnel on Different Port (Recommended)

Use port `27018` instead of `27017`:

```bash
# Create SSH tunnel to OneWorld server using port 27018
ssh -L 27018:localhost:27017 ubuntu@3.144.1.10
```

Now you have:
- **Port 27017:** Your local unified platform MongoDB
- **Port 27018:** OneWorld old server (via tunnel)

### Connect to Old Database in Compass

In MongoDB Compass, connect to:
```
mongodb://localhost:27018
```

This will access the OneWorld database through the tunnel on port 27018.

---

## Option 2: Stop Local MongoDB Temporarily

If you need to use port 27017:

```bash
# Stop local MongoDB
pkill -f mongod

# Or if using brew:
brew services stop mongodb-community

# Now create tunnel on 27017
ssh -L 27017:localhost:27017 ubuntu@3.144.1.10

# When done, restart local MongoDB
mongod --replSet rs0 --port 27017 --dbpath ~/mongodb-replica-set/rs0 --bind_ip localhost --logpath ~/mongodb-replica-set/mongod.log --fork
```

**Note:** This will temporarily break your unified platform development server.

---

## Option 3: Direct Export from Server (No Tunnel Needed)

Instead of using a tunnel, SSH directly to the server and export:

```bash
# 1. SSH to old server
ssh ubuntu@3.144.1.10

# 2. Check database name
mongosh --eval "show dbs"

# 3. Export the database
mongodump --db oneworld --out ./oneworld-backup

# 4. Compress it
tar -czf oneworld-backup.tar.gz oneworld-backup/

# 5. Exit SSH
exit

# 6. Download to your Mac (new terminal on Mac)
scp ubuntu@3.144.1.10:~/oneworld-backup.tar.gz ~/Downloads/

# 7. Import to Atlas from your Mac
cd ~/Downloads
tar -xzf oneworld-backup.tar.gz

mongorestore \
  --uri="mongodb+srv://oneworld_user:AQ3Wd3yY5tL8lKsw@unifiedlms.lvywnng.mongodb.net/oneworld-lms" \
  --nsFrom='oneworld.*' \
  --nsTo='oneworld-lms.*' \
  ./oneworld-backup/oneworld/
```

**This is the cleanest solution** - no port conflicts at all!

---

## Recommended Workflow

**Use Option 3** (Direct SSH export) because:
- ✅ No port conflicts
- ✅ Fastest for migration
- ✅ Doesn't interfere with unified platform development
- ✅ One-time operation

**Use Option 1** (Port 27018) if you:
- Need to browse the old database in Compass
- Want to compare old vs new data visually
- Need to check data before migration

---

## Quick Commands Reference

### Create Tunnel on Port 27018:
```bash
ssh -L 27018:localhost:27017 ubuntu@3.144.1.10
```

### Connect in Compass:
```
mongodb://localhost:27018
```

### Direct Export (No Tunnel):
```bash
# On server
ssh ubuntu@3.144.1.10
mongodump --db oneworld --out ./backup
tar -czf backup.tar.gz backup/
exit

# On Mac
scp ubuntu@3.144.1.10:~/backup.tar.gz ~/Downloads/
```

### Import to Atlas:
```bash
cd ~/Downloads
tar -xzf backup.tar.gz
mongorestore --uri="mongodb+srv://oneworld_user:AQ3Wd3yY5tL8lKsw@unifiedlms.lvywnng.mongodb.net/oneworld-lms" --nsFrom='oneworld.*' --nsTo='oneworld-lms.*' ./backup/oneworld/
```

---

## Which Method Should You Use?

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| **Option 1: Port 27018** | Browsing old data in Compass | Visual, easy to verify | Still need to export/import |
| **Option 2: Stop Local MongoDB** | If you MUST use port 27017 | Uses familiar port | Breaks unified dev |
| **Option 3: Direct Export** | **Migration (Recommended)** | Fast, no conflicts, clean | Command line only |

**Recommendation:** Use **Option 3 for migration**, then use **Option 1 (port 27018)** if you need to browse the old database later.
