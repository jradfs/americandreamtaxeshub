import { ValidationError } from "./error-handler";

// Common XSS attack patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:\s*[^,]+/gi,
];

// SQL Injection patterns
const SQL_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/gi,
  /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/gi,
  /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi,
  /exec(\s|\+)+(s|x)p\w+/gi,
];

interface SanitizeOptions {
  allowHtml?: boolean;
  maxLength?: number;
  trim?: boolean;
}

/**
 * Sanitizes a string value by removing potential XSS and SQL injection patterns
 */
export function sanitizeString(
  value: string,
  options: SanitizeOptions = {},
): string {
  if (typeof value !== "string") {
    return "";
  }

  let sanitized = value;

  // Trim if requested
  if (options.trim !== false) {
    sanitized = sanitized.trim();
  }

  // Remove XSS patterns unless HTML is allowed
  if (!options.allowHtml) {
    XSS_PATTERNS.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, "");
    });
  }

  // Always remove SQL injection patterns
  SQL_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  // Enforce maximum length if specified
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.slice(0, options.maxLength);
  }

  return sanitized;
}

/**
 * Sanitizes an object by recursively sanitizing all string values
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  options: SanitizeOptions = {},
): T {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = sanitizeString(value, options);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = sanitizeObject(value, options);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string"
          ? sanitizeString(item, options)
          : typeof item === "object"
            ? sanitizeObject(item, options)
            : item,
      );
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

/**
 * Sanitizes form data by cleaning all string values
 */
export function sanitizeFormData(
  formData: FormData,
  options: SanitizeOptions = {},
): FormData {
  const sanitized = new FormData();

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      sanitized.append(key, sanitizeString(value, options));
    } else {
      sanitized.append(key, value);
    }
  }

  return sanitized;
}

/**
 * Validates and sanitizes an email address
 */
export function sanitizeEmail(email: string): string {
  const sanitized = sanitizeString(email, { trim: true });

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    throw new ValidationError("Invalid email format");
  }

  return sanitized.toLowerCase();
}

/**
 * Sanitizes a filename to prevent directory traversal and invalid characters
 */
export function sanitizeFilename(filename: string): string {
  return sanitizeString(filename, { trim: true })
    .replace(/[/\\?%*:|"<>]/g, "-") // Replace invalid characters
    .replace(/\.{2,}/g, "."); // Prevent directory traversal
}
