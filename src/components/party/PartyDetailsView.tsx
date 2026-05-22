import { usePartyBalances, useUserParties } from "@/hooks/useParties";
import { type ExpenseResponse } from "@/models/Schemas";
import { Alert, Button, Card, Container, Divider, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { ExpenseDrawer } from "./ExpenseDrawer";
import { PartyExpensesList } from "./PartyExpensesList";

export function PartyDetailsView({ partyId }: { partyId: string }) {
  const { data: parties } = useUserParties();
  const { data: balanceData, isLoading, error } = usePartyBalances(partyId);

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [expenseToEdit, setExpenseToEdit] = useState<ExpenseResponse | null>(null);

  const currentParty = parties?.find((p) => p.id === partyId);

  const handleOpenNew = () => {
    setExpenseToEdit(null);
    openDrawer();
  };

  const handleOpenEdit = (expense: ExpenseResponse) => {
    setExpenseToEdit(expense);
    openDrawer();
  };

  if (isLoading) return <Loader mt="xl" mx="auto" display="block" />;
  if (error) return <Alert color="red">Erro ao carregar dados do grupo.</Alert>;

  return (
    <Container py="xl" size="sm">
      <Stack gap={4} mb="xl">
        <Title order={2}>{currentParty?.name || "Grupo"}</Title>
        <Text size="sm" c="dimmed">
          Moeda padrão: {currentParty?.currencyCode}
        </Text>
      </Stack>

      {/* Balances */}
      <Title order={4} mb="md">
        Saldos dos Membros
      </Title>
      <Stack gap="sm" mb="xl">
        {balanceData?.balances?.map((member) => {
          const isDebtor = (member.balance ?? 0) < 0;
          return (
            <Card key={member.membershipId} withBorder p="sm" radius="md">
              <Group justify="space-between">
                <Text fw={500}>{member.alias}</Text>
                <Text fw={700} c={isDebtor ? "red" : "green"}>
                  {isDebtor
                    ? `Deve: ${currentParty?.currencyCode} ${Math.abs(member.balance ?? 0).toFixed(2)}`
                    : `Recebe: ${currentParty?.currencyCode} ${(member.balance ?? 0).toFixed(2)}`}
                </Text>
              </Group>
            </Card>
          );
        })}
      </Stack>

      <Divider my="xl" />

      {/* Expenses */}
      <Group justify="space-between" mb="md">
        <Title order={4}>Histórico de Despesas</Title>
        <Button size="xs" onClick={handleOpenNew}>
          + Novo Registro
        </Button>
      </Group>
      <PartyExpensesList partyId={partyId} onEdit={handleOpenEdit} />
      <ExpenseDrawer partyId={partyId} opened={drawerOpened} onClose={closeDrawer} expenseToEdit={expenseToEdit} />
    </Container>
  );
}
