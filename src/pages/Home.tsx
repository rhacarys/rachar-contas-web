import { Button, Container, Group, Title } from "@mantine/core";
import { useAuthStore } from "../store/useAuthStore";

export function Home() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <Container py="xl">
      <Group justify="space-between">
        <Title order={1}>Dashboard</Title>
        <Button color="red" variant="light" onClick={logout}>
          Sair
        </Button>
      </Group>
      {/* Aqui virá a listagem de Grupos/Contas futuramente */}
    </Container>
  );
}
