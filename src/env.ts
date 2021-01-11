import { config } from 'dotenv';

config();

const parseOrReturnDefaultNumber = (defaultNumber: number, envVar?: string) => {
  if (typeof envVar === 'string') {
    return Number.parseInt(envVar);
  }

  return defaultNumber;
};

export const { DB_CONN, JWT_SECRET, REDIS_HOST } = process.env;
export const PORT = parseOrReturnDefaultNumber(4000, process.env.PORT);
export const REDIS_PORT = parseOrReturnDefaultNumber(
  6379,
  process.env.REDIS_PORT,
);
export const BCRYPT_ROUNDS = parseOrReturnDefaultNumber(
  12,
  process.env.BCRYPT_ROUNDS,
);
