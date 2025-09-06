import { z} from "zod"


export const username = z.string().min(3,"Username must be atleast 3 characters").max(20,"Username must not be more than 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username must only contain letters, numbers and underscores");


export const signUpSchema = z.object({
  username:username,
  name:z.string().min(3, "Name must be atleast 3 characters"),
  email:z.string().email("Please Enter a Valid Email !"),
  password:z.string().min(8,"Password must be of 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character")
});