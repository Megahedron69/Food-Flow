const encoder = new TextEncoder();
const decoder = new TextDecoder();

const PIN_ITERATIONS = 210_000;
const HASH_ALGO = "SHA-256";

function toBase64Url(bytes: Uint8Array): string {
  const value = btoa(String.fromCharCode(...bytes));
  return value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function equalsConstantTime(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a[i] ^ b[i];
  }

  return mismatch === 0;
}

async function deriveHash(pin: string, salt: Uint8Array, iterations: number) {
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(pin), "PBKDF2", false, [
    "deriveBits"
  ]);

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: HASH_ALGO
    },
    keyMaterial,
    256
  );

  return new Uint8Array(bits);
}

export async function hashPin(pin: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveHash(pin, salt, PIN_ITERATIONS);

  return `pbkdf2$${PIN_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(hash)}`;
}

export async function verifyPin(pin: string, storedHash: string) {
  const [method, iterationValue, saltValue, hashValue] = storedHash.split("$");

  if (method !== "pbkdf2" || !iterationValue || !saltValue || !hashValue) {
    return false;
  }

  const iterations = Number(iterationValue);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return false;
  }

  const salt = fromBase64Url(saltValue);
  const expectedHash = fromBase64Url(hashValue);
  const candidateHash = await deriveHash(pin, salt, iterations);

  return equalsConstantTime(expectedHash, candidateHash);
}

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest(HASH_ALGO, encoder.encode(value));
  return toBase64Url(new Uint8Array(digest));
}

export function generateToken(byteLength = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return toBase64Url(bytes);
}

export function normalizeOutletCode(outletCode: string) {
  return outletCode.trim().toUpperCase();
}

export function sanitizeEmail(email: string | null | undefined) {
  if (!email) {
    return null;
  }

  const sanitized = email.trim().toLowerCase();
  return sanitized.length > 0 ? sanitized : null;
}

export function parseJsonBody<TBody>(rawBody: string): TBody {
  return JSON.parse(decoder.decode(encoder.encode(rawBody))) as TBody;
}
