export const isProduction =
  process.env.ENVIRONMENT === "production";

export const API_PORT = parseInt(process.env.API_PORT || (process.env.ENVIRONMENT === "production" || process.env.ENVIRONMENT === "staging" ? "4021" : "4020"), 10);

export const API_URL = "/api/";

export const GRAPHQL_URL = "/api/graphql";

// Parse CORS allowed origins from environment variable
const getAllowedOrigins = () => {
  const envOrigins = process.env.CORS_ALLOWED_ORIGINS;
  if (envOrigins) {
    return envOrigins.split(',').map(origin => origin.trim());
  }
  // Default origins based on environment
  return isProduction
    ? ["https://oneworld-lms-v3.webflow.io", "https://oneworld.devlab.zone", "https://training.oneworld.com"]
    : [
        "http://localhost:3050",
        "http://localhost:4020",
        "https://studio.apollographql.com",
        "https://oneworld-lms-v3.webflow.io",
        "https://oneworld.devlab.zone"
      ];
};

export const CORS_CONFIG = {
  credentials: true,
  origin: getAllowedOrigins(),
};

export const COOKIE_PREFIX = "@ow";

export const HASH_SALT = parseInt(process.env.HASH_SALT || "10", 10);

// JWT Secret must be provided via environment variable for security
export const JWT_SECRET = process.env.JWT_SECRET || (() => {
  if (process.env.NODE_ENV === "production" || process.env.ENVIRONMENT === "production") {
    throw new Error("CRITICAL: JWT_SECRET environment variable is required in production");
  }
  console.warn("WARNING: Using default JWT_SECRET for development only. Set JWT_SECRET env variable.");
  return "development-only-jwt-secret-do-not-use-in-production";
})();

export const S3_SIGNED_URL_EXPIRATION_TIME = 60 * 60; // 1 hour

export const S3_MEDIA_FOLDER_NAME = process.env.S3_MEDIA_FOLDER_NAME || "public-media";

// S3 bucket configuration
const getS3BaseUrl = () => {
  if (process.env.S3_BASE_URL) {
    return process.env.S3_BASE_URL;
  }
  // Default URLs based on environment
  const bucketName = process.env.S3_BUCKET_NAME || 
    (process.env.ENVIRONMENT === "production" ? "oneworld-prod" : 
     process.env.ENVIRONMENT === "staging" ? "oneworld-staging" : 
     "oneworld-dev");
  
  const region = process.env.AWS_REGION || "us-east-1";
  return `https://${bucketName}.s3.${region}.amazonaws.com/`;
};

export const S3_BASE_URL = getS3BaseUrl();

// Email configuration
export const POSTMARK_EMAIL_API_ENDPOINT = process.env.POSTMARK_API_ENDPOINT || "https://api.postmarkapp.com";

export const POSTMARK_FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL || "training@oneworld.com";

// OAuth configuration
export const OAUTH_AUTHORIZE_URL = process.env.OAUTH_AUTHORIZE_URL || 
  (isProduction 
    ? "https://bi.oneworld.com/opass/oauth/authorize" 
    : "https://bi-siteacceptance.oneworld.com/opass/oauth/authorize");

export const OATH_TOKEN_URL = process.env.OAUTH_TOKEN_URL || 
  (isProduction 
    ? "https://bi.oneworld.com/opass/oauth/token"
    : "https://bi-siteacceptance.oneworld.com/opass/oauth/token");

export const OAUTH_REVOKE_URL = process.env.OAUTH_REVOKE_URL || "";

export const OAUTH_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL || 
  (process.env.ENVIRONMENT === "production" 
    ? "https://oneworld-api.devlab.zone/sso" 
    : "https://oneworld-dev.devlab.zone/sso");

export const PROFILE_API_URL = process.env.OAUTH_PROFILE_URL || 
  (isProduction 
    ? "https://bi.oneworld.com/opass/api/profile" 
    : "https://bi-siteacceptance.oneworld.com/opass/api/profile");

// Client URL configuration
export const CLIENT_URL = process.env.CLIENT_URL || 
  (process.env.ENVIRONMENT === "production" 
    ? "https://training.oneworld.com" 
    : process.env.ENVIRONMENT === "staging" 
      ? "https://oneworld.devlab.zone" 
      : "https://oneworld-lms-v3.webflow.io");