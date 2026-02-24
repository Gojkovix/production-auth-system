import { randomToken, sha256 } from "./tokens.js";

export function createEmailToken(hoursValid = 2) {
  const token = randomToken();
  const tokenHash = sha256(token);
  const exp = new Date(Date.now() + hoursValid * 60 * 60 * 1000);
  return { token, tokenHash, exp };
}
    