# Railway Deployment - Quick Setup Guide

## Current Status
✅ GitHub repository created: `antonmogul/oneworld-lms`  
✅ Railway service created  
✅ Build succeeds  
⚠️ **ACTION NEEDED:** Add missing environment variable

## IMMEDIATE ACTION REQUIRED

Railway needs the `API_PORT` environment variable to match Railway's dynamically assigned port.

### Add This Variable in Railway Dashboard:

1. Go to your Railway project: https://railway.app/
2. Select the `oneworld-lms` service
3. Click on "Variables" tab
4. Add this variable:

```
API_PORT=${{PORT}}
```

This tells the server to use Railway's dynamically assigned PORT instead of the hardcoded 4021.

### After Adding API_PORT:

Railway will automatically redeploy. You should see:
- Server starts successfully
- GraphQL endpoint accessible at: https://oneworld-lms-production.up.railway.app/api/graphql

## All Required Environment Variables

Copy these from your old server or `.env.example`:

### Critical (Server won't start without these):
- `DATABASE_URL` - MongoDB Atlas connection string ✅ (already added)
- `JWT_SECRET` - Generate new with: `openssl rand -base64 32` ✅ (already added)
- `API_PORT=${{PORT}}` - ⚠️ **ADD THIS NOW**
- `ENVIRONMENT=production` - Set environment mode

### AWS S3 (for file uploads):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION=us-east-1`
- `S3_BUCKET_NAME=oneworld-prod`

### Email (Postmark):
- `POSTMARK_API_KEY`
- `POSTMARK_FROM_EMAIL=training@oneworld.com`

### OAuth/SSO:
- `OAUTH_CLIENT_ID`
- `OAUTH_CLIENT_SECRET`
- `OAUTH_CALLBACK_URL=https://oneworld-lms-production.up.railway.app/sso`

### Optional but Recommended:
- `CORS_ALLOWED_ORIGINS=https://training.oneworld.com,https://oneworld-lms-v3.webflow.io`
- `CLIENT_URL=https://training.oneworld.com`
- `NODE_ENV=production`

## Testing After Deployment

Once `API_PORT` is added and deployment succeeds:

1. **Test GraphQL endpoint:**
   ```bash
   curl https://oneworld-lms-production.up.railway.app/api/graphql
   ```

2. **Open GraphQL Playground:**
   https://oneworld-lms-production.up.railway.app/api/graphql

3. **Test a simple query:**
   ```graphql
   query {
     __schema {
       types {
         name
       }
     }
   }
   ```

## Next Steps After Server is Running

1. Update Webflow site to point to new API URL
2. Test login/authentication flow
3. Test course access
4. Test file uploads (verify S3 credentials)
5. Test SSO integration
6. Monitor Railway logs for any errors

## Troubleshooting

If deployment still fails after adding `API_PORT`:
- Check Railway logs for specific error messages
- Verify MongoDB Atlas allows Railway's IP addresses
- Verify all required env vars are set
- Check that JWT_SECRET is set (server will crash without it)
