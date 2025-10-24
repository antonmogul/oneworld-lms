import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

// Get rate limit configuration from environment variables
const getRateLimitConfig = () => {
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || "100", 10);
  const windowMinutes = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || "1", 10);
  const enabled = process.env.ENABLE_RATE_LIMITING !== "false";
  
  return { maxRequests, windowMinutes, enabled };
};

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: getRateLimitConfig().windowMinutes * 60 * 1000,
  max: getRateLimitConfig().maxRequests,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  skip: () => !getRateLimitConfig().enabled, // Skip if rate limiting is disabled
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many requests",
      message: "You have exceeded the rate limit. Please try again later.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Stricter rate limit for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful auth attempts
  skip: () => !getRateLimitConfig().enabled,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many authentication attempts",
      message: "You have exceeded the maximum number of authentication attempts. Please try again in 15 minutes.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Very strict rate limit for password reset endpoints
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: "Too many password reset requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !getRateLimitConfig().enabled,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many password reset requests",
      message: "You have exceeded the maximum number of password reset requests. Please try again in 1 hour.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

// Rate limiter for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 upload requests per 10 minutes
  message: "Too many upload requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !getRateLimitConfig().enabled,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many upload requests",
      message: "You have exceeded the maximum number of upload requests. Please try again later.",
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});