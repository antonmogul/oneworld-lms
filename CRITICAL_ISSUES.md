# Critical Issues Tracker

This file tracks critical security and configuration issues identified in the OneWorld Alliance LMS codebase audit.

## Priority Levels
- 🔴 **CRITICAL**: Security vulnerabilities requiring immediate fix
- 🟠 **HIGH**: Important issues affecting system integrity
- 🟡 **MEDIUM**: Issues that should be fixed soon
- 🟢 **LOW**: Nice-to-have improvements

---

## 🔴 CRITICAL ISSUES

### ✅ 1. Hardcoded JWT Secret
**File**: `apps/server/src/config/global.ts:30-31`
**Description**: JWT secret is hardcoded in source code, exposing authentication system
**Impact**: Complete authentication bypass possible if source code is exposed
**Effort**: Low (30 minutes)
**Fix**: Move to environment variable
```typescript
// Current (INSECURE):
export const JWT_SECRET = "ztgsTfjSZxlaYItayMJjvLfaxy40K3NqlEd96rVULHFrkCC6HPl3wPehad7C80paaa";

// Should be:
export const JWT_SECRET = process.env.JWT_SECRET || (() => {
  throw new Error("JWT_SECRET environment variable is required");
})();
```

### ✅ 2. Hardcoded API Keys and URLs
**Files**: 
- `apps/server/src/config/global.ts:37-53` - S3 URLs, OAuth URLs, API endpoints
**Description**: Multiple service URLs and configurations hardcoded
**Impact**: Information disclosure, difficulty in environment management
**Effort**: Low (45 minutes)
**Fix**: Move all service configurations to environment variables

### ✅ 3. Missing Rate Limiting
**Files**: 
- `apps/server/src/modules/middleware/public/index.ts`
- `apps/server/src/modules/middleware/admin/index.ts`
**Description**: No rate limiting on authentication endpoints
**Impact**: Brute force attacks, API abuse, DoS vulnerability
**Effort**: Medium (2 hours)
**Fix**: Implement express-rate-limit or similar

---

## 🟠 HIGH PRIORITY ISSUES

### ❌ 4. Weak Password Reset Implementation
**File**: `apps/server/src/modules/graphql/admin/auth/index.ts:37`
**Description**: TODO comment indicates temporary/incomplete password reset
**Impact**: Account takeover vulnerability
**Effort**: Medium (3 hours)
**Fix**: Implement secure token-based password reset with expiration

### ❌ 5. Missing Input Validation
**Files**: Multiple GraphQL resolvers and API endpoints
**Description**: Insufficient input validation on user inputs
**Impact**: SQL injection, XSS, data corruption
**Effort**: High (4-6 hours)
**Fix**: Add comprehensive validation using joi or yup

### ❌ 6. CORS Configuration Issues
**File**: `apps/server/src/config/global.ts:10-24`
**Description**: Overly permissive CORS in development, hardcoded origins
**Impact**: Cross-origin attacks in development
**Effort**: Low (1 hour)
**Fix**: Use environment variables for allowed origins

---

## 🟡 MEDIUM PRIORITY ISSUES

### ❌ 7. Missing Email Implementation
**File**: `apps/server/src/modules/graphql/admin/notification/index.ts:97`
**Description**: TODO comment - email sending not implemented
**Impact**: Users don't receive notifications
**Effort**: Medium (2 hours)
**Fix**: Implement email service using Postmark API

### ❌ 8. Incomplete Error Handling
**Files**: Multiple files throughout codebase
**Description**: Inconsistent error handling patterns
**Impact**: Information leakage, poor user experience
**Effort**: High (4-6 hours)
**Fix**: Implement centralized error handling middleware

### ❌ 9. No Request Logging
**Description**: Missing audit trail for API requests
**Impact**: Cannot investigate security incidents
**Effort**: Low (1 hour)
**Fix**: Add winston or morgan logging

---

## 🟢 LOW PRIORITY ISSUES

### ❌ 10. Missing Tests
**Description**: No test files found in the repository
**Impact**: Regression risks, quality issues
**Effort**: Very High (20+ hours)
**Fix**: Add Jest/Mocha test suite with >80% coverage

### ❌ 11. Frontend TODOs
**Files**:
- `apps/client/src/modules/public/saved.ts:208` - Resume course from slide
- `apps/client/src/modules/public/courseView.ts:450,720` - Open popup implementation
- `apps/client/src/modules/admin/courseManager.ts:2056` - Course highlight preview
**Description**: Incomplete frontend features
**Impact**: Missing functionality
**Effort**: Medium (4 hours total)
**Fix**: Implement missing features

---

## Implementation Plan

### Phase 1: Critical Security (Day 1-2)
1. [ ] Fix JWT secret hardcoding
2. [ ] Move all configuration to environment variables
3. [ ] Add rate limiting to auth endpoints

### Phase 2: High Priority (Day 3-5)
4. [ ] Implement secure password reset
5. [ ] Add comprehensive input validation
6. [ ] Fix CORS configuration

### Phase 3: Medium Priority (Week 2)
7. [ ] Implement email notifications
8. [ ] Add centralized error handling
9. [ ] Set up request logging

### Phase 4: Improvements (Week 3+)
10. [ ] Add test suite
11. [ ] Complete frontend TODOs

---

## How to Use This File

1. **Before starting a fix**: Change `❌` to `🚧` (in progress)
2. **After completing a fix**: Change `🚧` to `✅` (completed)
3. **Each fix should be**: 
   - A separate commit with descriptive message
   - Tested locally before committing
   - Include any necessary .env.example updates

## Environment Variables Template

Create a `.env` file with these variables:
```env
# Security
JWT_SECRET=<generate-secure-random-string>
HASH_SALT=10

# Server
ENVIRONMENT=development
API_PORT=4020

# Database
DATABASE_URL=<your-mongodb-url>

# AWS S3
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
S3_BUCKET_NAME=<your-bucket>

# Email (Postmark)
POSTMARK_API_KEY=<your-api-key>
POSTMARK_FROM_EMAIL=training@oneworld.com

# OAuth
OAUTH_CLIENT_ID=<your-client-id>
OAUTH_CLIENT_SECRET=<your-client-secret>
OAUTH_CALLBACK_URL=<your-callback-url>

# URLs
CLIENT_URL=http://localhost:3050
ALLOWED_ORIGINS=http://localhost:3050,http://localhost:4020
```

---

## Commit Message Format

Use this format for each fix:
```
fix(security): [CRITICAL-1] Move JWT secret to environment variable

- Removed hardcoded JWT secret from global.ts
- Added JWT_SECRET to environment variables
- Updated .env.example with required variable
- Added validation to ensure JWT_SECRET is set

Resolves: CRITICAL_ISSUES.md#1
```