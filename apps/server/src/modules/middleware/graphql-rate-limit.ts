import { ApolloServerPlugin, GraphQLRequestContext } from 'apollo-server-plugin-base';
import { Request } from 'express';

interface RateLimitState {
  [key: string]: {
    requests: number;
    resetTime: number;
  };
}

const rateLimitState: RateLimitState = {};

// Rate limiting configuration for different operations
const RATE_LIMITS = {
  // Authentication operations - strict limits
  publicLogin: { maxRequests: 5, windowMinutes: 15 },
  publicLoginSSO: { maxRequests: 5, windowMinutes: 15 },
  publicSignup: { maxRequests: 3, windowMinutes: 60 },
  verifyLoginOTP: { maxRequests: 5, windowMinutes: 15 },
  verifySignupOTP: { maxRequests: 5, windowMinutes: 15 },
  publicForgotPassword: { maxRequests: 3, windowMinutes: 60 },
  publicResetPassword: { maxRequests: 3, windowMinutes: 60 },
  publicResendLoginOTP: { maxRequests: 3, windowMinutes: 15 },
  
  // Admin operations - moderate limits
  adminLogin: { maxRequests: 10, windowMinutes: 15 },
  
  // Default for other operations
  default: { maxRequests: 100, windowMinutes: 1 },
};

const getClientIP = (req: Request): string => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
         'unknown';
};

const isRateLimited = (ip: string, operationName: string): boolean => {
  const config = RATE_LIMITS[operationName as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
  const key = `${ip}:${operationName}`;
  const now = Date.now();
  const windowMs = config.windowMinutes * 60 * 1000;

  if (!rateLimitState[key]) {
    rateLimitState[key] = {
      requests: 1,
      resetTime: now + windowMs,
    };
    return false;
  }

  const state = rateLimitState[key];

  // Reset window if expired
  if (now > state.resetTime) {
    state.requests = 1;
    state.resetTime = now + windowMs;
    return false;
  }

  // Check if limit exceeded
  if (state.requests >= config.maxRequests) {
    return true;
  }

  // Increment counter
  state.requests++;
  return false;
};

export const graphqlRateLimitPlugin = (): ApolloServerPlugin => ({
  requestDidStart() {
    return {
      didResolveOperation(requestContext: GraphQLRequestContext) {
        // Skip rate limiting if disabled
        if (process.env.ENABLE_RATE_LIMITING === 'false') {
          return;
        }

        const req = requestContext.context.req as Request;
        const operationName = requestContext.operationName;

        if (!operationName) return;

        const clientIP = getClientIP(req);
        
        // Check if this operation should be rate limited
        const shouldLimit = Object.keys(RATE_LIMITS).includes(operationName);
        
        if (shouldLimit && isRateLimited(clientIP, operationName)) {
          const config = RATE_LIMITS[operationName as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
          
          throw new Error(
            `Rate limit exceeded for ${operationName}. Maximum ${config.maxRequests} requests per ${config.windowMinutes} minute(s). Please try again later.`
          );
        }
      },
    };
  },
});

// Cleanup old entries periodically (run every hour)
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitState).forEach(key => {
    if (now > rateLimitState[key].resetTime) {
      delete rateLimitState[key];
    }
  });
}, 60 * 60 * 1000); // 1 hour