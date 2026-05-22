import { api } from "@/api/client";
import { BottomDrawer } from "@/components/ui/BottomDrawer";
import { useAvailableCurrencies } from "@/hooks/useParties";
import { PartyRequestSchema, type PartyRequest, type PartyResponse } from "@/models/Schemas";
import { Button, Group, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm as useMantineForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";

interface EditPartyDrawerProps {
  party: PartyResponse;
  opened: boolean;
  onClose: () => void;
}

export function EditPartyDrawer({ party, opened, onClose }: EditPartyDrawerProps) {
  const queryClient = useQueryClient();
  const { data: currencies, isLoading: isLoadingCurrencies } = useAvailableCurrencies();

  const form = useMantineForm<PartyRequest>({
    validate: zodResolver(PartyRequestSchema),
    initialValues: {
      name: party.name || "",
      description: party.description || "",
      currencyCode: party.currencyCode || "BRL",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PartyRequest) => {
      const response = await api.put<PartyResponse>(`/parties/${party.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      onClose();
    },
  });

  const selectData =
    currencies?.map((c) => ({
      value: c.code,
      label: `${c.name} (${c.code})`,
    })) ?? [];

  return (
    <BottomDrawer opened={opened} onClose={onClose} title="Configurações do Grupo">
      <form onSubmit={form.onSubmit((values) => updateMutation.mutate(values))}>
        <Stack gap="md" pb="xl">
          <TextInput label="Nome do Grupo" required {...form.getInputProps("name")} />
          <Textarea label="Descrição" rows={3} {...form.getInputProps("description")} />
          <Select
            label="Moeda Padrão"
            data={selectData}
            disabled={isLoadingCurrencies}
            required
            allowDeselect={false}
            {...form.getInputProps("currencyCode")}
          />

          <Group justify="end" mt="lg">
            <Button variant="subtle" color="gray" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={updateMutation.isPending}>
              Salvar Alterações
            </Button>
          </Group>
        </Stack>
      </form>
    </BottomDrawer>
  );
}
