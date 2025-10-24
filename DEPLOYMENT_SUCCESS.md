# ✅ OneWorld LMS - Railway Deployment SUCCESS

**Deployment Date:** 2025-10-24  
**Status:** 🟢 LIVE AND RUNNING  
**Production URL:** https://oneworld-lms-production.up.railway.app

---

## Deployment Summary

### ✅ What's Working
- **GraphQL API Server:** Running on Railway
- **MongoDB Atlas:** Connected and operational
- **Build Process:** TypeScript compilation succeeds (with known type warnings)
- **Environment:** Production mode enabled
- **Security:** GraphQL introspection disabled (production best practice)

### 📍 Deployment Details
- **Platform:** Railway (https://railway.app)
- **Region:** us-east4
- **Node Version:** 22.21.0
- **Package Manager:** Yarn 1.22.19
- **Database:** MongoDB Atlas (shared cluster: unifiedlms.lvywnng.mongodb.net)

### 🔗 Endpoints
- **GraphQL API:** https://oneworld-lms-production.up.railway.app/api/graphql
- **SSO Callback:** https://oneworld-lms-production.up.railway.app/sso

---

## Current Configuration

### Environment Variables Set in Railway
- ✅ `DATABASE_URL` - MongoDB Atlas connection
- ✅ `JWT_SECRET` - Authentication token secret
- ✅ `API_PORT=${{PORT}}` - Railway dynamic port binding
- ✅ `ENVIRONMENT=production`
- ✅ `NODE_ENV=production`

### Missing Variables (Need to Add)
These are optional but recommended for full functionality:

#### AWS S3 (for file uploads):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION=us-east-1`
- `S3_BUCKET_NAME=oneworld-prod`

#### Email Service (Postmark):
- `POSTMARK_API_KEY`
- `POSTMARK_FROM_EMAIL=training@oneworld.com`

#### OAuth/SSO:
- `OAUTH_CLIENT_ID`
- `OAUTH_CLIENT_SECRET`
- `OAUTH_CALLBACK_URL=https://oneworld-lms-production.up.railway.app/sso`

#### CORS & Client:
- `CORS_ALLOWED_ORIGINS=https://training.oneworld.com,https://oneworld-lms-v3.webflow.io`
- `CLIENT_URL=https://training.oneworld.com`

---

## Next Steps

### 1. Data Migration (Manual Process)
The database is currently empty. You need to migrate data from the old LMS:

**Option A: JSON Export/Import**
```bash
# On old server - export data
mongoexport --uri="OLD_MONGO_URI" --collection=users --out=users.json
mongoexport --uri="OLD_MONGO_URI" --collection=courses --out=courses.json
# ... repeat for all collections

# Import to Atlas
mongoimport --uri="mongodb+srv://oneworld_user:PASSWORD@unifiedlms.lvywnng.mongodb.net/oneworld-lms" --collection=users --file=users.json
```

**Option B: MongoDB dump/restore**
```bash
# Dump from old server
mongodump --uri="OLD_MONGO_URI" --out=./oneworld-backup

# Restore to Atlas
mongorestore --uri="mongodb+srv://oneworld_user:PASSWORD@unifiedlms.lvywnng.mongodb.net/oneworld-lms" ./oneworld-backup
```

### 2. Update Webflow Site
Point the Webflow frontend to the new Railway API:

1. Open Webflow project settings
2. Update API endpoint URL from old server to: `https://oneworld-lms-production.up.railway.app/api/graphql`
3. Test authentication flow
4. Test course access
5. Publish changes

### 3. Configure Remaining Services

#### S3 File Storage:
- Add AWS credentials to Railway environment
- Verify bucket permissions allow Railway's IP
- Test file upload functionality

#### Email Service:
- Add Postmark API key
- Test password reset emails
- Test notification emails

#### SSO/OAuth:
- Update OneWorld OAuth configuration to allow Railway callback URL
- Add OAuth credentials to Railway
- Test SSO login flow

### 4. DNS Cutover (When Ready)
Once fully tested, you can point the production domain:

1. Update DNS for `training.oneworld.com` to point to Railway
2. OR use Railway's custom domain feature
3. Update CORS and OAuth callback URLs accordingly

### 5. Monitoring & Maintenance
- Monitor Railway logs for errors: https://railway.app/
- Set up log retention if needed
- Monitor MongoDB Atlas metrics
- Set up alerts for downtime

---

## Testing Checklist

Before going live with production traffic:

- [ ] Data successfully migrated from old LMS
- [ ] User authentication works (login/logout)
- [ ] Course enrollment works
- [ ] Course progress tracking works
- [ ] File uploads work (certificates, media)
- [ ] Email notifications work (password reset, etc.)
- [ ] SSO login works
- [ ] Webflow frontend connects successfully
- [ ] CORS allows Webflow domain
- [ ] Performance is acceptable (query response times)

---

## Known Issues & Limitations

### TypeScript Build Warnings
The build shows type errors in middleware files but successfully compiles JavaScript. These are pre-existing errors from the original codebase and do not affect functionality:
- `src/modules/middleware/graphql-rate-limit.ts(74,3)` - Apollo plugin type mismatch
- `src/modules/middleware/rate-limit.ts` - Express Request type augmentation

**Impact:** None - server runs correctly
**Resolution:** Not fixed per "no code changes" migration policy

### GraphQL Introspection Disabled
GraphQL schema introspection is disabled in production for security. This is correct behavior.

**Impact:** Apollo Studio and GraphQL Playground cannot auto-fetch schema
**Resolution:** This is intentional and secure. Developers can enable temporarily if needed.

### Client Package Not Running
The xAtom client package builds but doesn't run on Railway (tries to open browser).

**Impact:** None - Webflow hosts the frontend separately
**Resolution:** Start command only runs server, not client

---

## Architecture Notes

### Why This Approach?
- **Separate Repos:** Each LMS gets its own repository for clean isolation
- **No Code Changes:** Verbatim migration reduces risk and testing burden
- **Railway + Atlas:** Simple deployment, no AWS complexity
- **Frozen Codebase:** Stopgap while unified platform is being built

### Migration Template
This OneWorld deployment serves as a template for migrating the remaining 10 LMS systems:
1. Fiji
2. IPrefer
3. Pure Grenada
4. LATAM
5. Malta
6. Kenya
7. Pittsburgh
8. Seattle
9. Epic Pass
10. Boilerplate

See `MIGRATION_TEMPLATE.md` for step-by-step replication guide.

---

## Support & Troubleshooting

### Common Issues

**Server won't start:**
- Check Railway logs for specific error
- Verify `DATABASE_URL` is correct
- Verify `JWT_SECRET` is set
- Verify `API_PORT=${{PORT}}` is set

**502 Bad Gateway:**
- Server crashed - check Railway logs
- Port binding issue - verify `API_PORT` variable
- MongoDB connection failed - check Atlas IP whitelist

**CORS errors from Webflow:**
- Add Webflow domain to `CORS_ALLOWED_ORIGINS`
- Ensure domain format is correct (https://)

**GraphQL queries fail:**
- Check JWT token is valid
- Verify user is authenticated
- Check query syntax

### Railway Resources
- Dashboard: https://railway.app/
- Logs: Click on deployment > View logs
- Metrics: Dashboard shows CPU, memory, network
- Restart: Click "Redeploy" to restart server

---

## Repository Information

- **GitHub:** https://github.com/antonmogul/oneworld-lms
- **Branch:** main
- **Build Command:** `yarn build` (Turborepo)
- **Start Command:** `yarn workspace server run start`

### Key Files
- `package.json` - Root workspace config
- `apps/server/` - GraphQL API server
- `apps/client/` - xAtom/Webflow integration (not deployed)
- `packages/orm/` - Prisma database models
- `.env.example` - Template for environment variables
- `RAILWAY_SETUP.md` - Detailed setup instructions
- `MIGRATION_TEMPLATE.md` - Guide for other LMS migrations

---

## Success Criteria ✅

- [x] Build completes without fatal errors
- [x] Server starts and stays running
- [x] GraphQL endpoint responds
- [x] MongoDB connection successful
- [x] Port binding works with Railway
- [x] Production environment configured
- [x] Documentation complete

**Status: DEPLOYMENT SUCCESSFUL** 🎉

Next: Complete data migration and cutover testing.
