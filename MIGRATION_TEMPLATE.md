# LMS Migration Template: Legacy to Railway + MongoDB Atlas

This template provides a reusable guide for migrating any of the 11 existing LMS instances to Railway + MongoDB Atlas infrastructure.

## Migration Checklist

- [ ] GitHub repository created
- [ ] Code copied without git history
- [ ] `.gitignore` configured
- [ ] GitHub Actions workflow created
- [ ] Railway service created
- [ ] MongoDB Atlas database created
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Database connected
- [ ] Testing completed
- [ ] DNS updated (when ready)

## Prerequisites

- Access to MongoDB Atlas cluster: `UnifiedLMS`
- Access to Railway project: `Mogul LMS`
- AWS credentials (S3 for file storage)
- Email service credentials (Postmark)
- Any LMS-specific credentials (OAuth, API keys)

---

## Step 1: Create GitHub Repository

```bash
# Replace {lms-name} with: fiji, iprefer, epic-pass, etc.
gh repo create antonmogul/{lms-name}-lms --public --description "{LMS Name} - Railway + MongoDB Atlas"

# Clone empty repo
mkdir -p ~/Documents/GitHub/MogulLMS/temp-railway
cd ~/Documents/GitHub/MogulLMS/temp-railway
git clone https://github.com/antonmogul/{lms-name}-lms.git
```

## Step 2: Copy Source Code

```bash
# Copy from existing LMS location (exclude git history and generated files)
rsync -av \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.turbo' \
  --exclude='.parcel-cache' \
  --exclude='.DS_Store' \
  --exclude='.env' \
  ~/Documents/GitHub/MogulLMS/{old-lms-name}/ \
  ~/Documents/GitHub/MogulLMS/temp-railway/{lms-name}-lms/
```

## Step 3: Create/Update `.gitignore`

Ensure the following are excluded:

```gitignore
node_modules/
dist/
.turbo/
.parcel-cache/
.env
packages/orm/generated/
```

## Step 4: Create GitHub Actions Workflow

File: `.github/workflows/build.yml`

```yaml
name: Build and Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Build
        run: yarn build
        env:
          NODE_ENV: production
          DATABASE_URL: mongodb://localhost:27017/temp
```

## Step 5: Push to GitHub

```bash
cd ~/Documents/GitHub/MogulLMS/temp-railway/{lms-name}-lms
git add -A
git commit -m "Initial commit: {LMS Name} migration to Railway"
git push origin main
```

---

## Step 6: Create MongoDB Atlas Database

1. Go to https://cloud.mongodb.com
2. Select cluster: `UnifiedLMS`
3. Click **Collections** → **Create Database**
   - Database name: `{lms-name}-lms`
   - Collection name: `users` (or any starter collection)
4. Get connection string:
   ```
   mongodb+srv://USER:PASSWORD@unifiedlms.lvywnng.mongodb.net/{lms-name}-lms?retryWrites=true&w=majority
   ```

### Optional: Migrate Existing Data

**Option A: mongodump/mongorestore**
```bash
# Export from old database
mongodump --uri="{old-db-url}" --db={lms-name} --out=./backup

# Import to Atlas
mongorestore --uri="{atlas-connection-string}" ./backup/{lms-name}
```

**Option B: JSON Export/Import via MongoDB Compass**
1. Connect to old database
2. Export collections as JSON
3. Connect to Atlas
4. Import JSON files

---

## Step 7: Create Railway Service

1. Go to Railway project
2. Click **+ New** → **GitHub Repo**
3. Select `antonmogul/{lms-name}-lms`
4. Service name: `{LMS Name} Server`

### Configure Build Settings

- **Root Directory**: (leave empty)
- **Build Command**: `yarn install && yarn build`
- **Start Command**: `yarn server:start` (or check package.json scripts)

---

## Step 8: Configure Environment Variables

In Railway, add these variables:

### Database
```bash
DATABASE_URL=mongodb+srv://USER:PASSWORD@unifiedlms.lvywnng.mongodb.net/{lms-name}-lms?retryWrites=true&w=majority
```

### Security (Generate New!)
```bash
JWT_SECRET=<run: openssl rand -base64 32>
SESSION_SECRET=<run: openssl rand -base64 32>
HASH_SALT=12
```

### Server
```bash
NODE_ENV=production
API_PORT=4020
ENVIRONMENT=production
```

### AWS S3 (Copy from old server)
```bash
AWS_ACCESS_KEY_ID=<copy-from-old>
AWS_SECRET_ACCESS_KEY=<copy-from-old>
AWS_REGION=us-east-1
S3_BUCKET_NAME={lms-name}-prod
S3_MEDIA_FOLDER_NAME=public-media
```

### Email (Copy from old server)
```bash
POSTMARK_API_KEY=<copy-from-old>
POSTMARK_FROM_EMAIL=training@{domain}.com
```

### LMS-Specific Variables
Add any OAuth, API keys, or feature flags specific to this LMS.

---

## Step 9: Deploy and Test

1. **Wait for Railway deployment** (~5 minutes)
2. **Get Railway URL**: `{lms-name}-production.up.railway.app`
3. **Test endpoints**:
   ```bash
   # Health check
   curl https://{lms-name}-production.up.railway.app/health
   
   # GraphQL playground (if applicable)
   open https://{lms-name}-production.up.railway.app/graphql
   ```

4. **Check logs** in Railway dashboard for errors

---

## Step 10: Verify Functionality

Test critical features:

- [ ] Login works
- [ ] Course access works
- [ ] File uploads work (S3)
- [ ] Email notifications work
- [ ] Database reads/writes work
- [ ] SSO works (if applicable)

---

## Step 11: DNS Cutover (When Ready)

**Option A: Full Migration**
- Update DNS A record to point to Railway
- Verify SSL certificate

**Option B: API Only** (Recommended)
- Keep frontend on old server
- Update frontend API URL to point to Railway
- Test hybrid setup

---

## Troubleshooting

### Build Failures
- Check GitHub Actions logs
- Verify all dependencies are in `package.json`
- Check for missing environment variables during build

### Database Connection Errors
- Verify DATABASE_URL is correct
- Check MongoDB Atlas IP whitelist (use `0.0.0.0/0` for Railway)
- Ensure database name matches exactly

### Runtime Errors
- Check Railway logs
- Verify all environment variables are set
- Check for missing files (should be built, not in git)

---

## Post-Migration

- [ ] Document Railway URL
- [ ] Update team documentation
- [ ] Monitor logs for first 24 hours
- [ ] Keep old server running for 1 week as backup
- [ ] Archive old infrastructure when stable

---

## Differences from Unified Platform

This is a **stopgap migration** - code stays frozen:
- ❌ No code improvements
- ❌ No architectural changes
- ❌ No merging with unified platform yet
- ✅ Just infrastructure migration
- ✅ Same functionality as before
- ✅ Better deployment pipeline
- ✅ Cleaner git history

---

## Timeline Estimate

- Code setup: 15-20 minutes
- Railway configuration: 10-15 minutes
- Testing: 15-30 minutes
- **Total: ~1 hour per LMS**

---

## Questions?

Refer to OneWorld LMS migration as the reference implementation.
