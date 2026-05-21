import { usePartyBalances, useUserParties } from "@/hooks/useParties";
import { Alert, Button, Card, Container, Group, Loader, Stack, Text, Title } from "@mantine/core";

interface PartyDetailsViewProps {
  partyId: string;
  onBack: () => void;
}

export function PartyDetailsView({ partyId, onBack }: PartyDetailsViewProps) {
  const { data: parties } = useUserParties();
  const { data: balanceData, isLoading, error } = usePartyBalances(partyId);

  const currentParty = parties?.find((p) => p.id === partyId);

  if (isLoading) return <Loader mt="xl" mx="auto" display="block" />;
  if (error) return <Alert color="red">Erro ao carregar saldos do grupo.</Alert>;

  return (
    <Container py="xl">
      <Group justify="space-between" mb="xl">
        <Stack gap={4}>
          <Title order={2}>{currentParty?.name || "Grupo"}</Title>
          <Text size="sm" c="dimmed">
            Moeda padrão: {currentParty?.currencyCode}
          </Text>
        </Stack>
        <Button variant="default" onClick={onBack}>
          Alternar de Grupo
        </Button>
      </Group>

      <Title order={4} mb="md">
        Saldos dos Membros
      </Title>
      <Stack gap="sm">
        {balanceData?.balances?.map((member) => {
          const isDebtor = (member.balance ?? 0) < 0;
          return (
            <Card key={member.membershipId} withBorder p="sm" radius="md">
              <Group justify="space-between">
                <Text fw={500}>{member.alias}</Text>
                <Text fw={700} c={isDebtor ? "red" : "green"}>
                  {isDebtor
                    ? `Deve pagar: R$ ${Math.abs(member.balance ?? 0).toFixed(2)}`
                    : `A receber: R$ ${(member.balance ?? 0).toFixed(2)}`}
                </Text>
              </Group>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}
