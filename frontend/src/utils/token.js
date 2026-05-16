/** Treat token as expired only after exp + small grace (avoids clock-skew logouts). */
const EXPIRY_GRACE_MS = 60_000;

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000 + EXPIRY_GRACE_MS;
  } catch {
    return false;
  }
};