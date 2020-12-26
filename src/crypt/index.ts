import { compare, hash } from 'bcrypt';
import * as Env from '../env';

export const compareDataToHash = async (data: unknown, hash: string) => {
  return compare(data, hash);
};

export const createHash = async (data: unknown) =>
  hash(data, Env.BCRYPT_ROUNDS);
