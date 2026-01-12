import { randomInt } from "node:crypto";

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const DEFAULT_CODE_LENGTH = 6;
const MAX_RETRY_ATTEMPTS = 3;

export function generateCode(length: number = getDefaultCodeLength()): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = randomInt(0, CHARS.length);
    code += CHARS[randomIndex];
  }
  return code;
}

export async function generateUniqueCode(
  checkUniqueness: (code: string) => Promise<boolean>,
  length: number = getDefaultCodeLength(),
  maxRetries: number = MAX_RETRY_ATTEMPTS
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const code = generateCode(length);
    const isUnique = await checkUniqueness(code);

    if (isUnique) {
      return code;
    }
  }

  throw new Error(
    `Failed to generate unique code after ${maxRetries} attempts`
  );
}

function getDefaultCodeLength(): number {
  const codeLength = process.env.CODE_LENGTH;
  if (codeLength === undefined) {
    return DEFAULT_CODE_LENGTH;
  }

  const parsed = parseInt(codeLength, 10);
  if (isNaN(parsed) || parsed < 1) {
    return DEFAULT_CODE_LENGTH;
  }

  return parsed;
}
