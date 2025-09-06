import {z} from "zod"


export const verifySchema = z.object({
  code:z.string().min(6,"Code must be of 6 characters").max(6,"Code must be of 6 characters").regex(/^[0-9]+$/, "Code must only contain numbers")
})