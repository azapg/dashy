import {z} from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Dirección de correo inválida"),
  password: z.string().min(5, {
    message: "Tu contraseña debe tener por lo menos cinco dígitos"
  }),
  remember_me: z.boolean(),
})