import { useUserParties } from "@/hooks/useParties";
import { type PartyResponse } from "@/models/Schemas";
import { Alert, Badge, Button, Card, Container, Group, Loader, SimpleGrid, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CreatePartyDrawer } from "./CreatePartyDrawer";

interface PartyListViewProps {
  onSelectParty: (id: string) => void;
}

export function PartyListView({ onSelectParty }: PartyListViewProps) {
  const { data: parties, isLoading, error } = useUserParties();
  const [modalOpened, { open, close }] = useDisclosure(false);

  if (isLoading) return <Loader mt="xl" mx="auto" display="block" />;
  if (error) return <Alert color="red">Erro ao carregar seus grupos.</Alert>;

  return (
    <Container py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Meus Grupos</Title>
        <Button onClick={open}>Cadastrar Grupo</Button>
      </Group>

      <CreatePartyDrawer opened={modalOpened} onClose={close} />

      {parties?.length === 0 ? (
        <Text c="dimmed" ta="center" mt="xl">
          Você ainda não faz parte de nenhum grupo.
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {parties?.map((party: PartyResponse) => {
            const myBalance = party.myBalance ?? 0;
            const isDebtor = myBalance < 0;
            const hasNoBalance = myBalance === 0;

            return (
              <Card
                key={party.id}
                shadow="sm"
                p="lg"
                radius="md"
                withBorder
                style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
                onClick={() => party.id && onSelectParty(party.id)}
              >
                <div style={{ flex: 1 }}>
                  <Group justify="space-between" align="start" mb="xs">
                    <Text fw={600} size="lg" style={{ flex: 1 }}>
                      {party.name}
                    </Text>
                    <Badge variant="light" color={hasNoBalance ? "gray" : isDebtor ? "red" : "green"} size="lg">
                      {hasNoBalance
                        ? "Quitado"
                        : `${isDebtor ? "-" : "+"} ${party.currencyCode} ${Math.abs(myBalance).toFixed(2)}`}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    {party.description || "Sem descrição"}
                  </Text>
                </div>

                <Group
                  justify="space-between"
                  mt="auto"
                  pt="sm"
                  style={{ borderTop: "1px solid var(--mantine-color-dark-4)" }}
                >
                  <Text size="xs" bg="dark.4" px="xs" py={4} style={{ borderRadius: 4 }}>
                    {party.code}
                  </Text>
                  <Text size="xs" c="blue" fw={500}>
                    Acessar grupo →
                  </Text>
                </Group>
              </Card>
            );
          })}
        </SimpleGrid>
      )}
    </Container>
  );
}
