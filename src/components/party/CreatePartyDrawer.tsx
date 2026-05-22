import { BottomDrawer } from "@/components/ui/BottomDrawer";
import { useCreateParty } from "@/hooks/useCreateParty";
import { useAvailableCurrencies } from "@/hooks/useParties";
import { PartyRequestSchema, type PartyRequest } from "@/models/Schemas";
import { Button, Group, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEffect } from "react";

interface CreatePartyDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function CreatePartyDrawer({ opened, onClose }: CreatePartyDrawerProps) {
  const { data: currencies, isLoading: isLoadingCurrencies } = useAvailableCurrencies();

  const form = useForm<PartyRequest>({
    validate: zodResolver(PartyRequestSchema),
    initialValues: {
      name: "",
      description: "",
      currencyCode: "BRL",
    },
  });

  const { mutate, isPending } = useCreateParty(() => {
    form.reset();
    onClose();
  });

  useEffect(() => {
    if (currencies) {
      const hasBrl = currencies.some((c) => c.code === "BRL");
      if (hasBrl) form.setFieldValue("currencyCode", "BRL");
    }
  }, [currencies]);

  const selectData =
    currencies?.map((currency) => ({
      value: currency.code,
      label: `${currency.name} (${currency.code})`,
    })) ?? [];

  return (
    <BottomDrawer opened={opened} onClose={onClose} title="Criar Novo Grupo">
      <form onSubmit={form.onSubmit((values) => mutate(values))}>
        <Stack gap="md" pb="xl">
          <TextInput
            label="Nome do Grupo"
            placeholder="Ex: Viagem de Férias"
            required
            {...form.getInputProps("name")}
          />
          <Textarea label="Descrição" placeholder="Opcional." rows={3} {...form.getInputProps("description")} />
          <Select
            label="Moeda Padrão"
            placeholder={isLoadingCurrencies ? "Carregando..." : "Selecione a moeda"}
            data={selectData}
            disabled={isLoadingCurrencies}
            required
            allowDeselect={false}
            {...form.getInputProps("currencyCode")}
          />
          <Group justify="end" mt="lg">
            <Button variant="subtle" color="gray" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending || isLoadingCurrencies}>
              Criar Grupo
            </Button>
          </Group>
        </Stack>
      </form>
    </BottomDrawer>
  );
}
