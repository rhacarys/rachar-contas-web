import { PartyDetailsView } from "@/components/party/PartyDetailsView";
import { PartyListView } from "@/components/party/PartyListView";
import { useAuthStore } from "@/store/useAuthStore";
import { usePartyStore } from "@/store/usePartyStore";
import { AppShell, Burger, Button, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export function Home() {
  const logout = useAuthStore((state) => state.logout);
  const { activePartyId, setActivePartyId } = usePartyStore();
  const [opened, { toggle }] = useDisclosure();

  const handleLogout = () => {
    setActivePartyId(null);
    logout();
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3} style={{ cursor: "pointer" }} onClick={() => setActivePartyId(null)}>
            Rachar Contas
          </Title>
          <Button color="red" variant="subtle" onClick={handleLogout}>
            Sair
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main bg="gray.0" style={{ minHeight: "100vh" }}>
        {activePartyId ? (
          <PartyDetailsView partyId={activePartyId} onBack={() => setActivePartyId(null)} />
        ) : (
          <PartyListView onSelectParty={(id) => setActivePartyId(id)} />
        )}
      </AppShell.Main>
    </AppShell>
  );
}
