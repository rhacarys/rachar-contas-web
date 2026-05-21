import { useCreateParty } from "@/hooks/useCreateParty";
import { useAvailableCurrencies } from "@/hooks/useParties";
import { PartyRequestSchema, type PartyRequest } from "@/models/Schemas";
import { Button, Drawer, Group, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";

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

  const selectData =
    currencies?.map((currency) => ({
      value: currency.code,
      label: `${currency.name} (${currency.code})`,
    })) ?? [];

  const handleSubmit = (values: PartyRequest) => {
    mutate(values);
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Criar Novo Grupo" position="bottom" size="auto" radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md" pb="xl">
          <TextInput
            label="Nome do Grupo"
            placeholder="Ex: Viagem de Férias, Almoços do Trabalho"
            required
            {...form.getInputProps("name")}
          />

          <Textarea
            label="Descrição"
            placeholder="Opcional. Adicione detalhes sobre as despesas divididas."
            rows={3}
            {...form.getInputProps("description")}
          />

          <Select
            label="Moeda Padrão"
            placeholder={isLoadingCurrencies ? "Carregando moedas..." : "Selecione a moeda do grupo"}
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
    </Drawer>
  );
}
