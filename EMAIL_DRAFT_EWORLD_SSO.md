# Email Draft - eWorld SSO Environment Variables

---

**Subject:** SSO Redirect Issue - Environment Variable Verification Needed

---

Hi [eWorld Team],

We've been investigating an SSO authentication issue where users are being redirected to `oneworld-lms-v3.webflow.io` after successful SSO login, instead of the expected staging domain (`oneworld.devlab.zone`).

## Issue Summary

After analyzing the SSO flow (documented in attached SSO_FLOW_ANALYSIS.md), we've identified that the redirect behavior is controlled by environment variables on your server, specifically the `CLIENT_URL` and `ENVIRONMENT` variables.

Currently, when the SSO callback endpoint processes a successful authentication, it uses the `CLIENT_URL` environment variable to determine where to redirect the user. Based on the redirect behavior we're seeing, it appears the configuration may be falling back to the default development settings.

## Action Needed

Could you please verify the following environment variables are correctly set in your **staging environment**:

```bash
# Primary option - Explicit CLIENT_URL
CLIENT_URL=https://oneworld.devlab.zone

# Alternative - ENVIRONMENT variable (auto-selects CLIENT_URL)
ENVIRONMENT=staging

# Also verify SSO callback URL
OAUTH_CALLBACK_URL=https://oneworld-staging.devlab.zone/sso
```

### Expected Configuration by Environment:

**Staging:**
- `ENVIRONMENT=staging`
- `CLIENT_URL=https://oneworld.devlab.zone` (or let ENVIRONMENT auto-select it)
- `OAUTH_CALLBACK_URL=https://oneworld-staging.devlab.zone/sso`

**Production:**
- `ENVIRONMENT=production`
- `CLIENT_URL=https://training.oneworld.com` (or let ENVIRONMENT auto-select it)
- `OAUTH_CALLBACK_URL=https://oneworld-api.devlab.zone/sso`

## Code Reference

The redirect logic is in `apps/server/src/config/global.ts` lines 96-101:

```javascript
export const CLIENT_URL = process.env.CLIENT_URL ||
  (process.env.ENVIRONMENT === "production"
    ? "https://training.oneworld.com"
    : process.env.ENVIRONMENT === "staging"
      ? "https://oneworld.devlab.zone"
      : "https://oneworld-lms-v3.webflow.io");  // Webflow is the default fallback
```

## What We Need

Please confirm:
1. What is the current value of `ENVIRONMENT` in your staging environment?
2. What is the current value of `CLIENT_URL` in your staging environment? (if set)
3. What is the current value of `OAUTH_CALLBACK_URL`?

We're also investigating on our end to ensure there are no issues with our codebase, but wanted to verify the environment configuration first as it's the most likely cause.

I've attached a detailed SSO flow analysis document that maps out the entire authentication process with all relevant URLs and configuration points.

Please let us know if you have any questions or need clarification on any of these settings.

Thanks for your help!

Best regards,
[Your Name]

---

**Attachments:**
- SSO_FLOW_ANALYSIS.md

---

## Alternative - Shorter Version

**Subject:** Quick Check - SSO Environment Variables

Hi [eWorld Team],

We're investigating an SSO redirect issue where users land on `oneworld-lms-v3.webflow.io` instead of `oneworld.devlab.zone` after authentication.

Could you please confirm these environment variables in your **staging** environment:

- `ENVIRONMENT` - should be set to: `staging`
- `CLIENT_URL` - should be set to: `https://oneworld.devlab.zone`
- `OAUTH_CALLBACK_URL` - should be: `https://oneworld-staging.devlab.zone/sso`

The Webflow URL is our development fallback, and the redirect suggests one of these might not be configured correctly.

We're investigating on our end as well, but wanted to rule out environment config first.

Thanks!
[Your Name]
