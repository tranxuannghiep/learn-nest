import * as bcrypt from 'bcrypt';

export async function encodePassword(rawPassword: string) {
  const salt = await bcrypt.genSaltSync();
  return bcrypt.hashSync(rawPassword, salt);
}

export async function comparePassword(rawPassword: string, hash: string) {
  return bcrypt.compareSync(rawPassword, hash);
}
