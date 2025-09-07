import bcrypt from "bcryptjs";

export async function generateHash(password:string):Promise<string> {
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password,salt);

  return hash;
  
};

export async function comparePassword(password:string,hash:string):Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hash);

  return isMatch;
};