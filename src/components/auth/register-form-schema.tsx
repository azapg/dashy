import {z} from "zod";

export const registerFormSchema = z.object({
  email: z.string().email("Dirección de correo inválida"),
  username: z.string().min(2, {
    message: "Tu nombre de usuario debe tener por lo menos dos dígitos"
  }),
  password: z.string().min(5, {
    message: "Tu contraseña debe tener por lo menos cinco dígitos"
  })
})