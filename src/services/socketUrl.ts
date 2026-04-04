/**
 * Socket.IO gắn vào cùng origin với API (bỏ hậu tố /api).
 */
export function getSocketBaseUrl(): string {
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
  try {
    const u = new URL(base);
    let path = u.pathname.replace(/\/+$/, '');
    if (path.endsWith('/api')) {
      path = path.slice(0, -4) || '/';
    }
    u.pathname = path || '/';
    return u.origin;
  } catch {
    return 'http://localhost:8080';
  }
}
