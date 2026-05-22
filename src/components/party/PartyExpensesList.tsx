import { useDeleteExpense, usePartyExpenses } from "@/hooks/useExpenses";
import { usePartyBalances } from "@/hooks/useParties";
import { type ExpenseResponse } from "@/models/Schemas";
import { ActionIcon, Badge, Card, Group, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface PartyExpensesListProps {
  partyId: string;
  onEdit: (expense: ExpenseResponse) => void;
}

export function PartyExpensesList({ partyId, onEdit }: PartyExpensesListProps) {
  const { data: expenses } = usePartyExpenses(partyId);
  const { data: balanceData } = usePartyBalances(partyId);
  const deleteMutation = useDeleteExpense();

  const getMemberName = (id: string) => balanceData?.balances?.find((m) => m.membershipId === id)?.alias || "Alguém";

  const handleDelete = (expenseId: string) => {
    modals.openConfirmModal({
      title: "Apagar registro",
      children: <Text size="sm">Tem certeza que deseja excluir este registro? O saldo de todos será recalculado.</Text>,
      labels: { confirm: "Apagar", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteMutation.mutate({ partyId, expenseId }),
    });
  };

  if (!expenses?.length)
    return (
      <Text c="dimmed" size="sm">
        Nenhuma despesa registrada ainda.
      </Text>
    );

  return (
    <Stack gap="sm">
      {expenses.map((expense) => (
        <Card key={expense.id} withBorder p="sm" radius="md">
          <Group justify="space-between" wrap="nowrap">
            <div>
              <Group gap="xs">
                <Text fw={600}>{expense.description}</Text>
                {expense.type === "TRANSFER" && (
                  <Badge size="xs" color="blue">
                    Pagamento
                  </Badge>
                )}
              </Group>
              <Text size="xs" c="dimmed">
                Pago por {getMemberName(expense.payerId!)} • {new Date(expense.date!).toLocaleDateString()}
              </Text>
            </div>
            <Group gap="xs">
              <Text fw={700}>R$ {expense.amount?.toFixed(2)}</Text>
              <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(expense)}>
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(expense.id!)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
