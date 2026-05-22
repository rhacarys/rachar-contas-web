import { usePartyExpenses } from "@/hooks/useExpenses";
import { usePartyBalances } from "@/hooks/useParties";
import { type ExpenseResponse } from "@/models/Schemas";
import { Badge, Card, Group, Stack, Text } from "@mantine/core";

interface PartyExpensesListProps {
  partyId: string;
  onEdit: (expense: ExpenseResponse) => void;
}

export function PartyExpensesList({ partyId, onEdit }: PartyExpensesListProps) {
  const { data: expenses } = usePartyExpenses(partyId);
  const { data: balanceData } = usePartyBalances(partyId);

  const getMemberName = (id: string) => balanceData?.balances?.find((m) => m.membershipId === id)?.alias || "Alguém";

  if (!expenses?.length) {
    return (
      <Text c="dimmed" size="sm">
        Nenhuma despesa registrada ainda.
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      {expenses.map((expense) => (
        <Card
          key={expense.id}
          withBorder
          p="sm"
          radius="md"
          onClick={() => onEdit(expense)}
          style={{ cursor: "pointer" }}
          styles={{
            root: {
              transition: "transform 150ms ease, box-shadow 150ms ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "var(--mantine-shadow-sm)",
              },
            },
          }}
        >
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
            </Group>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
