import * as bcrypt from 'bcrypt';

/**
 * Encrypts plain password
 * @param plainPassword
 */
export const hashPassword = async (plainPassword: string): Promise<string> =>
  bcrypt.hash(plainPassword, 10);

/**
 * Compares plain and hashed passwords
 * @param plainPassword
 * @param hashedPassword
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => bcrypt.compare(plainPassword, hashedPassword);
