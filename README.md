# OneWorld Alliance LMS

OneWorld Alliance Learning Management System - Migrated to Railway + MongoDB Atlas infrastructure.

## 🚀 Deployment Status

- **Backend API**: Railway (`oneworld-lms-production.up.railway.app`)
- **Database**: MongoDB Atlas (`oneworld-lms` database)
- **Frontend**: training.oneworld.com (Webflow)
- **File Storage**: AWS S3

## 📋 Migration Information

This is a **stopgap migration** of the existing OneWorld LMS to new infrastructure:
- ✅ Clean GitHub repository (no old git history)
- ✅ Automated build pipeline (GitHub Actions)
- ✅ Railway deployment (auto-deploy on push to main)
- ✅ MongoDB Atlas database (shared cluster with unified platform)
- ❌ **No code changes** - codebase frozen for stability

**Purpose**: Gain full control over infrastructure while completing unified platform migration.

## 🏗️ Architecture

**Stack:**
- **Backend**: Express.js + Apollo GraphQL Server (Node 18)
- **Frontend**: xAtom + Webflow
- **Database**: MongoDB (Prisma ORM)
- **Build System**: Turborepo (monorepo with workspaces)
- **Package Manager**: Yarn

**Structure:**
```
apps/
├── client/         # xAtom/Webflow frontend
└── server/         # Express/GraphQL API
packages/
└── orm/            # Prisma schema and generated types
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Yarn
- MongoDB (local or Atlas)

### Installation

```bash
# Clone repository
git clone https://github.com/antonmogul/oneworld-lms.git
cd oneworld-lms

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
yarn db:gen

# Run development servers
yarn dev                  # Run all (client + server)
yarn client:dev          # Client only (port 3050)
yarn server:start        # Server only (port 4020)
```

## 🚢 Deployment (Railway)

### Automatic Deployment

Pushes to `main` branch automatically deploy to Railway.

### Build Process

1. GitHub Actions runs build test
2. Railway pulls latest code
3. Runs: `yarn install && yarn build`
4. Starts: `yarn server:start`

### Environment Variables

See `.env.example` for required variables. Configure in Railway dashboard:

**Critical Variables:**
- `DATABASE_URL` - MongoDB Atlas connection string
- `JWT_SECRET` - Generate new with `openssl rand -base64 32`
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` - S3 credentials
- `POSTMARK_API_KEY` - Email service
- `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET` - SSO credentials

### Manual Deployment

```bash
# Build locally
yarn build

# Deploy (Railway CLI)
railway up
```

## 📊 Database Management

### Prisma Commands

```bash
# Generate Prisma client
yarn db:gen

# Push schema changes
yarn db:push

# Pull schema from database
yarn db:pull

# Open Prisma Studio
yarn db:show
```

### MongoDB Atlas

Database: `oneworld-lms`
Cluster: `UnifiedLMS` (shared with unified platform)

## 🧪 Testing

```bash
# Run tests (if configured)
yarn test

# Build test
yarn build
```

## 📖 API Documentation

- **GraphQL Playground**: `https://oneworld-lms-production.up.railway.app/graphql`
- **Health Check**: `https://oneworld-lms-production.up.railway.app/health`

## 🔐 Security

- JWT-based authentication
- bcrypt password hashing (12 rounds)
- Rate limiting enabled
- CORS configured for whitelisted domains
- Session management with secure cookies

## 🐛 Troubleshooting

### Build Failures

1. Check GitHub Actions logs
2. Verify all dependencies in `package.json`
3. Check Railway build logs

### Database Connection Issues

1. Verify `DATABASE_URL` in Railway variables
2. Check MongoDB Atlas IP whitelist (`0.0.0.0/0` for Railway)
3. Ensure database name is `oneworld-lms`

### Runtime Errors

1. Check Railway logs: `railway logs`
2. Verify environment variables are set
3. Check S3 credentials if file uploads fail

## 📁 Important Files

- `turbo.json` - Turborepo configuration
- `package.json` - Root workspace configuration
- `apps/server/src/prod.js` - Production entry point
- `apps/client/xatom.json` - xAtom configuration
- `.github/workflows/build.yml` - CI/CD pipeline

## 🔗 Related Resources

- [Migration Template](./MIGRATION_TEMPLATE.md) - Guide for migrating other LMS instances
- [Railway Dashboard](https://railway.app)
- [MongoDB Atlas](https://cloud.mongodb.com)

## ⚠️ Important Notes

1. **No Code Changes**: This codebase is frozen - no improvements, bug fixes, or features
2. **Temporary Solution**: Will be replaced by unified platform
3. **Separate Deployment**: Each old LMS gets its own Railway service
4. **Shared Database Cluster**: All LMS instances share MongoDB Atlas cluster (different databases)

## 📞 Support

For issues or questions, contact the development team.

---

**Migration Date**: October 2025  
**Status**: Active (Stopgap)  
**Next Step**: Migrate to unified platform
