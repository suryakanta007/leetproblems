import {z} from "zod"
export const SignUpSchema = z.object({
    email:z.string().email("Enter a valid email."),
    password:z.string().min(6,"Passowrd must be 6 characters"),
    name:z.string().min(3,"Name must be atleast 3 character.")
})

