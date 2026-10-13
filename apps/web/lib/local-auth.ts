// Web Crypto keeps this verifier compatible with Next.js middleware.
const encoder = new TextEncoder();
export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const parts = encoded.split(':');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2-sha256' || parts[1] !== '600000'
    || !/^[a-f0-9]{32}$/.test(parts[2]) || !/^[a-f0-9]{64}$/.test(parts[3]) || password.length > 256) return false;
  const salt = Uint8Array.from(parts[2].match(/../g)!, b => parseInt(b, 16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:600000},key,256);
  const expected = Uint8Array.from(parts[3].match(/../g)!, b => parseInt(b,16));
  let diff = 0;
  new Uint8Array(bits).forEach((byte,i) => { diff |= byte ^ expected[i]; });
  return diff === 0;
}

// One configured administrator, one process: do not use this limiter for replicas.
export function createAttemptLimiter(now: () => number = Date.now) {
  let attempts = 0;
  let expires = 0;
  return {
    allow() {
      if (now() >= expires) { attempts = 0; expires = now() + 15 * 60 * 1000; }
      if (attempts >= 5) return false;
      attempts++;
      return true;
    },
    reset() { attempts = 0; expires = 0; }
  };
}
const limiter = createAttemptLimiter();
export async function authorizeLocal(credentials: Partial<Record<'username'|'password',unknown>>) {
  const username = process.env.LOCAL_AUTH_USER;
  const hash = process.env.LOCAL_AUTH_PASSWORD_HASH;
  if (!username || !hash || !process.env.AUTH_SECRET || !limiter.allow()) return null;
  if (typeof credentials.username !== 'string' || typeof credentials.password !== 'string') return null;
  // Verify even for unknown usernames to avoid a cheap username timing oracle.
  const valid = await verifyPassword(credentials.password, hash);
  if (!valid || credentials.username !== username) return null;
  limiter.reset();
  return {id:'local-admin',name:username,email:'local-admin@isp.invalid'};
}
