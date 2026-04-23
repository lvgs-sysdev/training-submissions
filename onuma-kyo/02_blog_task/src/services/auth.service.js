import { argon2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

const CONFIG = {
  parallelism: 4,
  tagLength: 64,
  memory: 65536,
  passes: 3,
  algorithm: 'argon2id',
};

export function hashPassword(password) {
  const nonce = randomBytes(16);
  const tag = argon2Sync(CONFIG.algorithm, {
    message: password,
    nonce,
    parallelism: CONFIG.parallelism,
    tagLength: CONFIG.tagLength,
    memory: CONFIG.memory,
    passes: CONFIG.passes,
  });
  return JSON.stringify({
    algorithm: CONFIG.algorithm,
    parallelism: CONFIG.parallelism,
    tagLength: CONFIG.tagLength,
    memory: CONFIG.memory,
    passes: CONFIG.passes,
    nonceHex: nonce.toString('hex'),
    tagHex: tag.toString('hex'),
  });
}

export function verifyPassword(storedStr, password) {
  const stored = JSON.parse(storedStr);
  const nonce = Buffer.from(stored.nonceHex, 'hex');
  const expected = Buffer.from(stored.tagHex, 'hex');
  const actual = argon2Sync(stored.algorithm, {
    message: password,
    nonce,
    parallelism: stored.parallelism,
    tagLength: stored.tagLength,
    memory: stored.memory,
    passes: stored.passes,
  });
  return timingSafeEqual(expected, actual);
}
