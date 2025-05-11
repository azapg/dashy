"use client";

import {IconBrain} from "@tabler/icons-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {ComponentProps} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {loginFormSchema} from "@/components/auth/login-form-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginUser} from "@/api/auth";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export function LoginForm({
  className,
  ...props
}: ComponentProps<"div">) {
  const router = useRouter()

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember_me: true
    }
  })

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const response = await loginUser(values)

      if(response.success) {
        router.push("/")
        toast("Se ha iniciado sesión exitosamente.")
      } else {
        toast(`${response.error}`)
      }
    } catch (error) {
      toast("Un error inesperado ha ocurrido. Por favor contacte con un administrador.")
      console.error('Error submitting form:', error);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  <IconBrain />
                </div>
                <span className="sr-only">Grupo Einsteins.</span>
              </a>
              <h1 className="text-xl font-bold">Bienvenido al Grupo Einsteins.</h1>
            </div>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="cat.lover@up.ac.pa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="shak@litas69" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        ¿No tienes una cuenta?{" "}
        <a href="/register" className="underline underline-offset-4">
          Regístrate aquí
        </a>
      </div>
    </div>
  )
}
