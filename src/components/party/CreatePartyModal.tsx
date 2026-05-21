import { useCreateParty } from "@/hooks/useCreateParty";
import { PartyRequestSchema, type PartyRequest } from "@/models/Schemas";
import { Button, Group, Modal, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";

interface CreatePartyModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreatePartyModal({ opened, onClose }: CreatePartyModalProps) {
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

  const handleSubmit = (values: PartyRequest) => {
    mutate(values);
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Criar Novo Grupo" centered size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Nome do Grupo"
            placeholder="Ex: Viagem de Férias, Divisão do Aluguel"
            required
            {...form.getInputProps("name")}
          />

          <Textarea
            label="Descrição"
            placeholder="Opcional. Adicione detalhes sobre as despesas deste grupo."
            rows={3}
            {...form.getInputProps("description")}
          />

          <TextInput
            label="Código da Moeda (ISO)"
            placeholder="Ex: BRL, USD, THB"
            required
            maxLength={3}
            styles={{ input: { textTransform: "uppercase" } }}
            {...form.getInputProps("currencyCode")}
          />

          <Group justify="end" mt="lg">
            <Button variant="subtle" color="gray" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              Criar Grupo
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
