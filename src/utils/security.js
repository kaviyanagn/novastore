/**
 * Security Utilities: Input Sanitization & Safe API Practices
 * Topics: Performance, Security, Safe API
 */

/**
 * Strips dangerous HTML tags and script execution payloads from string inputs
 * @param {string} input 
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '') // remove inline event handlers like onerror=, onclick=
    .trim();
}

/**
 * Validates and sanitizes customer information submitted in checkout forms
 * @param {Object} customerInfo 
 * @returns {Object} Sanitized object with validation status
 */
export function sanitizeCustomerInfo(customerInfo) {
  const sanitized = {
    fullName: sanitizeInput(customerInfo.fullName || ''),
    email: sanitizeInput(customerInfo.email || ''),
    phone: sanitizeInput(customerInfo.phone || ''),
    address: sanitizeInput(customerInfo.address || ''),
    city: sanitizeInput(customerInfo.city || ''),
    zipCode: sanitizeInput(customerInfo.zipCode || ''),
    paymentMethod: sanitizeInput(customerInfo.paymentMethod || 'card'),
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
  const zipRegex = /^[a-zA-Z0-9\s-]{3,10}$/;

  const errors = {};
  if (!sanitized.fullName || sanitized.fullName.length < 2) {
    errors.fullName = "Full name is required (minimum 2 characters)";
  }
  if (!sanitized.email || !emailRegex.test(sanitized.email)) {
    errors.email = "Valid email address is required";
  }
  if (!sanitized.phone || !phoneRegex.test(sanitized.phone)) {
    errors.phone = "Valid phone number is required";
  }
  if (!sanitized.address || sanitized.address.length < 5) {
    errors.address = "Shipping address is required (minimum 5 characters)";
  }
  if (!sanitized.city || sanitized.city.length < 2) {
    errors.city = "City is required";
  }
  if (!sanitized.zipCode || !zipRegex.test(sanitized.zipCode)) {
    errors.zipCode = "Valid ZIP/postal code is required";
  }

  return {
    sanitized,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

/**
 * Masks credit card or sensitive token numbers for secure display
 * @param {string} str 
 * @returns {string} Masked string
 */
export function maskSensitiveData(str) {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= 4) return '****';
  return '•'.repeat(Math.max(0, str.length - 4)) + str.slice(-4);
}

/**
 * Ensures API endpoints are strictly relative or match allowed trusted base domains
 * @param {string} url 
 * @param {string[]} allowedDomains 
 * @returns {boolean} True if safe
 */
export function isSafeApiUrl(url, allowedDomains = ['https://dummyjson.com']) {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('/')) return true; // Relative API URL
  try {
    const parsed = new URL(url);
    return allowedDomains.some((domain) => parsed.origin === new URL(domain).origin);
  } catch {
    return false;
  }
}
