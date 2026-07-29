// Shared admin-session cookie name. Kept in its own tiny, dependency-free
// module so the edge middleware can import it without pulling in zod/db.
export const ADMIN_COOKIE = "tb_admin_session";

// 8 hours — long enough for an events-team working session.
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 8;
