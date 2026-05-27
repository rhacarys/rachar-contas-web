import { Box, Container, Paper, Text, Title } from "@mantine/core";
import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box bg="dark.8" mih="100vh" style={{ display: "flex", alignItems: "center" }}>
      <Container size={420} w="100%" py={40}>
        <Title ta="center" order={1} c="white">
          Rachar Contas
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
          A maneira mais fácil de organizar despesas em grupo.
        </Text>

        <Paper withBorder shadow="md" p={30} radius="md" bg="dark.7">
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
