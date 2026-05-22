import { BottomDrawer } from "@/components/ui/BottomDrawer";
import { useCreateExpense, useDeleteExpense } from "@/hooks/useExpenses";
import { usePartyBalances } from "@/hooks/useParties";
import { type ExpenseRequest, type ExpenseResponse } from "@/models/Schemas";
import {
  ActionIcon,
  Button,
  Group,
  MultiSelect,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";

interface ExpenseDrawerProps {
  partyId: string;
  opened: boolean;
  onClose: () => void;
  expenseToEdit?: ExpenseResponse | null;
}

interface ExpenseFormValues {
  type: "PURCHASE" | "TRANSFER";
  description: string;
  amount: number | "";
  date: Date;
  payerId: string;
  selectedDebtors: string[];
}

export function ExpenseDrawer({ partyId, opened, onClose, expenseToEdit }: ExpenseDrawerProps) {
  const { data: balanceData } = usePartyBalances(partyId);
  const createMutation = useCreateExpense();
  const deleteMutation = useDeleteExpense();

  const members = balanceData?.balances ?? [];
  const myMemberId = members[0]?.membershipId ?? "";

  const form = useForm<ExpenseFormValues>({
    initialValues: {
      type: "PURCHASE",
      description: "",
      amount: "",
      date: new Date(),
      payerId: myMemberId,
      selectedDebtors: [myMemberId],
    },
  });

  useEffect(() => {
    if (expenseToEdit && opened) {
      form.setValues({
        type: expenseToEdit.type || "PURCHASE",
        description: expenseToEdit.description || "",
        amount: expenseToEdit.amount || "",
        date: expenseToEdit.date ? new Date(expenseToEdit.date) : new Date(),
        payerId: expenseToEdit.payerId || myMemberId,
        selectedDebtors: expenseToEdit.splits?.map((s) => s.debtorId!) || [],
      });
    } else if (opened) {
      form.reset();
      form.setValues({
        type: "PURCHASE",
        description: "",
        amount: "",
        date: new Date(),
        payerId: myMemberId,
        selectedDebtors: [myMemberId],
      });
    }
  }, [expenseToEdit, opened, myMemberId]);

  const memberOptions = members.map((m) => ({
    value: m.membershipId!,
    label: m.alias || "Desconhecido",
  }));

  const handleDeleteAction = () => {
    if (!expenseToEdit?.id) return;

    modals.openConfirmModal({
      title: "Apagar registro",
      children: <Text size="sm">Tem certeza que deseja excluir este registro? O saldo de todos será recalculado.</Text>,
      labels: { confirm: "Apagar", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync({ partyId, expenseId: expenseToEdit.id! });
          onClose();
        } catch (error) {
          console.error("Erro ao remover despesa", error);
        }
      },
    });
  };

  const handleSubmit = async (values: ExpenseFormValues) => {
    if (!values.amount || values.amount <= 0) return form.setFieldError("amount", "Valor inválido");
    if (values.selectedDebtors.length === 0) return form.setFieldError("selectedDebtors", "Selecione um participante");

    const splitAmount = values.amount / values.selectedDebtors.length;
    const splits = values.selectedDebtors.map((debtorId) => ({
      debtorId,
      amount: splitAmount,
    }));

    const dateWithoutSeconds = new Date(values.date);
    dateWithoutSeconds.setSeconds(0, 0);

    const payload: ExpenseRequest = {
      description: values.description || (values.type === "TRANSFER" ? "Pagamento" : "Despesa"),
      amount: values.amount,
      date: dateWithoutSeconds.toISOString(),
      payerId: values.payerId,
      type: values.type,
      splits,
    };

    try {
      if (expenseToEdit?.id) {
        await deleteMutation.mutateAsync({ partyId, expenseId: expenseToEdit.id });
      }
      await createMutation.mutateAsync({ partyId, data: payload });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const isTransfer = form.values.type === "TRANSFER";
  const isPending = createMutation.isPending || deleteMutation.isPending;
  const isEditing = !!expenseToEdit;

  return (
    <BottomDrawer opened={opened} onClose={onClose} title={isEditing ? "Editar Registro" : "Novo Registro"}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md" pb="xl">
          <SegmentedControl
            data={[
              { label: "Despesa", value: "PURCHASE" },
              { label: "Pagamento", value: "TRANSFER" },
            ]}
            {...form.getInputProps("type")}
            disabled={isEditing}
            onChange={(val) => {
              form.setFieldValue("type", val as "PURCHASE" | "TRANSFER");
              if (val === "TRANSFER") form.setFieldValue("selectedDebtors", []);
            }}
          />

          <NumberInput
            label="Valor"
            placeholder="0.00"
            min={0.01}
            decimalScale={2}
            required
            {...form.getInputProps("amount")}
          />
          <TextInput
            label="Descrição"
            placeholder={isTransfer ? "Ex: Reembolso" : "Ex: Mercado"}
            {...form.getInputProps("description")}
          />

          <DateTimePicker
            label="Data e Hora"
            placeholder="Selecione a data"
            required
            valueFormat="DD/MM/YYYY HH:mm"
            {...form.getInputProps("date")}
          />

          <Select label="Quem pagou?" data={memberOptions} required searchable {...form.getInputProps("payerId")} />

          {isTransfer ? (
            <Select
              label="Para quem?"
              data={memberOptions}
              required
              searchable
              {...form.getInputProps("selectedDebtors")}
              onChange={(val) => form.setFieldValue("selectedDebtors", val ? [val] : [])}
              value={form.values.selectedDebtors[0] || null}
            />
          ) : (
            <MultiSelect
              label="Dividir com quem?"
              data={memberOptions}
              required
              searchable
              {...form.getInputProps("selectedDebtors")}
            />
          )}

          <Group justify="space-between" mt="lg" wrap="nowrap">
            {isEditing ? (
              <ActionIcon
                variant="filled"
                color="red"
                size="lg"
                onClick={handleDeleteAction}
                loading={deleteMutation.isPending}
              >
                <IconTrash size={18} />
              </ActionIcon>
            ) : (
              <div />
            )}
            <Group gap="sm" justify="end">
              <Button variant="subtle" color="gray" onClick={onClose} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" loading={isPending}>
                Salvar
              </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </BottomDrawer>
  );
}
