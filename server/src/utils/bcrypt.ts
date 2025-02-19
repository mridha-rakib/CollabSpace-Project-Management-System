import bcrypt from "bcrypt";

export async function hashValue(value: string, saltRounds: number = 10) {
  return await bcrypt.hash(value, saltRounds);
}

export async function compareValue(value: string, hashedValue: string) {
  return await bcrypt.compare(value, hashedValue);
}
