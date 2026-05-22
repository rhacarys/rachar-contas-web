import { Anchor, Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layouts/AuthLayout";
import { LoginRequestSchema, type LoginRequest } from "../models/Schemas";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";

export function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginRequest>({
    validate: zodResolver(LoginRequestSchema),
    initialValues: { login: "", password: "" },
  });

  const handleSubmit = async (values: LoginRequest) => {
    try {
      setLoading(true);
      const { token } = await authService.login(values);
      setToken(token);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      form.setErrors({ login: "Credenciais inválidas" });
    } finally {
      setLoading(false);
    }
  };

  const subtitle = (
    <>
      Não tem uma conta?{" "}
      <Anchor component={Link} to="/register" size="sm">
        Crie uma agora
      </Anchor>
    </>
  );

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle={subtitle}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Login" placeholder="seu@email.com" required {...form.getInputProps("login")} />
        <PasswordInput label="Senha" placeholder="Sua senha" required mt="md" {...form.getInputProps("password")} />
        <Button fullWidth mt="xl" type="submit" loading={loading}>
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}
