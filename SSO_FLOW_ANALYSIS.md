# SSO Flow Analysis - OneWorld LMS

## Root Cause Identified

**The redirect to `oneworld-lms-v3.webflow.io` is NOT the desired behavior - it's a fallback default.** This occurs when the `CLIENT_URL` environment variable is not properly configured or when the `ENVIRONMENT` variable is not set to "staging" or "production".

---

## SSO Authentication Flow (Pseudo Code)

### **1. User Initiates SSO Login**

**Location:** `apps/client/src/modules/public/auth.ts:101-105`

```pseudocode
WHEN user clicks "Login with SSO" button:
    1. Build OAuth authorization URL:
       URL = OAUTH_AUTHORIZE_URL + query parameters

    2. Query parameters include:
       - type: "web_server"
       - client_id: OATH_CLIENT_ID
       - response_type: "code"
       - redirect_uri: OAUTH_CALLBACK_URL

    3. Redirect browser to this URL
```

**URLs Involved (Client Side):**
- **Production:** `https://bi.oneworld.com/opass/oauth/authorize`
- **Staging/Dev:** `https://bi-siteacceptance.oneworld.com/opass/oauth/authorize`
- **Callback URL (Production):** `https://oneworld-api.devlab.zone/sso`
- **Callback URL (Dev):** `https://oneworld-dev.devlab.zone/sso`

---

### **2. OneWorld OAuth Server Authenticates User**

```pseudocode
OneWorld OAuth Server:
    1. User provides credentials to OneWorld
    2. If authentication succeeds:
       Generate authorization code
    3. Redirect back to our OAUTH_CALLBACK_URL with code parameter
       Example: https://oneworld-dev.devlab.zone/sso?code=ABC123
```

**OneWorld URLs:**
- **Authorization (Production):** `https://bi.oneworld.com/opass/oauth/authorize`
- **Authorization (Staging):** `https://bi-siteacceptance.oneworld.com/opass/oauth/authorize`

---

### **3. Server Receives Callback & Exchanges Code for Token**

**Location:** `apps/server/src/modules/services/api-server/index.ts:48-127`

```pseudocode
ENDPOINT: GET /sso

    1. Extract authorization code from query parameters

    2. Prepare token exchange request:
       POST to OATH_TOKEN_URL with:
       - grant_type: "authorization_code"
       - type: "web_server"
       - client_id: from env.OATH_CLIENT_ID
       - client_secret: from env.OATH_CLIENT_SECRET
       - redirect_uri: OAUTH_CALLBACK_URL
       - code: received authorization code

    3. Receive access_token from OneWorld

    4. Use access_token to fetch user profile:
       GET PROFILE_API_URL
       Headers: Authorization: "Bearer {access_token}"

    5. Extract user data from profile response:
       - Email
       - FirstName
       - LastName
       - AirlineCode (optional)

    6. Check if user exists in database:
       QUERY: SELECT * FROM users WHERE email = profile.Email (case insensitive)

    7. IF user does NOT exist:
       a. Find airline by AirlineCode (or default to "OT")
       b. CREATE new user record:
          - email: profile.Email (lowercase)
          - firstName: profile.FirstName
          - lastName: profile.LastName
          - airlineId: airline.id
          - ssoLogin: true

    8. Encode email in Base64 for URL parameter

    9. ⚠️ CRITICAL REDIRECT:
       REDIRECT to: {CLIENT_URL}/user/sign-in?sso=1&email={base64Email}&newUser={isNewUser}

    EXCEPTION HANDLING:
       IF any error occurs:
          REDIRECT to: {CLIENT_URL}/user/sign-in?sso=0
```

**OneWorld URLs:**
- **Token Exchange (Production):** `https://bi.oneworld.com/opass/oauth/token`
- **Token Exchange (Staging):** `https://bi-siteacceptance.oneworld.com/opass/oauth/token`
- **Profile API (Production):** `https://bi.oneworld.com/opass/api/profile`
- **Profile API (Staging):** `https://bi-siteacceptance.oneworld.com/opass/api/profile`

**Your API Callback URLs:**
- **Production:** `https://oneworld-api.devlab.zone/sso`
- **Dev:** `https://oneworld-dev.devlab.zone/sso`

---

### **4. User Lands Back on Client & Completes Login**

**Location:** `apps/client/src/modules/public/auth.ts:16-95`

```pseudocode
PAGE: /user/sign-in with query parameters

    1. Parse URL parameters:
       - sso: 0 (failed), 1 (success), or 2 (none)
       - email: Base64 encoded email
       - newUser: "true" or "false"

    2. IF sso === 1 AND email exists:
       a. Decode email from Base64
       b. Call GraphQL mutation: PublicLoginSSO
          INPUT: { email: decoded email }
       c. Receive response with:
          - firstName
          - lastName
          - token (JWT)
       d. Store authentication details locally
       e. IF newUser === true:
          Navigate to: /user/dashboard/on-boarding
       ELSE:
          Navigate to: /user/dashboard/main

    3. IF sso === 0:
       Display error: "Something went wrong with SSO login!"
```

---

## **The Problem: CLIENT_URL Configuration**

**Location:** `apps/server/src/config/global.ts:96-101`

```javascript
export const CLIENT_URL = process.env.CLIENT_URL ||
  (process.env.ENVIRONMENT === "production"
    ? "https://training.oneworld.com"
    : process.env.ENVIRONMENT === "staging"
      ? "https://oneworld.devlab.zone"
      : "https://oneworld-lms-v3.webflow.io");  // ⚠️ DEFAULT FALLBACK
```

### **Current Behavior:**

```pseudocode
IF environment variable CLIENT_URL is set:
    USE that value
ELSE IF ENVIRONMENT === "production":
    USE "https://training.oneworld.com"
ELSE IF ENVIRONMENT === "staging":
    USE "https://oneworld.devlab.zone"
ELSE:
    USE "https://oneworld-lms-v3.webflow.io"  // ⚠️ WEBFLOW FALLBACK
```

---

## **URL Summary by Environment**

### **Production Environment:**
- **Client URL:** `https://training.oneworld.com`
- **API Server:** `https://oneworld-api.devlab.zone`
- **SSO Callback:** `https://oneworld-api.devlab.zone/sso`
- **OneWorld OAuth:** `https://bi.oneworld.com/opass/oauth/*`

### **Staging Environment (Expected):**
- **Client URL:** `https://oneworld.devlab.zone`
- **API Server:** `https://oneworld-staging.devlab.zone`
- **SSO Callback:** Should be `https://oneworld-staging.devlab.zone/sso` (check env)
- **OneWorld OAuth:** `https://bi-siteacceptance.oneworld.com/opass/oauth/*`

### **Dev/Default Environment:**
- **Client URL:** `https://oneworld-lms-v3.webflow.io` ⚠️ **This is what you're seeing**
- **API Server:** `https://oneworld-dev.devlab.zone`
- **SSO Callback:** `https://oneworld-dev.devlab.zone/sso`
- **OneWorld OAuth:** `https://bi-siteacceptance.oneworld.com/opass/oauth/*`

---

## **Why Users Are Being Redirected to Webflow**

The Webflow URL (`oneworld-lms-v3.webflow.io`) is showing up because **one of these conditions is true**:

1. The `ENVIRONMENT` variable in eWorld staging is **not set to "staging"**
2. The `CLIENT_URL` environment variable is **not explicitly set**
3. The environment is defaulting to the development configuration

This causes line 122 in `api-server/index.ts` to use the Webflow URL:
```javascript
res.redirect(`${CLIENT_URL}/user/sign-in?sso=1&email=...&newUser=...`);
```

---

## **Solution**

Add or verify these environment variables in the eWorld staging environment:

```bash
# Option 1: Set CLIENT_URL explicitly
CLIENT_URL=https://oneworld.devlab.zone

# Option 2: Set ENVIRONMENT to staging (will auto-select correct CLIENT_URL)
ENVIRONMENT=staging

# Also ensure SSO callback matches
OAUTH_CALLBACK_URL=https://oneworld-staging.devlab.zone/sso
```

---

## **Configuration Files Reference**

1. **Server Config:** `apps/server/src/config/global.ts`
2. **Client Config:** `apps/client/src/config.ts`
3. **SSO Handler:** `apps/server/src/modules/services/api-server/index.ts:48-127`
4. **Client Auth:** `apps/client/src/modules/public/auth.ts:16-105`
5. **Environment Template:** `.env.example`

---

## **Next Steps**

1. Confirm with eWorld team the current environment variable values
2. Set the appropriate environment variables based on the solution above
3. Test SSO login flow after configuration changes
4. Verify redirect goes to correct domain (oneworld.devlab.zone for staging)
