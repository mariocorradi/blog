// Simple password-based auth
// In production, use proper authentication

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'shereen2024'

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

// For client-side auth state
export const AUTH_COOKIE_NAME = 'blog_admin_auth'
