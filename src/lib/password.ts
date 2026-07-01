import bcrypt from "bcryptjs";

// Kept separate from auth.ts (jose/cookies) so the edge middleware bundle
// never pulls in bcryptjs, which relies on Node APIs.
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
