export const ADMIN_EMAILS = [
  'adminaren@gmail.com',
  'adminaarnav@gmail.com',
  'adminkarunya@gmail.com',
  'adminharshit@gmail.com',
] as const;

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized);
}

export function isUserAdmin(
  user?: { email?: string | null } | null,
  profile?: { role?: string | null } | null
): boolean {
  if (profile?.role === 'admin') return true;
  if (user?.email && isSuperAdminEmail(user.email)) return true;
  return false;
}
