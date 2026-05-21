import { Container, Paper, Text, Title } from "@mantine/core";
import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: ReactNode;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <Container size={420} my={40}>
      <Title ta="center" order={2}>
        {title}
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
        {subtitle}
      </Text>
      <Paper withBorder shadow="md" p={30} radius="md">
        {children}
      </Paper>
    </Container>
  );
}
