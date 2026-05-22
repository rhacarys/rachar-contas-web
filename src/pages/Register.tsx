import { Anchor, Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layouts/AuthLayout";
import { type RegisterRequest, RegisterRequestSchema } from "../models/Schemas";
import { authService } from "../services/authService";

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterRequest>({
    validate: zodResolver(RegisterRequestSchema),
    initialValues: { name: "", login: "", password: "" },
  });

  const handleSubmit = async (values: RegisterRequest) => {
    try {
      setLoading(true);
      await authService.register(values);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      form.setErrors({ login: "Erro ao registrar, tente outro login" });
    } finally {
      setLoading(false);
    }
  };

  const subtitle = (
    <>
      Já possui uma conta?{" "}
      <Anchor component={Link} to="/login" size="sm">
        Faça login
      </Anchor>
    </>
  );

  return (
    <AuthLayout title="Criar Conta" subtitle={subtitle}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Nome" placeholder="Seu nome" required {...form.getInputProps("name")} />
        <TextInput label="Login" placeholder="seu@email.com" required mt="md" {...form.getInputProps("login")} />
        <PasswordInput
          label="Senha"
          placeholder="Mínimo 6 caracteres"
          required
          mt="md"
          {...form.getInputProps("password")}
        />
        <Button fullWidth mt="xl" type="submit" loading={loading}>
          Registrar
        </Button>
      </form>
    </AuthLayout>
  );
}
